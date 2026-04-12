/**
 * MetricCard Component
 *
 * Displays a metric with its current value, baseline, change indicator, and MCID status.
 * Used in the analytics dashboard to show clinical assessment metrics.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { MetricConfig } from "@/utils/metricsConfig";

interface MetricCardProps {
    metricKey: string;
    config: MetricConfig;
    baselineValue: number;
    latestValue: number;
}

/**
 * Renders a card displaying metric information with trend indicators
 */
export function MetricCard({ config, baselineValue, latestValue }: MetricCardProps) {
    const diff = latestValue - baselineValue;
    const isImprovement = config.direction === "down" ? diff < 0 : diff > 0;
    const isSignificant = Math.abs(diff) >= config.mcid;

    return (
        <Card className="shadow-sm overflow-hidden print:break-inside-avoid">
            <div
                className="h-1 w-full"
                style={{
                    backgroundColor: isSignificant
                        ? isImprovement
                            ? "hsl(var(--bg-success))"
                            : "hsl(var(--bg-error))"
                        : "hsl(var(--muted))",
                }}
            />
            <CardContent className="pt-4 px-4 pb-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {config.label}
                    </span>
                    {isSignificant && (
                        <Badge
                            className={
                                isImprovement
                                    ? "bg-[hsl(var(--bg-success))] text-[hsl(var(--text-success))] hover:bg-[hsl(var(--bg-success))] border-none px-1.5 py-0 text-[9px]"
                                    : "bg-[hsl(var(--bg-error))] text-[hsl(var(--text-error))] hover:bg-[hsl(var(--bg-error))] border-none px-1.5 py-0 text-[9px]"
                            }
                        >
                            MCID √
                        </Badge>
                    )}
                </div>
                <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">{latestValue.toFixed(1)}</div>
                    <div
                        className={`flex items-center text-xs font-semibold ${isImprovement ? "text-[hsl(var(--text-success))]" : "text-[hsl(var(--text-error))]"
                            }`}
                    >
                        {isImprovement ? (
                            <TrendingDown className="w-3 h-3 mr-0.5" />
                        ) : (
                            <TrendingUp className="w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(diff).toFixed(1)}
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <div className="text-[10px] text-muted-foreground">
                        Baseline: <span className="font-medium text-foreground">{baselineValue}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                        Cible: <span className="font-medium text-foreground">±{config.mcid}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
