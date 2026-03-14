import logging

from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig

from app.graph.state import GraphState
from app.graph.utils import (
    collect_user_text,
    extract_ticker_from_text,
    format_market_context_summary,
    should_build_vol_surface,
)
from app.market_data.yfinance_provider import fetch_market_snapshot

logger = logging.getLogger(__name__)


async def market_context_node(state: GraphState, config: RunnableConfig) -> GraphState:
    user_text = collect_user_text(state["messages"])
    ticker = state.get("market_ticker") or extract_ticker_from_text(user_text)
    state["market_ticker"] = ticker

    try:
        snapshot = await fetch_market_snapshot(ticker)
        state["market_context"] = snapshot
        summary = format_market_context_summary(ticker, snapshot)
        if summary:
            context_messages = state.setdefault("context_messages", [])
            context_messages.append(SystemMessage(content=summary))
    except Exception as exc:
        logger.warning("Failed to fetch market snapshot for %s: %s", ticker, exc)
        state["market_context"] = {"error": str(exc)}

    state["should_build_vol_surface"] = should_build_vol_surface(user_text)
    return state
