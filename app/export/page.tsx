"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/components/providers/PatientProvider";
import { AlertCircle, Check, Download, FileSpreadsheet, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { flattenObject } from "@/utils/objectHelpers";
import Link from "next/link";

/**
 * Export Page Component
 *
 * Allows users to export patient data in multiple formats:
 * - CSV: Text format compatible with Excel
 * - XLSX: Native Excel spreadsheet
 * - JSON: Raw data format for programmatic use
 *
 * Data is sent to the export API route which handles format conversion
 */
export default function ExportPage() {
  const { patientData } = usePatient();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  /**
   * Handles export action for a specific format
   * Sends flattened patient data to API and triggers file download
   *
   * @param format - Export format: csv, xlsx, or json
   */
  const handleExport = async (format: "csv" | "xlsx" | "json") => {
    if (!patientData) {
      setExportError("Aucune donnée à exporter.");
      return;
    }

    setExportError(null);
    setExportSuccess(null);
    setIsExporting(true);

    try {
      const data = flattenObject(patientData as unknown as Record<string, unknown>);

      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, format }),
      });

      if (!response.ok) throw new Error("Erreur lors de la génération du fichier");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `export_patient_${new Date().toISOString().split('T')[0]}.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch?.[1]) filename = filenameMatch[1];
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportSuccess(format.toUpperCase());
      setTimeout(() => setExportSuccess(null), 3000);

    } catch (error) {
      console.error("Erreur export:", error);
      setExportError(`Erreur lors de l'export ${format.toUpperCase()}. Réessayez ou contactez le support.`);
    } finally {
      setIsExporting(false);
    }
  };

  if (!patientData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💾 Export & Édition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-medium">Aucun patient chargé</p>
              <p className="text-sm text-muted-foreground/70">Importez un fichier bilan pour pouvoir exporter les données.</p>
            </div>
            <Link href="/extraction">
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Aller à l&apos;Extraction
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>💾 Export & Édition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Exportez les données du patient dans le format de votre choix.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ExportButton
              format="csv"
              icon={FileText}
              title="Export CSV"
              description="Format texte compatible Excel"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
            />
            <ExportButton
              format="xlsx"
              icon={FileSpreadsheet}
              title="Export XLSX"
              description="Fichier Excel complet"
              onClick={() => handleExport("xlsx")}
              disabled={isExporting}
            />
            <ExportButton
              format="json"
              icon={Download}
              title="Export JSON"
              description="Format données brutes"
              onClick={() => handleExport("json")}
              disabled={isExporting}
            />
          </div>

          {isExporting && (
            <div className="text-center text-sm text-muted-foreground animate-pulse">
              Génération du fichier en cours...
            </div>
          )}

          {exportSuccess && (
            <div className="p-3 bg-primary/10 text-primary rounded-md text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <Check className="w-4 h-4 shrink-0" />
              Fichier {exportSuccess} téléchargé avec succès.
            </div>
          )}

          {exportError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {exportError}
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-sm font-semibold mb-3">Aperçu des données</h3>
            <div className="bg-muted p-4 rounded-md max-h-96 overflow-auto">
              <pre className="text-xs">
                {JSON.stringify(patientData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
