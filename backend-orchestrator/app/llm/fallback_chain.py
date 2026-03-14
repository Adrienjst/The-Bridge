import asyncio
import logging
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage
from typing import List
import pprint

from app.config import GROQ_API_KEY, GOOGLE_API_KEY

logger = logging.getLogger(__name__)

# Primary LLM: Llama 3 on Groq (Ultra-fast, Free tier)
GROQ_LLM = ChatGroq(
    api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile", 
    temperature=0.2,
    max_tokens=2048
) if GROQ_API_KEY else None

# Fallback LLM: Gemini 1.5 Flash on Google AI Studio (Fast, Free tier)
GEMINI_LLM = ChatGoogleGenerativeAI(
    google_api_key=GOOGLE_API_KEY,
    model="gemini-1.5-flash", 
    temperature=0.2,
    max_output_tokens=2048
) if GOOGLE_API_KEY else None

LLM_CASCADE = []
if GROQ_LLM: LLM_CASCADE.append({"name": "Groq Llama 3", "llm": GROQ_LLM, "timeout": 10})
if GEMINI_LLM: LLM_CASCADE.append({"name": "Gemini 1.5 Flash", "llm": GEMINI_LLM, "timeout": 15})

async def invoke_with_fallback(messages: List[BaseMessage], tools: List = None, config=None, **kwargs):
    """
    Invokes LLMs in order of preference. 
    If Groq fails (rate limit, timeout), cascades instantly to Gemini.
    """
    if not LLM_CASCADE:
        raise RuntimeError("No LLM API keys provided. Please set GROQ_API_KEY or GOOGLE_AI_API_KEY.")
        
    for llm_config in LLM_CASCADE:
        try:
            logger.info(f"Attempting inference with {llm_config['name']}...")
            llm = llm_config["llm"]
            if tools:
                llm = llm.bind_tools(tools)
            
            # Using ainvoke for asyncio native call with wait_for for Python 3.9 support
            response = await asyncio.wait_for(llm.ainvoke(messages, config=config), timeout=llm_config["timeout"])
            return response
        except asyncio.TimeoutError:
            logger.warning(f"{llm_config['name']} timed out. Cascading...")
            continue
        except Exception as e:
            logger.error(f"{llm_config['name']} failed with error: {str(e)}. Cascading...")
            continue
            
    raise RuntimeError("All LLM providers in the cascade failed or timed out.")

# Streaming equivalent for the final executor node
async def stream_with_fallback(messages: List[BaseMessage], tools: List = None, config=None, **kwargs):
    if not LLM_CASCADE:
        raise RuntimeError("No LLM API keys provided.")
        
    for llm_config in LLM_CASCADE:
        try:
            logger.info(f"Attempting stream with {llm_config['name']}...")
            llm = llm_config["llm"]
            if tools:
                llm = llm.bind_tools(tools)
            # We don't apply extreme timeout to stream generation, only time-to-first-token practically
            # Using astream for native async streaming
            async for chunk in llm.astream(messages, config=config):
                yield chunk
            return # Successfully streamed, exit cascade
        except Exception as e:
            logger.error(f"Stream failed on {llm_config['name']}: {str(e)}. Cascading...")
            continue
            
    raise RuntimeError("All LLM streaming providers failed.")
