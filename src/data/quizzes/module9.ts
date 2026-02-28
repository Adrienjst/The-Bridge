import { QuizQuestion } from '../types';

export const module9Quizzes: QuizQuestion[] = [
    {
        id: 'q9-1',
        moduleId: 'methodes-numeriques',
        lessonId: 'monte-carlo-pricing',
        question: {
            fr: 'Sur quel principe mathématique majeur repose l\'efficacité de la méthode de Monte Carlo pour pricer des options ?',
            en: 'On what major mathematical principle does the efficiency of the Monte Carlo method for pricing options rest?'
        },
        options: [
            { fr: 'Le Théorème de Pythagore Stochastique', en: 'The Stochastic Pythagorean Theorem' },
            { fr: 'La substitution de Girsanov', en: 'Girsanov\'s substitution' },
            { fr: 'L\'Équation de Black-Scholes-Merton', en: 'The Black-Scholes-Merton Equation' },
            { fr: 'La Loi des Grands Nombres', en: 'The Law of Large Numbers' }
        ],
        correctIndex: 3,
        explanation: {
            fr: 'La méthode de Monte Carlo utilise des simulations indépendantes massives. D\'après la loi forte des grands nombres, la moyenne empirique converge vers l\'espérance mathématique théorique (le juste prix risque-neutre).',
            en: 'The Monte Carlo method uses massive independent simulations. Under the strong law of large numbers, the empirical average converges to the theoretical mathematical expectation (the fair risk-neutral price).'
        },
        difficulty: 'facile'
    },
    {
        id: 'q9-2',
        moduleId: 'methodes-numeriques',
        lessonId: 'reduction-variance',
        question: {
            fr: 'Pour la technique des Variables Antithétiques en Monte Carlo, si la simulation standard utilise le tirage normal $Z$, la trajectoire symétrique utilise :',
            en: 'For the Antithetic Variates technique in Monte Carlo, if the standard simulation uses normal draw $Z$, the symmetric path uses:'
        },
        options: [
            { fr: '$-Z$', en: '$-Z$' },
            { fr: '$1 - Z$', en: '$1 - Z$' },
            { fr: '$Z^2$', en: '$Z^2$' },
            { fr: '$Z$', en: '$Z$' }
        ],
        correctIndex: 0,
        explanation: {
            fr: 'La distribution normale est symétrique par rapport à 0. Donc si $Z$ pilote une trajectoire haussière, $-Z$ simulera une parfaite probabilité baissière.',
            en: 'The normal distribution is symmetric around 0. Therefore if $Z$ drives an upward path, $-Z$ will simulate a perfect downward probability.'
        },
        difficulty: 'facile'
    },
    {
        id: 'q9-3',
        moduleId: 'methodes-numeriques',
        lessonId: 'reduction-variance',
        question: {
            fr: 'Si l\'écart-type d\'une simulation Monte Carlo est de $\\sigma_{MC}$, et que l\'on souhaite diviser cette erreur par 10, par combien faut-il multiplier le nombre de trajectoires $N$ ?',
            en: 'If the standard deviation of a Monte Carlo simulation is $\\sigma_{MC}$, and we wish to divide this error by 10, by how much must we multiply the number of paths $N$?'
        },
        options: [
            { fr: '10', en: '10' },
            { fr: '20', en: '20' },
            { fr: '100', en: '100' },
            { fr: '1000', en: '1000' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'L\'erreur décroît en $1/\\sqrt{N}$ selon le Théorème Central Limite. Pour réduire l\'erreur d\'un facteur 10, il faut un échantillon 100 fois plus grand ($1/\\sqrt{100} = 1/10$).',
            en: 'The error decreases as $1/\\sqrt{N}$ according to the Central Limit Theorem. To reduce the error by a factor of 10, a sample 100 times larger is required ($1/\\sqrt{100} = 1/10$).'
        },
        difficulty: 'moyen'
    },
    {
        id: 'q9-4',
        moduleId: 'methodes-numeriques',
        lessonId: 'edp-feynman-kac',
        question: {
            fr: 'Que relie le Théorème de Feynman-Kac ?',
            en: 'What does the Feynman-Kac Theorem connect?'
        },
        options: [
            { fr: 'La volatilité implicite et les sauts de marché', en: 'Implied volatility and market jumps' },
            { fr: 'Le problème analytique matriciel (EDP) à la valeur espérée d\'un processus stochastique (Monte Carlo)', en: 'The matrix analytical problem (PDE) to the expected value of a stochastic process (Monte Carlo)' },
            { fr: 'Les Greeks (Delta, Gamma) aux mouvements de taux', en: 'The Greeks (Delta, Gamma) to interest rate movements' },
            { fr: 'Le risque de crédit de l\'émetteur à celui du sous-jacent', en: 'The credit risk of the issuer to that of the underlying' }
        ],
        correctIndex: 1,
        explanation: {
            fr: 'Il prouve que résoudre l\'EDP de Black-Scholes avec des conditions aux limites via des différences finies, ou calculer la moyenne probabiliste des trajectoires browniennes via Monte Carlo revient exactement à résoudre le même problème mathématique sous-jacent.',
            en: 'It proves that solving the Black-Scholes PDE with boundary conditions via finite differences, or calculating the probabilistic average of Brownian paths via Monte Carlo, amounts to exactly solving the same underlying mathematical problem.'
        },
        difficulty: 'difficile'
    }
];
