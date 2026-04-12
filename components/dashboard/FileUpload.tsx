"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check, AlertCircle, FileText, Download } from "lucide-react";
import { PatientParser } from "@/utils/parser";
import { PatientData } from "@/types/patient";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onDataParsed: (arg0: PatientData, rawContent: string) => void;
}

/**
 * FileUpload Component
 *
 * Drag-and-drop file upload interface for patient data files.
 * Supports .txt (clinical reports) and .json (structured data) formats.
 *
 * Features:
 * - Drag-and-drop and click-to-browse upload
 * - Format validation (rejects RTF and unsupported formats)
 * - Real-time parsing with visual feedback
 * - Error handling with user-friendly messages
 *
 * @param onDataParsed - Callback invoked after successful parsing with PatientData and raw content
 */
export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles drag events for file upload zone
   * Activates visual feedback when file is dragged over the zone
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handles file drop events
   * Processes the first file from the dropped files
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handles file selection via input element
   * Triggers when user clicks browse button
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  /**
   * Main file processing handler
   *
   * Validates file format, reads content, and parses data.
   * Supports both JSON (structured data) and TXT (clinical reports) formats.
   *
   * Validation steps:
   * 1. Check file extension and MIME type
   * 2. Reject RTF format (common user mistake)
   * 3. Validate content is not empty
   * 4. Parse based on format (JSON.parse or PatientParser)
   * 5. Verify Section 1 data exists
   *
   * @param file - File object from drag-drop or file input
   */
  const handleFile = (file: File) => {
    setError(null);
    setIsProcessing(true);

    const fileNameLower = file.name.toLowerCase();
    const isJson = fileNameLower.endsWith(".json") || file.type === "application/json";
    const isTxt = fileNameLower.endsWith(".txt") || file.type === "text/plain";

    if (!isJson && !isTxt) {
      setError("⚠️ Format non supporté. Veuillez télécharger un fichier .json ou .txt");
      setIsProcessing(false);
      return;
    }

    setFileName(file.name);
    setFileType(isJson ? "JSON" : "TXT");

    const reader = new FileReader();

    reader.onerror = () => {
      setError("❌ Erreur de lecture du fichier. Vérifiez que le fichier n'est pas corrompu.");
      setIsProcessing(false);
    };

    reader.onload = (e) => {
      const content = e.target?.result as string;

      try {
        if (!content || content.trim().length === 0) {
          throw new Error("Le fichier est vide.");
        }

        if (content.trim().startsWith("{\\rtf")) {
          throw new Error(
            "❌ Format RTF détecté. Veuillez enregistrer au format 'Texte brut' (.txt) sans mise en forme.\n\n" +
            "💡 Astuce: Dans votre éditeur de texte, utilisez 'Enregistrer sous' → Format: 'Texte brut (.txt)'"
          );
        }

        let parsedData: PatientData;

        if (isJson) {
          try {
            parsedData = JSON.parse(content) as PatientData;
          } catch (jsonErr) {
            console.error("❌ Erreur de parsing JSON:", jsonErr);
            throw new Error(`Format JSON invalide. Vérifiez la syntaxe du fichier.`);
          }
        } else {
          parsedData = PatientParser.parse(content);
        }

        if (!parsedData.section1 || Object.keys(parsedData.section1).length === 0) {
          throw new Error(
            "⚠️ Aucune donnée extraite de la Section 1 (Identité Patient).\n\n" +
            "Vérifiez que le fichier respecte le format du template SCALENEO."
          );
        }

        setIsProcessing(false);
        onDataParsed(parsedData, content);

      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur inconnue lors du parsing. Contactez le support technique.";

        setError(errorMessage);
        setIsProcessing(false);

        console.error("❌ Erreur de parsing:", err);
      }
    };

    reader.readAsText(file, "UTF-8");
  };

  return (
    <Card className="relative h-full">
      <CardHeader>
        <CardTitle className="text-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            📥 Chargement Fichier
          </div>
          <a
            href="/documents/FICHE_BILAN_SCALENEO_TEMPLATE.txt"
            download="FICHE_BILAN_SCALENEO_TEMPLATE.txt"
            className="text-sm font-normal text-primary hover:text-primary/80 flex items-center sm:text-right gap-1.5 transition-colors"
            title="Télécharger le modèle de fiche bilan"
          >
            <Download className="w-4 h-4" />
            Télécharger modèle
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            isProcessing && "pointer-events-none opacity-60"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {isProcessing ? (
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : fileName ? (
              <div className="p-4 bg-primary/10 rounded-full text-primary animate-in zoom-in">
                <Check className="w-8 h-8" />
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-full text-muted-foreground">
                <Upload className="w-8 h-8" />
              </div>
            )}

            <div className="space-y-2">
              {isProcessing ? (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    Parsing en cours...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Extraction des données du fichier {fileType}
                  </p>
                </>
              ) : fileName ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      {fileName}
                    </p>
                  </div>
                  {fileType && (
                    <p className="text-xs text-muted-foreground">
                      Format: {fileType}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    Glissez-déposez ou cliquez ici
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formats supportés: .txt, .json
                  </p>
                </>
              )}
            </div>

            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".txt,.json,text/plain,application/json"
              onChange={handleChange}
              disabled={isProcessing}
            />

            <Button
              variant={fileName ? "outline" : "default"}
              size="sm"
              className="mt-2"
              disabled={isProcessing}
            >
              {fileName ? "Changer de fichier" : "Sélectionner un fichier"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 whitespace-pre-line">{error}</div>
          </div>
        )}

        {fileName && !error && !isProcessing && (
          <div className="mt-4 p-3 bg-primary/10 text-primary rounded-md text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              ✅ Fichier {fileType} chargé avec succès. Données extraites et prêtes à l&apos;emploi.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}