import { QuizQuestion } from '../types';

export const module10Quizzes: QuizQuestion[] = [
    {
        id: '10-Q1',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'moyen',
        question: {
            fr: 'En calcul stochastique, qu\'est-ce qui caractérise une martingale $M_t$ ?',
            en: 'In stochastic calculus, what characterizes a martingale $M_t$?'
        },
        options: [
            { fr: 'La variance est nécessairement nulle', en: 'Variance is necessarily zero' },
            { fr: 'L\'espérance de la valeur future sachant le présent est supérieure à la valeur présente', en: 'The expected future value given the present is greater than the present value' },
            { fr: 'Il s\'agit d\'un processus déterministe', en: 'It is a deterministic process' },
            { fr: 'L\'espérance de la valeur future sachant le présent est égale à la valeur présente', en: 'The expected future value given the present equals the present value' }
        ],
        correctIndex: 3,
        explanation: {
            fr: 'Une martingale modélise un jeu équitable dont la direction future en espérance n\'est ni à la hausse ni à la baisse: $\\mathbb{E}[M_{t} | \\mathcal{F}_s] = M_s$.',
            en: 'A martingale models a fair game where the expected future direction is neither up nor down: $\\mathbb{E}[M_{t} | \\mathcal{F}_s] = M_s$.'
        }
    },
    {
        id: '10-Q2',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'facile',
        question: {
            fr: 'Combien d\'unités devez-vous miser selon la Martingale (le système de pari) à la suite de 5 pertes consécutives si la mise initiale était de 1 ?',
            en: 'How many units must you bet according to the Martingale system after 5 consecutive losses if the initial bet was 1?'
        },
        options: [
            { fr: '5', en: '5' },
            { fr: '16', en: '16' },
            { fr: '32', en: '32' },
            { fr: '64', en: '64' },
        ],
        correctIndex: 2,
        explanation: {
            fr: 'La formule est $Mise_n = 2^n \\times Mise_0$. Après 5 pertes, la mise suivante (la 6ème de la série) doit être de $2^5 = 32$.',
            en: 'The formula is $Bet_n = 2^n \\times Bet_0$. After 5 losses, the next bet (the 6th in the series) must be $2^5 = 32$.'
        }
    },
    {
        id: '10-Q3',
        moduleId: 'module10',
        lessonId: 'l1',
        difficulty: 'difficile',
        question: {
            fr: 'Quelle est la principale limite pratique rendant la stratégie Martingale mathématiquement perdante à très long terme en conditions réelles ?',
            en: 'What is the main practical limitation rendering the Martingale strategy mathematically losing in the long-run under real conditions?'
        },
        options: [
            { fr: 'Les taux d\'intérêts qui capitalisent contre vous', en: 'Interest rates compounding against you' },
            { fr: 'L\'impact du slippage et des frais de courtage excessifs', en: 'The impact of slippage and excessive brokerage fees' },
            { fr: 'Le capital limité du joueur et les plafonds de mise fixés par les courtiers (Margin Calls) / casinos', en: 'The player\'s limited capital and maximum betting limits set by brokers (Margin Calls) / casinos' },
            { fr: 'La volatilité stochastique du sous-jacent', en: 'The stochastic volatility of the underlying' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'La croissance très rapide (exponentielle) en puissance de 2 épuise très vite toute "bankroll" finie et vient heurter le paramétrage de gestion de risque institué par la contrepartie.',
            en: 'The highly rapid (exponential) power of 2 growth quickly exhausts any finite bankroll and crashes into the risk management parameters instituted by the counterparty.'
        }
    },
    {
        id: '10-Q4',
        moduleId: 'module10',
        lessonId: 'l2',
        difficulty: 'moyen',
        question: {
            fr: 'Dans le système de pari Fibonacci $(1, 1, 2, 3, 5, 8...)$, vous avez misé 5 et vous GAGNEZ. Quelle est la prochaine mise selon les règles classiques ?',
            en: 'In the Fibonacci betting system $(1, 1, 2, 3, 5, 8...)$, you wagered 5 and WON. What is the next wager according to the classic rules?'
        },
        options: [
            { fr: '1', en: '1' },
            { fr: '2', en: '2' },
            { fr: '3', en: '3' },
            { fr: '8', en: '8' }
        ],
        correctIndex: 1,
        explanation: {
            fr: 'La règle Fibonacci prescrit de reculer de **deux pas** dans la séquence après un gain. La séquence est $1, 1, 2, 3, 5, 8$. Deux pas en arrière de "5", c\'est le chiffre "2".',
            en: 'The Fibonacci rule prescribes stepping **two steps back** in the sequence after a win. The sequence is $1, 1, 2, 3, 5, 8$. Two steps backwards from "5" is the number "2".'
        }
    },
    {
        id: '10-Q5',
        moduleId: 'module10',
        lessonId: 'l3',
        difficulty: 'moyen',
        question: {
            fr: 'Sur les marchés financiers, les niveaux "61.8%" et "38.2%" correspondent à :',
            en: 'In financial markets, the levels "61.8%" and "38.2%" correspond to:'
        },
        options: [
            { fr: 'Les fractiles d\'une distribution normale centrée réduite', en: 'The quantiles of a standard normal distribution' },
            { fr: 'Les taux d\'actualisation d\'une martingale locale continue', en: 'The discount rates of a continuous local martingale' },
            { fr: 'Des retracements de Fibonacci utilisés en analyse technique', en: 'Fibonacci retracements deployed in technical analysis' },
            { fr: 'Les paramètres du Mouvement Brownien Géométrique (GBM)', en: 'The parameters of a Geometric Brownian Motion (GBM)' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'Il s\'agit des fameux retracements de Fibonacci. 61.8% est le ratio inverse d\'Or ($1/1.618$). Les traders regardent ces pourcentages de retracement d\'un mouvement haussier/baissier précédent pour se positionner.',
            en: 'These are the famous Fibonacci retracements. 61.8% is the inverse Golden Ratio ($1/1.618$). Traders watch these percentage retracements of a previous up/downtrend to place positions.'
        }
    }
];
