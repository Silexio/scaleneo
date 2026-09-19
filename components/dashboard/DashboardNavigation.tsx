"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartLine, ClipboardList, Download, FileUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PendingIcon } from "@/components/ui/pending-icon";
import { usePatient } from "@/components/providers/PatientProvider";
import { useAssessments } from "@/hooks/useAssessments";

interface Tab {
  name: string;
  href: string;
  icon: LucideIcon;
  hasData?: boolean;
}

/**
 * Main dashboard tabs, with a dot marking the sections that already hold data.
 *
 * The MCP connection lives in the header instead, to keep this row to the four
 * steps of a clinical session.
 */
export function DashboardNavigation() {
  const pathname = usePathname();
  const { patientData } = usePatient();
  const { assessments } = useAssessments();

  const tabs: Tab[] = [
    { name: "Extraction", href: "/extraction", icon: FileUp },
    { name: "Résultats", href: "/results", icon: ClipboardList, hasData: !!patientData },
    { name: "Analytics", href: "/analytics", icon: ChartLine, hasData: assessments.length > 0 },
    { name: "Export", href: "/export", icon: Download, hasData: !!patientData },
  ];

  return (
    <nav aria-label="Sections du bilan" className="flex w-full justify-center">
      <div className="grid w-full max-w-2xl grid-cols-2 gap-1 rounded-xl border bg-muted p-1 shadow-sm sm:grid-cols-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                "ring-offset-background transition-all duration-[var(--duration-base)] ease-[var(--ease-entrance)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
              )}
            >
              <PendingIcon icon={tab.icon} label="Ouverture de la section" />
              {tab.name}

              {tab.hasData && (
                <span
                  className="absolute right-2 top-2 size-1.5 rounded-full bg-[var(--text-success)]"
                  aria-label="Données disponibles"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
