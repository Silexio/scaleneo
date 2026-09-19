import type { PatientData } from "@/types/patient";

interface SectionData {
  [key: string]: string | string[] | boolean | number | null;
}

/**
 * Maps search terms (found in the bilan text file) to property names in the JSON output.
 * Key = text to search for in the file (case-insensitive), value = property name.
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
    "inclinaison latérale d": "inclinaisonDroit",
    "inclinaison latérale d nrs": "inclinaisonDroitNrs",
    "inclinaison latérale g": "inclinaisonGauche",
    "inclinaison latérale g nrs": "inclinaisonGaucheNrs",
    "inclinaison d": "inclinaisonDroit",
    "inclinaison d nrs": "inclinaisonDroitNrs",
    "inclinaison g": "inclinaisonGauche",
    "inclinaison g nrs": "inclinaisonGaucheNrs",
    "rotation d": "rotationDroit",
    "rotation d nrs": "rotationDroitNrs",
    "rotation g": "rotationGauche",
    "rotation g nrs": "rotationGaucheNrs",
    "combinaison de mouvements": "mouvementsCombines",
    "combinaison de mouvements nrs": "mouvementsCombinesNrs",
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
    "derniers 3 mois": "joursAbsence3Mois",
    "6 mois": "joursAbsence6Mois",
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

const CHECKBOX_REGEX = /(☒|☑|☐|\[x\]|\[ \])\s*([^☒☑☐[\]|:]+)/gi;
const CHECKBOX_MARKER = /☒|☑|☐|\[x\]|\[ \]/i;
const EMOJI_NOISE = /[⚠️✅❌]/g;
const PLACEHOLDER = /à remplir|auto-calc|^signature\/initiales|^date$/i;
const INLINE_SUBFIELD = /\(([^():|]+):([^()]*)\)/g;
const TRAILING_CHECKBOX = /([^|]+?)\s*(☒|☑|☐|\[x\]|\[ \])\s*(?=\||$)/gi;
const METRE_NOTATION = /^(\d)\s*m\s*(\d{1,2})$/i;

const MIN_PLAUSIBLE_BMI = 10;
const MAX_PLAUSIBLE_BMI = 80;

const GENERIC_SUBFIELDS = new Set(["nrs", "localisation", "détails", "met", "debout", "marche", "scores"]);

const NUMERIC_PROPS = new Set([
  "anneeNaissance", "age", "poids", "taille", "imc",
  "nrsRepos", "nrsActivite", "nrsMax",
  "flexionAvantNrs", "extensionNrs", "inclinaisonDroitNrs", "inclinaisonGaucheNrs",
  "rotationDroitNrs", "rotationGaucheNrs", "mouvementsCombinesNrs", "mobiliteSegmentaireNrs", "hancheNrs",
  "slrDroit", "slrGauche", "asymetrieSlr",
  "testSorensen", "testItoShirado", "coreStrengthIndex",
  "scoreSBT", "scoreCSI", "scoreODI", "scorePCS", "scoreAnxiete", "scoreDepression",
  "scoreFabqTravail", "scoreFabqActivite", "scoreWAI", "scoreIPAQ_MET",
  "pgic", "satisfaction",
  "dureeTotale", "frequence", "nbSeances",
  "tempsAssis", "tempsDebout", "tempsMarche", "tempsAssisQuotidien", "tempsEcran"
]);

/**
 * Parses SCALENEO clinical assessment text files into a structured PatientData object.
 *
 * Handles section headers, "Clé: valeur" lines, checkbox lines (☒/☑/☐/[x]),
 * pipe-separated sub-fields (including nested "Clé: Sous-clé: valeur" forms),
 * computes the auto-calc fields (IMC, asymétrie SLR, Core Strength Index)
 * and normalizes numeric fields polluted by units, emojis or annotations.
 *
 * Section 18 (contrôle qualité) is recomputed from the actual extraction result:
 * the self-reported values of the fiche are overwritten by measured coverage.
 */
export class PatientParser {

