import type { PatientData } from "@/types/patient";

/**
 * Patient Data Parser
 *
 * Robust parsing engine for clinical assessment forms.
 * Uses a declarative configuration-over-code approach.
 *
 * Supports:
 * - 18 sections of patient data
 * - Checkbox detection (☒, ☑, ☐, [x], [ ])
 * - NRS (pain scale) extraction
 * - Multi-value fields with pipe separation
 * - Automatic type conversion (boolean, number, string)
 */

interface SectionData {
  [key: string]: string | string[] | boolean | number | null;
}

/**
 * Parser Configuration Mapping
 *
 * Maps search terms (found in text file) to property names in JSON output.
 * Key = Text to search for in file (case-insensitive)
 * Value = Property name in the final JSON object
 *
 * Example: "nom et prénom" in file -> "nomPatient" in JSON
 */
const PARSER_CONFIG: Record<string, Record<string, string>> = {
  "SECTION 1": {
    "nom et prénom": "nomPatient",
    "année de naissance": "anneeNaissance",
    "age": "age",
    "sexe": "sexe",
    "profession": "profession",
    "secteur": "secteur",
    "kiné examinateur": "kineExaminateur",
    "date bilan": "dateBilan",
    "id patient": "idPatient",
    "id bilan": "idBilan"
  },
  "SECTION 2": {
    "poids": "poids",
    "taille": "taille",
    "imc": "imc"
  },
  "SECTION 3": {
    "antécédents lbp": "antecedentsLBP",
    "episode initial": "episodeInitial",
    "traumatisme": "modeApparition",
    "récidive": "recidive",
    "pire episode": "pireEpisode",
    "durée totale": "dureeTotale",
    "type lbp": "typeLBP"
  },
  "SECTION 4": {
    "douleur au repos": "nrsRepos",
    "douleur à l'activité": "nrsActivite",
    "douleur maximum": "nrsMax",
    "horaire douleur": "horaireDouleur",
    "variation journalière": "variationJournaliere",
    "facteurs aggravants": "facteursAggravants",
    "facteurs soulageants": "facteursSoulageants",
    "évolution": "evolution"
  },
  "SECTION 5": {
    "douleur articulaire": "douleurArticulaire",
    "douleur myofasciale": "douleurMyofasciale",
    "douleur neurologique": "douleurNeurologique",
    "sensibilisation centrale": "sensibilisationCentrale",
    "déficit sensorimotor": "deficitSensorimoteur",
    "caractère sensations": "caractereSensations",
    "observations mécanismes": "observationsMecanismes"
  },
  "SECTION 6": {
    "flexion avant": "flexionAvant",
    "flexion avant nrs": "flexionAvantNrs",
    "extension": "extension",
    "extension nrs": "extensionNrs",
    "inclinaison d": "inclinaisonDroit",
    "inclinaison d nrs": "inclinaisonDroitNrs",
    "inclinaison g": "inclinaisonGauche",
    "inclinaison g nrs": "inclinaisonGaucheNrs",
    "rotation d": "rotationDroit",
    "rotation d nrs": "rotationDroitNrs",
    "rotation g": "rotationGauche",
    "rotation g nrs": "rotationGaucheNrs",
    "mobilité segmentaire pa": "mobiliteSegmentaire",
    "mobilité segmentaire pa nrs": "mobiliteSegmentaireNrs",
    "hanche": "hanche",
    "hanche nrs": "hancheNrs",
    "slr droit": "slrDroit",
    "slr gauche": "slrGauche",
    "asymétrie slr": "asymetrieSlr",
    "slump test": "slumpTest",
    "pkb": "pkb",
    "force musculaire": "forceMusculaire",
    "réflexes": "reflexes",
    "sensation": "sensation",
    "sensation localisation": "sensationLocalisation",
    "profil sensoriel": "profilSensoriel",
    "tension musculaire": "tensionMusculaire",
    "trigger points": "triggerPoints",
    "trigger points localisation": "triggerPointsLocalisation",
    "hypersensibilité": "hypersensibilite",
    "spasme musculaire": "spasmeMusculaire",
    "spasme musculaire localisation": "spasmeLocalisation",
    "localisation": "localisation",
    "signes méningés": "signesMeninges",
    "hypersensibilité à la pression": "hypersensibilitePression",
    "zone lombaire": "zoneLombaire",
    "zone contrôle": "zoneControle",
    "sorensen": "testSorensen",
    "ito shirado": "testItoShirado",
    "core strength index": "coreStrengthIndex",
    "side plank": "sidePlank",
    "csm": "controlSensoriMoteur"
  },
  "SECTION 7": {
    "sbt": "scoreSBT",
    "csi score": "scoreCSI",
    "odi score": "scoreODI",
    "pcs score": "scorePCS",
    "hads score anxiété": "scoreAnxiete",
    "hads score dépression": "scoreDepression",
    "fabq score travail": "scoreFabqTravail",
    "fabq score activité": "scoreFabqActivite",
    "wai score": "scoreWAI",
    "ipaq": "scoreIPAQ",
    "ipaq met": "scoreIPAQ_MET",
    "psfs": "scorePSFS",
    "psfs scores": "scorePSFS_Scores",
    "sf-36": "qualiteVie",
    "autres questionnaires": "autresQuestionnaires"
  },
  "SECTION 8": {
    "drapeaux rouges": "redFlags",
    "si oui, lesquels": "detailsRedFlags",
    "contre-indications": "contreIndications",
    "allergies": "allergies",
    "médications": "medications",
    "examen médicaux": "examensMedicaux",
    "instabilité rachidienne": "instabiliteRachidienne",
    "signes": "signesInstabilite",
    "limitation traitement": "limitationManuelle",
    "anticoagulation": "anticoagulation",
    "traitement": "traitementAnticoagulation",
    "grossesse": "grossesse",
    "trimestre": "trimestreGrossesse",
    "adaptations": "adaptationsGrossesse",
    "état général": "etatGeneral"
  },
  "SECTION 9": {
    "motif articulaire": "motifArticulaire",
    "motif myofascial": "motifMyofascial",
    "motif neural": "motifNeural",
    "sensibilisation centrale": "sensibilisationCentrale",
    "contrôle sensorimoteur": "controleSensorimoteur"
  },
  "SECTION 10": {
    "fréquence thérapie": "frequence",
    "thérapie manuelle": "hasTherapieManuelle",
    "types tm": "typesTherapieManuelle",
    "thérapie par exercice": "hasExercices",
    "types exercices": "typesExercices",
    "thérapie par neurodynamique": "hasNeurodynamique",
    "types neuro": "typesNeurodynamique",
    "éducation patient": "hasEducation",
    "sujets éducation": "sujetsEducation",
    "modalités supplémentaires": "modalitesSup"
  },
  "SECTION 11": {
    "compréhension du diagnostic": "comprehensionDiagnostic",
    "inquiétudes": "inquietudes",
    "perception de gravité": "perceptionGravite",
    "auto-efficacité": "autoEfficacite",
    "croyance contrôle": "croyanceControle"
  },
  "SECTION 12": {
    "durée estimée traitement": "dureeTraitement",
    "nombre de séances": "nbSeances",
    "facteurs pronostiques positifs": "facteursPositifs",
    "facteurs pronostiques négatifs": "facteursNegatifs",
    "objectifs à court terme": "objectifsCourtTerme",
    "objectifs à long terme": "objectifsLongTerme",
    "attentes réalistes": "attentesRealistes",
    "attentes réalistes détails": "detailAttentes",
    "patient anticipe guérison": "anticipationGuerison",
    "yellow flags": "detailYellowFlags",
    "soutien social": "soutienSocial",
    "soutien social détails": "detailSoutien",
    "stresseurs": "stresseurs",
    "point de réévaluation": "pointReevaluation",
    "critères changement": "criteresChangement",
    "besoin orientation": "orientationSpecialise",
    "barrières anticipées": "barrieresTraitement"
  },
  "SECTION 13": {
    "activités quotidiennes": "activitesQuotidiennes",
    "loisirs/sports": "loisirs",
    "activités antérieures": "activitesAnterieures",
    "actuellement": "activitesActuelles",
    "temps assis": "tempsAssis",
    "temps assis debout": "tempsDebout",
    "temps assis marche": "tempsMarche",
    "temps assis quotidien": "tempsAssisQuotidien",
    "écran": "tempsEcran",
    "comportement sédentaire": "sedentarite",
    "statut professionnel": "statutPro",
    "jours d'absence": "joursAbsence",
    "limitations professionnelles": "limitationsPro",
    "tâches impossibles": "tachesImpossibles",
    "tâches difficiles": "tachesDifficiles",
    "attentes retour": "attentesRetourTravail",
    "délai anticipé": "delaiRetourTravail",
    "confiance": "confianceRetourTravail",
    "modifications poste": "modifPoste",
    "type": "typeModifPoste"
  },
  "SECTION 14": {
    "défauts posturaux": "defautsPosturaux",
    "facteurs biomécaniques": "facteursBiomeca",
    "facteurs de style de vie": "facteursLifestyle",
    "facteurs hormonaux": "facteursHormonaux",
    "contexte de travail": "ergonomieTravail",
    "poste optimisé": "posteOptimise",
    "recommandations": "recommandationsErgonomie",
    "facteurs psychosociaux": "facteursPsycho",
    "système santé": "systemeSante",
    "conception biopsychosociale": "conceptionBiopsychosociale",
    "attentes culturelles": "attentesCulturelles",
    "attente guérison rapide": "attenteGuerisonRapide",
    "approche préférée": "approchePreferee",
    "compliance anticipée": "compliance",
    "barrières": "barrieresCompliance"
  },
  "SECTION 15": {
    "pgic": "pgic",
    "état": "etatPGIC",
    "treatment satisfaction": "satisfaction",
    "relation thérapeute": "relationTherapeute",
    "gas": "gasScore",
    "progression objectives": "progressionGAS"
  },
  "SECTION 16": {
    "résumé clinique": "resumeClinique",
    "observations globales": "observationsGlobales",
    "impression générale": "impressionGenerale",
    "notes supplémentaires": "notesSup",
    "plan de traitement": "planTraitement"
  },
  "SECTION 17": {
    "pathology": "pathology",
    "sources of symptoms": "sourcesOfSymptoms",
    "pain type": "painType",
    "impairments": "impairments",
    "pain mechanisms": "painMechanisms",
    "precautions": "precautions",
    "patients' perspectives": "patientPerspectives",
    "activity & participation": "activityParticipation",
    "contributing factors": "contributingFactors",
    "management & prognosis": "managementPrognosis"
  },
  "SECTION 18": {
    "confiance extraction": "confianceExtraction",
    "données complètes": "isComplete",
    "révision manuelle": "needsReview",
    "modifié par": "modifiePar",
    "date modification": "dateModification"
  }
};

