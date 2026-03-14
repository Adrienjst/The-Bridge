# Roadmap gratuit pour apprendre la structuration de produits (equity exotiques)

## Vue d’ensemble

La structuration de produits, surtout sur dérivés actions, repose sur trois blocs : dérivés vanille (options, futures, swaps), produits structurés standards (autocall, reverse convertible, capital garanti, etc.) et enfin organisation/pricing d’un desk de structuration. L’objectif de ce plan est de te donner, en 8–12 semaines à 8–15h/semaine, un parcours 100 % en ligne (FR/EN, majoritairement gratuit) qui te rende crédible pour un stage en structuration equity exotiques.[^1][^2]

## Pré‑requis à consolider

Avant d’attaquer la structuration, il te faut :

- Bases solides en dérivés vanille : options (call/put, payoff, P&L), futures, forwards et swaps, plus le lien avec couverture et spéculation.[^3][^1]
- Notions de pricing : logique de non‑arbitrage, modèle de Black‑Scholes en high level, rôle de la volatilité implicite et de la courbe de taux.[^3][^1]
- Math de base : proba, statistiques, calcul différentiel (pour comprendre les greeks), mais tu peux progresser en parallèle.

## Étape 1 – Bases en dérivés (FR/EN, 2–3 semaines)

Pour passer de « notions de base » à un vrai socle dérivés.

- Parcours MOOC « Derivatives » sur Coursera ou équivalent (audit gratuit) pour revoir types de dérivés, pricing simple, gestion du risque.[^1]
- Cours PDF « Produits dérivés » en français pour avoir les notations/formules en FR (par ex. poly de cours sur options/futures/swaps).[^4]
- Lecture ciblée d’un cours « Equity Derivatives » (syllabus Columbia/NYU) pour voir le scope d’un cours de marché actions dérivés : options, futures, ETF, structured notes, convertibles, CDS.[^5][^6]

Objectif : être à l’aise pour calculer à la main le payoff d’un call, put, forward, swap simple, et expliquer à l’oral à quoi sert chaque instrument.[^1]

## Étape 2 – Comprendre les produits structurés standards

Tu dois ensuite comprendre ce qu’est un produit structuré côté client et côté banque.

- Structured Products Academy (SRP) : modules gratuits d’introduction sur « What are structured products », typologie des produits (capital protection, participation, yield enhancement, autocallables, etc.) et mécanismes de base.[^7][^2]
- Handbook BNP Paribas Structured Products (PDF) : excellent handbook marketing/technique qui présente la définition d’un produit structuré, la logique « obligation (zéro‑coupon) + option », les sous‑jacents possibles et des exemples de structures.[^8][^9]
- Webinar SRP × Derivatives Academy « Introduction to Structured Products » (YouTube) : explication step‑by‑step de la décomposition funding + options, capital garanti vs yield enhancement, exemples d’autocall, risques (crédit émetteur, marché, liquidité).[^10][^7]

Objectif : être capable de dessiner le payoff d’un autocall ou reverse convertible, d’expliquer « zero‑coupon + call » pour un capital garanti, et de décrire les principaux risques.

## Étape 3 – Aller vers la structuration equity exotiques

Une fois la logique générale des structurés comprise, tu attaques les briques plus techniques de structuration.

- Cours en ligne "Produits structurés" (ESCP / First Finance) : même si la certification complète est payante, les descriptifs de chapitres donnent une excellente checklist des compétences : volatilité et smile, options exotiques (barrières, digitales, asian, basket), véhicules juridiques (EMTN, programmes), funding, méthodologie de construction des structurés, rôle des équipes sell‑side.[^11]
- Syllabus « Derivatives Structuring and Financing » (NYU) pour voir comment un cours de structuration est organisé : application des dérivés (FX, taux, equity, commodities) pour fabriquer des structures répondant à des besoins de couverture ou de placement.[^6]
- Lecture sélective de handbooks sur structured products/structured finance (chapitres gratuits ou PDF accessibles) pour voir le langage pro et les cas pratiques (credit‑linked notes, CDO, etc.), même si tu restes concentré sur l’equity.[^12][^13]

Objectif : comprendre comment un structureur part d’un besoin client (protection du capital, rendement cible, vue de marché) et choisit sous‑jacents, options (vanille/exotiques), maturité, barrières, coupons pour construire le payoff.

## Étape 4 – Approfondir les payoffs et familles de produits

À ce stade, tu veux maîtriser les grandes familles de payoffs et leur logique de risk‑return.

