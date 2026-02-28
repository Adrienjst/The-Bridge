import { Flashcard } from '../types';

export const module6Flashcards: Flashcard[] = [
    {
        id: 'f6-1',
        moduleId: 'fixed-income-credit',
        lessonId: 'taux-interet-inflation',
        question: {
            fr: 'Quelle est la relation de Fisher entre taux nominaux ($r$), réels ($r_{reel}$) et inflation ($i$) ?',
            en: 'What is the Fisher equation linking nominal rates ($r$), real rates ($r_{reel}$), and inflation ($i$)?'
        },
        answer: {
            fr: 'La dimension structurelle est donnée par : $1 + r = (1 + r_{reel})(1 + i)$. En approximation : $r \\approx r_{reel} + i$.',
            en: 'The structural relation is: $1 + r = (1 + r_{reel})(1 + i)$. As an approximation: $r \\approx r_{reel} + i$.'
        },
        difficulty: 'facile'
    },
    {
        id: 'f6-2',
        moduleId: 'fixed-income-credit',
        lessonId: 'taux-interet-inflation',
        question: {
            fr: 'Qu\'est-ce que la courbe des taux (Yield Curve) ?',
            en: 'What is the Yield Curve?'
        },
        answer: {
            fr: 'Elle représente les rendements d\'obligations de même qualité de crédit pour différentes maturités. Une courbe inversée indique souvent une récession future.',
            en: 'It plots the yields of bonds with the same credit quality across different maturities. An inverted curve often indicates a future recession.'
        },
        difficulty: 'facile'
    },
    {
        id: 'f6-3',
        moduleId: 'fixed-income-credit',
        lessonId: 'risque-credit',
        question: {
            fr: 'Définir la Loss Given Default (LGD).',
            en: 'Define Loss Given Default (LGD).'
        },
        answer: {
            fr: 'C\'est la perte subie par l\'investisseur en cas de défaut. Elle est liée au Taux de Recouvrement (Recovery Rate, $R$) par $\\text{LGD} = 1 - R$.',
            en: 'It is the loss incurred by the investor in the event of default. It is related to the Recovery Rate ($R$) by $\\text{LGD} = 1 - R$.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f6-4',
        moduleId: 'fixed-income-credit',
        lessonId: 'risque-credit',
        question: {
            fr: 'Comment estime-t-on le spread de crédit ($s$) en fonction de la Probabilité de Défaut (PD) et de la LGD ?',
            en: 'How do you estimate the credit spread ($s$) as a function of the Probability of Default (PD) and LGD?'
        },
        answer: {
            fr: 'En première approximation, le spread compense la perte attendue : $s \\approx \\text{PD} \\times \\text{LGD}$.',
            en: 'As a first approximation, the spread compensates the expected loss: $s \\approx \\text{PD} \\times \\text{LGD}$.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f6-5',
        moduleId: 'fixed-income-credit',
        lessonId: 'risque-credit',
        question: {
            fr: 'Quelle est la différence entre les notations Investment Grade (IG) et High Yield (HY) ?',
            en: 'What is the difference between Investment Grade (IG) and High Yield (HY) ratings?'
        },
        answer: {
            fr: 'IG correspond aux notes allant de AAA à BBB- (moins risqué). HY correspond aux notes en dessous de BBB- (plus risqué, spreads plus élevés).',
            en: 'IG corresponds to ratings from AAA to BBB- (lower risk). HY corresponds to ratings below BBB- (higher risk, wider spreads).'
        },
        difficulty: 'facile'
    },
    {
        id: 'f6-6',
        moduleId: 'fixed-income-credit',
        lessonId: 'derives-de-credit',
        question: {
            fr: 'Quel est le rôle du vendeur de protection dans un Credit Default Swap (CDS) ?',
            en: 'What is the role of the protection seller in a Credit Default Swap (CDS)?'
        },
        answer: {
            fr: 'Il perçoit une prime régulière et, en cas de défaut de l\'entité de référence, doit indemniser l\'acheteur de protection à hauteur de la perte de valeur faciale : $(1 - R) \\times N$.',
            en: 'They receive a regular premium and, in the event of default by the reference entity, must compensate the protection buyer for the loss in face value: $(1 - R) \\times N$.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f6-7',
        moduleId: 'fixed-income-credit',
        lessonId: 'derives-de-credit',
        question: {
            fr: 'Qu\'est-ce qu\'un Credit Linked Note (CLN) ?',
            en: 'What is a Credit Linked Note (CLN)?'
        },
        answer: {
            fr: 'Une obligation émise généralement par une banque, dont le remboursement dépend du non-défaut d\'une entité de référence. C\'est la titrisation d\'un CDS où l\'investisseur est vendeur de protection.',
            en: 'A bond usually issued by a bank, whose repayment depends on the non-default of a reference entity. It is the securitization of a CDS where the investor acts as the protection seller.'
        },
        difficulty: 'moyen'
    },
    {
        id: 'f6-8',
        moduleId: 'fixed-income-credit',
        lessonId: 'derives-de-credit',
        question: {
            fr: 'Qu\'est-ce que le risque de Double Défaut (Double Default Risk) dans un CLN ?',
            en: 'What is Double Default Risk in a CLN?'
        },
        answer: {
            fr: 'L\'investisseur est exposé à la fois au risque de crédit de l\'entité de référence ET au risque de crédit de la banque émettrice du billet.',
            en: 'The investor is exposed to both the credit risk of the reference entity AND the credit risk of the bank issuing the note.'
        },
        difficulty: 'moyen'
    }
];