const CHECKBOX_REGEX = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐\[\]|:]+)/g;

/**
 * PatientParser Class
 *
 * Main parser for clinical assessment text files.
 */
export class PatientParser {

  /**
   * Cleans and converts raw extracted values to appropriate types
   *
   * Handles:
   * - Bracket removal: "[value]" -> "value"
   * - Placeholder detection: "à remplir" -> null
   * - Boolean conversion: "oui"/"yes" -> true, "non"/"no" -> false
   * - Numeric conversion with unit stripping ("45 kg" -> 45)
   * - Preserves strings as fallback
   *
   * @param raw - Raw extracted value from text
   * @returns Cleaned value as string, boolean, number, or null
   */
  private static cleanValue(raw: string): string | boolean | number | null {
    if (!raw) return null;
    let val = raw.trim();

    if (val.startsWith("[") && val.endsWith("]")) val = val.slice(1, -1).trim();
    if (val === "" || val.toLowerCase().includes("à remplir")) return null;

    const lower = val.toLowerCase();
    if (["oui", "yes", "true", "vrai"].includes(lower)) return true;
    if (["non", "no", "false", "faux"].includes(lower)) return false;

    const cleanVal = val.toLowerCase().replace(/\s*(ans|years|kg\.?|cm\.?)\s*$/, "").trim();

    const num = Number(cleanVal);
    if (!isNaN(num) && cleanVal !== "" && !cleanVal.includes(" ")) return num;

    return val;
  }

