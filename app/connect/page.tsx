"use client";

import { AlertTriangle, Bot, Plug, Terminal, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyField } from "@/components/dashboard/CopyField";

const MCP_URL = process.env.NEXT_PUBLIC_MCP_URL;

const TOOLS = [
  { name: "scaleneo_parse", description: "Extrait les 18 sections cliniques d'une fiche bilan" },
  { name: "scaleneo_analyse", description: "Scores interprétés, drapeaux rouges et hypothèse de travail" },
  { name: "scaleneo_compare", description: "Évolution longitudinale validée contre le MCID" },
  { name: "scaleneo_export", description: "Conversion en CSV à plat ou JSON structuré" },
  { name: "scaleneo_template", description: "Template vierge de fiche bilan" },
];

const desktopConfig = (url: string) =>
  JSON.stringify({ mcpServers: { scaleneo: { command: "npx", args: ["mcp-remote", url] } } }, null, 2);

export default function ConnectPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plug className="size-5" />
            Connexion à votre IA
          </CardTitle>
          <CardDescription>
            Ajoutez SCALENEO à Claude ou à tout autre client compatible MCP pour analyser vos fiches
            bilan directement dans une conversation, sans passer par cette interface.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-3 rounded-md border border-[var(--border-warning)] bg-[var(--bg-warning)] p-4 text-[var(--text-warning)]">
            <AlertTriangle className="size-5 shrink-0" />
            <div className="space-y-1 text-sm">
              <p className="font-bold">Version beta — accès ouvert</p>
              <p>
                Le serveur est accessible sans authentification et ne conserve aucune donnée : chaque
                fiche est traitée en mémoire puis oubliée. Ne soumettez pas de données patient non
                anonymisées.
              </p>
            </div>
          </div>

          {MCP_URL
            ? <CopyField label="Adresse du serveur MCP" value={MCP_URL} />
            : (
              <div className="rounded-md border border-[var(--border-error)] bg-[var(--bg-error)] p-4 text-sm text-[var(--text-error)]">
                <p className="font-bold">Serveur non configuré</p>
                <p>
                  Définissez la variable d&apos;environnement <code className="font-mono">NEXT_PUBLIC_MCP_URL</code>{" "}
                  avec l&apos;adresse du Worker, puis redéployez.
                </p>
              </div>
            )}
        </CardContent>
      </Card>

      {MCP_URL && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comment l&apos;ajouter</CardTitle>
            <CardDescription>
              Trois façons de procéder selon le type de client. L&apos;adresse à coller est la même
              dans tous les cas.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Bot className="size-4" aria-hidden="true" />
                Assistants conversationnels
              </h3>
              <p className="text-sm text-muted-foreground">
                Claude, ChatGPT et les autres assistants qui acceptent un serveur MCP distant.
                Les intitulés varient, la marche à suivre est la même.
              </p>
              <ol className="ml-5 list-decimal space-y-1 text-sm text-muted-foreground">
                <li>Ouvrez les paramètres, section Connecteurs ou Intégrations.</li>
                <li>Ajoutez un serveur MCP distant, parfois appelé connecteur personnalisé.</li>
                <li>Collez l&apos;adresse du serveur ci-dessus, puis validez.</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Terminal className="size-4" aria-hidden="true" />
                Agents en ligne de commande
              </h3>
              <p className="text-sm text-muted-foreground">
                Claude Code, Codex, OpenClaw et les autres agents de terminal. Chacun a sa propre
                commande, mais tous attendent la même adresse et le transport HTTP. Exemple avec
                Claude Code :
              </p>
              <CopyField
                label="Exemple — Claude Code"
                value={`claude mcp add --transport http scaleneo ${MCP_URL}`}
              />
              <p className="text-sm text-muted-foreground">
                Pour un autre agent, cherchez sa commande d&apos;ajout de serveur MCP et donnez-lui
                cette même adresse.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Wrench className="size-4" />
                Client sans connecteur distant
              </h3>
              <p className="text-sm text-muted-foreground">
                Si votre client n&apos;accepte que des serveurs locaux, ce fichier de configuration
                fait le relais vers l&apos;adresse distante. Il nécessite Node.js sur le poste.
              </p>
              <CopyField label="Configuration JSON" value={desktopConfig(MCP_URL)} />
            </section>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outils disponibles</CardTitle>
          <CardDescription>
            Une fois connecté, demandez simplement à votre IA d&apos;analyser une fiche : elle
            choisira l&apos;outil adapté.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="divide-y divide-border">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
                <code className="font-mono text-xs font-bold text-primary sm:w-48 sm:shrink-0">
                  {tool.name}
                </code>
                <span className="text-sm text-muted-foreground">{tool.description}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
