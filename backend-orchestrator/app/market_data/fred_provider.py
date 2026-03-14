import asyncio
import logging
from datetime import datetime, date, timedelta, timezone
from typing import Any, Dict, List, Optional

import requests

from app.config import FRED_API_KEY

logger = logging.getLogger(__name__)

BASE_URL = "https://api.stlouisfed.org/fred/series/observations"
SERIES_MAP = {
    "2Y": "GS2",
    "5Y": "GS5",
    "10Y": "GS10",
}


def _safe_float(value: Any) -> Optional[float]:
    if value in (None, "", "."):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _blocking_fetch_series(series_id: str, lookback_days: int) -> Optional[Dict[str, Any]]:
    if not FRED_API_KEY:
        raise RuntimeError("FRED_API_KEY is not configured. Please set it in your environment.")

    observation_start = (date.today() - timedelta(days=lookback_days)).isoformat()
    params = {
        "series_id": series_id,
        "api_key": FRED_API_KEY,
        "file_type": "json",
        "sort_order": "desc",
        "limit": 5,
        "observation_start": observation_start,
    }
    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        payload = response.json()
    except Exception as exc:
        logger.warning("Failed to fetch FRED series %s: %s", series_id, exc)
        return None
    observations = payload.get("observations", []) or []

    for obs in observations:
        value = _safe_float(obs.get("value"))
        if value is not None:
            return {
                "date": obs.get("date"),
                "value": value,
                "series_id": series_id,
            }
    return None


def _blocking_fetch_yields(lookback_days: int = 90) -> Dict[str, Any]:
    rates: List[Dict[str, Any]] = []
    for tenor, series_id in SERIES_MAP.items():
        try:
            observation = _blocking_fetch_series(series_id, lookback_days)
        except Exception as exc:
            continue
        if observation:
            observation["tenor"] = tenor
            rates.append(observation)

    return {
        "source": "fred",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "rates": rates,
    }


async def fetch_fred_yields(lookback_days: int = 90) -> Dict[str, Any]:
    return await asyncio.to_thread(_blocking_fetch_yields, lookback_days)
