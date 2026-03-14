---
description: Mega-copilot AI stack - frameworks, agents et outils à intégrer dans chaque réponse
---

# Mega-Copilot Stack

Ce workflow définit les principes et outils à appliquer **systématiquement** à chaque demande.

## Principes fondamentaux

1. **Raisonner en agents** : chaque tâche complexe doit être décomposée en sous-agents spécialisés (pattern crewAI/smolagents)
2. **Tool-use first** : privilégier l'appel d'outils (exécution de code, recherche web, manipulation de fichiers) plutôt que la génération pure de texte (pattern LangChain)
3. **RAG-aware** : quand un contexte documentaire existe (cours, papers, docs projet, notes), l'indexer et le requêter plutôt que tout mettre en prompt brut (pattern LlamaIndex)
4. **Workflow en graphe** : pour les tâches multi-étapes avec état, boucles ou branches, penser en state machine / graph (pattern LangGraph)
5. **Autonomie contrôlée** : planifier, exécuter, vérifier en boucle, avec checkpoints pour feedback utilisateur (pattern AutoGPT)
6. **Exécution locale** : manipuler fichiers, terminal, scripts, notebooks directement quand c'est pertinent (pattern Open Interpreter)
7. **Qualité dev intégrée** : valider le code, linter, tester, comme un vrai CI pipeline (pattern Continue)

## Repos de référence

| Repo | Usage |
|---|---|
| [LangChain](https://github.com/langchain-ai/langchain) | Framework agents & tools, chaînes LLM, compatible Gemini/OpenAI |
| [LangGraph](https://github.com/langchain-ai/langgraph) | Orchestration d'agents en graphes, workflows multi-étapes avec état |
| [LlamaIndex](https://github.com/run-llama/llama_index) | RAG, indexation de docs (PDF, Notion, Drive), query engines |
| [crewAI](https://github.com/crewAIInc/crewAI) | Multi-agents collaboratifs avec rôles (researcher, coder, reviewer) |
| [smolagents](https://github.com/huggingface/smolagents) | Agents code-first, minimalistes, overhead réduit |
| [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | Patterns d'agents autonomes, planification de tâches longues |
| [Open WebUI](https://github.com/open-webui/open-webui) | UI multi-LLM avec plugins, RAG intégré, historisation |
| [Open Interpreter](https://github.com/openinterpreter/open-interpreter) | Exécution de code & contrôle machine en langage naturel |
| [Continue](https://github.com/continuedev/continue) | Copilote dev, checks IA en CI, validation de code |

## Comment appliquer à chaque demande

### Phase 1 — Analyse (LangChain + LlamaIndex)
- Identifier les tools/APIs nécessaires
- Vérifier s'il y a du contexte documentaire à requêter (RAG)
- Choisir le bon modèle/approche selon la tâche

### Phase 2 — Planification (LangGraph + AutoGPT)
- Décomposer en sous-tâches avec dépendances
- Identifier les boucles, branches, conditions d'arrêt
- Définir les checkpoints utilisateur

### Phase 3 — Exécution (crewAI + smolagents + Open Interpreter)
- Assigner des rôles spécialisés si multi-aspects (code, recherche, review)
- Exécuter du code directement quand pertinent
- Itérer avec feedback

### Phase 4 — Vérification (Continue)
- Valider le code (lint, types, tests)
- Vérifier la cohérence avec l'existant
- Documenter les changements

## Use-cases prioritaires de l'utilisateur

- **Equity structuring / fintech** : formation, simulation, quant
- **Dev full-stack** : Next.js, TypeScript, React
- **Productivité** : automatisation, docs, workflows
