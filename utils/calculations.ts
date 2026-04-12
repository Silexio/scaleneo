import { PatientData } from "@/types/patient";
import { SCORE_DEFINITIONS, RED_FLAGS, RedFlagDefinition } from "./definitions";

/**
 * Parses a score value that can be string or number
 * @param val - Score value to parse
 * @returns Parsed numeric score or 0 if invalid
 */
const parseScore = (val: string | number | undefined | null): number | null => {
  if (val === undefined || val === null) return null;
  if (typeof val === "number") return val;
  const parsed = parseInt(val);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Checks if a string contains a search term (case-insensitive)
 * @param val - String to search in
 * @param search - Search term
 * @returns true if search term is found
 */
const hasText = (val: string | undefined | null, search: string): boolean => {
  if (!val) return false;
  return val.toLowerCase().includes(search.toLowerCase());
};

/**
 * Computes BMI (Body Mass Index) from weight and height
 * 
 * Handles both metric formats:
 * - Height > 3 assumed to be in cm (e.g., 175) - converted to meters
 * - Height <= 3 assumed to be in meters (e.g., 1.75)
 * 
 * @param poids - Weight in kg
 * @param taille - Height in cm or meters
 * @returns BMI as string with 1 decimal or null if invalid
 */
export const computeIMC = (poids: string | undefined, taille: string | undefined): string | null => {
  if (!poids || !taille) return null;
  const p = parseFloat(poids);
  let t = parseFloat(taille);
  if (t > 3) t = t / 100;

  if (isNaN(p) || isNaN(t) || t === 0) return null;
  const imc = p / (t * t);
  return imc.toFixed(1);
};

/**
 * Interprets a clinical score based on predefined thresholds
 * 
 * Returns the highest severity level reached based on score value.
 * Example: ODI score of 45 -> "Severe Disability" level
 * 
 * @param scoreKey - Score identifier (e.g., 'odi', 'pcs', 'hadsAnxiete')
 * @param value - Score value to interpret
 * @returns Level object with label and color, or null if invalid
 */
export const interpretScore = (
  scoreKey: keyof typeof SCORE_DEFINITIONS,
  value: string | number | undefined,
) => {
  if (!scoreKey || value === undefined || value === null) return null;
  const def = SCORE_DEFINITIONS[scoreKey];
  if (!def) return null;

  const numVal = parseScore(value);
  if (numVal === null) return null;

  let result = def.levels[0];

  for (const level of def.levels) {
    if (numVal >= level.threshold) {
      result = level;
    }
  }
  return result;
};

export interface DetectedRedFlag extends RedFlagDefinition {
  matchCount: number;
  detected: boolean;
}

export type DetectedRedFlags = Record<string, DetectedRedFlag>;

/**
 * Detects clinical red flags in patient data
 * 
 * Uses brute-force text search across entire patient data object.
 * Searches for predefined medical warning terms (fracture, infection, neurological signs, etc.)
 * 
 * @param data - Complete patient data object
 * @returns Object mapping flag keys to detected red flags with match counts
 */
export const detectRedFlags = (data: PatientData): DetectedRedFlags => {
  const detected: DetectedRedFlags = {};
  const allDataStr = JSON.stringify(data).toLowerCase();

  for (const [flagKey, flagDef] of Object.entries(RED_FLAGS)) {
    let matchCount = 0;
    for (const term of flagDef.searchTerms) {
      if (allDataStr.includes(term.toLowerCase())) matchCount++;
    }
    if (matchCount > 0) {
      detected[flagKey] = { ...flagDef, matchCount, detected: true };
    }
  }
  return detected;
};

/**
 * Generates comprehensive clinical hypothesis from patient data
 * 
 * Analyzes 10 clinical domains:
 * 1. Pathology classification
 * 2. Sources of symptoms (articular, myofascial, neurological)
 * 3. Pain type (nociceptive vs. central sensitization)
 * 4. Physical impairments
 * 5. Pain mechanisms
 * 6. Precautions and contraindications
 * 7. Patient's perspectives and understanding
 * 8. Activity/participation limitations
 * 9. Contributing factors
 * 10. Management approach and prognosis
 * 
 * @param data - Complete patient data object
 * @returns Hypothesis object with analysis for each domain
 */
export const generateHypothesis = (data: PatientData) => {
  const redFlags = detectRedFlags(data);

  return {
    pathology: analyzePathology(data),
    sourcesOfSymptoms: analyzeSourcesOfSymptoms(data),
    painType: analyzePainType(data),
    impairments: analyzeImpairments(data),
    painMechanisms: analyzePainMechanisms(data),
    precautions: analyzePrecautions(redFlags),
    patientsPerspectives: analyzePatientsPerspectives(data),
    activityParticipation: analyzeActivityParticipation(data),
    contributingFactors: analyzeContributingFactors(data),
    managementPrognosis: analyzeManagementPrognosis(data, redFlags),
  };
};

/**
 * Analyzes and classifies the pathology based on onset mode and chronicity
 */
const analyzePathology = (data: PatientData) => {
  const trauma = data.section3.modeApparition;
  const type = data.section3.typeLBP;

  if (hasText(trauma, "trauma")) return "Condition mécanique post-traumatique";
  else if (hasText(type, "chronique")) return "Condition musculo-squelettique chronique";
  else return "Douleur rachidienne mécanique non-spécifique";
};

/**
 * Analyzes sources of symptoms (articular, myofascial, neurological)
 * Checks Section 9 first, falls back to Section 5 if empty
 */
const analyzeSourcesOfSymptoms = (data: PatientData) => {
  const s9 = data.section9;
  const sources: string[] = [];

  if (s9.motifArticulaire) sources.push("Articulaire");
  if (s9.motifMyofascial) sources.push("Myofasciale");
  if (s9.motifNeural) sources.push("Neurologique");

  const s5 = data.section5;
  if (sources.length === 0) {
    if (s5.douleurArticulaire) sources.push("Articulaire");
    if (s5.douleurMyofasciale) sources.push("Myofasciale");
    if (s5.douleurNeurologique) sources.push("Neurologique");
  }

  return sources.length > 0 ? sources.join(" + ") : "Indéterminée (Mixte probable)";
};

/**
 * Analyzes pain type based on CSI (Central Sensitization Inventory)
 * CSI > 40 indicates dominant central sensitization
 */
const analyzePainType = (data: PatientData) => {
  const csi = parseScore(data.section7.scoreCSI);

  if (csi === null) return "Non évalué (CSI absent)";
  if (csi > 40) return "Nociceptif + Sensibilisation Centrale Dominante";
  if (csi > 25) return "Douleur mixte (Nociceptif + Sensibilisation modérée)";
  return "Nociceptif mécanique pur";
};

/**
 * Analyzes physical impairments from Section 6
 * Checks flexion range, SLR (neurodynamics), and muscle strength
 */
const analyzeImpairments = (data: PatientData) => {
  const s6 = data.section6;
  const impairments: string[] = [];

  if (s6.flexionAvant && !hasText(s6.flexionAvant, "complet") && !hasText(s6.flexionAvant, "normal")) {
    impairments.push("Déficit Flexion");
  }

  const slrD = parseScore(s6.slrDroit);
  const slrG = parseScore(s6.slrGauche);
  if ((slrD !== null && slrD > 0 && slrD < 70) || (slrG !== null && slrG > 0 && slrG < 70)) {
    impairments.push("Neurodynamique limité (SLR+)");
  }

  if (s6.forceMusculaire && !hasText(s6.forceMusculaire, "5/5")) {
    impairments.push("Déficit Force");
  }

  return impairments.length > 0 ? impairments.join(" | ") : "Pas de déficits majeurs (ROM préservé)";
};

/**
 * Analyzes pain mechanisms based on clinical scores
 * Checks for central sensitization, catastrophizing, and fear-avoidance
 */
const analyzePainMechanisms = (data: PatientData) => {
  const csi = parseScore(data.section7.scoreCSI);
  const pcs = parseScore(data.section7.scorePCS);
  const fabq = parseScore(data.section7.scoreFabqTravail);

  const mechanisms: string[] = [];
  if (csi !== null && csi > 40) mechanisms.push("↑ Sensibilisation centrale");
  if (pcs !== null && pcs > 30) mechanisms.push("↑ Catastrophisation élevée");
  if (fabq !== null && fabq > 40) mechanisms.push("↑ Peur-Évitement (Yellow Flag)");

  return mechanisms.length > 0 ? mechanisms.join(" + ") : "Mécanismes nociceptifs standards";
};

/**
 * Analyzes precautions based on detected red flags
 */
const analyzePrecautions = (redFlags: DetectedRedFlags) => {
  if (Object.keys(redFlags).length > 0)
    return "⚠️ AVERTISSEMENT: Drapeaux rouges détectés - Voir section dédiée";
  return "✓ Pas de contre-indication absolue identifiée";
};

/**
 * Analyzes patient's understanding and perspectives from Section 11
 */
const analyzePatientsPerspectives = (data: PatientData) => {
  const s11 = data.section11;
  const comprehension = s11.comprehensionDiagnostic || "inconnue";

  if (hasText(comprehension, "oui") || hasText(comprehension, "bon"))
    return "Bon niveau de compréhension - Alliance thérapeutique favorable";
  else if (hasText(comprehension, "non") || hasText(comprehension, "faible"))
    return "⚠️ Compréhension limitée - Éducation thérapeutique prioritaire";
  else
    return "Compréhension et attentes à clarifier";
};

/**
 * Analyzes activity and participation limitations
 * Checks ADL limitations and PSFS (Patient-Specific Functional Scale)
 */
const analyzeActivityParticipation = (data: PatientData) => {
  const s13 = data.section13;

  if (s13.activitesQuotidiennes && s13.activitesQuotidiennes.length > 5)
    return "Limitations fonctionnelles ADL significatives";

  if (data.section7.scorePSFS)
    return `Limitations spécifiques identifiées (PSFS: ${data.section7.scorePSFS})`;

  return "Participation ADL relativement préservée";
};

/**
 * Analyzes contributing factors from Section 14
 * Checks psychosocial, lifestyle, and biomechanical factors
 */
const analyzeContributingFactors = (data: PatientData) => {
  const s14 = data.section14;
  const contributing: string[] = [];

  if (s14.facteursPsycho && !hasText(s14.facteursPsycho, "non")) contributing.push("Facteurs Psychosociaux");
  if (hasText(s14.facteursLifestyle, "sédentaire") || hasText(s14.facteursLifestyle, "inactivité")) contributing.push("Sédentarité");
  if (s14.facteursBiomeca) contributing.push("Facteurs Biomécaniques");

  return contributing.length > 0 ? contributing.join(" + ") : "Pas de facteurs contribuants majeurs";
};

/**
 * Analyzes management approach and prognosis
 * Considers positive prognostic factors, red flags, and yellow flags
 */
const analyzeManagementPrognosis = (data: PatientData, redFlags: DetectedRedFlags) => {
  const s12 = data.section12;

  if (hasText(s12.facteursPositifs, "oui") || hasText(s12.facteursPositifs, "bon"))
    return "Pronostic favorable - Réponse attendue au traitement conservateur";

  if (Object.keys(redFlags).length > 0)
    return "Pronostic réservé - Nécessite surveillance médicale (Red Flags)";

  if (hasText(s12.detailYellowFlags, "oui"))
    return "Pronostic modéré - Risque de chronicité (Yellow Flags)";

  return "Pronostic standard - Réévaluation à 4 semaines";
};