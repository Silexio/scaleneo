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

  it("lit une taille notée en mètres comme les kinés l'écrivent", () => {
    const anthropometrie = (taille: string) =>
      PatientParser.parse(`SECTION 2: ANTHROPOMÉTRIE\nPoids (kg): 92\nTaille (cm): ${taille}`).section2;

    expect(anthropometrie("1m81").taille).toBe(1.81);
    expect(anthropometrie("1 m 81").taille).toBe(1.81);
    expect(anthropometrie("1m81").imc).toBeCloseTo(28.1, 1);
    expect(anthropometrie("181 cm").imc).toBeCloseTo(28.1, 1);
  });

  it("laisse l'IMC vide plutôt que de sortir une valeur impossible", () => {
    const data = PatientParser.parse(
      fill([
        [/^Poids \(kg\): .*$/m, "Poids (kg): 92"],
        [/^Taille \(cm\): .*$/m, "Taille (cm): 1"],
      ]),
    );

    expect(data.section2.imc).toBeNull();
  });

  it("lit une case cochée placée après son libellé", () => {
    const profession = (ligne: string) =>
      PatientParser.parse(`SECTION 1: ADMINISTRATIF\n${ligne}`).section1.profession;

    expect(profession("Profession: Manuel [X] | Non-manuel [ ] | Hybride [ ]")).toBe("Manuel");
    expect(profession("Profession: Manuel ☒ | Non-manuel ☐")).toBe("Manuel");
    expect(profession("Profession: ☐ Manuel | ☒ Non-manuel | ☐ Hybride")).toBe("Non-manuel");
  });

  it("extrait le trimestre noté entre parenthèses", () => {
    const data = PatientParser.parse(
      "SECTION 8: DRAPEAUX ROUGES\nGrossesse: ☐ N/A ☒ Oui (trimestre:2) | Adaptations: éviter décubitus",
    );

    expect(data.section8.grossesse).toBe(true);
    expect(data.section8.trimestreGrossesse).toBe(2);
  });

  it("ne prend pas les mentions de signature du template pour des valeurs", () => {
    const data = PatientParser.parse(TEMPLATE);

    expect(data.section18.modifiePar).toBeNull();
    expect(data.section18.dateModification).toBeNull();
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
