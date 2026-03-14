import { CourseModule } from '../types';

export const module4: CourseModule = {
    id: 'familles-payoffs',
    number: 4,
    title: { fr: 'Familles de Payoffs', en: 'Payoff Families' },
    subtitle: { fr: 'Phoenix, Step-Down, Range Accrual, Classification', en: 'Phoenix, Step-Down, Range Accrual, Classification' },
    description: {
        fr: 'Explorez les principales familles de payoffs structurés : produits à coupons conditionnels (Phoenix/Memory), autocalls avec step-down, range accrual, twin-win, et la classification réglementaire EUSIPA.',
        en: 'Explore the main structured payoff families: conditional coupon products (Phoenix/Memory), step-down autocalls, range accrual, twin-win, and the EUSIPA regulatory classification.'
    },
    difficulty: 'avancé',
    duration: { fr: '2 semaines', en: '2 weeks' },
    icon: '🎛️',
    color: '#ec4899',
    objectives: [
        { fr: 'Distinguer un Phoenix d\'un Memory coupon', en: 'Distinguish Phoenix from Memory coupon' },
        { fr: 'Comprendre l\'impact du step-down sur la durée de vie attendue', en: 'Understand the step-down impact on expected lifetime' },
        { fr: 'Calculer le paiement d\'un range accrual', en: 'Calculate a range accrual payment' },
        { fr: 'Classer les produits selon les catégories EUSIPA/PRIIPs', en: 'Classify products according to EUSIPA/PRIIPs categories' },
    ],
    lessons: [
        {
            id: 'phoenix-memory',
            title: { fr: 'Phoenix & Memory Coupon', en: 'Phoenix & Memory Coupon' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Coupons conditionnels', en: 'Conditional coupons' },
                    body: {
                        fr: '**Phoenix** : un coupon est versé à chaque date d\'observation si le sous-jacent est au-dessus d\'une **barrière de coupon** (généralement plus basse que la barrière autocall). Si le sous-jacent est sous cette barrière, le coupon n\'est pas versé pour cette période.\n\n**Memory (mémoire)** : variante du Phoenix où les coupons non versés sont stockés et payés rétroactivement quand la condition est de nouveau remplie.\n\n**Différence clé** :\n- **Phoenix standard** : coupon perdu si condition non remplie\n- **Phoenix Memory** : coupon reporté et payé quand le sous-jacent repasse au-dessus\n\n**Exemple numérique** (coupon 2%/trimestre, barrière coupon 70%) :\n\n| Trimestre | Spot | Coupon dû | Phoenix | Memory |\n|-----------|------|-----------|---------|--------|\n| Q1 | 95% | 2% | 2% | 2% |\n| Q2 | 65% | 0% | 0% | 0% (2% stocké) |\n| Q3 | 68% | 0% | 0% | 0% (4% stockés) |\n| Q4 | 75% | 2% | 2% | 2% + 4% = 6% |\n| **Total** | | | **4%** | **8%** |\n\nL\'effet mémoire est valorisé comme un ensemble de digitales knock-in conditionnelles.',
                        en: '**Phoenix**: a coupon is paid at each observation date if the underlying is above a **coupon barrier** (usually lower than the autocall barrier). If below, the coupon is not paid for that period.\n\n**Memory**: variant where unpaid coupons are stored and paid retroactively when the condition is met again.\n\n**Key difference**:\n- **Standard Phoenix**: coupon lost if condition not met\n- **Phoenix Memory**: coupon deferred and paid when underlying crosses back above\n\n**Numerical example** (2%/quarter coupon, 70% coupon barrier):\n\n| Quarter | Spot | Coupon due | Phoenix | Memory |\n|---------|------|-----------|---------|--------|\n| Q1 | 95% | 2% | 2% | 2% |\n| Q2 | 65% | 0% | 0% | 0% (2% stored) |\n| Q3 | 68% | 0% | 0% | 0% (4% stored) |\n| Q4 | 75% | 2% | 2% | 2% + 4% = 6% |\n| **Total** | | | **4%** | **8%** |\n\nThe memory effect is valued as a set of conditional knock-in digitals.'
                    }
                }
            ]
        },
        {
            id: 'step-down-autocall',
            title: { fr: 'Step-Down Autocall', en: 'Step-Down Autocall' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Barrière autocall décroissante', en: 'Decreasing autocall barrier' },
                    body: {
                        fr: 'Un **step-down autocall** a une barrière de rappel qui **diminue** au fil du temps, augmentant progressivement la probabilité de rappel.\n\n**Exemple de schedule** :\n| Année | Barrière autocall |\n|-------|------------------|\n| 1 | 100% |\n| 2 | 100% |\n| 3 | 95% |\n| 4 | 90% |\n| 5 | 85% |\n| 6 | 80% |\n| 7 | 75% |\n| 8 | 70% |\n\n**Impact** :\n- Augmente la probabilité de rappel anticipé (surtout en cas de marché flat ou légèrement baissier)\n- Réduit la durée de vie attendue du produit (de ~4.5 ans à ~3.5 ans typiquement)\n- Coûte plus cher (plus de probabilité de payer les coupons) → coupon nécessairement plus bas\n\n**Trade-off pour l\'investisseur** :\n- Step-down agressif → coupon plus bas mais plus de chances de récupérer son capital\n- Pas de step-down → coupon plus élevé mais risque de rester bloqué pendant toute la durée\n\n**Pour le structureur** : le step-down modifie significativement le profil de Greeks du produit, notamment le gamma et le vega aux dates proches des observations step-down.',
                        en: 'A **step-down autocall** has a recall barrier that **decreases** over time, progressively increasing recall probability.\n\n**Example schedule**:\n| Year | Autocall barrier |\n|------|------------------|\n| 1 | 100% |\n| 2 | 100% |\n| 3 | 95% |\n| 4 | 90% |\n| 5 | 85% |\n| 6 | 80% |\n| 7 | 75% |\n| 8 | 70% |\n\n**Impact**:\n- Increases early recall probability (especially in flat or slightly declining markets)\n- Reduces expected product lifetime (from ~4.5 years to ~3.5 years typically)\n- More expensive (higher probability of paying coupons) → necessarily lower coupon\n\n**Investor trade-off**:\n- Aggressive step-down → lower coupon but higher chance of capital recovery\n- No step-down → higher coupon but risk of being locked in for the full duration\n\n**For the structurer**: step-down significantly modifies the product\'s Greeks profile, especially gamma and vega near step-down observation dates.'
                    }
                },
                {
                    type: 'warning',
                    title: { fr: 'Le Risque de Pinning', en: 'Pinning Risk' },
                    body: {
                        fr: 'Dans les Autocalls (et tous les produits à barrière), le **Risque de Pinning (Pin Risk)** survient lorsque le sous-jacent se trouve exactement sur la barrière au moment de la date d\'observation ou de maturité.\n\nPour le market maker (structureur), c\'est un cauchemar hédging : à un centime près, le produit est soit rappelé (remboursement 100%), soit non rappelé (capital exposé). Le Delta passe brusquement de 0 à un chiffre énorme, et le **Gamma tend vers l\'infini**. Le trader ne sait pas de quel côté du marché se positionner pour couvrir le risque jusqu\'à la dernière seconde de fixing.',
                        en: 'In Autocalls (and all barrier products), **Pinning Risk** occurs when the underlying is exactly on the barrier at the moment of the observation or maturity date.\n\nFor the market maker (structurer), it\'s a hedging nightmare: a one-cent difference means the product is either recalled (100% return) or not recalled (capital exposed). The Delta abruptly jumps from 0 to a huge number, and the **Gamma tends towards infinity**. The trader doesn\'t know which side of the market to hedge until the very last second of fixing.'
                    }
                }
            ]
        },
        {
            id: 'tarns',
            title: { fr: 'Target Redemption Notes (TARN)', en: 'Target Redemption Notes (TARN)' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Coupons cumulatifs avec plafond', en: 'Cumulative coupons with cap' },
                    body: {
                        fr: 'Un **TARN** est un produit structuré qui verse des coupons (souvent très élevés ou fixes) jusqu\'à ce qu\'un certain **montant cible (Target)** de gains cumulés soit atteint. Dès que la somme des coupons atteint ou dépasse cette cible, le produit s\'arrête prématurément (Autocall) et le capital est remboursé.',
                        en: 'A **TARN** is a structured product that pays coupons (often very high or fixed) until a certain **target amount (Target)** of cumulative gains is reached. As soon as the sum of coupons hits or exceeds this target, the product terminates early (Autocall) and capital is returned.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Mécanisme d\'Extinction', en: 'Extinction Mechanism' },
                    body: {
                        fr: 'Exemple : Target = 15%, et Coupons = 4% par trimestre.\n- T1: Cumul 4%, continue\n- T2: Cumul 8%, continue\n- T3: Cumul 12%, continue\n- T4: Le coupon de 4% ferait passer le cumul à 16%. Le produit paie seulement les 3% manquants (ou 4% selon le term sheet exact), s\'arrête, et rembourse 100% du nominal.\n\nL\'investisseur est donc pratiquement certain (sauf défaut ou perte en capital due à une barrière) d\'obtenir son Target, la seule incertitude est **quand** il l\'obtiendra (Risque de duration prolongée).',
                        en: 'Example: Target = 15%, and Coupons = 4% per quarter.\n- Q1: Cumul 4%, continues\n- Q2: Cumul 8%, continues\n- Q3: Cumul 12%, continues\n- Q4: The 4% coupon would bring cumul to 16%. The product pays only the missing 3% (or 4% depending on exact term sheet), terminates, and returns 100% nominal.\n\nThe investor is thus practically certain (barring default or capital loss due to a barrier) to get their Target; the only uncertainty is **when** they will get it (Duration extension risk).'
                    }
                }
            ]
        },
        {
            id: 'range-accrual',
            title: { fr: 'Range Accrual', en: 'Range Accrual' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Accumulation dans une fourchette', en: 'Accrual within a range' },
                    body: {
                        fr: 'Un **range accrual** verse un coupon proportionnel au nombre de jours où le sous-jacent reste dans une fourchette prédéfinie.\n\n$$ \\text{Coupon} = C \\times \\left(\\frac{\\text{jours dans le range}}{\\text{jours totaux}}\\right) $$\n\n**Exemple** : Range accrual 6%, fourchette 80%-120%, 252 jours ouvrés.\n- Si le sous-jacent reste dans le range 200 jours → Coupon = $6\\% \\times \\frac{200}{252} = \\mathbf{4.76\\%}$\n- Si le sous-jacent reste toujours dans le range → Coupon = $\\mathbf{6\\%}$ (maximum)\n\n**Dual range accrual** : deux conditions doivent être remplies simultanément (ex: indice dans un range ET taux < seuil).\n\n**FX range accrual** : version populaire sur devises (ex: EUR/USD entre 1.05 et 1.15).\n\nLe pricing repose sur la **probabilité de présence** dans le range à chaque instant, modélisée via la densité du processus de diffusion.',
                        en: 'A **range accrual** pays a coupon proportional to the number of days the underlying stays within a predefined range.\n\n$$ \\text{Coupon} = C \\times \\left(\\frac{\\text{days in range}}{\\text{total days}}\\right) $$\n\n**Example**: 6% range accrual, 80%-120% range, 252 business days.\n- If underlying stays in range 200 days → Coupon = $6\\% \\times \\frac{200}{252} = \\mathbf{4.76\\%}$\n- If underlying always stays in range → Coupon = $\\mathbf{6\\%}$ (maximum)\n\n**Dual range accrual**: two conditions must be met simultaneously (e.g., index in range AND rate < threshold).\n\n**FX range accrual**: popular version on currencies (e.g., EUR/USD between 1.05 and 1.15).\n\nPricing relies on the **occupation probability** in the range at each instant, modeled via the diffusion process density.'
                    }
                }
            ]
        },
        {
            id: 'twin-win',
            title: { fr: 'Twin-Win', en: 'Twin-Win' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Rendement absolu', en: 'Absolute return' },
                    body: {
                        fr: 'Un **Twin-Win** offre un rendement positif que le sous-jacent monte OU baisse, à condition de ne pas franchir une barrière basse.\n\n**Payoff** :\n• Si $S_T > K$ : $+|S_T/S_0 - 1|$ = upside normal\n• Si $S_T < K$ et barrière non franchie : $+|S_T/S_0 - 1|$ = la baisse est convertie en gain !\n• Si barrière franchie : perte réelle $(S_T/S_0 - 1)$\n\n**Construction** :\n- Long Call strike $K$\n- Long Put Down-and-Out strike $K$, barrière $H$\n- Short Put Down-and-In strike $K$, barrière $H$\n\nÉquivalent à : être long la valeur absolue du rendement, sauf en cas de knock-in.\n\n**Avantage** : performant en marché volatil (dans les deux directions)\n**Risque** : en cas de crash traversant la barrière, la protection disparaît.',
                        en: 'A **Twin-Win** offers positive return whether the underlying goes up OR down, provided a lower barrier is not breached.\n\n**Payoff**:\n• If $S_T > K$: $+|S_T/S_0 - 1|$ = normal upside\n• If $S_T < K$ and barrier not breached: $+|S_T/S_0 - 1|$ = decline is converted into a gain!\n• If barrier breached: actual loss $(S_T/S_0 - 1)$\n\n**Construction**:\n- Long Call strike $K$\n- Long Down-and-Out Put strike $K$, barrier $H$\n- Short Down-and-In Put strike $K$, barrier $H$\n\nEquivalent to: being long the absolute value of return, except in case of knock-in.\n\n**Advantage**: performs well in volatile markets (in both directions)\n**Risk**: in case of crash through the barrier, protection disappears.'
                    }
                }
            ]
        },
        {
            id: 'shark-note',
            title: { fr: 'Shark Note', en: 'Shark Note' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Participation avec rebate', en: 'Participation with rebate' },
                    body: {
                        fr: 'Une **Shark Note** (ou knock-out certificate) offre une participation à la hausse avec un cap automatique quand le sous-jacent touche une barrière haute.\n\n**Payoff** :\n• Si barrière non touchée : $100\\% + \\text{Participation} \\times \\left(\\frac{S_T}{S_0} - 1\\right)$\n• Si barrière touchée : $100\\% + \\text{Rebate}$ (fixe, ex: 5-10%)\n\n**Construction** : Long Call ATM KO (avec rebate)\n\nAvantage : le call KO est moins cher qu\'un call vanille → meilleure participation. Le rebate assure un gain minimum de 5-10% si le marché monte fortement (mais l\'investisseur ne profite pas pleinement de la hausse).\n\n**Comparaison avec reverse convertible** :\n- Shark Note : risque limité (capital protégé), gain cappé → pour investisseur modérément haussier\n- Reverse convertible : risque élevé (short put), coupon fixe → pour investisseur qui vend de la vol',
                        en: 'A **Shark Note** (or knock-out certificate) offers upside participation with an automatic cap when the underlying touches an upper barrier.\n\n**Payoff**:\n• If barrier not touched: $100\\% + \\text{Participation} \\times \\left(\\frac{S_T}{S_0} - 1\\right)$\n• If barrier touched: $100\\% + \\text{Rebate}$ (fixed, e.g., 5-10%)\n\n**Construction**: Long ATM Call KO (with rebate)\n\nAdvantage: KO call is cheaper than vanilla → better participation. The rebate ensures a 5-10% minimum gain if market rises strongly (but investor doesn\'t fully benefit from the rally).\n\n**Comparison with reverse convertible**:\n- Shark Note: limited risk (capital protected), capped gain → for moderately bullish investor\n- Reverse convertible: high risk (short put), fixed coupon → for investor selling vol'
                    }
                }
            ]
        },
        {
            id: 'classification-eusipa',
            title: { fr: 'Classification & Réglementation', en: 'Classification & Regulation' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'EUSIPA et PRIIPs', en: 'EUSIPA and PRIIPs' },
                    body: {
                        fr: '**EUSIPA** (European Structured Investment Products Association) classifie les produits structurés en catégories standardisées :\n\n**1. Capital Protection (EUSIPA 11xx)** :\n- 1100 : Capital garanti simple\n- 1120 : Capital garanti avec cap\n- 1130 : Capital garanti avec barrière\n\n**2. Yield Enhancement (EUSIPA 12xx)** :\n- 1200 : Reverse convertible\n- 1210 : Barrier reverse convertible\n- 1220 : Express/Autocall\n- 1260 : Phoenix\n\n**3. Participation (EUSIPA 13xx)** :\n- 1300 : Tracker certificate\n- 1310 : Outperformance certificate\n- 1320 : Bonus certificate\n- 1330 : Twin-Win\n\n**PRIIPs KID** (obligatoire depuis 2018 en Europe) :\n- Document de 3 pages maximum\n- Indicateur de risque synthétique SRI (1 à 7)\n- 4 scénarios de performance (favorable, modérément favorable, modérément défavorable, stress)\n- Coûts totaux et impact sur le rendement\n\n**MiFID II Product Governance** :\n- Définition du target market (type de client, objectifs, tolérance au risque)\n- Negative target market (clients pour qui le produit n\'est PAS adapté)\n- Obligation de suivi post-vente',
                        en: '**EUSIPA** (European Structured Investment Products Association) classifies structured products into standardized categories:\n\n**1. Capital Protection (EUSIPA 11xx)**:\n- 1100: Simple capital protection\n- 1120: Capped capital protection\n- 1130: Barrier capital protection\n\n**2. Yield Enhancement (EUSIPA 12xx)**:\n- 1200: Reverse convertible\n- 1210: Barrier reverse convertible\n- 1220: Express/Autocall\n- 1260: Phoenix\n\n**3. Participation (EUSIPA 13xx)**:\n- 1300: Tracker certificate\n- 1310: Outperformance certificate\n- 1320: Bonus certificate\n- 1330: Twin-Win\n\n**PRIIPs KID** (mandatory since 2018 in Europe):\n- Maximum 3-page document\n- Synthetic Risk Indicator SRI (1 to 7)\n- 4 performance scenarios (favorable, moderately favorable, moderately unfavorable, stress)\n- Total costs and return impact\n\n**MiFID II Product Governance**:\n- Target market definition (client type, objectives, risk tolerance)\n- Negative target market (clients for whom the product is NOT suitable)\n- Post-sale monitoring obligation'
                    }
                }
            ]
        },
        {
            id: 'case-study-comparison',
            title: { fr: 'Case Study : Comparaison de Produits', en: 'Case Study: Product Comparison' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: '5 produits sur le même sous-jacent', en: '5 products on the same underlying' },
                    body: {
                        fr: '**Conditions de marché** : EuroStoxx50 = 4200, r = 3%, vol ATM = 18%, dividendes = 2.5%, T = 5 ans.\n\n| Produit | Coupon/Participation | Protection | Risque max |\n|---------|---------------------|------------|------------|\n| Capital garanti | 55% participation | 100% capital | 0% |\n| Autocall | 7% p.a. | PDI 60% | -40% à -100% |\n| Reverse convertible | 5.5% p.a. fixe | Aucune | -100% |\n| Phoenix Memory | 6% p.a. conditionnel | PDI 65% | -35% à -100% |\n| Bonus Certificate | 1:1 + bonus 25% | Barrière 65% | -100% si KI |\n\n**Analyse** :\n- **Risque le plus faible** : Capital garanti (mais rendement modeste)\n- **Meilleur coupon** : Autocall 7% (mais risque de perte en capital si PDI touché)\n- **Rendement fixe** : Reverse convertible (mais aucune protection)\n- **Flexibilité** : Phoenix (coupon même si le sous-jacent baisse modérément)\n- **Scénario haussier** : Bonus Certificate (participation 1:1 + bonus si barrière intacte)\n\n**Leçon** : chaque produit optimise un critère différent. Il n\'y a pas de « meilleur » produit, seulement le plus adapté au profil de l\'investisseur et à sa vue de marché.',
                        en: '**Market conditions**: EuroStoxx50 = 4200, r = 3%, ATM vol = 18%, dividends = 2.5%, T = 5 years.\n\n| Product | Coupon/Participation | Protection | Max risk |\n|---------|---------------------|------------|----------|\n| Capital protected | 55% participation | 100% capital | 0% |\n| Autocall | 7% p.a. | PDI 60% | -40% to -100% |\n| Reverse convertible | 5.5% p.a. fixed | None | -100% |\n| Phoenix Memory | 6% p.a. conditional | PDI 65% | -35% to -100% |\n| Bonus Certificate | 1:1 + 25% bonus | 65% barrier | -100% if KI |\n\n**Analysis**:\n- **Lowest risk**: Capital protected (but modest return)\n- **Best coupon**: Autocall 7% (but capital loss risk if PDI hit)\n- **Fixed yield**: Reverse convertible (but no protection)\n- **Flexibility**: Phoenix (coupon even if underlying declines moderately)\n- **Bull scenario**: Bonus Certificate (1:1 participation + bonus if barrier intact)\n\n**Lesson**: each product optimizes a different criterion. There is no "best" product, only the most suitable for the investor\'s profile and market view.'
                    }
                }
            ]
        },
        {
            id: 'regulatory-suitability',
            title: { fr: 'Réglementation & Suitability', en: 'Regulation & Suitability' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Cadre réglementaire européen', en: 'European regulatory framework' },
                    body: {
                        fr: '**MiFID II** (Markets in Financial Instruments Directive II) :\n- Obligation de **transparence** sur les coûts (ex ante et ex post)\n- Test de **suitability** : le produit doit correspondre aux objectifs, à la situation financière et aux connaissances du client\n- Test d\'**appropriateness** : le client doit comprendre les risques du produit\n- **Best execution** : obligation de traiter dans les meilleures conditions pour le client\n\n**PRIIPs** (Packaged Retail Investment and Insurance Products) :\n- Obligation de fournir un **KID** (Key Information Document) avant la transaction\n- SRI (Synthetic Risk Indicator) de 1 (très faible) à 7 (très élevé)\n- Scénarios de performance standardisés\n- Transparency sur les coûts totaux (directs et indirects)\n\n**Impact sur la structuration** :\n- Les produits trop complexes sont difficiles à distribuer (SRI élevé, test de suitability restrictif)\n- Tendance à la simplification des payoffs\n- Documentation accrue (coûts de compliance significatifs pour les émetteurs)\n- Shift vers les produits avec KID favorable (autocalls avec step-down, phoenix notes)',
                        en: '**MiFID II** (Markets in Financial Instruments Directive II):\n- **Transparency** obligation on costs (ex ante and ex post)\n- **Suitability** test: product must match client\'s objectives, financial situation and knowledge\n- **Appropriateness** test: client must understand product risks\n- **Best execution**: obligation to execute in best conditions for client\n\n**PRIIPs** (Packaged Retail Investment and Insurance Products):\n- Obligation to provide a **KID** (Key Information Document) before transaction\n- SRI (Synthetic Risk Indicator) from 1 (very low) to 7 (very high)\n- Standardized performance scenarios\n- Transparency on total costs (direct and indirect)\n\n**Impact on structuring**:\n- Overly complex products are difficult to distribute (high SRI, restrictive suitability test)\n- Trend toward payoff simplification\n- Increased documentation (significant compliance costs for issuers)\n- Shift toward products with favorable KID (step-down autocalls, phoenix notes)'
                    }
                }
            ]
        }
    ]
};
