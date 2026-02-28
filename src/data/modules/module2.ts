import { CourseModule } from '../types';

export const module2: CourseModule = {
    id: 'produits-structures',
    number: 2,
    title: { fr: 'Produits Structurés Standards', en: 'Standard Structured Products' },
    subtitle: { fr: 'Capital Garanti, Reverse Convertible, Autocall', en: 'Capital Protected, Reverse Convertible, Autocall' },
    description: {
        fr: 'Maîtrisez la logique de construction des produits structurés : décomposition zéro-coupon + option, fonctionnement détaillé des principales familles (capital garanti, reverse convertible, autocall), et analyse de term sheets réels.',
        en: 'Master the construction logic of structured products: zero-coupon + option decomposition, detailed workings of main families (capital protected, reverse convertible, autocall), and real term sheet analysis.'
    },
    difficulty: 'intermédiaire',
    duration: { fr: '2-3 semaines', en: '2-3 weeks' },
    icon: '🏗️',
    color: '#8b5cf6',
    objectives: [
        { fr: 'Décomposer un produit structuré en obligations + options', en: 'Decompose a structured product into bonds + options' },
        { fr: 'Calculer le budget optionnel à partir des taux et du funding', en: 'Calculate the option budget from rates and funding' },
        { fr: 'Dessiner le payoff complet d\'un autocall avec barrière', en: 'Draw the full payoff of an autocall with barrier' },
        { fr: 'Analyser un term sheet professionnel', en: 'Analyze a professional term sheet' },
        { fr: 'Comprendre le risque de crédit émetteur dans les notes', en: 'Understand issuer credit risk in notes' },
    ],
    lessons: [
        {
            id: 'decomposition-zc-option',
            title: { fr: 'Décomposition ZC + Option', en: 'ZC + Option Decomposition' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Le principe fondamental de la structuration', en: 'The fundamental structuring principle' },
                    body: {
                        fr: 'Tout produit structuré peut se décomposer en deux composantes :\n\n1. **Composante obligataire** : un zéro-coupon (ou obligation à coupons) qui assure le remboursement du capital à maturité\n2. **Composante optionnelle** : une ou plusieurs options qui fournissent l\'exposition au marché\n\nLe **budget optionnel** est la différence entre l\'investissement initial (100%) et le coût du zéro-coupon :\n\n$$ \\text{Budget option} =  100\\% - \\text{ZC} = 100\\% - 100\\% \\times e^{-rT} $$\n\n**Facteurs qui augmentent le budget** :\n- Taux d\'intérêt élevés → ZC moins cher → plus de budget\n- Maturité longue → ZC moins cher → plus de budget\n- Spread de crédit élevé → actualisation plus forte → plus de budget\n- Protection du capital réduite (90% au lieu de 100%) → ZC moins cher\n\n**C\'est pourquoi l\'environnement de taux est crucial pour la structuration.** En période de taux zéro/négatifs (2015-2022), les produits à capital garanti étaient presque impossibles à construire avec des participations attractives.',
                        en: 'Every structured product can be broken down into two components:\n\n1. **Bond component**: a zero-coupon bond (or coupon-bearing bond) that ensures capital repayment at maturity\n2. **Option component**: one or more options providing market exposure\n\nThe **option budget** is the difference between the initial investment (100%) and the zero-coupon cost:\n\n$$ \\text{Option budget} = 100\\% - \\text{ZC} = 100\\% - 100\\% \\times e^{-rT} $$\n\n**Factors that increase the budget**:\n- High interest rates → cheaper ZC → more budget\n- Longer maturity → cheaper ZC → more budget\n- Higher credit spread → stronger discounting → more budget\n- Reduced capital protection (90% instead of 100%) → cheaper ZC\n\n**This is why the interest rate environment is crucial for structuring.** In the zero/negative rate environment (2015-2022), capital-protected products were nearly impossible to build with attractive participations.'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Calcul détaillé du budget', en: 'Detailed budget calculation' },
                    body: {
                        fr: 'Investissement = $100\\%$\nProtection capital = $P\\%$ (ex: 100%)\nTaux sans risque = $r$ (ex: 3%)\nSpread de crédit émetteur = $s$ (ex: 0.5%)\nMaturité = $T$ ans\n\n**Coût du ZC** = $P\\% \\times e^{-(r + s)T}$\n**Budget brut** = $100\\% - \\text{Coût ZC}$\n**Marge émetteur** = $\\sim 1\\%-3\\%$ (rémunération de la banque)\n**Budget net option** = $\\text{Budget brut} - \\text{Marge}$\n\nExemple : $r = 3\\%$, $s = 0.5\\%$, $T = 5$ ans, $P = 100\\%$\n$$ \\text{Coût ZC} = 100\\% \\times e^{-0.035 \\times 5} = e^{-0.175} = \\mathbf{83.9\\%} $$\n$$ \\text{Budget brut} = 100\\% - 83.9\\% = \\mathbf{16.1\\%} $$\n$$ \\text{Budget net} \\approx 16.1\\% - 2\\% = \\mathbf{14.1\\%} \\text{ pour acheter les options} $$',
                        en: 'Investment = $100\\%$\nCapital protection = $P\\%$ (e.g., 100%)\nRisk-free rate = $r$ (e.g., 3%)\nIssuer credit spread = $s$ (e.g., 0.5%)\nMaturity = $T$ years\n\n**ZC cost** = $P\\% \\times e^{-(r + s)T}$\n**Gross budget** = $100\\% - \\text{ZC cost}$\n**Issuer margin** = $\\sim 1\\%-3\\%$ (bank compensation)\n**Net option budget** = $\\text{Gross budget} - \\text{Margin}$\n\nExample: $r = 3\\%$, $s = 0.5\\%$, $T = 5$ years, $P = 100\\%$\n$$ \\text{ZC cost} = 100\\% \\times e^{-0.035 \\times 5} = e^{-0.175} = \\mathbf{83.9\\%} $$\n$$ \\text{Gross budget} = 100\\% - 83.9\\% = \\mathbf{16.1\\%} $$\n$$ \\text{Net budget} \\approx 16.1\\% - 2\\% = \\mathbf{14.1\\%} \\text{ to buy options} $$'
                    }
                },
                {
                    type: 'warning',
                    title: { fr: 'Risque de crédit émetteur', en: 'Issuer credit risk' },
                    body: {
                        fr: '**Attention** : la « garantie » du capital n\'est qu\'une promesse de l\'émetteur (la banque). Si l\'émetteur fait défaut, l\'investisseur perd sa protection.\n\nC\'est ce qui s\'est passé avec **Lehman Brothers en 2008** : tous les produits structurés émis par Lehman (notes, certificats) sont devenus quasiment sans valeur, même ceux avec capital « garanti ».\n\nL\'investisseur est toujours exposé au **risque de crédit** de l\'émetteur, en plus du risque de marché.\n\n**Paradoxe du funding** : une banque avec un spread de crédit plus élevé (donc plus risquée) peut offrir des conditions plus attractives car le ZC est actualisé à un taux plus élevé → plus de budget pour les options.',
                        en: '**Warning**: the capital "guarantee" is only a promise from the issuer (the bank). If the issuer defaults, the investor loses their protection.\n\nThis is what happened with **Lehman Brothers in 2008**: all structured products issued by Lehman (notes, certificates) became virtually worthless, even those with "guaranteed" capital.\n\nThe investor is always exposed to the **credit risk** of the issuer, in addition to market risk.\n\n**Funding paradox**: a bank with a higher credit spread (therefore riskier) can offer more attractive terms because the ZC is discounted at a higher rate → more budget for options.'
                    }
                }
            ]
        },
        {
            id: 'capital-garanti',
            title: { fr: 'Produit à Capital Garanti', en: 'Capital Protected Product' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Construction et mécanisme', en: 'Construction and mechanism' },
                    body: {
                        fr: 'Un produit à **capital garanti** protège 100% du capital investi à maturité, tout en offrant une participation (partielle) à la hausse d\'un sous-jacent.\n\n**Construction** : Zéro-coupon (maturité $T$) + Call ATM (ou OTM) sur l\'indice\n\n$$ \\text{Payoff} = 100\\% + \\text{Participation} \\times \\max\\left(\\frac{S_T}{S_0} - 1, 0\\right) $$\n\n**Variantes courantes** :\n- **Avec cap** : participation limitée → $\\text{Payoff} = 100\\% + \\text{Part} \\times \\min\\left(\\max\\left(\\frac{S_T}{S_0} - 1, 0\\right), \\text{Cap}\\right)$\n- **Avec floor > 0** : protection partielle (ex: 95%) → ZC moins cher → meilleure participation\n- **Click** : participation mesurée sur la meilleure performance sur des sous-périodes\n- **Best-of** : participation sur la meilleure performance de plusieurs sous-jacents',
                        en: 'A **capital protected** product protects 100% of invested capital at maturity while offering (partial) participation in the upside of an underlying.\n\n**Construction**: Zero-coupon (maturity $T$) + ATM Call (or OTM) on the index\n\n$$ \\text{Payoff} = 100\\% + \\text{Participation} \\times \\max\\left(\\frac{S_T}{S_0} - 1, 0\\right) $$\n\n**Common variants**:\n- **With cap**: limited participation → $\\text{Payoff} = 100\\% + \\text{Part} \\times \\min\\left(\\max\\left(\\frac{S_T}{S_0} - 1, 0\\right), \\text{Cap}\\right)$\n- **With floor > 0**: partial protection (e.g., 95%) → cheaper ZC → better participation\n- **Click**: participation measured on best performance across sub-periods\n- **Best-of**: participation on the best performing of several underlyings'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Construction numérique complète', en: 'Complete numerical construction' },
                    body: {
                        fr: '**Données de marché** : $r = 3.5\\%$, spread crédit = $0.5\\%$, $T = 5$ ans, EuroStoxx50 à $4200$.\n\n**Étape 1 — Coût du ZC** :\n$$ \\text{ZC} = 100\\% \\times e^{-(0.035+0.005) \\times 5} = e^{-0.20} = \\mathbf{81.9\\%} $$\n\n**Étape 2 — Budget** :\n$$ \\text{Budget brut} = 100\\% - 81.9\\% = 18.1\\% $$\nMarge émetteur = $2\\%$ → Budget net = $\\mathbf{16.1\\%}$\n\n**Étape 3 — Achat de l\'option** :\nCall ATM 5 ans sur SX5E, vol = 20% → Prix BS $\\approx 26\\%$ du nominal\nAvec un budget de 16.1%, $\\text{participation} = 16.1\\% / 26\\% = \\mathbf{62\\%}$\n\n**Résultat final** : Capital garanti 5 ans, participation 62%\n- SX5E +40% → Rendement = $62\\% \\times 40\\% = \\mathbf{+24.8\\%}$\n- SX5E -30% → Rendement = $\\mathbf{0\\%}$ (capital protégé)\n\n**Alternative** : si on ajoute un cap à 30%, le call spreads coûte moins ($\\approx 20\\%$) → participation $= 16.1\\% / 20\\% = \\mathbf{80.5\\%}$. Mais le gain est limité à $80.5\\% \\times 30\\% = 24.15\\%$.',
                        en: '**Market data**: $r = 3.5\\%$, credit spread = $0.5\\%$, $T = 5$ years, EuroStoxx50 at $4200$.\n\n**Step 1 — ZC cost**:\n$$ \\text{ZC} = 100\\% \\times e^{-(0.035+0.005)\\times 5} = e^{-0.20} = \\mathbf{81.9\\%} $$\n\n**Step 2 — Budget**:\n$$ \\text{Gross budget} = 100\\% - 81.9\\% = 18.1\\% $$\nIssuer margin = 2% → Net budget = $\\mathbf{16.1\\%}$\n\n**Step 3 — Option purchase**:\nATM Call 5Y on SX5E, vol = 20% → BS price $\\approx 26\\%$ of notional\nWith a 16.1% budget, $\\text{participation} = 16.1\\% / 26\\% = \\mathbf{62\\%}$\n\n**Final product**: 5Y capital protected, 62% participation\n- SX5E +40% → Return = $62\\% \\times 40\\% = \\mathbf{+24.8\\%}$\n- SX5E -30% → Return = $\\mathbf{0\\%}$ (capital protected)\n\n**Alternative**: adding a 30% cap, call spread costs less ($\\approx 20\\%$) → participation $= 16.1\\% / 20\\% = \\mathbf{80.5\\%}$. But gain is capped at $80.5\\% \\times 30\\% = 24.15\\%$.'
                    }
                }
            ]
        },
        {
            id: 'reverse-convertible',
            title: { fr: 'Reverse Convertible', en: 'Reverse Convertible' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Structure et décomposition', en: 'Structure and decomposition' },
                    body: {
                        fr: 'Un **reverse convertible** offre un coupon fixe élevé en échange d\'une prise de risque sur le sous-jacent. L\'investisseur est implicitement **short un put**.\n\n**Décomposition** :\n- Obligation zéro-coupon (remboursement 100%)\n- Short Put strike $K$ (= spot initial)\n- Le coupon élevé = rendement du ZC + prime du put vendu\n\n**Payoff à maturité** :\n• Si $S_T \\ge K$ : remboursement **100% + coupon**\n• Si $S_T < K$ : remboursement **($S_T/K) \\times 100\\%$ + coupon** (en actions ou cash équivalent)\n\n**Barrier Reverse Convertible** : la perte n\'est activée que si le sous-jacent touche une barrière basse (typ. 60-70%) en cours de vie. Si la barrière n\'est jamais touchée, remboursement 100% même si $S_T < K$.',
                        en: 'A **reverse convertible** offers a high fixed coupon in exchange for taking risk on the underlying. The investor is implicitly **short a put**.\n\n**Decomposition**:\n- Zero-coupon bond (100% repayment)\n- Short Put strike $K$ (= initial spot)\n- The high coupon = ZC yield + sold put premium\n\n**Payoff at maturity**:\n• If $S_T \\ge K$: repayment **100% + coupon**\n• If $S_T < K$: repayment **($S_T/K) \\times 100\\%$ + coupon** (in shares or cash equivalent)\n\n**Barrier Reverse Convertible**: loss is only activated if the underlying touches a low barrier (typ. 60-70%) during the life. If the barrier is never touched, 100% repayment even if $S_T < K$.'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Exemple détaillé avec scénarios', en: 'Detailed example with scenarios' },
                    body: {
                        fr: 'Barrier Reverse Convertible 1 an sur BNP Paribas, coupon 10%, strike 100%, barrière 70%.\n\n**Scénarios** :\n• BNP à +15% : Barrière jamais touchée → **100% + 10% = 110%** ✓\n• BNP à -10%, jamais sous 70% : Barrière intacte → **100% + 10% = 110%** ✓\n• BNP à -10%, touché 65% en cours de route : Barrière activée → **90% + 10% = 100%** (breakeven)\n• BNP à -35%, touché la barrière : **65% + 10% = 75%** (perte nette -25%)\n\n**Analyse du profil** : Le coupon de 10% rémunère le risque d\'un put barrière. Plus la vol de BNP est élevée → plus la prime du put est élevée → plus le coupon offert est attractif.',
                        en: 'Barrier Reverse Convertible 1Y on BNP Paribas, coupon 10%, strike 100%, barrier 70%.\n\n**Scenarios**:\n• BNP at +15%: Barrier never touched → **100% + 10% = 110%** ✓\n• BNP at -10%, never below 70%: Barrier intact → **100% + 10% = 110%** ✓\n• BNP at -10%, touched 65% during the life: Barrier activated → **90% + 10% = 100%** (breakeven)\n• BNP at -35%, touched the barrier: **65% + 10% = 75%** (net loss -25%)\n\n**Profile analysis**: The 10% coupon compensates for knock-in put risk. Higher BNP vol → higher put premium → more attractive coupon.'
                    }
                }
            ]
        },
        {
            id: 'autocall',
            title: { fr: 'Autocall (Autocallable)', en: 'Autocall (Autocallable)' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Mécanisme détaillé', en: 'Detailed mechanism' },
                    body: {
                        fr: 'Un **autocall** est un produit qui se rappelle automatiquement (remboursement anticipé) si le sous-jacent dépasse un seuil prédéfini (barrière autocall) à l\'une des dates d\'observation.\n\n**À chaque date d\'observation (t₁, t₂, ..., tₙ)** :\n• Si Spot ≥ Barrière autocall → **Rappel** : remboursement 100% + Σ coupons\n• Si Spot < Barrière autocall → **Pas de rappel**, le produit continue\n\n**À maturité T (si jamais rappelé)** :\n• Si Spot ≥ Barrière basse (PDI) → Remboursement **100%** + éventuellement coupon\n• Si Spot < Barrière basse → Perte : remboursement = **Spot/Strike × 100%**\n\n**Composantes options** :\n- N × Digital Calls (coupons conditionnels aux dates d\'observation)\n- Short Put Down-and-In (protection conditionnelle du capital)\n- L\'autocall feature elle-même est un ensemble d\'options digitales à barrière\n\n**Durée de vie** : incertaine ! L\'autocall peut durer 1 an ou 10 ans selon la trajectoire du sous-jacent.',
                        en: 'An **autocall** is a product that automatically redeems early if the underlying exceeds a predefined threshold (autocall barrier) on one of the observation dates.\n\n**At each observation date (t₁, t₂, ..., tₙ)**:\n• If Spot ≥ Autocall barrier → **Recall**: repayment 100% + Σ coupons\n• If Spot < Autocall barrier → **No recall**, product continues\n\n**At maturity T (if never recalled)**:\n• If Spot ≥ Lower barrier (PDI) → Repayment **100%** + possibly coupon\n• If Spot < Lower barrier → Loss: repayment = **Spot/Strike × 100%**\n\n**Option components**:\n- N × Digital Calls (conditional coupons at observation dates)\n- Short Down-and-In Put (conditional capital protection)\n- The autocall feature itself is a set of barrier digital options\n\n**Lifetime**: uncertain! The autocall can last 1 year or 10 years depending on the underlying\'s path.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Memory coupon (effet mémoire)', en: 'Memory coupon (snowball effect)' },
                    body: {
                        fr: 'L\'**effet mémoire** signifie que les coupons non versés sont stockés et payés rétroactivement quand les conditions sont de nouveau remplies.\n\n**Exemple** : Autocall avec coupon annuel de 7% et mémoire.\n- An 1 : Spot = 95% < 100% → pas de coupon, mais 7% stocké\n- An 2 : Spot = 85% < 100% → pas de coupon, 14% stockés\n- An 3 : Spot = 105% → Autocall ! Remboursement = 100% + 21% (3 × 7%) = **121%**\n\nSans mémoire, le remboursement aurait été 100% + 7% = 107%.\n\nL\'effet mémoire augmente le coupon apparent mais ne coûte pas beaucoup plus en termes d\'option (les coupons mémoire ne sont versés que si l\'autocall se déclenche).',
                        en: 'The **memory effect** means unpaid coupons are stored and paid retroactively when conditions are met again.\n\n**Example**: Autocall with 7% annual coupon and memory.\n- Year 1: Spot = 95% < 100% → no coupon, but 7% stored\n- Year 2: Spot = 85% < 100% → no coupon, 14% stored\n- Year 3: Spot = 105% → Autocall! Repayment = 100% + 21% (3 × 7%) = **121%**\n\nWithout memory, repayment would have been 100% + 7% = 107%.\n\nThe memory effect increases the apparent coupon but doesn\'t cost much more in option terms (memory coupons are only paid if autopay triggers).'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Exemple complet d\'autocall', en: 'Complete autocall example' },
                    body: {
                        fr: '**Autocall 5 ans sur EuroStoxx50**\nObservations annuelles, coupon 7%/an, barrière autocall = 100%, barrière PDI = 60%.\n\n**Scénario 1 — Rappel année 2** :\nAn 1 : SX5E = 95% → pas de rappel\nAn 2 : SX5E = 105% → **Rappel !** Remboursement = 100% + 14% = **114%** (rendement 7%/an)\n\n**Scénario 2 — Pas de rappel, maturité sans knock-in** :\nAn 1-5 : SX5E oscille entre 70% et 95%\nMaturité : SX5E = 80% > 60% → Remboursement = **100%** (capital protégé, mais aucun coupon)\n\n**Scénario 3 — Knock-in activé** :\nAn 3 : SX5E touche 55% (< 60%) → barrière PDI franchie\nMaturité : SX5E = 50% → Remboursement = **50%** (perte de 50%)\n\n**Scénario 4 — Knock-in puis recovery** :\nAn 2 : SX5E touche 58% (PDI franchi)\nAn 4 : SX5E = 102% → **Rappel !** Remboursement = 100% + 28% = **128%** (le knock-in n\'empêche pas le rappel)',
                        en: '**5Y Autocall on EuroStoxx50**\nAnnual observations, 7%/year coupon, autocall barrier = 100%, PDI barrier = 60%.\n\n**Scenario 1 — Recall year 2**:\nY1: SX5E = 95% → no recall\nY2: SX5E = 105% → **Recall!** Repayment = 100% + 14% = **114%** (7%/year return)\n\n**Scenario 2 — No recall, maturity without knock-in**:\nY1-5: SX5E oscillates between 70% and 95%\nMaturity: SX5E = 80% > 60% → Repayment = **100%** (capital protected but no coupon)\n\n**Scenario 3 — Knock-in activated**:\nY3: SX5E touches 55% (< 60%) → PDI barrier breached\nMaturity: SX5E = 50% → Repayment = **50%** (50% loss)\n\n**Scenario 4 — Knock-in then recovery**:\nY2: SX5E touches 58% (PDI breached)\nY4: SX5E = 102% → **Recall!** Repayment = 100% + 28% = **128%** (knock-in doesn\'t prevent recall)'
                    }
                }
            ]
        },
        {
            id: 'participation-products',
            title: { fr: 'Produits de Participation', en: 'Participation Products' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Au-delà du capital garanti', en: 'Beyond capital protection' },
                    body: {
                        fr: 'Les produits de **participation** offrent une exposition au marché avec des profils variés. Voici les principales variantes :\n\n**Bonus Certificate** :\n- Participation 1:1 au sous-jacent à la hausse\n- Si le sous-jacent ne touche jamais la barrière basse → remboursement minimum garanti (le « bonus »)\n- Construction : Long sous-jacent + Long Put DI + Short Put standard\n\n**Airbag** :\n- Protection partielle : les premières X% de baisse sont absorbées\n- Au-delà, l\'investisseur subit la perte\n- Ex: Airbag 20% → perte de 30% du sous-jacent → perte investisseur = 10%/80% = 12.5%\n\n**Outperformance Certificate** :\n- Participation > 100% à la hausse (ex: 150%)\n- Pas de protection à la baisse\n- Construction : Long sous-jacent + Long Call ATM (financé par la prise de risque baisse)',
                        en: '**Participation** products offer market exposure with varied profiles. Main variants:\n\n**Bonus Certificate**:\n- 1:1 participation in the underlying on the upside\n- If the underlying never touches the lower barrier → guaranteed minimum repayment (the "bonus")\n- Construction: Long underlying + Long DI Put + Short standard Put\n\n**Airbag**:\n- Partial protection: the first X% of decline is absorbed\n- Beyond that, the investor bears the loss\n- E.g.: 20% Airbag → 30% underlying decline → investor loss = 10%/80% = 12.5%\n\n**Outperformance Certificate**:\n- Participation > 100% on the upside (e.g., 150%)\n- No downside protection\n- Construction: Long underlying + Long ATM Call (funded by downside risk)'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Digital Coupon Notes', en: 'Digital Coupon Notes' },
                    body: {
                        fr: 'Les **digital coupon notes** versent un coupon fixe si une condition numérique est remplie :\n\n$$ \\text{Payoff coupon} = C \\times \\mathbb{1}_{\\{S > \\text{Barrière}\\}} $$\n\n**Exemple** : Digital coupon 5% si EuroStoxx50 > 80% du spot initial chaque trimestre.\n- Q1: SX5E = 85% → coupon 5%/4 = 1.25% ✓\n- Q2: SX5E = 78% → pas de coupon ✗\n- Q3: SX5E = 92% → coupon 1.25% ✓\n- Q4: SX5E = 88% → coupon 1.25% ✓\n- Total = 3.75% sur l\'année\n\nLa barrière est typiquement fixée entre 60% et 80%. Plus basse = plus de chances de paiement = coupon plus petit.',
                        en: '**Digital coupon notes** pay a fixed coupon if a digital condition is met:\n\n$$ \\text{Coupon payoff} = C \\times \\mathbb{1}_{\\{S > \\text{Barrier}\\}} $$\n\n**Example**: 5% digital coupon if EuroStoxx50 > 80% of initial spot each quarter.\n- Q1: SX5E = 85% → coupon 5%/4 = 1.25% ✓\n- Q2: SX5E = 78% → no coupon ✗\n- Q3: SX5E = 92% → coupon 1.25% ✓\n- Q4: SX5E = 88% → coupon 1.25% ✓\n- Total = 3.75% for the year\n\nThe barrier is typically set between 60% and 80%. Lower = higher payment probability = smaller coupon.'
                    }
                }
            ]
        },
        {
            id: 'case-study-athena',
            title: { fr: 'Case Study : BNP Athena', en: 'Case Study: BNP Athena' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'Analyse d\'un term sheet réel', en: 'Real term sheet analysis' },
                    body: {
                        fr: '**Produit** : BNP Paribas Athena Autocall\n**Sous-jacent** : EuroStoxx50\n**Maturité maximale** : 8 ans\n**Coupon conditionnel** : 7.0% p.a. avec effet mémoire\n**Observations** : Annuelles\n**Barrière autocall** : 100% en Y1, puis décroissante (step-down) de 5% par an\n**Barrière PDI** : 50% du spot initial (observation continue)\n**Émetteur** : BNP Paribas (rating A+/Aa3)\n\n**Analyse du term sheet** :\n\n1. **Step-down** : La barrière autocall passe de 100% à 65% en année 8. Cela augmente significativement la probabilité de rappel. Même si l\'indice est à -30% en année 8, le produit se rappelle.\n\n2. **Coupon 7% avec mémoire** : Si l\'indice ne touche jamais la barrière autocall pendant 5 ans puis se rappelle → coupon total = 35% (5 × 7%). Le rendement annualisé reste 7%.\n\n3. **PDI à 50%** : protection agressive. L\'investisseur ne perd que si l\'indice chute de plus de 50% ET n\'a jamais dépassé la barrière autocall. Historiquement, l\'EuroStoxx50 n\'a touché -50% que pendant la crise 2008-2009.\n\n4. **Risque de crédit BNP** : Rating A+, spread CDS ~60bps. Risque limité mais non nul. Le produit est émis sous forme de note EMTN.\n\n5. **Pricing** : Le produit est émis à 100%. La banque gagne sa marge sur la différence entre le prix des options de marché et le prix offert à l\'investisseur.\n\n**Scénario favorable** (probabilité ~60%) : rappel dans les 2-3 premières années → rendement 7-21%.\n**Scénario moyen** (probabilité ~25%) : rappel tardif (années 4-8) grâce au step-down → rendement annualisé ~7%.\n**Scénario défavorable** (probabilité ~15%) : pas de rappel, PDI touché, grosse perte en capital.',
                        en: '**Product**: BNP Paribas Athena Autocall\n**Underlying**: EuroStoxx50\n**Maximum maturity**: 8 years\n**Conditional coupon**: 7.0% p.a. with memory effect\n**Observations**: Annual\n**Autocall barrier**: 100% in Y1, then decreasing (step-down) by 5% per year\n**PDI barrier**: 50% of initial spot (continuous observation)\n**Issuer**: BNP Paribas (rating A+/Aa3)\n\n**Term sheet analysis**:\n\n1. **Step-down**: Autocall barrier goes from 100% to 65% in year 8. This significantly increases recall probability. Even if the index is at -30% in year 8, the product recalls.\n\n2. **7% coupon with memory**: If the index never touches the autocall barrier for 5 years then recalls → total coupon = 35% (5 × 7%). Annualized return remains 7%.\n\n3. **PDI at 50%**: Aggressive protection. Investor only loses if index drops more than 50% AND never exceeded the autocall barrier. Historically, EuroStoxx50 only touched -50% during the 2008-2009 crisis.\n\n4. **BNP credit risk**: A+ rating, CDS spread ~60bps. Limited but non-zero risk. Product issued as EMTN note.\n\n5. **Pricing**: Product is issued at 100%. The bank earns its margin on the difference between market option prices and the price offered to the investor.\n\n**Favorable scenario** (probability ~60%): recall within first 2-3 years → return 7-21%.\n**Average scenario** (probability ~25%): late recall (years 4-8) thanks to step-down → annualized return ~7%.\n**Unfavorable scenario** (probability ~15%): no recall, PDI touched, significant capital loss.'
                    }
                }
            ]
        },
        {
            id: 'case-study-lehman',
            title: { fr: 'Case Study : Lehman Brothers 2008', en: 'Case Study: Lehman Brothers 2008' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'Quand la garantie du capital disparaît', en: 'When capital protection vanishes' },
                    body: {
                        fr: '**Contexte** : Le 15 septembre 2008, Lehman Brothers fait faillite (Chapter 11), avec un passif de **613 milliards de dollars** — la plus grande faillite de l\'histoire américaine.\n\n**Impact sur les produits structurés** :\n- Lehman avait émis des **milliards de dollars** de notes structurées destinées aux investisseurs retail et institutionnels\n- Tous les produits portant le risque de crédit Lehman (émis sous son programme EMTN) ont vu leur valeur s\'effondrer\n- Des produits avec « capital garanti à 100% » ne valaient plus que **8-12 cents par dollar** au moment de la liquidation\n\n**Investisseurs touchés** :\n- Particuliers en Europe et en Asie ayant acheté des notes « Minibonds » Lehman\n- À Hong Kong, plus de 43 000 investisseurs retail ont perdu leurs économies\n- En Europe, des produits distribués par des réseaux bancaires locaux portaient le risque Lehman sans que les clients en soient toujours conscients\n\n**Leçons fondamentales** :\n1. **La « garantie » de capital dépend de la solvabilité de l\'émetteur** — ce n\'est pas une garantie absolue\n2. **Diversification des émetteurs** : ne pas concentrer tous ses placements chez un seul émetteur\n3. **Rating ≠ sécurité** : Lehman était noté A2/A juste avant la faillite\n4. **Risque systémique** : en cas de crise, les corrélations augmentent et les protections peuvent toutes défaillir simultanément\n5. **Réformes post-2008** : EMIR, Bâle III, PRIIPs (obligation de KID en Europe) — transparence accrue',
                        en: '**Context**: On September 15, 2008, Lehman Brothers filed for bankruptcy (Chapter 11), with liabilities of **$613 billion** — the largest bankruptcy in American history.\n\n**Impact on structured products**:\n- Lehman had issued **billions of dollars** in structured notes for retail and institutional investors\n- All products carrying Lehman credit risk (issued under its EMTN programme) saw their value collapse\n- Products with "100% capital guarantee" were worth only **8-12 cents per dollar** at liquidation\n\n**Affected investors**:\n- Retail investors in Europe and Asia who bought Lehman "Minibond" notes\n- In Hong Kong, over 43,000 retail investors lost their savings\n- In Europe, products distributed by local banking networks carried Lehman risk without clients always being aware\n\n**Fundamental lessons**:\n1. **Capital "guarantee" depends on issuer solvency** — it is not an absolute guarantee\n2. **Issuer diversification**: don\'t concentrate all investments with a single issuer\n3. **Rating ≠ safety**: Lehman was rated A2/A just before bankruptcy\n4. **Systemic risk**: in a crisis, correlations increase and protections can all fail simultaneously\n5. **Post-2008 reforms**: EMIR, Basel III, PRIIPs (KID obligation in Europe) — increased transparency'
                    }
                }
            ]
        },
        {
            id: 'product-construction',
            title: { fr: 'Atelier de Construction', en: 'Construction Workshop' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Du besoin client au produit', en: 'From client need to product' },
                    body: {
                        fr: '**Brief client** : « Je veux un rendement de 5-6% par an avec une protection à 70% du capital sur l\'EuroStoxx50, horizon 5 ans. »\n\n**Étape 1 — Identifier le profil** :\n- Le client veut du rendement (yield enhancement) avec protection partielle → famille **autocall** ou **reverse convertible** avec barrière.\n\n**Étape 2 — Conditions de marché** :\n- $r = 3\\%$, spread émetteur = $0.8\\%$, vol SX5E = $18\\%$, dividendes = $2.5\\%$\n- Budget ZC (protection 70%) $= 100\\% - 70\\% \\times e^{-0.038 \\times 5} = 100\\% - 70\\% \\times 0.827 = \\mathbf{42.1\\%}$\n- C\'est énorme ! Mais on ne veut pas protéger seulement 70%, on veut un **autocall** avec PDI à 70%.\n\n**Étape 3 — Structuration autocall** :\n- Coupon cible = $6\\%$ p.a. avec mémoire\n- Barrière autocall = $100\\%$ (flat, pas de step-down)\n- Barrière PDI = $70\\%$ (européenne, observation maturité uniquement)\n- Observations semestrielles (10 dates sur 5 ans)\n\n**Étape 4 — Pricing** :\n- Prix des digitals (coupons) $\\approx 35\\%$ du nominal\n- Prix du put DI strike 100%, barrière 70% $\\approx -12\\%$ (prime reçue)\n- Funding advantage $\\approx 3.5\\%$\n- Prix total $\\approx 35\\% - 12\\% + \\text{ZC} + \\text{marge} \\approx 100\\%$ ✓\n\n**Étape 5 — Ajustement** :\nSi le prix dépasse 100% → réduire le coupon ou ajouter un step-down\nSi le prix est sous 100% → augmenter le coupon',
                        en: '**Client brief**: "I want a 5-6% annual return with 70% capital protection on EuroStoxx50, 5-year horizon."\n\n**Step 1 — Identify the profile**:\n- Client wants yield enhancement with partial protection → **autocall** or **reverse convertible** with barrier family.\n\n**Step 2 — Market conditions**:\n- $r = 3\\%$, issuer spread = $0.8\\%$, SX5E vol = $18\\%$, dividends = $2.5\\%$\n- ZC budget (70% protection) $= 100\\% - 70\\% \\times e^{-0.038 \\times 5} = 100\\% - 70\\% \\times 0.827 = \\mathbf{42.1\\%}$\n- This is huge! But we don\'t just want to protect 70%, we want an **autocall** with PDI at 70%.\n\n**Step 3 — Autocall structuring**:\n- Target coupon = $6\\%$ p.a. with memory\n- Autocall barrier = $100\\%$ (flat, no step-down)\n- PDI barrier = $70\\%$ (European, maturity observation only)\n- Semi-annual observations (10 dates over 5 years)\n\n**Step 4 — Pricing**:\n- Digital prices (coupons) $\\approx 35\\%$ of notional\n- DI put price strike 100%, barrier 70% $\\approx -12\\%$ (premium received)\n- Funding advantage $\\approx 3.5\\%$\n- Total price $\\approx 35\\% - 12\\% + \\text{ZC} + \\text{margin} \\approx 100\\%$ ✓\n\n**Step 5 — Adjustment**:\nIf price exceeds 100% → reduce coupon or add step-down\nIf price is below 100% → increase coupon'
                    }
                }
            ]
        },
        {
            id: 'secondary-market',
            title: { fr: 'Marché Secondaire & Cycle de Vie', en: 'Secondary Market & Lifecycle' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Après l\'émission', en: 'After issuance' },
                    body: {
                        fr: 'Une fois émis, le produit structuré vit sur le **marché secondaire**. Sa valeur évolue en fonction des paramètres de marché.\n\n**Facteurs d\'évolution du prix** :\n- **Mouvement du sous-jacent** : le delta du produit détermine l\'impact\n- **Volatilité** : les autocalls sont généralement short vega → hausse de vol = baisse du prix\n- **Temps** : la valeur temps des options s\'érode (theta)\n- **Taux d\'intérêt** : impact sur la composante ZC\n- **Spread de crédit** : élargissement → baisse du prix de la note\n\n**Liquidité** :\n- La banque émettrice est tenue de fournir un prix bid/ask (market making)\n- Les spreads bid-ask sont typiquement 0.5-2% pour les produits simples, 2-5% pour les exotiques\n- En période de stress de marché, les spreads peuvent s\'écarter considérablement\n\n**Corporate actions** :\n- Dividendes exceptionnels, fusions, splits → ajustement des barrières et du strike\n- Le « Calculation Agent » (généralement l\'émetteur) décide des ajustements\n- Risque : l\'émetteur est juge et partie (conflict of interest potentiel)',
                        en: 'Once issued, the structured product lives on the **secondary market**. Its value evolves based on market parameters.\n\n**Price evolution factors**:\n- **Underlying movement**: the product\'s delta determines the impact\n- **Volatility**: autocalls are generally short vega → vol increase = price decrease\n- **Time**: option time value erodes (theta)\n- **Interest rates**: impact on the ZC component\n- **Credit spread**: widening → note price decrease\n\n**Liquidity**:\n- The issuing bank is required to provide bid/ask prices (market making)\n- Bid-ask spreads are typically 0.5-2% for simple products, 2-5% for exotics\n- During market stress, spreads can widen considerably\n\n**Corporate actions**:\n- Exceptional dividends, mergers, splits → barrier and strike adjustments\n- The "Calculation Agent" (usually the issuer) decides on adjustments\n- Risk: the issuer is judge and party (potential conflict of interest)'
                    }
                }
            ]
        }
    ]
};
