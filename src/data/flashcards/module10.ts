import { Flashcard } from '../types';

export const module10Flashcards: Flashcard[] = [
    {
        id: '10-01',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'moyen',
        question: {
            fr: 'Qu\'est-ce qu\'une **Martingale mathématique** ?',
            en: 'What is a **mathematical Martingale**?'
        },
        answer: {
            fr: 'Un processus stochastique $M_t$ où l\'espérance conditionnelle future, sachant toute l\'information passée, est égale à la valeur présente : $\\mathbb{E}[M_t | \\mathcal{F}_s] = M_s$.',
            en: 'A stochastic process $M_t$ where the conditional expected value of the next observation, given all past observations, is equal to the present value: $\\mathbb{E}[M_t | \\mathcal{F}_s] = M_s$.'
        }
    },
    {
        id: '10-02',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'moyen',
        question: {
            fr: 'Dans le système de pari de la **Martingale**, que fait-on après une perte ?',
            en: 'In the **Martingale** betting system, what is the action taken after a loss?'
        },
        answer: {
            fr: 'Le parieur **double sa mise** (multiplie par 2).',
            en: 'The bettor **doubles their bet** size (multiply by 2).'
        }
    },
    {
        id: '10-03',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'moyen',
        question: {
            fr: 'Quel est le résultat d\'un gain dans un système de Martingale après $n$ pertes consécutives ?',
            en: 'What is the outcome of a win in a Martingale system after $n$ consecutive losses?'
        },
        answer: {
            fr: 'Le joueur récupère la totalité de ses pertes précédentes **et** réalise un profit égal à la **mise initiale** (1 unité).',
            en: 'The player recovers all previous accumulated losses **and** yields a profit equal to the **original bet** (1 unit).'
        }
    },
    {
        id: '10-04',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'moyen',
        question: {
            fr: 'Quel est le principal défaut ou risque ("Risk of Ruin") du système de la Martingale ?',
            en: 'What is the main flaw or "Risk of Ruin" associated with the Martingale system?'
        },
        answer: {
            fr: 'La croissance exponentielle des mises face à une longue série de pertes heurte inévitablement les **limites de capital** du joueur ou les **limites de plafond** de la table de casino, garantissant la faillite à long terme.',
            en: 'The exponential growth of bet sizing during a losing streak inevitably hits the player\'s **capital limits** or the casino\'s **table maximums**, guaranteeing ruin in the long run.'
        }
    },
    {
        id: '10-05',
        moduleId: 'module10',
        lessonId: 'l2',
        difficulty: 'facile',
        question: {
            fr: 'Comment se forme la **suite de Fibonacci** ?',
            en: 'How is the **Fibonacci sequence** formed?'
        },
        answer: {
            fr: 'Chaque terme est la **somme des deux termes précédents**. La suite commence par : $1, 1, 2, 3, 5, 8, 13, dp$',
            en: 'Each number is the **sum of the two preceding ones**. Sequence begins: $1, 1, 2, 3, 5, 8, 13, ...$'
        }
    },
    {
        id: '10-06',
        moduleId: 'module10',
        lessonId: 'l2',
        difficulty: 'moyen',
        question: {
            fr: 'Dans le **système de pari Fibonacci**, que faites-vous en cas de gain ?',
            en: 'In the **Fibonacci betting system**, what do you do after a win?'
        },
        answer: {
            fr: 'Vous reculez de **deux pas** (nombres) dans la suite de Fibonacci pour votre prochaine mise.',
            en: 'You move **two steps back** (down) in the Fibonacci sequence for your next bet.'
        }
    },
    {
        id: '10-07',
        moduleId: 'module10',
        lessonId: 'l3',
        difficulty: 'difficile',
        question: {
            fr: 'Vers quel nombre le rapport de deux termes consécutifs de Fibonacci ($\\frac{F_n}{F_{n-1}}$) converge-t-il ?',
            en: 'To what number does the ratio of two consecutive Fibonacci numbers ($\\frac{F_n}{F_{n-1}}$) converge?'
        },
        answer: {
            fr: 'Le **Nombre d\'Or** (The Golden Ratio), noté $\\phi \\approx 1.618$.',
            en: 'The **Golden Ratio**, denoted as $\\phi \\approx 1.618$.'
        }
    },
    {
        id: '10-08',
        moduleId: 'module10',
        lessonId: 'l3',
        difficulty: 'facile',
        question: {
            fr: 'Quels sont les deux niveaux de **Retracement de Fibonacci** les plus populaires utilisés en analyse technique chartiste ?',
            en: 'What are the two most popular **Fibonacci Retracement** levels used in technical analysis charting?'
        },
        answer: {
            fr: '**38.2%** et **61.8%**',
            en: '**38.2%** and **61.8%**'
        }
    },
    {
        id: '10-09',
        moduleId: 'module10',
        lessonId: 'l3',
        difficulty: 'moyen',
        question: {
            fr: 'Pourquoi les retracements de Fibonacci semblent-ils fonctionner sur les marchés financiers, d\'un point de vue comportemental ?',
            en: 'Why do Fibonacci retracements appear to work in financial markets, from a behavioral standpoint?'
        },
        answer: {
            fr: 'Principalement dû à l\'effet de **prophétie auto-réalisatrice** (Self-Fulfilling Prophecy). Comme beaucoup d\'acteurs utilisent les mêmes indicateurs, la concentration d\'ordres autour de ces prix crée la liquidité et le rebond attendu.',
            en: 'Primarily due to a **Self-Fulfilling Prophecy** effect. Since many actors use the same indicators, the clustering of orders around these price levels provides the liquidity and the expected bounce.'
        }
    }
];
