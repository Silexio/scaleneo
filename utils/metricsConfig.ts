/**
 * Metrics configuration for clinical assessments
 *
 * Each metric includes:
 * - label: Display name
 * - mcid: Minimum Clinically Important Difference
 * - direction: Whether improvement is "up" or "down"
 * - min/max: Valid range for the metric
 * - color: Chart stroke, read from the global metric tokens in globals.css
 */

export interface MetricConfig {
    label: string;
    mcid: number;
    direction: "up" | "down";
    min: number;
    max: number;
    color: string;
}

export type MetricKey =
    | "nrsRepos"
    | "nrsActivite"
    | "nrsMax"
    | "odi"
    | "csi"
    | "pcs"
    | "fabqTravail"
    | "hadsAnxiete"
    | "hadsDepression"
    | "fabqActivite"
    | "wai";

export const METRICS_CONFIG: Record<MetricKey, MetricConfig> = {
    nrsRepos: {
        label: "Douleur au repos (NRS)",
        mcid: 2,
        direction: "down",
        min: 0,
        max: 10,
        color: "var(--metric-pain-rest)",
    },
    nrsActivite: {
        label: "Douleur à l'activité (NRS)",
        mcid: 2,
        direction: "down",
        min: 0,
        max: 10,
        color: "var(--metric-pain-activity)",
    },
    nrsMax: {
        label: "Douleur (NRS Max)",
        mcid: 2,
        direction: "down",
        min: 0,
        max: 10,
        color: "var(--metric-pain)",
    },
    odi: {
        label: "Incapacité (ODI)",
        mcid: 10,
        direction: "down",
        min: 0,
        max: 100,
        color: "var(--metric-disability)",
    },
    csi: {
        label: "Sensibilisation (CSI)",
        mcid: 15,
        direction: "down",
        min: 0,
        max: 100,
        color: "var(--metric-sensitization)",
    },
    pcs: {
        label: "Catastrophisme (PCS)",
        mcid: 6,
        direction: "down",
        min: 0,
        max: 52,
        color: "var(--metric-catastrophizing)",
    },
    fabqTravail: {
        label: "Évitement (FABQ-W)",
        mcid: 12,
        direction: "down",
        min: 0,
        max: 100,
        color: "var(--metric-avoidance-work)",
    },
    hadsAnxiete: {
        label: "Anxiété (HADS-A)",
        mcid: 4,
        direction: "down",
        min: 0,
        max: 21,
        color: "var(--metric-anxiety)",
    },
    hadsDepression: {
        label: "Dépression (HADS-D)",
        mcid: 4,
        direction: "down",
        min: 0,
        max: 21,
        color: "var(--metric-depression)",
    },
    fabqActivite: {
        label: "Évitement (FABQ-A)",
        mcid: 12,
        direction: "down",
        min: 0,
        max: 100,
        color: "var(--metric-avoidance-activity)",
    },
    wai: {
        label: "Capacité de travail (WAI)",
        mcid: 10,
        direction: "up",
        min: 0,
        max: 100,
        color: "var(--metric-alliance)",
    },
};

export interface TrackedMeasure {
    label: string;
    direction: "up" | "down";
}

export type TrackedMeasureKey =
    | "sbt"
    | "asymetrieSlr"
    | "testSorensen"
    | "testItoShirado"
    | "coreStrengthIndex"
    | "ipaqMet";

/**
 * Measures followed across assessments that have no published MCID.
 *
 * Kept apart from METRICS_CONFIG so a raw evolution is never reported as a
 * clinically significant change.
 */
export const TRACKED_MEASURES: Record<TrackedMeasureKey, TrackedMeasure> = {
    sbt: { label: "Risque de chronicisation (SBT)", direction: "down" },
    asymetrieSlr: { label: "Asymétrie SLR (degrés)", direction: "down" },
    testSorensen: { label: "Endurance extenseurs (Sorensen, s)", direction: "up" },
    testItoShirado: { label: "Endurance fléchisseurs (Ito-Shirado, s)", direction: "up" },
    coreStrengthIndex: { label: "Core Strength Index (Ito/Sorensen)", direction: "up" },
    ipaqMet: { label: "Activité physique (IPAQ, MET-min/sem)", direction: "up" },
};
