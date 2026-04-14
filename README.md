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

- Declarative parsing engine for raw TXT clinical reports
- 18 clinical sections extracted automatically (anamnesis, scores, red flags, hypotheses…)
- Checkbox detection, score parsing with null safety (absent ≠ zero)
- JSON preview for debugging extracted data

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

- Export to CSV, XLSX (Excel), or JSON
- Automatic flattening of nested clinical data

### 🏗 Architecture

- **100% client-side** — no backend, no database
- **State management**: React Context (`PatientProvider`) + custom `useAssessments` hook
- **Persistence**: localStorage with hydration-safe `useEffect` pattern
- **Cross-component sync**: Custom DOM events (`scaleneo:analytics:update`)
- **Design system**: CSS custom properties for semantic colors, full light/dark mode support

### 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI + shadcn/ui + Lucide React |
| Charts | Recharts 3 |
| Export | SheetJS (XLSX) |

### ⚙️ Getting Started

**Prerequisites**: Node.js 18+, pnpm

```bash
git clone https://github.com/silexio/scaleneo.git
cd scaleneo
pnpm install
pnpm dev
```

---

<a name="français"></a>

## 🇫🇷 Français

**SCALENEO** est une plateforme clinique professionnelle pour les kinésithérapeutes et cliniciens, permettant d'extraire, analyser et suivre les données patients dans le cadre des bilans de lombalgie (LBP). L'extraction est automatisée à partir de rapports cliniques TXT, les analyses longitudinales intègrent le suivi des MCID, et l'export est structuré — le tout 100% côté client, sans backend.

### 🚀 Fonctionnalités

#### 🔍 Extraction Clinique Intelligente

- Moteur de parsing déclaratif pour rapports TXT bruts
- 18 sections cliniques extraites automatiquement (anamnèse, scores, red flags, hypothèses…)
- Détection de cases à cocher, parsing des scores avec gestion null (absent ≠ zéro)
- Aperçu JSON pour déboguer les données extraites

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

- Export CSV, XLSX (Excel) ou JSON
- Aplatissement automatique des données cliniques imbriquées

### 🏗 Architecture

- **100% client-side** — pas de backend, pas de base de données
- **Gestion d'état** : React Context (`PatientProvider`) + hook `useAssessments`
- **Persistance** : localStorage avec pattern `useEffect` hydration-safe
- **Synchronisation cross-composants** : événements DOM personnalisés (`scaleneo:analytics:update`)
- **Design system** : variables CSS sémantiques, support complet light/dark mode

### 🛠 Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Langage | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| Composants UI | Radix UI + shadcn/ui + Lucide React |
| Graphiques | Recharts 3 |
| Export | SheetJS (XLSX) |

### ⚙️ Démarrage

**Prérequis** : Node.js 18+, pnpm

```bash
git clone https://github.com/silexio/scaleneo.git
cd scaleneo
pnpm install
pnpm dev
```

---

## 📄 License

Projet privé et propriétaire. Tous droits réservés.

---

Made with ❤️ by [Silexio](https://github.com/silexio)
