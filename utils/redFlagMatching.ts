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

const wordPattern = (marker: string): RegExp =>
  new RegExp(`(?:^|[^${WORD_CHAR}])${escapeRegExp(marker)}(?:[^${WORD_CHAR}]|$)`);

const NEGATION_BEFORE_PATTERNS = NEGATION_BEFORE.map(wordPattern);
const NEGATION_AFTER_PATTERNS = NEGATION_AFTER.map(wordPattern);
const FAMILY_PATTERNS = FAMILY_MARKERS.map(wordPattern);

const termPatterns = new Map<string, RegExp>();

const patternFor = (term: string): RegExp => {
  const cached = termPatterns.get(term);
  if (cached) return cached;

  const pattern = new RegExp(`(?:^|[^${WORD_CHAR}])${escapeRegExp(normalize(term))}`);
  termPatterns.set(term, pattern);
  return pattern;
};

const positionOf = (segment: string, pattern: RegExp): number => {
  const match = pattern.exec(segment);
  return match ? match.index : -1;
};

const isAffirmedIn = (segment: string, term: string): boolean => {
  const position = positionOf(segment, patternFor(term));
  if (position === -1) return false;

  const isNegatedBefore = NEGATION_BEFORE_PATTERNS.some((pattern) => {
    const markerPosition = positionOf(segment, pattern);
    return markerPosition !== -1 && markerPosition < position;
  });

  return !isNegatedBefore && !NEGATION_AFTER_PATTERNS.some((pattern) => positionOf(segment, pattern) > position);
};

const toSegments = (value: string): string[] =>
  normalize(value)
    .split(SEGMENT_BOUNDARY)
    .filter((segment) => segment !== "");

/**
 * Splits filled patient values into the clauses a warning term can be read in.
 *
 * Clauses describing a relative are dropped here rather than per term, since a family
 * history never applies to the patient whatever the term.
 *
 * @param values - Filled patient values, one entry per clinical field
 * @returns Normalized clauses to search
 */
export const toClinicalSegments = (values: string[]): string[] =>
  values
    .flatMap(toSegments)
    .filter((segment) => !FAMILY_PATTERNS.some((pattern) => pattern.test(segment)));

/**
 * Counts how many search terms are actually asserted about the patient.
 *
 * A term is ignored when its clause negates it ("pas de fièvre", "fracture écartée"),
 * so that documenting the absence of a warning sign never raises one.
 *
 * @param segments - Clauses produced by toClinicalSegments
 * @param searchTerms - Warning terms of a single red flag
 * @returns Number of distinct terms asserted about the patient
 */
export const countAffirmedTerms = (segments: string[], searchTerms: string[]): number =>
  searchTerms.filter((term) => segments.some((segment) => isAffirmedIn(segment, term))).length;

/**
 * Tells whether a single clinical field asserts at least one of the given terms.
 *
 * Each term is read in its own clause, so a documented absence ("non traumatique",
 * "pas de déficit") never reads as an affirmation of the term it denies.
 *
 * @param value - Raw value of one clinical field
 * @param terms - Terms whose assertion is looked for
 * @returns True as soon as one term is asserted
 */
export const affirmsAnyTerm = (value: string, terms: string[]): boolean =>
  toSegments(value).some((segment) => terms.some((term) => isAffirmedIn(segment, term)));
