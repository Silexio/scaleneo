import { describe, expect, it } from "vitest";
import { extractMetricsFromTxt } from "./metricsParser";

describe("extractMetricsFromTxt", () => {
  it("extrait les scores des questionnaires validés", () => {
    const metrics = extractMetricsFromTxt(
      [
        "ODI Score (Oswestry Disability Index, 0-100): 48",
        "CSI Score (Central Sensitization Inventory, 0-100): 52",
        "NRS Douleur Maximum: 8",
      ].join("\n"),
    );

    expect(metrics).toMatchObject({ odi: 48, csi: 52, nrsMax: 8 });
  });

  it("conserve la précision décimale du WAI", () => {
    const metrics = extractMetricsFromTxt("WAI Score (Working Alliance Inventory, 0-100): 78.5");

    expect(metrics.wai).toBe(78.5);
  });

  it("n'invente aucune métrique quand le fichier n'en contient pas", () => {
    expect(extractMetricsFromTxt("Aucun score dans ce document")).toEqual({});
  });

  it("distingue la douleur au repos, à l'activité et maximale", () => {
    const metrics = extractMetricsFromTxt(
      [
        "NRS Douleur au Repos: 4",
        "NRS Douleur à l'Activité: 7",
        "NRS Douleur Maximum: 8",
      ].join("\n"),
    );

    expect(metrics).toMatchObject({ nrsRepos: 4, nrsActivite: 7, nrsMax: 8 });
  });
});
