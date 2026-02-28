import { CourseModule } from '../types';

export const module8: CourseModule = {
    id: 'modeles-volatilite',
    number: 8,
    title: {
        fr: 'Modèles Avancés & Volatilité',
        en: 'Advanced Models & Volatility'
    },
    subtitle: {
        fr: 'Volatilité locale, stochastique et sauts',
        en: 'Local and stochastic volatility, jump models'
    },
    description: {
        fr: 'Dépasser les limites de Black-Scholes avec le smile de volatilité (Dupire), la volatilité stochastique (Heston) et l\'intégration de sauts de prix.',
        en: 'Overcoming the limits of Black-Scholes with the volatility smile (Dupire), stochastic volatility (Heston) and the integration of price jumps.'
    },
    difficulty: 'avancé',
    duration: {
        fr: '3.5 heures',
        en: '3.5 hours'
    },
    icon: '🌊',
    color: '#9333ea', // purple-600
    objectives: [
        {
            fr: 'Différencier la volatilité historique de la volatilité implicite (Smile, Skew).',
            en: 'Differentiate historical volatility from implied volatility (Smile, Skew).'
        },
        {
            fr: 'Comprendre formalisme de la volatilité locale de Dupire.',
            en: 'Understand the formalism of Dupire\'s local volatility.'
        },
        {
            fr: 'Modéliser la volatilité stochastique (Modèle de Heston) et les processus à sauts (Merton).',
            en: 'Model stochastic volatility (Heston Model) and jump processes (Merton).'
        }
    ],
    lessons: [
        {
            id: 'volatilite-implicite',
            title: {
                fr: 'Volatilité Implicite et Smile',
                en: 'Implied Volatility and Smile'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Le modèle de Black-Scholes (BS) suppose une volatilité $\\sigma$ **constante** pour toutes les options, quels que soient le strike et la maturité. Cependant, on observe sur les marchés un phénomène appelé **Smile** ou **Skew** de volatilité.',
                        en: 'The Black-Scholes (BS) model assumes a **constant** volatility $\\sigma$ for all options, regardless of strike and maturity. However, markets exhibit a phenomenon called volatility **Smile** or **Skew**.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'La Volatilité Implicite (IV)',
                        en: 'Implied Volatility (IV)'
                    },
                    body: {
                        fr: 'C\'est la valeur de $\\sigma$ qu\'il faut injecter dans la formule de BS pour retomber exactement sur le prix de l\'option observé sur le marché.\nSi le modèle de BS était parfaitement réaliste, la courbe de la volatilité implicite en fonction du strike serait totalement plate. Ce n\'est pas le cas.',
                        en: 'It is the value of $\\sigma$ that must be plugged into the BS formula to exactly match the observed market price of the option.\nIf the BS model were perfectly realistic, the implied volatility curve as a function of the strike would be completely flat. This is not the case.'
                    }
                },
                {
                    type: 'diagram',
                    body: {
                        fr: 'Le Skew (biais) sur actions illustre que les options *Out-of-the-Money* Put (Strike bas) sont pricées avec une Volatilité Implicite beaucoup plus forte, car le marché "craint" les krachs baissiers (premium de risque extrême).',
                        en: 'Equity Skew illustrates that *Out-of-the-Money* Puts (low strike) are priced with a much higher Implied Volatility, as the market "fears" downside crashes (extreme tail risk premium).'
                    }
                }
            ]
        },
        {
            id: 'volatilite-locale-dupire',
            title: {
                fr: 'Le Modèle de Volatilité Locale (Dupire)',
                en: 'Local Volatility Model (Dupire)'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Pour "réparer" le modèle BS et coller aux prix du marché, Bruno Dupire (1994) propose un modèle où la volatilité n\'est plus une constante aléatoire, mais une fonction déterministe **du temps et du prix de l\'action**.',
                        en: 'To "fix" the BS model and match market prices, Bruno Dupire (1994) proposed a model where volatility is no longer a random constant, but a deterministic function **of time and stock price**.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Dynamique en Volatilité Locale',
                        en: 'Local Volatility Dynamics'
                    },
                    body: {
                        fr: 'Le sous-jacent suit l\'équation différentielle stochastique suivante :\n\n$$dS_t = r S_t dt + \\sigma_L(t, S_t) S_t dW_t$$\n\noù $\\sigma_L(t, S_t)$ est la fonction de **volatilité locale**.',
                        en: 'The underlying follows this stochastic differential equation:\n\n$$dS_t = r S_t dt + \\sigma_L(t, S_t) S_t dW_t$$\n\nwhere $\\sigma_L(t, S_t)$ is the **local volatility** function.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'L\'Equation de Dupire',
                        en: 'The Dupire Equation'
                    },
                    body: {
                        fr: 'Dupire démontre qu\'il existe une **unique** fonction $\\sigma_L(T, K)$ permettant de calibrer précisément le modèle sur tous les prix de Calls $C(T, K)$ observables sur le marché :\n\n$$\\sigma_L^2(T, K) = \\frac{2 \\frac{\\partial C}{\\partial T}}{K^2 \\frac{\\partial^2 C}{\\partial K^2}}$$ \n\nCe modèle est parfait pour pricer les options exotiques en calibrant "sans arbitrage" la surface de volatilité vanille existante.',
                        en: 'Dupire proves that there exists a **unique** function $\\sigma_L(T, K)$ allowing precise calibration of the model exactly to all observable market Call prices $C(T, K)$:\n\n$$\\sigma_L^2(T, K) = \\frac{2 \\frac{\\partial C}{\\partial T}}{K^2 \\frac{\\partial^2 C}{\\partial K^2}}$$ \n\nThis model is perfect for pricing exotic options while "arbitrage-free" calibrating to the existing vanilla volatility surface.'
                    }
                }
            ]
        },
        {
            id: 'volatilite-stochastique-heston',
            title: {
                fr: 'Volatilité Stochastique (Heston)',
                en: 'Stochastic Volatility (Heston)'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Bien que Dupire reproduise le smile, la dynamique de la nappe de vol (comment le smile évolue quand le spot bouge) n\'est pas réaliste empiriquement. D\'où l\'intérêt de rendre la volatilité elle-même stochastique.',
                        en: 'Although Dupire perfectly fits the smile, the forward smile dynamic (how the smile moves when spot moves) is empirically unrealistic. Hence the need to make volatility itself stochastic.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Le Modèle de Heston (1993)',
                        en: 'The Heston Model (1993)'
                    },
                    body: {
                        fr: 'Dans le modèle de Heston, la variance $v_t = \\sigma_t^2$ suit son propre processus stochastique (Processus CIR), corrélé au processus du sous-jacent :\n\n1. $dS_t = r S_t dt + \\sqrt{v_t} S_t dW_t^{(1)}$\n2. $dv_t = \\kappa(\\theta - v_t) dt + \\xi \\sqrt{v_t} dW_t^{(2)}$\n\nAvec $dW^{(1)}$ et $dW^{(2)}$ deux mouvements browniens corrélés par le facteur $\\rho$ : $\\langle dW^{(1)}, dW^{(2)} \\rangle_t = \\rho dt$.',
                        en: 'In the Heston model, variance $v_t = \\sigma_t^2$ follows its own stochastic process (CIR Process), correlated with the underlying process:\n\n1. $dS_t = r S_t dt + \\sqrt{v_t} S_t dW_t^{(1)}$\n2. $dv_t = \\kappa(\\theta - v_t) dt + \\xi \\sqrt{v_t} dW_t^{(2)}$\n\nWith $dW^{(1)}$ and $dW^{(2)}$ two Brownian motions correlated by factor $\\rho$: $\\langle dW^{(1)}, dW^{(2)} \\rangle_t = \\rho dt$.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Paramètres clés de Heston',
                        en: 'Heston Key Parameters'
                    },
                    body: {
                        fr: '- **$\\theta$ (Theta)** : La variance cible à long terme moyenne.\n- **$\\kappa$ (Kappa)** : La vitesse de retour vers la moyenne (mean-reversion speed).\n- **$\\xi$ (Vol-of-Vol)** : La volatilité de la variance.\n- **$\\rho$ (Corrélation)** : Modélise "l\'effet levier". Un $\\rho$ négatif (comme sur les actions) génère le Skew asymétrique observé (les baisses de marché font monter la volatilité).',
                        en: '- **$\\theta$ (Theta)**: The long-term mean variance.\n- **$\\kappa$ (Kappa)**: The mean-reversion speed.\n- **$\\xi$ (Vol-of-Vol)**: The volatility of the variance.\n- **$\\rho$ (Correlation)**: Models the "leverage effect". A negative $\\rho$ (like in equities) generates the observed asymmetric Skew (market drops spike volatility).'
                    }
                },
                {
                    type: 'text',
                    body: {
                        fr: 'L\'un des énormes avantages de Heston est l\'existence d\'une formule d\'évaluation semi-analytique utilisant la **Transformée de Fourier**, permettant un calcul rapide de l\'espérance (ce qui évite de lancer des Monte Carlo lourds pour la calibration).',
                        en: 'A huge advantage of Heston is the existence of a semi-analytical pricing formula using the **Fourier Transform**, allowing rapid computation of the expectation (avoiding heavy Monte Carlo simulations for calibration).'
                    }
                }
            ]
        },
        {
            id: 'modeles-sauts-poisson',
            title: {
                fr: 'Modèles à Sauts (Processus de Poisson)',
                en: 'Jump Models (Poisson Process)'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Les modèles diffusifs purs (mouvements browniens continus) ne peuvent pas reproduire la fréquence observée des krachs soudains. On introduit donc des sauts discontinus dans les prix.',
                        en: 'Pure diffusive models (continuous Brownian motions) fail to reproduce the observed frequency of sudden stock market crashes. Therefore, discontinuous jumps in prices are introduced.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Le Processus de Poisson',
                        en: 'The Poisson Process'
                    },
                    body: {
                        fr: 'Un processus de Poisson $N_t$ (intensité $\\lambda > 0$) est un processus de comptage :\n- Il code le nombre d\'événements survenus entre $0$ et $t$.\n- La probabilité d\'avoir $k$ sauts sur une durée $t$ suit la loi de Poisson : $\\mathbb{P}(N_t = k) = e^{-\\lambda t} \\frac{(\\lambda t)^k}{k!}$.\n- Le temps d\'attente entre deux sauts consécutifs est distribué selon une loi Exponentielle.',
                        en: 'A Poisson process $N_t$ (intensity $\\lambda > 0$) is a counting process:\n- It counts the number of events occurring between $0$ and $t$.\n- The probability of having $k$ jumps over a duration $t$ follows the Poisson distribution: $\\mathbb{P}(N_t = k) = e^{-\\lambda t} \\frac{(\\lambda t)^k}{k!}$.\n- The waiting time between two consecutive jumps is distributed identically according to an Exponential law.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Modèle de Merton Jump-Diffusion (JD)',
                        en: 'Merton Jump-Diffusion Model (JD)'
                    },
                    body: {
                        fr: 'Merton (1976) a étendu Black-Scholes en couplant la dynamique continue brownienne avec une composante de sauts log-normaux :\n\n$$ \\frac{dS_t}{S_{t-}} = \\mu dt + \\sigma dW_t + (e^J - 1) dN_t $$\n\nOù $N_t$ pilote la fréquence des sauts, et $J \\sim \\mathcal{N}(\\mu_J, \\sigma_J^2)$ pilote la taille aléatoire du saut.',
                        en: 'Merton (1976) extended Black-Scholes by coupling the continuous Brownian dynamics with log-normal jumps:\n\n$$ \\frac{dS_t}{S_{t-}} = \\mu dt + \\sigma dW_t + (e^J - 1) dN_t $$\n\nWhere $N_t$ drives the frequency of jumps, and $J \\sim \\mathcal{N}(\\mu_J, \\sigma_J^2)$ drives the random size of the jump.'
                    }
                }
            ]
        }
    ]
};
