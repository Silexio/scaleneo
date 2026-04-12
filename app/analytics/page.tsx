"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trash2, AlertCircle, Check, X, Printer } from "lucide-react";
import { METRICS_CONFIG } from "@/utils/metricsConfig";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricChart } from "@/components/dashboard/MetricChart";
import { AssessmentTimeline } from "@/components/dashboard/AssessmentTimeline";
import { AddAssessmentForm } from "@/components/dashboard/AddAssessmentForm";
import { useAssessments } from "@/hooks/useAssessments";

/** Analytics page — longitudinal clinical assessments with MCID trend analysis. */
export default function AnalyticsPage() {
  const { assessments, addAssessment, removeAssessment, clearAssessments } = useAssessments();
  const [confirmingClear, setConfirmingClear] = useState(false);

  const chartData = useMemo(
    () => assessments.map((a) => ({ name: a.label, date: a.date, ...a.metrics })),
    [assessments]
  );

  const metricEntries = Object.entries(METRICS_CONFIG);
  const baseline = assessments[0];
  const latest = assessments[assessments.length - 1];

  const availableMetrics = metricEntries.filter(
    ([key]) =>
      baseline?.metrics?.[key] !== undefined && latest?.metrics?.[key] !== undefined
  );

  const handleClearConfirm = () => {
    clearAssessments();
    setConfirmingClear(false);
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary bg-clip-text text-transparent">
            Analyses Longitudinales
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Suivez la progression clinique et mesurez l&apos;impact thérapeutique (MCID).
          </p>
        </div>

        {assessments.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1" /> Imprimer
            </Button>
            {confirmingClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive font-medium">
                  Supprimer tous les bilans ?
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearConfirm}
                  className="text-destructive border-destructive hover:bg-destructive/10 h-7 text-xs gap-1"
                >
                  <Check className="w-3 h-3" /> Confirmer
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmingClear(false)}
                  className="h-7 text-xs gap-1"
                >
                  <X className="w-3 h-3" /> Annuler
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmingClear(true)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Tout effacer
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <AddAssessmentForm onAdd={addAssessment} />
          <AssessmentTimeline assessments={assessments} onRemove={removeAssessment} />
        </div>

        <div className="lg:col-span-3 print:col-span-4 space-y-6">
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
                  Importez un premier bilan (Bilan Initial) puis des bilans de suivi pour
                  visualiser les courbes de progression et les MCID.
                </p>
              </CardContent>
            </Card>
          ) : availableMetrics.length === 0 ? (
            <Card className="border-dashed border-2 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center h-48 text-center p-8">
                <AlertCircle className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  Aucune métrique commune
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-64">
                  Le bilan initial et le bilan actuel ne partagent aucune métrique mesurée. Importez des fichiers au format SCALENEO.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
                {availableMetrics.map(([key, config]) => (
                  <MetricCard
                    key={key}
                    metricKey={key}
                    config={config}
                    baselineValue={baseline.metrics[key]}
                    latestValue={latest.metrics[key]}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-6">
                {availableMetrics
                  .filter(([key]) => assessments.some((a) => a.metrics[key] !== undefined))
                  .map(([key, config]) => (
                    <MetricChart
                      key={key}
                      metricKey={key}
                      config={config}
                      chartData={chartData}
                      baselineValue={baseline.metrics[key]}
                    />
                  ))}
              </div>

              <Card className="shadow-sm border-muted overflow-hidden print:break-inside-avoid">
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
                          <th className="px-6 py-3 font-semibold text-foreground">Actuel</th>
                          <th className="px-6 py-3 font-semibold">Changement</th>
                          <th className="px-6 py-3 font-semibold">Cible MCID</th>
                          <th className="px-6 py-3 font-semibold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {availableMetrics.map(([key, config]) => {
                          const bVal = baseline.metrics[key];
                          const lVal = latest.metrics[key];
                          const diff = lVal - bVal;
                          const isImprovement =
                            config.direction === "down" ? diff < 0 : diff > 0;
                          const isSignificant = Math.abs(diff) >= config.mcid;

                          return (
                            <tr key={key} className="hover:bg-muted/20">
                              <td className="px-6 py-4 font-medium">{config.label}</td>
                              <td className="px-6 py-4 text-muted-foreground">
                                {bVal.toFixed(1)}
                              </td>
                              <td className="px-6 py-4 font-bold">{lVal.toFixed(1)}</td>
                              <td
                                className={`px-6 py-4 font-semibold ${
                                  isImprovement
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
                                    <AlertCircle className="w-3 h-3 mr-1" /> En progression
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
