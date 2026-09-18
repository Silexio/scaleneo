import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import TEMPLATE from "../../public/documents/FICHE_BILAN_SCALENEO_TEMPLATE.txt";
import { detectRedFlags, generateHypothesis } from "../../utils/calculations";
import { extractMetricsFromTxt } from "../../utils/metricsParser";
import { PatientParser } from "../../utils/parser";
import {
  formatEvolution,
  formatHypothesis,
  formatRedFlags,
  formatScores,
  formatSections,
  toCsv,
} from "./format";

const MAX_CONTENT_LENGTH = 512_000;
const MAX_ASSESSMENTS = 12;

const BETA_NOTICE =
  "SCALENEO beta — traitement sans conservation. Ne pas soumettre de données patient non anonymisées.";

const content = z
  .string()
  .min(1)
  .max(MAX_CONTENT_LENGTH)
  .describe("Contenu texte brut d'une fiche bilan SCALENEO");

const text = (body: string) => ({ content: [{ type: "text" as const, text: body }] });

/** Builds a fresh stateless MCP server exposing the SCALENEO clinical engine. */
export function createServer() {
  const server = new McpServer({ name: "scaleneo", version: "0.1.0" });

  server.registerTool(
    "scaleneo_parse",
    {
      description:
        "Extrait les 18 sections cliniques d'une fiche bilan SCALENEO (anamnèse, tests, scores, drapeaux rouges). Calcule IMC, asymétrie SLR et Core Strength Index. " +
        BETA_NOTICE,
      inputSchema: { contenu: content },
    },
    async ({ contenu }) => text(formatSections(PatientParser.parse(contenu))),
  );

  server.registerTool(
    "scaleneo_analyse",
    {
      description:
        "Analyse clinique complète d'une fiche bilan : scores validés interprétés, drapeaux rouges détectés et hypothèse de travail sur 10 domaines. " +
        BETA_NOTICE,
      inputSchema: { contenu: content },
    },
    async ({ contenu }) => {
      const data = PatientParser.parse(contenu);
      return text(
        [
          `# Scores cliniques\n${formatScores(data)}`,
          `# Drapeaux rouges\n${formatRedFlags(detectRedFlags(data))}`,
          `# Hypothèse de travail\n${formatHypothesis(generateHypothesis(data))}`,
        ].join("\n\n"),
      );
    },
  );

  server.registerTool(
    "scaleneo_compare",
    {
      description:
        "Compare plusieurs fiches bilan d'un même patient par ordre chronologique et valide chaque évolution contre le MCID de la métrique. " +
        BETA_NOTICE,
      inputSchema: {
        contenus: z
          .array(content)
          .min(2)
          .max(MAX_ASSESSMENTS)
          .describe("Fiches bilan du plus ancien au plus récent"),
      },
    },
    async ({ contenus }) => text(formatEvolution(contenus.map(extractMetricsFromTxt))),
  );

  server.registerTool(
    "scaleneo_export",
    {
      description:
        "Convertit une fiche bilan en CSV à plat (une colonne par variable, prêt pour R, SPSS ou jamovi) ou en JSON structuré. " +
        BETA_NOTICE,
      inputSchema: {
        contenu: content,
        format: z.enum(["csv", "json"]).default("csv"),
      },
    },
    async ({ contenu, format }) => {
      const data = PatientParser.parse(contenu);
      return text(format === "csv" ? toCsv(data) : JSON.stringify(data, null, 2));
    },
  );

  server.registerTool(
    "scaleneo_template",
    {
      description:
        "Renvoie le template vierge de fiche bilan SCALENEO, à remplir avant toute extraction.",
      inputSchema: {},
    },
    async () => text(TEMPLATE),
  );

  return server;
}
