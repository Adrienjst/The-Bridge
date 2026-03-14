import re
from typing import Any, Dict, Iterable, List, Optional

from langchain_core.messages import BaseMessage, HumanMessage

DEFAULT_TICKER = "SPY"
KNOWN_TICKERS = {
    "AAPL", "MSFT", "GOOG", "NVDA", "AMZN", "META", "TSLA", "IBM",
    "INTC", "XLF", "QQQ", "SPY", "DIA", "IWM", "BRK.A", "V", "MA",
}
COMMON_NON_TICKERS = {"EUR", "USD", "API", "PDF", "PR"}
MARKET_KEYWORDS = [
    "prix", "price", "spot", "quote", "ticker", "market", "action", "valeur", "cours",
    "volatility", "volatil", "implied", "iv", "data", "cotation",
]
VOL_KEYWORDS = ["vol", "volatility", "surface", "implied", "iv", "volatil"]
PRICER_KEYWORDS = [
    "prix", "price", "delta", "gamma", "vega", "rho", "theta", "barrier",
    "autocall", "payoff", "coupon", "structure", "pnl",
]
KNOWLEDGE_KEYWORDS = [
    "structured", "autocall", "phoenix", "reverse", "shark", "fin", "barrier",
    "convertible", "coupon", "risk profile", "structured note", "product blueprint",
]
MACRO_KEYWORDS = [
    "yield", "curve", "treasury", "rate", "bond", "macro", "inflation", "risk-free", "rf",
]


def collect_user_text(messages: Iterable[BaseMessage]) -> str:
    pieces: List[str] = []
    for message in messages:
        if isinstance(message, HumanMessage) and getattr(message, "content", None):
            pieces.append(str(message.content))
    return " ".join(pieces).strip()


def extract_ticker_from_text(text: str) -> str:
    clean_text = (text or "").upper()
    if not clean_text:
        return DEFAULT_TICKER

    dollar_match = re.search(r"\$([A-Z0-9]{1,5})\b", clean_text)
    if dollar_match:
        return dollar_match.group(1)

    for ticker in KNOWN_TICKERS:
        if ticker in clean_text:
            return ticker

    candidates = re.findall(r"\b([A-Z]{2,5})\b", clean_text)
    for candidate in candidates:
        if candidate not in COMMON_NON_TICKERS:
            return candidate

    return DEFAULT_TICKER


def contains_keyword(text: str, keywords: Iterable[str]) -> bool:
    lower_text = (text or "").lower()
    return any(keyword in lower_text for keyword in keywords)


def should_fetch_market_data(text: str) -> bool:
    return contains_keyword(text, MARKET_KEYWORDS)


def should_build_vol_surface(text: str) -> bool:
    return contains_keyword(text, VOL_KEYWORDS)


def should_call_pricer(text: str) -> bool:
    return contains_keyword(text, PRICER_KEYWORDS)


def should_fetch_structured_knowledge(text: str) -> bool:
    return contains_keyword(text, KNOWLEDGE_KEYWORDS)


def should_fetch_macro_data(text: str) -> bool:
    return contains_keyword(text, MACRO_KEYWORDS)


def format_market_context_summary(symbol: str, snapshot: Dict[str, Any]) -> Optional[str]:
    price = snapshot.get("price")
    if price is None:
        return None
    parts: List[str] = [f"Contexte marché pour {symbol}".strip()]
    parts.append(
        f"Spot: {price:.2f} {snapshot.get('currency', 'USD')} (dernier cours {snapshot.get('previous_close') or 'N/A'})"
    )
    change = snapshot.get("change")
    change_pct = snapshot.get("change_pct")
    if change is not None and change_pct is not None:
        parts.append(f"Variation: {change:.2f} ({change_pct:.2f}%)")
    day_range = []
    if snapshot.get("day_high") is not None:
        day_range.append(f"High {snapshot['day_high']:.2f}")
    if snapshot.get("day_low") is not None:
        day_range.append(f"Low {snapshot['day_low']:.2f}")
    if day_range:
        parts.append(" — ".join(day_range))
    if snapshot.get("volume") is not None:
        parts.append(f"Volume: {snapshot['volume']:,}")
    return ". ".join(parts)


def format_vol_surface_summary(symbol: str, surface: Dict[str, Any]) -> Optional[str]:
    entries = surface.get("entries") or []
    if not entries:
        return None
    lines: List[str] = [f"Vol surface {symbol} — spot {surface.get('spot') or 'N/A'}"]
    for entry in entries:
        call_iv = entry.get("call_iv")
        put_iv = entry.get("put_iv")
        strike = entry.get("atm_strike")
        sub = [f"expiry {entry.get('expiration')}" ]
        if strike is not None:
            sub.append(f"ATM {strike:.2f}")
        if call_iv is not None:
            sub.append(f"call IV {call_iv:.1f}%")
        if put_iv is not None:
            sub.append(f"put IV {put_iv:.1f}%")
        lines.append(" — ".join(sub))
    return " | ".join(lines)


def format_macro_summary(macro: Dict[str, Any]) -> Optional[str]:
    rates = macro.get("rates") or []
    if not rates:
        return None
    lines: List[str] = [f"Yield curve FRED — dernière mise à jour {macro.get('timestamp', 'N/A')}"]
    for entry in rates:
        value = entry.get("value")
        date = entry.get("date") or "N/A"
        tenor = entry.get("tenor", "N/A")
        if value is None:
            continue
        lines.append(f"{tenor} {value:.2f}% ({date})")
    return " | ".join(lines)
