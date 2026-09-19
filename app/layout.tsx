import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { McpConnectButton } from "@/components/dashboard/McpConnectButton";
import { SiteFooter } from "@/components/dashboard/SiteFooter";
import { PatientProvider } from "@/components/providers/PatientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scaleneo - Complete Clinical Platform",
  description:
    "Extraction | Scores | Red Flags | Hypothèse | Analytics & Suivi Longitudinal | Graphiques Interactifs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PatientProvider>
          <div className="container mx-auto max-w-[1600px] space-y-5 p-4 sm:space-y-7 sm:p-6 print:p-0 print:space-y-0">
            <header className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm sm:px-6 sm:py-4 print:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-base font-bold text-primary-foreground sm:size-10"
                  aria-hidden="true"
                >
                  S
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    SCALENEO
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Analyse clinique de la lombalgie
                  </p>
                </div>
              </div>

              <McpConnectButton />
            </header>

            <div className="print:hidden"><DashboardNavigation /></div>

            <div className="animate-in fade-in-50 slide-in-from-bottom-2">
              {children}
            </div>

            <SiteFooter />
          </div>
        </PatientProvider>
      </body>
    </html>
  );
}
