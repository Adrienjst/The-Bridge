import math
import statistics

import QuantLib as ql
import py_vollib.black_scholes.implied_volatility as iv
from langchain_core.tools import tool


@tool
def price_european(
    option_type: str,
    spot: float,
    strike: float,
    risk_free_rate: float,
    volatility: float,
    maturity_years: float,
    dividend_yield: float = 0.0
) -> str:
    """
    Price a European vanilla option using QuantLib's Black-Scholes-Merton model via analytical formulas.
    """
    try:
        if option_type.lower() not in ["call", "put"]:
            return "Error: option_type must be 'Call' or 'Put'."

        ql_type = ql.Option.Call if option_type.lower() == "call" else ql.Option.Put
        today = ql.Date(1, 1, 2024)
        ql.Settings.instance().evaluationDate = today
        days_to_maturity = max(1, int(maturity_years * 365))
        maturity_date = today + ql.Period(days_to_maturity, ql.Days)

        payoff = ql.PlainVanillaPayoff(ql_type, strike)
        exercise = ql.EuropeanExercise(maturity_date)
        option = ql.VanillaOption(payoff, exercise)

        spot_handle = ql.QuoteHandle(ql.SimpleQuote(spot))
        day_count = ql.Actual365Fixed()
        r_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, risk_free_rate, day_count))
        d_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, dividend_yield, day_count))
        v_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(today, ql.NullCalendar(), volatility, day_count))

        bsm_process = ql.BlackScholesMertonProcess(spot_handle, d_ts, r_ts, v_ts)
        engine = ql.AnalyticEuropeanEngine(bsm_process)
        option.setPricingEngine(engine)

        npv = option.NPV()
        delta = option.delta()
        gamma = option.gamma()
        vega = option.vega()
        theta = option.thetaPerDay() * 365.0
        rho = option.rho()

        return (
            f"--- European {option_type.capitalize()} Pricing (QuantLib) ---\n"
            f"Spot: {spot}, Strike: {strike}, T: {maturity_years}y\n"
            f"Vol: {volatility*100:.2f}%, Rate: {risk_free_rate*100:.2f}%, Div: {dividend_yield*100:.2f}%\n"
            f"----------------------------------------\n"
            f"Price (NPV): {npv:.4f}\n"
            f"Delta:       {delta:.4f}\n"
            f"Gamma:       {gamma:.4f}\n"
            f"Vega:        {vega/100:.4f} (per 1% change)\n"
            f"Theta:       {theta:.4f} (annualized)\n"
            f"Rho:         {rho/100:.4f} (per 1% change)"
        )
    except Exception as e:
        return f"Error pricing European Option: {str(e)}"


@tool
def calculate_implied_volatility(
    option_type: str,
    market_price: float,
    spot: float,
    strike: float,
    risk_free_rate: float,
    maturity_years: float,
) -> str:
    """
    Calculate the Implied Volatility using py_vollib.
    """
    try:
        flag = 'c' if option_type.lower() in ['call', 'c'] else 'p'
        implied_vol = iv.implied_volatility(market_price, spot, strike, maturity_years, risk_free_rate, flag)
        return f"Implied Volatility: {implied_vol * 100:.2f}%"
    except Exception as e:
        return f"Error calculating Implied Volatility: {str(e)}"


@tool
def price_barrier(
    option_type: str,
    barrier_type: str,
    barrier_level: float,
    rebate: float,
    spot: float,
    strike: float,
    risk_free_rate: float,
    volatility: float,
    maturity_years: float,
    dividend_yield: float = 0.0
) -> str:
    """
    Prices a Barrier option using QuantLib's analytic barrier engine and returns Greeks.
    barrier_type expects one of UpIn, UpOut, DownIn, DownOut (case-insensitive).
    """
    try:
        normalized = barrier_type.replace(" ", "").replace("-", "").lower()
        barrier_map = {
            "upin": ql.Barrier.UpIn,
            "upout": ql.Barrier.UpOut,
            "downin": ql.Barrier.DownIn,
            "downout": ql.Barrier.DownOut,
        }
        if normalized not in barrier_map:
            return "Error: barrier_type must be UpIn, UpOut, DownIn, or DownOut."

        ql_type = ql.Option.Call if option_type.lower() == "call" else ql.Option.Put
        barrier_enum = barrier_map[normalized]

        today = ql.Date(1, 1, 2024)
        ql.Settings.instance().evaluationDate = today
        days_to_maturity = max(1, int(maturity_years * 365))
        maturity_date = today + ql.Period(days_to_maturity, ql.Days)

        payoff = ql.PlainVanillaPayoff(ql_type, strike)
        exercise = ql.EuropeanExercise(maturity_date)
        option = ql.BarrierOption(barrier_enum, barrier_level, rebate, payoff, exercise)

        spot_handle = ql.QuoteHandle(ql.SimpleQuote(spot))
        day_count = ql.Actual365Fixed()
        r_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, risk_free_rate, day_count))
        d_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, dividend_yield, day_count))
        v_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(today, ql.NullCalendar(), volatility, day_count))

        process = ql.BlackScholesMertonProcess(spot_handle, d_ts, r_ts, v_ts)
        option.setPricingEngine(ql.AnalyticBarrierEngine(process))

        npv = option.NPV()
        try:
            delta = option.delta()
            gamma = option.gamma()
            greeks = f"Delta: {delta:.4f}, Gamma: {gamma:.4f}"
        except:
            greeks = "Greeks: Analytic engine does not support Greeks for this barrier type."

        return (
            f"--- Barrier Option ({option_type.capitalize()}, {barrier_type}) ---\n"
            f"Spot: {spot:.2f}, Strike: {strike:.2f}, Barrier: {barrier_level:.2f}, Rebate: {rebate:.2f}\n"
            f"Maturity: {maturity_years}y, Vol: {volatility*100:.2f}%, Rate: {risk_free_rate*100:.2f}%\n"
            f"Price (NPV): {npv:.4f}\n{greeks}"
        )
    except Exception as e:
        return f"Error pricing Barrier Option: {str(e)}"


