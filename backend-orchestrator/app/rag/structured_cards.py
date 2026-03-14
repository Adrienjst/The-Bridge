from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any, Dict, Iterable, List, Optional, Sequence

from app.config import QDRANT_API_KEY, QDRANT_URL
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import CrossEncoder, SentenceTransformer

logger = logging.getLogger(__name__)

COLLECTION_NAME = "structured_product_cards"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
RERANK_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

STRUCTURED_PRODUCT_CARDS: List[Dict[str, Any]] = [
    {
        "name": "Autocall Express 6M",
        "type": "Autocall",
        "payoff": "Quarterly coupon if underlying >= 90% initial spot; early redemption at 100% after 6 months.",
        "risk_profile": "Low-medium; coupon hinges on path-dependent barrier, subject to market downturn beyond 10%.",
        "keywords": ["autocall", "coupon", "early redemption", "barrier"],
    },
    {
        "name": "Phoenix Protector 1Y",
        "type": "Phoenix Note",
        "payoff": "Monthly coupon + put protection: if underlying drops between 60%-80% but recovers, coupon stays paid; else capital impairment kicks in.",
        "risk_profile": "Medium; relies on coupon buffer and moderate knock-in level at 60%.",
        "keywords": ["phoenix", "coupon", "buffer", "knock-in"],
    },
    {
        "name": "Reverse Convertible Standard",
        "type": "Reverse Convertible",
        "payoff": "Fixed coupon with mandatory delivery of underlying if it finishes below strike, otherwise cash at par.",
        "risk_profile": "Medium-high; capital-at-risk if underlying falls below strike; coupon compensates for downside risk.",
        "keywords": ["reverse convertible", "coupon", "capital risk", "delivery"],
    },
    {
        "name": "Shark Fin Breathalyzer",
        "type": "Shark Fin",
        "payoff": "Asymmetric payoff that peaks when spot closes inside a tight range around strike and decays outside.",
        "risk_profile": "High; extreme convexity around the strike with limited downside after the range.",
        "keywords": ["shark fin", "range", "convexity", "peak"],
    },
    {
        "name": "Autocall Barrier 5Y",
        "type": "Autocall",
        "payoff": "Annual coupon + autocall if instrument remains above 100%; maturity payoff is conditional on barrier staying above 60%.",
        "risk_profile": "Medium-high; path dependency extends to long maturities and wide barrier band.",
        "keywords": ["autocall", "long dated", "barrier", "path dependent"],
    },
    {
        "name": "Dual Currency Reverse",
        "type": "Reverse Convertible",
        "payoff": "Pays coupon in FX1 with principal deliverable in FX2 if FX pair moves beyond specified strike.",
        "risk_profile": "FX + equity risk; exposed to both currency and underlying moves.",
        "keywords": ["reverse", "dual currency", "fx", "delivery"],
    },
    {
        "name": "Barrier Coupon Bond",
        "type": "Barrier",
        "payoff": "Coupon blows up only if underlying never breaches knock-out barrier; otherwise, coupon is zero.",
        "risk_profile": "High; coupon entirely binary and tied to barrier survival.",
        "keywords": ["barrier", "coupon", "knock-out", "binary"],
    },
    {
        "name": "Autocall Float",
        "type": "Autocall",
        "payoff": "Floating coupon linked to 3M Libor + spread while spot remains above 85%.", 
        "risk_profile": "Medium; combines interest rate repricing with equity barrier.",
        "keywords": ["autocall", "floating", "libor", "barrier"],
    },
    {
        "name": "Phoenix Hall of Fame",
        "type": "Phoenix Note",
        "payoff": "Semi-annual coupon with european knockout once spot closes above hurdle; downside protected down to 55%.",
        "risk_profile": "Medium; protects principal to 55% with possibility of early redemption.",
        "keywords": ["phoenix", "knockout", "protection", "barrier"],
    },
    {
        "name": "Shark Fin Stretcher",
        "type": "Shark Fin",
        "payoff": "Bumps up payout when underlying ends near the narrow smile center; zero otherwise.",
        "risk_profile": "High; requires precise spot landing zone.",
        "keywords": ["shark fin", "smile", "range", "payout"],
    },
    {
        "name": "Put-Write Cushion",
        "type": "Cushion Note",
        "payoff": "Short put strategy with limited protection; coupon clipped if spot breaches strike.",
        "risk_profile": "Medium; downside cushioned but not fully protected.",
        "keywords": ["put write", "cushion", "coupon", "strike"],
    },
    {
        "name": "Revocable Callable Hybrid",
        "type": "Structured Callable",
        "payoff": "Embedded call option that allows issuer to redeem at par + coupon after 2Y if leverage indexes rally.",
        "risk_profile": "Medium; callable risk plus dependency on leverage index.",
        "keywords": ["callable", "hybrid", "issuer option", "leverage"],
    },
    {
        "name": "Digital Coupon Double",
        "type": "Digital",
        "payoff": "Pays digital coupon if spot closes above 105% at maturity, else zero.",
        "risk_profile": "High; all-or-nothing payout.",
        "keywords": ["digital", "binary", "high yield"],
    },
    {
        "name": "Snowball 3Y",
        "type": "Snowball",
        "payoff": "Accumulates coupons each month if spot stays above barrier; resets if breached.",
        "risk_profile": "High; coupon path resets create volatility.",
        "keywords": ["snowball", "reset", "coupon"],
    },
    {
        "name": "Callable Accumulator",
        "type": "Accumulator",
        "payoff": "Allows issuer to buy underlying at discount when price stays within range; auto-redeems when average dips too low.",
        "risk_profile": "Medium-high; long-spot exposure with exercise risk.",
        "keywords": ["accumulator", "callable", "discount", "range"],
    },
    {
        "name": "Credit-Linked Reverse",
        "type": "Credit-Linked Reverse",
        "payoff": "Couples reverse convertible with CDS protection spread; payoff reduced if credit event occurs.",
        "risk_profile": "High; combines equity and credit events.",
        "keywords": ["credit", "reverse", "link", "cds"],
    },
    {
        "name": "Range Accrual Coupon",
        "type": "Range Accrual",
        "payoff": "Daily accrual of coupon when reference stays within range; capital decays if range breached.",
        "risk_profile": "Medium; heavy path dependency.",
        "keywords": ["range accrual", "coupon", "path dependency"],
    },
    {
        "name": "Auto Barrier Steepener",
        "type": "Structured Note",
        "payoff": "Payout linked to steepener indicator + barrier on underlying; barrier knock-out triggers 0 payoff.",
        "risk_profile": "Medium-high; needs both directional and curve moves.",
        "keywords": ["steepener", "barrier", "indicator", "structured"],
    },
    {
        "name": "Phoenix Digital Ladder",
        "type": "Phoenix Note",
        "payoff": "Combo of digital coupon triggers with laddered barriers and one-touch resets.",
        "risk_profile": "Medium; ladder increases complexity but protects layers.",
        "keywords": ["phoenix", "digital", "ladder", "one-touch"],
    },
    {
        "name": "Super Phantom Convert",
        "type": "Phantom Convertible",
        "payoff": "Coupon + amortizing bond with synthetic conversion to equity payoff if stock outperforms strike.",
        "risk_profile": "Medium; convertible-style optionality embedded.",
        "keywords": ["convertible", "phantom", "equity payoff"],
    },
]


