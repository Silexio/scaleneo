"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileText, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Assessment } from "@/types/assessment";
import { extractMetricsFromTxt } from "@/utils/metricsParser";

interface AddAssessmentFormProps {
  onAdd: (assessment: Omit<Assessment, "label"> & { label: string }) => void;
}

type StatusType = "success" | "warning" | "error";

interface Status {
  type: StatusType;
  message: string;
}

const STATUS_STYLES: Record<StatusType, string> = {
  success:
    "bg-[hsl(var(--bg-success))] border-[hsl(var(--border-success))] text-[hsl(var(--text-success))]",
  warning:
    "bg-[hsl(var(--bg-warning))] border-[hsl(var(--border-warning))] text-[hsl(var(--text-warning))]",
  error:
    "bg-[hsl(var(--bg-error))] border-[hsl(var(--border-error))] text-[hsl(var(--text-error))]",
};

const StatusIcon = ({ type }: { type: StatusType }) =>
  type === "success" ? (
    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
  ) : (
    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
  );

const todayISO = () => new Date().toISOString().split("T")[0];

/** Upload form for adding a TXT clinical assessment to the analytics timeline. */
export function AddAssessmentForm({ onAdd }: AddAssessmentFormProps) {
  const [date, setDate] = useState(todayISO);
  const [label, setLabel] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (status?.type !== "success") return;
    const timer = setTimeout(() => setStatus(null), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !date) return;

    setIsParsing(true);
    setStatus(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const metrics = extractMetricsFromTxt(content);
      const hasMetrics = Object.keys(metrics).length > 0;

      onAdd({
        id: Math.random().toString(36).substring(2, 11),
        date,
        label,
        fileName: file.name,
        metrics,
      });

      setStatus(
        hasMetrics
          ? { type: "success", message: "Bilan ajouté avec succès." }
          : {
              type: "warning",
              message:
                "Bilan ajouté, mais aucune métrique reconnue. Vérifiez que le fichier respecte le format SCALENEO.",
            }
      );

      setDate(todayISO());
      setLabel("");
      e.target.value = "";
      setIsParsing(false);
    };

    reader.onerror = () => {
      setStatus({
        type: "error",
        message:
          "Impossible de lire ce fichier. Vérifiez qu'il n'est pas corrompu.",
      });
      setIsParsing(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-3">
      {status && (
        <div
          className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${STATUS_STYLES[status.type]}`}
        >
          <StatusIcon type={status.type} />
          <span className="flex-1">{status.message}</span>
          <button
            onClick={() => setStatus(null)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Card className="border-primary/20 shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle className="text-sm font-semibold flex items-center">
            <Plus className="w-4 h-4 mr-2 text-primary" /> Ajouter un Bilan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assessment-date">Date de l&apos;examen</Label>
            <Input
              type="date"
              id="assessment-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assessment-label">
              Label{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optionnel — ex: S4, Fin cure)
              </span>
            </Label>
            <Input
              type="text"
              id="assessment-label"
              placeholder="Généré automatiquement si vide"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="assessment-file"
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
                isParsing
                  ? "border-primary/30 bg-primary/5 cursor-wait opacity-70"
                  : date
                    ? "border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer"
                    : "border-muted bg-muted/20 cursor-not-allowed opacity-50"
              }`}
            >
              {isParsing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-medium text-center text-primary">
                    Analyse en cours...
                  </span>
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-center">
                    Cliquer pour importer le TXT
                  </span>
                </>
              )}
              <Input
                type="file"
                id="assessment-file"
                accept=".txt"
                onChange={handleFileUpload}
                disabled={!date || isParsing}
                className="hidden"
              />
            </Label>
            {!date && (
              <p className="text-xs text-muted-foreground text-center">
                Sélectionnez une date pour activer l&apos;import.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