@tool
def price_autocall(
    spot: float,
    barrier_level: float,
    coupon_rate: float,
    observation_interval_months: int,
    risk_free_rate: float,
    volatility: float,
    maturity_years: float,
    dividend_yield: float = 0.0,
    notional: float = 100.0,
    simulations: int = 20000,
    seed: int = 42
) -> str:
    """
    Rough Monte Carlo pricing of a simplified autocallable note.
    A coupon equal to coupon_rate * notional is paid whenever the barrier is observed in the money,
    and the product terminates. Otherwise, the final payoff is a capped participation of spot/initial spot.
    """
    try:
        if maturity_years <= 0 or observation_interval_months <= 0 or simulations <= 0:
            return "Error: maturity_years, observation_interval_months, and simulations must be positive."

        obs_interval_years = observation_interval_months / 12.0
        obs_times: list[float] = []
        current_time = obs_interval_years
        while current_time < maturity_years:
            obs_times.append(current_time)
            current_time += obs_interval_years
        if not obs_times or abs(obs_times[-1] - maturity_years) > 1e-9:
            obs_times.append(maturity_years)

        total_steps = max(32, int(maturity_years * 252))
        obs_indices = [
            min(total_steps, max(1, int(round(time / maturity_years * total_steps))))
            for time in obs_times
        ]

        today = ql.Date(1, 1, 2024)
        ql.Settings.instance().evaluationDate = today
        days_to_maturity = max(1, int(maturity_years * 365))
        maturity_date = today + ql.Period(days_to_maturity, ql.Days)

        spot_handle = ql.QuoteHandle(ql.SimpleQuote(spot))
        day_count = ql.Actual365Fixed()
        r_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, risk_free_rate, day_count))
        d_ts = ql.YieldTermStructureHandle(ql.FlatForward(today, dividend_yield, day_count))
        v_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(today, ql.NullCalendar(), volatility, day_count))
        process = ql.BlackScholesMertonProcess(spot_handle, d_ts, r_ts, v_ts)

        # Fix for QuantLib-Python sequence generator bindings
        uniform_sequence = ql.UniformRandomSequenceGenerator(total_steps, ql.UniformRandomGenerator())
        gaussian_sequence = ql.GaussianRandomSequenceGenerator(uniform_sequence)
        path_generator = ql.GaussianPathGenerator(process, float(maturity_years), total_steps, gaussian_sequence, False)

        coupon_payoff = notional * coupon_rate
        num_paths = min(max(int(simulations), 1000), 40000)
        discounted_payoffs: list[float] = []

        for _ in range(num_paths):
            path = path_generator.next()
            values = path.value()
            called = False
            for obs_idx, obs_time in zip(obs_indices, obs_times):
                level = float(values[obs_idx])
                if level >= barrier_level:
                    payoff = notional + coupon_payoff
                    discounted_payoffs.append(payoff * math.exp(-risk_free_rate * obs_time))
                    called = True
                    break
            if called:
                continue

            final_spot = float(values[-1])
            final_payoff = notional * max(final_spot / spot, 0.0)
            if final_spot >= barrier_level:
                final_payoff += coupon_payoff
            discounted_payoffs.append(final_payoff * math.exp(-risk_free_rate * maturity_years))

        if not discounted_payoffs:
            return "Error: Autocall simulation produced no payoffs."

        price = sum(discounted_payoffs) / len(discounted_payoffs)
        std_dev = statistics.pstdev(discounted_payoffs)

        return (
            f"--- Autocall Pricing (Monte Carlo) ---\n"
            f"Spot {spot:.2f}, Barrier {barrier_level:.2f}, Coupon {coupon_rate*100:.2f}% of notional\n"
            f"Maturity {maturity_years}y via {observation_interval_months}M observations, {num_paths} paths\n"
            f"Price (present value): {price:.4f}\nStd dev (discounted payoff): {std_dev:.4f}"
        )
    except Exception as exc:
        return f"Error pricing Autocallable: {str(exc)}"


# We can group them here for easy export
PRICER_TOOLS = [
    price_european,
    calculate_implied_volatility,
    price_barrier,
    price_autocall,
]
