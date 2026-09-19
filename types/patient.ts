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
  episodeInitial?: string | number;
  modeApparition?: string;
  recidive?: boolean | string;
  pireEpisode?: string;
  dureeTotale?: string | number;
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
  douleurArticulaire?: boolean | string | number;
  douleurMyofasciale?: boolean | string | number;
  douleurNeurologique?: boolean | string | number;
  sensibilisationCentrale?: boolean | string;
  deficitSensorimoteur?: boolean | string | number;
  caractereSensations?: string;
  observationsMecanismes?: string;
}

export interface Section6 {
  // Mobilité
  flexionAvant?: string;
  flexionAvantNrs?: string | number;
  extension?: string;
  extensionNrs?: string | number;
  inclinaisonDroit?: string;
  inclinaisonDroitNrs?: string | number;
  inclinaisonGauche?: string;
  inclinaisonGaucheNrs?: string | number;
  rotationDroit?: string;
  rotationDroitNrs?: string | number;
  rotationGauche?: string;
  rotationGaucheNrs?: string | number;
  mouvementsCombines?: string;
  mouvementsCombinesNrs?: string | number;
  mobiliteSegmentaire?: string;
  mobiliteSegmentaireNrs?: string | number;
  hanche?: string;
  hancheNrs?: string | number;
  // Neuro Specifique
  slrDroit?: string | number;
  slrGauche?: string | number;
  asymetrieSlr?: string | number;
  slumpTest?: string;
  pkb?: string;
  forceMusculaire?: string;
  reflexes?: boolean | string;
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
  hypersensibilitePression?: boolean | string;
  zoneLombaire?: boolean | string;
  zoneControle?: boolean | string;
  // Tests Endurance
  testSorensen?: string | number;
  testItoShirado?: string | number;
  coreStrengthIndex?: string | number;
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
  scoreIPAQ_MET?: string | number;
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
  frequence?: string | number;
  hasTherapieManuelle?: boolean | string | number;
  typesTherapieManuelle?: string;
  hasExercices?: boolean | string | number;
  typesExercices?: string;
  hasNeurodynamique?: boolean | string | number;
  typesNeurodynamique?: string;
  hasEducation?: boolean | string | number;
  sujetsEducation?: string;
  modalitesSup?: string;
}

export interface Section11 {
  comprehensionDiagnostic?: boolean | string;
  inquietudes?: string;
  perceptionGravite?: string;
  autoEfficacite?: string;
  croyanceControle?: string;
}

export interface Section12 {
  dureeTraitement?: string;
  nbSeances?: string | number;
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
  pointReevaluation?: string | number;
  criteresChangement?: string;
  orientationSpecialise?: boolean;
  barrieresTraitement?: string;
}

export interface Section13 {
  activitesQuotidiennes?: string; // Liste ou string concaténée
  loisirs?: string;
  activitesAnterieures?: string;
  activitesActuelles?: string;
  tempsAssis?: string | number;
  tempsDebout?: string | number;
  tempsMarche?: string | number;
  tempsAssisQuotidien?: string | number;
  tempsEcran?: string | number;
  sedentarite?: string;
  statutPro?: string;
  joursAbsence?: string;
  joursAbsence3Mois?: string | number;
  joursAbsence6Mois?: string | number;
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
  posteOptimise?: boolean | string;
  recommandationsErgonomie?: string;
  facteursPsycho?: string;
  systemeSante?: string;
  conceptionBiopsychosociale?: string;
  attentesCulturelles?: boolean;
  attenteGuerisonRapide?: boolean | string;
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
  confianceExtraction?: number;
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