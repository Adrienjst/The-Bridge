from app.graph.nodes.pricer import price_european

params = {
    "option_type": "call",
    "spot": 100.0,
    "strike": 95.0,
    "risk_free_rate": 0.045,
    "volatility": 0.25,
    "maturity_years": 1.0,
}

try:
    # Try direct call
    print("Trying direct call...")
    result = price_european(**params)
    print("Result:", result)
except Exception as e:
    print("Direct call failed:", e)

try:
    # Try .invoke()
    print("\nTrying .invoke()...")
    result = price_european.invoke(params)
    print("Result:", result)
except Exception as e:
    print(".invoke() failed:", e)
