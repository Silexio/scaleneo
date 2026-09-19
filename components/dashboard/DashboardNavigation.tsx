"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ChartLine, ClipboardList, Download, FileUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { usePatient } from "@/components/providers/PatientProvider";
import { useAssessments } from "@/hooks/useAssessments";

interface Tab {
  name: string;
  href: string;
  icon: LucideIcon;
  hasData: boolean;
}

const SLIDE = { type: "spring", stiffness: 380, damping: 32 } as const;

function TabIcon({ icon: Icon }: { icon: LucideIcon }) {
  const { pending } = useLinkStatus();

  if (pending) return <Spinner className="size-4" label="Ouverture de la section" />;
  return <Icon className="size-4 shrink-0" aria-hidden="true" />;
}

/**
 * Main dashboard tabs, with a dot marking the sections that already hold data.
 *
 * The MCP connection lives in the header instead, to keep this row to the four
 * steps of a clinical session.
 */
export function DashboardNavigation() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { patientData } = usePatient();
  const { assessments } = useAssessments();

  const tabs: Tab[] = [
    { name: "Extraction", href: "/extraction", icon: FileUp, hasData: false },
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
                "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="dashboard-tab"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm"
                  transition={prefersReducedMotion ? { duration: 0 } : SLIDE}
                />
              )}

              <span className="relative z-10 inline-flex items-center gap-2">
                <TabIcon icon={tab.icon} />
                {tab.name}
              </span>

              {tab.hasData && (
                <span
                  className="absolute right-2 top-2 z-10 size-1.5 rounded-full bg-[var(--text-success)]"
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
