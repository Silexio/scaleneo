# SCALENEO 🩺

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3-22B5BF?style=for-the-badge)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](LICENSE)

[🇺🇸 English](#english) | [🇫🇷 Français](#français)

---

<a name="english"></a>

## 🇺🇸 English

**SCALENEO** is a professional clinical platform for physiotherapists and clinicians to extract, analyze, and track patient data for Low Back Pain (LBP) assessments. It automates data extraction from clinical reports, provides longitudinal analytics with MCID tracking, and exports structured data — all client-side, no backend required.

### 🚀 Features

#### 🔍 Smart Clinical Extraction

- Declarative parsing engine for raw TXT clinical reports (template in `public/documents/`)
- 18 clinical sections extracted automatically (anamnesis, scores, red flags, hypotheses…)
- Checkbox detection (`☒ ☑ ☐ [x]`), pipe-separated sub-fields, nested `Key: Sub-key: value` lines
- Auto-calculated fields: BMI, SLR asymmetry, Core Strength Index (Ito/Sorensen)
- Numeric normalization: units, emojis, and annotations stripped from test/score values
- Honest quality control: section 18 (extraction confidence, review flag) is recomputed from measured field coverage — never trusted from the file
- Score parsing with null safety (absent ≠ zero), JSON preview for debugging

#### 📊 Longitudinal Analytics

- Multi-assessment timeline with chronological sorting
- Line charts per metric (ODI, CSI, NRS, FABQ, HADS, WAI, PCS) using Recharts
- MCID (Minimum Clinically Important Difference) reference lines per metric
- Baseline vs. latest comparison table with MCID validation badges
- localStorage persistence — data survives page reloads
- **Print to PDF**: A4 landscape, charts and table optimized for printing

#### 🧠 Clinical Intelligence

- Automated red flag detection across 10 critical categories
- Evidence-based clinical hypothesis generation
- Color-coded severity levels for all standard questionnaires
- Pain mechanism and prognosis analysis

#### 📥 Professional Export

- **XLSX**: `SYNTHESE` flat sheet (1 row/patient, 1 column/variable — ready for statistics) + one Field/Value sheet per clinical section
- **CSV**: flat table (1 header row + 1 data row) — concatenable across patients for stats software (R, SPSS, jamovi)
- **JSON**: nested structure identical to the parsed data

### 🏗 Architecture

- **100% client-side** — no backend, no database (the export API route only converts formats)
- **State management**: React Context (`PatientProvider`) + `useAssessments` hook
- **Persistence**: shared localStorage store via `useSyncExternalStore` (hydration-safe, cross-tab sync, in-memory fallback)
- **Design system**: CSS custom properties for semantic colors, full light/dark mode support

### 📁 Project Structure

```
scaleneo/
├── app/
│   ├── api/export/        # Route Handler: CSV / XLSX / JSON conversion
│   ├── extraction/        # File upload + parsing
│   ├── results/           # Scores, red flags, hypothesis, detailed sections
│   ├── analytics/         # Longitudinal MCID tracking
│   └── export/            # Export UI
├── components/
│   ├── dashboard/         # Clinical UI (cards, charts, upload, timeline…)
│   ├── providers/         # PatientProvider (global state)
│   └── ui/                # shadcn/ui primitives
├── hooks/                 # useAssessments, useLocalStorageValue
├── types/                 # PatientData (18 sections), Assessment
├── utils/                 # parser, calculations, labels, metrics config
└── public/documents/      # FICHE_BILAN_SCALENEO_TEMPLATE.txt
```

### ⚙️ Getting Started

**Prerequisites**: Node.js 20.9+, pnpm

```bash
git clone https://github.com/silexio/scaleneo.git
cd scaleneo
pnpm install
pnpm dev
```

| Script | Description |
|---|---|
| `pnpm dev` | Development server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint check |

---

<a name="français"></a>

## 🇫🇷 Français

**SCALENEO** est une plateforme clinique professionnelle pour les kinésithérapeutes et cliniciens, permettant d'extraire, analyser et suivre les données patients dans le cadre des bilans de lombalgie (LBP). L'extraction est automatisée à partir de rapports cliniques TXT, les analyses longitudinales intègrent le suivi des MCID, et l'export est structuré — le tout 100% côté client, sans backend.

### 🚀 Fonctionnalités

#### 🔍 Extraction Clinique Intelligente

- Moteur de parsing déclaratif pour rapports TXT bruts (template dans `public/documents/`)
- 18 sections cliniques extraites automatiquement (anamnèse, scores, red flags, hypothèses…)
- Détection des cases à cocher (`☒ ☑ ☐ [x]`), sous-champs séparés par `|`, lignes imbriquées `Clé: Sous-clé: valeur`
- Champs auto-calculés : IMC, asymétrie SLR, Core Strength Index (Ito/Sorensen)
- Normalisation numérique : unités, emojis et annotations retirés des valeurs de tests/scores
- Contrôle qualité honnête : la section 18 (confiance d'extraction, révision requise) est recalculée à partir de la couverture réelle des champs — jamais reprise du fichier
- Parsing des scores avec gestion null (absent ≠ zéro), aperçu JSON pour le débogage

#### 📊 Analyses Longitudinales

- Timeline multi-bilans avec tri chronologique
- Graphiques par métrique (ODI, CSI, NRS, FABQ, HADS, WAI, PCS)
- Lignes de référence MCID (Différence Cliniquement Importante Minimale) par métrique
- Tableau comparatif Baseline vs. Actuel avec badges de validation MCID
- Persistance localStorage — les données survivent au rechargement
- **Impression PDF** : A4 paysage, graphiques et tableau optimisés pour l'impression

#### 🧠 Intelligence Clinique

- Détection automatisée des red flags sur 10 catégories critiques
- Génération d'hypothèses cliniques basées sur les données patient
- Niveaux de sévérité codés par couleur pour tous les questionnaires standards
- Analyse des mécanismes douloureux et du pronostic

#### 📥 Export Professionnel

- **XLSX** : feuille `SYNTHESE` à plat (1 ligne/patient, 1 colonne/variable — prête pour les statistiques) + une feuille Champ/Valeur par section clinique
- **CSV** : table à plat (1 ligne d'en-têtes + 1 ligne de données) — concaténable entre patients pour les logiciels de stats (R, SPSS, jamovi)
- **JSON** : structure imbriquée identique aux données parsées

### 🏗 Architecture

- **100% client-side** — pas de backend, pas de base de données (la route API d'export ne fait que convertir les formats)
- **Gestion d'état** : React Context (`PatientProvider`) + hook `useAssessments`
- **Persistance** : store localStorage partagé via `useSyncExternalStore` (hydration-safe, synchronisation multi-onglets, repli en mémoire)
- **Design system** : variables CSS sémantiques, support complet light/dark mode

### 📁 Structure du Projet

```
scaleneo/
├── app/
│   ├── api/export/        # Route Handler : conversion CSV / XLSX / JSON
│   ├── extraction/        # Upload de fichier + parsing
│   ├── results/           # Scores, red flags, hypothèse, sections détaillées
│   ├── analytics/         # Suivi longitudinal MCID
│   └── export/            # Interface d'export
├── components/
│   ├── dashboard/         # UI clinique (cartes, graphiques, upload, timeline…)
│   ├── providers/         # PatientProvider (état global)
│   └── ui/                # Primitives shadcn/ui
├── hooks/                 # useAssessments, useLocalStorageValue
├── types/                 # PatientData (18 sections), Assessment
├── utils/                 # parser, calculs, labels, config métriques
└── public/documents/      # FICHE_BILAN_SCALENEO_TEMPLATE.txt
```

### ⚙️ Démarrage

**Prérequis** : Node.js 20.9+, pnpm

```bash
git clone https://github.com/silexio/scaleneo.git
cd scaleneo
pnpm install
pnpm dev
```

| Script | Description |
|---|---|
| `pnpm dev` | Serveur de développement (Turbopack) |
| `pnpm build` | Build de production |
| `pnpm start` | Sert le build de production |
| `pnpm lint` | Vérification ESLint |

---

## 📄 License

Projet privé et propriétaire. Tous droits réservés.

---

Made with ❤️ by [Silexio](https://github.com/silexio)
