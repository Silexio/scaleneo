"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FileText, AlertCircle, X } from "lucide-react";
import { Assessment } from "@/types/assessment";
import { extractMetricsFromTxt } from "@/utils/metricsParser";

interface AddAssessmentFormProps {
  onAdd: (assessment: Omit<Assessment, "label"> & { label: string }) => void;
}

const todayISO = () => new Date().toISOString().split("T")[0];

/** Upload form for adding a TXT clinical assessment to the analytics timeline. */
export function AddAssessmentForm({ onAdd }: AddAssessmentFormProps) {
  const [date, setDate] = useState(todayISO);
  const [label, setLabel] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !date) return;

    setIsParsing(true);
    setWarning(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      const metrics = extractMetricsFromTxt(content);

      if (Object.keys(metrics).length === 0) {
        setWarning(
          "Aucune métrique reconnue dans ce fichier. Vérifiez que le fichier respecte le format SCALENEO."
        );
      }

      onAdd({
        id: Math.random().toString(36).substring(2, 11),
        date,
        label,
        fileName: file.name,
        metrics,
      });

      setDate(todayISO());
      setLabel("");
      e.target.value = "";
      setIsParsing(false);
    };

    reader.onerror = () => setIsParsing(false);
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3">
      {warning && (
        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1">{warning}</span>
          <button onClick={() => setWarning(null)} className="text-yellow-600 hover:text-yellow-800">
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
            <Label htmlFor="assessment-label">Label (ex: S4, Fin cure)</Label>
            <Input
              type="text"
              id="assessment-label"
              placeholder="Bilan Suivi..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-muted/30"
            />
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