  public static parse(fileContent: string): PatientData {
    const result: Record<string, SectionData> = {};
    for (let i = 1; i <= 18; i++) result[`section${i}`] = {};

    let sectionConfig: Record<string, string> | null = null;
    let currentSection: SectionData | null = null;
    let lastProp: string | null = null;

    for (const rawLine of fileContent.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;

      const sectionMatch = line.match(/^=*\s*SECTION\s+(\d+)/i);
      if (sectionMatch) {
        sectionConfig = PARSER_CONFIG[`SECTION ${sectionMatch[1]}`] ?? null;
        currentSection = result[`section${sectionMatch[1]}`] ?? null;
        lastProp = null;
        continue;
      }
      if (!sectionConfig || !currentSection) continue;

      lastProp = this.parseLine(line, sectionConfig, currentSection, lastProp) ?? lastProp;
    }

    this.normalizeNumericFields(result);
    this.computeAutoCalcFields(result);
    this.computeQualityControl(result);
    return result as unknown as PatientData;
  }

  private static parseLine(
    line: string,
    config: Record<string, string>,
    section: SectionData,
    lastProp: string | null
  ): string | null {
    const markerIndex = line.search(CHECKBOX_MARKER);
    const colonIndex = line.indexOf(":");
    const markerFirst = markerIndex !== -1 && (colonIndex === -1 || markerIndex < colonIndex);

    if (markerFirst && line.slice(0, markerIndex).replace(/[-\s]/g, "") === "") {
      this.parseCheckboxOnlyLine(line, config, section);
      return null;
    }

    let keyZone: string;
    let value: string;
    if (markerFirst) {
      keyZone = line.slice(0, markerIndex);
      value = line.slice(markerIndex);
    } else if (colonIndex !== -1) {
      keyZone = line.slice(0, colonIndex);
      value = line.slice(colonIndex + 1);
    } else {
      return null;
    }

    const foundKey = this.findConfigKey(keyZone.trim().toLowerCase(), config);
    if (!foundKey) return null;

    let targetProp = config[foundKey];
    if (targetProp === "typesExercices" && lastProp === "hasNeurodynamique") {
      targetProp = "typesNeurodynamique";
    }

    this.assignValue(value, foundKey, targetProp, config, section);
    return targetProp;
  }

  private static findConfigKey(keyZone: string, config: Record<string, string>): string | undefined {
    return Object.keys(config)
      .filter(k => keyZone.includes(k.toLowerCase()))
      .sort((a, b) => b.length - a.length)[0];
  }

  private static parseCheckboxOnlyLine(
    line: string,
    config: Record<string, string>,
    section: SectionData
  ): void {
    for (const m of line.matchAll(new RegExp(CHECKBOX_REGEX.source, CHECKBOX_REGEX.flags))) {
      const label = (m[2] || "").trim().replace(/[.,]$/, "").toLowerCase();
      const key = Object.keys(config)
        .filter(k => label.includes(k.toLowerCase()))
        .sort((a, b) => b.length - a.length)[0];
      if (key) section[config[key]] = this.isChecked(m[1]);
    }
  }

  private static assignValue(
    value: string,
    foundKey: string,
    targetProp: string,
    config: Record<string, string>,
    section: SectionData
  ): void {
    if (PLACEHOLDER.test(value) && value.toLowerCase().includes("auto-calc")) {
      section[targetProp] = null;
      return;
    }

    const mainParts: string[] = [];
    for (const segment of value.replace(INLINE_SUBFIELD, " | $1: $2").split("|").map(s => s.trim()).filter(Boolean)) {
      const remainder = this.consumeSubField(segment, foundKey, targetProp, config, section, mainParts.length > 0);
      if (remainder !== null) mainParts.push(remainder);
    }

    section[targetProp] = mainParts.length ? this.extractValue(mainParts.join(" | ")) : null;
  }

