/**
 * AssessmentTimeline Component
 * 
 * Displays a chronological list of clinical assessments with dates and labels.
 * Allows users to remove individual assessments.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { Assessment } from "@/types/assessment";

interface AssessmentTimelineProps {
    assessments: Assessment[];
    onRemove: (id: string) => void;
}

/**
 * Renders a timeline of assessments with deletion capability
 */
export function AssessmentTimeline({ assessments, onRemove }: AssessmentTimelineProps) {
    return (
        <Card className="shadow-sm border-muted">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-foreground" /> Timeline des Bilans
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-100 overflow-y-auto">
                    {assessments.length === 0 ? (
                        <div className="p-8 text-center text-xs text-muted-foreground italic">
                            Aucun bilan chargé
                        </div>
                    ) : (
                        assessments.map((assessment, idx) => (
                            <div
                                key={assessment.id}
                                className={`flex items-start justify-between p-3 border-b hover:bg-muted/30 transition-colors ${idx === 0 ? "bg-primary/5" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <div
                                        className={`mt-1 p-1 rounded-full ${idx === 0
                                            ? "bg-primary/20 text-primary"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold leading-none mb-1">
                                            {assessment.label}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {new Date(assessment.date).toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => onRemove(assessment.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
