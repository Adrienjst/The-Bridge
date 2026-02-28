"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module3 = void 0;
exports.module3 = {
    id: 'equity-exotiques',
    number: 3,
    title: { fr: 'Options Exotiques', en: 'Exotic Options' },
    subtitle: { fr: 'Barrières, Digitales, Asiatiques, Basket, Quanto', en: 'Barriers, Digitals, Asians, Basket, Quanto' },
    description: {
        fr: 'Plongez dans les options exotiques path-dependent : barrières avec monitoring, digitales et leur réplication, asiatiques et averaging, basket et corrélation, quanto et protection de change. Inclut le programme EMTN.',
        en: 'Dive into path-dependent exotic options: barriers with monitoring, digitals and replication, Asians and averaging, basket and correlation, quanto and currency protection. Includes the EMTN programme.'
    },
    difficulty: 'avancé',
    duration: { fr: '3-4 semaines', en: '3-4 weeks' },
    icon: '🔮',
    color: '#f59e0b',
    objectives: [
        { fr: 'Distinguer les 8 types de barrières (up/down, in/out, call/put)', en: 'Distinguish the 8 barrier types (up/down, in/out, call/put)' },
        { fr: 'Répliquer une digitale par un call spread étroit', en: 'Replicate a digital via tight call spread' },
        { fr: 'Comprendre l\'impact de la corrélation sur les worst-of', en: 'Understand correlation impact on worst-of products' },
        { fr: 'Maîtriser le mécanisme EMTN de l\'émission aux final terms', en: 'Master the EMTN mechanism from issuance to final terms' },
    ],
    lessons: [
        {
            id: 'options-barrieres',
            title: { fr: 'Options à Barrière', en: 'Barrier Options' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Les 8 types de barrières', en: 'The 8 barrier types' },
                    body: {
                        fr: 'Une **option à barrière** est une option vanille dont l\'existence dépend du franchissement d\'un niveau de prix (la barrière) par le sous-jacent.\n\n**Knock-In (KI)** : option qui n\'existe que si la barrière est touchée\n**Knock-Out (KO)** : option qui cesse d\'exister si la barrière est touchée\n\n**Les 8 combinaisons** :\n| Type | Direction | Activation |\n|------|-----------|------------|\n| Down-and-In Call | Barrière < Spot | KI quand S ↓ sous H |\n| Down-and-Out Call | Barrière < Spot | KO quand S ↓ sous H |\n| Up-and-In Call | Barrière > Spot | KI quand S ↑ au-dessus de H |\n| Up-and-Out Call | Barrière > Spot | KO quand S ↑ au-dessus de H |\n| Down-and-In Put | Barrière < Spot | KI quand S ↓ sous H |\n| Down-and-Out Put | Barrière < Spot | KO quand S ↓ sous H |\n| Up-and-In Put | Barrière > Spot | KI quand S ↑ au-dessus de H |\n| Up-and-Out Put | Barrière > Spot | KO quand S ↑ au-dessus de H |\n\n**Relation fondamentale** : Knock-In + Knock-Out = Vanille\n(même strike, même barrière, même maturité)',
                        en: 'A **barrier option** is a vanilla option whose existence depends on the underlying crossing a price level (the barrier).\n\n**Knock-In (KI)**: option that only exists if the barrier is touched\n**Knock-Out (KO)**: option that ceases to exist if the barrier is touched\n\n**The 8 combinations**:\n| Type | Direction | Activation |\n|------|-----------|------------|\n| Down-and-In Call | Barrier < Spot | KI when S ↓ below H |\n| Down-and-Out Call | Barrier < Spot | KO when S ↓ below H |\n| Up-and-In Call | Barrier > Spot | KI when S ↑ above H |\n| Up-and-Out Call | Barrier > Spot | KO when S ↑ above H |\n| Down-and-In Put | Barrier < Spot | KI when S ↓ below H |\n| Down-and-Out Put | Barrier < Spot | KO when S ↓ below H |\n| Up-and-In Put | Barrier > Spot | KI when S ↑ above H |\n| Up-and-Out Put | Barrier > Spot | KO when S ↑ above H |\n\n**Fundamental relation**: Knock-In + Knock-Out = Vanilla\n(same strike, same barrier, same maturity)'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Monitoring : continu vs discret', en: 'Monitoring: continuous vs discrete' },
                    body: {
                        fr: '**Monitoring continu** : la barrière est observée à chaque instant (en pratique, chaque tick de marché). Une option KO continue est moins chère qu\'une KO discrète car la probabilité de knock-out est plus élevée.\n\n**Monitoring discret** : la barrière n\'est observée qu\'à des dates fixes (quotidien, hebdomadaire, mensuel, ou à maturité seulement). Plus le monitoring est rare, plus l\'option à barrière se rapproche de la vanille.\n\n**Window barrier** : la barrière n\'est active que pendant une fenêtre temporelle spécifique.\n\n**Impact pricing** : passage du continu au discret quotidien augmente le prix d\'une KO d\'environ:\n\n$$ \\Delta P \\approx 0.5826 \\times \\sigma \\times \\sqrt{\\frac{\\Delta t}{T}} \\times (\\text{impact barrière}) $$\n\nEn pratique, $\\sim 0.5\\%-2\\%$ du prix.',
                        en: '**Continuous monitoring**: barrier observed at every instant (in practice, every market tick). A continuous KO is cheaper than discrete KO because knock-out probability is higher.\n\n**Discrete monitoring**: barrier only observed at fixed dates (daily, weekly, monthly, or at maturity only). The less frequent the monitoring, the closer the barrier option is to vanilla.\n\n**Window barrier**: barrier only active during a specific time window.\n\n**Pricing impact**: moving from continuous to daily discrete increases a KO price by approximately:\n\n$$ \\Delta P \\approx 0.5826 \\times \\sigma \\times \\sqrt{\\frac{\\Delta t}{T}} \\times (\\text{barrier impact}) $$\n\nIn practice, $\\sim 0.5\\%-2\\%$ of the price.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Rebate', en: 'Rebate' },
                    body: {
                        fr: 'Un **rebate** est un paiement fixe versé à l\'acheteur d\'une option KO si la barrière est franchie (et l\'option « meurt »). Il compense partiellement la perte du droit d\'option.\n\nExemple : Call KO avec barrière haute H = 120, rebate = 5%.\nSi S touche 120, l\'option disparaît mais l\'acheteur reçoit 5%.\n\nLe rebate est payé soit immédiatement (at hit) soit à maturité (at expiry). Le « at hit » est plus courant et plus cher.',
                        en: 'A **rebate** is a fixed payment made to the buyer of a KO option if the barrier is breached (and the option "dies"). It partially compensates for the loss of the option right.\n\nExample: Call KO with upper barrier H = 120, rebate = 5%.\nIf S touches 120, the option disappears but the buyer receives 5%.\n\nThe rebate is paid either immediately (at hit) or at maturity (at expiry). "At hit" is more common and more expensive.'
                    }
                }
            ]
        },
        {
            id: 'options-digitales',
            title: { fr: 'Options Digitales (Binaires)', en: 'Digital (Binary) Options' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Cash-or-nothing et asset-or-nothing', en: 'Cash-or-nothing and asset-or-nothing' },
                    body: {
                        fr: '**Cash-or-nothing** : paie un montant fixe $Q$ si la condition est remplie.\n$$ \\text{Payoff} = Q \\times \\mathbb{1}_{\\{S_T > K\\}} \\text{ (digital call)} \\quad \\text{ou} \\quad Q \\times \\mathbb{1}_{\\{S_T < K\\}} \\text{ (digital put)} $$\n\n**Asset-or-nothing** : paie la valeur du sous-jacent si la condition est remplie.\n$$ \\text{Payoff} = S_T \\times \\mathbb{1}_{\\{S_T > K\\}} $$\n\n**Relation** : $\\text{Vanilla Call} = \\text{Asset-or-nothing Call} - K \\times \\text{Cash-or-nothing Call}$\n\n**Prix BS d\'une digital call** :\n$$ \\text{Prix} = e^{-rT} N(d_2) \\quad \\text{où} \\quad d_2 = \\frac{\\ln(S/K) + (r - q - \\sigma^2/2)T}{\\sigma\\sqrt{T}} $$',
                        en: '**Cash-or-nothing**: pays a fixed amount $Q$ if the condition is met.\n$$ \\text{Payoff} = Q \\times \\mathbb{1}_{\\{S_T > K\\}} \\text{ (digital call)} \\quad \\text{or} \\quad Q \\times \\mathbb{1}_{\\{S_T < K\\}} \\text{ (digital put)} $$\n\n**Asset-or-nothing**: pays the underlying value if the condition is met.\n$$ \\text{Payoff} = S_T \\times \\mathbb{1}_{\\{S_T > K\\}} $$\n\n**Relation**: $\\text{Vanilla Call} = \\text{Asset-or-nothing Call} - K \\times \\text{Cash-or-nothing Call}$\n\n**BS price of digital call**:\n$$ \\text{Price} = e^{-rT} N(d_2) \\quad \\text{where} \\quad d_2 = \\frac{\\ln(S/K) + (r - q - \\sigma^2/2)T}{\\sigma\\sqrt{T}} $$'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Réplication par call spread', en: 'Call spread replication' },
                    body: {
                        fr: 'En pratique, les digitales sont **répliquées** par des call spreads serrés car la couverture d\'une vrai digitale est impossible (delta infini au strike).\n\n**Réplication** :\n$$ \\text{Digital Call} \\approx \\frac{1}{\\varepsilon} \\left[ \\text{Call}\\left(K - \\frac{\\varepsilon}{2}\\right) - \\text{Call}\\left(K + \\frac{\\varepsilon}{2}\\right) \\right] $$\noù $\\varepsilon$ est l\'écart du spread (typ. 1-5% du spot).\n\nPlus $\\varepsilon$ est petit, plus la réplication est précise, mais le notionnel des calls est plus grand.\n\n**Pin risk** : si le sous-jacent est exactement au strike à maturité, le hedging est extrêmement difficile. Le delta oscille entre $0$ et $\\infty$.',
                        en: 'In practice, digitals are **replicated** by tight call spreads because hedging a true digital is impossible (infinite delta at strike).\n\n**Replication**:\n$$ \\text{Digital Call} \\approx \\frac{1}{\\varepsilon} \\left[ \\text{Call}\\left(K - \\frac{\\varepsilon}{2}\\right) - \\text{Call}\\left(K + \\frac{\\varepsilon}{2}\\right) \\right] $$\nwhere $\\varepsilon$ is the spread width (typ. 1-5% of spot).\n\nSmaller $\\varepsilon$ means more precise replication but larger call notional.\n\n**Pin risk**: if the underlying is exactly at strike at maturity, hedging is extremely difficult. Delta oscillates between $0$ and $\\infty$.'
                    }
                }
            ]
        },
        {
            id: 'options-asiatiques-basket',
            title: { fr: 'Options Asiatiques & Basket', en: 'Asian & Basket Options' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Averaging et corrélation', en: 'Averaging and correlation' },
                    body: {
                        fr: '**Options asiatiques** : le payoff dépend de la **moyenne** du sous-jacent sur une période.\n\n$$ \\text{Average price call} = \\max(\\bar{A} - K, 0) \\quad \\text{où} \\quad \\bar{A} = \\frac{1}{n}\\sum_{i=1}^n S(t_i) $$\n$$ \\text{Average strike call} = \\max(S_T - \\bar{A}, 0) $$\n\n**Arithmétique vs géométrique** : la moyenne arithmétique est la plus courante mais n\'a pas de formule fermée → pricing par Monte Carlo. La moyenne géométrique admet une formule fermée (le produit de log-normales est log-normal).\n\nL\'averaging **réduit la volatilité effective** → les asiatiques sont moins chères que les vanilles.\n\n**Options basket** : le payoff dépend d\'un panier pondéré de sous-jacents.\n\n$$ \\text{Basket Call} = \\max\\left(\\sum_{i=1}^n w_i \\frac{S_i}{S_{0i}} - K, 0\\right) $$\n\nMoins de sous-jacents sont corrélés → plus la diversification est forte → plus le prix est bas.\nSi corrélation = 1, basket = vanille sur un seul sous-jacent.',
                        en: '**Asian options**: payoff depends on the **average** of the underlying over a period.\n\n$$ \\text{Average price call} = \\max(\\bar{A} - K, 0) \\quad \\text{where} \\quad \\bar{A} = \\frac{1}{n}\\sum_{i=1}^n S(t_i) $$\n$$ \\text{Average strike call} = \\max(S_T - \\bar{A}, 0) $$\n\n**Arithmetic vs geometric**: arithmetic average is most common but has no closed-form solution → Monte Carlo pricing. Geometric average has a closed-form (product of lognormals is lognormal).\n\nAveraging **reduces effective volatility** → Asians are cheaper than vanillas.\n\n**Basket options**: payoff depends on a weighted basket of underlyings.\n\n$$ \\text{Basket Call} = \\max\\left(\\sum_{i=1}^n w_i \\frac{S_i}{S_{0i}} - K, 0\\right) $$\n\nLower correlation between underlyings → stronger diversification → lower price.\nIf correlation = 1, basket = vanilla on single underlying.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Worst-of & Best-of', en: 'Worst-of & Best-of' },
                    body: {
                        fr: '**Worst-of** : le payoff dépend du **pire** sous-jacent du panier.\n\n$$ \\text{Worst-of put} = \\max\\left(K - \\min\\left(\\frac{S_1}{S_{01}}, \\frac{S_2}{S_{02}}, \\dots\\right), 0\\right) $$\n\n**Impact de la corrélation** : une corrélation faible entre les sous-jacents augmente la probabilité qu\'au moins un sous-jacent performe mal → le worst-of est SHORT corrélation.\n\n**Best-of** : le payoff dépend du **meilleur** sous-jacent. Le best-of est LONG corrélation.\n\n**En structuration** : les worst-of autocalls sont très populaires car le fait d\'être short corrélation génère de la prime → coupons plus élevés pour l\'investisseur. Mais le risque est concentré sur le maillon le plus faible.',
                        en: '**Worst-of**: payoff depends on the **worst** underlying in the basket.\n\n$$ \\text{Worst-of put} = \\max\\left(K - \\min\\left(\\frac{S_1}{S_{01}}, \\frac{S_2}{S_{02}}, \\dots\\right), 0\\right) $$\n\n**Correlation impact**: low correlation between underlyings increases the probability that at least one performs poorly → worst-of is SHORT correlation.\n\n**Best-of**: payoff depends on the **best** underlying. Best-of is LONG correlation.\n\n**In structuring**: worst-of autocalls are very popular because being short correlation generates premium → higher coupons for the investor. But risk is concentrated on the weakest link.'
                    }
                }
            ]
        },
        {
            id: 'emtn-funding',
            title: { fr: 'EMTN & Funding', en: 'EMTN & Funding' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Programme EMTN', en: 'EMTN Programme' },
                    body: {
                        fr: '**EMTN (Euro Medium Term Note)** : programme d\'émission de dette qui permet à une banque d\'émettre des notes structurées rapidement et de manière flexible.\n\n**Structure** :\n1. **Base Prospectus** : document-cadre approuvé par le régulateur (AMF, BaFin, etc.), valable 12 mois\n2. **Final Terms** : document spécifique à chaque émission (payoff, dates, sous-jacent, barrières)\n3. **KID (PRIIPs)** : document d\'information clé (obligatoire pour investisseurs retail en Europe)\n\n**Avantages** : émission rapide (quelques jours vs semaines pour un prospectus complet), flexibilité sur les payoffs, coûts réduits.\n\n**Funding** : quand la banque émet une note, elle reçoit du cash de l\'investisseur. Ce cash est un **financement** pour la banque, au même titre qu\'un emprunt. Le taux de funding = taux sans risque + spread de crédit de la banque.',
                        en: '**EMTN (Euro Medium Term Note)**: a debt issuance programme that allows a bank to issue structured notes quickly and flexibly.\n\n**Structure**:\n1. **Base Prospectus**: framework document approved by the regulator (AMF, BaFin, etc.), valid for 12 months\n2. **Final Terms**: document specific to each issuance (payoff, dates, underlying, barriers)\n3. **KID (PRIIPs)**: key information document (mandatory for retail investors in Europe)\n\n**Advantages**: rapid issuance (a few days vs weeks for a full prospectus), payoff flexibility, reduced costs.\n\n**Funding**: when the bank issues a note, it receives cash from the investor. This cash is **funding** for the bank, similar to borrowing. Funding rate = risk-free rate + bank credit spread.'
                    }
                }
            ]
        },
        {
            id: 'lookback-options',
            title: { fr: 'Options Lookback', en: 'Lookback Options' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Le meilleur prix sur la période', en: 'Best price over the period' },
                    body: {
                        fr: '**Fixed strike lookback call** :\n$$ \\text{Payoff} = \\max(S_{\\max} - K, 0) $$\nl\'acheteur achète au strike et profite du plus haut prix observé.\n\n**Floating strike lookback call** :\n$$ \\text{Payoff} = \\max(S_T - S_{\\min}, 0) $$\nl\'acheteur vend au spot final et achète au plus bas observé.\n\nCes options sont **très chères** (2-3x une vanille) car elles éliminent le risque de timing.\n\nEn structuration, elles sont utilisées dans les **produits à rendement garanti minimum** : « vous bénéficiez du meilleur moment pour entrer/sortir du marché ».',
                        en: '**Fixed strike lookback call**:\n$$ \\text{Payoff} = \\max(S_{\\max} - K, 0) $$\nbuyer buys at strike and profits from highest observed price.\n\n**Floating strike lookback call**:\n$$ \\text{Payoff} = \\max(S_T - S_{\\min}, 0) $$\nbuyer sells at final spot and buys at lowest observed.\n\nThese options are **very expensive** (2-3x a vanilla) because they eliminate timing risk.\n\nIn structuring, they are used in **guaranteed minimum return products**: "you benefit from the best time to enter/exit the market".'
                    }
                }
            ]
        },
        {
            id: 'quanto-composite',
            title: { fr: 'Quanto & Composite', en: 'Quanto & Composite' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Protection de change', en: 'Currency protection' },
                    body: {
                        fr: '**Option Quanto** : le payoff est en devise domestique mais le sous-jacent est en devise étrangère, avec un taux de change fixé à l\'avance.\n\nExemple : call quanto sur S&P500 pour un investisseur EUR.\n$$ \\text{Payoff} = \\max\\left(\\frac{S_T}{S_0} - 1, 0\\right) \\times \\text{Notionnel en EUR} $$ (pas de risque FX).\n\n**Ajustement quanto** : le pricing intègre la corrélation entre le sous-jacent et le taux de change, plus le différentiel de taux d\'intérêt entre les deux devises.\n\n$$ \\text{Drift ajusté} = \\mu - \\rho \\times \\sigma_S \\times \\sigma_{FX} $$\noù $\\rho$ = corrélation entre S et FX, $\\sigma_S$ = vol du sous-jacent, $\\sigma_{FX}$ = vol du taux de change.\n\n**Option Composite** : le payoff est converti en devise domestique au taux spot du jour de maturité (pas de protection FX).\n\n$$ \\text{Composite Call payoff (en EUR)} = \\max(S_T \\times FX_T - K \\times FX_0, 0) $$',
                        en: '**Quanto option**: payoff is in domestic currency but underlying is in foreign currency, with an exchange rate fixed in advance.\n\nExample: quanto call on S&P500 for a EUR investor.\n$$ \\text{Payoff} = \\max\\left(\\frac{S_T}{S_0} - 1, 0\\right) \\times \\text{Notionnel in EUR} $$ (no FX risk).\n\n**Quanto adjustment**: pricing incorporates the correlation between underlying and exchange rate, plus the interest rate differential between the two currencies.\n\n$$ \\text{Adjusted drift} = \\mu - \\rho \\times \\sigma_S \\times \\sigma_{FX} $$\nwhere $\\rho$ = correlation between S and FX, $\\sigma_S$ = underlying vol, $\\sigma_{FX}$ = FX vol.\n\n**Composite option**: payoff is converted to domestic currency at the maturity spot FX rate (no FX protection).\n\n$$ \\text{Composite Call payoff (in EUR)} = \\max(S_T \\times FX_T - K \\times FX_0, 0) $$'
                    }
                }
            ]
        },
        {
            id: 'correlation-products',
            title: { fr: 'Produits de Corrélation', en: 'Correlation Products' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Dispersion et corrélation', en: 'Dispersion and correlation' },
                    body: {
                        fr: '**Dispersion trading** : acheter de la vol sur les composants individuels et vendre de la vol sur l\'indice (ou inversement). La P&L dépend de la **corrélation réalisée** vs corrélation implicite.\n\nSi corrélation réalisée < implicite → profit pour le vendeur de corrélation.\n\n**Correlation swap** : paie la différence entre corrélation implicite et corrélation réalisée.\n\n**En structuration** : les worst-of sont le principal véhicule pour être short corrélation. Le structureur qui crée un worst-of autocall est long les composants individuels et doit gérer activement l\'exposition corrélation.\n\nCorrélation typique implicite :\n- Actions d\'un même secteur : 50-70%\n- Actions cross-sector : 30-50%\n- Actions cross-geography : 20-40%',
                        en: '**Dispersion trading**: buy vol on individual components and sell vol on the index (or vice versa). P&L depends on **realized correlation** vs implied correlation.\n\nIf realized correlation < implied → profit for correlation seller.\n\n**Correlation swap**: pays the difference between implied and realized correlation.\n\n**In structuring**: worst-of products are the main vehicle for being short correlation. The structurer creating a worst-of autocall is long individual components and must actively manage correlation exposure.\n\nTypical implied correlation:\n- Same-sector stocks: 50-70%\n- Cross-sector stocks: 30-50%\n- Cross-geography stocks: 20-40%'
                    }
                }
            ]
        },
        {
            id: 'cliquet-accumulator',
            title: { fr: 'Cliquet & Accumulateur', en: 'Cliquet & Accumulator' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Rendements périodiques', en: 'Periodic returns' },
                    body: {
                        fr: '**Option Cliquet (Ratchet)** : série d\'options forward-start. À chaque période, le rendement du sous-jacent est capté entre un floor local et un cap local.\n\n$$ \\text{Payoff} = \\sum_{i=1}^n \\min(\\max(R_i, \\text{Floor}), \\text{Cap}) \\quad \\text{où} \\quad R_i = \\frac{S(t_i)}{S(t_{i-1})} - 1 $$\n\nExemple : Cliquet annuel, cap local 5%, floor local 0%, 5 ans.\nSi rendements annuels = +12%, -8%, +20%, +3%, -15%\nPerformance captée = 5%, 0%, 5%, 3%, 0% = **13%**\n\n**Global cap/floor** : parfois un cap global limite le rendement total.\n\n**Accumulateur** : le détenteur est obligé d\'acheter un nombre fixe d\'actions par jour au strike fixé. Si le spot > strike, il accumule à prix favorable. Si le spot < barrière basse (KO), le contrat se termine. Si le spot < strike mais > KO, il achète au-dessus du marché (à 2x le notionnel parfois).\n\nSurnommé **"I kill you later"** en Asie car les pertes s\'accumulent silencieusement.',
                        en: '**Cliquet (Ratchet) Option**: series of forward-start options. Each period, the underlying return is captured between a local floor and local cap.\n\n$$ \\text{Payoff} = \\sum_{i=1}^n \\min(\\max(R_i, \\text{Floor}), \\text{Cap}) \\quad \\text{where} \\quad R_i = \\frac{S(t_i)}{S(t_{i-1})} - 1 $$\n\nExample: Annual cliquet, 5% local cap, 0% local floor, 5 years.\nIf annual returns = +12%, -8%, +20%, +3%, -15%\nCaptured performance = 5%, 0%, 5%, 3%, 0% = **13%**\n\n**Global cap/floor**: sometimes a global cap limits total return.\n\n**Accumulator**: the holder is obligated to buy a fixed number of shares daily at a fixed strike. If spot > strike, they accumulate at favorable price. If spot < lower barrier (KO), contract terminates. If spot < strike but > KO, they buy above market (sometimes at 2x notional).\n\nNicknamed **"I kill you later"** in Asia because losses accumulate silently.'
                    }
                }
            ]
        },
        {
            id: 'case-study-worstof',
            title: { fr: 'Case Study : Worst-of Autocall', en: 'Case Study: Worst-of Autocall' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'Autocall worst-of sur 3 actions', en: 'Worst-of autocall on 3 stocks' },
                    body: {
                        fr: '**Produit** : Worst-of Autocall 5 ans\n**Sous-jacents** : LVMH, TotalEnergies, BNP Paribas\n**Coupon** : 9.5% p.a. (effet mémoire)\n**Barrière autocall** : 100% (performance du pire sous-jacent)\n**Barrière PDI** : 60% (observation à maturité)\n\n**Pourquoi le coupon est si élevé (9.5% vs 7% pour un single-stock) ?**\n- Les 3 actions ont des corrélations réalisées de 40-55% entre elles\n- La faible corrélation augmente la probabilité que le worst-of soit significativement en-dessous\n- L\'investisseur est SHORT corrélation → prime de risque supplémentaire → coupon plus élevé\n\n**Scénario** :\n- An 1 : LVMH +15%, Total +5%, BNP -8% → worst-of = BNP à 92% → pas de rappel\n- An 2 : LVMH +25%, Total +12%, BNP +3% → worst-of = BNP à 103% → **Autocall !**\n- Remboursement = 100% + 19% (2 × 9.5%) = **119%**\n\n**Risque clé** : si un seul des 3 sous-jacents chute sous 60% (sans que les autres ne le rattrapent), l\'investisseur subit la perte du pire, même si les deux autres ont performé positivement.',
                        en: '**Product**: Worst-of Autocall 5Y\n**Underlyings**: LVMH, TotalEnergies, BNP Paribas\n**Coupon**: 9.5% p.a. (memory effect)\n**Autocall barrier**: 100% (worst performer)\n**PDI barrier**: 60% (maturity observation)\n\n**Why is the coupon so high (9.5% vs 7% for single-stock)?**\n- The 3 stocks have realized correlations of 40-55% between them\n- Low correlation increases the probability that the worst-of is significantly below\n- Investor is SHORT correlation → additional risk premium → higher coupon\n\n**Scenario**:\n- Y1: LVMH +15%, Total +5%, BNP -8% → worst-of = BNP at 92% → no recall\n- Y2: LVMH +25%, Total +12%, BNP +3% → worst-of = BNP at 103% → **Autocall!**\n- Repayment = 100% + 19% (2 × 9.5%) = **119%**\n\n**Key risk**: if even one of the 3 underlyings falls below 60% (without others compensating), the investor suffers the worst performer\'s loss, even if the other two performed positively.'
                    }
                }
            ]
        },
        {
            id: 'case-study-accumulator',
            title: { fr: 'Case Study : Accumulateurs Hong Kong', en: 'Case Study: Hong Kong Accumulators' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: '"I kill you later"', en: '"I kill you later"' },
                    body: {
                        fr: '**Contexte** : En 2007-2008, les accumulateurs étaient extrêmement populaires auprès des investisseurs fortunés en Asie, notamment à Hong Kong.\n\n**Mécanisme typique** :\n- L\'investisseur s\'engage à acheter 1000 actions de HSBC chaque jour ouvré à 95% du spot initial (~5% de réduction)\n- Si HSBC monte > 105% : le contrat se termine (KO) → l\'investisseur a fait un petit profit\n- Si HSBC reste entre 95% et 105% : accumulation normale\n- Si HSBC chute sous 95% : l\'investisseur doit acheter **2000 actions** par jour (doublement du notionnel !)\n\n**Ce qui s\'est passé en 2008** :\n- Les marchés ont chuté de 50%+ en quelques mois\n- Les investisseurs étaient forcés d\'acheter à un prix très au-dessus du marché, avec un doublement du notionnel\n- Certains investisseurs ont perdu des dizaines de millions de dollars\n- Le KO empêchait de profiter des remontées (gain limité à ~5%)\n- Le doublement du notionnel à la baisse rendait les pertes catastrophiques\n\n**Leçon** : le profil risque/rendement était radicalement asymétrique — gain limité (~5% max avant KO) vs perte illimitée (2x notionnel en marché baissier). Le produit semblait attractif en marché haussier mais cachait un risque de ruine.',
                        en: '**Context**: In 2007-2008, accumulators were extremely popular among high-net-worth investors in Asia, particularly in Hong Kong.\n\n**Typical mechanism**:\n- Investor commits to buying 1000 HSBC shares every business day at 95% of initial spot (~5% discount)\n- If HSBC rises > 105%: contract terminates (KO) → investor made a small profit\n- If HSBC stays between 95% and 105%: normal accumulation\n- If HSBC falls below 95%: investor must buy **2000 shares** per day (doubled notional!)\n\n**What happened in 2008**:\n- Markets fell 50%+ in a few months\n- Investors were forced to buy at a price far above market, with doubled notional\n- Some investors lost tens of millions of dollars\n- The KO prevented profiting from rebounds (gain limited to ~5%)\n- Notional doubling on the downside made losses catastrophic\n\n**Lesson**: the risk/return profile was radically asymmetric — limited gain (~5% max before KO) vs unlimited loss (2x notional in declining market). The product seemed attractive in bull markets but hid ruin risk.'
                    }
                }
            ]
        }
    ]
};
