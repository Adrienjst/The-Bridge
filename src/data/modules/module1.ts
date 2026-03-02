import { CourseModule } from '../types';

export const module1: CourseModule = {
    id: 'bases-derives',
    number: 1,
    title: { fr: 'Bases en Dérivés', en: 'Derivatives Fundamentals' },
    subtitle: { fr: 'Options, Futures, Forwards & Swaps', en: 'Options, Futures, Forwards & Swaps' },
    description: {
        fr: 'Maîtrisez les fondamentaux des produits dérivés vanille : options call/put avec put-call parity, futures et forwards avec mécanismes de marge, swaps, et stratégies combinées. Inclut des études de cas professionnelles.',
        en: 'Master vanilla derivative fundamentals: call/put options with put-call parity, futures and forwards with margin mechanics, swaps, and combined strategies. Includes professional case studies.'
    },
    difficulty: 'débutant',
    duration: { fr: '2-3 semaines', en: '2-3 weeks' },
    icon: '📊',
    color: '#3b82f6',
    objectives: [
        { fr: 'Calculer le payoff et P&L d\'un call/put à maturité', en: 'Calculate call/put payoff and P&L at maturity' },
        { fr: 'Démontrer la put-call parity et créer des positions synthétiques', en: 'Prove put-call parity and create synthetic positions' },
        { fr: 'Comprendre le mécanisme des marges (initial, maintenance, variation)', en: 'Understand margin mechanics (initial, maintenance, variation)' },
        { fr: 'Tracer le P&L de stratégies avancées (straddle, butterfly, condor)', en: 'Draw P&L of advanced strategies (straddle, butterfly, condor)' },
        { fr: 'Maîtriser les mécanismes de swap (IRS, equity, cross-currency)', en: 'Master swap mechanics (IRS, equity, cross-currency)' },
    ],
    lessons: [
        {
            id: 'options-call-put',
            title: { fr: 'Options : Call & Put', en: 'Options: Call & Put' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Qu\'est-ce qu\'une option ?', en: 'What is an option?' },
                    body: {
                        fr: 'Une option est un contrat financier qui donne à son détenteur le **droit**, mais pas l\'obligation, d\'acheter (call) ou de vendre (put) un actif sous-jacent à un prix fixé à l\'avance (le **strike** ou prix d\'exercice), à une date donnée (option européenne) ou jusqu\'à une date donnée (option américaine).\n\nL\'acheteur de l\'option paie une **prime** au vendeur en échange de ce droit. Le vendeur (ou « writer ») s\'engage à respecter les termes du contrat si l\'acheteur décide d\'exercer son option.\n\n**Terminologie essentielle :**\n- **Sous-jacent (underlying)** : l\'actif de référence (action, indice, matière première)\n- **Strike (K)** : le prix d\'exercice convenu\n- **Maturité (T)** : la date d\'échéance\n- **Prime (premium)** : le prix payé pour acquérir l\'option\n- **Exercice** : l\'action d\'utiliser le droit conféré par l\'option',
                        en: 'An option is a financial contract that gives its holder the **right**, but not the obligation, to buy (call) or sell (put) an underlying asset at a predetermined price (the **strike** or exercise price), at a given date (European option) or up to a given date (American option).\n\nThe option buyer pays a **premium** to the seller in exchange for this right. The seller (or "writer") commits to honoring the contract terms if the buyer decides to exercise.\n\n**Essential terminology:**\n- **Underlying**: the reference asset (stock, index, commodity)\n- **Strike (K)**: the agreed exercise price\n- **Maturity (T)**: the expiration date\n- **Premium**: the price paid to acquire the option\n- **Exercise**: the act of using the right conferred by the option'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Moneyness : ITM, ATM, OTM', en: 'Moneyness: ITM, ATM, OTM' },
                    body: {
                        fr: 'La **moneyness** décrit la position du strike par rapport au spot :\n\n| | Call | Put |\n|---|---|---|\n| **ITM** (In-the-Money) | $S > K$ | $S < K$ |\n| **ATM** (At-the-Money) | $S \\approx K$ | $S \\approx K$ |\n| **OTM** (Out-of-the-Money) | $S < K$ | $S > K$ |\n\n**Valeur intrinsèque** :\n$$ \\text{VI}_{call} = \\max(S - K, 0) $$\n$$ \\text{VI}_{put} = \\max(K - S, 0) $$\n\n**Valeur temps** = Prime - Valeur intrinsèque\n\nUne option ATM n\'a pas de valeur intrinsèque mais a le plus de valeur temps. Une option deep OTM a une prime faible, composée uniquement de valeur temps.',
                        en: 'The **moneyness** describes the position of strike relative to spot:\n\n| | Call | Put |\n|---|---|---|\n| **ITM** (In-the-Money) | $S > K$ | $S < K$ |\n| **ATM** (At-the-Money) | $S \\approx K$ | $S \\approx K$ |\n| **OTM** (Out-of-the-Money) | $S < K$ | $S > K$ |\n\n**Intrinsic value** :\n$$ \\text{IV}_{call} = \\max(S - K, 0) $$\n$$ \\text{IV}_{put} = \\max(K - S, 0) $$\n\n**Time value** = Premium - Intrinsic value\n\nAn ATM option has no intrinsic value but maximum time value. A deep OTM option has a low premium, consisting entirely of time value.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Call Option', en: 'Call Option' },
                    body: {
                        fr: 'Donne le droit d\'**acheter** le sous-jacent au strike $K$.\n\n**Payoff à maturité** :\n$$ \\text{Payoff} = \\max(S - K, 0) $$\n\n**P&L** :\n$$ \\text{P\\&L} = \\max(S - K, 0) - \\text{Prime} $$\n\nL\'acheteur profite si $S > K + \\text{Prime}$ (breakeven). La perte est limitée à la prime. Le gain est théoriquement illimité.\n\nLe **vendeur** (short call) reçoit la prime mais s\'expose à une perte illimitée si le sous-jacent monte au-delà du strike.',
                        en: 'Gives the right to **buy** the underlying at strike $K$.\n\n**Payoff at maturity** :\n$$ \\text{Payoff} = \\max(S - K, 0) $$\n\n**P&L** :\n$$ \\text{P\\&L} = \\max(S - K, 0) - \\text{Premium} $$\n\nThe buyer profits when $S > K + \\text{Premium}$ (breakeven). Loss is limited to the premium. Gain is theoretically unlimited.\n\nThe **seller** (short call) receives the premium but faces unlimited loss if the underlying rises beyond the strike.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Put Option', en: 'Put Option' },
                    body: {
                        fr: 'Donne le droit de **vendre** le sous-jacent au strike $K$.\n\n**Payoff à maturité** :\n$$ \\text{Payoff} = \\max(K - S, 0) $$\n\n**P&L** :\n$$ \\text{P\\&L} = \\max(K - S, 0) - \\text{Prime} $$\n\nL\'acheteur profite si $S < K - \\text{Prime}$ (breakeven). Le gain maximal est $K - \\text{Prime}$ (si $S = 0$). La perte maximale est la prime.\n\nLe **vendeur** (short put) reçoit la prime mais s\'expose à une perte de $K - \\text{Prime}$ si le sous-jacent tombe à zéro.',
                        en: 'Gives the right to **sell** the underlying at strike $K$.\n\n**Payoff at maturity** :\n$$ \\text{Payoff} = \\max(K - S, 0) $$\n\n**P&L** :\n$$ \\text{P\\&L} = \\max(K - S, 0) - \\text{Premium} $$\n\nThe buyer profits when $S < K - \\text{Premium}$ (breakeven). Maximum gain is $K - \\text{Premium}$ (if $S = 0$). Maximum loss equals the premium.\n\nThe **seller** (short put) receives the premium but faces a loss of $K - \\text{Premium}$ if the underlying falls to zero.'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Payoffs fondamentaux', en: 'Fundamental payoffs' },
                    body: {
                        fr: '$$ \\text{Long Call P\\&L} = \\max(S - K, 0) - \\text{Prime} $$\n$$ \\text{Short Call P\\&L} = \\text{Prime} - \\max(S - K, 0) $$\n$$ \\text{Long Put P\\&L} = \\max(K - S, 0) - \\text{Prime} $$\n$$ \\text{Short Put P\\&L} = \\text{Prime} - \\max(K - S, 0) $$\n\n**Note** : Le payoff est la valeur brute à maturité. Le P&L inclut le coût initial (prime).',
                        en: '$$ \\text{Long Call P\\&L} = \\max(S - K, 0) - \\text{Premium} $$\n$$ \\text{Short Call P\\&L} = \\text{Premium} - \\max(S - K, 0) $$\n$$ \\text{Long Put P\\&L} = \\max(K - S, 0) - \\text{Premium} $$\n$$ \\text{Short Put P\\&L} = \\text{Premium} - \\max(K - S, 0) $$\n\n**Note**: Payoff is the gross value at maturity. P&L includes the initial cost (premium).'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Européenne vs Américaine', en: 'European vs American' },
                    body: {
                        fr: '**Option européenne** : exercice uniquement à la date de maturité T.\n**Option américaine** : exercice à tout moment entre l\'achat et T.\n\nUne américaine vaut au moins autant qu\'une européenne (droit supplémentaire). En pratique :\n- Pour un **call sans dividende**, il n\'est jamais optimal d\'exercer avant maturité → Call US = Call EU\n- Pour un **put**, l\'exercice anticipé peut être optimal (quand l\'option est deep ITM et que la valeur temps est négligeable)\n- Pour un **call avec dividendes**, l\'exercice juste avant le détachement du dividende peut être optimal\n\nLa plupart des options sur indices (dont EuroStoxx50) sont **européennes**.',
                        en: '**European option**: exercise only at maturity date T.\n**American option**: exercise at any time between purchase and T.\n\nAn American is worth at least as much as a European (additional right). In practice:\n- For a **call without dividends**, early exercise is never optimal → US Call = EU Call\n- For a **put**, early exercise can be optimal (when deep ITM and time value is negligible)\n- For a **call with dividends**, exercise just before the ex-dividend date can be optimal\n\nMost index options (including EuroStoxx50) are **European**.'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Exemple pratique détaillé', en: 'Detailed practical example' },
                    body: {
                        fr: 'Un gérant achète un call sur l\'action TotalEnergies :\n- Spot actuel : S₀ = 55€\n- Strike : K = 50€ (ITM)\n- Maturité : 3 mois\n- Prime : 7€ (dont 5€ de valeur intrinsèque + 2€ de valeur temps)\n\n**Scénarios à maturité :**\n• S = 65€ → Payoff = max(65-50, 0) = 15€ → P&L = 15 - 7 = **+8€** (+114%)\n• S = 55€ → Payoff = max(55-50, 0) = 5€ → P&L = 5 - 7 = **-2€** (-29%)\n• S = 50€ → Payoff = 0€ → P&L = -7€ (-100%)\n• S = 45€ → Payoff = 0€ → P&L = -7€ (-100%)\n\n**Breakeven** = K + Prime = 50 + 7 = **57€**\n\nNotez que le call ITM est plus cher mais offre une plus grande probabilité d\'expirer avec de la valeur.',
                        en: 'A fund manager buys a call on TotalEnergies stock:\n- Current spot: S₀ = €55\n- Strike: K = €50 (ITM)\n- Maturity: 3 months\n- Premium: €7 (including €5 intrinsic value + €2 time value)\n\n**Scenarios at maturity:**\n• S = €65 → Payoff = max(65-50, 0) = €15 → P&L = 15 - 7 = **+€8** (+114%)\n• S = €55 → Payoff = max(55-50, 0) = €5 → P&L = 5 - 7 = **-€2** (-29%)\n• S = €50 → Payoff = €0 → P&L = -€7 (-100%)\n• S = €45 → Payoff = €0 → P&L = -€7 (-100%)\n\n**Breakeven** = K + Premium = 50 + 7 = **€57**\n\nNote that the ITM call is more expensive but offers a higher probability of expiring with value.'
                    }
                }
            ]
        },
        {
            id: 'arbitrage-fondations',
            title: { fr: 'Fondements de l\'Arbitrage', en: 'Arbitrage Foundations' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'La Loi du Prix Unique', en: 'The Law of One Price' },
                    body: {
                        fr: 'La pierre angulaire des mathématiques financières est l\'**Absence d\'Opportunité d\'Arbitrage (AOA)**.\n\nUn arbitrage est une stratégie qui : coûte 0 à l\'instant initial (autofinancée), a une probabilité nulle de perdre de l\'argent à l\'avenir, et a une probabilité strictement positive de générer un profit. Dans un marché efficient, de telles opportunités n\'existent pas (elles sont instantanément gommées par l\'action des traders).\n\n**La Loi du Prix Unique** : Deux actifs (ou portefeuilles) qui génèrent exactement les mêmes flux de trésorerie futurs dans tous les états de la nature (tous les scénarios possibles) doivent avoir **exactement le même prix aujourd\'hui**.\nSi ce n\'est pas le cas, on achète le moins cher et on vend le plus cher à découvert pour un profit sans risque.',
                        en: 'The cornerstone of financial mathematics is the **No-Arbitrage Principle (No-Arbitrage Opportunity)**.\n\nAn arbitrage is a strategy that: costs 0 at inception (self-financing), has zero probability of losing money in the future, and has a strictly positive probability of generating a profit. In an efficient market, such opportunities do not exist (they are instantly arbitraged away by traders).\n\n**The Law of One Price**: Two assets (or portfolios) that generate exactly the same future cash flows in all states of nature (all possible scenarios) must have **exactly the same price today**.\nIf not, one buys the cheaper and short-sells the more expensive for a risk-free profit.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Pricing par Réplication', en: 'Pricing by Replication' },
                    body: {
                        fr: 'La conséquence directe de l\'AOA est le **Pricing par Réplication**. Si on veut connaître « le juste prix » d\'un produit dérivé, il suffit de construire un portefeuille dynamique avec des actifs simples (sous-jacent et actif sans risque) qui reproduit (réplique) exactement le payoff du dérivé dans tous les états du monde.\n\nPar la loi du prix unique, **le prix du dérivé DOIT être égal au coût de mise en place de ce portefeuille de réplication**.\nC\'est sur cette logique implacable que repose la Put-Call Parity et l\'ensemble du modèle de Black-Scholes et des arbres binomiaux.',
                        en: 'The direct consequence of the No-Arbitrage Principle is **Pricing by Replication**. If one wants to find the "fair price" of a derivative, one simply builds a dynamic portfolio with simple assets (underlying and risk-free asset) that exactly matches (replicates) the payoff of the derivative in all states of the world.\n\nBy the Law of One Price, **the price of the derivative MUST equal the setup cost of this replicating portfolio**.\nThis relentless logic is the foundation of Put-Call Parity, the binomial tree model, and the entire Black-Scholes framework.'
                    }
                }
            ]
        },
        {
            id: 'put-call-parity',
            title: { fr: 'Put-Call Parity', en: 'Put-Call Parity' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Le théorème fondamental', en: 'The fundamental theorem' },
                    body: {
                        fr: 'La **put-call parity** est une relation d\'arbitrage fondamentale qui relie le prix d\'un call européen au prix d\'un put européen de même strike et maturité.\n\nElle s\'écrit :\n\n$$ C - P = S_0 - K e^{-rT} $$\n\nOù $C$ = prix du call, $P$ = prix du put, $S_0$ = prix spot, $K$ = strike, $r$ = taux sans risque, $T$ = maturité.\n\n**Démonstration par réplication** :\nConsidérons deux portefeuilles :\n- **Portefeuille A** : Long Call + Dépôt de $K e^{-rT}$ au taux sans risque\n- **Portefeuille B** : Long Put + Long une action\n\nÀ maturité :\n- Si $S > K$ : Portefeuille A = $(S-K) + K = S$ ; Portefeuille B = $0 + S = S$\n- Si $S \\le K$ : Portefeuille A = $0 + K = K$ ; Portefeuille B = $(K-S) + S = K$\n\nLes deux portefeuilles ont **exactement** le même payoff dans tous les scénarios → ils doivent avoir le même prix (sinon arbitrage) :\n$$ C + K e^{-rT} = P + S_0 \\implies C - P = S_0 - K e^{-rT} $$',
                        en: 'The **put-call parity** is a fundamental arbitrage relationship linking the price of a European call to the price of a European put with the same strike and maturity.\n\nIt is written as:\n\n$$ C - P = S_0 - K e^{-rT} $$\n\nWhere $C$ = call price, $P$ = put price, $S_0$ = spot price, $K$ = strike, $r$ = risk-free rate, $T$ = maturity.\n\n**Proof by replication**:\nConsider two portfolios:\n- **Portfolio A**: Long Call + Deposit $K e^{-rT}$ at risk-free rate\n- **Portfolio B**: Long Put + Long one share\n\nAt maturity:\n- If $S > K$: Portfolio A = $(S-K) + K = S$; Portfolio B = $0 + S = S$\n- If $S \\le K$: Portfolio A = $0 + K = K$; Portfolio B = $(K-S) + S = K$\n\nBoth portfolios have **exactly** the same payoff in all scenarios → they must have the same price (otherwise arbitrage):\n$$ C + K e^{-rT} = P + S_0 \\implies C - P = S_0 - K e^{-rT} $$'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Positions synthétiques', en: 'Synthetic positions' },
                    body: {
                        fr: 'La put-call parity permet de créer des positions **synthétiques** :\n\n• **Synthetic Long Stock** = Long Call + Short Put (même K,T) + emprunt $K e^{-rT}$\n• **Synthetic Long Call** = Long Put + Long Stock - emprunt $K e^{-rT}$\n• **Synthetic Long Put** = Long Call - Long Stock + dépôt $K e^{-rT}$\n\n**Application pratique** : si le call est moins cher que le synthétique, il existe une opportunité d\'arbitrage (conversion/reversal).\n\n**Avec dividendes** (taux continu $q$) :\n$$ C - P = S_0 e^{-qT} - K e^{-rT} $$',
                        en: 'Put-call parity allows creating **synthetic** positions:\n\n• **Synthetic Long Stock** = Long Call + Short Put (same K,T) + borrow $K e^{-rT}$\n• **Synthetic Long Call** = Long Put + Long Stock - borrow $K e^{-rT}$\n• **Synthetic Long Put** = Long Call - Long Stock + deposit $K e^{-rT}$\n\n**Practical application**: if the call is cheaper than the synthetic, an arbitrage opportunity exists (conversion/reversal).\n\n**With dividends** (continuous yield $q$):\n$$ C - P = S_0 e^{-qT} - K e^{-rT} $$'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Détection d\'arbitrage', en: 'Arbitrage detection' },
                    body: {
                        fr: 'Action ABC à 100€, K = 100€, T = 1 an, r = 5%.\n\nCall coté à 12€, Put coté à 5€.\n\nVérification : C - P = 12 - 5 = 7€\nS₀ - K×e^(-rT) = 100 - 100×e^(-0.05) = 100 - 95.12 = 4.88€\n\n7€ ≠ 4.88€ → **Opportunité d\'arbitrage !**\n\nLe call est trop cher (ou le put trop bon marché). Stratégie :\n- Short Call (-12€) + Long Put (+5€) + Long Stock (+100€) = -93€ empruntés\n- À maturité : remboursement = 93 × e^(0.05) = 97.77€\n- Payoff du portefeuille (put+stock-call) = K = 100€ dans tous les cas\n- Profit = 100 - 97.77 = **2.23€ sans risque**',
                        en: 'Stock ABC at €100, K = €100, T = 1 year, r = 5%.\n\nCall quoted at €12, Put quoted at €5.\n\nCheck: C - P = 12 - 5 = €7\nS₀ - K×e^(-rT) = 100 - 100×e^(-0.05) = 100 - 95.12 = €4.88\n\n€7 ≠ €4.88 → **Arbitrage opportunity!**\n\nThe call is too expensive (or put too cheap). Strategy:\n- Short Call (-€12) + Long Put (+€5) + Long Stock (+€100) = -€93 borrowed\n- At maturity: repayment = 93 × e^(0.05) = €97.77\n- Portfolio payoff (put+stock-call) = K = €100 in all cases\n- Profit = 100 - 97.77 = **€2.23 risk-free**'
                    }
                }
            ]
        },
        {
            id: 'futures-forwards',
            title: { fr: 'Futures & Forwards', en: 'Futures & Forwards' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Contrats à terme', en: 'Forward contracts' },
                    body: {
                        fr: 'Un **forward** est un accord entre deux parties pour acheter/vendre un actif à un prix convenu (le **prix forward**) à une date future. C\'est un contrat OTC (de gré à gré).\n\nUn **future** est un forward standardisé négocié sur un marché organisé, avec un système de **margin** (appels de marge quotidiens) qui élimine le risque de contrepartie grâce à la **chambre de compensation** (clearinghouse).',
                        en: 'A **forward** is an agreement between two parties to buy/sell an asset at an agreed price (the **forward price**) at a future date. It is an OTC (over-the-counter) contract.\n\nA **future** is a standardized forward traded on an organized exchange, with a **margin** system (daily margin calls) that eliminates counterparty risk through the **clearinghouse**.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Mécanisme des marges', en: 'Margin mechanics' },
                    body: {
                        fr: '**Marge initiale (Initial margin)** : dépôt de garantie requis à l\'ouverture de la position (typ. 5-15% du notionnel).\n\n**Marge de maintenance** : seuil minimum. Si la marge tombe en dessous → **appel de marge** (margin call).\n\n**Mark-to-market quotidien** : chaque jour, les gains/pertes sont calculés et crédités/débités du compte de marge.\n\n**Exemple** : Achat 1 future CAC40 à 7500, multiplicateur 10€/point.\n- Notionnel = 7500 × 10 = 75 000€\n- Marge initiale = 7 500€ (10%)\n- Marge de maintenance = 5 625€\n- Jour 1 : CAC = 7450 → Perte = 50 × 10 = 500€ → Marge = 7 000€\n- Jour 2 : CAC = 7350 → Perte = 100 × 10 = 1 000€ → Marge = 6 000€\n- Jour 3 : CAC = 7200 → Perte = 150 × 10 = 1 500€ → Marge = 4 500€ < 5 625€ → **Appel de marge !**',
                        en: '**Initial margin**: security deposit required when opening a position (typically 5-15% of notional).\n\n**Maintenance margin**: minimum threshold. If margin falls below → **margin call**.\n\n**Daily mark-to-market**: each day, gains/losses are calculated and credited/debited to the margin account.\n\n**Example**: Buy 1 CAC40 future at 7500, multiplier €10/point.\n- Notional = 7500 × 10 = €75,000\n- Initial margin = €7,500 (10%)\n- Maintenance margin = €5,625\n- Day 1: CAC = 7450 → Loss = 50 × 10 = €500 → Margin = €7,000\n- Day 2: CAC = 7350 → Loss = 100 × 10 = €1,000 → Margin = €6,000\n- Day 3: CAC = 7200 → Loss = 150 × 10 = €1,500 → Margin = €4,500 < €5,625 → **Margin call!**'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Prix Forward (Cost of Carry)', en: 'Forward Price (Cost of Carry)' },
                    body: {
                        fr: '$$ F = S_0 e^{(r - q)T} $$\n\noù : $S_0$ = prix spot, $r$ = taux sans risque, $q$ = taux de dividende continu, $T$ = maturité en années\n\n**Contango** : $F > S$ ($r > q$) — situation normale\n**Backwardation** : $F < S$ ($r < q$) — quand les dividendes dépassent le coût de financement\n\n**Basis** = Spot - Future = $S - F$\nÀ maturité, la basis converge vers zéro (convergence principe).',
                        en: '$$ F = S_0 e^{(r - q)T} $$\n\nwhere: $S_0$ = spot price, $r$ = risk-free rate, $q$ = continuous dividend yield, $T$ = maturity in years\n\n**Contango**: $F > S$ ($r > q$) — normal situation\n**Backwardation**: $F < S$ ($r < q$) — when dividends exceed financing cost\n\n**Basis** = Spot - Future = $S - F$\nAt maturity, basis converges to zero (convergence principle).'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Exemple numérique', en: 'Numerical example' },
                    body: {
                        fr: 'EuroStoxx50 à S₀ = 4200, r = 3.5%, q = 2.8%, T = 6 mois.\n\nF = 4200 × e^((0.035 - 0.028) × 0.5) = 4200 × e^(0.0035) ≈ 4214.7\n\nLe future est en léger **contango** (F > S) car r > q.\n\nSi demain le spot passe à 4250 :\n- Gain long future = (4250 - 4200) × 10€ = 500€ crédité immédiatement (mark-to-market)',
                        en: 'EuroStoxx50 at S₀ = 4200, r = 3.5%, q = 2.8%, T = 6 months.\n\nF = 4200 × e^((0.035 - 0.028) × 0.5) = 4200 × e^(0.0035) ≈ 4214.7\n\nThe future is in slight **contango** (F > S) because r > q.\n\nIf tomorrow spot moves to 4250:\n- Long future gain = (4250 - 4200) × €10 = €500 credited immediately (mark-to-market)'
                    }
                }
            ]
        },
        {
            id: 'swaps',
            title: { fr: 'Swaps', en: 'Swaps' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Qu\'est-ce qu\'un swap ?', en: 'What is a swap?' },
                    body: {
                        fr: 'Un **swap** est un contrat OTC dans lequel deux parties échangent des flux de trésorerie (cash flows) selon des règles prédéfinies sur une période donnée.\n\n**Types principaux :**\n• **Interest Rate Swap (IRS)** : échange taux fixe contre taux variable (EURIBOR, SOFR)\n• **Equity Swap** : échange rendement d\'un indice/action contre taux fixe ou variable\n• **Cross-Currency Swap** : échange de flux dans deux devises différentes\n• **Total Return Swap (TRS)** : échange du rendement total d\'un actif contre un taux\n\n**Valorisation** : un IRS peut être vu comme un portefeuille de deux obligations — une à taux fixe et une à taux variable. La valeur du swap = VA(jambe fixe) - VA(jambe variable).',
                        en: 'A **swap** is an OTC contract in which two parties exchange cash flows according to predefined rules over a given period.\n\n**Main types:**\n• **Interest Rate Swap (IRS)**: exchange fixed rate for floating rate (EURIBOR, SOFR)\n• **Equity Swap**: exchange return of an index/stock for fixed or floating rate\n• **Cross-Currency Swap**: exchange of cash flows in two different currencies\n• **Total Return Swap (TRS)**: exchange of total return of an asset for a rate\n\n**Valuation**: an IRS can be viewed as a portfolio of two bonds — one fixed-rate and one floating-rate. Swap value = PV(fixed leg) - PV(floating leg).'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Equity Swap en structuration', en: 'Equity Swap in structuring' },
                    body: {
                        fr: 'L\'equity swap est fondamental en structuration :\n\n**Mécanisme** : Partie A paie le rendement total de l\'EuroStoxx50 et reçoit EURIBOR 3M + spread de Partie B.\n\n**Utilisation** :\n- Obtenir une exposition synthétique à un indice sans le détenir\n- Éviter les coûts de transaction et les problèmes de custody\n- Modifier la fiscalité (synthétique vs physique)\n- Le structureur utilise l\'equity swap comme brique de base pour construire des produits\n\n**Risques** : risque de contrepartie (pas de clearinghouse), risque de base, risque de funding.',
                        en: 'The equity swap is fundamental in structuring:\n\n**Mechanism**: Party A pays the total return of the EuroStoxx50 and receives EURIBOR 3M + spread from Party B.\n\n**Usage**:\n- Obtain synthetic exposure to an index without owning it\n- Avoid transaction costs and custody issues\n- Modify tax treatment (synthetic vs physical)\n- The structurer uses the equity swap as a building block for products\n\n**Risks**: counterparty risk (no clearinghouse), basis risk, funding risk.'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Exemple d\'IRS', en: 'IRS example' },
                    body: {
                        fr: 'Banque A paie taux fixe 2.5% et reçoit EURIBOR 3M de Banque B, notionnel 100M€, 5 ans.\n\nÀ chaque fixing trimestriel :\n- Si EURIBOR = 3.0% → Résultat net A : (3.0% - 2.5%) × 100M × (90/360) = **+125 000€**\n- Si EURIBOR = 2.0% → Résultat net A : (2.0% - 2.5%) × 100M × (90/360) = **-125 000€**\n\n**Note** : seul le montant net est échangé (netting), pas les deux flux bruts.',
                        en: 'Bank A pays fixed rate 2.5% and receives EURIBOR 3M from Bank B, notional €100M, 5 years.\n\nAt each quarterly fixing:\n- If EURIBOR = 3.0% → Net result A: (3.0% - 2.5%) × 100M × (90/360) = **+€125,000**\n- If EURIBOR = 2.0% → Net result A: (2.0% - 2.5%) × 100M × (90/360) = **-€125,000**\n\n**Note**: only the net amount is exchanged (netting), not both gross flows.'
                    }
                }
            ]
        },
        {
            id: 'strategies-options',
            title: { fr: 'Stratégies d\'Options', en: 'Option Strategies' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Combiner les options', en: 'Combining options' },
                    body: {
                        fr: 'Les stratégies d\'options combinent plusieurs options (et éventuellement le sous-jacent) pour créer des profils de risque/rendement spécifiques. Elles sont la base de la structuration.',
                        en: 'Option strategies combine multiple options (and possibly the underlying) to create specific risk/return profiles. They form the foundation of structuring.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Covered Call & Protective Put', en: 'Covered Call & Protective Put' },
                    body: {
                        fr: '**Covered Call** : Long sous-jacent + Short Call\n- Vue : neutre à modérément haussière\n- Objectif : générer un revenu (prime) en sacrifiant le potentiel de hausse\n- P\\&L = $S - S_0 + \\text{Prime}_{call} - \\max(S - K, 0)$\n\n**Protective Put** : Long sous-jacent + Long Put\n- Vue : haussière avec protection\n- Objectif : limiter la baisse en gardant le potentiel de hausse\n- P\\&L = $S - S_0 - \\text{Prime}_{put} + \\max(K - S, 0)$\n- Équivalent à un long call synthétique à la prime du put près',
                        en: '**Covered Call**: Long underlying + Short Call\n- View: neutral to moderately bullish\n- Objective: generate income (premium) by sacrificing upside potential\n- P\\&L = $S - S_0 + \\text{Premium}_{call} - \\max(S - K, 0)$\n\n**Protective Put**: Long underlying + Long Put\n- View: bullish with protection\n- Objective: limit downside while keeping upside potential\n- P\\&L = $S - S_0 - \\text{Premium}_{put} + \\max(K - S, 0)$\n- Equivalent to a synthetic long call up to the put premium'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Straddle & Strangle', en: 'Straddle & Strangle' },
                    body: {
                        fr: '**Long Straddle** : Long Call ATM + Long Put ATM (même K)\n- Vue : forte **volatilité** attendue (direction inconnue)\n- Breakevens : K ± (Prime call + Prime put)\n- Perte max = somme des primes, gain illimité\n\n**Long Strangle** : Long Call OTM (K₂) + Long Put OTM (K₁), K₁ < K₂\n- Vue : forte volatilité, moins cher que le straddle\n- Breakevens : K₁ - primes et K₂ + primes\n- Plus large zone de perte max mais coût inférieur\n\n**Short Straddle/Strangle** : vue inverse, on vend la volatilité. Très risqué mais génère les primes.',
                        en: '**Long Straddle**: Long ATM Call + Long ATM Put (same K)\n- View: high **volatility** expected (direction unknown)\n- Breakevens: K ± (Call premium + Put premium)\n- Max loss = sum of premiums, unlimited gain\n\n**Long Strangle**: Long OTM Call (K₂) + Long OTM Put (K₁), K₁ < K₂\n- View: high volatility, cheaper than straddle\n- Breakevens: K₁ - premiums and K₂ + premiums\n- Wider max loss zone but lower cost\n\n**Short Straddle/Strangle**: opposite view, selling volatility. Very risky but generates premiums.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Spreads : Bull, Bear, Butterfly', en: 'Spreads: Bull, Bear, Butterfly' },
                    body: {
                        fr: '**Bull Call Spread** : Long Call (K₁) + Short Call (K₂), K₁ < K₂\n- Gain max = K₂ - K₁ - prime nette\n- Perte max = prime nette\n\n**Bear Put Spread** : Long Put (K₂) + Short Put (K₁), K₁ < K₂\n- Gain max = K₂ - K₁ - prime nette\n- Perte max = prime nette\n\n**Butterfly** : Long 1 Call(K₁) + Short 2 Call(K₂) + Long 1 Call(K₃)\n- K₂ = (K₁+K₃)/2\n- Vue : spot reste proche de K₂ (faible volatilité)\n- Gain max = K₂ - K₁ - prime nette\n- Coût limité, perte limitée\n\n**Condor** : comme le butterfly mais avec 4 strikes différents → zone de profit plus large.',
                        en: '**Bull Call Spread**: Long Call (K₁) + Short Call (K₂), K₁ < K₂\n- Max gain = K₂ - K₁ - net premium\n- Max loss = net premium\n\n**Bear Put Spread**: Long Put (K₂) + Short Put (K₁), K₁ < K₂\n- Max gain = K₂ - K₁ - net premium\n- Max loss = net premium\n\n**Butterfly**: Long 1 Call(K₁) + Short 2 Call(K₂) + Long 1 Call(K₃)\n- K₂ = (K₁+K₃)/2\n- View: spot stays near K₂ (low volatility)\n- Max gain = K₂ - K₁ - net premium\n- Limited cost, limited loss\n\n**Condor**: like butterfly but with 4 different strikes → wider profit zone.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Collar', en: 'Collar' },
                    body: {
                        fr: '**Position** : Long sous-jacent + Long Put ($K_1$) + Short Call ($K_2$)\n$$ K_1 < S_0 < K_2 $$\n\n**Vue de marché** : modérément haussière, coût de protection réduit\n**Objectif** : la prime du call vendu finance (partiellement) le put acheté → **zero-cost collar** si les deux primes s\'annulent.\n\nC\'est exactement la structure d\'un **produit à capital protégé avec cap** ! Le collar est la brique fondamentale de nombreux structurés.\n\nP\\&L borné entre : $-(S_0-K_1)$ et $+(K_2-S_0)$, ajusté des primes.',
                        en: '**Position**: Long underlying + Long Put ($K_1$) + Short Call ($K_2$)\n$$ K_1 < S_0 < K_2 $$\n\n**Market view**: moderately bullish, reduced protection cost\n**Objective**: Call premium (partially) finances the purchased put → **zero-cost collar** if both premiums offset.\n\nThis is exactly the structure of a **capped capital-protected product**! The collar is the fundamental building block of many structured products.\n\nP\\&L bounded between: $-(S_0-K_1)$ and $+(K_2-S_0)$, adjusted for premiums.'
                    }
                }
            ]
        },
        {
            id: 'markets-mechanics',
            title: { fr: 'Marchés & Mécanismes', en: 'Markets & Mechanics' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Exchange vs OTC', en: 'Exchange vs OTC' },
                    body: {
                        fr: '**Marché organisé (Exchange)** :\n- Contrats standardisés (taille, maturité, sous-jacent)\n- Chambre de compensation (LCH, Eurex Clearing) élimine le risque de contrepartie\n- Transparence des prix (order book visible)\n- Exemples : Eurex (Europe), CME (US), ICE\n\n**Marché OTC (Over-the-Counter)** :\n- Contrats sur mesure (taille, maturité, conditions spécifiques)\n- Risque de contrepartie bilatéral (atténué par les CSA/ISDA)\n- Moins de transparence (prix indicatifs, request-for-quote)\n- Représente ~80% du marché des dérivés en notionnel\n\n**Depuis 2008** : régulation accrue (EMIR en Europe, Dodd-Frank aux US) → compensation obligatoire pour certains dérivés OTC standardisés, reporting obligatoire.',
                        en: '**Organized market (Exchange)**:\n- Standardized contracts (size, maturity, underlying)\n- Clearinghouse (LCH, Eurex Clearing) eliminates counterparty risk\n- Price transparency (visible order book)\n- Examples: Eurex (Europe), CME (US), ICE\n\n**OTC (Over-the-Counter) market**:\n- Customized contracts (size, maturity, specific conditions)\n- Bilateral counterparty risk (mitigated by CSA/ISDA)\n- Less transparency (indicative prices, request-for-quote)\n- Represents ~80% of the derivatives market by notional\n\n**Since 2008**: increased regulation (EMIR in Europe, Dodd-Frank in US) → mandatory clearing for certain standardized OTC derivatives, mandatory reporting.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'ISDA & CSA', en: 'ISDA & CSA' },
                    body: {
                        fr: '**ISDA Master Agreement** : contrat cadre standard qui régit les transactions OTC entre deux contreparties. Définit les événements de crédit, le netting, la juridiction.\n\n**CSA (Credit Support Annex)** : annexe à l\'ISDA qui définit les règles de **collatéral** (marge bilatérale) :\n- Seuil de transfert (threshold)\n- Minimum transfer amount\n- Eligible collateral (cash, government bonds)\n- Frequence de réévaluation (quotidienne)\n\nLe CSA réduit le risque de contrepartie en exigeant le dépôt de collatéral quand la valeur mark-to-market du portefeuille de dérivés dépasse un seuil.',
                        en: '**ISDA Master Agreement**: standard framework contract governing OTC transactions between two counterparties. Defines credit events, netting, jurisdiction.\n\n**CSA (Credit Support Annex)**: annex to ISDA defining **collateral** rules (bilateral margin):\n- Transfer threshold\n- Minimum transfer amount\n- Eligible collateral (cash, government bonds)\n- Revaluation frequency (daily)\n\nThe CSA reduces counterparty risk by requiring collateral posting when the mark-to-market value of the derivatives portfolio exceeds a threshold.'
                    }
                }
            ]
        },
        {
            id: 'case-study-hedging',
            title: { fr: 'Case Study : Couverture de Portefeuille', en: 'Case Study: Portfolio Hedging' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'Couvrir un portefeuille de 50M€', en: 'Hedging a €50M portfolio' },
                    body: {
                        fr: '**Contexte** : Un gérant de fonds détient un portefeuille actions européennes de 50M€, beta = 1.05 par rapport à l\'EuroStoxx50. Il anticipe une correction possible dans les 3 prochains mois mais ne veut pas vendre ses positions.\n\n**Objectif** : protéger 90% de la valeur du portefeuille (floor à 45M€).\n\n**Solution 1 : Protective Put avec futures**\n- EuroStoxx50 = 4200, multiplicateur = 10€/point\n- Notionnel d\'un future = 4200 × 10 = 42 000€\n- Nombre de futures à vendre = 50M × 1.05 / 42 000 = **1 250 futures**\n- Problème : cette solution élimine aussi le potentiel de hausse !\n\n**Solution 2 : Achat de puts OTM sur l\'indice**\n- Put strike 3780 (= 4200 × 0.90), maturité 3 mois\n- Prime = 85 points = 85 × 10 = 850€ par contrat\n- Nombre de puts = 1 250\n- Coût total = 1 250 × 850 = **1 062 500€** (2.1% du portefeuille)\n- Protection : si EuroStoxx50 chute de 20% (à 3360), perte sur portefeuille ≈ 10.5M€, mais gain sur puts ≈ 1 250 × (3780-3360) × 10 = **5.25M€**, perte nette limitée à ~5.25M€ + coût des puts.\n\n**Solution 3 : Collar zero-cost**\n- Long Put K₁ = 3780 + Short Call K₂ = 4620 (110%)\n- Prime put ≈ prime call → coût net ≈ 0\n- Protection à la baisse sous 3780 (cap sur le gain au-dessus de 4620)\n\n**Leçon clé** : Il n\'y a pas de protection gratuite. Chaque stratégie implique un trade-off entre coût de protection, niveau de floor, et potentiel de participation à la hausse.',
                        en: '**Context**: A fund manager holds a €50M European equity portfolio, beta = 1.05 relative to EuroStoxx50. He anticipates a possible correction in the next 3 months but doesn\'t want to sell positions.\n\n**Objective**: protect 90% of portfolio value (floor at €45M).\n\n**Solution 1: Protective Put with futures**\n- EuroStoxx50 = 4200, multiplier = €10/point\n- One future notional = 4200 × 10 = €42,000\n- Number of futures to sell = 50M × 1.05 / 42,000 = **1,250 futures**\n- Problem: this eliminates upside potential too!\n\n**Solution 2: Buy OTM index puts**\n- Put strike 3780 (= 4200 × 0.90), maturity 3 months\n- Premium = 85 points = 85 × 10 = €850 per contract\n- Number of puts = 1,250\n- Total cost = 1,250 × 850 = **€1,062,500** (2.1% of portfolio)\n- Protection: if EuroStoxx50 drops 20% (to 3360), portfolio loss ≈ €10.5M, but put gain ≈ 1,250 × (3780-3360) × 10 = **€5.25M**, net loss limited to ~€5.25M + put cost.\n\n**Solution 3: Zero-cost collar**\n- Long Put K₁ = 3780 + Short Call K₂ = 4620 (110%)\n- Put premium ≈ call premium → net cost ≈ 0\n- Downside protection below 3780 (cap on gain above 4620)\n\n**Key lesson**: There is no free protection. Each strategy involves a trade-off between protection cost, floor level, and upside participation.'
                    }
                }
            ]
        },
        {
            id: 'case-study-socgen',
            title: { fr: 'Case Study : Société Générale 2008', en: 'Case Study: Société Générale 2008' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'L\'affaire Kerviel', en: 'The Kerviel affair' },
                    body: {
                        fr: '**Contexte** : En janvier 2008, Société Générale annonce une perte de **4.9 milliards d\'euros** causée par des positions non autorisées prises par le trader Jérôme Kerviel sur la desk Delta One (arbitrage futures/indices).\n\n**Les faits** :\n- Kerviel détenait des positions directionnelles massives sur futures sur indices européens (DAX, EuroStoxx50, FTSE)\n- Positions notionnelles atteignant **~50 milliards d\'euros** (supérieur à la capitalisation de la banque !)\n- Les positions étaient masquées par des transactions fictives en couverture\n- La fraude a été découverte le 18 janvier 2008\n\n**Le débouclage** :\n- SG a dû liquider les positions sur 3 jours (21-23 janvier 2008)\n- Ces ventes massives ont contribué à un crash du marché (-6% sur l\'EuroStoxx50)\n- Le débouclage en urgence a amplifié les pertes\n\n**Leçons pour la structuration** :\n1. **Risque opérationnel** : les contrôles front-office doivent vérifier les positions nettes ET brutes\n2. **Risque de liquidité** : déboucler une position massive force le marché contre vous (market impact)\n3. **Ségrégation des fonctions** : front/middle/back office doivent être indépendants\n4. **Limites de position** : chaque desk a des limites de risque (VaR, notionnel, Greeks) strictement contrôlées\n5. **Delta hedging** : même un book apparemment couvert peut exploser si les couvertures sont fictives',
                        en: '**Context**: In January 2008, Société Générale announced a **€4.9 billion loss** caused by unauthorized positions taken by trader Jérôme Kerviel on the Delta One desk (futures/index arbitrage).\n\n**The facts**:\n- Kerviel held massive directional positions on European index futures (DAX, EuroStoxx50, FTSE)\n- Notional positions reaching **~€50 billion** (exceeding the bank\'s market cap!)\n- Positions were masked by fictitious hedging transactions\n- The fraud was discovered on January 18, 2008\n\n**The unwinding**:\n- SG had to liquidate positions over 3 days (January 21-23, 2008)\n- These massive sales contributed to a market crash (-6% on EuroStoxx50)\n- The emergency unwinding amplified losses\n\n**Lessons for structuring**:\n1. **Operational risk**: front-office controls must verify net AND gross positions\n2. **Liquidity risk**: unwinding a massive position forces the market against you (market impact)\n3. **Segregation of duties**: front/middle/back office must be independent\n4. **Position limits**: each desk has strictly controlled risk limits (VaR, notional, Greeks)\n5. **Delta hedging**: even an apparently hedged book can blow up if hedges are fictitious'
                    }
                }
            ]
        }
    ]
};
