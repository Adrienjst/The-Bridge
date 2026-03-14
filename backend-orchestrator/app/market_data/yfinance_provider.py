import asyncio
import math
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Sequence

import yfinance as yf

DEFAULT_SOURCE = "yfinance"


def _safe_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    try:
        as_float = float(value)
        if math.isnan(as_float):
            return None
        return as_float
    except (TypeError, ValueError):
        return None


def _safe_int(value: Any) -> Optional[int]:
    if value is None:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _build_history_snapshot(ticker: yf.Ticker) -> Dict[str, Optional[float]]:
    try:
        hist = ticker.history(period="5d", interval="1d")
        if hist.empty:
            return {}
        last = hist.iloc[-1]
        prev = hist.iloc[-2] if len(hist) > 1 else last
        return {
            "close": _safe_float(last.get("Close")),
            "previous_close": _safe_float(prev.get("Close")),
            "open": _safe_float(last.get("Open")),
            "high": _safe_float(last.get("High")),
            "low": _safe_float(last.get("Low")),
        }
    except Exception:
        return {}


def _build_snapshot_payload(symbol: str, fast_info: Dict[str, Any], hist_snapshot: Dict[str, Optional[float]]) -> Dict[str, Any]:
    price = fast_info.get("lastPrice") or fast_info.get("last_price") or hist_snapshot.get("close")
    prev_close = fast_info.get("previousClose") or hist_snapshot.get("previous_close")
    change = _safe_float(price) - _safe_float(prev_close) if price is not None and prev_close is not None else None
    change_pct = (change / prev_close * 100) if change is not None and prev_close else None

    return {
        "symbol": symbol,
        "price": _safe_float(price),
        "previous_close": _safe_float(prev_close),
        "change": _safe_float(change),
        "change_pct": _safe_float(change_pct),
        "currency": fast_info.get("currency"),
        "open": fast_info.get("open") or hist_snapshot.get("open"),
        "day_high": fast_info.get("dayHigh") or hist_snapshot.get("high"),
        "day_low": fast_info.get("dayLow") or hist_snapshot.get("low"),
        "volume": _safe_int(fast_info.get("volume")),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": DEFAULT_SOURCE,
    }


def _pick_atm_row(chain_df: Sequence, spot: Optional[float]):
    if spot is None or not chain_df:
        return None
    best_row = None
    best_diff = float("inf")
    for row in chain_df:
        strike = _safe_float(row.get("strike"))
        if strike is None:
            continue
        diff = abs(strike - spot)
        if diff < best_diff:
            best_row = row
            best_diff = diff
    return best_row


def _extract_option_rows(df) -> Sequence[Dict[str, Any]]:
    try:
        return df.to_dict("records")
    except Exception:
        return []


def _parse_implied_vol(row: Dict[str, Any]) -> Optional[float]:
    if not row:
        return None
    iv = row.get("impliedVolatility")
    iv_value = _safe_float(iv)
    return round(iv_value * 100, 2) if iv_value is not None else None


def _build_mesh(rows: Sequence[Dict[str, Any]]) -> list[Dict[str, float]]:
    mesh = []
    for row in rows:
        strike = _safe_float(row.get("strike"))
        iv = _parse_implied_vol(row)
        if strike is None or iv is None:
            continue
        mesh.append({"strike": strike, "iv": iv})
    return mesh


def _build_plot_data(symbol: str, spot: Optional[float], entries: list[Dict[str, Any]]) -> Dict[str, Any]:
    strikes = []
    expirations: list[str] = []
    for entry in entries:
        expirations.append(entry.get("expiration", ""))
        for mesh in entry.get("call_mesh", []) + entry.get("put_mesh", []):
            if mesh.get("strike") is not None:
                strikes.append(mesh["strike"])

    unique_strikes = sorted(set(strikes))
    if spot is not None:
        unique_strikes = sorted(unique_strikes, key=lambda value: abs(value - spot))
    strikes = sorted(set(unique_strikes[:15]))

    call_matrix = []
    put_matrix = []
    for entry in entries:
        call_map = {row["strike"]: row["iv"] for row in entry.get("call_mesh", [])}
        put_map = {row["strike"]: row["iv"] for row in entry.get("put_mesh", [])}
        call_matrix.append([call_map.get(strike) for strike in strikes])
        put_matrix.append([put_map.get(strike) for strike in strikes])

    return {
        "symbol": symbol,
        "spot": spot,
        "expirations": expirations,
        "strikes": strikes,
        "call_iv_matrix": call_matrix,
        "put_iv_matrix": put_matrix,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def _build_expiration_entry(symbol: str, expiration: str, spot: Optional[float], calls, puts) -> Optional[Dict[str, Any]]:
    call_rows = _extract_option_rows(calls)
    put_rows = _extract_option_rows(puts)
    call_item = _pick_atm_row(call_rows, spot)
    put_item = _pick_atm_row(put_rows, spot)
    if call_item is None and put_item is None:
        return None

    entry: Dict[str, Any] = {
        "expiration": expiration,
        "atm_strike": _safe_float(call_item.get("strike") if call_item else put_item.get("strike")),
        "call_iv": _parse_implied_vol(call_item) if call_item else None,
        "put_iv": _parse_implied_vol(put_item) if put_item else None,
        "call_mesh": _build_mesh(call_rows),
        "put_mesh": _build_mesh(put_rows),
    }
    entry["source"] = DEFAULT_SOURCE
    return entry


def _blocking_fetch_vol_surface(symbol: str, snapshot: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    ticker = yf.Ticker(symbol)
    expirations = ticker.options if ticker.options else []
    spot = snapshot.get("price") if snapshot else None
    if spot is None:
        hist = ticker.history(period="1d", interval="1d")
        if not hist.empty:
            spot = _safe_float(hist.iloc[-1].get("Close"))

    surface_entries: list[Dict[str, Any]] = []
    for expiration in expirations[:2]:
        try:
            chain = ticker.option_chain(expiration)
        except Exception:
            continue
        entry = _build_expiration_entry(symbol, expiration, spot, chain.calls, chain.puts)
        if entry:
            surface_entries.append(entry)

    plot_data = _build_plot_data(symbol, spot, surface_entries)

    return {
        "symbol": symbol,
        "spot": _safe_float(spot),
        "entries": surface_entries,
        "plot": plot_data,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source": DEFAULT_SOURCE,
    }


def _blocking_fetch_market_snapshot(symbol: str) -> Dict[str, Any]:
    ticker = yf.Ticker(symbol)
    fast_info = getattr(ticker, "fast_info", {}) or {}
    hist_snapshot = _build_history_snapshot(ticker)
    return _build_snapshot_payload(symbol, fast_info, hist_snapshot)


async def fetch_market_snapshot(symbol: str) -> Dict[str, Any]:
    return await asyncio.to_thread(_blocking_fetch_market_snapshot, symbol)


async def fetch_vol_surface(symbol: str, snapshot: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    return await asyncio.to_thread(_blocking_fetch_vol_surface, symbol, snapshot)
