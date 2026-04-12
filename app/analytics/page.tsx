"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Plus,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { METRICS_CONFIG } from "@/utils/metricsConfig";
import { extractMetricsFromTxt } from "@/utils/metricsParser";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricChart } from "@/components/dashboard/MetricChart";
import { AssessmentTimeline } from "@/components/dashboard/AssessmentTimeline";

interface Assessment {
  id: string;
  date: string;
  label: string;
  fileName: string;
  metrics: Record<string, number>;
}

/**
 * Analytics Page Component
 *
 * Displays longitudinal clinical assessment data with:
 * - Assessment timeline management
 * - Metric trend cards showing MCID (Minimum Clinically Important Difference)
 * - Line charts for each metric over time
 * - Comparison table showing baseline vs. current values
 *
 * Metrics tracked:
 * - Pain (NRS Max), Disability (ODI), Sensitization (CSI)
 * - Catastrophizing (PCS), Fear-Avoidance (FABQ)
 * - Anxiety/Depression (HADS), Working Alliance (WAI)
 */
export default function AnalyticsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newLabel, setNewLabel] = useState("");

  /**
   * Handles file upload for assessment TXT files
   * Extracts metrics using regex parser and adds to timeline
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !newDate) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extractedMetrics = extractMetricsFromTxt(content);

      const newAssessment: Assessment = {
        id: Math.random().toString(36).substring(2, 11),
        date: newDate,
        label: newLabel || `Suivi ${assessments.length + 1}`,
        fileName: file.name,
        metrics: extractedMetrics,
      };

      setAssessments((prev) =>
        [...prev, newAssessment].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      );

      const today = new Date().toISOString().split('T')[0];
      setNewDate(today);
      setNewLabel("");
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  /**
   * Removes an assessment from the timeline
   */
  const removeAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  /**
   * Prepares chart data by combining all assessments with their metrics
   */
  const chartData = useMemo(() => {
    return assessments.map((a) => ({
      name: a.label,
      date: a.date,
      ...a.metrics,
    }));
  }, [assessments]);

  const metricEntries = Object.entries(METRICS_CONFIG);
  const baseline = assessments[0];
  const latest = assessments[assessments.length - 1];

  return (
    <div className="space-y-6 max-w-350 mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary bg-clip-text text-transparent">
            Analyses Longitudinales
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Suivez la progression clinique et mesurez l&apos;impact thérapeutique
            (MCID).
          </p>
        </div>
        <div className="flex gap-2">
          {assessments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssessments([])}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Tout effacer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Assessment Management Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Plus className="w-4 h-4 mr-2 text-primary" /> Ajouter un Bilan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date de l&apos;examen</Label>
                <Input
                  type="date"
                  id="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (ex: S4, Fin cure)</Label>
                <Input
                  type="text"
                  id="label"
                  placeholder="Bilan Suivi..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="file"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${newDate
                    ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                    : "border-muted bg-muted/20 cursor-not-allowed opacity-50"
                    }`}
                >
                  <FileText className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-center">
                    Cliquer pour importer le TXT
                  </span>
                  <Input
                    type="file"
                    id="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    disabled={!newDate}
                    className="hidden"
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          <AssessmentTimeline
            assessments={assessments}
            onRemove={removeAssessment}
          />
        </div>

        {/* Dashboard & Charts */}
        <div className="lg:col-span-3 space-y-6">
          {assessments.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center h-125 text-center p-8">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-primary">
                  Prêt pour l&apos;analyse
                </h2>
                <p className="text-sm text-muted-foreground max-w-100 mt-2">
                  Importez un premier bilan (Bilan Initial) puis des bilans de
                  suivi pour visualiser les courbes de progression et les MCID.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricEntries.map(([key, config]) => {
                  const bVal = baseline?.metrics?.[key];
                  const lVal = latest?.metrics?.[key];

                  if (bVal === undefined || lVal === undefined) return null;

                  return (
                    <MetricCard
                      key={key}
                      metricKey={key}
                      config={config}
                      baselineValue={bVal}
                      latestValue={lVal}
                    />
                  );
                })}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {metricEntries.map(([key, config]) => {
                  const hasData = assessments.some(
                    (a) => a.metrics[key] !== undefined,
                  );
                  if (!hasData) return null;

                  const bVal = baseline?.metrics?.[key];
                  if (bVal === undefined) return null;

                  return (
                    <MetricChart
                      key={key}
                      metricKey={key}
                      config={config}
                      chartData={chartData}
                      baselineValue={bVal}
                    />
                  );
                })}
              </div>

              {/* Comparison Table */}
              <Card className="shadow-sm border-muted overflow-hidden">
                <CardHeader className="bg-muted/30 pb-3">
                  <CardTitle className="text-sm font-bold">
                    📋 Tableau Récapitulatif & Validation MCID
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Métrique</th>
                          <th className="px-6 py-3 font-semibold">Baseline</th>
                          <th className="px-6 py-3 font-semibold text-foreground">
                            Actuel
                          </th>
                          <th className="px-6 py-3 font-semibold">Changement</th>
                          <th className="px-6 py-3 font-semibold">Cible MCID</th>
                          <th className="px-6 py-3 font-semibold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {metricEntries.map(([key, config]) => {
                          const bVal = baseline?.metrics?.[key];
                          const lVal = latest?.metrics?.[key];

                          if (bVal === undefined || lVal === undefined) return null;

                          const diff = lVal - bVal;
                          const isImprovement =
                            config.direction === "down" ? diff < 0 : diff > 0;
                          const isSignificant = Math.abs(diff) >= config.mcid;

                          return (
                            <tr key={key} className="hover:bg-muted/20">
                              <td className="px-6 py-4 font-medium">
                                {config.label}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">
                                {bVal.toFixed(1)}
                              </td>
                              <td className="px-6 py-4 font-bold">
                                {lVal.toFixed(1)}
                              </td>
                              <td
                                className={`px-6 py-4 font-semibold ${isImprovement
                                  ? "text-[hsl(var(--text-success))]"
                                  : "text-[hsl(var(--text-error))]"
                                  }`}
                              >
                                {diff > 0 ? "+" : ""}
                                {diff.toFixed(1)}
                              </td>
                              <td className="px-6 py-4 text-muted-foreground italic">
                                ± {config.mcid}
                              </td>
                              <td className="px-6 py-4">
                                {isSignificant ? (
                                  <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-2 py-0.5 text-[10px]">
                                    MCID ATTEINT
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" /> En
                                    progression
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
