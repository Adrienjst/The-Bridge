import logging

from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig

from app.graph.state import GraphState
from app.graph.utils import format_vol_surface_summary
from app.market_data.yfinance_provider import fetch_vol_surface

logger = logging.getLogger(__name__)


async def vol_surface_node(state: GraphState, config: RunnableConfig) -> GraphState:
    if not state.get("should_build_vol_surface"):
        return state

    ticker = state.get("market_ticker")
    if not ticker:
        return state

    try:
        surface = await fetch_vol_surface(ticker, state.get("market_context"))
        state["vol_surface"] = surface
        state["vol_surface_plot"] = surface.get("plot", {})
        summary = format_vol_surface_summary(ticker, surface)
        if summary:
            context_messages = state.setdefault("context_messages", [])
            context_messages.append(SystemMessage(content=summary))
    except Exception as exc:
        logger.warning("Failed to fetch vol surface for %s: %s", ticker, exc)
        state["vol_surface"] = {"error": str(exc)}

    return state
