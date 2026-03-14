import logging
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded, _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.config import ALLOWED_ORIGINS, ENVIRONMENT, FRONTEND_IP_ALLOWLIST
from app.graph.graph import define_graph
from app.graph.state import GraphState
from app.graph.nodes.pricer import (
    calculate_implied_volatility,
    price_autocall,
    price_barrier,
    price_european,
)
from app.market_data.yfinance_provider import fetch_vol_surface
from app.security.auth import verify_supabase_jwt
from app.security.prompt_guard import sanitize_user_input, SecurityException

PRICER_FUNCTIONS = {
    "price_european": price_european,
    "calculate_implied_volatility": calculate_implied_volatility,
    "price_barrier": price_barrier,
    "price_autocall": price_autocall,
}

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="StructLab Mega-Copilot Orchestrator")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def ip_allowlist_middleware(request: Request, call_next):
    if ENVIRONMENT == "production" and FRONTEND_IP_ALLOWLIST:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            remote = forwarded.split(",")[0].strip()
        else:
            remote = request.client.host if request.client else ""

        if remote and remote not in FRONTEND_IP_ALLOWLIST:
            raise HTTPException(status_code=403, detail="IP address is not allowed.")
    return await call_next(request)

# Instantiate the compiled LangGraph
graph = define_graph()

class ChatRequest(BaseModel):
    user_id: str
    messages: List[Dict[str, str]] # [{'role': 'user', 'content': 'hello'}, ...]
    weak_modules: Optional[List[str]] = []

class PricerRequest(BaseModel):
    tool: str = "price_european"
    inputs: Dict[str, Any] = {}
    
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "structlab-orchestrator"}

@app.post("/stream")
@limiter.limit("10/minute")
async def stream_chat(
    req: ChatRequest,
    _user = Depends(verify_supabase_jwt),
):
    """
    The main SSE endpoint. 
    It sanitizes input, processes via LangGraph (optionally), and streams back LLM tokens.
    """
    logger.info(f"Received stream request for user {req.user_id}")
    
    # 1. Convert dict messages to LangChain Message objects
    lc_messages = []
    for m in req.messages:
        try:
            safe_content = sanitize_user_input(m.get("content", ""))
            role = m.get("role", "user")
            if role == "user":
                lc_messages.append(HumanMessage(content=safe_content))
            elif role == "assistant":
                lc_messages.append(AIMessage(content=safe_content))
        except SecurityException as e:
            logger.error(f"Security blocked message: {str(e)}")
            raise HTTPException(status_code=400, detail="Security violation in input.")

    # 2. Build Initial State
    state = GraphState(
        messages=lc_messages,
        context_messages=[],
        user_id=req.user_id,
        weak_modules=req.weak_modules,
        current_intent="",
        iteration_count=0,
        market_ticker="",
        market_context={},
        vol_surface={},
        vol_surface_plot={},
        macro_context={},
        structured_cards_context=[],
        should_use_market_data=False,
        should_build_vol_surface=False,
        should_call_pricer=False,
        should_fetch_macro_data=False,
        should_fetch_structured_knowledge=False,
    )
    
    # 3. Stream Generator
    async def event_generator():
        try:
            # Use native astream with stream_mode="messages" to cleanly capture tokens
            async for chunk, metadata in graph.astream(state, stream_mode="messages"):
                # metadata tells us which node generated it
                if metadata.get("langgraph_node") == "tutor":
                    # If the chunk has text content, stream it
                    if isinstance(chunk.content, str) and chunk.content:
                        content = chunk.content.replace("\n", "\\n")
                        yield f"data: {content}\n\n"
                        
                elif metadata.get("langgraph_node") == "tools":
                    # When the tools node is active, we could stream a message
                    pass # Tools node doesn't yield messages directly in stream_mode=messages usually, or if it does, it's the ToolMessage.
                        
            # Terminate stream cleanly
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            logger.error(f"Stream generation failed: {str(e)}")
        yield f"data: [ERROR] Service temporairement indisponible.\n\n"

    # 4. Return SSE Response
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/analysis/vol-surface")
async def vol_surface_analysis(
    symbol: str,
    _ = Depends(verify_supabase_jwt)
) -> Dict[str, Any]:
    try:
        payload = await fetch_vol_surface(symbol.upper())
        return payload
    except Exception as exc:
        logger.error("Vol surface endpoint failed: %s", exc)
        raise HTTPException(status_code=500, detail="Impossible de récupérer la surface de volatilité.")


@app.post("/pricer")
@limiter.limit("5/minute")
async def pricer_tool(
    req: PricerRequest,
    _ = Depends(verify_supabase_jwt),
) -> Dict[str, Any]:
    tool_name = req.tool.lower()
    tool_fn = PRICER_FUNCTIONS.get(tool_name)
    if not tool_fn:
        raise HTTPException(status_code=400, detail=f"Unknown pricer tool '{req.tool}'.")

    try:
        result = tool_fn(**req.inputs)
    except TypeError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid parameters: {exc}")

    return {"tool": tool_name, "result": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