- Série d’articles SRP Academy « What are structured products » : classification des produits par objectif (capital protection, participation, yield enhancement, leverage) et par type de payoff (autocall, digital, range, capped/uncapped growth, etc.) avec exemples concrets.[^2][^7]
- BNP Handbook : chapitres sur les sous‑jacents (actions, indices, commodities, hybrid) et les structures typiques, avec focus sur comment la combinaison obligation + dérivé donne différentes courbes de payoff.[^9][^8]

Travail actif recommandé :

- Pour chaque famille (autocall, reverse convertible, PHOENIX, step‑down, digital, range, etc.), dessine le payoff en fonction de l’underlying à maturité (et aux dates d’observation pour autocall) et écris la décomposition en options (calls/puts, barrières, digitals).
- Essaie de relier chaque produit au besoin client typique (recherche de rendement dans marché range‑bound, protection partielle, vue modérément haussière, etc.).[^2]

## Étape 5 – Pricing simplifié et greeks appliqués au structuré

Même sans implémenter un pricer complet, il est crucial de comprendre la logique pricing/risk management.

- Use cases dans le cours ESCP/First Finance : application des greeks à l’analyse de sensibilité des structurés (delta, gamma, vega, theta), lecture de smiles et skews de volatilité, lien entre coût de la protection et formes de payoff.[^11]
- Articles/chapitres d’intro sur options exotiques et structuration des barrières (barrier options, digital, asian, basket) pour comprendre comment elles entrent dans les produits structurés equity.[^11]

Exercices possibles (Excel/Python) :

- Reprends la décomposition zéro‑coupon + call pour un capital garanti : calcule combien tu peux mettre dans l’option pour un niveau de protection donné, à partir d’un taux sans risque et d’une vol implicite (même approximative).[^2]
- Pour un autocall simple sur indice (maturity 3–5 ans, coupons conditionnels, barrière de protection), écris la structure sous forme de combinaison d’options (call avec autocall, short put down‑and‑in, etc.) et discute l’impact d’une hausse de volatilité ou d’un changement de corrélation.

## Ressources gratuites clés (FR/EN)

Voici un noyau dur de ressources que tu peux exploiter à fond :

| Type | Ressource | Langue | Intérêt principal |
|------|-----------|--------|-------------------|
| Article/Academy | SRP Structured Products Academy (site) | EN | Définitions, typologie des produits, exemples de payoffs, vision marché.[^7][^2] |
| Handbook banque | BNP Paribas Structured Products Handbook (PDF) | EN | Décomposition zéro‑coupon + option, panorama des sous‑jacents et structures usuelles.[^9][^8] |
| Webinar | SRP × Derivatives Academy – Introduction to Structured Products (YouTube) | EN | Présentation pédagogique de la mécanique des produits, funding vs performance, risques.[^10] |
| MOOC dérivés | Cours « Derivatives » (Coursera, audit gratuit) | EN | Consolidation des bases options/futures/swaps, pricing simple, risk management.[^1] |
| Cours FR dérivés | Poly/notes « Produits dérivés » en PDF | FR | Notions en français sur options, futures, swaps, CDS, utile pour vocabulaire FR.[^4] |
| Online course | "Produits structurés" – Finance de marché@ESCP (First Finance) – description de programme | FR | Check‑list détaillée des thèmes : volatilité, exotiques, EMTN, funding, méthodologie de structuration.[^11] |
| Syllabus structuring | Derivatives Structuring and Financing (NYU) | EN | Vision académique complète du métier de structuration et de l’usage des dérivés.[^6] |

## Plan de travail 8–12 semaines (8–15h/semaine)

### Semaines 1–3 : Bases dérivés et vocabulaire

- Revoir options/futures/swaps via MOOC Coursera (ou équivalent) + poly FR.[^4][^1]
- Exercices de payoff (papier/Excel) : tracer P&L de stratégies simples (covered call, protective put, collar) pour bien fixer l’intuition.

### Semaines 4–6 : Découverte approfondie des structurés

- Lire intégralement le BNP Handbook (sections introduction, underlyings, exemples de produits, wrappers).[^8][^9]
- Suivre le webinar SRP et parcourir SRP Academy (articles sur capital protection, autocall, digital, range, etc.).[^10][^7][^2]
- Pour chaque type de produit, dessiner payoff + écrire la décomposition en dérivés.

### Semaines 7–9 : Structuration equity exotiques

- S’inspirer du programme ESCP (volatilité, options exotiques, construction des structurés) comme checklist ; chercher sur le web chaque notion non maîtrisée (barrier options, Asians, baskets, etc.).[^11]
- Lire le syllabus NYU Structuring pour voir comment on relie besoins clients, dérivés exotiques et montages de financement.[^6]
- Commencer un petit notebook Python/Excel pour simuler des payoffs d’autocall simples et voir l’impact des paramètres (spot, vol, corrélation, barrière).

