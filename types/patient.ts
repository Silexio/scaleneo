/**
 * Définition des types pour les données patient issues du parsing.
 * Chaque interface correspond à une SECTION du template SCALENEO.
 */

// --- TYPES DE BASE ---
// La plupart des champs sont des strings, mais certains peuvent être des nombres ou booléens.
// On utilise un type Union pour être flexible lors du parsing initial,
// mais tu peux être plus strict si tu le souhaites.
export type ParserValue = string | number | boolean | null;

// --- SECTIONS ---

export interface Section1 {
  nomPatient?: string;
  anneeNaissance?: number;
  age?: number;
  sexe?: string;
  profession?: string;
  secteur?: string;
  kineExaminateur?: string;
  dateBilan?: string;
  idPatient?: string;
  idBilan?: string;
}

export interface Section2 {
  poids?: number;
  taille?: number;
  imc?: number;
}

export interface Section3 {
  antecedentsLBP?: boolean | string;
  episodeInitial?: string;
  modeApparition?: string;
  recidive?: boolean | string;
  pireEpisode?: string;
  dureeTotale?: string;
  typeLBP?: string;
}

export interface Section4 {
  nrsRepos?: string | number;
  nrsActivite?: string | number;
  nrsMax?: string | number;
  horaireDouleur?: string;
  variationJournaliere?: string;
  facteursAggravants?: string;
  facteursSoulageants?: string;
  evolution?: string;
}

export interface Section5 {
  douleurArticulaire?: boolean | string;
  douleurMyofasciale?: boolean | string;
  douleurNeurologique?: boolean | string;
  sensibilisationCentrale?: boolean | string;
  deficitSensorimoteur?: boolean | string;
  caractereSensations?: string;
  observationsMecanismes?: string;
}

export interface Section6 {
  // Mobilité
  flexionAvant?: string;
  flexionAvantNrs?: string;
  extension?: string;
  extensionNrs?: string;
  inclinaisonDroit?: string;
  inclinaisonDroitNrs?: string;
  inclinaisonGauche?: string;
  inclinaisonGaucheNrs?: string;
  rotationDroit?: string;
  rotationDroitNrs?: string;
  rotationGauche?: string;
  rotationGaucheNrs?: string;
  mouvementsCombines?: string;
  mouvementsCombinesNrs?: string;
  mobiliteSegmentaire?: string;
  mobiliteSegmentaireNrs?: string;
  hanche?: string;
  hancheNrs?: string;
  // Neuro Specifique
  slrDroit?: string;
  slrGauche?: string;
  asymetrieSlr?: string;
  slumpTest?: string;
  pkb?: string;
  forceMusculaire?: string;
  reflexes?: string;
  sensation?: string;
  sensationLocalisation?: string;
  profilSensoriel?: string;
  tensionMusculaire?: string;
  triggerPoints?: string;
  triggerPointsLocalisation?: string;
  hypersensibilite?: boolean | string;
  spasmeMusculaire?: string;
  spasmeLocalisation?: string;
  localisation?: string;
  signesMeninges?: string;
  hypersensibilitePression?: string;
  zoneLombaire?: string;
  zoneControle?: string;
  // Tests Endurance
  testSorensen?: string;
  testItoShirado?: string;
  coreStrengthIndex?: string;
  sidePlank?: string;
  controlSensoriMoteur?: string;
}

export interface Section7 {
  scoreSBT?: string | number;
  scoreCSI?: string | number;
  scoreODI?: string | number;
  scorePCS?: string | number;
  scoreAnxiete?: string | number;
  scoreDepression?: string | number;
  scoreFabqTravail?: string | number;
  scoreFabqActivite?: string | number;
  scoreWAI?: string | number;
  scoreIPAQ?: string;
  scoreIPAQ_MET?: string;
  scorePSFS?: string;
  scorePSFS_Scores?: string;
  qualiteVie?: string;
  autresQuestionnaires?: string;
}

export interface Section8 {
  redFlags?: boolean | string;
  detailsRedFlags?: string;
  contreIndications?: string;
  allergies?: string;
  medications?: string;
  examensMedicaux?: string;
  instabiliteRachidienne?: string;
  signesInstabilite?: string;
  limitationManuelle?: string;
  anticoagulation?: string;
  traitementAnticoagulation?: string;
  grossesse?: string;
  trimestreGrossesse?: string;
  adaptationsGrossesse?: string;
  etatGeneral?: string;
}

