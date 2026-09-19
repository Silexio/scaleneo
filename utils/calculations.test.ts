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

  describe("absences documentées", () => {
    it("ne classe pas en post-traumatique un mode d'apparition nié", () => {
      const nie = patientWith("section3", { modeApparition: "non traumatique, progressif" });
      const affirme = patientWith("section3", { modeApparition: "traumatisme par chute" });

      expect(generateHypothesis(nie).pathology).toContain("non-spécifique");
      expect(generateHypothesis(affirme).pathology).toContain("post-traumatique");
    });

    it("ne retient pas un facteur contribuant que le kiné a écarté", () => {
      const aucun = patientWith("section14", { facteursPsycho: "Aucun", facteursBiomeca: "Aucun" });
      const present = patientWith("section14", { facteursPsycho: "Catastrophisme" });

      expect(generateHypothesis(aucun).contributingFactors).toContain("Pas de facteurs contribuants");
      expect(generateHypothesis(present).contributingFactors).toContain("Facteurs Psychosociaux");
    });

    it("ne signale pas de limitation quand aucune activité n'est cochée", () => {
      const aucune = patientWith("section13", { activitesQuotidiennes: "Aucune" });
      const limitee = patientWith("section13", { activitesQuotidiennes: "Marche" });

      expect(generateHypothesis(aucune).activityParticipation).toContain("préservée");
      expect(generateHypothesis(limitee).activityParticipation).toContain("significatives");
    });

    it("ne lit pas une flexion niée comme une flexion normale", () => {
      const nie = patientWith("section6", { flexionAvant: "non complet, limité à 20 cm" });
      const normal = patientWith("section6", { flexionAvant: "complet" });

      expect(generateHypothesis(nie).impairments).toContain("Déficit Flexion");
      expect(generateHypothesis(normal).impairments).toContain("Pas de déficits majeurs");
    });
  });

  describe("déficit de force", () => {
    it("détecte un déficit unilatéral malgré un côté coté 5/5", () => {
      const patient = patientWith("section6", { forceMusculaire: "D 4/5, G 5/5" });

      expect(generateHypothesis(patient).impairments).toContain("Déficit Force");
    });

    it("ne déduit pas un déficit d'un test non réalisé", () => {
      const patient = patientWith("section6", { forceMusculaire: "non testé" });

      expect(generateHypothesis(patient).impairments).not.toContain("Déficit Force");
    });
  });

  describe("pronostic", () => {
    it("fait primer un drapeau rouge sur les facteurs pronostiques positifs", () => {
      const patient = {
        ...emptyPatient(),
        section3: { modeApparition: "traumatisme par chute" },
        section12: { facteursPositifs: "bonne motivation" },
      } as unknown as PatientData;

      expect(generateHypothesis(patient).managementPrognosis).toContain("Pronostic réservé");
    });

    it("signale un risque de chronicité dès que des yellow flags sont décrits", () => {
      const patient = patientWith("section12", { detailYellowFlags: "peur du mouvement, arrêt prolongé" });

      expect(generateHypothesis(patient).managementPrognosis).toContain("Yellow Flags");
    });

    it("reste favorable quand seuls des facteurs positifs sont documentés", () => {
      const patient = patientWith("section12", { facteursPositifs: "bonne motivation" });

      expect(generateHypothesis(patient).managementPrognosis).toContain("Pronostic favorable");
    });
  });

  it("priorise l'éducation quand la compréhension est niée malgré un mot positif", () => {
    const patient = patientWith("section11", { comprehensionDiagnostic: "Non, mais bonne volonté" });

    expect(generateHypothesis(patient).patientsPerspectives).toContain("Compréhension limitée");
  });
});
