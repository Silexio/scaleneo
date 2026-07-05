"use client";

import { useCallback, useMemo } from "react";
import { Assessment } from "@/types/assessment";
import { STORAGE_KEYS } from "@/utils/storageKeys";
import { getLocalStorageStore, useLocalStorageValue } from "@/hooks/useLocalStorageValue";

type AssessmentDraft = Omit<Assessment, "label"> & { label: string };

function parseAssessments(raw: string | null): Assessment[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Assessment[];
  } catch {
    return [];
  }
}

/**
 * Manages clinical assessments with localStorage persistence and cross-component sync.
 * Label defaults to "Suivi N" (computed from current count) when left empty.
 */
export function useAssessments() {
  const [raw, setRaw] = useLocalStorageValue(STORAGE_KEYS.analyticsAssessments);
  const assessments = useMemo(() => parseAssessments(raw), [raw]);

  const setAssessments = useCallback(
    (updater: (prev: Assessment[]) => Assessment[]) => {
      const store = getLocalStorageStore(STORAGE_KEYS.analyticsAssessments);
      const next = updater(parseAssessments(store.getSnapshot()));
      setRaw(next.length > 0 ? JSON.stringify(next) : null);
    },
    [setRaw]
  );

  const addAssessment = useCallback(
    (draft: AssessmentDraft) => {
      setAssessments((prev) => {
        const assessment: Assessment = {
          ...draft,
          label: draft.label || `Suivi ${prev.length + 1}`,
        };
        return [...prev, assessment].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      });
    },
    [setAssessments]
  );

  const removeAssessment = useCallback(
    (id: string) => setAssessments((prev) => prev.filter((a) => a.id !== id)),
    [setAssessments]
  );

  const clearAssessments = useCallback(
    () => setAssessments(() => []),
    [setAssessments]
  );

  return { assessments, addAssessment, removeAssessment, clearAssessments };
}
