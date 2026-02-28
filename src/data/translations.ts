import { Bilingual } from '@/contexts/LanguageContext';

export const ui: Record<string, Bilingual> = {
    // Navigation
    'nav.home': { fr: 'Accueil', en: 'Home' },
    'nav.courses': { fr: 'Cours', en: 'Courses' },
    'nav.flashcards': { fr: 'Flashcards', en: 'Flashcards' },
    'nav.quiz': { fr: 'Quiz', en: 'Quiz' },
    'nav.exercises': { fr: 'Exercices', en: 'Exercises' },
    'nav.viz2d': { fr: 'Visualisation 2D', en: '2D Visualization' },
    'nav.viz3d': { fr: 'Visualisation 3D', en: '3D Visualization' },
    'nav.interview': { fr: 'Entretien', en: 'Interview' },
    'nav.navigation': { fr: 'Navigation', en: 'Navigation' },
    'nav.equityExotics': { fr: 'Equity Exotiques', en: 'Equity Exotics' },
    'nav.structuredProducts': { fr: 'Produits Structurés', en: 'Structured Products' },

    // Landing page
    'landing.badge': { fr: '🎯 Préparation Stage Structuration', en: '🎯 Structuring Internship Prep' },
    'landing.title': { fr: 'Maîtrisez la Structuration de Produits', en: 'Master Product Structuring' },
    'landing.subtitle': {
        fr: 'Cours interactifs, flashcards, quiz et visualisations pour apprendre la structuration equity exotiques et vous préparer pour votre stage.',
        en: 'Interactive courses, flashcards, quizzes and visualizations to learn equity exotics structuring and prepare for your internship.'
    },
    'landing.cta.courses': { fr: 'Commencer les cours', en: 'Start learning' },
    'landing.cta.viz': { fr: 'Explorer les payoffs', en: 'Explore payoffs' },
    'landing.stats.modules': { fr: 'Modules de cours', en: 'Course modules' },
    'landing.stats.flashcards': { fr: 'Flashcards', en: 'Flashcards' },
    'landing.stats.quiz': { fr: 'Questions quiz', en: 'Quiz questions' },
    'landing.stats.exercises': { fr: 'Exercices guidés', en: 'Guided exercises' },
    'landing.tools': { fr: 'Outils d\'apprentissage', en: 'Learning tools' },
    'landing.modules': { fr: 'Parcours de formation', en: 'Learning path' },
    'landing.modulesComplete': { fr: 'modules complets', en: 'complete modules' },
    'landing.cardsReview': { fr: 'cartes de révision', en: 'review cards' },
    'landing.questions': { fr: 'questions', en: 'questions' },

    // Course page
    'course.title': { fr: 'Programme de Formation', en: 'Training Program' },
    'course.subtitle': {
        fr: 'Un parcours structuré pour maîtriser la structuration de produits equity, du fondamental au pricing avancé.',
        en: 'A structured program to master equity product structuring, from fundamentals to advanced pricing.'
    },
    'course.lessons': { fr: 'leçons', en: 'lessons' },
    'course.objectives': { fr: 'Objectifs', en: 'Objectives' },
    'course.start': { fr: 'Commencer', en: 'Start' },
    'course.continue': { fr: 'Continuer', en: 'Continue' },
    'course.beginner': { fr: 'Débutant', en: 'Beginner' },
    'course.intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
    'course.advanced': { fr: 'Avancé', en: 'Advanced' },

    // Module detail
    'module.contents': { fr: 'Contenu du module', en: 'Module contents' },
    'module.back': { fr: 'Retour aux cours', en: 'Back to courses' },
    'module.prev': { fr: 'Précédent', en: 'Previous' },
    'module.next': { fr: 'Suivant', en: 'Next' },
    'module.caseStudy': { fr: 'Étude de cas', en: 'Case Study' },

    // Flashcards
    'flash.title': { fr: 'Flashcards de Révision', en: 'Review Flashcards' },
    'flash.subtitle': {
        fr: 'Révisez les concepts clés avec des flashcards. Cliquez pour retourner la carte.',
        en: 'Review key concepts with flashcards. Click to flip the card.'
    },
    'flash.allModules': { fr: 'Tous les modules', en: 'All modules' },
    'flash.allLessons': { fr: 'Toutes les leçons', en: 'All lessons' },
    'flash.known': { fr: 'Je sais', en: 'I know' },
    'flash.unknown': { fr: 'À revoir', en: 'Review' },
    'flash.reset': { fr: 'Recommencer', en: 'Start over' },
    'flash.progress': { fr: 'Progression', en: 'Progress' },
    'flash.complete': { fr: 'Session terminée !', en: 'Session complete!' },
    'flash.knownCount': { fr: 'Connues', en: 'Known' },
    'flash.unknownCount': { fr: 'À revoir', en: 'To review' },
    'flash.filterByLesson': { fr: 'Filtrer par leçon', en: 'Filter by lesson' },

    // Quiz
    'quiz.title': { fr: 'Quiz d\'Évaluation', en: 'Assessment Quiz' },
    'quiz.subtitle': {
        fr: 'Testez vos connaissances avec des questions par module et par leçon.',
        en: 'Test your knowledge with questions by module and lesson.'
    },
    'quiz.allModules': { fr: 'Tous les modules', en: 'All modules' },
    'quiz.allLessons': { fr: 'Toutes les leçons', en: 'All lessons' },
    'quiz.start': { fr: 'Commencer le quiz', en: 'Start quiz' },
    'quiz.next': { fr: 'Question suivante', en: 'Next question' },
    'quiz.results': { fr: 'Résultats', en: 'Results' },
    'quiz.score': { fr: 'Score', en: 'Score' },
    'quiz.retry': { fr: 'Recommencer', en: 'Try again' },
    'quiz.correct': { fr: 'Correct !', en: 'Correct!' },
    'quiz.incorrect': { fr: 'Incorrect', en: 'Incorrect' },
    'quiz.explanation': { fr: 'Explication', en: 'Explanation' },
    'quiz.filterByLesson': { fr: 'Filtrer par leçon', en: 'Filter by lesson' },
    'quiz.questions': { fr: 'questions', en: 'questions' },

    // Exercises
    'ex.title': { fr: 'Exercices Guidés', en: 'Guided Exercises' },
    'ex.subtitle': {
        fr: 'Mettez en pratique vos connaissances avec des exercices pas-à-pas.',
        en: 'Put your knowledge into practice with step-by-step exercises.'
    },
    'ex.showHint': { fr: 'Afficher l\'indice', en: 'Show hint' },
    'ex.hideHint': { fr: 'Masquer l\'indice', en: 'Hide hint' },
    'ex.showSolution': { fr: 'Voir la solution', en: 'Show solution' },
    'ex.hideSolution': { fr: 'Masquer la solution', en: 'Hide solution' },
    'ex.step': { fr: 'Étape', en: 'Step' },

    // Visualization
    'viz.title2d': { fr: 'Visualisation des Payoffs', en: 'Payoff Visualization' },
    'viz.subtitle2d': {
        fr: 'Explorez les profils de payoff et P&L de différentes stratégies d\'options et produits structurés.',
        en: 'Explore payoff and P&L profiles of different option strategies and structured products.'
    },
    'viz.title3d': { fr: 'Surfaces de Volatilité & Greeks', en: 'Volatility & Greeks Surfaces' },
    'viz.subtitle3d': {
        fr: 'Explorez les surfaces 3D de volatilité et de Greeks en fonction du spot et du temps.',
        en: 'Explore 3D volatility and Greeks surfaces as a function of spot and time.'
    },
    'viz.strategy': { fr: 'Stratégie', en: 'Strategy' },
    'viz.parameters': { fr: 'Paramètres', en: 'Parameters' },
    'viz.strike': { fr: 'Strike', en: 'Strike' },
    'viz.premium': { fr: 'Prime', en: 'Premium' },
    'viz.barrier': { fr: 'Barrière', en: 'Barrier' },
    'viz.coupon': { fr: 'Coupon', en: 'Coupon' },
    'viz.surface': { fr: 'Surface', en: 'Surface' },

    // Common
    'common.difficulty': { fr: 'Difficulté', en: 'Difficulty' },
    'common.duration': { fr: 'Durée', en: 'Duration' },
    'common.easy': { fr: 'Facile', en: 'Easy' },
    'common.medium': { fr: 'Moyen', en: 'Medium' },
    'common.hard': { fr: 'Difficile', en: 'Hard' },
    'common.of': { fr: 'de', en: 'of' },
    'common.cards': { fr: 'cartes', en: 'cards' },

    // Language toggle
    'lang.switch': { fr: 'English', en: 'Français' },
    'lang.current': { fr: '🇫🇷 FR', en: '🇬🇧 EN' },
};
