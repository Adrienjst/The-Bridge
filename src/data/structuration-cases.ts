export interface StructurationCase {
    id: string;
    level: 'junior' | 'confirmed' | 'senior';
    title: { fr: string; en: string };
    clientProfile: { fr: string; en: string };
    brief: { fr: string; en: string };
    constraints: { fr: string; en: string }[];
    expectedProduct: string; // for AI scoring reference
    timeMinutes: number;
    tags: string[];
}

export const structurationCases: StructurationCase[] = [
    // ═══════════════════════════════════════
    //  JUNIOR LEVEL (8 cases)
    // ═══════════════════════════════════════
    {
        id: 'jr-1',
        level: 'junior',
        title: { fr: 'Capital Protégé Classique', en: 'Classic Capital Protected' },
        clientProfile: { fr: 'Client retail prudent, 60 ans, patrimoine de 500K€, horizon 3 ans', en: 'Conservative retail client, 60 years old, €500K portfolio, 3-year horizon' },
        brief: {
            fr: 'Votre client souhaite participer à la hausse de l\'Euro Stoxx 50 tout en protégeant 100% de son capital à maturité. Il accepte un plafonnement de la participation si nécessaire.',
            en: 'Your client wants to participate in the Euro Stoxx 50 upside while protecting 100% of their capital at maturity. They accept capped participation if necessary.'
        },
        constraints: [
            { fr: 'Protection du capital : 100%', en: 'Capital protection: 100%' },
            { fr: 'Sous-jacent : Euro Stoxx 50', en: 'Underlying: Euro Stoxx 50' },
            { fr: 'Maturité : 3 ans', en: 'Maturity: 3 years' },
            { fr: 'Budget pour la participation : prime de 4-5% max', en: 'Participation budget: 4-5% max premium' },
        ],
        expectedProduct: 'Capital Protected Note: ZC bond + call spread or capped call on SX5E. Participation ~60-80% capped at ~120-130%.',
        timeMinutes: 15,
        tags: ['capital-protected', 'vanilla', 'equity'],
    },
    {
        id: 'jr-2',
        level: 'junior',
        title: { fr: 'Reverse Convertible Simple', en: 'Simple Reverse Convertible' },
        clientProfile: { fr: 'Client banque privée, modérément bullish, cherche du rendement, patrimoine 1M€', en: 'Private banking client, moderately bullish, yield-seeking, €1M portfolio' },
        brief: {
            fr: 'Un client cherche un coupon attractif (7-8% annuel) sur une action blue chip européenne. Il accepte un risque de perte en capital si l\'action baisse significativement.',
            en: 'A client wants an attractive coupon (7-8% annual) on a European blue chip stock. They accept capital loss risk if the stock drops significantly.'
        },
        constraints: [
            { fr: 'Coupon cible : 7-8% p.a.', en: 'Target coupon: 7-8% p.a.' },
            { fr: 'Sous-jacent : action blue chip (Total, LVMH, etc.)', en: 'Underlying: blue chip stock (Total, LVMH, etc.)' },
            { fr: 'Maturité : 1 an', en: 'Maturity: 1 year' },
            { fr: 'Le client comprend le risque de livraison physique', en: 'Client understands physical delivery risk' },
        ],
        expectedProduct: 'Reverse Convertible: Bond + short put. Coupon funded by put premium. Strike at 90-95% for 7-8% coupon.',
        timeMinutes: 12,
        tags: ['reverse-convertible', 'yield', 'single-stock'],
    },
    {
        id: 'jr-3',
        level: 'junior',
        title: { fr: 'Stratégie Collar sur Portefeuille', en: 'Portfolio Collar Strategy' },
        clientProfile: { fr: 'Gérant de fonds, long €10M en actions Euro Stoxx, craint un krach', en: 'Fund manager, long €10M Euro Stoxx equities, fears a crash' },
        brief: {
            fr: 'Le gérant veut protéger son portefeuille contre une baisse de plus de 10% sur 6 mois, mais il ne veut pas payer de prime nette. Proposez une stratégie zero-cost.',
            en: 'The manager wants to protect their portfolio against a drop of more than 10% over 6 months, but doesn\'t want to pay a net premium. Propose a zero-cost strategy.'
        },
        constraints: [
            { fr: 'Protection : plancher à -10%', en: 'Protection: floor at -10%' },
            { fr: 'Coût : zéro prime nette (zero-cost)', en: 'Cost: zero net premium (zero-cost)' },
            { fr: 'Horizon : 6 mois', en: 'Horizon: 6 months' },
            { fr: 'Notionnel : 10M€', en: 'Notional: €10M' },
        ],
        expectedProduct: 'Zero-cost collar: Buy 90% put, sell ~103-105% call. The call premium funds the put.',
        timeMinutes: 12,
        tags: ['hedging', 'collar', 'zero-cost'],
    },
    {
        id: 'jr-4',
        level: 'junior',
        title: { fr: 'Note à Coupon Digital', en: 'Digital Coupon Note' },
        clientProfile: { fr: 'Client institutionnel, allocation prudente, veut surperformer le monétaire', en: 'Institutional client, conservative allocation, wants to outperform money market' },
        brief: {
            fr: 'Structurez un produit qui verse un coupon de 5% si l\'indice S&P 500 est au-dessus de son niveau initial à chaque date d\'observation annuelle, et rembourse 100% du capital à maturité.',
            en: 'Structure a product that pays a 5% coupon if the S&P 500 is above its initial level at each annual observation date, and repays 100% of capital at maturity.'
        },
        constraints: [
            { fr: 'Protection du capital : 100%', en: 'Capital protection: 100%' },
            { fr: 'Coupon : 5% conditionnel', en: 'Coupon: 5% conditional' },
            { fr: 'Sous-jacent : S&P 500', en: 'Underlying: S&P 500' },
            { fr: 'Maturité : 5 ans', en: 'Maturity: 5 years' },
        ],
        expectedProduct: 'ZC Bond + strip of digital calls ATM. 5% digital coupon paid if spot > strike at each anniversary.',
        timeMinutes: 15,
        tags: ['digital', 'capital-protected', 'coupon'],
    },
    {
        id: 'jr-5',
        level: 'junior',
        title: { fr: 'Bull Spread Simple', en: 'Simple Bull Spread' },
        clientProfile: { fr: 'Trader prop junior, budget 200K€, vue modérément haussière sur le CAC 40', en: 'Junior prop trader, €200K budget, moderately bullish on CAC 40' },
        brief: {
            fr: 'Le trader est bullish sur le CAC 40 à 3 mois avec un objectif de +5-8%. Il veut limiter sa perte maximale tout en bénéficiant de la hausse. Proposez une stratégie optimisée.',
            en: 'The trader is bullish on CAC 40 at 3 months with a +5-8% target. They want to cap their maximum loss while benefiting from the upside. Propose an optimized strategy.'
        },
        constraints: [
            { fr: 'Perte max : 2% du notionnel', en: 'Max loss: 2% of notional' },
            { fr: 'Horizon : 3 mois', en: 'Horizon: 3 months' },
            { fr: 'Sous-jacent : CAC 40', en: 'Underlying: CAC 40' },
        ],
        expectedProduct: 'Bull call spread: Buy ATM call, sell 105-108% call. Net debit = max loss. Profit capped at upper strike.',
        timeMinutes: 10,
        tags: ['strategy', 'spread', 'directional'],
    },

    // ═══════════════════════════════════════
    //  CONFIRMED LEVEL (8 cases)
    // ═══════════════════════════════════════
    {
        id: 'cf-1',
        level: 'confirmed',
        title: { fr: 'Autocall Phoenix', en: 'Phoenix Autocall' },
        clientProfile: { fr: 'Client HNWI, portefeuille 2M€ diversifié, cherche du rendement avec protection partielle', en: 'HNWI client, €2M diversified portfolio, seeks yield with partial protection' },
        brief: {
            fr: 'Structurez un autocall Phoenix sur un panier de 3 actions européennes (BNP, SAP, Siemens) avec un coupon mémoire. Le client veut un coupon de 8-10% p.a. avec une barrière de protection à -30%.',
            en: 'Structure a Phoenix Autocall on a basket of 3 European stocks (BNP, SAP, Siemens) with memory coupon. Client wants 8-10% p.a. coupon with a -30% protection barrier.'
        },
        constraints: [
            { fr: 'Coupon : 8-10% p.a. avec effet mémoire', en: 'Coupon: 8-10% p.a. with memory effect' },
            { fr: 'Barrière autocall : 100%', en: 'Autocall barrier: 100%' },
            { fr: 'Barrière coupon : 70%', en: 'Coupon barrier: 70%' },
            { fr: 'Barrière KI (capital) : 60%', en: 'KI barrier (capital): 60%' },
            { fr: 'Observation : trimestrielle à partir de T+1', en: 'Observation: quarterly from T+1' },
            { fr: 'Maturité max : 5 ans', en: 'Max maturity: 5 years' },
        ],
        expectedProduct: 'Phoenix Autocall: Worst-of basket. Quarterly coupon if all > 70%, memory. Autocall if all > 100%. Capital at risk if any < 60% at maturity.',
        timeMinutes: 20,
        tags: ['autocall', 'phoenix', 'worst-of', 'memory'],
    },
    {
        id: 'cf-2',
        level: 'confirmed',
        title: { fr: 'Produit Structuré sur Taux', en: 'Rates Structured Product' },
        clientProfile: { fr: 'Trésorier d\'entreprise, cherche un meilleur rendement que les dépôts à terme', en: 'Corporate treasurer, seeking better yield than term deposits' },
        brief: {
            fr: 'Le trésorier a 5M€ à placer sur 2 ans. Les taux courts sont à 3%. Il veut un produit qui lui offre un rendement supérieur (5%+) si les taux restent stables ou montent modérément, avec un capital protégé.',
            en: 'The treasurer has €5M to invest for 2 years. Short rates are at 3%. They want a product offering superior yield (5%+) if rates stay stable or rise moderately, with capital protection.'
        },
        constraints: [
            { fr: 'Capital protégé à 100%', en: 'Capital protected at 100%' },
            { fr: 'Rendement cible : 5%+ p.a.', en: 'Target yield: 5%+ p.a.' },
            { fr: 'Maturité : 2 ans', en: 'Maturity: 2 years' },
            { fr: 'Référence : Euribor 3M ou CMS 2Y', en: 'Reference: Euribor 3M or CMS 2Y' },
        ],
        expectedProduct: 'Range accrual on Euribor or CMS: Capital protected, accrues coupon daily when rate stays in range [2.5%, 4.5%]. ZC + strip of digital options on rates.',
        timeMinutes: 20,
        tags: ['rates', 'range-accrual', 'capital-protected'],
    },
    {
        id: 'cf-3',
        level: 'confirmed',
        title: { fr: 'Certificat Bonus Cappé', en: 'Capped Bonus Certificate' },
        clientProfile: { fr: 'Client wealth management, vue neutre à légèrement haussière, veut surperformer le sous-jacent', en: 'Wealth management client, neutral to slightly bullish view, wants to outperform the underlying' },
        brief: {
            fr: 'Structurez un certificat bonus sur l\'Euro Stoxx 50. Le client veut un bonus de 15% si l\'indice ne touche jamais une barrière basse, avec un cap raisonnable.',
            en: 'Structure a bonus certificate on Euro Stoxx 50. Client wants a 15% bonus if the index never touches a low barrier, with a reasonable cap.'
        },
        constraints: [
            { fr: 'Bonus : 15% au-dessus du nominal', en: 'Bonus: 15% above nominal' },
            { fr: 'Barrière basse : -25% (knock-in continu)', en: 'Low barrier: -25% (continuous knock-in)' },
            { fr: 'Maturité : 18 mois', en: 'Maturity: 18 months' },
            { fr: 'Cap à définir', en: 'Cap to be determined' },
        ],
        expectedProduct: 'Bonus certificate: Long forward + short down-and-in put at 75% + short call at cap (~125%). Bonus of 115% paid if barrier not hit.',
        timeMinutes: 18,
        tags: ['bonus-certificate', 'barrier', 'exotic'],
    },
    {
        id: 'cf-4',
        level: 'confirmed',
        title: { fr: 'Worst-Of Autocall avec Décrémentation', en: 'Worst-Of Autocall with Decrement' },
        clientProfile: { fr: 'CGP (conseiller en gestion de patrimoine), client patrimonial, 800K€', en: 'Wealth advisor, affluent client, €800K' },
        brief: {
            fr: 'Structurez un autocall worst-of sur l\'Euro Stoxx 50 et le S&P 500 avec un mécanisme de décrémentation. Expliquez l\'impact du décrement synthétique sur le pricing et le rendement client.',
            en: 'Structure a worst-of autocall on Euro Stoxx 50 and S&P 500 with a decrement mechanism. Explain the impact of synthetic decrement on pricing and client yield.'
        },
        constraints: [
            { fr: 'Sous-jacents : SX5E et SPX (versions décrément 50pts/an)', en: 'Underlyings: SX5E and SPX (decrement versions 50pts/yr)' },
            { fr: 'Coupon : 9-11% p.a.', en: 'Coupon: 9-11% p.a.' },
            { fr: 'Autocall : semestriel, décroissant', en: 'Autocall: semi-annual, decreasing' },
            { fr: 'Barrière KI : 50%', en: 'KI barrier: 50%' },
        ],
        expectedProduct: 'Decrement autocall: WO on SX5E-D50 and SPX-D50. Higher coupon thanks to synthetic dividend stripping. Autocall barrier decreasing 5% per year.',
        timeMinutes: 25,
        tags: ['autocall', 'decrement', 'worst-of', 'advanced'],
    },

    // ═══════════════════════════════════════
    //  SENIOR LEVEL (4 cases)
    // ═══════════════════════════════════════
    {
        id: 'sr-1',
        level: 'senior',
        title: { fr: 'Structuration Multi-Asset Complexe', en: 'Complex Multi-Asset Structuring' },
        clientProfile: { fr: 'Family office, 10M€ à structurer, vue macro sophistiquée', en: 'Family office, €10M to structure, sophisticated macro view' },
        brief: {
            fr: 'Le family office anticipe : (1) hausse modérée des actions européennes, (2) stabilité des taux EUR, (3) hausse de l\'or. Structurez un produit multi-asset qui capture ces 3 vues avec une protection conditionnelle.',
            en: 'The family office expects: (1) moderate rise in European equities, (2) stable EUR rates, (3) gold rally. Structure a multi-asset product capturing all 3 views with conditional protection.'
        },
        constraints: [
            { fr: 'Sous-jacents : SX5E, Gold, EUR CMS 10Y', en: 'Underlyings: SX5E, Gold, EUR CMS 10Y' },
            { fr: 'Protection : 90% si aucune knock-in', en: 'Protection: 90% if no knock-in' },
            { fr: 'Coupon : variable selon performance', en: 'Coupon: variable based on performance' },
            { fr: 'Maturité : 3-5 ans', en: 'Maturity: 3-5 years' },
            { fr: 'Corrélation entre actifs à discuter', en: 'Cross-asset correlation to discuss' },
        ],
        expectedProduct: 'Multi-asset autocall with conditional protection. SX5E call + gold participation + range accrual on CMS. Correlation impact on pricing.',
        timeMinutes: 30,
        tags: ['multi-asset', 'correlation', 'complex', 'family-office'],
    },
    {
        id: 'sr-2',
        level: 'senior',
        title: { fr: 'Hedging d\'un Book Exotique', en: 'Exotic Book Hedging' },
        clientProfile: { fr: 'Vous êtes structureur/trader junior sur le desk. Votre PM vous demande...', en: 'You are a junior structurer/trader on the desk. Your PM asks you...' },
        brief: {
            fr: 'Le desk a accumulé un book de 500M€ d\'autocalls worst-of sur SX5E/SPX avec des knock-ins à 50%. Le marché vient de baisser de 15%. Votre PM vous demande un plan de hedging et une analyse de risque Greeks.',
            en: 'The desk has accumulated a €500M book of worst-of autocalls on SX5E/SPX with 50% knock-ins. The market just dropped 15%. Your PM asks for a hedging plan and Greeks risk analysis.'
        },
        constraints: [
            { fr: 'Analyser : Delta, Gamma, Vega, et corrélation', en: 'Analyze: Delta, Gamma, Vega, and correlation' },
            { fr: 'Proposer un hedging statique et dynamique', en: 'Propose static and dynamic hedging' },
            { fr: 'Discuter le P&L impact de la baisse', en: 'Discuss P&L impact of the drop' },
            { fr: 'Évaluer le risque de gap overnight', en: 'Assess overnight gap risk' },
        ],
        expectedProduct: 'Hedging analysis: Long delta (futures), long gamma near barriers, vega hedging via variance swaps. Correlation exposure analysis. Gap risk via deep OTM puts.',
        timeMinutes: 30,
        tags: ['hedging', 'risk-management', 'greeks', 'desk'],
    },
    {
        id: 'sr-3',
        level: 'senior',
        title: { fr: 'Athena Airbag avec Barrière Désactivante', en: 'Athena Airbag with Deactivating Barrier' },
        clientProfile: { fr: 'Assureur vie, mandat de gestion, portefeuille UC de 50M€', en: 'Life insurer, management mandate, €50M unit-linked portfolio' },
        brief: {
            fr: 'L\'assureur veut un produit avec un coupon mémoire, un mécanisme airbag qui réduit la perte si la barrière est franchie, et une barrière de rappel dégressive. Structurez et pricez intuitivement.',
            en: 'The insurer wants a product with memory coupon, an airbag mechanism that reduces losses if the barrier is breached, and a decreasing autocall barrier. Structure and intuitively price it.'
        },
        constraints: [
            { fr: 'Coupon : 7% p.a. mémoire', en: 'Coupon: 7% p.a. memory' },
            { fr: 'Barrière de rappel : 100% Y1, -5%/an (95% Y2, 90% Y3...)', en: 'Autocall barrier: 100% Y1, -5%/yr (95% Y2, 90% Y3...)' },
            { fr: 'Airbag : perte réduite si 50% < spot < 60%', en: 'Airbag: reduced loss if 50% < spot < 60%' },
            { fr: 'KI : 50%, observation à maturité uniquement', en: 'KI: 50%, observation at maturity only' },
        ],
        expectedProduct: 'Athena Airbag: Autocall with decreasing trigger + memory coupon. Airbag mechanism = put spread below barrier to cushion loss. European KI at maturity.',
        timeMinutes: 30,
        tags: ['athena', 'airbag', 'memory', 'insurance'],
    },
    {
        id: 'sr-4',
        level: 'senior',
        title: { fr: 'Structuration ESG avec Contraintes Réglementaires', en: 'ESG Structuring with Regulatory Constraints' },
        clientProfile: { fr: 'Banque de détail, lancement d\'un produit grand public Article 8 SFDR', en: 'Retail bank, launching a mass-market SFDR Article 8 product' },
        brief: {
            fr: 'Structurez un autocall ESG conforme Article 8 SFDR pour distribution mass market. Le sous-jacent doit être un indice ESG, le produit doit être simple à comprendre, et vous devez adresser les contraintes MiFID II / PRIIPs.',
            en: 'Structure an ESG autocall compliant with SFDR Article 8 for mass market distribution. Underlying must be an ESG index, product must be simple to understand, and you must address MiFID II / PRIIPs constraints.'
        },
        constraints: [
            { fr: 'Article 8 SFDR : sous-jacent ESG filtré', en: 'SFDR Article 8: ESG-filtered underlying' },
            { fr: 'PRIIPs KID : SRI ≤ 4', en: 'PRIIPs KID: SRI ≤ 4' },
            { fr: 'Ticket minimum : 1000€', en: 'Minimum ticket: €1000' },
            { fr: 'Distribution : réseau bancaire retail', en: 'Distribution: retail banking network' },
        ],
        expectedProduct: 'ESG Autocall on SX5E ESG Leaders Decrement index. Simple structure for retail: fixed coupon, 100% autocall, 60% European KI. PRIIPs SRI optimization.',
        timeMinutes: 25,
        tags: ['esg', 'regulatory', 'retail', 'priips'],
    },
];
