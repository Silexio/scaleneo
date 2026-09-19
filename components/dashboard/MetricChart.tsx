"use client";

/**
 * MetricChart Component
 *
 * Displays a line chart for a specific clinical metric over time.
 * Shows baseline and MCID target reference lines.
 * Uses a ref + ResizeObserver instead of ResponsiveContainer for print compatibility.
 */

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from "recharts";
import { ChartLine } from "lucide-react";
import { MetricConfig } from "@/utils/metricsConfig";

interface MetricChartProps {
    metricKey: string;
    config: MetricConfig;
    chartData: Array<{
        name: string;
        date: string;
        [key: string]: string | number;
    }>;
    baselineValue: number;
}

const CHART_HEIGHT = 250;

export function MetricChart({
    metricKey,
    config,
    chartData,
    baselineValue,
}: MetricChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(500);

    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.clientWidth);
            }
        };

        measure();

        const ro = new ResizeObserver(measure);
        if (containerRef.current) ro.observe(containerRef.current);

        window.addEventListener("beforeprint", measure);
        return () => {
            ro.disconnect();
            window.removeEventListener("beforeprint", measure);
        };
    }, []);

    const mcidTarget =
        config.direction === "down"
            ? baselineValue - config.mcid
            : baselineValue + config.mcid;

    return (
        <Card className="shadow-sm border-muted overflow-hidden print:break-inside-avoid">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2"><ChartLine className="size-4" aria-hidden="true" />{config.label}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                        Range: {config.min}-{config.max}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div ref={containerRef} className="w-full mt-4">
                    <LineChart
                        width={width}
                        height={CHART_HEIGHT}
                        data={chartData}
                        margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--border)"
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                            domain={[config.min, config.max]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "var(--radius)",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--popover)",
                                color: "var(--popover-foreground)",
                            }}
                            labelStyle={{ fontWeight: "bold", fontSize: "12px" }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                        <ReferenceLine
                            y={baselineValue}
                            stroke="var(--muted-foreground)"
                            strokeDasharray="3 3"
                        />
                        <ReferenceLine
                            y={mcidTarget}
                            stroke="var(--text-success)"
                            strokeDasharray="5 5"
                        />
                        <Line
                            type="monotone"
                            dataKey={metricKey}
                            name={config.label}
                            stroke={config.color}
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: config.color,
                                strokeWidth: 2,
                                stroke: "var(--card)",
                            }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </div>
            </CardContent>
        </Card>
    );
}
