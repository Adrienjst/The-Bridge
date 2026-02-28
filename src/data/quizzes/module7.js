"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module7Quizzes = void 0;
exports.module7Quizzes = [
    {
        id: 'q7-1',
        moduleId: 'calcul-stochastique',
        lessonId: 'mouvement-brownien',
        question: {
            fr: 'Dans le calcul d\'Itô, à quoi est égal $(dW_t)^2$ ?',
            en: 'In Ito calculus, what is $(dW_t)^2$ equal to?'
        },
        options: [
            { fr: '0', en: '0' },
            { fr: '$(dt)^2$', en: '$(dt)^2$' },
            { fr: '$dt$', en: '$dt$' },
            { fr: '$W_t$', en: '$W_t$' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'Contrairement au calcul usuel où $(dx)^2 = 0$, la variation asymptotique du mouvement brownien lui confère une variation quadratique non nulle : $(dW_t)^2 = dt$.',
            en: 'Unlike standard calculus where $(dx)^2 = 0$, the asymptotic variation of Brownian motion gives it a non-zero quadratic variation: $(dW_t)^2 = dt$.'
        },
        difficulty: 'facile'
    },
    {
        id: 'q7-2',
        moduleId: 'calcul-stochastique',
        lessonId: 'lemme-ito',
        question: {
            fr: 'En appliquant le Lemme d\'Itô, si $dS_t = \\mu S_t dt + \\sigma S_t dW_t$, quelle est la dynamique de $d(\\ln S_t)$ ?',
            en: 'Applying Ito\'s Lemma, if $dS_t = \\mu S_t dt + \\sigma S_t dW_t$, what is the dynamic of $d(\\ln S_t)$?'
        },
        options: [
            { fr: '$\\mu dt + \\sigma dW_t$', en: '$\\mu dt + \\sigma dW_t$' },
            { fr: '$(\\mu - \\frac{\\sigma^2}{2})dt + \\sigma dW_t$', en: '$(\\mu - \\frac{\\sigma^2}{2})dt + \\sigma dW_t$' },
            { fr: '$(\\mu + \\frac{\\sigma^2}{2})dt - \\sigma dW_t$', en: '$(\\mu + \\frac{\\sigma^2}{2})dt - \\sigma dW_t$' },
            { fr: '$\\frac{\\mu}{\\sigma} dt + dW_t$', en: '$\\frac{\\mu}{\\sigma} dt + dW_t$' }
        ],
        correctIndex: 1,
        explanation: {
            fr: 'Avec $f(x) = \\ln(x)$, $f\'(x) = 1/x$ et $f\'\'(x) = -1/x^2$. En l\'injectant dans la formule d\'Itô : $d(\\ln S) = (\\mu S \\cdot \\frac{1}{S} - \\frac{1}{2} \\sigma^2 S^2 \\cdot \\frac{1}{S^2}) dt + (\\sigma S \\cdot \\frac{1}{S}) dW_t$.',
            en: 'With $f(x) = \\ln(x)$, $f\'(x) = 1/x$ and $f\'\'(x) = -1/x^2$. Plugging into Ito\'s formula: $d(\\ln S) = (\\mu S \\cdot \\frac{1}{S} - \\frac{1}{2} \\sigma^2 S^2 \\cdot \\frac{1}{S^2}) dt + (\\sigma S \\cdot \\frac{1}{S}) dW_t$.'
        },
        difficulty: 'difficile'
    },
    {
        id: 'q7-3',
        moduleId: 'calcul-stochastique',
        lessonId: 'girsanov-risque-neutre',
        question: {
            fr: 'Pourquoi passe-t-on de la probabilité historique $\\mathbb{P}$ à la probabilité risque-neutre $\\mathbb{Q}$ pour évaluer les options ?',
            en: 'Why do we switch from historical measure $\\mathbb{P}$ to risk-neutral measure $\\mathbb{Q}$ to price options?'
        },
        options: [
            { fr: 'Pour éliminer la volatilité $\\sigma$ du marché', en: 'To eliminate the market volatility $\\sigma$' },
            { fr: 'Parce que les taux d\'intérêt $\\mu$ sont très difficiles à observer empiriquement', en: 'Because historical drift rates $\\mu$ are very difficult to observe empirically' },
            { fr: 'Parce que le théorème fondamental de l\'AAR certifie que le drift observé de tout actif sous $\\mathbb{Q}$ est le taux sans risque $r$', en: 'Because the fundamental no-arbitrage theorem dictates that the observed drift of any asset under $\\mathbb{Q}$ is the risk-free rate $r$' },
            { fr: 'Pour rendre le Mouvement Brownien constant', en: 'To make the Brownian Motion constant' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'Le paramètre de drift historique $\\mu$ reflète l\'appétit au risque irrationnel des investisseurs. L\'AAR permet d\'évincer ce biais en se plaçant dans un univers "risque-neutre", où tous les actifs rapportent empiriquement le rendement minimal commun : $r$.',
            en: 'The historical drift parameter $\\mu$ reflects the subjective risk appetite of investors. Non-arbitrage reasoning removes this bias by stepping into a "risk neutral" space where all assets yield the common minimal return: $r$.'
        },
        difficulty: 'moyen'
    }
];
