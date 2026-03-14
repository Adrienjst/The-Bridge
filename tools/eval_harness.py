import re
from statistics import mean
from typing import List, Dict

from app.graph.nodes.pricer import price_autocall, price_barrier, price_european
from app.rag.structured_cards import (
    get_knowledge_snapshot,
    ingest_structured_cards,
)

price_tests = [
    {
        "name": "European Call 1Y",
        "tool": price_european,
        "params": {
            "option_type": "call",
            "spot": 100.0,
            "strike": 95.0,
            "risk_free_rate": 0.045,
            "volatility": 0.25,
            "maturity_years": 1.0,
        },
    },
    {
        "name": "Barrier Up-Out",
        "tool": price_barrier,
        "params": {
            "option_type": "call",
            "barrier_type": "upout",
            "barrier_level": 120.0,
            "rebate": 2.0,
            "spot": 100.0,
            "strike": 100.0,
            "risk_free_rate": 0.035,
            "volatility": 0.22,
            "maturity_years": 0.75,
        },
    },
    {
        "name": "Autocallable Hybrid",
        "tool": price_autocall,
        "params": {
            "spot": 110.0,
            "barrier_level": 95.0,
            "coupon_rate": 0.07,
            "observation_interval_months": 3,
            "risk_free_rate": 0.04,
            "volatility": 0.18,
            "maturity_years": 2.0,
            "simulations": 2000,
        },
    },
]

knowledge_tests = [
    {"query": "Tell me about an autocallable with quarterly coupon", "expected": "Autocall Express 6M"},
    {"query": "Explain a barrier coupon with knockout payoff", "expected": "Barrier Coupon Bond"},
    {"query": "Describe a phoenix structure with digital ladder", "expected": "Phoenix Digital Ladder"},
    {"query": "What is a reverse convertible with credit link?", "expected": "Credit-Linked Reverse"},
    {"query": "Summarize a shark fin payoff that peaks around a range", "expected": "Shark Fin Breathalyzer"},
]

PRICE_PATTERN = re.compile(r"Price \((?:NPV|present value)\): ([0-9eE+\-.]+)")


def parse_price(output: str) -> float:
    match = PRICE_PATTERN.search(output)
    if not match:
        raise ValueError("Unable to parse price from output.")
    return float(match.group(1))


def evaluate_price_checks() -> Dict[str, any]:
    successes = []
    price_values: List[float] = []
    for test in price_tests:
        try:
            # Correctly use .invoke() for LangChain tools
            result = test["tool"].invoke(test["params"])
            if "Error" in result:
                successes.append(False)
                continue
            price = parse_price(result)
            price_values.append(price)
            successes.append(True)
        except Exception:
            successes.append(False)
    return {
        "success_rate": sum(successes) / len(successes),
        "values": price_values,
        "fails": [test["name"] for idx, test in enumerate(price_tests) if not successes[idx]],
    }


def evaluate_knowledge_checks() -> Dict[str, any]:
    ingest_structured_cards()
    successes = []
    failures: List[str] = []
    for test in knowledge_tests:
        try:
            cards = get_knowledge_snapshot(test["query"], top_n=3)
            found = any(
                test["expected"].lower() in (card.get("payload", {}).get("name", "").lower())
                for card in cards
            )
            successes.append(found)
            if not found:
                failures.append(test["query"])
        except Exception:
            successes.append(False)
            failures.append(test["query"])
    return {
        "success_rate": sum(successes) / len(successes),
        "fails": failures,
    }


def main() -> None:
    print("Running pricing validations...")
    price_results = evaluate_price_checks()
    print("Price success rate:", f"{price_results['success_rate']*100:.1f}%")
    if price_results["fails"]:
        print("Failed price checks:", price_results["fails"])

    print("\nRunning knowledge retrieval validations...")
    knowledge_results = evaluate_knowledge_checks()
    print("Knowledge success rate:", f"{knowledge_results['success_rate']*100:.1f}%")
    if knowledge_results["fails"]:
        print("Failed knowledge checks (queries):", knowledge_results["fails"])

    hallucination_score = (
        (price_results["success_rate"] + knowledge_results["success_rate"]) / 2
    ) * 100
    print("\nHallucination Score:", f"{hallucination_score:.1f}/100")


if __name__ == "__main__":
    main()
