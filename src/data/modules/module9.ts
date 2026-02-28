import { CourseModule } from '../types';

export const module9: CourseModule = {
    id: 'methodes-numeriques',
    number: 9,
    title: {
        fr: 'Méthodes Numériques de Pricing',
        en: 'Numerical Pricing Methods'
    },
    subtitle: {
        fr: 'Monte Carlo, Réduction de variance et EDP',
        en: 'Monte Carlo, Variance Reduction and PDEs'
    },
    description: {
        fr: 'Apprendre à évaluer les produits dérivés complexes n\'ayant pas de formule fermée, grâce aux simulations de Monte Carlo et à la résolution numérique d\'Equations aux Dérivées Partielles.',
        en: 'Learn to price complex derivatives lacking closed-form solutions, through Monte Carlo simulations and numerical resolution of Partial Differential Equations.'
    },
    difficulty: 'avancé',
    duration: {
        fr: '4 heures',
        en: '4 hours'
    },
    icon: '💻',
    color: '#db2777', // pink-600
    objectives: [
        {
            fr: 'Implémenter un pricer de Monte Carlo pour des options vanilles et exotiques.',
            en: 'Implement a Monte Carlo pricer for vanilla and exotic options.'
        },
        {
            fr: 'Appliquer des techniques de réduction de variance (Variables antithétiques, variables de contrôle).',
            en: 'Apply variance reduction techniques (Antithetic variables, control variates).'
        },
        {
            fr: 'Comprendre l\'évaluation par EDP et le lien fondamental de Feynman-Kac.',
            en: 'Understand PDE pricing and the fundamental Feynman-Kac link.'
        }
    ],
    lessons: [
        {
            id: 'monte-carlo-pricing',
            title: {
                fr: 'Le Pricing par Monte Carlo',
                en: 'Monte Carlo Pricing'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Lorsque le payoff d\'une option est trop complexe (ex: dépendance au chemin, options asiatiques, lookback) ou que le modèle sous-jacent est sophistiqué (volatilité stochastique), il n\'existe souvent pas de formule analytique exacte comme la formule de Black-Scholes. On a alors recours aux méthodes de Monte Carlo.',
                        en: 'When an option\'s payoff is too complex (e.g., path-dependency, Asian options, lookbacks) or the underlying model is sophisticated (stochastic volatility), there is often no exact analytical formula like the Black-Scholes formula. We then resort to Monte Carlo methods.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Principe de la Méthode de Monte Carlo',
                        en: 'Principle of the Monte Carlo Method'
                    },
                    body: {
                        fr: 'Le prix d\'un dérivé est l\'espérance mathématique de son payoff actualisé sous la probabilité risque-neutre $\\mathbb{Q}$.\nLa Loi des Grands Nombres dicte que l\'on peut approximer cette espérance en simulant un très grand nombre ($N$) de trajectoires aléatoires du sous-jacent, en calculant le payoff pour chaque trajectoire, puis en prenant la moyenne arithmétique de ces payoffs.',
                        en: 'The price of a derivative is the mathematical expectation of its discounted payoff under the risk-neutral measure $\\mathbb{Q}$.\nThe Law of Large Numbers dictates that we can approximate this expectation by simulating a very large number ($N$) of random paths for the underlying, calculating the payoff for each path, and then taking the arithmetic average of these payoffs.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Estimateur de Monte Carlo',
                        en: 'Monte Carlo Estimator'
                    },
                    body: {
                        fr: 'Soit $h(S_T)$ le payoff à maturité $T$. L\'estimateur de Monte Carlo du prix $P_0$ est :\n\n$$ \\hat{P}_0 = e^{-rT} \\frac{1}{N} \\sum_{i=1}^{N} h(S_T^{(i)}) $$\n\nOù $S_T^{(i)}$ est le prix final de l\'actif simulé sur la $i$-ème trajectoire aléatoire.',
                        en: 'Let $h(S_T)$ be the payoff at maturity $T$. The Monte Carlo estimator for price $P_0$ is:\n\n$$ \\hat{P}_0 = e^{-rT} \\frac{1}{N} \\sum_{i=1}^{N} h(S_T^{(i)}) $$\n\nWhere $S_T^{(i)}$ is the final asset price simulated on the $i$-th random path.'
                    }
                }
            ]
        },
        {
            id: 'reduction-variance',
            title: {
                fr: 'Réduction de Variance',
                en: 'Variance Reduction'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'D\'après le Théorème Central Limite, l\'erreur de l\'estimateur de Monte Carlo décroît en $1/\\sqrt{N}$. Pour diviser l\'erreur par 10, il faut multiplier le temps de calcul par 100 ! Pour accélérer la convergence, on utilise des techniques de **réduction de variance**.',
                        en: 'According to the Central Limit Theorem, the error of the Monte Carlo estimator decreases proportionally to $1/\\sqrt{N}$. To divide the error by 10, you must multiply the calculation time by 100! To accelerate convergence, **variance reduction** techniques are used.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Variables Antithétiques',
                        en: 'Antithetic Variables'
                    },
                    body: {
                        fr: 'Si $Z \\sim \\mathcal{N}(0,1)$ est un tirage aléatoire utilisé pour générer une trajectoire, alors $-Z$ a la même loi et produit une trajectoire "miroir" parfaitement négativement corrélée.\nCalculer la moyenne des payoffs de ces deux trajectoires opposées réduit fortement la variance globale de l\'estimateur sans surcoût algorithmique majeur.',
                        en: 'If $Z \\sim \\mathcal{N}(0,1)$ is a random draw used to generate a path, then $-Z$ has the exact same distribution and produces a perfectly negatively correlated "mirror" path.\nAveraging the payoffs of these two opposing paths drastically reduces the overall estimator variance without major algorithmic overhead.'
                    }
                },
                {
                    type: 'example',
                    title: {
                        fr: 'Variable de Contrôle (Control Variate)',
                        en: 'Control Variates'
                    },
                    body: {
                        fr: 'On simule simultanément le prix d\'un dérivé complexe (ex: Option Asiatique) et d\'un dérivé similaire dont la valeur exacte est connue (ex: Option Vanille $C_{BS}$). \nL\'Estimateur contrôlé est : $Y_{control\u00e9} = Y_{asiat} - c(Y_{vanille} - C_{BS})$.\nLa très forte corrélation entre les deux simulations absorbe le bruit statistique de l\'option complexe.',
                        en: 'We simultaneously simulate the price of a complex derivative (e.g., Asian Option) and a similar derivative whose exact value is known (e.g., Vanilla Option $C_{BS}$). \nThe controlled Estimator is: $Y_{controlled} = Y_{asian} - c(Y_{vanilla} - C_{BS})$.\nThe very high correlation between the two simulations absorbs the statistical noise of the complex option.'
                    }
                }
            ]
        },
        {
            id: 'edp-feynman-kac',
            title: {
                fr: 'EDP et Formule de Feynman-Kac',
                en: 'PDEs and Feynman-Kac Formula'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'L\'alternative majeure à Monte Carlo est la résolution numérique d\'Equations aux Dérivées Partielles (EDP) via des grilles de différences finies (ex: schéma de Crank-Nicolson).',
                        en: 'The major alternative to Monte Carlo is the numerical resolution of Partial Differential Equations (PDEs) via finite difference grids (e.g., Crank-Nicolson scheme).'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Le Théorème de Feynman-Kac',
                        en: 'The Feynman-Kac Theorem'
                    },
                    body: {
                        fr: 'C\'est l\'un des théorèmes les plus profonds de la finance quantitative. Il établit un pont mathématique strict entre les Probabilités (Espérance d\'un processus stochastique, approche Monte Carlo) et l\'Analyse (Solution analytique d\'une EDP, approche Black-Scholes).',
                        en: 'It is one of the deepest theorems in quantitative finance. It establishes a strict mathematical bridge between Probability (Expectation of a stochastic process, Monte Carlo approach) and Analysis (Analytical solution of a PDE, Black-Scholes approach).'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Lien EDP / Probabilité',
                        en: 'PDE / Probability Link'
                    },
                    body: {
                        fr: 'Si le prix $V(t, S)$ satisfait l\'EDP parabolique de Black-Scholes :\n\n$$ \\frac{\\partial V}{\\partial t} + rS \\frac{\\partial V}{\\partial S} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} = rV $$\n\n**Alors (Feynman-Kac)**, la solution $V(t,S)$ s\'écrit nécessairement comme une espérance sous martingale :\n\n$$ V(t, S_t) = \\mathbb{E}^\\mathbb{Q}\\left[ e^{-r(T-t)} h(S_T) | S_t \\right] $$',
                        en: 'If the price $V(t,S)$ satisfies the parabolic Black-Scholes PDE:\n\n$$ \\frac{\\partial V}{\\partial t} + rS \\frac{\\partial V}{\\partial S} + \\frac{1}{2} \\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} = rV $$\n\n**Then (Feynman-Kac)**, the solution $V(t,S)$ can necessarily be written as a martingale expectation:\n\n$$ V(t, S_t) = \\mathbb{E}^\\mathbb{Q}\\left[ e^{-r(T-t)} h(S_T) | S_t \\right] $$'
                    }
                }
            ]
        }
    ]
};
