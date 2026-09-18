import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientData } from "@/types/patient";
import { interpretScore } from "@/utils/calculations";
import { SCORE_DEFINITIONS } from "@/utils/definitions";
import { cn } from "@/lib/utils";
import { StableBold } from "@/components/ui/StableBold";

interface ScoreSummaryProps {
  data: PatientData;
}

const LEVEL_BORDERS: Record<string, string> = {
  red: "border-l-[var(--text-error)]",
  yellow: "border-l-[var(--text-warning)]",
  green: "border-l-[var(--text-success)]",
};

const LEVEL_TEXTS: Record<string, string> = {
  red: "text-[var(--text-error)]",
  yellow: "text-[var(--text-warning)]",
  green: "text-[var(--text-success)]",
};

interface ComputedScore {
  key: string;
  label: string;
  value: string | number;
  interp: ReturnType<typeof interpretScore>;
}

/**
 * ScoreSummary Component
 *
 * Displays a grid of clinical assessment scores with color-coded interpretations.
 * Shows 9 potential scores: SBT, CSI, ODI, PCS, HADS (Anxiety/Depression), FABQ (Work/Activity), WAI.
 *
 * Features:
 * - Auto-filters empty scores
 * - Cleans parenthetical text from values
 * - Color-coded borders based on severity (green, yellow, red)
 *
 * @param data - Complete patient data object
 */
export function ScoreSummary({ data }: ScoreSummaryProps) {
  const potentialScores = [
    { key: "sbt", value: data.section7.scoreSBT },
    { key: "csi", value: data.section7.scoreCSI },
    { key: "odi", value: data.section7.scoreODI },
    { key: "pcs", value: data.section7.scorePCS },
    { key: "hadsAnxiete", value: data.section7.scoreAnxiete },
    { key: "hadsDepression", value: data.section7.scoreDepression },
    { key: "fabqTravail", value: data.section7.scoreFabqTravail },
    { key: "fabqActivite", value: data.section7.scoreFabqActivite },
    { key: "wai", value: data.section7.scoreWAI },
  ];

  const computedScores = potentialScores
    .map(({ key, value }) => {
      if (value === undefined || value === null || value === "") return null;

      const def = SCORE_DEFINITIONS[key as keyof typeof SCORE_DEFINITIONS];
      if (!def) return null;

      const cleanValue = typeof value === "string"
        ? value.replace(/\s*\(.*\)\s*$/, "").trim()
        : value;

      const interp = interpretScore(
        key as keyof typeof SCORE_DEFINITIONS,
        cleanValue
      );

      return { key, label: def.label, value: cleanValue, interp };
    })
    .filter(Boolean) as ComputedScore[];

  if (computedScores.length === 0) return null;

  return (
    <Card className="mb-5 border-2 border-accent bg-accent/20">
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          📊 Résumé des Scores Cliniques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {computedScores.map((score) => (
            <div
              key={score.key}
              className={cn(
                "group bg-card p-3 rounded-sm border-l-4 transition-all duration-200 shadow-sm border border-border hover:shadow-md hover:border-l-4",
                LEVEL_BORDERS[score.interp?.color ?? "green"],
              )}
            >
              <StableBold
                text={score.label}
                className="text-[10px] font-bold text-muted-foreground uppercase mb-1"
                hoverClassName="group-hover:font-extrabold group-hover:text-card-foreground"
              />

              <div className="text-xl font-bold text-foreground leading-none mb-2">
                {score.value}
              </div>

              <StableBold
                text={score.interp?.label || ""}
                className={cn(
                  "text-[10px] italic font-medium leading-tight",
                  LEVEL_TEXTS[score.interp?.color ?? "green"],
                )}
                hoverClassName="group-hover:font-extrabold"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}