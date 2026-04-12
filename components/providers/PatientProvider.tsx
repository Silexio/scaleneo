"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PatientData } from "@/types/patient";

interface PatientContextType {
  patientData: PatientData | null;
  setPatientData: (data: PatientData | null) => void;
  rawContent: string;
  setRawContent: (content: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const STORAGE_KEY = "scaleneo_patient_data";
const RAW_CONTENT_KEY = "scaleneo_raw_content";

/**
 * Patient Provider Component
 *
 * Manages global patient data state with localStorage persistence.
 * Data survives page reloads. Storage errors are silently ignored.
 */
export function PatientProvider({ children }: { children: ReactNode }) {
  const [patientData, setPatientDataState] = useState<PatientData | null>(null);
  const [rawContent, setRawContentState] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPatientDataState(JSON.parse(stored) as PatientData);
      const raw = localStorage.getItem(RAW_CONTENT_KEY);
      if (raw) setRawContentState(raw);
    } catch {
      // localStorage indisponible ou données corrompues — état vide
    }
  }, []);

  const setPatientData = (data: PatientData | null) => {
    setPatientDataState(data);
    try {
      if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // quota dépassé — on continue sans persister
    }
  };

  const setRawContent = (content: string) => {
    setRawContentState(content);
    try {
      if (content) localStorage.setItem(RAW_CONTENT_KEY, content);
      else localStorage.removeItem(RAW_CONTENT_KEY);
    } catch {
      // quota dépassé — on continue sans persister
    }
  };

  return (
    <PatientContext.Provider value={{ patientData, setPatientData, rawContent, setRawContent }}>
      {children}
    </PatientContext.Provider>
  );
}

/**
 * Custom hook to access patient context
 *
 * @throws Error if used outside PatientProvider
 * @returns Patient context with data and setter functions
 */
export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
