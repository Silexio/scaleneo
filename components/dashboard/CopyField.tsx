"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyFieldProps {
  value: string;
  label: string;
}

/** Read-only value with a one-click copy action and transient confirmation. */
export function CopyField({ value, label }: CopyFieldProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 3000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          aria-label={state === "copied" ? `${label} copié` : `Copier ${label}`}
        >
          {state === "copied" ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span className="ml-2">
            {state === "copied" ? "Copié" : state === "failed" ? "Sélectionnez le texte" : "Copier"}
          </span>
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs text-foreground">
        {value}
      </pre>
    </div>
  );
}
