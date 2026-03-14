from app.graph.nodes.pricer import price_barrier, price_autocall

print("--- Testing Barrier ---")
params_barrier = {
    "option_type": "call",
    "barrier_type": "upout",
    "barrier_level": 120.0,
    "rebate": 2.0,
    "spot": 100.0,
    "strike": 100.0,
    "risk_free_rate": 0.035,
    "volatility": 0.22,
    "maturity_years": 0.75,
}
res_barrier = price_barrier.invoke(params_barrier)
print("Barrier Result:", res_barrier)

print("\n--- Testing Autocall ---")
params_autocall = {
    "spot": 110.0,
    "barrier_level": 95.0,
    "coupon_rate": 0.07,
    "observation_interval_months": 3,
    "risk_free_rate": 0.04,
    "volatility": 0.18,
    "maturity_years": 2.0,
    "simulations": 1000,
}
res_autocall = price_autocall.invoke(params_autocall)
print("Autocall Result:", res_autocall)