  private static consumeSubField(
    segment: string,
    foundKey: string,
    targetProp: string,
    config: Record<string, string>,
    section: SectionData,
    hasMain: boolean
  ): string | null {
    const colonIndex = segment.indexOf(":");
    if (colonIndex === -1) return this.consumeKeyPrefixedSegment(segment, targetProp, config, section);

    const name = segment.slice(0, colonIndex).trim();
    const segValue = segment.slice(colonIndex + 1).trim();
    const cleanName = name.replace(new RegExp(CHECKBOX_MARKER.source, "gi"), "").trim().toLowerCase();
    if (!cleanName) return segment;

    if (CHECKBOX_MARKER.test(name)) {
      const exactKey = Object.keys(config).find(k => k.toLowerCase() === cleanName);
      if (exactKey && config[exactKey] !== targetProp) {
        const marker = name.match(CHECKBOX_MARKER)?.[0] ?? "☐";
        section[config[exactKey]] = segValue ? this.extractValue(segValue) : this.isChecked(marker);
        return null;
      }
      return segment;
    }

    const normalized = this.normalizeSubFieldName(cleanName);
    const prop = this.resolveSubFieldProp(normalized, cleanName, foundKey, config);

    if (prop && prop !== targetProp) {
      section[prop] = segValue ? this.extractValue(segValue) : true;
      return null;
    }
    if (prop === targetProp && !hasMain) return segValue;

    const parsed = this.cleanValue(segValue);
    const isDescriptiveLabel = GENERIC_SUBFIELDS.has(normalized)
      || typeof parsed === "number"
      || typeof parsed === "boolean";
    return !hasMain && isDescriptiveLabel ? segValue : segment;
  }

  private static consumeKeyPrefixedSegment(
    segment: string,
    targetProp: string,
    config: Record<string, string>,
    section: SectionData
  ): string | null {
    if (CHECKBOX_MARKER.test(segment)) return segment;

    const lower = segment.toLowerCase();
    const key = Object.keys(config)
      .filter(k => {
        const kl = k.toLowerCase();
        return lower.startsWith(kl) && lower.length > kl.length && /\s/.test(lower[kl.length]);
      })
      .sort((a, b) => b.length - a.length)[0];

    if (!key || config[key] === targetProp || section[config[key]] != null) return segment;

    const rest = segment.slice(key.length).trim();
    if (!rest) return segment;

    section[config[key]] = this.extractValue(rest);
    return null;
  }

  private static normalizeSubFieldName(name: string): string {
    if (name.includes("scores")) return "scores";
    if (name.includes("nrs") || name.includes("score")) return "nrs";
    if (name.includes("localisation")) return "localisation";
    if (name.includes("détail")) return "détails";
    if (name.includes("debout")) return "debout";
    if (name.includes("marche")) return "marche";
    if (name.includes("met")) return "met";
    return name;
  }

  private static resolveSubFieldProp(
    normalized: string,
    cleanName: string,
    foundKey: string,
    config: Record<string, string>
  ): string | null {
    const contextKey = `${foundKey} ${normalized}`.toLowerCase();
    const precise = Object.keys(config)
      .filter(k => k.toLowerCase() === contextKey || k.toLowerCase().includes(contextKey))
      .sort((a, b) => b.length - a.length)[0];
    if (precise) return config[precise];

    const fuzzy = Object.keys(config)
      .filter(k => {
        const kl = k.toLowerCase();
        if (kl.includes(" ") && !normalized.includes(" ")) return false;
        return normalized.includes(kl) || kl.includes(normalized) || cleanName.includes(kl);
      })
      .sort((a, b) => b.length - a.length)[0];
    return fuzzy ? config[fuzzy] : null;
  }

  private static extractValue(raw: string): string | boolean | number | null {
    const text = raw.replace(new RegExp(TRAILING_CHECKBOX.source, TRAILING_CHECKBOX.flags), "$2 $1");
    const labels: string[] = [];
    let foundCheckbox = false;

    for (const m of text.matchAll(new RegExp(CHECKBOX_REGEX.source, CHECKBOX_REGEX.flags))) {
      foundCheckbox = true;
      const label = (m[2] || "").trim().replace(/[.,]$/, "");
      if (this.isChecked(m[1]) && label) labels.push(label);
    }

    if (!foundCheckbox) {
      if (CHECKBOX_MARKER.test(text)) return null;
      return this.cleanValue(text);
    }
    if (labels.length === 0) return null;
    return labels.length === 1 ? this.cleanValue(labels[0]) : labels.join(", ");
  }

