import { Brain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PatientData } from "@/types/patient";
import { generateHypothesis } from "@/utils/calculations";

interface HypothesisViewProps {
  data: PatientData;
}

/**
 * HypothesisView Component
 *
 * Displays a comprehensive clinical hypothesis synthesized from patient data.
 * Organized into 10 key assessment categories:
 * - Pathology, Sources of Symptoms, Pain Type, Impairments, Pain Mechanisms
 * - Precautions, Patient Perspectives, Activity/Participation, Contributing Factors, Management/Prognosis
 *
 * @param data - Complete patient data object used to generate clinical hypothesis
 */
export function HypothesisView({ data }: HypothesisViewProps) {
  const hypothesis = generateHypothesis(data);

  return (
    <Card className="mb-5 border-2 border-accent bg-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-foreground">
          <Brain className="size-4" aria-hidden="true" />Hypothèse clinique synthétisée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <HypothesisCard
            title="01. Pathologie"
            content={hypothesis.pathology}
          />
          <HypothesisCard
            title="02. Sources"
            content={hypothesis.sourcesOfSymptoms}
          />
          <HypothesisCard
            title="03. Type Douleur"
            content={hypothesis.painType}
          />
          <HypothesisCard
            title="04. Impairments"
            content={hypothesis.impairments}
          />
          <HypothesisCard
            title="05. Mécanismes"
            content={hypothesis.painMechanisms}
          />
          <HypothesisCard
            title="06. Précautions"
            content={hypothesis.precautions}
          />
          <HypothesisCard
            title="07. Perspectives"
            content={hypothesis.patientsPerspectives}
          />
          <HypothesisCard
            title="08. Activités"
            content={hypothesis.activityParticipation}
          />
          <HypothesisCard
            title="09. Facteurs"
            content={hypothesis.contributingFactors}
          />
          <HypothesisCard
            title="10. Management"
            content={hypothesis.managementPrognosis}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * HypothesisCard Subcomponent
 *
 * Displays a single hypothesis category with title and content.
 *
 * @param title - Category title (e.g., "01. Pathologie")
 * @param content - Category content or "Non déterminé" if empty
 */
function HypothesisCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="bg-card p-3 rounded border-l-4 border-l-secondary shadow-sm border border-border">
      <h4 className="text-[10px] font-bold text-secondary-foreground uppercase mb-1">
        {title}
      </h4>
      <p className="text-[11px] text-muted-foreground leading-tight">
        {content || "Non déterminé"}
      </p>
    </div>
  );
}