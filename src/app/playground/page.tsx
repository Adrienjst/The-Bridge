'use client';

import React, { useState } from 'react';
import { ArrowLeft, Code2, Play, Terminal, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { CodeRunner } from '@/components/CodeRunner';

const LANG_BOILERPLATES = {
    python: `import math
import numpy as np

# Playground Python - Finance Quantitative
# Testez vos algorithmes de pricing, Monte Carlo, etc.

def black_scholes_call(S, K, T, r, vol):
    # Implémentez la formule ici
    return 0.0

print("Environnement Python prêt.")
`,
    cpp: `#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

using namespace std;

// Playground C++ - Architecture Objet & Performance
// Compilez vos classes de Payoff ou vos Pricers Binomiaux

int main() {
    cout << "Environnement C++ pret.\\n";
    cout << "Testez vos pointeurs et surcharges ici !" << endl;
    return 0;
}
`,
    javascript: `// Playground JavaScript / TypeScript
// Idéal pour tester la logique métier de StructLab

const S0 = 100;
const K = 105;

const payoffCall = (spot, strike) => Math.max(spot - strike, 0);

console.log(\`Payoff pour S=\${S0}, K=\${K} : \${payoffCall(S0, K)} €\`);
`
};

export default function PlaygroundPage() {
    const { t } = useLanguage();
    const [language, setLanguage] = useState<'python' | 'cpp' | 'javascript'>('python');
    const [code, setCode] = useState(LANG_BOILERPLATES['python']);

    const handleLanguageChange = (lang: 'python' | 'cpp' | 'javascript') => {
        setLanguage(lang);
        setCode(LANG_BOILERPLATES[lang]);
    };

    return (
        <div className="page-container p-6 w-full max-w-[1400px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
                        <ArrowLeft size={16} /> {t({ fr: 'Retour à l\'accueil', en: 'Back to Home' })}
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Terminal className="text-blue-500 w-8 h-8" />
                        {t({ fr: 'Playground Quantitatif', en: 'Quantitative Playground' })}
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl">
                        {t({
                            fr: 'Testez librement vos algorithmes de pricing, implémentez des méthodes numériques (Monte Carlo, Arbres) ou testez votre gestion de la mémoire en C++ directement dans le navigateur.',
                            en: 'Freely test your pricing algorithms, implement numerical methods (Monte Carlo, Trees), or test your memory management in C++ directly in the browser.'
                        })}
                    </p>
                </div>

                {/* Language Selector */}
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => handleLanguageChange('python')}
                        className={'px-4 py-2 rounded-md text-sm font-medium transition-all ' + (language === 'python' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700')}
                    >
                        Python
                    </button>
                    <button
                        onClick={() => handleLanguageChange('cpp')}
                        className={'px-4 py-2 rounded-md text-sm font-medium transition-all ' + (language === 'cpp' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700')}
                    >
                        C++
                    </button>
                    <button
                        onClick={() => handleLanguageChange('javascript')}
                        className={'px-4 py-2 rounded-md text-sm font-medium transition-all ' + (language === 'javascript' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700')}
                    >
                        Javascript
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

                {/* Sidebar Ideas */}
                <div className="flex flex-col gap-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-400">
                            <Lightbulb size={18} />
                            {t({ fr: 'Idées d\'exercices', en: 'Exercise Ideas' })}
                        </h3>

                        <div className="space-y-4 text-sm text-slate-300">
                            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <span className="font-semibold text-white block mb-1">Pricing Black-Scholes</span>
                                Implémentez la formule mathématique en Python avec <code className="text-yellow-400">math.erf</code>.
                            </div>

                            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <span className="font-semibold text-white block mb-1">Arbre CRR (C++)</span>
                                Créez une boucle <em>Backward Induction</em> pour pricer un Put Américain avec gestion de pointeurs.
                            </div>

                            <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                <span className="font-semibold text-white block mb-1">Simulation Monte Carlo</span>
                                Générez un Mouvement Brownien Géométrique via <code className="text-yellow-400">numpy.random</code>.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Editor */}
                <div className="flex-1 min-h-[600px] shadow-2xl rounded-xl ring-1 ring-white/10 overflow-hidden">
                    <CodeRunner
                        key={language} // Force remount on language change
                        language={language}
                        initialCode={code}
                    />
                </div>
            </div>
        </div >
    );
}