def _render_card_text(card: Dict[str, Any]) -> str:
    return (
        f"{card['name']} — {card['type']}. Payoff: {card['payoff']} Risk: {card['risk_profile']} Keywords: {', '.join(card['keywords'])}."
    )


def _get_client() -> QdrantClient:
    if not QDRANT_URL or not QDRANT_API_KEY:
        raise RuntimeError("QDRANT_URL/QDRANT_API_KEY must be configured for structured cards ingestion.")
    return QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)


@lru_cache(maxsize=1)
def _get_embedder() -> SentenceTransformer:
    embedder = SentenceTransformer(EMBED_MODEL)
    return embedder


@lru_cache(maxsize=1)
def _get_reranker() -> CrossEncoder:
    reranker = CrossEncoder(RERANK_MODEL)
    return reranker


def _ensure_collection(client: QdrantClient) -> None:
    embedder = _get_embedder()
    dim = embedder.get_sentence_embedding_dimension()
    collections = client.get_collections().collections
    names = {c.name for c in collections}
    if COLLECTION_NAME not in names:
        logger.info("Creating collection %s with dim %s", COLLECTION_NAME, dim)
        client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=dim, distance=models.Distance.COSINE),
        )
    else:
        logger.debug("Qdrant collection %s already exists", COLLECTION_NAME)


def ingest_structured_cards(force: bool = False) -> None:
    client = _get_client()
    _ensure_collection(client)
    count = client.count(collection_name=COLLECTION_NAME).count
    if count >= len(STRUCTURED_PRODUCT_CARDS) and not force:
        logger.debug("Collection already seeded with %s cards", count)
        return

    embedder = _get_embedder()
    texts = [_render_card_text(card) for card in STRUCTURED_PRODUCT_CARDS]
    embeddings = embedder.encode(texts, convert_to_numpy=True, show_progress_bar=True)

    points = []
    for idx, (card, vector) in enumerate(zip(STRUCTURED_PRODUCT_CARDS, embeddings)):
        payload = {**card, "text": texts[idx]}
        points.append(models.PointStruct(id=idx, vector=vector.tolist(), payload=payload))

    client.upsert(collection_name=COLLECTION_NAME, points=points)
    logger.info("Seeded %s structured product cards into Qdrant", len(points))


def _normalize_hit(hit) -> Dict[str, Any]:
    payload = hit.payload or {}
    return {
        "id": hit.id,
        "payload": payload,
        "score": hit.score or 0.0,
    }


def hybrid_search(query: str, top_k: int = 10) -> List[Dict[str, Any]]:
    client = _get_client()
    _ensure_collection(client)
    embedder = _get_embedder()
    vector = embedder.encode(query, convert_to_numpy=True)

    # Use standard Qdrant Query API (QueryPoints)
    scored_points = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector.tolist(),
        limit=top_k * 2,
        with_payload=True,
    ).points

    results = []
    for hit in scored_points:
        data = {
            "id": hit.id,
            "payload": hit.payload or {},
            "score": hit.score or 0.0,
        }
        results.append(data)

    return results


def rerank_candidates(query: str, candidates: Sequence[Dict[str, Any]], top_n: int = 3) -> List[Dict[str, Any]]:
    if not candidates:
        return []
    reranker = _get_reranker()
    texts = [candidate["payload"].get("text", "") for candidate in candidates]
    pairs = [(query, text) for text in texts]
    scores = reranker.predict(pairs)
    ranked = sorted(
        zip(candidates, scores), key=lambda pair: pair[1], reverse=True
    )
    return [candidate for candidate, _score in ranked[:top_n]]


def format_card_summary(card_payload: Dict[str, Any]) -> str:
    return (
        f"{card_payload.get('name')} ({card_payload.get('type')}) — {card_payload.get('payoff')} Risque: {card_payload.get('risk_profile')}"
    )


def get_knowledge_snapshot(query: str, top_n: int = 3) -> List[Dict[str, Any]]:
    candidates = hybrid_search(query, top_k=12)
    reranked = rerank_candidates(query, candidates, top_n=top_n)
    return reranked