  /**
   * Extracts checked labels from checkbox syntax, or cleans plain text value.
   * Returns null if checkboxes found but none checked.
   */
  private static extractValue(text: string): string | boolean | number | null {
    const labels: string[] = [];
    let m: RegExpExecArray | null;
    let foundCheckbox = false;
    const regex = new RegExp(CHECKBOX_REGEX.source, CHECKBOX_REGEX.flags);

    while ((m = regex.exec(text)) !== null) {
      foundCheckbox = true;
      const marker = m[1];
      const label = (m[2] || "").trim().replace(/[.,]$/g, "");
      const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
      if (isChecked && label) labels.push(label);
    }

    if (foundCheckbox) {
      if (labels.length === 0) return null;
      return labels.length === 1 ? labels[0] : labels.join(", ");
    }
    return this.cleanValue(text);
  }

  /**
   * Processes pipe-separated sub-fields on a line and maps them to section properties.
   * Handles both precise context key lookups and fuzzy field name matching.
   */
  private static processAdditionalFields(
    trimmedLine: string,
    foundKey: string,
    targetProp: string,
    currentSection: SectionData,
    sectionConfig: Record<string, string>
  ): void {
    const additionalFieldsRegex = /(?:^|\|)\s*([^:|]+)(?::\s*([^|]+))?/g;
    let fieldMatch: RegExpExecArray | null;

    while ((fieldMatch = additionalFieldsRegex.exec(trimmedLine)) !== null) {
      const fieldName = (fieldMatch[1] || "").trim().toLowerCase();
      const rawFieldValue = (fieldMatch[2] || "").trim();

      if (!fieldName) continue;

      let normalizedField = fieldName;
      if (fieldName.includes("nrs") || fieldName.includes("score")) normalizedField = "nrs";
      else if (fieldName.includes("localisation")) normalizedField = "localisation";
      else if (fieldName.includes("détail")) normalizedField = "détails";
      else if (fieldName.includes("met")) normalizedField = "met";
      else if (fieldName.includes("debout")) normalizedField = "debout";
      else if (fieldName.includes("marche")) normalizedField = "marche";
      else if (fieldName.includes("scores")) normalizedField = "scores";

      const contextSearchKey = `${foundKey} ${normalizedField}`.toLowerCase();
      const preciseContextKey = Object.keys(sectionConfig).find(k =>
        contextSearchKey === k.toLowerCase() || k.toLowerCase().includes(contextSearchKey)
      );

      if (preciseContextKey) {
        const additionalProp = sectionConfig[preciseContextKey];
        currentSection[additionalProp] = rawFieldValue ? this.extractValue(rawFieldValue) : true;
      } else {
        const additionalFieldKey = Object.keys(sectionConfig).find(k => {
          if (k.includes(" ") && !normalizedField.includes(" ")) return false;
          return normalizedField.includes(k.toLowerCase()) ||
            k.toLowerCase().includes(normalizedField) ||
            fieldName.includes(k.toLowerCase());
        });

        if (additionalFieldKey) {
          const additionalProp = sectionConfig[additionalFieldKey];
          if (additionalProp !== targetProp) {
            currentSection[additionalProp] = rawFieldValue ? this.extractValue(rawFieldValue) : true;
          }
        }
      }
    }
  }

