"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PatientData } from "@/types/patient";
import { STORAGE_KEYS } from "@/utils/storageKeys";

interface PatientContextType {
  patientData: PatientData | null;
  setPatientData: (data: PatientData | null) => void;
  rawContent: string;
  setRawContent: (content: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);


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
      const stored = localStorage.getItem(STORAGE_KEYS.patientData);
      if (stored) setPatientDataState(JSON.parse(stored) as PatientData);
      const raw = localStorage.getItem(STORAGE_KEYS.rawContent);
      if (raw) setRawContentState(raw);
    } catch {
      // localStorage indisponible ou données corrompues — état vide
    }
  }, []);

  const setPatientData = (data: PatientData | null) => {
    setPatientDataState(data);
    try {
      if (data) localStorage.setItem(STORAGE_KEYS.patientData, JSON.stringify(data));
      else localStorage.removeItem(STORAGE_KEYS.patientData);
    } catch {
      // quota dépassé — on continue sans persister
    }
  };

  const setRawContent = (content: string) => {
    setRawContentState(content);
    try {
      if (content) localStorage.setItem(STORAGE_KEYS.rawContent, content);
      else localStorage.removeItem(STORAGE_KEYS.rawContent);
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
