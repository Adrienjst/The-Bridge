"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module6 = void 0;
exports.module6 = {
    id: 'fixed-income-credit',
    number: 6,
    title: {
        fr: 'Fixed Income & Risque de Crédit',
        en: 'Fixed Income & Credit Risk'
    },
    subtitle: {
        fr: 'Taux, obligations et dérivés de crédit',
        en: 'Rates, bonds, and credit derivatives'
    },
    description: {
        fr: 'Comprendre la courbe des taux, l\'inflation, et comment le risque de crédit est pricé et structuré via les CDS et les CLN.',
        en: 'Understand the yield curve, inflation, and how credit risk is priced and structured via CDS and CLNs.'
    },
    difficulty: 'intermédiaire',
    duration: {
        fr: '2 heures',
        en: '2 hours'
    },
    icon: '🏛️',
    color: 'from-amber-600 to-yellow-500',
    objectives: [
        {
            fr: 'Comprendre la construction d\'une courbe des taux et la différence entre taux nominaux et réels.',
            en: 'Understand yield curve construction and the difference between nominal and real rates.'
        },
        {
            fr: 'Identifier et quantifier le risque de crédit (Probabilité de défaut, LGD, Spread).',
            en: 'Identify and quantify credit risk (Probability of Default, LGD, Spread).'
        },
        {
            fr: 'Maîtriser le fonctionnement des CDS (Credit Default Swaps) et des CLN (Credit Linked Notes).',
            en: 'Master the mechanics of CDS (Credit Default Swaps) and CLN (Credit Linked Notes).'
        }
    ],
    lessons: [
        {
            id: 'taux-interet-inflation',
            title: {
                fr: 'Taux d\'Intérêt et Inflation',
                en: 'Interest Rates and Inflation'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Le marché du Fixed Income est fondamentalement lié aux problématiques de dette. Les taux d\'intérêt représentent le loyer de l\'argent pour une devise et une maturité données. Ils incluent généralement une primre de risque de crédit, sauf pour les taux dits "sans risque" (ex: OIS, ESTER, Fed Funds).',
                        en: 'The Fixed Income market is fundamentally linked to debt issues. Interest rates represent the cost of money for a given currency and maturity. They typically include a credit risk premium, except for so-called "risk-free" rates (e.g., OIS, ESTER, Fed Funds).'
                    }
                },
                {
                    type: 'formula',
                    body: {
                        fr: 'La dimension structurelle clé est la **relation de Fisher**, liant les taux nominaux ($r$), les taux réels ($r_{reel}$) et les anticipations d\'inflation ($i$) :\n\n$$1 + r = (1 + r_{reel})(1 + i)$$',
                        en: 'The key structural dimension is the **Fisher equation**, linking nominal rates ($r$), real rates ($r_{reel}$), and inflation expectations ($i$):\n\n$$1 + r = (1 + r_{reel})(1 + i)$$'
                    }
                },
                {
                    type: 'text',
                    body: {
                        fr: 'En approximation continue (ou pour des taux faibles), on écrit souvent :\n$r \\approx r_{reel} + i$\n\nLes produits sur inflation (comme les OATi en France) permettent aux investisseurs de se couvrir contre l\'inflation en percevant un rendement indexé sur l\'Indice des Prix à la Consommation (IPC).',
                        en: 'In continuous approximation (or for low rates), we often write:\n$r \\approx r_{reel} + i$\n\nInflation-linked products (like OATi in France) allow investors to hedge against inflation by receiving a yield pegged to the Consumer Price Index (CPI).'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Courbe des Taux (Yield Curve)',
                        en: 'Yield Curve'
                    },
                    body: {
                        fr: 'La courbe des taux représente les rendements d\'obligations de même qualité de crédit (généralement souveraines) pour différentes maturités. Une courbe "normale" est ascendante, reflétant une prime de liquidité pour bloquer son argent plus longtemps. Une courbe "inversée" (taux courts > taux longs) est souvent vue comme un indicateur avancé de récession.',
                        en: 'The yield curve plots the yields of bonds with the same credit quality (usually sovereign) across different maturities. A "normal" curve is upward sloping, reflecting a liquidity premium for locking up money longer. An "inverted" curve (short rates > long rates) is often seen as a leading indicator of recession.'
                    }
                }
            ]
        },
        {
            id: 'risque-credit',
            title: {
                fr: 'Le Risque de Crédit',
                en: 'Credit Risk'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Le risque de crédit est le risque qu\'une entité subisse un **Credit Event** (événement de crédit). Pour les entreprises, cela inclut le défaut de paiement (Failure to pay), la faillite (Bankruptcy), et la restructuration (Restructuring).',
                        en: 'Credit risk is the risk that an entity experiences a **Credit Event**. For corporations, this includes Failure to pay, Bankruptcy, and Restructuring.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Paramètres du Risque de Crédit',
                        en: 'Credit Risk Parameters'
                    },
                    body: {
                        fr: 'Le risque de crédit est paramétré par :\n- **Probabilité de Défaut (PD)** : La probabilité que l\'émetteur fasse défaut avant maturité.\n- **Loss Given Default (LGD)** : La perte subie en cas de défaut. Elle est liée au Taux de Recouvrement (Recovery Rate, $R$) par la relation : $\\text{LGD} = 1 - R$.',
                        en: 'Credit risk is parameterized by:\n- **Probability of Default (PD)**: The probability that the issuer defaults before maturity.\n- **Loss Given Default (LGD)**: The expected loss if a default occurs. It is related to the Recovery Rate ($R$) by: $\\text{LGD} = 1 - R$.'
                    }
                },
                {
                    type: 'formula',
                    title: {
                        fr: 'Le Credit Spread (z-spread)',
                        en: 'Credit Spread (z-spread)'
                    },
                    body: {
                        fr: 'Le rendement d\'une obligation corporate ($y$) est composé du taux sans risque ($r_f$) et d\'un écart de crédit (**Spread**, $s$) :\n\n$$y = r_f + s$$\n\nEn première approximation, le spread $s$ rémunère la perte attendue (Expected Loss, EL) :\n\n$$s \\approx \\text{PD} \\times \\text{LGD} = \\text{PD} \\times (1 - R)$$',
                        en: 'The yield of a corporate bond ($y$) is composed of the risk-free rate ($r_f$) and a credit spread ($s$):\n\n$$y = r_f + s$$\n\nAs a first approximation, the spread $s$ compensates for the Expected Loss (EL):\n\n$$s \\approx \\text{PD} \\times \\text{LGD} = \\text{PD} \\times (1 - R)$$'
                    }
                },
                {
                    type: 'case-study',
                    title: {
                        fr: 'Analyse Qualitative : Les Agences de Notation',
                        en: 'Qualitative Analysis: Rating Agencies'
                    },
                    body: {
                        fr: 'Le risque de crédit est qualifié par des notes émises par S&P, Moody\'s, et Fitch. On distingue deux grandes catégories :\n- **Investment Grade (IG)** : Notes de AAA à BBB-. Instruments jugés sûrs, éligibles par la plupart des fonds institutionnels.\n- **High Yield (HY) / Cross-Over** : Notes en dessous de BBB- (BB, B, etc). Instruments spéculatifs avec un spread beaucoup plus élevé.',
                        en: 'Credit risk is qualified by ratings issued by S&P, Moody\'s, and Fitch. There are two main categories:\n- **Investment Grade (IG)**: Ratings from AAA to BBB-. Safe instruments, eligible for most institutional funds.\n- **High Yield (HY) / Cross-Over**: Ratings below BBB- (BB, B, etc). Speculative instruments with a much higher spread.'
                    }
                }
            ]
        },
        {
            id: 'derives-de-credit',
            title: {
                fr: 'Dérivés de Crédit (CDS & CLN)',
                en: 'Credit Derivatives (CDS & CLN)'
            },
            content: [
                {
                    type: 'text',
                    body: {
                        fr: 'Les dérivés de crédit permettent d\'isoler et d\'échanger le risque de crédit pur, sans avoir à détenir l\'obligation physique.',
                        en: 'Credit derivatives allow for the isolation and trading of pure credit risk without having to hold the physical bond.'
                    }
                },
                {
                    type: 'key-concept',
                    title: {
                        fr: 'Le Credit Default Swap (CDS)',
                        en: 'Credit Default Swap (CDS)'
                    },
                    body: {
                        fr: 'Un CDS est un contrat d\'assurance contre le défaut d\'une entité de référence. \n- L\'acheteur de protection paie une prime régulière (le spread du CDS, ex: 100 bps par an) au vendeur.\n- Si un Credit Event survient, le vendeur de protection compense l\'acheteur pour la perte de valeur faciale : paiement de $(1 - R) \\times \\text{Notionnel}$.',
                        en: 'A CDS is an insurance contract against the default of a reference entity.\n- The protection buyer pays a regular premium (the CDS spread, e.g., 100 bps per year) to the seller.\n- If a Credit Event occurs, the protection seller compensates the buyer for the loss of face value: payout of $(1 - R) \\times \\text{Notional}$.'
                    }
                },
                {
                    type: 'diagram',
                    body: {
                        fr: 'Flux d\'un CDS (Acheteur = Couverture, Vendeur = Prise de risque) :\n\n| Temps | Acheteur de Protection | Vendeur de Protection |\n|-------|------------------------|-----------------------|\n| $t < t_{defaut}$ | Paie la prime $s$ | Reçoit la prime $s$ |\n| $t = t_{defaut}$ | Reçoit $(1-R)\\times N$ | Paie $(1-R)\\times N$ |',
                        en: 'CDS Cashflows (Buyer = Hedging, Seller = Risk-taking):\n\n| Time | Protection Buyer | Protection Seller |\n|-------|------------------|-------------------|\n| $t < t_{default}$ | Pays premium $s$ | Receives premium $s$ |\n| $t = t_{default}$ | Receives $(1-R)\\times N$ | Pays $(1-R)\\times N$ |'
                    }
                },
                {
                    type: 'text',
                    body: {
                        fr: 'Le **Credit Linked Note (CLN)** est la titrisation d\'un CDS. C\'est une obligation émise généralement par une banque, dont le remboursement du principal dépend du non-défaut d\'une entité tierce (Reference Entity).\nL\'investisseur qui achète un CLN agit comme *Vendeur de Protection*. En échange du risque pris sur la probabilité de défaut de l\'entité de référence, il reçoit un coupon bonifié : $r_f + s_{CDS}$.',
                        en: 'The **Credit Linked Note (CLN)** is the securitization of a CDS. It is a bond usually issued by a bank, whose principal repayment is contingent on the non-default of a third party (Reference Entity).\nThe investor buying a CLN acts as the *Protection Seller*. In exchange for taking the risk of the reference entity defaulting, they receive an enhanced coupon: $r_f + s_{CDS}$.'
                    }
                },
                {
                    type: 'warning',
                    title: {
                        fr: 'Double Risque (Double Default Risk)',
                        en: 'Double Default Risk'
                    },
                    body: {
                        fr: 'Dans un CLN, l\'investisseur est exposé à deux risques de crédit simultanés : le risque de la **Reference Entity** cibée par la structure, ET le risque de crédit de l\'**Emetteur du CLN** (Issuer Risk). Si la banque émettrice fait faillite, l\'investisseur peut perdre sa mise même si l\'entité de référence se porte bien.',
                        en: 'In a CLN, the investor is exposed to two simultaneous credit risks: the risk of the targeted **Reference Entity**, AND the credit risk of the **CLN Issuer** (Issuer Risk). If the issuing bank goes bankrupt, the investor can lose their money even if the reference entity is perfectly healthy.'
                    }
                },
                {
                    type: 'example',
                    title: {
                        fr: 'Exemple de CLN',
                        en: 'Example of CLN'
                    },
                    body: {
                        fr: 'Maturité: 5 ans\nEmetteur: BNP Paribas\nReference Entity: Renault SA\nCoupon: Euribor 3M + 150 bps (le spread de CDS Renault)\nCapital à maturité: 100% si aucun Credit Event sur Renault. S\'il y a défaut de Renault en année 3, le CLN est remboursé anticipativement avec une décote égale au Loss Given Default de Renault, et les coupons s\'arrêtent.',
                        en: 'Maturity: 5 years\nIssuer: BNP Paribas\nReference Entity: Renault SA\nCoupon: Euribor 3M + 150 bps (the Renault CDS spread)\nCapital at maturity: 100% if no Credit Event on Renault. If Renault defaults in year 3, the CLN is redeemed early with a haircut equal to the Loss Given Default of Renault, and coupons stop.'
                    }
                }
            ]
        }
    ]
};
