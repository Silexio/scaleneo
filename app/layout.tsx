import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
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
          <div className="container mx-auto p-4 sm:p-6 max-w-[1600px] space-y-6 sm:space-y-8 print:p-0 print:space-y-0">
            <header className="bg-primary text-primary-foreground p-6 sm:p-8 rounded-xl shadow-lg text-center print:hidden">
              <h1 className="text-xl sm:text-4xl font-extrabold mb-2 sm:mb-3 tracking-tight">
                🚀 SCALENEO
              </h1>
              <p className="opacity-90 text-xs sm:text-sm font-medium uppercase tracking-wider">
                Platform Clinique Complète d&apos;Analyse
              </p>
            </header>

            <div className="print:hidden"><DashboardNavigation /></div>

            <div className="animate-in fade-in-50 slide-in-from-bottom-2">
              {children}
            </div>
          </div>
        </PatientProvider>
      </body>
    </html>
  );
}
