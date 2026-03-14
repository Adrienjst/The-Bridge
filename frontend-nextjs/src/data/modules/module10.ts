import { CourseModule } from '../types';

export const module10: CourseModule = {
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
    color: '#f97316', // orange-500
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
                        fr: `
Introduction
La Martingale est un concept fondamental en probabilités et une stratégie de pari tristement célèbre. Ce module explore la différence cruciale entre la définition mathématique rigoureuse et le système de mise conçu pour récupérer ses pertes.

### 1. La Martingale Mathématique
En calcul stochastique, un processus stochastique $M_t$ est une **martingale** par rapport à une filtration $\\mathcal{F}_t$ et une probabilité $\\mathbb{P}$ si :
1. $\\mathbb{E}[|M_t|] < \\infty$ (intégrabilité)
2. $\\mathbb{E}[M_t | \\mathcal{F}_s] = M_s$ pour tout $s \\le t$

**Interprétation :** Une martingale modélise un "jeu équitable". L'espérance du gain futur, sachant toute l'information présente, est égale à la valeur présente. Il n'y a ni tendance à la hausse, ni à la baisse. Le mouvement brownien standard est la martingale par excellence.

### 2. Le Système de Pari (The Martingale Betting System)
Le système de pari repose sur une idée simple : **doubler sa mise après chaque perte**.
- Vous pariez 1 unité sur un jeu à probabilité 50/50 (ex: pile ou face).
- Si vous gagnez, vous remportez 1 unité et vous recommencez à 1.
- Si vous perdez, vous misez 2. Si vous perdez encore, vous misez 4, puis 8, etc.
- Dès que vous gagnez, vous récupérez *toutes* vos pertes précédentes **plus** 1 unité de profit. 

La taille de la mise après $n$ pertes consécutives est :
$$ Mise_n = 2^n \\times Mise_0 $$

### 3. L'illusion de la certitude et le "Risk of Ruin"
En théorie (avec un capital infini et pas de limite de table), la martingale garantit un gain. Cependant, en réalité, la croissance exponentielle des pertes mène inévitablement à la ruine financière (le **Risk of Ruin**).
- Après 10 pertes consécutives (probabilité $(1/2)^{10} \\approx 0.1\\%$), la mise nécessaire est de $2^{10} = 1024$ unités, juste pour gagner 1 seule unité !
- Les tables de casino (et les appels de marge en trading) ont des limites qui vous empêcheront de doubler éternellement, cristallisant ainsi une perte catastrophique.
`,
                        en: `
Introduction
The Martingale is a fundamental concept in probability theory and an infamous betting strategy. This module explores the crucial difference between the rigorous mathematical definition and the staking system designed to chase losses.

### 1. The Mathematical Martingale
In stochastic calculus, a stochastic process $M_t$ is a **martingale** with respect to a filtration $\\mathcal{F}_t$ and a probability measure $\\mathbb{P}$ if:
1. $\\mathbb{E}[|M_t|] < \\infty$ (integrability)
2. $\\mathbb{E}[M_t | \\mathcal{F}_s] = M_s$ for all $s \\le t$

**Interpretation:** A martingale models a "fair game." The expectation of future states, given all present information, is equal to the present state. There is no expected upward or downward drift. Standard Brownian motion is the quintessential martingale.

### 2. The Martingale Betting System
The betting system relies on a simple premise: **double your bet after every loss**.
- You bet 1 unit on a 50/50 game (e.g., coin toss).
- If you win, you pocket 1 unit and restart at 1.
- If you lose, you bet 2. If you lose again, you bet 4, then 8, etc.
- As soon as you win, you recover *all* previous losses **plus** 1 unit of profit.

The bet size after $n$ consecutive losses is:
$$ Bet_n = 2^n \\times Bet_0 $$

### 3. The Illusion of Certainty and the Risk of Ruin
In theory (with infinite capital and no table limits), the martingale guarantees a win. However, in reality, the exponential growth of losses inevitably leads to deep financial ruin (the **Risk of Ruin**).
- After 10 consecutive losses (probability $(1/2)^{10} \\approx 0.1\\%$), the required bet is $2^{10} = 1024$ units, just to win 1 single unit!
- Casino tables (and trading margin calls) have limits that will stop you from doubling indefinitely, thereby crystallizing a catastrophic loss.
`
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
                        fr: `
Introduction
Le système de pari utilisant la suite de Fibonacci est une stratégie populaire de gestion de bankroll. Contrairement à la violence exponentielle de la Martingale, le système Fibonacci offre une augmentation des mises beaucoup plus douce.

### 1. La Suite de Fibonacci
La séquence de Fibonacci est une suite d'entiers dans laquelle chaque terme est la somme des deux termes qui le précèdent.
Elle commence par 1, 1 (ou 0, 1) :
$$ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ... $$

Formellement :
$$ F_n = F_{n-1} + F_{n-2} $$ avec $F_1 = 1, F_2 = 1$.

### 2. Application aux Paris
Le système s'applique généralement à des jeux à 50/50 (red/black à la roulette).
- **Règle en cas de perte :** Avancez d'un pas dans la suite de Fibonacci. Votre prochaine mise est le nombre suivant.
- **Règle en cas de gain :** Reculez de **deux pas** dans la suite.

*Exemple de séquence:*
1. Misez 1 (Perte) → Misez 1
2. Misez 1 (Perte) → Misez 2
3. Misez 2 (Perte) → Misez 3
4. Misez 3 (Perte) → Misez 5
5. Misez 5 (Gain) → Recule de 2 pas, prochaine mise : 2

### 3. Avantages et Inconvénients
**Avantages :** 
- Les montants augmentent de manière quasi-linéaire (asymptotiquement proportionnel au nombre d'or $\\phi \\approx 1.618$), contrairement au $\\times 2$ brutal de la Martingale.
- Le risque de ruine (atteindre la limite de table) est retardé.

**Inconvénients :**
- Un seul gain ne couvre *pas* toutes vos pertes cumulées précédentes (contrairement à la Martingale). Il faut souvent plusieurs gains pour clôturer un cycle déficitaire.
- Sur le très long terme, face à des jeux à espérance mathématique négative (le zéro de la roulette, le slippage/spread en trading), aucune stratégie de gestion des tailles de position ne peut transformer une espérance négative en espérance positive.
`,
                        en: `
Introduction
The betting system utilizing the Fibonacci sequence is a popular bankroll management strategy. Unlike the exponential violence of the Martingale, the Fibonacci system offers a much gentler progression of bet sizing.

### 1. The Fibonacci Sequence
The Fibonacci sequence is a series of integers wherein each number is the sum of the two preceding ones.
It begins with 1, 1 (or 0, 1):
$$ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ... $$

Formally:
$$ F_n = F_{n-1} + F_{n-2} $$ with $F_1 = 1, F_2 = 1$.

### 2. Application to Betting
The system is typically applied to near 50/50 games (red/black in roulette).
- **Rule on Loss:** Move one step forward in the Fibonacci sequence. Your next bet is the next number.
- **Rule on Win:** Move **two steps back** in the sequence.

*Sequence Example:*
1. Bet 1 (Loss) → Bet 1
2. Bet 1 (Loss) → Bet 2
3. Bet 2 (Loss) → Bet 3
4. Bet 3 (Loss) → Bet 5
5. Bet 5 (Win) → Move back 2 steps, next bet: 2

### 3. Pros and Cons
**Pros:**
- Bet sizes increase moderately (asymptotically proportional to the golden ratio $\\phi \\approx 1.618$), unlike the brutal $\\times 2$ of the Martingale.
- The risk of ruin (hitting table max/account limits) is substantially delayed.

**Cons:**
- A single win does *not* recover all your previous accumulated losses (unlike the Martingale). It often requires multiple wins to close a deficit cycle.
- Over the very long term, against games with a negative mathematical expectation (the zero in roulette, slippage/spread in trading), no position sizing strategy can transform a negative expected value into a positive one.
`
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
                        fr: `
Introduction
Bien que la suite de Fibonacci soit un système de pari, sur les marchés financiers, on la retrouve le plus souvent sous la forme de **Retracements de Fibonacci**, un outil phare de l'Analyse Technique.

### 1. Le Nombre d'Or
Le rapport entre un nombre de Fibonacci et son précédent tend vers le Nombre d'Or ($\\phi$) au fur et à mesure que la suite s'allonge :
$$ \\lim_{n \\to \\infty} \\frac{F_n}{F_{n-1}} = \\phi \\approx 1.618034 $$

De même, le rapport inverse $\\frac{F_{n-1}}{F_n} \\approx 0.618$, et $\\frac{F_{n-2}}{F_n} \\approx 0.382$. Ce sont ces ratios qui sont clés.

### 2. Tracé des Retracements
En analyse technique (chartisme), les traders pensent que les prix des actifs financiers retracent souvent une portion prévisible d'un mouvement majeur avant de poursuivre dans la tendance initiale.

Les pourcentages de retracement standards dérivés de ces ratios sont :
- **23.6%**
- **38.2%**
- **50.0%** (Non issu de Fibonacci, mais toujours utilisé)
- **61.8%** (Le "Golden Retracement")
- **78.6%** (Racine carrée de 0.618)

**Utilisation :** Lors d'un fort mouvement haussier (Swing Low vers Swing High), un trader tracera l'outil Fibonacci. Si le prix corrige, le trader cherchera des signaux d'achat (rebonds) aux niveaux de 38.2% ou 61.8%.

### 3. Effet Auto-Réalisateur
Contrairement à la finance quantitative (Black-Scholes, Itô) qui repose sur l'arbitrage mathématique, l'efficacité des retracements de Fibonacci fait largement débat.

Puisque des millions d'acteurs de marché, de traders retail et d'algorithmes observent les mêmes niveaux de 61.8%, ils y placent souvent des ordres d'achat ou des Take Profits. Ce comportement moutonnier crée des prophéties auto-réalisatrices ("Self-Fulfilling Prophecy") : le prix y rebondit non pas par loi naturelle, mais par abondance de liquidité artificielle à ce niveau précis.
`,
                        en: `
Introduction
While the Fibonacci sequence features in betting systems, in financial markets, it is most frequently encountered in the form of **Fibonacci Retracements**, a flagship tool in Technical Analysis.

### 1. The Golden Ratio
The ratio of any Fibonacci number to its predecessor converges to the Golden Ratio ($\\phi$) as the sequence progresses:
$$ \\lim_{n \\to \\infty} \\frac{F_n}{F_{n-1}} = \\phi \\approx 1.618034 $$

Similarly, the inverse ratio $\\frac{F_{n-1}}{F_n} \\approx 0.618$, and $\\frac{F_{n-2}}{F_n} \\approx 0.382$. These ratios are the key.

### 2. Plotting Retracements
In technical analysis (charting), traders believe that financial asset prices frequently retrace a predictable portion of an original major move before continuing in the original direction.

The standard retracement percentages derived from these ratios are:
- **23.6%**
- **38.2%**
- **50.0%** (Not originally Fibonacci, but always used)
- **61.8%** (The "Golden Retracement")
- **78.6%** (Square root of 0.618)

**Usage:** During a strong upward trend (Swing Low to Swing High), a trader will draw the Fibonacci tool. As the price corrects, the trader looks for buying signals (bounces) at the 38.2% or 61.8% support levels.

### 3. Self-Fulfilling Prophecy
Unlike quantitative finance (Black-Scholes, Itô) which relies on mathematical arbitrage bounds, the effectiveness of Fibonacci retracements is heavily debated.

Because millions of market participants, retail traders, and algorithms are watching the exact same 61.8% levels, they cluster their buy orders and Take Profits there. This herding behavior creates a "Self-Fulfilling Prophecy": the price bounces there not due to fundamental natural law, but because of the artificial aggregation of liquidity at that specific arbitrary level.
`
                    }
                }
            ]
        },
        {
            id: 'l4',
            title: {
                fr: 'Le Critère de Kelly',
                en: 'The Kelly Criterion',
            },
            content: [
                {
                    type: 'text',
                    title: { fr: 'Maximiser la Croissance du Capital', en: 'Maximizing Capital Growth' },
                    body: {
                        fr: 'Contrairement à la Martingale qui garantit presque la ruine sur le long terme, le **Critère de Kelly** est une formule mathématique rigoureuse développée par J.L. Kelly (1956) chez Bell Labs. Son objectif est de déterminer la **taille optimale d\'une mise** (ou d\'une position de trading) pour maximiser le taux de croissance logarithmique d\'un capital sur le long terme.\n\nIl offre un équilibre parfait : il évite le risque de ruine totale tout en assurant une croissance du capital beaucoup plus rapide que toute autre stratégie de pari conditionnée par un avantage statistique (un "Edge").',
                        en: 'Unlike the Martingale which almost guarantees long-term ruin, the **Kelly Criterion** is a rigorous mathematical formula developed by J.L. Kelly (1956) at Bell Labs. Its objective is to determine the **optimal size of a bet** (or trading position) to maximize the long-term logarithmic growth rate of wealth.\n\nIt offers a perfect balance: it avoids the risk of total ruin while ensuring capital grows strictly faster than under any other betting strategy conditional on having a statistical advantage (an "Edge").'
                    }
                },
                {
                    type: 'formula',
                    title: { fr: 'La Formule de Kelly', en: 'The Kelly Formula' },
                    body: {
                        fr: 'Pour un pari simple où on gagne $B$ fois la mise avec probabilité $p$, et on perd la mise entière avec probabilité $q = 1-p$ :\n\n$$ K\\% = \\frac{p(B + 1) - 1}{B} $$\n\nOu plus intuitivement, si le gain et la perte potentiels sont égaux ($B=1$, par exemple un trade avec un Take Profit à distance $D$ et Stop Loss à distance $D$) :\n\n$$ K\\% = p - q $$\n\n- $K\\%$ est le pourcentage du capital total à miser.\n- **L\'avantage (Edge)** est essentiel : si $K\\% \\le 0$, le calcul dit de **ne pas parier**.',
                        en: 'For a simple bet where you win $B$ times your stake with probability $p$, and lose the entire stake with probability $q = 1-p$:\n\n$$ K\\% = \\frac{p(B + 1) - 1}{B} $$\n\nOr more intuitively, if the potential win and loss are equal ($B=1$, e.g., a trade with Take Profit at distance $D$ and Stop Loss at distance $D$):\n\n$$ K\\% = p - q $$\n\n- $K\\%$ is the percentage of total capital to bet.\n- **The Edge** is critical: if $K\\% \\le 0$, the math says **do not bet**.'
                    }
                },
                {
                    type: 'example',
                    title: { fr: 'Exemple de Sizing et Half-Kelly', en: 'Sizing Example and Half-Kelly' },
                    body: {
                        fr: '**Scénario** : Vous avez une stratégie de trading qui gagne 55% du temps ($p=0.55$, $q=0.45$). Le risque/rendement est de $1:1$ ($B=1$).\nVos gains espérés sont positifs. Quelle proportion du portefeuille allouer par trade ?\n\n$$ K\\% = 0.55 - 0.45 = 0.10 \\text{ (soit } 10\\%) $$\n\nKelly suggère de miser exactement 10% de votre capital actuel à chaque fois. Si le capital augmente, la mise absolue augmente. S\'il baisse, la mise absolue baisse (évitant la ruine).\n\n**Half-Kelly en pratique** : Le critère exact de Kelly est très agressif et suppose que vos estimations de $p$ et $B$ sont parfaites. En réalité, une erreur d\'estimation ("model risk") en surestimant son avantage mène à des pertes massives (overbetting). C\'est pourquoi la plupart des professionnels utilisent un **Fractional Kelly** (ex: Half-Kelly, miser $K\\% / 2$), réduisant considérablement la volatilité (drawdowns) tout en conservant ~75% de la croissance maximale théorique.',
                        en: '**Scenario**: You have a trading strategy that wins 55% of the time ($p=0.55$, $q=0.45$). The risk/reward ratio is $1:1$ ($B=1$).\nYour expected returns are positive. What fraction of the portfolio to allocate per trade?\n\n$$ K\\% = 0.55 - 0.45 = 0.10 \\text{ (or } 10\\%) $$\n\nKelly dictates betting exactly 10% of your current capital every time. As capital grows, absolute stake grows. If it shrinks, absolute stake shrinks (preventing ruin).\n\n**Half-Kelly in practice**: The exact Kelly criterion is very aggressive and assumes perfect estimates of $p$ and $B$. In reality, estimation error ("model risk") by overestimating your edge leads to massive losses (overbetting). Therefore, most professionals use **Fractional Kelly** (e.g., Half-Kelly, betting $K\\% / 2$), drastically reducing volatility (drawdowns) while retaining ~75% of the theoretical maximum growth.'
                    }
                }
            ]
        }
    ]
};
