from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage

from app.graph.state import GraphState
from app.llm.fallback_chain import stream_with_fallback
from app.graph.nodes.pricer import PRICER_TOOLS
from app.graph.nodes.market_context import market_context_node
from app.graph.nodes.vol_surface import vol_surface_node
from app.graph.nodes.macro_context import macro_context_node
from app.graph.nodes.knowledge_retrieval import knowledge_retrieval_node
from app.graph.utils import (
    collect_user_text,
    extract_ticker_from_text,
    should_call_pricer,
    should_fetch_market_data,
    should_fetch_macro_data,
    should_fetch_structured_knowledge,
)

import logging

logger = logging.getLogger(__name__)


async def route_intent(state: GraphState) -> GraphState:
    """Classifies intent and decides which helpers to activate."""
    logger.info("Routing user intent...")
    user_text = collect_user_text(state["messages"])

    state["current_intent"] = "tutor"
    state["market_ticker"] = extract_ticker_from_text(user_text)
    state["should_use_market_data"] = should_fetch_market_data(user_text)
    state["should_fetch_macro_data"] = should_fetch_macro_data(user_text)
    state["should_call_pricer"] = should_call_pricer(user_text)
    state["should_fetch_structured_knowledge"] = should_fetch_structured_knowledge(user_text)
    return state


async def tutor_node(state: GraphState, config: RunnableConfig) -> GraphState:
    """Pedagogical agent that adapts explanations and calls tools when needed."""
    weak_str = ", ".join(state.get("weak_modules", [])) if state.get("weak_modules") else "Aucune faiblesse spécifique identifiée."
    context_messages = state.get("context_messages", [])

    system_prompt = f"""Tu es StructLab Copilot, le tuteur ultime en finance de marché spécialisé en dérivés Equity.
    Tu t'adresses à un apprenant. Voici ses lacunes actuelles basées sur ses scores d'exercices : {weak_str}.
    Adapte tes explications pédagogiques pour l'aider à s'améliorer sur ces points si la question s'y prête.
    Reste toujours professionnel, direct, et mathématiquement précis. \nParle en français de base, mais utilise le jargon anglais (Strike, Spot, Payoff)."""

    # Include contextual snippets fetched earlier so the LLM has the latest market view.
    messages = [SystemMessage(content=system_prompt)] + context_messages + state["messages"]

    tools = PRICER_TOOLS if state.get("should_call_pricer") else None
    if tools:
        logger.info("Tutor node will bind pricer tools")
    else:
        logger.info("Tutor node running conversational path without pricer tools")

    response_msg = None
    async for chunk in stream_with_fallback(messages, tools=tools, config=config):
        if response_msg is None:
            response_msg = chunk
        else:
            response_msg += chunk

    state["messages"].append(response_msg)
    return state


def define_graph():
    """Compiles the LangGraph workflow with enriched routing nodes."""
    workflow = StateGraph(GraphState)

    workflow.add_node("router", route_intent)
    workflow.add_node("market_context", market_context_node)
    workflow.add_node("vol_surface", vol_surface_node)
    workflow.add_node("macro_context", macro_context_node)
    workflow.add_node("knowledge", knowledge_retrieval_node)
    workflow.add_node("tutor", tutor_node)

    tool_node = ToolNode(PRICER_TOOLS)
    workflow.add_node("tools", tool_node)

    workflow.add_edge(START, "router")

    def route_condition(state: GraphState):
        if state.get("should_use_market_data"):
            return "market_context"
        if state.get("should_fetch_macro_data"):
            return "macro_context"
        return "tutor"

    workflow.add_conditional_edges(
        "router",
        route_condition,
        {"market_context": "market_context", "macro_context": "macro_context", "tutor": "tutor"},
    )
    workflow.add_edge("market_context", "vol_surface")
    workflow.add_edge("vol_surface", "macro_context")
    workflow.add_edge("macro_context", "knowledge")
    workflow.add_edge("knowledge", "tutor")

    def should_continue(state: GraphState):
        messages = state["messages"]
        if not messages:
            return END
        last_message = messages[-1]
        if getattr(last_message, "tool_calls", None):
            return "tools"
        return END

    workflow.add_conditional_edges("tutor", should_continue, {"tools": "tools", END: END})
    workflow.add_edge("tools", "tutor")

    return workflow.compile()