  private static cleanValue(raw: string): string | boolean | number | null {
    if (!raw) return null;

    const val = raw
      .replace(/\[([^\][]*)\]/g, "$1")
      .replace(EMOJI_NOISE, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (val === "" || PLACEHOLDER.test(val)) return null;

    const lower = val.toLowerCase();
    if (["oui", "yes", "true", "vrai"].includes(lower)) return true;
    if (["non", "no", "false", "faux"].includes(lower)) return false;

    const unitless = lower.replace(/\s*(ans|years|kg\.?|cm\.?|s|sec|secondes?|°|degrés?)\s*$/, "").trim();
    const num = Number(unitless.replace(",", "."));
    if (unitless !== "" && !unitless.includes(" ") && !isNaN(num)) return num;

    return val;
  }

  private static isChecked(marker: string): boolean {
    return marker === "☒" || marker === "☑" || marker.toLowerCase() === "[x]";
  }

  private static toNumeric(
    value: string | string[] | boolean | number | null
  ): string | string[] | boolean | number | null {
    if (typeof value !== "string") return value;
    const match = value.replace(EMOJI_NOISE, "").trim().match(/^(-?\d+(?:[.,]\d+)?)/);
    return match ? Number(match[1].replace(",", ".")) : value;
  }

  private static toHeight(
    value: string | string[] | boolean | number | null
  ): string | string[] | boolean | number | null {
    if (typeof value !== "string") return value;
    const metreNotation = value.trim().match(METRE_NOTATION);
    if (!metreNotation) return this.toNumeric(value);
    return Number(`${metreNotation[1]}.${metreNotation[2].padEnd(2, "0")}`);
  }

  private static normalizeNumericFields(result: Record<string, SectionData>): void {
    for (const section of Object.values(result)) {
      for (const prop of Object.keys(section)) {
        if (prop === "taille") section[prop] = this.toHeight(section[prop]);
        else if (NUMERIC_PROPS.has(prop)) section[prop] = this.toNumeric(section[prop]);
      }
    }
  }

  private static computeAutoCalcFields(result: Record<string, SectionData>): void {
    const s2 = result.section2;
    if (s2.imc == null && typeof s2.poids === "number" && typeof s2.taille === "number") {
      const metres = s2.taille > 3 ? s2.taille / 100 : s2.taille;
      const imc = Math.round((s2.poids / (metres * metres)) * 10) / 10;
      if (metres > 0 && imc >= MIN_PLAUSIBLE_BMI && imc <= MAX_PLAUSIBLE_BMI) s2.imc = imc;
    }

    const s6 = result.section6;
    if (s6.asymetrieSlr == null && typeof s6.slrDroit === "number" && typeof s6.slrGauche === "number") {
      s6.asymetrieSlr = Math.abs(s6.slrDroit - s6.slrGauche);
    }
    if (
      s6.coreStrengthIndex == null &&
      typeof s6.testItoShirado === "number" &&
      typeof s6.testSorensen === "number" &&
      s6.testSorensen > 0
    ) {
      s6.coreStrengthIndex = Math.round((s6.testItoShirado / s6.testSorensen) * 100) / 100;
    }
  }

  private static computeQualityControl(result: Record<string, SectionData>): void {
    let total = 0;
    let filled = 0;
    let unresolved = 0;

    for (let i = 1; i <= 17; i++) {
      const section = result[`section${i}`];
      for (const prop of new Set(Object.values(PARSER_CONFIG[`SECTION ${i}`]))) {
        total++;
        const val = section[prop];
        if (val === null || val === undefined || val === "") continue;
        filled++;
        if (typeof val === "string" && PLACEHOLDER.test(val)) unresolved++;
      }
    }

    const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
    const s18 = result.section18;
    s18.confianceExtraction = pct;
    s18.isComplete = filled === total && unresolved === 0;
    s18.needsReview = pct < 90 || unresolved > 0;
  }
}