### Semaines 10–12 : Mise en forme pour le stage

- Préparer 2–3 fiches produits (en FR et EN) : par exemple un autocall equity, un reverse convertible, un capital garanti, avec : description client, payoff, décomposition, risques, scénario de marché.[^2]
- Travailler ton pitch : être capable en 3–4 minutes d’expliquer « qu’est‑ce qu’un produit structuré ? », « comment on fabrique un autocall ? », « quels sont les risques principaux ? » en FR et en EN.[^7][^9]

## Comment te différencier pour un stage

- Projet perso : construire un mini « handbook » de 10–15 pages où tu synthétises les principaux produits (avec graphiques payoffs). Tu peux t’inspirer de la structure du handbook BNP, mais en plus concis.[^9][^8]
- Portfolio Github/Notion : partager un notebook Python qui calcule et trace des payoffs d’autocall et de capital garanti basique, même avec des hypothèses simplifiées.
- Veille marché : suivre SRP (news, Academy) pour être au courant des tendances récentes sur les structurés (volatilité, réglementation, types de produits qui se vendent).[^7]

Avec ce plan, en 2–3 mois sérieux, tu peux te positionner comme étudiant déjà bien exposé aux payoffs, à la logique de construction, au vocabulaire FR/EN et à la vision client, ce qui est exactement ce que les équipes de structuration equity exotiques recherchent chez un stagiaire.

---

## References

1. [Best Derivatives Courses & Certificates [2026] - Coursera](https://www.coursera.org/courses?query=derivatives) - Derivatives courses can help you learn pricing models, risk management techniques, and the valuation...

2. [What are structured products | Academy | SRP](https://www.structuredretailproducts.com/srp-academy/what-are-structured-products) - Structured products represent an add-on to classic investments such as stocks or bonds. They provide...

3. [Introduction to Structured Products Training Course](https://www.nobleprog.com/cc/ibsp) - Introduction to Structured ProductsThe purpose of the course is to provide delegates with an introdu...

4. [Cours Produits Dérivés | PDF | Option (Finance)](https://fr.scribd.com/document/944569601/Cours-Produits-Derives) - Le document présente un cours sur les évaluations de produits dérivés, couvrant les marchés financie...

5. [Equity Derivatives | Courses](https://courses.business.columbia.edu/B8384)

6. [[PDF] Derivatives Structuring and Financing FRE-GY6981 Part 1 ...](https://engineering.nyu.edu/sites/default/files/2022-09/STRUCTURING_SYLLABUS_Fall_2022_Part1__Prof_Dehnad_PDF_v1.pdf) - Structuring can help in devising structures and instruments that reflect these views- structured not...

7. [Structured Products Academy - SRP](https://www.structuredretailproducts.com/srp-academy) - Structured products information and guidance to understand how structured products work, terminology...

8. [Layout 1 - sp_handbook](https://bpb-us-w2.wpmucdn.com/sites.udel.edu/dist/e/1233/files/2014/06/BNPParibas-Structured-Product-Handbook-rprdsv.pdf)

9. [[PDF] Structured Products](https://globalmarkets.bnpparibas.com/gm/equityderivatives/images/sp_handbook.pdf) - BNP PARIBAS EQUITIES & DERIVATIVES STRUCTURED PRODUCTS HANDBOOK. → Asia. (excluding Japan). Telephon...

10. [SRP Webinar: Introduction to Structured Products - YouTube](https://www.youtube.com/watch?v=Itib1cJK1FI) - Introduction to structured products, in partnership with the Derivatives ... Financial Derivatives -...

11. [Produits structurés - (Online Course Finance de marché@ESCP ...](https://www.first-finance.fr/catalogue/produits-structures/) - Comprenez la conception, le pricing et les risques des produits structurés : capital garanti, effet ...

12. [The Handbook Of Structured Finance / Arnaud de Servigny,Norbert Jobst (PDF) elearning.ndu.edu.ng](https://elearning.ndu.edu.ng/content/Resources/Documents/The_Handbook_Of_Structured_Finance.pdf)

13. [[PDF] How to Invest in Structured Products - NIBM E-Library Portal](https://nibmehub.com/opac-service/pdf/read/How%20to%20Invest%20in%20Structured%20Products%20_%20a%20guide%20for%20investors%20and%20asset%20managers.pdf) - Designations used by companies to distinguish their products are often claimed as trademarks. All br...

