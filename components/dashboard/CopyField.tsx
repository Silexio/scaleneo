"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyFieldProps {
  value: string;
  label: string;
  multiline?: boolean;
}

/** Read-only value with a one-click copy action and transient confirmation. */
export function CopyField({ value, label, multiline = false }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
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
          aria-label={copied ? `${label} copié` : `Copier ${label}`}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          <span className="ml-2">{copied ? "Copié" : "Copier"}</span>
        </Button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs text-foreground",
          multiline ? "whitespace-pre" : "whitespace-nowrap",
        )}
      >
        {value}
      </pre>
    </div>
  );
}