export interface Section9 {
  motifArticulaire?: boolean;
  motifMyofascial?: boolean;
  motifNeural?: boolean;
  sensibilisationCentrale?: boolean;
  controleSensorimoteur?: boolean;
}

export interface Section10 {
  frequence?: string;
  hasTherapieManuelle?: boolean | string;
  typesTherapieManuelle?: string;
  hasExercices?: boolean | string;
  typesExercices?: string;
  hasNeurodynamique?: boolean | string;
  typesNeurodynamique?: string;
  hasEducation?: boolean | string;
  sujetsEducation?: string;
  modalitesSup?: string;
}

export interface Section11 {
  comprehensionDiagnostic?: string;
  inquietudes?: string;
  perceptionGravite?: string;
  autoEfficacite?: string;
  croyanceControle?: string;
}

export interface Section12 {
  dureeTraitement?: string;
  nbSeances?: string;
  facteursPositifs?: string;
  facteursNegatifs?: string;
  objectifsCourtTerme?: string;
  objectifsLongTerme?: string;
  attentesRealistes?: boolean;
  detailAttentes?: string;
  anticipationGuerison?: string;
  detailYellowFlags?: string;
  soutienSocial?: string;
  detailSoutien?: string;
  stresseurs?: string;
  pointReevaluation?: string;
  criteresChangement?: string;
  orientationSpecialise?: boolean;
  barrieresTraitement?: string;
}

export interface Section13 {
  activitesQuotidiennes?: string; // Liste ou string concaténée
  loisirs?: string;
  activitesAnterieures?: string;
  activitesActuelles?: string;
  tempsAssis?: string;
  tempsDebout?: string;
  tempsMarche?: string;
  tempsAssisQuotidien?: string;
  tempsEcran?: string;
  sedentarite?: string;
  statutPro?: string;
  joursAbsence?: string;
  limitationsPro?: string;
  tachesImpossibles?: string;
  tachesDifficiles?: string;
  attentesRetourTravail?: string;
  delaiRetourTravail?: string;
  confianceRetourTravail?: string;
  modifPoste?: boolean;
  typeModifPoste?: string;
}

export interface Section14 {
  defautsPosturaux?: string;
  facteursBiomeca?: string;
  facteursLifestyle?: string;
  facteursHormonaux?: string;
  ergonomieTravail?: boolean;
  posteOptimise?: string;
  recommandationsErgonomie?: string;
  facteursPsycho?: string;
  systemeSante?: string;
  conceptionBiopsychosociale?: string;
  attentesCulturelles?: boolean;
  attenteGuerisonRapide?: string;
  approchePreferee?: string;
  compliance?: string;
  barrieresCompliance?: string;
}

export interface Section15 {
  pgic?: string | number;
  etatPGIC?: string;
  satisfaction?: string | number;
  relationTherapeute?: string;
  gasScore?: string;
  progressionGAS?: string;
}

export interface Section16 {
  resumeClinique?: string;
  observationsGlobales?: string;
  impressionGenerale?: string;
  notesSup?: string;
  planTraitement?: string;
}

export interface Section17 {
  pathology?: string;
  sourcesOfSymptoms?: string;
  painType?: string;
  impairments?: string;
  painMechanisms?: string;
  precautions?: string;
  patientPerspectives?: string;
  activityParticipation?: string;
  contributingFactors?: string;
  managementPrognosis?: string;
}

export interface Section18 {
  confianceExtraction?: string;
  isComplete?: boolean | string;
  needsReview?: boolean | string;
  modifiePar?: string;
  dateModification?: string;
}

// --- TYPE GLOBAL ---

export interface PatientData {
  section1: Section1;
  section2: Section2;
  section3: Section3;
  section4: Section4;
  section5: Section5;
  section6: Section6;
  section7: Section7;
  section8: Section8;
  section9: Section9;
  section10: Section10;
  section11: Section11;
  section12: Section12;
  section13: Section13;
  section14: Section14;
  section15: Section15;
  section16: Section16;
  section17: Section17;
  section18: Section18;
}