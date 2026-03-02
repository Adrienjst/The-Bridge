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
            id: 'fondements-probabilites',
            title: {
                fr: 'Fondements en Probabilités Continues',
                en: 'Foundations in Continuous Probability'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Avant de parler de processus en temps continu, il est indispensable de maîtriser les variables aléatoires (VA) continues. Contrairement au cas discret (comme lancer un dé), une VA continue peut prendre n\'importe quelle valeur dans un intervalle (ex: le rendement d\'une action).',
                        en: 'Before discussing continuous-time processes, it is essential to master continuous random variables (RVs). Unlike the discrete case (like rolling a die), a continuous RV can take any value within an interval (e.g., a stock return).'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Densité et Fonction de Répartition',
                        en: 'Density and Cumulative Distribution Function'
                    },
                    body: {
                        fr: 'Une VA continue $X$ est caractérisée par sa fonction de **densité de probabilité** (PDF) $f(x)$. La probabilité que $X$ tombe dans un intervalle $[a, b]$ est l\'aire sous la courbe :\n\n$$ \\mathbb{P}(a \\leq X \\leq b) = \\int_{a}^{b} f(x) dx $$\n\nLa **Fonction de Répartition** (CDF) $F(x) = \\mathbb{P}(X \\leq x)$ est la primitive de la densité : $F(x) = \\int_{-\\infty}^{x} f(u) du$.',
                        en: 'A continuous RV $X$ is characterized by its **Probability Density Function** (PDF) $f(x)$. The probability that $X$ falls in an interval $[a, b]$ is the area under the curve:\n\n$$ \\mathbb{P}(a \\leq X \\leq b) = \\int_{a}^{b} f(x) dx $$\n\nThe **Cumulative Distribution Function** (CDF) $F(x) = \\mathbb{P}(X \\leq x)$ is the antiderivative of the density: $F(x) = \\int_{-\\infty}^{x} f(u) du$.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Espérance et Variance',
                        en: 'Expectation and Variance'
                    },
                    body: {
                        fr: 'L\'**Espérance** $\\mathbb{E}[X]$ (moyenne théorique) est donnée par :\n$$ \\mathbb{E}[X] = \\int_{-\\infty}^{+\\infty} x f(x) dx $$\n\nLa **Variance** $\\text{Var}(X)$ mesure la dispersion autour de l\'espérance :\n$$ \\text{Var}(X) = \\mathbb{E}[(X - \\mathbb{E}[X])^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2 $$\n\nL\'écart-type (Volatility en finance) est $\\sigma = \\sqrt{\\text{Var}(X)}$.',
                        en: 'The **Expectation** $\\mathbb{E}[X]$ (theoretical mean) is given by:\n$$ \\mathbb{E}[X] = \\int_{-\\infty}^{+\\infty} x f(x) dx $$\n\nThe **Variance** $\\text{Var}(X)$ measures dispersion around the expectation:\n$$ \\text{Var}(X) = \\mathbb{E}[(X - \\mathbb{E}[X])^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2 $$\n\nThe standard deviation (Volatility in finance) is $\\sigma = \\sqrt{\\text{Var}(X)}$.'
                    }
                },
                {
                    type: 'text',
                    body: {
                        fr: 'La **Loi Normale** ou Gaussienne, notée $\\mathcal{N}(\\mu, \\sigma^2)$, est de loin la plus utilisée. Son importance vient du Théorème Central Limite, qui stipule que la somme d\'un grand nombre de VA aléatoires indépendantes tend vers une loi normale.',
                        en: 'The **Normal Distribution** or Gaussian, denoted $\\mathcal{N}(\\mu, \\sigma^2)$, is by far the most widely used. Its importance stems from the Central Limit Theorem, which states that the sum of a large number of independent RVs tends towards a normal distribution.'
                    }
                }
            ]
        },
        {
            id: 'processus-discrets',
            title: {
                fr: 'Processus Stochastiques en Temps Discret',
                en: 'Discrete-Time Stochastic Processes'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Pour que ce soit rigoureux, il faut définir un **Processus Stochastique**. C\'est simplement une famille de variables aléatoires indexées par le temps : $(X_t)_{t \\in T}$. \nSi le temps s\'écoule par sauts (jours, mois, ticks), le temps est dit **discret** : on note $X_0, X_1, X_2, \\dots, X_n$.',
                        en: 'For absolute rigor, we must define a **Stochastic Process**. It is simply a family of random variables indexed by time: $(X_t)_{t \\in T}$. \nIf time flows in steps (days, months, ticks), time is strictly **discrete**: we note $X_0, X_1, X_2, \\dots, X_n$.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Tribu et Filtration (La Rigueur Académique)',
                        en: 'Sigma-Algebra and Filtration (Academic Rigor)'
                    },
                    body: {
                        fr: 'En vraie mathématique (cadre de Kolmogorov) :\n- Une **Tribu (ou $\\sigma$-algèbre)** $\\mathcal{F}$ représente mathématiquement *l\'information disponible*.\n- Une **Filtration** $(\\mathcal{F}_n)_{n \\geq 0}$ est une suite croissante de tribus : $\\mathcal{F}_0 \\subset \\mathcal{F}_1 \\subset \\dots \\subset \\mathcal{F}_n$. Plus le temps avance, plus on a d\'information.\n- Un processus $(X_n)$ est dit **adapté** à la filtration si, à l\'instant $n$, la valeur de $X_n$ est totalement connue compte tenu de l\'information $\\mathcal{F}_n$ (on ne lit pas dans l\'avenir).',
                        en: 'In pure mathematics (Kolmogorov framework):\n- A **Sigma-Algebra (Tribu)** $\\mathcal{F}$ mathematically represents *available information*.\n- A **Filtration** $(\\mathcal{F}_n)_{n \\geq 0}$ is an increasing sequence of sigma-algebras: $\\mathcal{F}_0 \\subset \\mathcal{F}_1 \\subset \\dots \\subset \\mathcal{F}_n$. As time moves forward, we gain more information.\n- A process $(X_n)$ is **adapted** to the filtration if, at time $n$, the value of $X_n$ is completely known given the information $\\mathcal{F}_n$ (no looking into the future).'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'La Marche Aléatoire (Random Walk)',
                        en: 'The Random Walk'
                    },
                    body: {
                        fr: 'Le processus de base en temps discret est la **Marche Aléatoire**. Soit $(Z_i)$ des variables indépendantes valant $+1$ ou $-1$ avec probabilité 1/2.\nLa position à l\'instant $n$ est la somme des pas :\n$$ S_n = \\sum_{i=1}^n Z_i $$\nPropriétés clés : $\\mathbb{E}[S_n] = 0$ et $\\text{Var}(S_n) = n$. La variance croît linéairement avec le temps.',
                        en: 'The foundational discrete-time process is the **Random Walk**. Let $(Z_i)$ be independent variables taking values $+1$ or $-1$ with probability 1/2.\nThe position at time $n$ is the sum of the steps:\n$$ S_n = \\sum_{i=1}^n Z_i $$\nKey properties: $\\mathbb{E}[S_n] = 0$ and $\\text{Var}(S_n) = n$. Variance grows linearly with time.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'La définition exacte d\'une Martingale Discrète',
                        en: 'Strict Definition of a Discrete Martingale'
                    },
                    body: {
                        fr: 'Un processus $(M_n)$ est une martingale par rapport à la filtration $\\mathcal{F}_n$ si :\n1. $\\mathbb{E}[|M_n|] < \\infty$\n2. Il est adapté.\n3. **$\\mathbb{E}[M_{n+1} | \\mathcal{F}_n] = M_n$**\n\nCela signifie qu\'en moyenne, la meilleure prédiction pour demain, sachant toute l\'information d\'aujourd\'hui, est simplement la valeur d\'aujourd\'hui. La marche aléatoire simple est une martingale.',
                        en: 'A process $(M_n)$ is a martingale with respect to the filtration $\\mathcal{F}_n$ if:\n1. $\\mathbb{E}[|M_n|] < \\infty$\n2. It is adapted.\n3. **$\\mathbb{E}[M_{n+1} | \\mathcal{F}_n] = M_n$**\n\nThis means that on average, the best prediction for tomorrow, given all of today\'s information, is simply today\'s value. The simple random walk is a martingale.'
                    }
                }
            ]
        },
        {
            id: 'discret-continu-donsker',
            title: {
                fr: 'Du Discret au Continu : Théorème de Donsker',
                en: 'From Discrete to Continuous: Donsker\'s Theorem'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Le monde réel des marchés financiers (ticks, millisecondes) est discret. Pourtant, Black-Scholes et Itô utilisent le temps **continu**. Comment justifier ce saut mathématique ? C\'est le rôle du Théorème de Donsker (le Principe d\'Invariance).',
                        en: 'The real world of financial markets (ticks, milliseconds) is discrete. Yet, Black-Scholes and Itô use **continuous** time. How can this mathematical leap be justified? Enter Donsker\'s Theorem (the Invariance Principle).'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Du Random Walk au Mouvement Brownien',
                        en: 'From Random Walk to Brownian Motion'
                    },
                    body: {
                        fr: 'Si l\'on prend une marche aléatoire discrète $(S_n)$, que l\'on accélère la cadence des pas (on prend des pas de temps $\\Delta t$ infimes) et qu\'on réduit l\'amplitude des pas proportionnellement à $\\sqrt{\\Delta t}$, la trajectoire "déchiquetée" de la marche construite finit par converger en loi vers un objet mathématique continu limite : **Le Mouvement Brownien**.\n\nC\'est pour cela que la variance d\'un brownien est continue et vaut $t$ : elle est l\'héritage direct du fait que $\\text{Var}(S_n) = n$.',
                        en: 'If we take a discrete random walk $(S_n)$, accelerate the step frequency (taking tiny time steps $\\Delta t$), and reduce the step amplitude proportionally to $\\sqrt{\\Delta t}$, the "jagged" trajectory of the walk eventually converges in law to a limiting continuous mathematical object: **Brownian Motion**.\n\nThis is why the variance of a Brownian motion is continuous and equals $t$: it is the direct legacy of the discrete fact that $\\text{Var}(S_n) = n$.'
                    }
                }
            ]
        },
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
