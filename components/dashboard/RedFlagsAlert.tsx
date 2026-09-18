import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientData } from "@/types/patient";
import { detectRedFlags } from "@/utils/calculations";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedFlagsAlertProps {
  data: PatientData;
}

const SEVERITY_STYLES = {
  CRITICAL: "border-[var(--border-error)] bg-[var(--bg-error)] text-[var(--text-error)]",
  HIGH: "border-[var(--border-warning)] bg-[var(--bg-warning)] text-[var(--text-warning)]",
  MODERATE: "border-[var(--border-caution)] bg-[var(--bg-caution)] text-[var(--text-caution)]",
} as const;

/**
 * RedFlagsAlert Component
 *
 * Detects and displays clinical red flags (warning signs) from patient data.
 *
 * Shows:
 * - Green confirmation card if no red flags detected
 * - Red alert card with categorized flags if any are found
 * - Flags are color-coded by severity: CRITICAL (red), HIGH (orange), MODERATE (yellow)
 *
 * @param data - Complete patient data object to analyze
 */
export function RedFlagsAlert({ data }: RedFlagsAlertProps) {
  const flags = detectRedFlags(data);
  const flagCount = Object.keys(flags).length;

  if (flagCount === 0) {
    return (
      <Card className="mb-5 border-[var(--border-success)] bg-[var(--bg-success)]">
        <CardContent className="pt-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-[var(--text-success)]" />
          <div>
            <h3 className="text-[var(--text-success)] font-bold text-base">
              Pas de drapeau rouge détecté
            </h3>
            <p className="text-[var(--text-success)] text-xs mt-1">
              Aucun critère d&apos;alerte identifié dans ce bilan.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-5 border-2 border-destructive bg-destructive/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <CardTitle className="text-destructive text-base">
            {flagCount} DRAPEAU(X) ROUGE(S) DÉTECTÉ(S)
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(flags).map(([key, flag]) => (
            <div
              key={key}
              className={cn(
                "p-3 rounded-sm border-l-4",
                SEVERITY_STYLES[flag.category] ?? SEVERITY_STYLES.MODERATE,
              )}
            >
              <div className="font-semibold text-xs">{flag.label}</div>
              <div className="text-[10px] italic mt-1 opacity-90">
                {flag.recommendation}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
