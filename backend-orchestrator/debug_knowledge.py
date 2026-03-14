from app.rag.structured_cards import get_knowledge_snapshot, ingest_structured_cards
import os

print("QDRANT_URL:", os.getenv("QDRANT_URL"))
print("Seeding cards...")
try:
    ingest_structured_cards(force=True)
    print("Ingestion complete.")
except Exception as e:
    print("Ingestion failed:", e)

query = "Tell me about an autocallable with quarterly coupon"
print(f"\nSearching for: '{query}'")
try:
    cards = get_knowledge_snapshot(query, top_n=3)
    print(f"Found {len(cards)} cards.")
    for i, card in enumerate(cards):
        print(f"[{i+1}] {card.get('payload', {}).get('name')}")
except Exception as e:
    print("Search failed:", e)
