import { Exercise } from './types';

export const exercises: Exercise[] = [
    // ===== MODULE 1 =====
    {
        id: 'ex1-1', moduleId: 'bases-derives', lessonId: 'options-call-put', difficulty: 'moyen',
        title: { fr: 'Calcul de P&L d\'options', en: 'Option P&L Calculation' },
        description: { fr: 'Calculez le P&L pour différentes stratégies sur le CAC40.', en: 'Calculate the P&L for different strategies on the CAC40.' },
        steps: [
            {
                instruction: { fr: 'Long Call : S₀ = 7200, K = 7000, Prime = 350€. Si S_T = 7500, calculer le payoff, le P&L, et le rendement.', en: 'Long Call: S₀ = 7200, K = 7000, Premium = €350. If S_T = 7500, calculate the payoff, P&L, and return.' },
                hint: { fr: 'Payoff = max(S_T - K, 0)', en: 'Payoff = max(S_T - K, 0)' },
                solution: { fr: 'Payoff = max(7500-7000, 0) = 500€. P&L = 500 - 350 = 150€. Rendement = 150/350 = 42.9%.', en: 'Payoff = max(7500-7000, 0) = €500. P&L = 500 - 350 = €150. Return = 150/350 = 42.9%.' }
            },
            {
                instruction: { fr: 'Long Put : K = 7200, Prime = 280€. Si S_T = 6800, calculer le payoff et le P&L.', en: 'Long Put: K = 7200, Premium = €280. If S_T = 6800, calculate payoff and P&L.' },
                hint: { fr: 'Payoff put = max(K - S_T, 0)', en: 'Payoff put = max(K - S_T, 0)' },
                solution: { fr: 'Payoff = max(7200-6800, 0) = 400€. P&L = 400 - 280 = 120€.', en: 'Payoff = max(7200-6800, 0) = €400. P&L = 400 - 280 = €120.' }
            },
            {
                instruction: { fr: 'Short Put : même put. Quel est le P&L du vendeur et son breakeven ?', en: 'Short Put: same put. What is the seller\'s P&L and breakeven?' },
                solution: { fr: 'P&L vendeur = 280 - 400 = -120€. Le vendeur perd quand l\'acheteur gagne. Breakeven = K - Prime = 7200 - 280 = 6920.', en: 'Seller P&L = 280 - 400 = -€120. Seller loses when buyer gains. Breakeven = K - Premium = 7200 - 280 = 6920.' }
            }
        ]
    },

    {
        id: 'ex1-2', moduleId: 'bases-derives', lessonId: 'put-call-parity', difficulty: 'difficile',
        title: { fr: 'Arbitrage via Put-Call Parity', en: 'Arbitrage via Put-Call Parity' },
        description: { fr: 'Identifiez une opportunité d\'arbitrage en utilisant la parité call-put.', en: 'Identify an arbitrage opportunity using put-call parity.' },
        steps: [
            {
                instruction: { fr: 'Données : S₀ = 100€, K = 100€, r = 5%, T = 1 an. Call = 12€, Put = 8€. La put-call parity est-elle respectée ?', en: 'Data: S₀ = €100, K = €100, r = 5%, T = 1 year. Call = €12, Put = €8. Is put-call parity respected?' },
                hint: { fr: 'Vérifier si C - P = S₀ - K×e^(-rT)', en: 'Check if C - P = S₀ - K×e^(-rT)' },
                solution: { fr: 'C - P = 12 - 8 = 4€. S₀ - Ke^(-rT) = 100 - 100×0.9512 = 4.88€. Comme 4 < 4.88, la parité n\'est PAS respectée → arbitrage possible.', en: 'C - P = 12 - 8 = €4. S₀ - Ke^(-rT) = 100 - 100×0.9512 = €4.88. Since 4 < 4.88, parity is NOT respected → arbitrage possible.' }
            },
            {
                instruction: { fr: 'Construire la stratégie d\'arbitrage (conversion/reversal).', en: 'Construct the arbitrage strategy (conversion/reversal).' },
                solution: { fr: 'Short Call (reçu 12) + Long Put (payé 8) + Long Stock (payé 100) + Emprunt 100 au taux r. Flux initial = 12 - 8 - 100 + 100 = 4€. À maturité : quel que soit S_T, on paie 100×e^(0.05) = 105.13. Et la position synthetic forward (short call + long put + stock) vaut exactement K = 100. Gain = 4.88 - 4 = 0.88€ sans risque.', en: 'Short Call (receive 12) + Long Put (pay 8) + Long Stock (pay 100) + Borrow 100 at rate r. Initial flow = 12 - 8 - 100 + 100 = €4. At maturity: regardless of S_T, pay 100×e^(0.05) = 105.13. And the synthetic forward position (short call + long put + stock) is worth exactly K = 100. Gain = 4.88 - 4 = €0.88 risk-free.' }
            }
        ]
    },

    {
        id: 'ex1-3', moduleId: 'bases-derives', lessonId: 'strategies-options', difficulty: 'moyen',
        title: { fr: 'Construction d\'un Collar', en: 'Collar Construction' },
        description: { fr: 'Construisez un collar sur un portefeuille d\'actions.', en: 'Build a collar on a stock portfolio.' },
        steps: [
            {
                instruction: { fr: 'Portefeuille de 1000 actions à S₀ = 50€. Vous achetez un put K₁ = 45€ (prime 2€) et vendez un call K₂ = 55€ (prime 1.5€). Quel est le coût net ?', en: 'Portfolio of 1000 shares at S₀ = €50. Buy a put K₁ = €45 (premium €2) and sell a call K₂ = €55 (premium €1.5). What is the net cost?' },
                solution: { fr: 'Coût net = 1000 × (2 - 1.5) = 500€. Le collar coûte 0.50€ par action.', en: 'Net cost = 1000 × (2 - 1.5) = €500. The collar costs €0.50 per share.' }
            },
            {
                instruction: { fr: 'Calculer le P&L du portefeuille avec collar pour S_T = 40€, 50€, 60€.', en: 'Calculate portfolio P&L with collar for S_T = €40, €50, €60.' },
                solution: { fr: 'S_T=40 : Stock -10000 + Put +5000 + Call 0 - prime 500 = -5500€ (pertes limitées). S_T=50 : Stock 0 + 0 + 0 - 500 = -500€. S_T=60 : Stock +10000 + Put 0 + Call -5000 - 500 = +4500€ (gains cappés).', en: 'S_T=40: Stock -10000 + Put +5000 + Call 0 - premium 500 = -€5500 (limited losses). S_T=50: Stock 0 + 0 + 0 - 500 = -€500. S_T=60: Stock +10000 + Put 0 + Call -5000 - 500 = +€4500 (capped gains).' }
            }
        ]
    },

    // ===== MODULE 2 =====
    {
        id: 'ex2-1', moduleId: 'produits-structures', lessonId: 'decomposition-zc-option', difficulty: 'moyen',
        title: { fr: 'Budget optionnel', en: 'Option Budget' },
        description: { fr: 'Calculez le budget disponible pour la composante optionnelle.', en: 'Calculate the available budget for the option component.' },
        steps: [
            {
                instruction: { fr: 'Taux de swap 5Y = 3.5%, spread de crédit = 50bps. Calculer le prix du ZC à 5 ans.', en: '5Y swap rate = 3.5%, credit spread = 50bps. Calculate the 5-year ZC price.' },
                hint: { fr: 'ZC = e^(-(r+s)×T)', en: 'ZC = e^(-(r+s)×T)' },
                solution: { fr: 'ZC = e^(-(0.035+0.005)×5) = e^(-0.20) = 81.87%. Budget brut = 18.13%.', en: 'ZC = e^(-(0.035+0.005)×5) = e^(-0.20) = 81.87%. Gross budget = 18.13%.' }
            },
            {
                instruction: { fr: 'Si la marge émetteur est 1.8%, quel est le budget net ? Si un call ATM 5Y coûte 22%, quelle participation peut-on offrir ?', en: 'If issuer margin is 1.8%, what is the net budget? If a 5Y ATM call costs 22%, what participation can be offered?' },
                solution: { fr: 'Budget net = 18.13% - 1.80% = 16.33%. Participation = 16.33% / 22% = 74.2%. Le produit offre capital garanti à 100% + 74.2% de la hausse de l\'indice.', en: 'Net budget = 18.13% - 1.80% = 16.33%. Participation = 16.33% / 22% = 74.2%. Product offers 100% capital guarantee + 74.2% of index upside.' }
            }
        ]
    },

    {
        id: 'ex2-2', moduleId: 'produits-structures', lessonId: 'autocall', difficulty: 'difficile',
        title: { fr: 'Scénarios d\'un autocall', en: 'Autocall Scenarios' },
        description: { fr: 'Analysez différents scénarios pour un autocall 5 ans.', en: 'Analyze different scenarios for a 5-year autocall.' },
        steps: [
            {
                instruction: { fr: 'Autocall : maturité 5 ans, coupon 7% p.a. avec mémoire, barrière autocall 100%, PDI 60% à maturité. Scénario 1 : le sous-jacent est à 98%, 103%, dans les années 1-2. Calculer le rendement total.', en: 'Autocall: 5Y maturity, 7% p.a. coupon with memory, autocall barrier 100%, PDI 60% at maturity. Scenario 1: underlying is at 98%, 103% in years 1-2. Calculate total return.' },
                solution: { fr: 'An 1 : 98% < 100% → pas de rappel, coupon stocké (mémoire). An 2 : 103% ≥ 100% → Autocall ! Remboursement = 100% + 2 × 7% = 114%. Rendement annualisé ≈ 6.8%.', en: 'Y1: 98% < 100% → no recall, coupon stored (memory). Y2: 103% ≥ 100% → Autocall! Repayment = 100% + 2 × 7% = 114%. Annualized return ≈ 6.8%.' }
            },
            {
                instruction: { fr: 'Scénario 2 : jamais rappelé, à maturité S_T = 55% du spot initial. Quel est le remboursement ?', en: 'Scenario 2: never recalled, at maturity S_T = 55% of initial spot. What is the repayment?' },
                solution: { fr: '55% < 60% (PDI touchée) → l\'investisseur reçoit 55% du nominal. Perte = 45%. Aucun coupon n\'est versé car la perte en capital s\'applique.', en: '55% < 60% (PDI touched) → investor receives 55% of notional. Loss = 45%. No coupon paid as capital loss applies.' }
            },
            {
                instruction: { fr: 'Scénario 3 : jamais rappelé, à maturité S_T = 65%. Quel est le remboursement ?', en: 'Scenario 3: never recalled, at maturity S_T = 65%. What is the repayment?' },
                solution: { fr: '65% > 60% (PDI non touchée) → remboursement = 100% + 5 × 7% = 135%. Meilleur scénario pour l\'investisseur (aucun rappel + barrière intacte).', en: '65% > 60% (PDI not touched) → repayment = 100% + 5 × 7% = 135%. Best scenario for investor (no recall + barrier intact).' }
            }
        ]
    },

    // ===== MODULE 3 =====
    {
        id: 'ex3-1', moduleId: 'equity-exotiques', lessonId: 'options-barrieres', difficulty: 'moyen',
        title: { fr: 'Pricing relatif des barrières', en: 'Relative Barrier Pricing' },
        description: { fr: 'Classez des options par prix en utilisant les relations fondamentales.', en: 'Rank options by price using fundamental relationships.' },
        steps: [
            {
                instruction: { fr: 'Classez par prix croissant : (A) Call vanille K=100, (B) Call KO H=120 K=100, (C) Call KI H=120 K=100.', en: 'Rank by increasing price: (A) Vanilla call K=100, (B) Call KO H=120 K=100, (C) Call KI H=120 K=100.' },
                hint: { fr: 'KI + KO = Vanille. L\'option KO peut mourir → elle est moins chère.', en: 'KI + KO = Vanilla. KO option can die → it\'s cheaper.' },
                solution: { fr: 'B (Call KO) < C (Call KI) dans la plupart des cas, et B + C = A (Vanille). Donc : moins cher à plus cher → B < C ≤ A. Plus précisément : Call KO < Call vanille toujours. Si la barrière est Up-and-Out et K < H, le KO est significativement moins cher car le call perd sa valeur juste quand il gagne le plus.', en: 'B (Call KO) < C (Call KI) in most cases, and B + C = A (Vanilla). So: cheapest to most expensive → B < C ≤ A. More precisely: Call KO < Vanilla Call always. If barrier is Up-and-Out and K < H, KO is significantly cheaper as the call loses value just when it gains the most.' }
            }
        ]
    },

    // ===== MODULE 4 =====
    {
        id: 'ex4-1', moduleId: 'familles-payoffs', lessonId: 'range-accrual', difficulty: 'moyen',
        title: { fr: 'Calcul de coupon Range Accrual', en: 'Range Accrual Coupon Calculation' },
        description: { fr: 'Calculez les coupons trimestriels d\'un range accrual sur le SX5E.', en: 'Calculate quarterly coupons for a range accrual on SX5E.' },
        steps: [
            {
                instruction: { fr: 'Range Accrual 8% p.a., range 80%-120%, observation quotidienne. T1 : sur 63 jours ouvrés, le sous-jacent est dans le range 58 jours. Calculer le coupon T1.', en: 'Range Accrual 8% p.a., 80%-120% range, daily observation. Q1: of 63 business days, underlying is in range 58 days. Calculate Q1 coupon.' },
                solution: { fr: 'Coupon T1 = (8%/4) × 58/63 = 2% × 92.1% = 1.84%.', en: 'Q1 coupon = (8%/4) × 58/63 = 2% × 92.1% = 1.84%.' }
            },
            {
                instruction: { fr: 'T2 : 5 jours en dehors du range sur 63. T3 : toujours dans le range (63/63). T4 : 20 jours dehors. Calculer le coupon annuel total.', en: 'Q2: 5 days outside range of 63. Q3: always in range (63/63). Q4: 20 days outside. Calculate total annual coupon.' },
                solution: { fr: 'Coupon T2 = 2% × 58/63 = 1.84%. T3 = 2% × 63/63 = 2.00%. T4 = 2% × 43/63 = 1.37%. Total = 1.84% + 1.84% + 2.00% + 1.37% = 7.05% (vs 8% max).', en: 'Q2 coupon = 2% × 58/63 = 1.84%. Q3 = 2% × 63/63 = 2.00%. Q4 = 2% × 43/63 = 1.37%. Total = 1.84% + 1.84% + 2.00% + 1.37% = 7.05% (vs 8% max).' }
            }
        ]
    },

    // ===== MODULE 5 =====
    {
        id: 'ex5-1', moduleId: 'pricing-greeks', lessonId: 'black-scholes', difficulty: 'difficile',
        title: { fr: 'Application complète de Black-Scholes', en: 'Full Black-Scholes Application' },
        description: { fr: 'Calculez le prix d\'un call et d\'un put, puis vérifiez la parité.', en: 'Calculate the price of a call and put, then verify parity.' },
        steps: [
            {
                instruction: { fr: 'S₀ = 50€, K = 48€, r = 4%, q = 1%, σ = 25%, T = 6 mois. Calculer d₁ et d₂.', en: 'S₀ = €50, K = €48, r = 4%, q = 1%, σ = 25%, T = 6 months. Calculate d₁ and d₂.' },
                hint: { fr: 'd₁ = [ln(S₀/K) + (r-q+σ²/2)T] / (σ√T)', en: 'd₁ = [ln(S₀/K) + (r-q+σ²/2)T] / (σ√T)' },
                solution: { fr: 'ln(50/48) = 0.0408. (r-q+σ²/2)T = (0.04-0.01+0.03125)×0.5 = 0.0306. σ√T = 0.25×0.707 = 0.1768. d₁ = (0.0408+0.0306)/0.1768 = 0.404. d₂ = 0.404 - 0.177 = 0.227.', en: 'ln(50/48) = 0.0408. (r-q+σ²/2)T = (0.04-0.01+0.03125)×0.5 = 0.0306. σ√T = 0.25×0.707 = 0.1768. d₁ = (0.0408+0.0306)/0.1768 = 0.404. d₂ = 0.404 - 0.177 = 0.227.' }
            },
            {
                instruction: { fr: 'Calculer le prix du call et du put. N(0.404) ≈ 0.657, N(0.227) ≈ 0.590.', en: 'Calculate the call and put price. N(0.404) ≈ 0.657, N(0.227) ≈ 0.590.' },
                solution: { fr: 'C = 50×e^(-0.005)×0.657 - 48×e^(-0.02)×0.590 = 50×0.995×0.657 - 48×0.980×0.590 = 32.69 - 27.75 = 4.94€.\nP = 48×e^(-0.02)×(1-0.590) - 50×e^(-0.005)×(1-0.657) = 47.04×0.410 - 49.75×0.343 = 19.29 - 17.06 = 2.23€.', en: 'C = 50×e^(-0.005)×0.657 - 48×e^(-0.02)×0.590 = 50×0.995×0.657 - 48×0.980×0.590 = 32.69 - 27.75 = €4.94.\nP = 48×e^(-0.02)×(1-0.590) - 50×e^(-0.005)×(1-0.657) = 47.04×0.410 - 49.75×0.343 = 19.29 - 17.06 = €2.23.' }
            },
            {
                instruction: { fr: 'Vérifier avec la put-call parity : C - P = Se^(-qT) - Ke^(-rT).', en: 'Verify with put-call parity: C - P = Se^(-qT) - Ke^(-rT).' },
                solution: { fr: 'C - P = 4.94 - 2.23 = 2.71€. Se^(-qT) - Ke^(-rT) = 49.75 - 47.04 = 2.71€. ✓ La parité est vérifiée.', en: 'C - P = 4.94 - 2.23 = €2.71. Se^(-qT) - Ke^(-rT) = 49.75 - 47.04 = €2.71. ✓ Parity is verified.' }
            }
        ]
    },

    {
        id: 'ex5-2', moduleId: 'pricing-greeks', lessonId: 'greeks', difficulty: 'moyen',
        title: { fr: 'Interprétation des Greeks', en: 'Greeks Interpretation' },
        description: { fr: 'Analysez l\'impact des Greeks sur un portefeuille d\'options.', en: 'Analyze the impact of Greeks on an options portfolio.' },
        steps: [
            {
                instruction: { fr: 'Vous avez vendu 100 calls (Δ=0.6, Γ=0.05, Θ=-0.03€/jour, ν=0.15). Combien d\'actions acheter pour être delta-neutre ?', en: 'You sold 100 calls (Δ=0.6, Γ=0.05, Θ=-0.03€/day, ν=0.15). How many shares to buy to be delta-neutral?' },
                solution: { fr: 'Short 100 calls → position delta = -100 × 0.6 = -60. Acheter 60 actions pour delta-neutre. Position totale : -100 calls + 60 actions, Δ = 0.', en: 'Short 100 calls → position delta = -100 × 0.6 = -60. Buy 60 shares to be delta-neutral. Total position: -100 calls + 60 shares, Δ = 0.' }
            },
            {
                instruction: { fr: 'Le sous-jacent monte de 2€. Quel est votre nouveau delta et combien d\'actions devez-vous ajuster ?', en: 'The underlying rises by €2. What is your new delta and how many shares must you adjust?' },
                solution: { fr: 'Nouveau Δ par call ≈ 0.6 + 0.05 × 2 = 0.7. Position options delta = -100 × 0.7 = -70. Stock delta = +60. Net delta = -10. Il faut acheter 10 actions supplémentaires.', en: 'New Δ per call ≈ 0.6 + 0.05 × 2 = 0.7. Options position delta = -100 × 0.7 = -70. Stock delta = +60. Net delta = -10. Must buy 10 additional shares.' }
            },
            {
                instruction: { fr: 'Si la vol implicite augmente de 1%, quel est l\'impact P&L sur votre position options ?', en: 'If implied vol increases by 1%, what is the P&L impact on your options position?' },
                solution: { fr: 'Vega position = -100 × 0.15 = -15€ par point de vol. Hausse de 1% → P&L = -15€. Vous êtes short vega (vendeur de vol), une hausse de vol vous nuit.', en: 'Vega position = -100 × 0.15 = -€15 per vol point. 1% rise → P&L = -€15. You are short vega (vol seller), a vol increase hurts you.' }
            }
        ]
    },

    {
        id: 'ex5-3', moduleId: 'pricing-greeks', lessonId: 'hedging-practice', difficulty: 'difficile',
        title: { fr: 'Simulation de Delta Hedging', en: 'Delta Hedging Simulation' },
        description: { fr: 'Simulez le delta hedging quotidien d\'un short call sur 5 jours.', en: 'Simulate daily delta hedging of a short call over 5 days.' },
        steps: [
            {
                instruction: { fr: 'Short call ATM : S₀ = 100, K = 100, prime reçue = 5€. Jour 0 : Δ = 0.52. Acheter 52 actions. Bilan initial ?', en: 'Short ATM call: S₀ = 100, K = 100, premium received = €5. Day 0: Δ = 0.52. Buy 52 shares. Initial balance?' },
                solution: { fr: 'Reçu +5€ (prime). Payé -5200€ (52 actions × 100€). Financement net = -5195€ emprunté au taux r.', en: 'Received +€5 (premium). Paid -€5200 (52 shares × €100). Net financing = -€5195 borrowed at rate r.' }
            },
            {
                instruction: { fr: 'Jour 1 : S = 102, Δ = 0.58. Jour 2 : S = 99, Δ = 0.47. Quelles sont les transactions de rééquilibrage ?', en: 'Day 1: S = 102, Δ = 0.58. Day 2: S = 99, Δ = 0.47. What are the rebalancing transactions?' },
                solution: { fr: 'Jour 1 : besoin 58 actions, ai 52 → acheter 6 actions à 102€ = -612€. Jour 2 : besoin 47 actions, ai 58 → vendre 11 actions à 99€ = +1089€. Le rééquilibrage achète haut et vend bas → c\'est le gamma scalping à l\'envers (car on est short gamma).', en: 'Day 1: need 58 shares, have 52 → buy 6 shares at €102 = -€612. Day 2: need 47 shares, have 58 → sell 11 shares at €99 = +€1089. Rebalancing buys high and sells low → this is reverse gamma scalping (since we\'re short gamma).' }
            }
        ]
    }
];
