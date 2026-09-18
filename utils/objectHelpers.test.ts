import { describe, expect, it } from "vitest";
import { flattenObject, unflattenDotObject } from "./objectHelpers";

describe("flattenObject", () => {
  it("aplatit les objets imbriqués en clés pointées", () => {
    expect(flattenObject({ section1: { nomPatient: "Jean", age: 45 } })).toEqual({
      "section1.nomPatient": "Jean",
      "section1.age": 45,
    });
  });

  it("joint les tableaux en une seule cellule", () => {
    expect(flattenObject({ s: { activites: ["marche", "vélo"] } })).toEqual({
      "s.activites": "marche, vélo",
    });
  });

  it("préserve les valeurs nulles, qui signifient champ non renseigné", () => {
    expect(flattenObject({ s: { absent: null } })).toEqual({ "s.absent": null });
  });
});

describe("unflattenDotObject", () => {
  it("reconstruit la structure imbriquée", () => {
    expect(unflattenDotObject({ "section1.nomPatient": "Jean" })).toEqual({
      section1: { nomPatient: "Jean" },
    });
  });

  it("fait l'aller-retour sans perte sur une structure patient", () => {
    const patient = {
      section1: { nomPatient: "Jean", age: 45 },
      section7: { scoreODI: 48, scoreCSI: null },
    };

    expect(unflattenDotObject(flattenObject(patient))).toEqual(patient);
  });
});
