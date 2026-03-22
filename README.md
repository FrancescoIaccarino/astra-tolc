# ASTRA TOLC — Preparazione Test Universitari

> *Per Aspera, ad Astra* — ASTRA Bocconi Students' Association

Piattaforma di preparazione ai test TOLC con quiz AI, flashcard, mappe di studio e risorse curate.

## ✨ Features

- 🎯 **Quiz AI simulate** — 30 domande generate da Claude AI per ogni TOLC (MED, PSI, E, I, SU, B, F)
- ⏱ **Timer reale** — identico alla struttura ufficiale CISIA con penalità −0.25
- 🃏 **Flashcard animate** — concetti chiave con flip 3D per argomento
- 🗺 **Mappa di Studio** — syllabus ufficiale CISIA organizzato ad accordion
- 🔗 **Risorse curate** — piattaforme verificate (CISIA, TestBuddy, Khan Academy, ecc.)
- 🧭 **Orientamento universitario** — guida alla scelta del TOLC giusto
- 📋 **Guida pratica** — step by step dalla registrazione CISIA al giorno del test

## 🚀 Setup locale

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il server di sviluppo
npm run dev

# 3. Build per produzione
npm run build
```

## 🌐 Deploy su Vercel

### Opzione A — GitHub + Vercel (raccomandato)

1. Crea un repository su [github.com/new](https://github.com/new)
2. Push del codice:
   ```bash
   git init
   git add .
   git commit -m "feat: ASTRA TOLC platform"
   git remote add origin https://github.com/TUO_USERNAME/astra-tolc.git
   git push -u origin main
   ```
3. Vai su [vercel.com](https://vercel.com) → **Add New Project**
4. Importa il repository GitHub → **Deploy**
5. Vercel rileverà automaticamente Vite e configurerà il build

### Opzione B — Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

## 🛠 Stack

- **React 18** + **Vite 5**
- **Anthropic API** (claude-sonnet-4) per generazione quiz
- **Google Fonts**: Cormorant Garamond + Plus Jakarta Sans
- Zero dipendenze esterne oltre a React

## ⚠️ Nota sull'API

I quiz vengono generati tramite l'API Anthropic. In produzione l'API key deve essere gestita tramite un backend proxy per non esporre le credenziali. Su claude.ai funziona automaticamente.

## 📄 Licenza

Sviluppato per ASTRA Bocconi — Main Students' Representative Association.
