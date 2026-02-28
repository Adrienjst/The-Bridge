"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module7Flashcards = void 0;
exports.module7Flashcards = [
    {
        id: 'f7-1',
        moduleId: 'calcul-stochastique',
        lessonId: 'mouvement-brownien',
        question: {
            fr: 'Quelles sont les quatre propriétés principales d\'un Mouvement Brownien Standard $(W_t)$ ?',
            en: 'What are the four main properties of a Standard Brownian Motion $(W_t)$?'
        },
        answer: {
            fr: '1. $W_0 = 0$,\n2. Accroissements indépendants,\n3. Accroissements stationnaires et normaux ($W_t - W_s \\sim \\mathcal{N}(0, t-s)$),\n4. Trajectoires continues mais nulle part dérivables.',
            en: '1. $W_0 = 0$,\n2. Independent increments,\n3. Stationary and normal increments ($W_t - W_s \\sim \\mathcal{N}(0, t-s)$),\n4. Continuous but nowhere differentiable paths.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f7-2',
        moduleId: 'calcul-stochastique',
        lessonId: 'mouvement-brownien',
        question: {
            fr: 'Quelle est la valeur de la variation quadratique du Mouvement Brownien sur un intervalle $[0, t]$ ?',
            en: 'What is the value of the quadratic variation of Brownian Motion over an interval $[0, t]$?'
        },
        answer: {
            fr: '$\\langle W \\rangle_t = t$, ce qui se traduit par : $(dW_t)^2 = dt$.',
            en: '$\\langle W \\rangle_t = t$, which translates to: $(dW_t)^2 = dt$.'
        },
        difficulty: 'facile'
    },
    {
        id: 'f7-3',
        moduleId: 'calcul-stochastique',
        lessonId: 'lemme-ito',
        question: {
            fr: 'Quelle est l\'expression mathématique du Lemme d\'Itô (en 1D) ?',
            en: 'What is the mathematical expression for Ito\'s Lemma (in 1D)?'
        },
        answer: {
            fr: 'Pour $f(t, X_t)$ avec $dX_t = a_t dt + b_t dW_t$ :\n$$df = \\left(\\frac{\\partial f}{\\partial t} + a_t \\frac{\\partial f}{\\partial x} + \\frac{1}{2} b_t^2 \\frac{\\partial^2 f}{\\partial x^2}\\right) dt + b_t \\frac{\\partial f}{\\partial x} dW_t$$',
            en: 'For $f(t, X_t)$ with $dX_t = a_t dt + b_t dW_t$:\n$$df = \\left(\\frac{\\partial f}{\\partial t} + a_t \\frac{\\partial f}{\\partial x} + \\frac{1}{2} b_t^2 \\frac{\\partial^2 f}{\\partial x^2}\\right) dt + b_t \\frac{\\partial f}{\\partial x} dW_t$$'
        },
        difficulty: 'difficile'
    },
    {
        id: 'f7-4',
        moduleId: 'calcul-stochastique',
        lessonId: 'lemme-ito',
        question: {
            fr: 'Sous quelle dynamique un prix d\'action $S_t$ est-il modélisé dans le modèle de Black-Scholes ?',
            en: 'Under what dynamics is a stock price $S_t$ modeled in the Black-Scholes model?'
        },
        answer: {
            fr: 'Il suit un Mouvement Brownien Géométrique :\n$$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$',
            en: 'It follows a Geometric Brownian Motion:\n$$dS_t = \\mu S_t dt + \\sigma S_t dW_t$$'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f7-5',
        moduleId: 'calcul-stochastique',
        lessonId: 'girsanov-risque-neutre',
        question: {
            fr: 'À quoi sert le Théorème de Girsanov de manière fondamentale en finance ?',
            en: 'What is the fundamental purpose of Girsanov\'s Theorem in finance?'
        },
        answer: {
            fr: 'Il permet de changer de probabilité (passer de la probabilité historique $\\mathbb{P}$ à la probabilité risque-neutre $\\mathbb{Q}$) en ajustant la dérive d\'un processus stochastique.',
            en: 'It allows changing the probability measure (moving from the historical measure $\\mathbb{P}$ to the risk-neutral measure $\\mathbb{Q}$) by adjusting the drift of a stochastic process.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f7-6',
        moduleId: 'calcul-stochastique',
        lessonId: 'girsanov-risque-neutre',
        question: {
            fr: 'Sous la probabilité Risque-Neutre $\\mathbb{Q}$, quelle est la dérive espérée de tout actif tradable ?',
            en: 'Under the Risk-Neutral probability $\\mathbb{Q}$, what is the expected drift of any tradable asset?'
        },
        answer: {
            fr: 'La dérive doit être exactement égale au taux sans risque $r$. Ainsi, $dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$.',
            en: 'The drift must be exactly equal to the risk-free rate $r$. Hence, $dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$.'
        },
        difficulty: 'facile'
    }
];
