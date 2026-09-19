import { describe, expect, it } from "vitest";
import type { PatientData } from "@/types/patient";
import { detectRedFlags, generateHypothesis, interpretScore } from "./calculations";
import { PatientParser } from "./parser";

const emptyPatient = (): PatientData =>
  Object.fromEntries(
    Array.from({ length: 18 }, (_, i) => [`section${i + 1}`, {}]),
  ) as unknown as PatientData;

const patientWith = (section: keyof PatientData, fields: Record<string, unknown>): PatientData => ({
  ...emptyPatient(),
  [section]: fields,
});

describe("detectRedFlags", () => {
  it("ne signale rien sur un bilan vide", () => {
    expect(detectRedFlags(emptyPatient())).toEqual({});
  });

  it("ignore les noms de champs, qui sont structurels et non cliniques", () => {
    const patient = patientWith("section15", { progressionGAS: "stable" });

    expect(detectRedFlags(patient).progressive_neuro).toBeUndefined();
  });

  it("ignore les champs vides, nuls et non renseignés", () => {
    const patient = patientWith("section8", {
      detailsRedFlags: "",
      contreIndications: null,
      allergies: undefined,
    });

    expect(detectRedFlags(patient)).toEqual({});
  });

  it("détecte un traumatisme décrit dans une valeur", () => {
    const patient = patientWith("section3", { modeApparition: "Traumatisme par chute" });
    const flags = detectRedFlags(patient);

    expect(flags.trauma_fracture?.detected).toBe(true);
    expect(flags.trauma_fracture?.category).toBe("CRITICAL");
  });

  it("compte chaque terme correspondant une seule fois", () => {
    const patient = patientWith("section3", { modeApparition: "traumatisme, chute et fracture" });

    expect(detectRedFlags(patient).trauma_fracture?.matchCount).toBe(3);
  });

  it("classe les drapeaux selon leur sévérité clinique", () => {
    const patient = patientWith("section8", {
      detailsRedFlags: "Antécédent de cancer",
      contreIndications: "Diabète de type 2",
    });
    const flags = detectRedFlags(patient);

    expect(flags.malignancy?.category).toBe("HIGH");
    expect(flags.systemic_disease?.category).toBe("MODERATE");
  });

  it("ne lève aucun drapeau quand le praticien documente leur absence", () => {
    const patient = patientWith("section16", {
      observationsGlobales: "Pas de fièvre, pas de perte poids. Aucun traumatisme rapporté. Fracture écartée.",
    });

    expect(detectRedFlags(patient)).toEqual({});
  });

  it("n'attribue pas au patient l'antécédent d'un proche", () => {
    const patient = patientWith("section16", { observationsGlobales: "Mère décédée d'un cancer du sein" });

    expect(detectRedFlags(patient).malignancy).toBeUndefined();
  });

  it("lève le drapeau malgré une absence documentée dans la même phrase", () => {
    const patient = patientWith("section16", {
      observationsGlobales: "Pas de fièvre mais traumatisme récent",
    });

    expect(detectRedFlags(patient).trauma_fracture?.detected).toBe(true);
    expect(detectRedFlags(patient).infection_fever).toBeUndefined();
  });

  it("cherche dans toutes les sections, pas uniquement la section drapeaux rouges", () => {
    const patient = patientWith("section16", { observationsGlobales: "Fièvre vespérale" });

    expect(detectRedFlags(patient).infection_fever?.detected).toBe(true);
  });
});

describe("interpretScore", () => {
  it("distingue une absence de score d'un score à zéro", () => {
    expect(interpretScore("odi", undefined)).toBeNull();
    expect(interpretScore("odi", 0)?.label).toBe("Minime");
  });

  it("retient le niveau le plus élevé atteint", () => {
    expect(interpretScore("odi", 19)?.label).toBe("Minime");
    expect(interpretScore("odi", 20)?.label).toBe("Léger");
    expect(interpretScore("odi", 45)?.label).toBe("Modéré");
    expect(interpretScore("odi", 85)?.label).toBe("Très Sévère");
  });

  it("rejette une valeur non numérique plutôt que de la traiter comme zéro", () => {
    expect(interpretScore("odi", "non renseigné")).toBeNull();
  });

  it("interprète un score identiquement qu'il arrive en texte ou en nombre", () => {
    expect(interpretScore("wai", "78.5")).toEqual(interpretScore("wai", 78.5));
    expect(interpretScore("odi", "45")).toEqual(interpretScore("odi", 45));
  });

  it("ignore les annotations qui suivent la valeur", () => {
    expect(interpretScore("odi", "45 (modéré)")).toEqual(interpretScore("odi", 45));
  });
});

describe("generateHypothesis", () => {
  it("lit une case à cocher sans se fier au type de la valeur", () => {
    const coche = PatientParser.parse(
      "SECTION 11: PERSPECTIVES\nCompréhension du diagnostic par le patient: ☒ Oui ☐ Partiellement ☐ Non",
    );
    const decoche = PatientParser.parse(
      "SECTION 11: PERSPECTIVES\nCompréhension du diagnostic par le patient: ☐ Oui ☐ Partiellement ☒ Non",
    );

    expect(coche.section11.comprehensionDiagnostic).toBe(true);
    expect(generateHypothesis(coche).patientsPerspectives).toContain("Bon niveau");
    expect(generateHypothesis(decoche).patientsPerspectives).toContain("Compréhension limitée");
  });

  it("distingue une case décochée d'un champ non renseigné", () => {
    const vide = PatientParser.parse("SECTION 11: PERSPECTIVES\nCompréhension du diagnostic par le patient: [À remplir]");

    expect(generateHypothesis(vide).patientsPerspectives).toContain("à clarifier");
  });

  it("signale les précautions quand un drapeau rouge est présent", () => {
    const patient = patientWith("section3", { modeApparition: "Traumatisme" });

    expect(generateHypothesis(patient).precautions).toContain("AVERTISSEMENT");
  });

  it("ne signale aucune précaution sur un bilan vide", () => {
    expect(generateHypothesis(emptyPatient()).precautions).toContain("Pas de contre-indication");
  });

  it("qualifie la sensibilisation centrale à partir du CSI", () => {
    const dominant = patientWith("section7", { scoreCSI: 45 });
    const pur = patientWith("section7", { scoreCSI: 10 });

    expect(generateHypothesis(dominant).painType).toContain("Sensibilisation Centrale");
    expect(generateHypothesis(pur).painType).toContain("Nociceptif mécanique pur");
  });
});
