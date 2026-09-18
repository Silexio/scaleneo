"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { StableBold } from "@/components/ui/StableBold";
import { usePatient } from "@/components/providers/PatientProvider";
import { useAssessments } from "@/hooks/useAssessments";

/**
 * DashboardNavigation Component
 *
 * Main navigation tabs for the SCALENEO dashboard.
 * Displays 5 tabs: Extraction, Results, Analytics, Export, Connexion IA.
 * Shows a green dot on Results and Export when a patient is loaded.
 */
export function DashboardNavigation() {
  const pathname = usePathname();
  const { patientData } = usePatient();
  const { assessments } = useAssessments();
  const hasPatient = !!patientData;
  const hasAnalytics = assessments.length > 0;

  const tabs = [
    { name: "📋 Extraction", href: "/extraction", id: "extraction", badge: false },
    { name: "📊 Résultats", href: "/results", id: "results", badge: hasPatient },
    { name: "📈 Analytics", href: "/analytics", id: "analytics", badge: hasAnalytics },
    { name: "💾 Export", href: "/export", id: "export", badge: hasPatient },
    { name: "🔌 Connexion IA", href: "/connect", id: "connect", badge: false },
  ];

  return (
    <div className="flex justify-center w-full">
      <div className="grid w-full max-w-4xl grid-cols-2 sm:grid-cols-5 h-auto p-1 bg-muted border shadow-sm rounded-lg">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "group relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-3 text-sm font-medium border border-transparent ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? "bg-background/80 backdrop-blur-md border-foreground/10 text-foreground shadow-md"
                  : "hover:bg-background/50 hover:backdrop-blur-md hover:border-foreground/10 hover:text-foreground hover:shadow-md text-muted-foreground",
              )}
            >
              <StableBold
                text={tab.name}
                hoverClassName={cn(
                  isActive ? "font-bold" : "group-hover:font-bold group-hover:text-foreground"
                )}
              />
              {tab.badge && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--text-success)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
