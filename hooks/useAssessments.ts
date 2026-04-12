"use client";

import { useState, useEffect, useCallback } from "react";
import { Assessment } from "@/types/assessment";
import { STORAGE_KEYS } from "@/utils/storageKeys";

type AssessmentDraft = Omit<Assessment, "label"> & { label: string };

/**
 * Manages clinical assessments with localStorage persistence and cross-component sync.
 * Label defaults to "Suivi N" (computed from current count) when left empty.
 */
export function useAssessments() {
  const [assessments, setAssessmentsState] = useState<Assessment[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.analyticsAssessments);
      if (stored) setAssessmentsState(JSON.parse(stored) as Assessment[]);
    } catch {}
  }, []);

  const sync = useCallback((next: Assessment[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.analyticsAssessments, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("scaleneo:analytics:update"));
    } catch {}
  }, []);

  const setAssessments = useCallback(
    (updater: Assessment[] | ((prev: Assessment[]) => Assessment[])) => {
      setAssessmentsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        sync(next);
        return next;
      });
    },
    [sync]
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
    () => setAssessments([]),
    [setAssessments]
  );

  return { assessments, addAssessment, removeAssessment, clearAssessments };
}
