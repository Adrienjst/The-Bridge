import { CourseModule } from '../types';

export const module7: CourseModule = {
    id: 'calcul-stochastique',
    number: 7,
    title: {
        fr: 'Mathématiques Financières & Calcul Stochastique',
        en: 'Financial Mathematics & Stochastic Calculus'
    },
    subtitle: {
        fr: 'Mouvement Brownien, Lemme d\'Itô et Girsanov',
        en: 'Brownian Motion, Ito\'s Lemma, and Girsanov'
    },
    description: {
        fr: 'Les fondements mathématiques de la finance quantitative moderne : processus stochastiques, calcul d\'Itô et changement de probabilité.',
        en: 'The mathematical foundations of modern quantitative finance: stochastic processes, Ito calculus, and change of measure.'
    },
    difficulty: 'avancé',
    duration: {
        fr: '3 heures',
        en: '3 hours'
    },
    icon: '🎲',
    color: '#4f46e5', // indigo-600
    objectives: [
        {
            fr: 'Comprendre les propriétés du Mouvement Brownien (Processus de Wiener).',
            en: 'Understand the properties of Brownian Motion (Wiener Process).'
        },
        {
            fr: 'Maîtriser le Lemme d\'Itô pour dériver la dynamique d\'actifs.',
            en: 'Master Ito\'s Lemma to derive the dynamics of assets.'
        },
        {
            fr: 'Appréhender le théorème de Girsanov et le passage à la probabilité risque-neutre.',
            en: 'Grasp Girsanov\'s theorem and the transition to risk-neutral probability.'
        }
    ],
    lessons: [
        {
            id: 'mouvement-brownien',
            title: {
                fr: 'Le Mouvement Brownien',
                en: 'Brownian Motion'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Le Mouvement Brownien Standard (ou Processus de Wiener), noté $(W_t)_{t \\geq 0}$, est le bloc de construction fondamental du calcul stochastique en finance continue. Il modélise le bruit aléatoire des marchés financiers.',
                        en: 'Standard Brownian Motion (or Wiener Process), denoted $(W_t)_{t \\geq 0}$, is the fundamental building block of stochastic calculus in continuous finance. It models the random noise of financial markets.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Propriétés du Processus de Wiener',
                        en: 'Properties of the Wiener Process'
                    },
                    body: {
                        fr: 'Un processus $(W_t)_{t \\geq 0}$ est un Mouvement Brownien si :\n1. $W_0 = 0$\n2. Les accroissements sont **indépendants** : pour $0 \\leq t_1 < t_2 < t_3 < t_4$, $W_{t_4} - W_{t_3}$ est indépendant de $W_{t_2} - W_{t_1}$.\n3. Les accroissements sont **stationnaires et normaux** : pour $s < t$, $(W_t - W_s) \\sim \\mathcal{N}(0, t-s)$.\n4. Les trajectoires $t \\mapsto W_t$ sont continues (presque sûrement), mais nulle part dérivables.',
                        en: 'A process $(W_t)_{t \\geq 0}$ is a Brownian Motion if:\n1. $W_0 = 0$\n2. Increments are **independent**: for $0 \\leq t_1 < t_2 < t_3 < t_4$, $W_{t_4} - W_{t_3}$ is independent of $W_{t_2} - W_{t_1}$.\n3. Increments are **stationary and normal**: for $s < t$, $(W_t - W_s) \\sim \\mathcal{N}(0, t-s)$.\n4. Paths $t \\mapsto W_t$ are continuous (almost surely), but nowhere differentiable.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Variation Quadratique',
                        en: 'Quadratic Variation'
                    },
                    body: {
                        fr: 'La variation quadratique $\\langle W \\rangle_t$ du mouvement brownien sur l\'intervalle $[0, t]$ est exactement égale au temps $t$ :\n\n$$d\\langle W, W \\rangle_t = (dW_t)^2 = dt$$\n\nC\'est un résultat fondamental qui explique pourquoi le calcul stochastique diffère du calcul classique usuel (où $(dx)^2 = 0$).',
                        en: 'The quadratic variation $\\langle W \\rangle_t$ of Brownian motion over the interval $[0, t]$ is exactly equal to time $t$:\n\n$$d\\langle W, W \\rangle_t = (dW_t)^2 = dt$$\n\nThis is a fundamental result explaining why stochastic calculus differs from usual classical calculus (where $(dx)^2 = 0$).'
                    }
                }
            ]
        },
        {
            id: 'lemme-ito',
            title: {
                fr: 'Calcul d\'Itô et EDS',
                en: 'Ito Calculus and SDEs'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Une Equation Différentielle Stochastique (EDS) décrit l\'évolution d\'une variable aléatoire continue dans le temps. En finance, le prix d\'une action $S_t$ est souvent modélisé par un **Mouvement Brownien Géométrique**.',
                        en: 'A Stochastic Differential Equation (SDE) describes the evolution of a continuous random variable over time. In finance, a stock price $S_t$ is often modeled by a **Geometric Brownian Motion**.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Mouvement Brownien Géométrique (Modèle de Black-Scholes)',
                        en: 'Geometric Brownian Motion (Black-Scholes Model)'
                    },
                    body: {
                        fr: '$$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$\n\nOù $\\mu$ est la dérive (drift) et $\\sigma$ est la volatilité. Cela signifie que le rendement instantané $\\frac{dS_t}{S_t}$ suit une loi normale d\'espérance $\\mu dt$ et de variance $\\sigma^2 dt$.',
                        en: '$$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$\n\nWhere $\\mu$ is the drift and $\\sigma$ is the volatility. This means the instantaneous return $\\frac{dS_t}{S_t}$ follows a normal distribution with mean $\\mu dt$ and variance $\\sigma^2 dt$.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Le Lemme d\'Itô (1D)',
                        en: 'Ito\'s Lemma (1D)'
                    },
                    body: {
                        fr: 'Equivalent de la "rule of calculus" d\'Euler en mathématiques stochastiques. Si $X_t$ est un processus d\'Itô ($dX_t = a_t dt + b_t dW_t$) et $f(t, x)$ une fonction de classe $\\mathcal{C}^{1,2}$, alors $Y_t = f(t, X_t)$ est aussi un processus d\'Itô. \n\nPar développement de Taylor à l\'ordre 2, le terme $(dX_t)^2$ ne peut plus être ignoré car $(dW_t)^2 = dt$.',
                        en: 'The equivalent of the calculus "chain rule" in stochastic mathematics. If $X_t$ is an Ito process ($dX_t = a_t dt + b_t dW_t$) and $f(t, x)$ is a $\\mathcal{C}^{1,2}$ function, then $Y_t = f(t, X_t)$ is also an Ito process. \n\nBy Taylor expansion to order 2, the $(dX_t)^2$ term can no longer be ignored because $(dW_t)^2 = dt$.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Formule d\'Itô',
                        en: 'Ito\'s Formula'
                    },
                    body: {
                        fr: '$$df(t, X_t) = \\left( \\frac{\\partial f}{\\partial t} + a_t \\frac{\\partial f}{\\partial x} + \\frac{1}{2} b_t^2 \\frac{\\partial^2 f}{\\partial x^2} \\right) dt + b_t \\frac{\\partial f}{\\partial x} dW_t$$',
                        en: '$$df(t, X_t) = \\left( \\frac{\\partial f}{\\partial t} + a_t \\frac{\\partial f}{\\partial x} + \\frac{1}{2} b_t^2 \\frac{\\partial^2 f}{\\partial x^2} \\right) dt + b_t \\frac{\\partial f}{\\partial x} dW_t$$'
                    }
                },
                {
                    type: 'example',
                    title: {
                        fr: 'Exemple : Solution du Mouvement Brownien Géométrique',
                        en: 'Example: Solution to Geometric Brownian Motion'
                    },
                    body: {
                        fr: 'En appliquant le Lemme d\'Itô sur $f(S_t) = \\ln(S_t)$, on obtient :\n$d(\\ln S_t) = \\left(\\mu - \\frac{\\sigma^2}{2}\\right)dt + \\sigma dW_t$\n\nEn intégrant de $0$ à $T$, on trouve l\'expression analytique du prix de l\'action (très utilisée en finance quant) :\n$$S_T = S_0 \\exp\\left( \\left(\\mu - \\frac{\\sigma^2}{2}\\right)T + \\sigma W_T \\right)$$',
                        en: 'Applying Ito\'s Lemma to $f(S_t) = \\ln(S_t)$, we get:\n$d(\\ln S_t) = \\left(\\mu - \\frac{\\sigma^2}{2}\\right)dt + \\sigma dW_t$\n\nIntegrating from $0$ to $T$ gives the analytical expression of the stock price (heavily used in quant finance):\n$$S_T = S_0 \\exp\\left( \\left(\\mu - \\frac{\\sigma^2}{2}\\right)T + \\sigma W_T \\right)$$'
                    }
                }
            ]
        },
        {
            id: 'girsanov-risque-neutre',
            title: {
                fr: 'Girsanov et Probabilité Risque-Neutre',
                en: 'Girsanov and Risk-Neutral Probability'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Dans le monde réel ("Probabilité Historique" $\\mathbb{P}$), les actions ont une dérive (drift) $\\mu$ supérieure au taux sans risque, rémunérant le risque pris par l\'investisseur. \nCependant, **pour pricer des dérivés, on se place sous une probabilité dite "Risque-Neutre" (notée $\\mathbb{Q}$)**.',
                        en: 'In the real world ("Historical Measure" $\\mathbb{P}$), stocks have a real drift $\\mu$ greater than the risk-free rate, rewarding the investor\'s risk. \nHowever, **to price derivatives, we shift to a "Risk-Neutral" probability measure (denoted $\\mathbb{Q}$)**.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Le Théorème de Girsanov',
                        en: 'Girsanov\'s Theorem'
                    },
                    body: {
                        fr: 'Il permet de changer la probabilité d\'un espace, de manière à transformer un processus stochastique ayant une certaine dérive en un Mouvement Brownien. \nSous $\\mathbb{Q}$, la dérive de *tout* actif tradable (actualisé par le taux sans risque) doit devenir une martingale (son espérance de rendement est $r$).',
                        en: 'It allows changing the probability measure of a space, effectively transforming a stochastic process with a certain drift into a Standard Brownian Motion. \nUnder $\\mathbb{Q}$, the drift of *every* tradable asset (discounted by the risk-free rate) must become a martingale (its expected return is $r$).'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Changement de Dérive',
                        en: 'Change of Drift'
                    },
                    body: {
                        fr: 'Soit $\\lambda = \\frac{\\mu - r}{\\sigma}$ la *Prime de Risque du Marché*. \nLe processus défini par : $W_t^{\\mathbb{Q}} = W_t^{\\mathbb{P}} + \\lambda t$ est un Mouvement Brownien Standard sous la mesure $\\mathbb{Q}$.\n\nAinsi, la dynamique du sous-jacent devient :\n$$dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$$',
                        en: 'Let $\\lambda = \\frac{\\mu - r}{\\sigma}$ be the *Market Risk Premium*. \nThe process defined by: $W_t^{\\mathbb{Q}} = W_t^{\\mathbb{P}} + \\lambda t$ is a Standard Brownian Motion under measure $\\mathbb{Q}$.\n\nThus, the dynamic of the underlying becomes:\n$$dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$$'
                    }
                },
                {
                    type: 'text',
                    body: {
                        fr: 'Conséquence fondamentale : Sous $\\mathbb{Q}$, le paramètre subjectif $\\mu$ disparaît totalement ! Le prix d\'une option ne dépend alors que du taux sans-risque $r$ (observable) et de la volatilité $\\sigma$. C\'est la condition sine qua non de l\'évaluation par **AAR** (Absence d\'Opportunité d\'Arbitrage).',
                        en: 'Fundamental consequence: Under $\\mathbb{Q}$, the subjective parameter $\\mu$ completely disappears! The price of an option thus depends only on the risk-free rate $r$ (observable) and the volatility $\\sigma$. This is the mandatory condition for pricing by **No Arbitrage**.'
                    }
                }
            ]
        }
    ]
};
