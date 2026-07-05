"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { PatientData } from "@/types/patient";
import { STORAGE_KEYS } from "@/utils/storageKeys";
import { useLocalStorageValue } from "@/hooks/useLocalStorageValue";

interface PatientContextType {
  patientData: PatientData | null;
  setPatientData: (data: PatientData | null) => void;
  rawContent: string;
  setRawContent: (content: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

function safeParse(raw: string | null): PatientData | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PatientData;
  } catch {
    return null;
  }
}

/**
 * Manages global patient data state persisted in localStorage.
 * Data survives reloads and stays in sync across tabs; storage errors fall back to memory.
 */
export function PatientProvider({ children }: { children: ReactNode }) {
  const [rawPatient, setRawPatient] = useLocalStorageValue(STORAGE_KEYS.patientData);
  const [storedContent, setStoredContent] = useLocalStorageValue(STORAGE_KEYS.rawContent);

  const patientData = useMemo(() => safeParse(rawPatient), [rawPatient]);

  const value = useMemo<PatientContextType>(
    () => ({
      patientData,
      setPatientData: (data) => setRawPatient(data ? JSON.stringify(data) : null),
      rawContent: storedContent ?? "",
      setRawContent: (content) => setStoredContent(content || null),
    }),
    [patientData, storedContent, setRawPatient, setStoredContent]
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
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
