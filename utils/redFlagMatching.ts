const SEGMENT_BOUNDARY = /[.;!?|/\n,]|\b(?:mais|cependant|toutefois|neanmoins|en revanche|par contre)\b/;

const NEGATION_BEFORE = [
  "pas de", "pas d", "aucun", "aucune", "sans", "ni", "absence de",
  "jamais de", "jamais", "non", "nie", "nier", "denie",
];

const NEGATION_AFTER = [
  "ecarte", "ecartee", "ecartes", "ecartees", "exclu", "exclue", "exclus",
  "absent", "absente", "negatif", "negative", "normal", "normale", "rassurant",
];

const FAMILY_MARKERS = [
  "mere", "pere", "famille", "familial", "familiale", "familiaux", "frere",
  "soeur", "parents", "grand-mere", "grand-pere", "oncle", "tante", "cousin", "cousine",
];

const WORD_CHAR = "a-z0-9";

const normalize = (text: string): string =>
  text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const wordIndex = (segment: string, marker: string): number => {
  const match = new RegExp(`(?:^|[^${WORD_CHAR}])${escapeRegExp(marker)}(?:[^${WORD_CHAR}]|$)`).exec(segment);
  return match ? match.index : -1;
};

const termIndex = (segment: string, term: string): number => {
  const match = new RegExp(`(?:^|[^${WORD_CHAR}])${escapeRegExp(term)}`).exec(segment);
  return match ? match.index : -1;
};

const isAffirmedIn = (segment: string, term: string): boolean => {
  const position = termIndex(segment, term);
  if (position === -1) return false;

  const isNegated =
    NEGATION_BEFORE.some((marker) => {
      const markerPosition = wordIndex(segment, marker);
      return markerPosition !== -1 && markerPosition < position;
    }) ||
    NEGATION_AFTER.some((marker) => {
      const markerPosition = wordIndex(segment, marker);
      return markerPosition !== -1 && markerPosition > position;
    });

  const isRelatedToRelative = FAMILY_MARKERS.some((marker) => wordIndex(segment, marker) !== -1);

  return !isNegated && !isRelatedToRelative;
};

/**
 * Counts how many search terms are actually asserted about the patient.
 *
 * A term is ignored when its clause negates it ("pas de fièvre", "fracture écartée")
 * or attributes it to a relative ("mère opérée d'un cancer"), so that documenting the
 * absence of a warning sign never raises one.
 *
 * @param values - Filled patient values, one entry per clinical field
 * @param searchTerms - Warning terms of a single red flag
 * @returns Number of distinct terms asserted about the patient
 */
export const countAffirmedTerms = (values: string[], searchTerms: string[]): number => {
  const segments = values.flatMap((value) => normalize(value).split(SEGMENT_BOUNDARY));

  return searchTerms.filter((term) =>
    segments.some((segment) => isAffirmedIn(segment, normalize(term))),
  ).length;
};