  /**
   * Main parsing method
   *
   * Parses clinical assessment text file into structured PatientData object.
   *
   * Process:
   * 1. Detects section headers (SECTION 1, SECTION 2, etc.)
   * 2. Extracts key-value pairs ("Field Name: value")
   * 3. Detects and processes checkboxes (☒, ☑, ☐)
   * 4. Handles multi-value fields with pipe separators
   * 5. Extracts NRS scores and additional sub-fields
   *
   * @param fileContent - Raw text content from the assessment file
   * @returns Structured PatientData object with 18 sections
   */
  public static parse(fileContent: string): PatientData {
    const result: Record<string, SectionData> = {};
    for (let i = 1; i <= 18; i++) result[`section${i}`] = {};

    const lines = fileContent.split(/\r?\n/);
    let currentSectionNum: string | null = null;
    let currentSectionConfig: Record<string, string> | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const sectionMatch = trimmedLine.match(/^={0,}\s*SECTION\s+(\d+)/i);
      if (sectionMatch) {
        currentSectionNum = sectionMatch[1];
        currentSectionConfig = PARSER_CONFIG[`SECTION ${currentSectionNum}`] || null;
        continue;
      }

      if (!currentSectionConfig || !currentSectionNum) continue;

      const currentSection = result[`section${currentSectionNum}`];

      if (trimmedLine.includes(":")) {
        const separatorIndex = trimmedLine.indexOf(":");
        const rawKey = trimmedLine.substring(0, separatorIndex).trim().toLowerCase();
        const rawValue = trimmedLine.substring(separatorIndex + 1);

        const foundKey = Object.keys(currentSectionConfig)
          .filter(k => rawKey.includes(k.toLowerCase()))
          .sort((a, b) => b.length - a.length)[0];

        if (foundKey) {
          const targetProp = currentSectionConfig[foundKey];
          const checkboxRegex = new RegExp(CHECKBOX_REGEX.source, CHECKBOX_REGEX.flags);
          const checkedLabels: string[] = [];
          let m: RegExpExecArray | null;

          while ((m = checkboxRegex.exec(rawValue)) !== null) {
            const marker = m[1];
            const label = (m[2] || "").trim().replace(/[.,]$/g, "");
            const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
            if (isChecked && label) checkedLabels.push(label);
          }

          if (checkedLabels.length > 0) {
            currentSection[targetProp] = checkedLabels.length === 1 ? checkedLabels[0] : checkedLabels.join(", ");
          } else {
            const hasCheckboxes = /(☒|☑|☐|\[x\]|\[ \])/.test(rawValue);
            currentSection[targetProp] = hasCheckboxes ? null : this.cleanValue(rawValue);
          }

          this.processAdditionalFields(trimmedLine, foundKey, targetProp, currentSection, currentSectionConfig);
        }
      } else if (
        trimmedLine.startsWith("☐") ||
        trimmedLine.startsWith("☑") ||
        trimmedLine.startsWith("☒") ||
        trimmedLine.startsWith("[x]") ||
        trimmedLine.startsWith("- [ ]") ||
        trimmedLine.startsWith("- [x]")
      ) {
        const lowerLine = trimmedLine.toLowerCase();
        const foundKey = Object.keys(currentSectionConfig).find(k => lowerLine.includes(k));

        if (foundKey) {
          const targetProp = currentSectionConfig[foundKey];
          const checkboxRegex = new RegExp(CHECKBOX_REGEX.source, CHECKBOX_REGEX.flags);
          const allMatches = [...trimmedLine.matchAll(checkboxRegex)];
          const isSingleCheckbox = allMatches.length === 1;
          const checkedLabels: string[] = [];

          for (const m of allMatches) {
            const marker = m[1];
            let label = (m[2] || "").trim().replace(/[.,]$/g, "");
            const isChecked = marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";

            if (isSingleCheckbox) {
              const keyRegex = new RegExp(foundKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
              label = label.replace(keyRegex, "").trim();
              const prefix = isChecked ? "Oui" : "Non";
              checkedLabels.push(label ? `${prefix} | ${label}` : prefix);
            } else {
              if (isChecked && label) checkedLabels.push(label);
            }
          }

          currentSection[targetProp] = checkedLabels.length > 0
            ? (checkedLabels.length === 1 ? checkedLabels[0] : checkedLabels.join(", "))
            : null;

          this.processAdditionalFields(trimmedLine, foundKey, targetProp, currentSection, currentSectionConfig);
        }
      }
    }

    return result as unknown as PatientData;
  }
}
