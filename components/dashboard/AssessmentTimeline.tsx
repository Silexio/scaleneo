/**
 * AssessmentTimeline Component
 *
 * Displays a chronological list of clinical assessments with dates and labels.
 * Allows users to remove individual assessments with inline confirmation.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Check, Trash2, X } from "lucide-react";
import { Assessment } from "@/types/assessment";

interface AssessmentTimelineProps {
    assessments: Assessment[];
    onRemove: (id: string) => void;
}

/**
 * Renders a timeline of assessments with deletion capability and inline confirmation
 */
export function AssessmentTimeline({ assessments, onRemove }: AssessmentTimelineProps) {
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    const handleRemove = (id: string) => {
        onRemove(id);
        setConfirmingId(null);
    };

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
                                className={`flex items-start justify-between p-3 border-b transition-colors ${idx === 0 ? "bg-primary/5" : "hover:bg-muted/30"}`}
                            >
                                <div className="flex items-start gap-2 min-w-0">
                                    <div className={`mt-1 p-1 rounded-full shrink-0 ${idx === 0 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-bold leading-none mb-1 truncate">{assessment.label}</div>
                                        <div className="text-[10px] text-muted-foreground">
                                            {new Date(assessment.date).toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                </div>

                                {confirmingId === assessment.id ? (
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-6 h-6 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleRemove(assessment.id)}
                                            title="Confirmer la suppression"
                                        >
                                            <Check className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-6 h-6 text-muted-foreground"
                                            onClick={() => setConfirmingId(null)}
                                            title="Annuler"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-6 h-6 text-muted-foreground hover:text-destructive shrink-0 ml-2"
                                        onClick={() => setConfirmingId(assessment.id)}
                                        title="Supprimer ce bilan"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
