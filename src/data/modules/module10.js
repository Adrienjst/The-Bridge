"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module10 = void 0;
exports.module10 = {
    id: 'module10',
    number: 10,
    title: {
        fr: 'Stratégies de Trading & Paris',
        en: 'Trading Strategies & Betting',
    },
    subtitle: {
        fr: 'Martingale, Fibonacci et Ratios d\'Or',
        en: 'Martingale, Fibonacci and Golden Ratios',
    },
    description: {
        fr: 'Comprendre et démystifier la Martingale, la suite de Fibonacci et leur (dangereuse) application aux marchés.',
        en: 'Understand and demystify the Martingale, Fibonacci sequences, and their (dangerous) application to markets.',
    },
    difficulty: 'intermédiaire',
    duration: { fr: '45 min', en: '45 min' },
    icon: '🎲',
    color: 'from-orange-500 to-red-500',
    objectives: [
        {
            fr: 'Différencier la martingale mathématique du système de pari.',
            en: 'Differentiate the mathematical martingale from the betting system.'
        },
        {
            fr: 'Comprendre le risque de ruine inhérent aux stratégies de doublement.',
            en: 'Understand the risk of ruin inherent to doubling strategies.'
        },
        {
            fr: 'Découvrir la suite de Fibonacci et ses applications en analyse technique.',
            en: 'Discover the Fibonacci sequence and its applications in technical analysis.'
        }
    ],
    lessons: [
        {
            id: 'l1',
            title: {
                fr: 'La Martingale : Mathématiques vs Paris',
                en: 'Martingale: Mathematics vs Betting',
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: "\nIntroduction\nLa Martingale est un concept fondamental en probabilit\u00E9s et une strat\u00E9gie de pari tristement c\u00E9l\u00E8bre. Ce module explore la diff\u00E9rence cruciale entre la d\u00E9finition math\u00E9matique rigoureuse et le syst\u00E8me de mise con\u00E7u pour r\u00E9cup\u00E9rer ses pertes.\n\n### 1. La Martingale Math\u00E9matique\nEn calcul stochastique, un processus stochastique $M_t$ est une **martingale** par rapport \u00E0 une filtration $\\mathcal{F}_t$ et une probabilit\u00E9 $\\mathbb{P}$ si :\n1. $\\mathbb{E}[|M_t|] < \\infty$ (int\u00E9grabilit\u00E9)\n2. $\\mathbb{E}[M_t | \\mathcal{F}_s] = M_s$ pour tout $s \\le t$\n\n**Interpr\u00E9tation :** Une martingale mod\u00E9lise un \"jeu \u00E9quitable\". L'esp\u00E9rance du gain futur, sachant toute l'information pr\u00E9sente, est \u00E9gale \u00E0 la valeur pr\u00E9sente. Il n'y a ni tendance \u00E0 la hausse, ni \u00E0 la baisse. Le mouvement brownien standard est la martingale par excellence.\n\n### 2. Le Syst\u00E8me de Pari (The Martingale Betting System)\nLe syst\u00E8me de pari repose sur une id\u00E9e simple : **doubler sa mise apr\u00E8s chaque perte**.\n- Vous pariez 1 unit\u00E9 sur un jeu \u00E0 probabilit\u00E9 50/50 (ex: pile ou face).\n- Si vous gagnez, vous remportez 1 unit\u00E9 et vous recommencez \u00E0 1.\n- Si vous perdez, vous misez 2. Si vous perdez encore, vous misez 4, puis 8, etc.\n- D\u00E8s que vous gagnez, vous r\u00E9cup\u00E9rez *toutes* vos pertes pr\u00E9c\u00E9dentes **plus** 1 unit\u00E9 de profit. \n\nLa taille de la mise apr\u00E8s $n$ pertes cons\u00E9cutives est :\n$$ Mise_n = 2^n \\times Mise_0 $$\n\n### 3. L'illusion de la certitude et le \"Risk of Ruin\"\nEn th\u00E9orie (avec un capital infini et pas de limite de table), la martingale garantit un gain. Cependant, en r\u00E9alit\u00E9, la croissance exponentielle des pertes m\u00E8ne in\u00E9vitablement \u00E0 la ruine financi\u00E8re (le **Risk of Ruin**).\n- Apr\u00E8s 10 pertes cons\u00E9cutives (probabilit\u00E9 $(1/2)^{10} \\approx 0.1\\%$), la mise n\u00E9cessaire est de $2^{10} = 1024$ unit\u00E9s, juste pour gagner 1 seule unit\u00E9 !\n- Les tables de casino (et les appels de marge en trading) ont des limites qui vous emp\u00EAcheront de doubler \u00E9ternellement, cristallisant ainsi une perte catastrophique.\n",
                        en: "\nIntroduction\nThe Martingale is a fundamental concept in probability theory and an infamous betting strategy. This module explores the crucial difference between the rigorous mathematical definition and the staking system designed to chase losses.\n\n### 1. The Mathematical Martingale\nIn stochastic calculus, a stochastic process $M_t$ is a **martingale** with respect to a filtration $\\mathcal{F}_t$ and a probability measure $\\mathbb{P}$ if:\n1. $\\mathbb{E}[|M_t|] < \\infty$ (integrability)\n2. $\\mathbb{E}[M_t | \\mathcal{F}_s] = M_s$ for all $s \\le t$\n\n**Interpretation:** A martingale models a \"fair game.\" The expectation of future states, given all present information, is equal to the present state. There is no expected upward or downward drift. Standard Brownian motion is the quintessential martingale.\n\n### 2. The Martingale Betting System\nThe betting system relies on a simple premise: **double your bet after every loss**.\n- You bet 1 unit on a 50/50 game (e.g., coin toss).\n- If you win, you pocket 1 unit and restart at 1.\n- If you lose, you bet 2. If you lose again, you bet 4, then 8, etc.\n- As soon as you win, you recover *all* previous losses **plus** 1 unit of profit.\n\nThe bet size after $n$ consecutive losses is:\n$$ Bet_n = 2^n \\times Bet_0 $$\n\n### 3. The Illusion of Certainty and the Risk of Ruin\nIn theory (with infinite capital and no table limits), the martingale guarantees a win. However, in reality, the exponential growth of losses inevitably leads to deep financial ruin (the **Risk of Ruin**).\n- After 10 consecutive losses (probability $(1/2)^{10} \\approx 0.1\\%$), the required bet is $2^{10} = 1024$ units, just to win 1 single unit!\n- Casino tables (and trading margin calls) have limits that will stop you from doubling indefinitely, thereby crystallizing a catastrophic loss.\n"
                    }
                }
            ]
        },
        {
            id: 'l2',
            title: {
                fr: 'Le Système de Pari Fibonacci',
                en: 'The Fibonacci Betting System',
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: "\nIntroduction\nLe syst\u00E8me de pari utilisant la suite de Fibonacci est une strat\u00E9gie populaire de gestion de bankroll. Contrairement \u00E0 la violence exponentielle de la Martingale, le syst\u00E8me Fibonacci offre une augmentation des mises beaucoup plus douce.\n\n### 1. La Suite de Fibonacci\nLa s\u00E9quence de Fibonacci est une suite d'entiers dans laquelle chaque terme est la somme des deux termes qui le pr\u00E9c\u00E8dent.\nElle commence par 1, 1 (ou 0, 1) :\n$$ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ... $$\n\nFormellement :\n$$ F_n = F_{n-1} + F_{n-2} $$ avec $F_1 = 1, F_2 = 1$.\n\n### 2. Application aux Paris\nLe syst\u00E8me s'applique g\u00E9n\u00E9ralement \u00E0 des jeux \u00E0 50/50 (red/black \u00E0 la roulette).\n- **R\u00E8gle en cas de perte :** Avancez d'un pas dans la suite de Fibonacci. Votre prochaine mise est le nombre suivant.\n- **R\u00E8gle en cas de gain :** Reculez de **deux pas** dans la suite.\n\n*Exemple de s\u00E9quence:*\n1. Misez 1 (Perte) \u2192 Misez 1\n2. Misez 1 (Perte) \u2192 Misez 2\n3. Misez 2 (Perte) \u2192 Misez 3\n4. Misez 3 (Perte) \u2192 Misez 5\n5. Misez 5 (Gain) \u2192 Recule de 2 pas, prochaine mise : 2\n\n### 3. Avantages et Inconv\u00E9nients\n**Avantages :** \n- Les montants augmentent de mani\u00E8re quasi-lin\u00E9aire (asymptotiquement proportionnel au nombre d'or $\\phi \\approx 1.618$), contrairement au $\\times 2$ brutal de la Martingale.\n- Le risque de ruine (atteindre la limite de table) est retard\u00E9.\n\n**Inconv\u00E9nients :**\n- Un seul gain ne couvre *pas* toutes vos pertes cumul\u00E9es pr\u00E9c\u00E9dentes (contrairement \u00E0 la Martingale). Il faut souvent plusieurs gains pour cl\u00F4turer un cycle d\u00E9ficitaire.\n- Sur le tr\u00E8s long terme, face \u00E0 des jeux \u00E0 esp\u00E9rance math\u00E9matique n\u00E9gative (le z\u00E9ro de la roulette, le slippage/spread en trading), aucune strat\u00E9gie de gestion des tailles de position ne peut transformer une esp\u00E9rance n\u00E9gative en esp\u00E9rance positive.\n",
                        en: "\nIntroduction\nThe betting system utilizing the Fibonacci sequence is a popular bankroll management strategy. Unlike the exponential violence of the Martingale, the Fibonacci system offers a much gentler progression of bet sizing.\n\n### 1. The Fibonacci Sequence\nThe Fibonacci sequence is a series of integers wherein each number is the sum of the two preceding ones.\nIt begins with 1, 1 (or 0, 1):\n$$ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ... $$\n\nFormally:\n$$ F_n = F_{n-1} + F_{n-2} $$ with $F_1 = 1, F_2 = 1$.\n\n### 2. Application to Betting\nThe system is typically applied to near 50/50 games (red/black in roulette).\n- **Rule on Loss:** Move one step forward in the Fibonacci sequence. Your next bet is the next number.\n- **Rule on Win:** Move **two steps back** in the sequence.\n\n*Sequence Example:*\n1. Bet 1 (Loss) \u2192 Bet 1\n2. Bet 1 (Loss) \u2192 Bet 2\n3. Bet 2 (Loss) \u2192 Bet 3\n4. Bet 3 (Loss) \u2192 Bet 5\n5. Bet 5 (Win) \u2192 Move back 2 steps, next bet: 2\n\n### 3. Pros and Cons\n**Pros:**\n- Bet sizes increase moderately (asymptotically proportional to the golden ratio $\\phi \\approx 1.618$), unlike the brutal $\\times 2$ of the Martingale.\n- The risk of ruin (hitting table max/account limits) is substantially delayed.\n\n**Cons:**\n- A single win does *not* recover all your previous accumulated losses (unlike the Martingale). It often requires multiple wins to close a deficit cycle.\n- Over the very long term, against games with a negative mathematical expectation (the zero in roulette, slippage/spread in trading), no position sizing strategy can transform a negative expected value into a positive one.\n"
                    }
                }
            ]
        },
        {
            id: 'l3',
            title: {
                fr: 'Retracements de Fibonacci',
                en: 'Fibonacci Retracements',
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: "\nIntroduction\nBien que la suite de Fibonacci soit un syst\u00E8me de pari, sur les march\u00E9s financiers, on la retrouve le plus souvent sous la forme de **Retracements de Fibonacci**, un outil phare de l'Analyse Technique.\n\n### 1. Le Nombre d'Or\nLe rapport entre un nombre de Fibonacci et son pr\u00E9c\u00E9dent tend vers le Nombre d'Or ($\\phi$) au fur et \u00E0 mesure que la suite s'allonge :\n$$ \\lim_{n \\to \\infty} \\frac{F_n}{F_{n-1}} = \\phi \\approx 1.618034 $$\n\nDe m\u00EAme, le rapport inverse $\\frac{F_{n-1}}{F_n} \\approx 0.618$, et $\\frac{F_{n-2}}{F_n} \\approx 0.382$. Ce sont ces ratios qui sont cl\u00E9s.\n\n### 2. Trac\u00E9 des Retracements\nEn analyse technique (chartisme), les traders pensent que les prix des actifs financiers retracent souvent une portion pr\u00E9visible d'un mouvement majeur avant de poursuivre dans la tendance initiale.\n\nLes pourcentages de retracement standards d\u00E9riv\u00E9s de ces ratios sont :\n- **23.6%**\n- **38.2%**\n- **50.0%** (Non issu de Fibonacci, mais toujours utilis\u00E9)\n- **61.8%** (Le \"Golden Retracement\")\n- **78.6%** (Racine carr\u00E9e de 0.618)\n\n**Utilisation :** Lors d'un fort mouvement haussier (Swing Low vers Swing High), un trader tracera l'outil Fibonacci. Si le prix corrige, le trader cherchera des signaux d'achat (rebonds) aux niveaux de 38.2% ou 61.8%.\n\n### 3. Effet Auto-R\u00E9alisateur\nContrairement \u00E0 la finance quantitative (Black-Scholes, It\u00F4) qui repose sur l'arbitrage math\u00E9matique, l'efficacit\u00E9 des retracements de Fibonacci fait largement d\u00E9bat.\n\nPuisque des millions d'acteurs de march\u00E9, de traders retail et d'algorithmes observent les m\u00EAmes niveaux de 61.8%, ils y placent souvent des ordres d'achat ou des Take Profits. Ce comportement moutonnier cr\u00E9e des proph\u00E9ties auto-r\u00E9alisatrices (\"Self-Fulfilling Prophecy\") : le prix y rebondit non pas par loi naturelle, mais par abondance de liquidit\u00E9 artificielle \u00E0 ce niveau pr\u00E9cis.\n",
                        en: "\nIntroduction\nWhile the Fibonacci sequence features in betting systems, in financial markets, it is most frequently encountered in the form of **Fibonacci Retracements**, a flagship tool in Technical Analysis.\n\n### 1. The Golden Ratio\nThe ratio of any Fibonacci number to its predecessor converges to the Golden Ratio ($\\phi$) as the sequence progresses:\n$$ \\lim_{n \\to \\infty} \\frac{F_n}{F_{n-1}} = \\phi \\approx 1.618034 $$\n\nSimilarly, the inverse ratio $\\frac{F_{n-1}}{F_n} \\approx 0.618$, and $\\frac{F_{n-2}}{F_n} \\approx 0.382$. These ratios are the key.\n\n### 2. Plotting Retracements\nIn technical analysis (charting), traders believe that financial asset prices frequently retrace a predictable portion of an original major move before continuing in the original direction.\n\nThe standard retracement percentages derived from these ratios are:\n- **23.6%**\n- **38.2%**\n- **50.0%** (Not originally Fibonacci, but always used)\n- **61.8%** (The \"Golden Retracement\")\n- **78.6%** (Square root of 0.618)\n\n**Usage:** During a strong upward trend (Swing Low to Swing High), a trader will draw the Fibonacci tool. As the price corrects, the trader looks for buying signals (bounces) at the 38.2% or 61.8% support levels.\n\n### 3. Self-Fulfilling Prophecy\nUnlike quantitative finance (Black-Scholes, It\u00F4) which relies on mathematical arbitrage bounds, the effectiveness of Fibonacci retracements is heavily debated.\n\nBecause millions of market participants, retail traders, and algorithms are watching the exact same 61.8% levels, they cluster their buy orders and Take Profits there. This herding behavior creates a \"Self-Fulfilling Prophecy\": the price bounces there not due to fundamental natural law, but because of the artificial aggregation of liquidity at that specific arbitrary level.\n"
                    }
                }
            ]
        }
    ]
};
