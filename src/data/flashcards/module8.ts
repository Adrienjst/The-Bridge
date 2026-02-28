import { Flashcard } from '../types';

export const module8Flashcards: Flashcard[] = [
    {
        id: 'f8-1',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-implicite',
        question: {
            fr: 'Qu\'est-ce que la Volatilité Implicite (IV) d\'une option ?',
            en: 'What is the Implied Volatility (IV) of an option?'
        },
        answer: {
            fr: 'C\'est la valeur de la volatilité $\\sigma$ qu\'il faut utiliser dans la formule de Black-Scholes pour que le prix théorique soit égal au prix de marché observé.',
            en: 'It is the volatility value $\\sigma$ that must be used in the Black-Scholes formula so that the theoretical price matches the observed market price.'
        },
        difficulty: 'facile'
    },
    {
        id: 'f8-2',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-implicite',
        question: {
            fr: 'Qu\'est-ce que le Skew de volatilité sur les actions ?',
            en: 'What is equity volatility Skew?'
        },
        answer: {
            fr: 'C\'est l\'observation empirique que les Puts en dehors de la monnaie (OTM) ont une volatilité implicite beaucoup plus élevée que les Calls OTM, traduisant la peur des krachs boursiers.',
            en: 'It is the empirical observation that Out-of-the-Money (OTM) Puts have a much higher implied volatility than OTM Calls, reflecting the fear of market crashes.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f8-3',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-locale-dupire',
        question: {
            fr: 'Quelle est l\'hypothèse principale du Modèle de Volatilité Locale de Dupire (1994) ?',
            en: 'What is the main assumption of Dupire\'s Local Volatility Model (1994)?'
        },
        answer: {
            fr: 'La volatilité n\'est pas constante ou aléatoire, mais est une fonction déterministe du temps et du niveau du sous-jacent : $\\sigma_L(t, S_t)$.',
            en: 'Volatility is not constant or random, but is a deterministic function of time and the underlying asset level: $\\sigma_L(t, S_t)$.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f8-4',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-locale-dupire',
        question: {
            fr: 'Pourquoi utilise-t-on couramment l\'Équation de Dupire en salle de marché ?',
            en: 'Why is the Dupire Equation commonly used on trading floors?'
        },
        answer: {
            fr: 'Parce qu\'elle permet, par construction, de calibrer parfaitement un arbre ou une EDP sur tous les prix d\'options vanilles du marché sans créer d\'opportunité d\'arbitrage.',
            en: 'Because it allows, by design, the perfect calibration of a tree or PDE to all plain vanilla option prices in the market without creating arbitrage opportunities.'
        },
        difficulty: 'difficile'
    },
    {
        id: 'f8-5',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-stochastique-heston',
        question: {
            fr: 'Dans le modèle de Heston (1993), quelle est la dynamique de la variance $v_t$ ?',
            en: 'In the Heston model (1993), what is the dynamic of the variance $v_t$?'
        },
        answer: {
            fr: 'La variance suit un processus stochastique CIR avec retour à la moyenne (mean-reverting) : $dv_t = \\kappa(\\theta - v_t)dt + \\xi\\sqrt{v_t}dW_t^{(2)}$.',
            en: 'Variance follows a mean-reverting CIR stochastic process: $dv_t = \\kappa(\\theta - v_t)dt + \\xi\\sqrt{v_t}dW_t^{(2)}$.'
        },
        difficulty: 'difficile'
    },
    {
        id: 'f8-6',
        moduleId: 'modeles-volatilite',
        lessonId: 'volatilite-stochastique-heston',
        question: {
            fr: 'À quoi sert le paramètre de corrélation $\\rho$ dans le modèle de Heston ?',
            en: 'What is the purpose of the correlation parameter $\\rho$ in the Heston model?'
        },
        answer: {
            fr: 'Il lie les mouvements du prix à ceux de sa volatilité. Un $\\rho$ négatif modélise l\'effet levier (une baisse du spot augmente la volatilité) et génère le Skew asymétrique.',
            en: 'It directly links price movements to volatility movements. A negative $\\rho$ models the leverage effect (spot drop increases vol) and properly generates asymmetric Skew.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f8-7',
        moduleId: 'modeles-volatilite',
        lessonId: 'modeles-sauts-poisson',
        question: {
            fr: 'Quel type de phénomène la composante de saut d\'un modèle (comme Merton Jump-Diffusion) cherche-t-elle à capturer ?',
            en: 'What kind of phenomenon does the jump component of a model (like Merton Jump-Diffusion) aim to capture?'
        },
        answer: {
            fr: 'La survenue occasionnelle de krachs soudains et discontinus sur le marché, que la diffusion continue d\'un mouvement brownien a une probabilité quasi nulle de produire.',
            en: 'The occasional occurrence of sudden and discontinuous market crashes, which the continuous diffusion of a Brownian motion has an almost zero probability of producing.'
        },
        difficulty: 'facile'
    }
];
