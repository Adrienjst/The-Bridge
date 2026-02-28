import { CourseModule } from '../types';

export const module5: CourseModule = {
    id: 'pricing-greeks',
    number: 5,
    title: { fr: 'Pricing & Greeks', en: 'Pricing & Greeks' },
    subtitle: { fr: 'Black-Scholes, Volatilité, Greeks, Monte Carlo', en: 'Black-Scholes, Volatility, Greeks, Monte Carlo' },
    description: {
        fr: 'Maîtrisez la théorie du pricing : modèle de Black-Scholes avec dérivation, les 5 Greeks et leurs formules, volatilité implicite et surface de vol, Monte Carlo pour les exotiques, et hedging en pratique.',
        en: 'Master pricing theory: Black-Scholes model with derivation, the 5 Greeks and their formulas, implied volatility and vol surface, Monte Carlo for exotics, and hedging in practice.'
    },
    difficulty: 'avancé',
    duration: { fr: '3-4 semaines', en: '3-4 weeks' },
    icon: '🧮',
    color: '#10b981',
    objectives: [
        { fr: 'Comprendre l\'intuition du modèle Black-Scholes et ses hypothèses', en: 'Understand the Black-Scholes model intuition and assumptions' },
        { fr: 'Calculer les 5 Greeks d\'une option vanille', en: 'Calculate the 5 Greeks of a vanilla option' },
        { fr: 'Interpréter une surface de volatilité (smile, skew, term structure)', en: 'Interpret a volatility surface (smile, skew, term structure)' },
        { fr: 'Comprendre le pricing Monte Carlo et son application aux exotiques', en: 'Understand Monte Carlo pricing and its application to exotics' },
        { fr: 'Expliquer les mécanismes du delta hedging et du gamma scalping', en: 'Explain delta hedging and gamma scalping mechanics' },
    ],
    lessons: [
        {
            id: 'black-scholes',
            title: { fr: 'Le Modèle Black-Scholes', en: 'The Black-Scholes Model' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Hypothèses et intuition', en: 'Assumptions and intuition' },
                    body: {
                        fr: 'Le modèle de **Black-Scholes-Merton** (1973) est le modèle fondamental de pricing d\'options. Ses hypothèses :\n\n1. Le prix du sous-jacent suit un **mouvement brownien géométrique** (GBM) : $$ dS = \\mu S dt + \\sigma S dW $$\n2. La **volatilité $\\sigma$** est constante\n3. Le **taux sans risque $r$** est constant\n4. Pas de frais de transaction ni de taxes\n5. Pas de dividendes (ou dividendes continus au taux $q$)\n6. Le trading est continu (réajustement instantané)\n7. Pas d\'opportunité d\'arbitrage\n\n**Intuition de la dérivation** :\n- Construire un portefeuille $\\Delta$-neutre : long 1 option + short $\\Delta$ actions\n- Ce portefeuille est sans risque sur un instant $dt$ → il doit rapporter le taux sans risque $r$\n- Cela donne l\'EDP de Black-Scholes :\n\n$$ \\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS \\frac{\\partial V}{\\partial S} - rV = 0 $$\n\nAvec les conditions aux limites (call) : $V(S,T) = \\max(S-K, 0)$, on obtient la formule fermée.',
                        en: 'The **Black-Scholes-Merton** model (1973) is the fundamental option pricing model. Its assumptions:\n\n1. The underlying price follows a **geometric Brownian motion** (GBM): $$ dS = \\mu S dt + \\sigma S dW $$\n2. **Volatility $\\sigma$** is constant\n3. **Risk-free rate $r$** is constant\n4. No transaction costs or taxes\n5. No dividends (or continuous dividends at rate $q$)\n6. Continuous trading (instantaneous rebalancing)\n7. No arbitrage opportunity\n\n**Derivation intuition**:\n- Construct a $\\Delta$-neutral portfolio: long 1 option + short $\\Delta$ shares\n- This portfolio is riskless over an instant $dt$ → it must earn the risk-free rate $r$\n- This gives the Black-Scholes PDE:\n\n$$ \\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS \\frac{\\partial V}{\\partial S} - rV = 0 $$\n\nWith boundary conditions (call): $V(S,T) = \\max(S-K, 0)$, we obtain the closed-form formula.'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Formule de Black-Scholes', en: 'Black-Scholes Formula' },
                    body: {
                        fr: '**Call européen** :\n$$ C = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2) $$\n\n**Put européen** :\n$$ P = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1) $$\n\noù :\n$$ d_1 = \\frac{\\ln(S_0/K) + (r - q + \\sigma^2/2)T}{\\sigma\\sqrt{T}} $$\n$$ d_2 = d_1 - \\sigma\\sqrt{T} $$\n\n$N(x)$ = fonction de répartition de la loi normale standard\n\n**Interprétation de $d_2$** : la probabilité (risk-neutral) que l\'option finisse ITM.\n**Interprétation de $N(d_1)$** : le delta du call.',
                        en: '**European call**:\n$$ C = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2) $$\n\n**European put**:\n$$ P = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1) $$\n\nwhere:\n$$ d_1 = \\frac{\\ln(S_0/K) + (r - q + \\sigma^2/2)T}{\\sigma\\sqrt{T}} $$\n$$ d_2 = d_1 - \\sigma\\sqrt{T} $$\n\n$N(x)$ = standard normal cumulative distribution function\n\n**Interpretation of $d_2$**: the (risk-neutral) probability that the option finishes ITM.\n**Interpretation of $N(d_1)$**: the delta of the call.'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Application numérique', en: 'Numerical application' },
                    body: {
                        fr: 'Call européen : $S_0 = 100$, $K = 100$, $r = 5\\%$, $q = 2\\%$, $\\sigma = 20\\%$, $T = 1$ an.\n\n$$ d_1 = \\frac{\\ln(100/100) + (0.05 - 0.02 + 0.04/2) \\times 1}{0.20 \\times 1} = \\frac{0 + 0.05}{0.20} = 0.25 $$\n$$ d_2 = 0.25 - 0.20 = 0.05 $$\n\n$$ N(0.25) \\approx 0.5987 $$\n$$ N(0.05) \\approx 0.5199 $$\n\n$$ C = 100 \\times e^{-0.02} \\times 0.5987 - 100 \\times e^{-0.05} \\times 0.5199 $$\n$$ C = 100 \\times 0.9802 \\times 0.5987 - 100 \\times 0.9512 \\times 0.5199 $$\n$$ C = 58.68 - 49.46 = \\mathbf{9.22€} $$\n\nVérification put via parité :\n$$ P = 9.22 - 100 \\times e^{-0.02} + 100 \\times e^{-0.05} = 9.22 - 98.02 + 95.12 = \\mathbf{6.32€} $$',
                        en: 'European call: $S_0 = 100$, $K = 100$, $r = 5\\%$, $q = 2\\%$, $\\sigma = 20\\%$, $T = 1$ year.\n\n$$ d_1 = \\frac{\\ln(100/100) + (0.05 - 0.02 + 0.04/2) \\times 1}{0.20 \\times 1} = \\frac{0 + 0.05}{0.20} = 0.25 $$\n$$ d_2 = 0.25 - 0.20 = 0.05 $$\n\n$$ N(0.25) \\approx 0.5987 $$\n$$ N(0.05) \\approx 0.5199 $$\n\n$$ C = 100 \\times e^{-0.02} \\times 0.5987 - 100 \\times e^{-0.05} \\times 0.5199 $$\n$$ C = 100 \\times 0.9802 \\times 0.5987 - 100 \\times 0.9512 \\times 0.5199 $$\n$$ C = 58.68 - 49.46 = \\mathbf{€9.22} $$\n\nPut verification via parity:\n$$ P = 9.22 - 100 \\times e^{-0.02} + 100 \\times e^{-0.05} = 9.22 - 98.02 + 95.12 = \\mathbf{€6.32} $$'
                    }
                }
            ]
        },
        {
            id: 'greeks',
            title: { fr: 'Les Greeks', en: 'The Greeks' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Les 5 sensibilités fondamentales', en: 'The 5 fundamental sensitivities' },
                    body: {
                        fr: 'Les **Greeks** mesurent la sensibilité du prix de l\'option aux variations des paramètres de marché. Ce sont les dérivées partielles du prix par rapport à chaque facteur.',
                        en: 'The **Greeks** measure the sensitivity of the option price to variations in market parameters. They are partial derivatives of the price with respect to each factor.'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Delta (Δ)', en: 'Delta (Δ)' },
                    body: {
                        fr: '**$\\Delta = \\frac{\\partial V}{\\partial S}$** — sensibilité au mouvement du sous-jacent\n\n**Call** : $\\Delta = e^{-qT} N(d_1)$ → entre $0$ et $1$\n**Put** : $\\Delta = -e^{-qT} N(-d_1)$ → entre $-1$ et $0$\n\nInterprétation :\n- $\\Delta = 0.6$ signifie que si $S$ monte de 1€, le call gagne $\\sim 0.60€$\n- Le delta est aussi (approximativement) la probabilité que l\'option finisse ITM\n- Un delta de $0.5 \\approx$ option ATM\n\n**Usage en hedging** : pour couvrir un short call, acheter $\\Delta$ actions. Le portefeuille est alors « delta-neutre » et insensible (au 1er ordre) au mouvement du sous-jacent.',
                        en: '**$\\Delta = \\frac{\\partial V}{\\partial S}$** — sensitivity to underlying movement\n\n**Call**: $\\Delta = e^{-qT} N(d_1)$ → between $0$ and $1$\n**Put**: $\\Delta = -e^{-qT} N(-d_1)$ → between $-1$ and $0$\n\nInterpretation:\n- $\\Delta = 0.6$ means if $S$ rises by €1, the call gains $\\sim €0.60$\n- Delta is also (approximately) the probability the option finishes ITM\n- A delta of $0.5 \\approx$ ATM option\n\n**Hedging usage**: to hedge a short call, buy $\\Delta$ shares. The portfolio is then "delta-neutral" and insensitive (to first order) to underlying movement.'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Gamma (Γ)', en: 'Gamma (Γ)' },
                    body: {
                        fr: '**$\\Gamma = \\frac{\\partial^2 V}{\\partial S^2} = \\frac{\\partial \\Delta}{\\partial S}$** — convexité, vitesse de variation du delta\n\n**Call & Put** : $\\Gamma = \\frac{e^{-qT} n(d_1)}{S \\sigma \\sqrt{T}}$\n\noù $n(x)$ = densité de la loi normale standard = $\\frac{1}{\\sqrt{2\\pi}} e^{-x^2/2}$\n\n- Gamma est **toujours positif** pour un long option (call ou put)\n- **Maximum ATM** et proche de la maturité\n- Un gamma élevé signifie que le delta change rapidement → rééquilibrage fréquent nécessaire\n\n**Gamma scalping** : être long gamma (long options) et rééquilibrer le delta. Si la vol réalisée > vol implicite, le gamma scalping est rentable.',
                        en: '**$\\Gamma = \\frac{\\partial^2 V}{\\partial S^2} = \\frac{\\partial \\Delta}{\\partial S}$** — convexity, rate of change of delta\n\n**Call & Put**: $\\Gamma = \\frac{e^{-qT} n(d_1)}{S \\sigma \\sqrt{T}}$\n\nwhere $n(x)$ = standard normal density = $\\frac{1}{\\sqrt{2\\pi}} e^{-x^2/2}$\n\n- Gamma is **always positive** for a long option (call or put)\n- **Maximum ATM** and close to maturity\n- High gamma means delta changes rapidly → frequent rebalancing needed\n\n**Gamma scalping**: being long gamma (long options) and rebalancing delta. If realized vol > implied vol, gamma scalping is profitable.'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'Theta (Θ), Vega (ν), Rho (ρ)', en: 'Theta (Θ), Vega (ν), Rho (ρ)' },
                    body: {
                        fr: '**$\\Theta = \\frac{\\partial V}{\\partial t}$** — décroissance temporelle\nCall : $\\Theta = -e^{-qT} S n(d_1) \\frac{\\sigma}{2\\sqrt{T}} - rK e^{-rT} N(d_2) + qS e^{-qT} N(d_1)$\nToujours négatif pour les long options (la valeur temps s\'érode chaque jour).\n\n**Relation Theta-Gamma** :\n$$ \\Theta + \\frac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta - rV = 0 $$\nPour un portefeuille delta-neutre : $\\Theta \\approx -\\frac{1}{2}\\sigma^2 S^2 \\Gamma$\n→ Long gamma = short theta (on paie le temps pour profiter de la convexité)\n\n**$\\nu$ (Vega) = $\\frac{\\partial V}{\\partial \\sigma}$** — sensibilité à la volatilité implicite\nCall & Put : $\\nu = S e^{-qT} \\sqrt{T} n(d_1)$\nToujours positif pour les long options. Maximum ATM.\n\n**$\\rho$ (Rho) = $\\frac{\\partial V}{\\partial r}$** — sensibilité aux taux\nCall : $\\rho = K T e^{-rT} N(d_2) > 0$\nPut : $\\rho = -K T e^{-rT} N(-d_2) < 0$',
                        en: '**$\\Theta = \\frac{\\partial V}{\\partial t}$** — time decay\nCall: $\\Theta = -e^{-qT} S n(d_1) \\frac{\\sigma}{2\\sqrt{T}} - rK e^{-rT} N(d_2) + qS e^{-qT} N(d_1)$\nAlways negative for long options (time value erodes each day).\n\n**Theta-Gamma relation**:\n$$ \\Theta + \\frac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta - rV = 0 $$\nFor a delta-neutral portfolio: $\\Theta \\approx -\\frac{1}{2}\\sigma^2 S^2 \\Gamma$\n→ Long gamma = short theta (you pay time to benefit from convexity)\n\n**$\\nu$ (Vega) = $\\frac{\\partial V}{\\partial \\sigma}$** — sensitivity to implied volatility\nCall & Put: $\\nu = S e^{-qT} \\sqrt{T} n(d_1)$\nAlways positive for long options. Maximum ATM.\n\n**$\\rho$ (Rho) = $\\frac{\\partial V}{\\partial r}$** — sensitivity to rates\nCall: $\\rho = K T e^{-rT} N(d_2) > 0$\nPut: $\\rho = -K T e^{-rT} N(-d_2) < 0$'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Greeks de second ordre', en: 'Second-order Greeks' },
                    body: {
                        fr: '**Vanna** $= \\frac{\\partial \\Delta}{\\partial \\sigma} = \\frac{\\partial \\nu}{\\partial S}$ — sensibilité croisée delta/vol\nImportant pour les produits à barrière (le delta change avec la vol).\n\n**Volga (Vomma)** $= \\frac{\\partial^2 V}{\\partial \\sigma^2} = \\frac{\\partial \\nu}{\\partial \\sigma}$ — convexité en volatilité\nImportant pour le pricing des options OTM (ajustement smile).\n\n**Charm** $= \\frac{\\partial \\Delta}{\\partial t}$ — variation du delta avec le temps\nUtile pour les desks de trading pour anticiper les ajustements de couverture.\n\n**En structuration** : les Greeks de second ordre sont essentiels pour comprendre le comportement des produits exotiques. Un autocall, par exemple, a un profil de vanna très prononcé autour des niveaux de barrière.',
                        en: '**Vanna** $= \\frac{\\partial \\Delta}{\\partial \\sigma} = \\frac{\\partial \\nu}{\\partial S}$ — cross-sensitivity delta/vol\nImportant for barrier products (delta changes with vol).\n\n**Volga (Vomma)** $= \\frac{\\partial^2 V}{\\partial \\sigma^2} = \\frac{\\partial \\nu}{\\partial \\sigma}$ — convexity in volatility\nImportant for OTM option pricing (smile adjustment).\n\n**Charm** $= \\frac{\\partial \\Delta}{\\partial t}$ — delta variation with time\nUseful for trading desks to anticipate hedging adjustments.\n\n**In structuring**: second-order Greeks are essential for understanding exotic product behavior. An autocall, for example, has a very pronounced vanna profile around barrier levels.'
                    }
                }
            ]
        },
        {
            id: 'volatilite-smile',
            title: { fr: 'Volatilité & Smile', en: 'Volatility & Smile' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Vol implicite, smile et skew', en: 'Implied vol, smile and skew' },
                    body: {
                        fr: 'La **volatilité implicite (IV)** est la valeur de σ qui, insérée dans la formule BS, donne le prix de marché observé de l\'option.\n\n**Le smile/skew de volatilité** :\nBS suppose σ constant pour tous les strikes → en réalité, la vol implicite varie avec K :\n\n- **Skew equity** : les puts OTM (K bas) ont une vol implicite plus élevée que les calls OTM (K élevé). Raison : la demande de protection (puts) est forte, et les marchés chutent plus violemment qu\'ils ne montent (« fear gauge »).\n\n- **Smile FX** : courbe en U symétrique (les deux extrêmes sont chers).\n\n- **Term structure** : la vol ATM varie avec la maturité. En période calme, la term structure est en contango (vol courte < vol longue). Après un choc, elle s\'inverse (backwardation).\n\n**Surface de volatilité** : matrice 2D [strike × maturité] → chaque point donne une vol implicite. Le pricing utilise toujours cette surface, pas un σ unique.',
                        en: '**Implied volatility (IV)** is the value of σ that, inserted into the BS formula, gives the observed market price of the option.\n\n**The volatility smile/skew**:\nBS assumes constant σ for all strikes → in reality, implied vol varies with K:\n\n- **Equity skew**: OTM puts (low K) have higher implied vol than OTM calls (high K). Reason: strong demand for protection (puts), and markets fall more violently than they rise ("fear gauge").\n\n- **FX smile**: symmetric U-shaped curve (both extremes are expensive).\n\n- **Term structure**: ATM vol varies with maturity. In calm periods, term structure is in contango (short vol < long vol). After a shock, it inverts (backwardation).\n\n**Volatility surface**: 2D matrix [strike × maturity] → each point gives an implied vol. Pricing always uses this surface, not a single σ.'
                    }
                },
                {
                    type: 'key-concept',
                    title: { fr: 'Vol implicite vs vol historique', en: 'Implied vol vs historical vol' },
                    body: {
                        fr: '**Vol historique (réalisée)** : mesurée à partir des rendements passés du sous-jacent.\n$$ \\sigma_{\\text{hist}} = \\sqrt{\\frac{252}{n} \\sum (r_i - \\bar{r})^2} \\quad \\text{— annualisée} $$\n\n**Vol implicite** : extraite des prix d\'options de marché.\n\n**VIX** : indice de vol implicite 30 jours sur le S&P500 (« indice de la peur »).\nTypiquement entre 12-20 en période calme, peut dépasser 80 en crise (mars 2020 = 82).\n\n**Vol Risk Premium** : IV > RV en moyenne → le marché surpaie la protection. Différence typique : 2-5% de vol. C\'est cette prime qui rend les stratégies de vente de vol (short straddle, autocalls, reverse convertibles) rentables en moyenne.',
                        en: '**Historical (realized) vol**: measured from past underlying returns.\n$$ \\sigma_{\\text{hist}} = \\sqrt{\\frac{252}{n} \\sum (r_i - \\bar{r})^2} \\quad \\text{— annualized} $$\n\n**Implied vol**: extracted from market option prices.\n\n**VIX**: 30-day implied vol index on S&P500 ("fear index").\nTypically 12-20 in calm periods, can exceed 80 in crises (March 2020 = 82).\n\n**Vol Risk Premium**: IV > RV on average → the market overpays for protection. Typical difference: 2-5% vol. This premium is what makes vol-selling strategies (short straddle, autocalls, reverse convertibles) profitable on average.'
                    }
                }
            ]
        },
        {
            id: 'local-stochastic-vol',
            title: { fr: 'Volatilité Locale & Stochastique', en: 'Local & Stochastic Volatility' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Au-delà de Black-Scholes', en: 'Beyond Black-Scholes' },
                    body: {
                        fr: '**Volatilité locale (Dupire, 1994)** :\nLa vol dépend du spot ET du temps : $\\sigma = \\sigma(S, t)$\nDéterministe : une seule diffusion, mais $\\sigma$ varie dans le plan $(S, t)$.\nFormule de Dupire :\n$$ \\sigma_{\\text{loc}}^2(K,T) = \\frac{2 \\left[ \\frac{\\partial C}{\\partial T} + (r-q)K \\frac{\\partial C}{\\partial K} + qC \\right]}{K^2 \\frac{\\partial^2 C}{\\partial K^2}} $$\n\nAvantage : calibration exacte sur la surface de vol de marché.\nLimite : le smile futur est trop « écrasé » (la dynamique du smile n\'est pas réaliste).\n\n**Volatilité stochastique (Heston, 1993)** :\nLa vol suit elle-même un processus aléatoire :\n$$ dS = \\mu S dt + \\sqrt{v} S dW_1 $$\n$$ dv = \\kappa(\\theta - v)dt + \\xi\\sqrt{v} dW_2 $$\n$$ \\text{corr}(dW_1, dW_2) = \\rho $$\n\nParamètres : $\\kappa$ (mean reversion), $\\theta$ (vol long terme), $\\xi$ (vol de vol), $\\rho$ (corrélation spot/vol, typiquement négatif pour equity).\n\n**SABR** : modèle stochastique populaire pour le smile (surtout taux) : $\\sigma_{\\text{imp}}(K) \\approx$ formule fermée d\'Hagan.',
                        en: '**Local volatility (Dupire, 1994)**:\nVol depends on spot AND time: $\\sigma = \\sigma(S, t)$\nDeterministic: single diffusion but $\\sigma$ varies in the $(S, t)$ plane.\nDupire formula:\n$$ \\sigma_{\\text{loc}}^2(K,T) = \\frac{2 \\left[ \\frac{\\partial C}{\\partial T} + (r-q)K \\frac{\\partial C}{\\partial K} + qC \\right]}{K^2 \\frac{\\partial^2 C}{\\partial K^2}} $$\n\nAdvantage: exact calibration to market vol surface.\nLimitation: future smile is too "flat" (smile dynamics are not realistic).\n\n**Stochastic volatility (Heston, 1993)**:\nVol itself follows a random process:\n$$ dS = \\mu S dt + \\sqrt{v} S dW_1 $$\n$$ dv = \\kappa(\\theta - v)dt + \\xi\\sqrt{v} dW_2 $$\n$$ \\text{corr}(dW_1, dW_2) = \\rho $$\n\nParameters: $\\kappa$ (mean reversion), $\\theta$ (long-term vol), $\\xi$ (vol of vol), $\\rho$ (spot/vol correlation, typically negative for equity).\n\n**SABR**: popular stochastic model for smile (mainly rates): $\\sigma_{\\text{imp}}(K) \\approx$ Hagan\'s closed-form formula.'
                    }
                }
            ]
        },
        {
            id: 'monte-carlo',
            title: { fr: 'Pricing Monte Carlo', en: 'Monte Carlo Pricing' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Simulation et pricing', en: 'Simulation and pricing' },
                    body: {
                        fr: '**Principe** : simuler $N$ trajectoires du sous-jacent sous la mesure risque-neutre, calculer le payoff pour chaque trajectoire, et prendre la moyenne actualisée.\n\n**Algorithme** :\n1. Générer $N$ trajectoires :\n   $$ S(t_{i+1}) = S(t_i) \\exp\\left[ \\left(r - q - \\frac{\\sigma^2}{2}\\right)\\Delta t + \\sigma\\sqrt{\\Delta t} Z \\right] $$\n   où $Z \\sim \\mathcal{N}(0,1)$\n2. Pour chaque trajectoire, calculer le payoff du produit\n3. Prix $= e^{-rT} \\frac{1}{N} \\sum \\text{payoff}(j)$\n\n**Convergence** : erreur $\\sim \\frac{\\sigma_{\\text{payoff}}}{\\sqrt{N}}$\nPour 10 000 simulations → précision $\\sim 1\\%$ du prix\n\n**Réduction de variance** :\n- **Antithétiques** : pour chaque $Z$, simuler aussi $-Z$. Réduit la variance de $\\sim 50\\%$.\n- **Variables de contrôle** : utiliser un payoff dont le prix est connu (ex: vanille) pour corriger.\n- **Quasi-Monte Carlo** : suites de Sobol/Halton au lieu de nombres aléatoires → convergence en $1/N$ au lieu de $1/\\sqrt{N}$.\n\n**Application aux exotiques** : MC est la méthode de référence pour les produits path-dependent (autocalls, barrières discrètes, asiatiques). Chaque trajectoire simule le spot à toutes les dates d\'observation.',
                        en: '**Principle**: simulate $N$ trajectories of the underlying under the risk-neutral measure, calculate the payoff for each trajectory, and take the discounted average.\n\n**Algorithm**:\n1. Generate $N$ trajectories:\n   $$ S(t_{i+1}) = S(t_i) \\exp\\left[ \\left(r - q - \\frac{\\sigma^2}{2}\\right)\\Delta t + \\sigma\\sqrt{\\Delta t} Z \\right] $$\n   where $Z \\sim \\mathcal{N}(0,1)$\n2. For each trajectory, calculate the product payoff\n3. Price $= e^{-rT} \\frac{1}{N} \\sum \\text{payoff}(j)$\n\n**Convergence**: error $\\sim \\frac{\\sigma_{\\text{payoff}}}{\\sqrt{N}}$\nFor 10,000 simulations → $\\sim 1\\%$ price accuracy\n\n**Variance reduction**:\n- **Antithetic**: for each $Z$, also simulate $-Z$. Reduces variance by $\\sim 50\\%$.\n- **Control variates**: use a payoff with known price (e.g., vanilla) to correct.\n- **Quasi-Monte Carlo**: Sobol/Halton sequences instead of random numbers → $1/N$ convergence instead of $1/\\sqrt{N}$.\n\n**Application to exotics**: MC is the reference method for path-dependent products (autocalls, discrete barriers, Asians). Each trajectory simulates the spot at all observation dates.'
                    }
                }
            ]
        },
        {
            id: 'hedging-practice',
            title: { fr: 'Hedging en Pratique', en: 'Hedging in Practice' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Delta hedging et P&L de couverture', en: 'Delta hedging and hedging P&L' },
                    body: {
                        fr: '**Delta hedging** : le trader qui a vendu une option achète $\\Delta \\times N$ actions pour se couvrir. Ce hedge est rééquilibré régulièrement (quotidiennement en pratique).\n\n**P&L du delta hedging** sur un pas de temps :\n$$ \\Delta P\\&L = \\frac{1}{2}\\Gamma (\\Delta S)^2 + \\Theta \\Delta t - \\text{coûts de transaction} $$\n\nSi $|\\Delta S|$ est grand (forte vol réalisée) → le gamma scalping génère du profit.\nSi $|\\Delta S|$ est petit (faible vol réalisée) → le theta « mange » le profit.\n\n**Le résultat total du hedging** dépend de : vol réalisée vs vol implicite.\n- Si vol réal > vol impl → le long gamma est profitable\n- Si vol réal < vol impl → le short gamma (vendeur d\'options) est profitable\n\n**Coûts pratiques** :\n- Bid/ask spread sur le sous-jacent (chaque rééquilibrage coûte)\n- Market impact pour les grosses positions\n- Modèle imparfait (le monde n\'est pas BS) → jumps, vol stochastique\n\n**Hedging des Greeks d\'ordre supérieur** :\n- Vega hedge : acheter/vendre d\'autres options de même maturité\n- Gamma hedge : utiliser des options de maturité courte (gamma élevé)\n- Correlation hedge (pour worst-of) : dispersion trades',
                        en: '**Delta hedging**: the trader who sold an option buys $\\Delta \\times N$ shares to hedge. This hedge is rebalanced regularly (daily in practice).\n\n**Delta hedging P&L** over one time step:\n$$ \\Delta P\\&L = \\frac{1}{2}\\Gamma (\\Delta S)^2 + \\Theta \\Delta t - \\text{transaction costs} $$\n\nIf $|\\Delta S|$ is large (high realized vol) → gamma scalping generates profit.\nIf $|\\Delta S|$ is small (low realized vol) → theta "eats" the profit.\n\n**Total hedging result** depends on: realized vol vs implied vol.\n- If vol real > vol impl → long gamma is profitable\n- If vol real < vol impl → short gamma (option seller) is profitable\n\n**Practical costs**:\n- Bid/ask spread on the underlying (each rebalancing costs)\n- Market impact for large positions\n- Imperfect model (the world is not BS) → jumps, stochastic vol\n\n**Higher-order Greeks hedging**:\n- Vega hedge: buy/sell other options with same maturity\n- Gamma hedge: use short-maturity options (high gamma)\n- Correlation hedge (for worst-of): dispersion trades'
                    }
                }
            ]
        },
        {
            id: 'greeks-structures',
            title: { fr: 'Greeks des Produits Structurés', en: 'Greeks of Structured Products' },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Profil de Greeks d\'un autocall', en: 'Autocall Greeks profile' },
                    body: {
                        fr: 'Les produits structurés ont des profils de Greeks **non-linéaires** et complexes :\n\n**Autocall — Delta** :\n- Spot >> barrière autocall : Δ ≈ 0 (le produit va se rappeler, le prix est fixe)\n- Spot ≈ barrière autocall : Δ très négatif (gamma spot, si le spot monte → rappel → perte du coupon futur pour le hedger)\n- Spot << barrière autocall mais > PDI : Δ modérément négatif\n- Spot ≈ PDI : Δ très négatif (activation du put DI)\n\n**Autocall — Vega** :\n- Typiquement **short vega** : une hausse de vol augmente la probabilité de toucher la PDI → baisse du prix\n- Mais autour de la barrière autocall : le vega peut devenir positif (plus de vol = moins de chance de rappel = plus de coupons potentiels)\n\n**Autocall — Gamma** :\n- Des « pics » de gamma aux dates d\'observation, en particulier quand le spot est proche des barrières\n- Gap risk : entre deux observations, le gamma s\'accumule\n\n**Implications pour le trading desk** :\n- L\'autocall book de la banque est typiquement short vega et short correlation\n- Le desk doit continuellement acheter des options vanille pour hedger le vega\n- Le réhedging est particulièrement intense autour des dates d\'observation',
                        en: 'Structured products have **non-linear** and complex Greeks profiles:\n\n**Autocall — Delta**:\n- Spot >> autocall barrier: Δ ≈ 0 (product will be called, price is fixed)\n- Spot ≈ autocall barrier: very negative Δ (spot gamma, if spot rises → recall → loss of future coupon for hedger)\n- Spot << autocall barrier but > PDI: moderately negative Δ\n- Spot ≈ PDI: very negative Δ (DI put activation)\n\n**Autocall — Vega**:\n- Typically **short vega**: vol increase raises PDI probability → price decrease\n- But around autocall barrier: vega can become positive (more vol = less chance of recall = more potential coupons)\n\n**Autocall — Gamma**:\n- Gamma "spikes" at observation dates, especially when spot is near barriers\n- Gap risk: between observations, gamma accumulates\n\n**Implications for trading desk**:\n- The bank\'s autocall book is typically short vega and short correlation\n- The desk must continuously buy vanilla options to hedge vega\n- Rehedging is particularly intense around observation dates'
                    }
                }
            ]
        },
        {
            id: 'case-study-pricing-autocall',
            title: { fr: 'Case Study : Pricing d\'un Autocall', en: 'Case Study: Pricing an Autocall' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'Monte Carlo sur un autocall 5 ans', en: 'Monte Carlo on a 5-year autocall' },
                    body: {
                        fr: '**Produit** : Autocall 5Y sur SX5E, coupon 7%, mémoire, barrière autocall 100%, PDI 60%.\n\n**Paramètres de pricing** :\n- S₀ = 4200, r = 3%, q = 2.5%, σ_ATM = 18%\n- Skew 90-100 = 5% (vol 90% strike = 23%)\n- 100 000 simulations Monte Carlo, pas quotidien\n\n**Résultats de la simulation** :\n- Prix théorique : **98.5%** du nominal\n- Probabilité de rappel an 1 : 55%\n- Probabilité de rappel an 2 : 15%\n- Probabilité de rappel an 3-5 : 12%\n- Probabilité de toucher la PDI : 8%\n- Probabilité d\'atteindre maturité sans PDI : 10%\n\n**Durée de vie attendue** : 1.9 ans\n**Coupon espéré** : 7% × 1.9 = 13.3%\n\n**Sensibilités** :\n- Si σ +1% → Prix -0.8% (short vega)\n- Si S₀ +5% → Prix +2.1% (nearish barrier)\n- Si r +0.5% → Prix +0.4% (ZC component)\n- Si dividendes +0.5% → Prix -1.2% (forward lower)\n\n**Marge émetteur** : le produit est émis à 100% mais vaut 98.5% → marge de **1.5%** pour la banque, répartie entre le structureur, le distributeur, et le trading desk.',
                        en: '**Product**: 5Y Autocall on SX5E, 7% coupon, memory, autocall barrier 100%, PDI 60%.\n\n**Pricing parameters**:\n- S₀ = 4200, r = 3%, q = 2.5%, σ_ATM = 18%\n- 90-100 skew = 5% (90% strike vol = 23%)\n- 100,000 Monte Carlo simulations, daily time steps\n\n**Simulation results**:\n- Theoretical price: **98.5%** of notional\n- Year 1 recall probability: 55%\n- Year 2 recall probability: 15%\n- Year 3-5 recall probability: 12%\n- PDI touch probability: 8%\n- Probability of reaching maturity without PDI: 10%\n\n**Expected lifetime**: 1.9 years\n**Expected coupon**: 7% × 1.9 = 13.3%\n\n**Sensitivities**:\n- If σ +1% → Price -0.8% (short vega)\n- If S₀ +5% → Price +2.1% (near barrier)\n- If r +0.5% → Price +0.4% (ZC component)\n- If dividends +0.5% → Price -1.2% (lower forward)\n\n**Issuer margin**: product issued at 100% but worth 98.5% → **1.5%** margin for the bank, split between structurer, distributor, and trading desk.'
                    }
                }
            ]
        },
        {
            id: 'case-study-volmageddon',
            title: { fr: 'Case Study : Volmageddon (Fév 2018)', en: 'Case Study: Volmageddon (Feb 2018)' },
            content: [
                {
                    type: 'case-study',
                    title: { fr: 'L\'effondrement du XIV', en: 'The XIV collapse' },
                    body: {
                        fr: '**Contexte** : Le 5 février 2018, le VIX a bondi de 17 à 50 en une seule journée (~+200%), un mouvement sans précédent. Les produits « short vol » se sont effondrés.\n\n**Les produits impliqués** :\n- **XIV** (VelocityShares Daily Inverse VIX Short-Term ETN) : promettait le rendement inverse quotidien du VIX. L\'ETN a perdu **96%** de sa valeur en un jour et a été liquidé.\n- **SVXY** (ProShares Short VIX Short-Term Futures ETF) : a perdu 90% mais a survécu (modifié ensuite en -0.5x).\n\n**Mécanisme de la spirale** :\n1. Les marchés US chutent de ~4% (début d\'une correction)\n2. Le VIX monte de ~115% (de 17 à ~37 en séance)\n3. Les produits short vol doivent acheter massivement des futures VIX pour se rééquilibrer\n4. Ces achats forcés poussent le VIX encore plus haut (cercle vicieux)\n5. Le VIX finit à 50 en after-hours\n6. Les produits short vol implosent\n\n**Impact sur les structurés** :\n- Les autocalls européens ont vu leur vol implicite exploser → prix des notes en chute\n- Les desks de trading ont dû acheter massivement de la vol (hedging de leur position short vega)\n- La corrélation implicite a bondi → impact sur les worst-of\n- Certains autocalls proches de la PDI ont vu leur delta exploser\n\n**Leçons** :\n1. Les stratégies short vol sont comme « ramasser des pièces devant un rouleau compresseur »\n2. Le VIX n\'est pas plafonné — un mouvement de +200% est possible\n3. Le rééquilibrage forcé peut amplifier les mouvements (convexité négative)\n4. Les produits structurés doivent être hedgés en considérant des scénarios extrêmes\n5. Le risque de gap (saut sans transition) rend le delta hedging parfois impossible',
                        en: '**Context**: On February 5, 2018, the VIX surged from 17 to 50 in a single day (~+200%), an unprecedented move. "Short vol" products collapsed.\n\n**Products involved**:\n- **XIV** (VelocityShares Daily Inverse VIX Short-Term ETN): promised the daily inverse return of VIX. The ETN lost **96%** of its value in one day and was liquidated.\n- **SVXY** (ProShares Short VIX Short-Term Futures ETF): lost 90% but survived (later modified to -0.5x).\n\n**Spiral mechanism**:\n1. US markets fall ~4% (start of a correction)\n2. VIX rises ~115% (from 17 to ~37 intraday)\n3. Short vol products must massively buy VIX futures to rebalance\n4. These forced purchases push VIX even higher (vicious circle)\n5. VIX finishes at 50 in after-hours\n6. Short vol products implode\n\n**Impact on structured products**:\n- European autocalls saw their implied vol explode → note prices plunging\n- Trading desks had to buy vol massively (hedging their short vega position)\n- Implied correlation surged → impact on worst-of products\n- Some autocalls near PDI saw their delta explode\n\n**Lessons**:\n1. Short vol strategies are like "picking up pennies in front of a steamroller"\n2. VIX is not capped — a +200% move is possible\n3. Forced rebalancing can amplify movements (negative convexity)\n4. Structured products must be hedged considering extreme scenarios\n5. Gap risk (jump without transition) makes delta hedging sometimes impossible'
                    }
                }
            ]
        }
    ]
};
