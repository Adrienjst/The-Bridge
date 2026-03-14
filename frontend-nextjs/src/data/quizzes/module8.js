"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module8Quizzes = void 0;
exports.module8Quizzes = [
    {
        id: 'q8-1',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-implicite',
        question: {
            fr: 'Si Black-Scholes était un modèle parfait qui décrivait exactement la réalité du marché, quelle forme aurait la courbe de volatilité implicite en fonction du strike ?',
            en: 'If Black-Scholes were a perfect model exactly describing market reality, what shape would the implied volatility curve have as a function of the strike?'
        },
        options: [
            { fr: 'Plate, la volatilité serait la même pour tous les strikes', en: 'Flat, the volatility would be the same for all strikes' },
            { fr: 'Descendante de gauche à droite (Skew observé)', en: 'Downward sloping from left to right (Observed Skew)' },
            { fr: 'Ascendante de gauche à droite (Skew inversé)', en: 'Upward sloping from left to right (Inverted Skew)' },
            { fr: 'Une forme de "U" (Smile symétrique)', en: 'A "U" shape (Symmetrical Smile)' }
        ],
        correctIndex: 0,
        explanation: {
            fr: 'Dans le modèle BS, le paramètre $\\sigma$ est constant. La surface de volatilité implicite devrait alors être plate. L\'existence d\'un smile/skew prouve empiriquement les failles de ce modèle de base.',
            en: 'In the BS model, the parameter $\\sigma$ is constant. The implied volatility surface should therefore be completely flat. The existence of a smile/skew empirically proves the flaws of this base model.'
        },
        difficulty: 'facile'
    },
    {
        id: 'q8-2',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-locale-dupire',
        question: {
            fr: 'Le Modèle de Volatilité Locale de Bruno Dupire repose sur l\'hyphothèse forte que la volatilité de l\'actif dépend :',
            en: 'Bruno Dupire\'s Local Volatility Model relies on the strong assumption that the asset\'s volatility depends on:'
        },
        options: [
            { fr: 'D\'un autre mouvement brownien indépendant', en: 'Another independent Brownian motion' },
            { fr: 'Uniquement du temps $t$ et du niveau actuel du sous-jacent $S_t$', en: 'Solely on time $t$ and the current underlying level $S_t$' },
            { fr: 'D\'un processus de Poisson régissant les krachs', en: 'A Poisson process governing crashes' },
            { fr: 'Des taux d\'intérêts du marché', en: 'Market interest rates' }
        ],
        correctIndex: 1,
        explanation: {
            fr: 'Le modèle est gouverné par $dS_t = \\mu S_t dt + \\sigma(t, S_t) S_t dW_t$. Il n\'y a qu\'une seule source d\'aléa (un seul brownien), la fonction $\\sigma(t, S_t)$ étant parfaitement déterministe en $(t, x)$.',
            en: 'The model is governed by $dS_t = \\mu S_t dt + \\sigma(t, S_t) S_t dW_t$. There is only one source of randomness (a single Brownian motion), the function $\\sigma(t, S_t)$ being perfectly deterministic in $(t, x)$.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'q8-3',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-stochastique-heston',
        question: {
            fr: 'Quel composant mathématique du modèle de Heston permet de reproduire empiriquement le Skew "descendant" très marqué du marché Actions ?',
            en: 'Which mathematical component of the Heston model allows it to empirically reproduce the pronounced "downward" Skew of the Equity market?'
        },
        options: [
            { fr: 'Facteur de retour à la moyenne $\\kappa$', en: 'Mean-reversion factor $\\kappa$' },
            { fr: 'Espérance long-terme $\\theta$', en: 'Long-term expectation $\\theta$' },
            { fr: 'Volatilité de la volatilité $\\xi$', en: 'Volatility of volatility $\\xi$' },
            { fr: 'Corrélation négative $\\rho$ entre le Mouvement Brownien du prix et celui de la variance', en: 'Negative correlation $\\rho$ between the price\'s Brownian Motion and the variance\'s' }
        ],
        correctIndex: 3,
        explanation: {
            fr: 'Un $\\rho$ négatif (autour de -0.7) signifie que les chocs baissiers de l\'action coïncident avec les chocs haussiers de sa volatilité. Cela tire la queue de distribution gauche vers le bas (fat tail) et génère le Skew put-side.',
            en: 'A negative $\\rho$ (around -0.7) means downside equity shocks coincide with upside volatility shocks. This fattens the left tail of the distribution and generates the put-side Skew.'
        },
        difficulty: 'difficile'
    },
    {
        id: 'q8-4',
        moduleId: 'modeles-volatilite',
        lessonId: 'modeles-sauts-poisson',
        question: {
            fr: 'Dans un modèle de Jump-Diffusion, quel type de processus modélise la survenue des sauts (fréquence) ?',
            en: 'In a Jump-Diffusion model, which kind of process models the occurrence of jumps (frequency)?'
        },
        options: [
            { fr: 'Processus de Wiener (Mouvement Brownien)', en: 'Wiener Process (Brownian Motion)' },
            { fr: 'Processus de Girsanov', en: 'Girsanov Process' },
            { fr: 'Processus de Poisson $N_t$', en: 'Poisson Process $N_t$' },
            { fr: 'Processus d\'Itô', en: 'Ito Process' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'La composante discrète est gouvernée par $dN_t$, différentielle d\'un processus de Poisson, qui vaut $1$ lors d\'un saut aléatoire et $0$ presque partout ailleurs. Les sauts surviennent avec une intensité $\\lambda$.',
            en: 'The discrete component is governed by $dN_t$, differential of a Poisson process, which jumps by $1$ during a random occurrence and is $0$ almost everywhere else. Jumps happen with intensity $\\lambda$.'
        },
        difficulty: 'facile'
    }
];
