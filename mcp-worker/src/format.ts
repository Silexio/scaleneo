import type { PatientData } from "../../types/patient";
import type { DetectedRedFlag, DetectedRedFlags, generateHypothesis } from "../../utils/calculations";
import { interpretScore } from "../../utils/calculations";
import { SCORE_DEFINITIONS } from "../../utils/definitions";
import { FIELD_LABELS, SECTION_LABELS } from "../../utils/labels";
import { METRICS_CONFIG, type MetricKey } from "../../utils/metricsConfig";
import { flattenObject } from "../../utils/objectHelpers";

type Hypothesis = ReturnType<typeof generateHypothesis>;
type Section7Key = keyof PatientData["section7"];
type ScoreKey = keyof typeof SCORE_DEFINITIONS;

const SECTION_TITLES = Object.values(SECTION_LABELS);

const SCORE_FIELDS: ReadonlyArray<readonly [ScoreKey, Section7Key]> = [
  ["sbt", "scoreSBT"],
  ["csi", "scoreCSI"],
  ["odi", "scoreODI"],
  ["pcs", "scorePCS"],
  ["hadsAnxiete", "scoreAnxiete"],
  ["hadsDepression", "scoreDepression"],
  ["fabqTravail", "scoreFabqTravail"],
  ["fabqActivite", "scoreFabqActivite"],
  ["wai", "scoreWAI"],
];

const HYPOTHESIS_TITLES: Record<keyof Hypothesis, string> = {
  pathology: "Pathologie",
  sourcesOfSymptoms: "Sources des symptômes",
  painType: "Type de douleur",
  impairments: "Déficiences",
  painMechanisms: "Mécanismes de douleur",
  precautions: "Précautions",
  patientsPerspectives: "Perspectives du patient",
  activityParticipation: "Activité et participation",
  contributingFactors: "Facteurs contribuants",
  managementPrognosis: "Prise en charge et pronostic",
};

const SEVERITY_ORDER: Record<DetectedRedFlag["category"], number> = { CRITICAL: 0, HIGH: 1, MODERATE: 2 };

const isFilled = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== "";

const stripAnnotation = (value: string | number): string | number =>
  typeof value === "string" ? value.replace(/\s*\(.*\)\s*$/, "").trim() : value;

/** Renders parsed patient data as compact Markdown, omitting every empty field. */
export const formatSections = (data: PatientData): string => {
  const blocks = Object.entries(data).flatMap(([sectionKey, fields], index) => {
    const filled = Object.entries(fields as Record<string, unknown>).filter(([, value]) =>
      isFilled(value),
    );
    if (!filled.length) return [];

    const labels = FIELD_LABELS[sectionKey] ?? {};
    const rows = filled.map(([field, value]) => `- ${labels[field] ?? field} : ${value}`);
    return [`## ${SECTION_TITLES[index] ?? sectionKey}\n${rows.join("\n")}`];
  });

  return blocks.length ? blocks.join("\n\n") : "Aucune donnée exploitable dans ce document.";
};

/** Renders the validated questionnaire scores with their severity interpretation. */
export const formatScores = (data: PatientData): string => {
  const rows = SCORE_FIELDS.flatMap(([scoreKey, field]) => {
    const raw = data.section7[field];
    if (!isFilled(raw)) return [];

    const value = stripAnnotation(raw as string | number);
    const definition = SCORE_DEFINITIONS[scoreKey];
    const level = interpretScore(scoreKey, value);
    return [`- ${definition.label} : ${value}/${definition.max} — ${level?.label ?? "non interprété"}`];
  });

  return rows.length ? rows.join("\n") : "Aucun score renseigné.";
};

/** Renders detected red flags ordered by clinical severity. */
export const formatRedFlags = (flags: DetectedRedFlags): string => {
  const detected = Object.values(flags);
  if (!detected.length) return "Aucun drapeau rouge détecté.";

  return detected
    .sort((a, b) => SEVERITY_ORDER[a.category] - SEVERITY_ORDER[b.category])
    .map((flag) => `- [${flag.category}] ${flag.label} — ${flag.recommendation}`)
    .join("\n");
};

/** Renders the ten clinical hypothesis domains. */
export const formatHypothesis = (hypothesis: Hypothesis): string =>
  Object.entries(HYPOTHESIS_TITLES)
    .map(([key, title]) => `- ${title} : ${hypothesis[key as keyof Hypothesis]}`)
    .join("\n");

/** Renders metric evolution across assessments with MCID validation. */
export const formatEvolution = (series: ReadonlyArray<Record<string, number>>): string => {
  if (series.length < 2) return "Au moins deux bilans sont nécessaires pour une comparaison.";

  const rows = (Object.keys(METRICS_CONFIG) as MetricKey[]).flatMap((key) => {
    const values = series.map((entry) => entry[key]).filter((value) => value !== undefined);
    if (values.length < 2) return [];

    const config = METRICS_CONFIG[key];
    const first = values[0];
    const last = values[values.length - 1];
    const delta = last - first;
    const gain = config.direction === "down" ? -delta : delta;
    const verdict = gain >= config.mcid
      ? `amélioration cliniquement significative (MCID ${config.mcid})`
      : gain <= -config.mcid
        ? `dégradation cliniquement significative (MCID ${config.mcid})`
        : `variation non significative (MCID ${config.mcid})`;

    const sign = delta > 0 ? "+" : "";
    return [`- ${config.label} : ${first} → ${last} (${sign}${delta}) — ${verdict}`];
  });

  return rows.length ? rows.join("\n") : "Aucune métrique commune entre les bilans fournis.";
};

const escapeCsv = (value: unknown): string => {
  const text = value === undefined || value === null ? "" : String(value);
  return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Renders patient data as a two-line CSV, one column per clinical variable. */
export const toCsv = (data: PatientData): string => {
  const flat = flattenObject(data as unknown as Record<string, unknown>);
  const keys = Object.keys(flat);
  return `${keys.join(";")}\n${keys.map((key) => escapeCsv(flat[key])).join(";")}`;
};
