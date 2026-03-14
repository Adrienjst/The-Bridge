"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module6Quizzes = void 0;
exports.module6Quizzes = [
    {
        id: 'q6-1',
        moduleId: 'fixed-income-credit',
        lessonId: 'taux-interet-inflation',
        question: {
            fr: 'Si le taux nominal est de 5% et l\'inflation anticipée est de 2%, quel est approximativement le taux réel ?',
            en: 'If the nominal rate is 5% and expected inflation is 2%, what is approximately the real rate?'
        },
        options: [
            { fr: '7%', en: '7%' },
            { fr: '3%', en: '3%' },
            { fr: '2.5%', en: '2.5%' },
            { fr: '10%', en: '10%' }
        ],
        correctIndex: 1,
        explanation: {
            fr: 'Selon la relation de Fisher approchée, $r \\approx r_{reel} + i$, donc $r_{reel} \\approx r - i = 5\\% - 2\\% = 3\\%$.',
            en: 'According to the approximate Fisher equation, $r \\approx r_{reel} + i$, so $r_{reel} \\approx r - i = 5\\% - 2\\% = 3\\%$.'
        },
        difficulty: 'facile'
    },
    {
        id: 'q6-2',
        moduleId: 'fixed-income-credit',
        lessonId: 'taux-interet-inflation',
        question: {
            fr: 'Que signifie une courbe des taux inversée ?',
            en: 'What does an inverted yield curve signify?'
        },
        options: [
            { fr: 'Les taux à court terme sont inférieurs aux taux à long terme', en: 'Short-term rates are lower than long-term rates' },
            { fr: 'L\'inflation est négative (déflation)', en: 'Inflation is negative (deflation)' },
            { fr: 'Les taux à court terme sont supérieurs aux taux à long terme', en: 'Short-term rates are higher than long-term rates' },
            { fr: 'Le risque de crédit a disparu du marché', en: 'Credit risk has disappeared from the market' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'Une courbe inversée signifie que les taux d\'intérêt souverains à court terme dépassent ceux à long terme. C\'est un indicateur classique de restriction monétaire et de récession anticipée.',
            en: 'An inverted curve means short-term sovereign interest rates exceed long-term ones. It is a classic indicator of monetary tightening and anticipated recession.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'q6-3',
        moduleId: 'fixed-income-credit',
        lessonId: 'risque-credit',
        question: {
            fr: 'Comment se calcule mathématiquement la relation entre Spread de Crédit ($s$), Probabilité de Défaut (PD) et Loss Given Default (LGD) ?',
            en: 'How is the mathematical relationship between Credit Spread ($s$), Probability of Default (PD), and Loss Given Default (LGD) calculated?'
        },
        options: [
            { fr: '$s \\approx \\text{PD} + \\text{LGD}$', en: '$s \\approx \\text{PD} + \\text{LGD}$' },
            { fr: '$s \\approx \\frac{\\text{PD}}{\\text{LGD}}$', en: '$s \\approx \\frac{\\text{PD}}{\\text{LGD}}$' },
            { fr: '$s \\approx \\text{PD} \\times \\text{LGD}$', en: '$s \\approx \\text{PD} \\times \\text{LGD}$' },
            { fr: '$s \\approx \\text{LGD} - \\text{PD}$', en: '$s \\approx \\text{LGD} - \\text{PD}$' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'En première approximation pour compenser le risque, le spread exigé par l\'investisseur est égal à l\'espérance de perte mensuelle/annuelle : $\\text{PD} \\times \\text{LGD}$.',
            en: 'As a first approximation to compensate for risk, the spread demanded by the investor equals the expected expected loss: $\\text{PD} \\times \\text{LGD}$.'
        },
        difficulty: 'facile'
    },
    {
        id: 'q6-4',
        moduleId: 'fixed-income-credit',
        lessonId: 'derives-de-credit',
        question: {
            fr: 'Lors de l\'achat d\'un Credit Linked Note (CLN), quelle est la position de l\'investisseur par rapport au risque de crédit de l\'entité de référence ?',
            en: 'When buying a Credit Linked Note (CLN), what is the position of the investor regarding the credit risk of the reference entity?'
        },
        options: [
            { fr: 'Il achète de la protection (Protection Buyer)', en: 'They buy protection (Protection Buyer)' },
            { fr: 'Il vend de la protection (Protection Seller)', en: 'They sell protection (Protection Seller)' },
            { fr: 'Il est neutre au risque de crédit', en: 'They are credit-risk neutral' },
            { fr: 'Il hedge le risque de signature de l\'émetteur', en: 'They hedge the issuer signature risk' }
        ],
        correctIndex: 1,
        explanation: {
            fr: 'Dans un CLN, l\'investisseur agit comme vendeur de protection. Il perçoit un coupon bonifié, mais s\'engage à subir la perte de capital si l\'entité de référence fait défaut.',
            en: 'In a CLN, the investor acts as a protection seller. They receive an enhanced coupon but agree to suffer the capital loss if the reference entity defaults.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'q6-5',
        moduleId: 'fixed-income-credit',
        lessonId: 'derives-de-credit',
        question: {
            fr: 'Quel est l\'un des risques principaux associés à un CLN par rapport à un investissement direct en obligation corporate ?',
            en: 'What is one of the main risks associated with a CLN compared to a direct corporate bond investment?'
        },
        options: [
            { fr: 'Risque de change', en: 'Currency risk' },
            { fr: 'Risque de taux d\'intérêt accru', en: 'Increased interest rate risk' },
            { fr: 'Risque de "Double Défaut" (Émetteur + Entité de Référence)', en: 'Double Default risk (Issuer + Reference Entity)' },
            { fr: 'Risque de remboursement anticipé volontaire', en: 'Voluntary early repayment risk' }
        ],
        correctIndex: 2,
        explanation: {
            fr: 'L\'investisseur est exposé à la fois au risque que l\'entité de référence fasse défaut, ET au risque de faillite de la banque émettrice du CLN. C\'est le risque de double signature ou Double Default.',
            en: 'The investor is exposed both to the risk of the reference entity defaulting, AND to the bankruptcy risk of the bank issuing the CLN. This is the double signature or Double Default risk.'
        },
        difficulty: 'moyen'
    }
];
