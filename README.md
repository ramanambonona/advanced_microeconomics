# Advanced Microeconomics Solver — Frontend

Interface web pour le solveur symbolique d'optimisation microéconomique.

## 🌐 Démo en ligne
[https://advanced-microeconomics-solver.vercel.app](https://advanced-microeconomics-solver.vercel.app)

## 📦 Modules
- **Statique** — Demandes Marshalliennes & Hicksiennes (n biens)
- **Dynamique** — Optimisation intertemporelle (horizon fini/infini)
- **Stochastique** — Processus Markoviens, Monte Carlo

## 🔧 Technologies
- HTML5 / CSS3 / JavaScript ES6+
- Tailwind CSS (CDN)
- MathJax 3.2.2
- Feather Icons

## 🔗 Backend API
Le frontend communique avec l'API FastAPI déployée sur Render :
`https://advanced-microeconomics-solver-backend.onrender.com`

## 🚀 Déploiement
Ce projet est déployé automatiquement sur **Vercel** à chaque push sur la branche `main`.

## 📁 Structure
```
├── index.html          # Page d'accueil
├── static.html         # Module Statique
├── dynamic.html        # Module Dynamique
├── stochastic.html     # Module Stochastique
├── documentation.html  # Documentation
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── static.js
│   │   ├── dynamic.js
│   │   ├── stochastic.js
│   │   └── documentation.js
│   └── images/
│       ├── logo.png
│       ├── logo.mp4
│       └── logo.webm
└── vercel.json         # Config Vercel
```

## 👤 Auteur
**Ramanambonona Ambinintsoa, PhD**
- GitHub: [@ramanambonona](https://github.com/ramanambonona)
- LinkedIn: [ambinintsoa-ramanambonona](https://linkedin.com/in/ambinintsoa-ramanambonona)
