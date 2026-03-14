import logging
from typing import List

from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig

from app.graph.state import GraphState
from app.graph.utils import collect_user_text, format_card_summary
from app.rag.structured_cards import get_knowledge_snapshot

logger = logging.getLogger(__name__)


async def knowledge_retrieval_node(state: GraphState, config: RunnableConfig) -> GraphState:
    if not state.get("should_fetch_structured_knowledge"):
        return state

    user_text = collect_user_text(state["messages"])
    if not user_text:
        logger.debug("Knowledge node skip: no user text")
        return state

    try:
        cards = get_knowledge_snapshot(user_text, top_n=3)
        if not cards:
            logger.debug("Knowledge node found no cards for query")
            return state

        summaries: List[str] = []
        context_messages = state.setdefault("context_messages", [])
        for card in cards:
            payload = card.get("payload", {})
            summary = format_card_summary(payload)
            context_messages.append(SystemMessage(content=summary))
            summaries.append(summary)

        state["structured_cards_context"] = summaries
    except Exception as exc:
        logger.warning("Knowledge node failed: %s", exc)
    return state
