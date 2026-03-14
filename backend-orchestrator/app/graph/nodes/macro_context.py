import logging

from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig

from app.graph.state import GraphState
from app.graph.utils import format_macro_summary
from app.market_data.fred_provider import fetch_fred_yields

logger = logging.getLogger(__name__)


async def macro_context_node(state: GraphState, config: RunnableConfig) -> GraphState:
    if not state.get("should_fetch_macro_data"):
        return state

    try:
        yields = await fetch_fred_yields()
        state["macro_context"] = yields
        summary = format_macro_summary(yields)
        if summary:
            context_messages = state.setdefault("context_messages", [])
            context_messages.append(SystemMessage(content=summary))
    except Exception as exc:
        logger.warning("Failed to fetch macro context: %s", exc)
        state["macro_context"] = {"error": str(exc)}

    return state
