import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PatientParser } from "./parser";

const TEMPLATE = readFileSync("public/documents/FICHE_BILAN_SCALENEO_TEMPLATE.txt", "utf8");

const fill = (replacements: Array<[RegExp, string]>): string =>
  replacements.reduce((text, [pattern, value]) => text.replace(pattern, value), TEMPLATE);

describe("PatientParser.parse", () => {
  it("produit les 18 sections quel que soit le contenu", () => {
    const data = PatientParser.parse("");

    expect(Object.keys(data)).toHaveLength(18);
    expect(data.section1).toEqual({});
  });

  it("laisse les placeholders à null plutôt que de les prendre pour des valeurs", () => {
    const data = PatientParser.parse(TEMPLATE);

    expect(data.section1.nomPatient).toBeNull();
    expect(data.section7.scoreODI).toBeNull();
  });

  it("extrait les champs administratifs renseignés", () => {
    const data = PatientParser.parse(
      fill([
        [/^Nom et prénom du Patient: .*$/m, "Nom et prénom du Patient: Jean Test"],
        [/^Age: .*$/m, "Age: 45"],
      ]),
    );

    expect(data.section1.nomPatient).toBe("Jean Test");
    expect(data.section1.age).toBe(45);
  });

  it("calcule l'IMC à partir du poids et de la taille en centimètres", () => {
    const data = PatientParser.parse(
      fill([
        [/^Poids \(kg\): .*$/m, "Poids (kg): 82"],
        [/^Taille \(cm\): .*$/m, "Taille (cm): 178"],
      ]),
    );

    expect(data.section2.imc).toBeCloseTo(25.9, 1);
  });

  it("calcule l'asymétrie SLR comme un écart absolu", () => {
    const data = PatientParser.parse(
      fill([
        [/^SLR Droit \(degrés\): .*$/m, "SLR Droit (degrés): 45"],
        [/^SLR Gauche \(degrés\): .*$/m, "SLR Gauche (degrés): 70"],
      ]),
    );

    expect(data.section6.asymetrieSlr).toBe(25);
  });

  it("sépare les jours d'absence en deux périodes distinctes", () => {
    const data = PatientParser.parse(
      "SECTION 13: ACTIVITÉS ET PARTICIPATION\nJours d'absence travail: Derniers 3 mois: 12 | 6 mois: 30",
    );

    expect(data.section13.joursAbsence3Mois).toBe(12);
    expect(data.section13.joursAbsence6Mois).toBe(30);
  });

  it("recalcule le contrôle qualité au lieu de faire confiance au fichier", () => {
    const data = PatientParser.parse(TEMPLATE);

    expect(data.section18.confianceExtraction).toBeTypeOf("number");
    expect(data.section18.isComplete).toBe(false);
    expect(data.section18.needsReview).toBe(true);
  });

  it("monte la confiance quand des champs sont réellement renseignés", () => {
    const vierge = PatientParser.parse(TEMPLATE);
    const rempli = PatientParser.parse(
      fill([
        [/^Nom et prénom du Patient: .*$/m, "Nom et prénom du Patient: Jean Test"],
        [/^Age: .*$/m, "Age: 45"],
        [/^Poids \(kg\): .*$/m, "Poids (kg): 82"],
      ]),
    );

    expect(rempli.section18.confianceExtraction).toBeGreaterThan(
      vierge.section18.confianceExtraction ?? 0,
    );
  });
});
