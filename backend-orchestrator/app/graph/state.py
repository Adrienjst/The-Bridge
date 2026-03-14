from typing import Annotated, TypedDict, List, Dict, Any
from langchain_core.messages import BaseMessage
import operator

class GraphState(TypedDict):
    """
    State defining the LangGraph execution flow.
    """
    messages: Annotated[List[BaseMessage], operator.add]
    context_messages: Annotated[List[BaseMessage], operator.add]
    user_id: str
    weak_modules: List[str]  # Injected from Supabase progress
    current_intent: str      # e.g., 'tutor', 'calculator', 'general'
    iteration_count: int
    market_ticker: str
    market_context: Dict[str, Any]
    vol_surface: Dict[str, Any]
    vol_surface_plot: Dict[str, Any]
    macro_context: Dict[str, Any]
    structured_cards_context: List[str]
    should_use_market_data: bool
    should_build_vol_surface: bool
    should_call_pricer: bool
    should_fetch_macro_data: bool
    should_fetch_structured_knowledge: bool
