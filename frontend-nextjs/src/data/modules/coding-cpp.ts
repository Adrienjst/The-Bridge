import { CourseModule } from '../types';

export const codingCpp: CourseModule = {
    id: 'coding-cpp',
    number: 12,
    title: {
        fr: 'C++ pour le Pricing',
        en: 'C++ for Pricing'
    },
    subtitle: {
        fr: 'Performance, Mémoire, et Approche Orientée Objet',
        en: 'Performance, Memory, and Object-Oriented Approach'
    },
    description: {
        fr: 'Découvrez pourquoi le C++ est le standard de l\'industrie pour le pricing de produits dérivés complexes. Apprenez à gérer la mémoire et à utiliser le polymorphisme pour structurer un Payoff.',
        en: 'Discover why C++ is the industry standard for pricing complex derivatives. Learn to manage memory and use polymorphism to structure a Payoff.'
    },
    difficulty: 'avancé',
    duration: { fr: '3 heures', en: '3 hours' },
    icon: '⚡',
    color: '#0ea5e9', // sky-500
    objectives: [
        {
            fr: 'Comprendre l\'avantage de performance du C++ natif vs Python.',
            en: 'Understand the performance advantage of native C++ vs Python.'
        },
        {
            fr: 'Maîtriser les pointeurs et références pour la gestion mémoire.',
            en: 'Master pointers and references for memory management.'
        },
        {
            fr: 'Construire une hiérarchie de Payoffs orientée objet.',
            en: 'Build an object-oriented Payoff hierarchy.'
        }
    ],
    lessons: [
        {
            id: 'cpp-intro-pointers',
            title: {
                fr: 'Introduction au C++ Quantitatif',
                en: 'Introduction to Quantitative C++'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Dans les banques d\'investissement, la librairie de pricing coeur (Core Pricing Lib) est quasi-systématiquement écrite en **C++**. La raison principale est le contrôle total sur la mémoire via les **pointeurs** et les **références**, permettant une exécution ultra-rapide des méthodes de Monte Carlo et des Arbres Binomiaux.',
                        en: 'In investment banks, the core pricing library is almost always written in **C++**. The main reason is total control over memory via **pointers** and **references**, allowing ultra-fast execution of Monte Carlo methods and Binomial Trees.'
                    }
                },
                {
                    type: 'interactive-code',
                    body: {
                        fr: 'Exemple basique : Le passage par référence `&` permet de modifier la variable originale sans copier tout l\'objet en mémoire (crucial quand on passe une matrice de volatilité de 1 Go à une fonction de pricing).',
                        en: 'Basic example: Passing by reference `&` allows modifying the original variable without copying the whole object in memory (crucial when passing a 1 GB volatility matrix to a pricing function).'
                    },
                    codeConfig: {
                        language: 'cpp',
                        initialCode: `#include <iostream>

using namespace std;

// Fonction de choc d'une matrice (ici simplifié à un simple double)
// Remarquez le symbole '&' qui signifie "Passage par Référence"
void bumpVolatility(double& volMatrixRef, double bumpSize) {
    volMatrixRef += bumpSize;
    cout << "Dans la fonction, la ref est choquée a : " << volMatrixRef << "\\n";
}

int main() {
    double myPortfolioVol = 0.20; // Volatilité initiale de 20%
    
    cout << "Avant le choc de risque : " << myPortfolioVol << "\\n";
    
    // On passe la variable. Grâce au '&' dans la signature, 
    // la foncion modifie directement l'originale sans la copier.
    bumpVolatility(myPortfolioVol, 0.01); // Choc Vega +1%
    
    cout << "Apres le choc : " << myPortfolioVol << "\\n";
    cout << "C'est l'essence de l'optimisation mémoire en C++ !\\n";
    
    return 0;
}`
                    }
                }
            ]
        },
        {
            id: 'cpp-oop-payoffs',
            title: {
                fr: 'Orienté Objet et Polymorphisme',
                en: 'Object-Oriented & Polymorphism'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Le vrai pouvoir du C++ en structuration vient de l\'**Architecture Orientée Objet** (OOP). Un moteur de pricing générique reçoit un objet `Payoff` abstrait sans savoir s\'il s\'agit d\'un Call ou d\'un Put. C\'est le rôle du **Polymorphisme** via les méthodes `virtual`.',
                        en: 'The true power of C++ in structuring comes from **Object-Oriented Architecture** (OOP). A generic pricing engine receives an abstract `Payoff` object without knowing if it\'s a Call or a Put. This is the role of **Polymorphism** via `virtual` methods.'
                    }
                },
                {
                    type: 'interactive-code',
                    body: {
                        fr: 'Voici une architecture classique de classe de Base abstraite et ses classes Dérivées. Le moteur appelle `operator()(spot)` (Surcharge d\'Opérateur) de manière purement virtuelle.',
                        en: 'Here is a classic architecture of an abstract Base class and its Derived classes. The engine calls `operator()(spot)` (Operator Overloading) purely virtually.'
                    },
                    codeConfig: {
                        language: 'cpp',
                        initialCode: `#include <iostream>
#include <algorithm> // pour std::max

using namespace std;

// 1. Classe de Base Abstraite
class Payoff {
public:
    // Le constructeur virtuel est indispensable en C++ pour l'héritage
    virtual ~Payoff() {}
    
    // Fonction Virtuelle Pure (le "= 0" à la fin)
    // Elle oblige les classes enfants à l'implémenter.
    virtual double operator()(double spot) const = 0;
};

// 2. Classe Enfant : Le Call
class PayoffCall : public Payoff {
private:
    double Strike;
public:
    // Constructeur
    PayoffCall(double K) : Strike(K) {}
    
    // Implémentation du Call
    double operator()(double spot) const override {
        return max(spot - Strike, 0.0);
    }
};

// 3. Classe Enfant : Le Put
class PayoffPut : public Payoff {
private:
    double Strike;
public:
    // Constructeur
    PayoffPut(double K) : Strike(K) {}
    
    // Implémentation du Put
    double operator()(double spot) const override {
        return max(Strike - spot, 0.0);
    }
};

// 4. Moteur de simulation (Générique)
// Prend n'importe quel Payoff en référence, sans se soucier de sa nature !
void printPayoffs(double spot, const Payoff& thePayoff) {
    cout << "Pour S=" << spot << ", le flux de trésorerie est : " << thePayoff(spot) << " EUR\\n";
}

int main() {
    double myStrike = 100.0;
    
    PayoffCall myCall(myStrike);
    PayoffPut myPut(myStrike);
    
    cout << "--- PRICING DU CALL (Strike 100) ---\\n";
    printPayoffs(110.0, myCall); // Dans la monnaie
    printPayoffs(90.0, myCall);  // Hors la monnaie
    
    cout << "\\n--- PRICING DU PUT (Strike 100) ---\\n";
    printPayoffs(110.0, myPut);  // Hors la monnaie
    printPayoffs(90.0, myPut);   // Dans la monnaie
    
    return 0;
}`
                    }
                }
            ]
        }
    ]
};
