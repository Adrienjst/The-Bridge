import { Flashcard } from '../types';

export const module9Flashcards: Flashcard[] = [
    {
        id: 'f9-1',
        moduleId: 'methodes-numeriques',
        lessonId: 'monte-carlo-pricing',
        question: {
            fr: 'Quel est le principe fondamental derrière l\'évaluation d\'options par la méthode de Monte Carlo ?',
            en: 'What is the fundamental principle behind pricing options using the Monte Carlo method?'
        },
        answer: {
            fr: 'Calculer l\'espérance sous probabilité risque-neutre $\\mathbb{Q}$ du payoff actualisé, en simulant un grand nombre de trajectoires aléatoires (Loi des Grands Nombres).',
            en: 'Calculate the expected discounted payoff under the risk-neutral probability $\\mathbb{Q}$ by simulating a large number of random paths (Law of Large Numbers).'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f9-2',
        moduleId: 'methodes-numeriques',
        lessonId: 'monte-carlo-pricing',
        question: {
            fr: 'Dans quels cas privilégie-t-on le pricing par Monte Carlo plutôt qu\'une formule analytique comme Black-Scholes ?',
            en: 'When is Monte Carlo pricing preferred over an analytical formula like Black-Scholes?'
        },
        answer: {
            fr: 'Lorsque le payoff est complexe et dépend de toute la trajectoire (ex: options asiatiques, lookback) ou lorsque la dynamique est complexe (multidimensionnel, volatilité stochastique).',
            en: 'When the payoff is complex and path-dependent (e.g., Asian, lookback options) or when the dynamics are complex (multi-dimensional, stochastic volatility).'
        },
        difficulty: 'facile'
    },
    {
        id: 'f9-3',
        moduleId: 'methodes-numeriques',
        lessonId: 'reduction-variance',
        question: {
            fr: 'Comment fonctionne la technique des Variables Antithétiques en Monte Carlo ?',
            en: 'How does the Antithetic Variates technique work in Monte Carlo?'
        },
        answer: {
            fr: 'Pour chaque tirage aléatoire $Z$ générant une trajectoire, on simule la trajectoire miroir opposée mathématiquement avec $-Z$. Moyennées ensemble, elles réduisent symétriquement la variance.',
            en: 'For each random draw $Z$ generating a path, the mathematically opposite mirror path is simulated using $-Z$. Averaged together, they symmetrically reduce variance.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f9-4',
        moduleId: 'methodes-numeriques',
        lessonId: 'reduction-variance',
        question: {
            fr: 'Qu\'est-ce qu\'une Variable de Contrôle (Control Variate) ?',
            en: 'What is a Control Variate?'
        },
        answer: {
            fr: 'C\'est l\'utilisation d\'un produit dérivé dont on connaît le prix exact (ex: Call vanille analytique) et qui est fortement corrélé au dérivé complexe que l\'on souhaite pricer, afin d\'en "absorber" l\'erreur statistique.',
            en: 'It is the use of a derivative whose exact price is known (e.g., analytical Vanilla Call) and is highly correlated to the complex derivative being priced, in order to "absorb" its statistical error.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f9-5',
        moduleId: 'methodes-numeriques',
        lessonId: 'edp-feynman-kac',
        question: {
            fr: 'Quelle est la méthode numérique alternative majeure au calcul probabiliste de Monte Carlo ?',
            en: 'What is the major alternative numerical method to probabilistic Monte Carlo calculations?'
        },
        answer: {
            fr: 'La résolution déterministe par Équations aux Dérivées Partielles (EDP), qui consiste à discrétiser le temps et le sous-jacent avec une grille de différences finies.',
            en: 'Deterministic resolution via Partial Differential Equations (PDE), which involves discretizing time and the underlying asset on a finite difference grid.'
        },
        difficulty: 'facile'
    },
    {
        id: 'f9-6',
        moduleId: 'methodes-numeriques',
        lessonId: 'edp-feynman-kac',
        question: {
            fr: 'Que stipule le Théorème de Feynman-Kac ?',
            en: 'What does the Feynman-Kac Theorem stipulate?'
        },
        answer: {
            fr: 'Il établit la stricte équivalence mathématique entre la solution analytique d\'une EDP parabolique et l\'espérance probabiliste d\'un processus stochastique associé.',
            en: 'It establishes strict mathematical equivalence between the analytical solution of a parabolic PDE and the probabilistic expectation of an associated stochastic process.'
        },
        difficulty: 'difficile'
    }
];
