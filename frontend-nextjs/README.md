<div align="center">

# 🏗️ The Bridge — StructLab

**Master Equity Derivatives Structuring**

A comprehensive, interactive training platform for exotic equity structuring internships.  
Courses · Flashcards · Quizzes · Visualizations · AI Interviews · Brainteasers · Code Playground

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat&logo=vercel)](https://the-bridge-tau.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://typescriptlang.org)

</div>

---

## 🎯 What is The Bridge?

The Bridge is a full-stack learning app designed to prepare candidates for **equity derivatives structuring internships** at investment banks. It goes far beyond flashcards — it combines interactive theory, quantitative visualizations, AI-powered interview simulation, and a code playground into a single cohesive platform.

### Who is it for?

- Students applying for structuring desks (equity derivatives, exotic options)
- Anyone preparing for technical interviews in quantitative finance
- Self-learners who want a structured path through options pricing, Greeks, volatility, and structured products

---

## ✨ Features

| Feature | Description |
|---|---|
| 📚 **12 Course Modules** | From vanilla options to stochastic calculus, with LaTeX formulas and interactive code |
| 🃏 **Flashcards** | 147+ bilingual review cards with spaced repetition |
| ❓ **Quizzes** | Module-based quizzes with instant scoring and explanations |
| 🧩 **Brainteasers** | 1000+ logic puzzles with timer, hints, and AI-powered correction |
| 🏗️ **Case Structuration** | 17 real-world structuring cases with AI scoring |
| 📊 **2D Visualizations** | Interactive payoff diagrams for all option strategies |
| 🌐 **3D Visualizations** | Greeks and volatility surfaces in 3D |
| 🎲 **Monte Carlo** | Path simulator for GBM with customizable parameters |
| 🎤 **AI Interview** | Live voice conversation with an AI structuring recruiter (Groq Llama 3.3 70B) |
| 💻 **Code Playground** | Write and execute Python, C++, and JavaScript in-browser |
| 🏆 **Gamification** | XP, levels, daily streaks, and badges |
| 🌍 **Bilingual** | Full French and English support |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS with a custom glassmorphism design system
- **AI**: [Groq API](https://groq.com) (Llama 3.3 70B) for interviews, brainteaser correction, and case scoring
- **Code Execution**: [Pyodide](https://pyodide.org) (Python WASM), [Godbolt](https://godbolt.org) (C++), browser eval (JS)
- **Editor**: Monaco Editor (VS Code in the browser)
- **Charts**: Recharts, Three.js (3D)
- **Math**: KaTeX for LaTeX rendering
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Adrienjst/The-Bridge.git
cd The-Bridge
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com).

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (chat, code execution)
│   ├── cours/              # Course modules
│   ├── flashcards/         # Flashcard review
│   ├── quiz/               # Module quizzes
│   ├── brainteasers/       # Brainteaser collection + simulator
│   ├── case-structuration/ # Structuring case studies
│   ├── interview/          # AI interview (written + live oral)
│   ├── playground/         # Code sandbox
│   ├── visualisation/      # 2D payoff diagrams
│   ├── visualisation-3d/   # 3D Greeks/vol surfaces
│   ├── montecarlo/         # Monte Carlo simulator
│   └── strategies-paris/   # Betting strategies
├── components/             # Shared UI components
├── contexts/               # React contexts (Language, Progress)
└── data/                   # Static content (modules, flashcards, quizzes, exercises)
```

---

## 🎓 Learning Path

1. **Foundations** — Vanilla options, Greeks, volatility
2. **Exotics & Structuring** — Exotic options, structured products, barriers
3. **Quantitative** — Stochastic calculus, probability theory, Monte Carlo
4. **Code** — Python for pricing, C++ for performance
5. **Interview Prep** — AI interviews, brainteasers, case studies

---

## 📄 License

This project is for educational purposes. Built by [@Adrienjst](https://github.com/Adrienjst).
