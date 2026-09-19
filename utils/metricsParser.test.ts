import { describe, expect, it } from "vitest";
import { extractMetricsFromTxt } from "./metricsParser";

const fiche = (section: number, ...lines: string[]) =>
  [`SECTION ${section}: TEST`, ...lines].join("\n");

describe("extractMetricsFromTxt", () => {
  it("extrait les scores des questionnaires validés", () => {
    const metrics = extractMetricsFromTxt(
      fiche(
        7,
        "ODI Score (Oswestry Disability Index, 0-100): 48",
        "CSI Score (Central Sensitization Inventory, 0-100): 52",
        "SBT (STarT Back Screening Tool, 0-9): 6",
      ),
    );

    expect(metrics).toMatchObject({ odi: 48, csi: 52, sbt: 6 });
  });

  it("conserve la précision décimale du WAI", () => {
    const metrics = extractMetricsFromTxt(
      fiche(7, "WAI Score (Work Ability Index, 0-100): 78.5"),
    );

    expect(metrics.wai).toBe(78.5);
  });

  it("ignore les annotations qui suivent la valeur", () => {
    const metrics = extractMetricsFromTxt(
      fiche(7, "HADS Score Anxiété (0-21): 8 (limite, à surveiller)"),
    );

    expect(metrics.hadsAnxiete).toBe(8);
  });

  it("distingue la douleur au repos, à l'activité et maximale", () => {
    const metrics = extractMetricsFromTxt(
      fiche(
        4,
        "NRS Douleur au Repos: 4",
        "NRS Douleur à l'Activité: 7",
        "NRS Douleur Maximum: 8",
      ),
    );

    expect(metrics).toMatchObject({ nrsRepos: 4, nrsActivite: 7, nrsMax: 8 });
  });

  it("suit aussi les mesures fonctionnelles de la section 6", () => {
    const metrics = extractMetricsFromTxt(
      fiche(
        6,
        "Sorensen (secondes): 45",
        "Ito Shirado (secondes): 30",
        "SLR Droit (degrés): 65",
        "SLR Gauche (degrés): 58",
      ),
    );

    expect(metrics.testSorensen).toBe(45);
    expect(metrics.testItoShirado).toBe(30);
    expect(metrics.coreStrengthIndex).toBeCloseTo(0.67, 2);
    expect(metrics.asymetrieSlr).toBe(7);
  });

  it("n'invente aucune métrique quand le document n'est pas une fiche", () => {
    expect(extractMetricsFromTxt("Aucun score dans ce document")).toEqual({});
  });

  it("ne retient pas un score laissé en placeholder", () => {
    expect(extractMetricsFromTxt(fiche(7, "ODI Score (Oswestry Disability Index, 0-100): [À remplir]"))).toEqual({});
  });
});
