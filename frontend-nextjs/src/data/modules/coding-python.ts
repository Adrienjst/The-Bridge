import { CourseModule } from '../types';

export const codingPython: CourseModule = {
    id: 'coding-python',
    number: 11,
    title: {
        fr: 'Python pour la Structuration',
        en: 'Python for Structuring'
    },
    subtitle: {
        fr: 'NumPy, Pandas, et Implémentation de Modèles',
        en: 'NumPy, Pandas, and Model Implementation'
    },
    description: {
        fr: 'Apprenez à utiliser Python pour pricer des dérivés, simuler des trajectoires de Monte Carlo, et manipuler des données financières de manière vectorisée.',
        en: 'Learn to use Python to price derivatives, simulate Monte Carlo paths, and manipulate financial data using vectorized operations.'
    },
    difficulty: 'intermédiaire',
    duration: { fr: '2 heures', en: '2 hours' },
    icon: '🐍',
    color: '#3b82f6', // blue-500
    objectives: [
        {
            fr: 'Maîtriser la vectorisation avec NumPy pour accélérer les calculs financiers.',
            en: 'Master vectorization with NumPy to accelerate financial computations.'
        },
        {
            fr: 'Implémenter une formule de Black-Scholes from scratch.',
            en: 'Implement a Black-Scholes formula from scratch.'
        },
        {
            fr: 'Coder un environnement de simulation Monte Carlo efficace.',
            en: 'Code an efficient Monte Carlo simulation environment.'
        }
    ],
    lessons: [
        {
            id: 'python-bases-numpy',
            title: {
                fr: 'Introduction à la Vectorisation (NumPy)',
                en: 'Introduction to Vectorization (NumPy)'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'En finance quantitative, la performance est clé. Les boucles `for` natives en Python sont extrêmement lentes. La bibliothèque **NumPy** permet de réaliser des opérations sur des tableaux entiers (Arrays) en utilisant du C compilé en arrière-plan. C\'est ce qu\'on appelle la **vectorisation**.',
                        en: 'In quantitative finance, performance is key. Native `for` loops in Python are extremely slow. The **NumPy** library allows operations on entire arrays using compiled C in the background. This is called **vectorization**.'
                    }
                },
                {
                    type: 'interactive-code',
                    body: {
                        fr: 'Exécutez ce code pour voir la différence de vitesse entre une boucle classique et la méthode vectorisée de NumPy pour calculer des rendements géométriques sur 1 million de jours fictifs.',
                        en: 'Run this code to see the speed difference between a classic loop and NumPy\'s vectorized method for calculating geometric returns on 1 million dummy days.'
                    },
                    codeConfig: {
                        language: 'python',
                        initialCode: `import numpy as np
import time
import math

# Generate 1 million random daily returns between -2% and +2%
n_days = 1_000_000
daily_returns_list = np.random.uniform(-0.02, 0.02, n_days).tolist()
daily_returns_array = np.array(daily_returns_list)

print(f"Calcul des rendements cumulés sur {n_days} jours...")

# 1. Native Python Loop (SLOW)
start_time = time.time()
capital = 1.0
for r in daily_returns_list:
    capital *= (1 + r)
python_time = time.time() - start_time
print(f"Boucle Python : {python_time:.4f} secondes. Résultat: {capital:.4f}")

# 2. Vectorized NumPy (FAST)
start_time = time.time()
capital_np = np.prod(1 + daily_returns_array)
numpy_time = time.time() - start_time
print(f"NumPy vectorisé: {numpy_time:.4f} secondes. Résultat: {capital_np:.4f}")

speedup = python_time / numpy_time if numpy_time > 0 else float('inf')
print(f"\\nNumPy est {speedup:.1f} fois plus rapide !")`
                    }
                }
            ]
        },
        {
            id: 'python-black-scholes',
            title: {
                fr: 'Pratique : Formule de Black-Scholes',
                en: 'Practice: Black-Scholes Formula'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Nous allons maintenant implémenter la formule analytique de Black-Scholes en utilisant `scipy.stats` pour obtenir la fonction de répartition de la loi normale standard $N(x)$.',
                        en: 'We will now implement the analytical Black-Scholes formula using `scipy.stats` to get the cumulative distribution function of the standard normal $N(x)$.'
                    }
                },
                {
                    type: 'formula',
                    body: {
                        fr: 'Rappel : $d_1 = \\frac{\\ln(S_0/K) + (r - q + \\sigma^2/2)T}{\\sigma\\sqrt{T}}$',
                        en: 'Reminder: $d_1 = \\frac{\\ln(S_0/K) + (r - q + \\sigma^2/2)T}{\\sigma\\sqrt{T}}$'
                    }
                },
                {
                    type: 'interactive-code',
                    body: {
                        fr: 'Complétez la fonction `black_scholes_call` pour qu\'elle retourne le prix correct du Call européen.',
                        en: 'Complete the `black_scholes_call` function so it returns the correct European Call price.'
                    },
                    codeConfig: {
                        language: 'python',
                        initialCode: `import math
from scipy.stats import norm

def black_scholes_call(S, K, T, r, q, sigma):
    """
    Calcule le prix d'un Call Européen selon Black-Scholes-Merton.
    """
    # TODO: Calculez d1 et d2
    d1 = (math.log(S / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    
    # TODO: Calculez le prix du Call (C)
    # Indice: norm.cdf() est l'équivalent de N()
    C = S * math.exp(-q * T) * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)
    
    return C

# Test de la fonction
euro_stoxx = 5000
strike = 4800
maturity_years = 1.0
risk_free_rate = 0.03 # 3%
dividend_yield = 0.02 # 2%
volatility = 0.18 # 18%

call_price = black_scholes_call(euro_stoxx, strike, maturity_years, risk_free_rate, dividend_yield, volatility)

print(f"Prix du Call (S={euro_stoxx}, K={strike}, 1Y) : {call_price:.2f} €")
# Résultat attendu : ~400.95 €`
                    }
                }
            ]
        },
        {
            id: 'python-monte-carlo',
            title: {
                fr: 'Simulation Monte Carlo Vectorisée',
                en: 'Vectorized Monte Carlo Simulation'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Pour pricer les options exotiques multi-sous-jacents ou dépendantes du chemin (path-dependent), il n\'y a pas de formule analytique. Le moteur de Monte Carlo devient indispensable. L\'objectif est de simuler des dizaines de milliers de trajectoires de marché en *un seul appel NumPy* pour éviter les boucles lentes.',
                        en: 'For pricing multi-underlying or path-dependent exotic options, there is no analytical formula. The Monte Carlo engine becomes indispensable. The goal is to simulate tens of thousands of market paths in a *single NumPy call* to avoid slow loops.'
                    }
                },
                {
                    type: 'interactive-code',
                    body: {
                        fr: 'Voici un générateur de trajectoires Browniennes Géométriques. Observez comment la matrice (Nb_Trajectoires $\\times$ Nb_Jours) est calculée instantanément. Ce script price un **Call Asiatique** (dont le payoff dépend de la moyenne des prix sur toute la durée de vie).',
                        en: 'Here is a Geometric Brownian paths generator. Observe how the (Num_Paths $\\times$ Num_Days) matrix is calculated instantly. This script prices an **Asian Call** (whose payoff depends on the average price over the life of the option).'
                    },
                    codeConfig: {
                        language: 'python',
                        initialCode: `import numpy as np

# Paramètres du marché
S0 = 100        # Prix spot
K = 100         # Strike
T = 1.0         # Maturité (1 an)
r = 0.05        # Taux sans risque
vol = 0.20      # Volatilité (20%)

# Paramètres de simulation
M = 50000       # Nombre de trajectoires
N = 252         # Nombre de pas de temps (jours de trading)
dt = T / N

print(f"Génération de {M} trajectoires sur {N} jours...")

# 1. Générer tous les chocs Gaussiens d'un coup : Matrice (M, N)
Z = np.random.standard_normal((M, N))

# 2. Calculer le Mouvement Brownien par somme cumulée sur l'axe du temps (axis=1)
# dW = sqrt(dt) * Z. Le mouvement brownien W est la somme cumulée des dW
W = np.cumsum(np.sqrt(dt) * Z, axis=1)

# Vecteur temps (dt, 2dt, 3dt... T)
time_grid = np.linspace(dt, T, N)

# 3. Formule de la solution exacte de l'EDS Géométrique pour TOUTE la matrice
# S_t = S_0 * exp((r - 0.5*vol^2)*t + vol*W_t)
S_paths = S0 * np.exp((r - 0.5 * vol**2) * time_grid + vol * W)

# 4. Pricing du Call Asiatique
# Le prix à maturité pour chaque trajectoire est la moyenne du Spot
average_prices = np.mean(S_paths, axis=1)
payoffs = np.maximum(average_prices - K, 0)

# Actualisation de l'espérance
price = np.exp(-r * T) * np.mean(payoffs)

print(f"Prix du Call Vanille ATM : ~10.45 €")
print(f"Prix du Call Asiatique (Monte Carlo) : {price:.4f} €")
print("Remarquez que le Call Asiatique est toujours moins cher qu'un Call Vanille (la moyenne adoucit la volatilité !)")`
                    }
                }
            ]
        }
    ]
};
