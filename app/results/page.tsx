"use client";

import Link from "next/link";
import { usePatient } from "@/components/providers/PatientProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RedFlagsAlert } from "@/components/dashboard/RedFlagsAlert";
import { ScoreSummary } from "@/components/dashboard/ScoreSummary";
import { HypothesisView } from "@/components/dashboard/HypothesisView";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Upload } from "lucide-react";

export default function ResultsPage() {
  const { patientData } = usePatient();

  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 bg-muted/30 rounded-xl border border-dashed border-border animate-in fade-in-50">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground font-medium">Aucun patient chargé</p>
          <p className="text-sm text-muted-foreground/70">Importez un fichier bilan pour visualiser les résultats.</p>
        </div>
        <Link href="/extraction">
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Aller à l&apos;Extraction
          </Button>
        </Link>
      </div>
    );
  }

  const filledSections = Object.entries(patientData).filter(([, sectionData]) => {
    if (typeof sectionData !== "object" || sectionData === null) return false;
    return Object.values(sectionData).some(v => v !== null && v !== undefined && v !== "");
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
      <RedFlagsAlert data={patientData} />
      <ScoreSummary data={patientData} />
      <HypothesisView data={patientData} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>📋 Données Détaillées</span>
            <span className="text-xs font-normal text-muted-foreground">{filledSections.length} sections renseignées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filledSections.map(([sectionKey, sectionData]) => (
              <SectionCard
                key={sectionKey}
                sectionKey={sectionKey}
                data={sectionData}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
