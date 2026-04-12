/**
 * Score and Red Flag Definitions
 *
 * Defines clinical score thresholds and red flags for patient assessment.
 *
 * SCORE_DEFINITIONS: Contains interpretation thresholds for clinical scores
 * (ODI, CSI, PCS, HADS, FABQ, SBT, WAI, PSFS) with color-coded severity levels.
 *
 * RED_FLAGS: Medical warning signs requiring immediate attention or referral.
 * Categories: CRITICAL (emergency), HIGH (urgent), MODERATE (caution)
 */

export interface ScoreLevel {
  threshold: number;
  label: string;
  color: "green" | "yellow" | "red";
}

export interface ScoreDefinition {
  label: string;
  min: number;
  max: number;
  levels: ScoreLevel[];
}

export const SCORE_DEFINITIONS: Record<string, ScoreDefinition> = {
  odi: {
    label: "ODI",
    min: 0,
    max: 100,
    levels: [
      { threshold: 0, label: "Minime", color: "green" },
      { threshold: 20, label: "Léger", color: "green" },
      { threshold: 40, label: "Modéré", color: "yellow" },
      { threshold: 60, label: "Sévère", color: "red" },
      { threshold: 80, label: "Très Sévère", color: "red" },
    ],
  },
  csi: {
    label: "CSI",
    min: 0,
    max: 100,
    levels: [
      { threshold: 0, label: "Faible", color: "green" },
      { threshold: 30, label: "Modéré", color: "yellow" },
      { threshold: 50, label: "Élevé", color: "red" },
    ],
  },
  pcs: {
    label: "PCS",
    min: 0,
    max: 52,
    levels: [
      { threshold: 0, label: "Faible", color: "green" },
      { threshold: 17, label: "Modéré", color: "yellow" },
      { threshold: 34, label: "Élevé", color: "red" },
    ],
  },
  hadsAnxiete: {
    label: "HADS-Anxiété",
    min: 0,
    max: 21,
    levels: [
      { threshold: 0, label: "Normal", color: "green" },
      { threshold: 8, label: "Léger", color: "yellow" },
      { threshold: 11, label: "Modéré", color: "red" },
      { threshold: 15, label: "Sévère", color: "red" },
    ],
  },
  hadsDepression: {
    label: "HADS-Dépression",
    min: 0,
    max: 21,
    levels: [
      { threshold: 0, label: "Normal", color: "green" },
      { threshold: 8, label: "Léger", color: "yellow" },
      { threshold: 11, label: "Modéré", color: "red" },
      { threshold: 15, label: "Sévère", color: "red" },
    ],
  },
  fabqTravail: {
    label: "FABQ-Travail",
    min: 0,
    max: 100,
    levels: [
      { threshold: 0, label: "Faible", color: "green" },
      { threshold: 38, label: "Modéré", color: "yellow" },
      { threshold: 60, label: "Élevé", color: "red" },
    ],
  },
  fabqActivite: {
    label: "FABQ-Activité",
    min: 0,
    max: 100,
    levels: [
      { threshold: 0, label: "Faible", color: "green" },
      { threshold: 13, label: "Modéré", color: "yellow" },
      { threshold: 20, label: "Élevé", color: "red" },
    ],
  },
  sbt: {
    label: "SBT",
    min: 0,
    max: 9,
    levels: [
      { threshold: 0, label: "Faible", color: "green" },
      { threshold: 4, label: "Modéré", color: "red" },
    ],
  },
  wai: {
    label: "WAI",
    min: 0,
    max: 100,
    levels: [
      { threshold: 0, label: "Faible", color: "red" },
      { threshold: 50, label: "Modéré", color: "yellow" },
      { threshold: 75, label: "Bon", color: "green" },
    ],
  },
  psfs: {
    label: "PSFS",
    min: 0,
    max: 10,
    levels: [
      { threshold: 0, label: "Incapacité", color: "red" },
      { threshold: 4, label: "Modéré", color: "yellow" },
      { threshold: 8, label: "Bon", color: "green" },
    ],
  },
};

export interface RedFlagDefinition {
  category: "CRITICAL" | "HIGH" | "MODERATE";
  label: string;
  searchTerms: string[];
  recommendation: string;
  color: "red" | "orange";
}

export const RED_FLAGS: Record<string, RedFlagDefinition> = {
  cauda_equina: {
    category: "CRITICAL",
    label: "Syndrome de la Queue de Cheval",
    searchTerms: ["anesthésie en selle", "anesthésie selle", "rectale", "fécale"],
    recommendation: "🚨 URGENT: Référence immédiate aux urgences",
    color: "red",
  },
  bowel_bladder: {
    category: "CRITICAL",
    label: "Dysfonctionnement Vésical/Rectal",
    searchTerms: ["bowel", "bladder", "urinaire", "rétention", "incontinence"],
    recommendation: "🚨 URGENT: Évaluation médicale immédiate",
    color: "red",
  },
  progressive_neuro: {
    category: "CRITICAL",
    label: "Déficit Neurologique Progressif",
    searchTerms: [
      "progression",
      "aggravation",
      "déficit neurologique",
      "parésie progressive",
    ],
    recommendation: "🚨 URGENT: Imagerie et évaluation neurologique",
    color: "red",
  },
  trauma_fracture: {
    category: "CRITICAL",
    label: "Traumatisme Sévère + Mécanisme Associé",
    searchTerms: ["traumatisme", "accident", "chute", "fracture"],
    recommendation: "⚠️ HAUTE PRIORITÉ: Imagerie requise avant traitement",
    color: "red",
  },
  infection_fever: {
    category: "CRITICAL",
    label: "Fièvre + Douleur Rachidienne",
    searchTerms: ["fièvre", "température", "sueurs nocturnes"],
    recommendation: "🚨 Référence urgente (infection possible)",
    color: "red",
  },
  malignancy: {
    category: "HIGH",
    label: "Antécédent Tumoral + Symptômes Systémiques",
    searchTerms: ["cancer", "tumeur", "chimiothérapie", "perte poids"],
    recommendation: "⚠️ HAUTE PRIORITÉ: Imagerie oncologique recommandée",
    color: "red",
  },
  anticoagulation_trauma: {
    category: "HIGH",
    label: "Anticoagulation + Traumatisme",
    searchTerms: [
      "anticoagulant",
      "warfarine",
      "apixaban",
      "rivaroxaban",
      "traumatisme",
    ],
    recommendation: "⚠️ Évaluation médicale avant traitement manuel",
    color: "orange",
  },
  severe_symptoms: {
    category: "MODERATE",
    label: "Symptomatologie Sévère Bilatérale",
    searchTerms: ["bilatéral", "sévère", "très grave"],
    recommendation: "✓ Évaluation approfondie, prudence avec MT",
    color: "orange",
  },
  systemic_disease: {
    category: "MODERATE",
    label: "Maladie Systémique Significative",
    searchTerms: ["diabète", "rhumatoïde", "polyarthrite", "lupus", "sclérose"],
    recommendation: "✓ Coordination avec médecine, prudence thérapeutique",
    color: "orange",
  },
};
