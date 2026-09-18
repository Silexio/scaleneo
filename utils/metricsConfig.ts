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
        label: "Alliance (WAI)",
        mcid: 10,
        direction: "up",
        min: 0,
        max: 100,
        color: "var(--metric-alliance)",
    },
};
