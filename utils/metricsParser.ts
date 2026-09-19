import { PatientParser } from "./parser";

type MetricSource = readonly [metric: string, section: string, field: string];

const METRIC_SOURCES: ReadonlyArray<MetricSource> = [
  ["nrsRepos", "section4", "nrsRepos"],
  ["nrsActivite", "section4", "nrsActivite"],
  ["nrsMax", "section4", "nrsMax"],
  ["asymetrieSlr", "section6", "asymetrieSlr"],
  ["testSorensen", "section6", "testSorensen"],
  ["testItoShirado", "section6", "testItoShirado"],
  ["coreStrengthIndex", "section6", "coreStrengthIndex"],
  ["sbt", "section7", "scoreSBT"],
  ["csi", "section7", "scoreCSI"],
  ["odi", "section7", "scoreODI"],
  ["pcs", "section7", "scorePCS"],
  ["hadsAnxiete", "section7", "scoreAnxiete"],
  ["hadsDepression", "section7", "scoreDepression"],
  ["fabqTravail", "section7", "scoreFabqTravail"],
  ["fabqActivite", "section7", "scoreFabqActivite"],
  ["wai", "section7", "scoreWAI"],
  ["ipaqMet", "section7", "scoreIPAQ_MET"],
];

/**
 * Extracts the trackable numeric metrics of a SCALENEO assessment file.
 *
 * Reads through PatientParser so that extraction, analysis and comparison can never
 * disagree on what a fiche contains; a document without SCALENEO sections yields nothing.
 *
 * @param content - Raw text content of an assessment file
 * @returns Metric keys mapped to their numeric value, absent metrics omitted
 */
export const extractMetricsFromTxt = (content: string): Record<string, number> => {
  const data = PatientParser.parse(content) as unknown as Record<string, Record<string, unknown>>;
  const metrics: Record<string, number> = {};

  for (const [metric, section, field] of METRIC_SOURCES) {
    const value = data[section]?.[field];
    if (typeof value === "number" && Number.isFinite(value)) metrics[metric] = value;
  }

  return metrics;
};
