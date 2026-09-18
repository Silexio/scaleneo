import { describe, expect, it } from "vitest";
import { countAffirmedTerms, toClinicalSegments } from "./redFlagMatching";

const count = (text: string, ...terms: string[]) =>
  countAffirmedTerms(toClinicalSegments([text]), terms);

describe("countAffirmedTerms", () => {
  it("compte un terme affirmé", () => {
    expect(count("Traumatisme par chute dans les escaliers", "traumatisme")).toBe(1);
  });

  it("compte chaque terme distinct une seule fois", () => {
    expect(count("traumatisme avec fracture et chute", "traumatisme", "fracture", "chute")).toBe(3);
    expect(count("fracture, fracture ancienne", "fracture")).toBe(1);
  });

  describe("négation", () => {
    it("ignore un terme nié avant", () => {
      expect(count("Pas de fièvre", "fièvre")).toBe(0);
      expect(count("Aucun traumatisme rapporté", "traumatisme")).toBe(0);
      expect(count("Sans perte poids", "perte poids")).toBe(0);
      expect(count("Absence de fracture", "fracture")).toBe(0);
    });

    it("ignore un terme écarté après", () => {
      expect(count("Fracture écartée", "fracture")).toBe(0);
      expect(count("Cancer exclu", "cancer")).toBe(0);
      expect(count("Recherche de fièvre négative", "fièvre")).toBe(0);
    });

    it("traite chaque proposition séparément", () => {
      expect(count("Pas de fièvre, pas de perte poids", "fièvre", "perte poids")).toBe(0);
      expect(count("Pas de fièvre. Traumatisme récent.", "fièvre", "traumatisme")).toBe(1);
    });

    it("ne laisse pas une négation contaminer la proposition suivante", () => {
      expect(count("Pas de fièvre mais traumatisme récent", "traumatisme")).toBe(1);
      expect(count("Aucune fracture, cependant chute signalée", "chute")).toBe(1);
    });

    it("ne nie que ce qui suit le marqueur", () => {
      expect(count("Traumatisme sans fracture", "traumatisme")).toBe(1);
      expect(count("Traumatisme sans fracture", "fracture")).toBe(0);
    });
  });

  describe("attribution familiale", () => {
    it("ignore un antécédent attribué à un proche", () => {
      expect(count("Mère décédée d'un cancer du sein", "cancer")).toBe(0);
      expect(count("Antécédents familiaux de tumeur", "tumeur")).toBe(0);
    });

    it("retient un antécédent du patient mentionné ailleurs", () => {
      expect(count("Mère opérée d'un cancer. Patient traité pour tumeur en 2020.", "tumeur")).toBe(1);
    });
  });

  describe("robustesse de saisie", () => {
    it("tolère l'absence d'accents", () => {
      expect(count("Fievre nocturne", "fièvre")).toBe(1);
      expect(count("Pas de fievre", "fièvre")).toBe(0);
    });

    it("ignore la casse", () => {
      expect(count("FRACTURE VERTÉBRALE", "fracture")).toBe(1);
    });

    it("reconnaît un terme au pluriel", () => {
      expect(count("Fractures multiples", "fracture")).toBe(1);
    });

    it("ne matche pas un terme en milieu de mot", () => {
      expect(count("Tachute est un mot inventé", "chute")).toBe(0);
    });
  });

  it("lit chaque champ indépendamment des autres", () => {
    expect(countAffirmedTerms(toClinicalSegments(["Pas de fièvre", "Fièvre à 38.5"]), ["fièvre"])).toBe(1);
  });
});
