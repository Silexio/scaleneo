import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "green" | "yellow" | "red" | "neutral";
}

const VARIANTS = {
  green: "bg-[var(--bg-success)] text-[var(--text-success)]",
  yellow: "bg-[var(--bg-warning)] text-[var(--text-warning)]",
  red: "bg-[var(--bg-error)] text-[var(--text-error)]",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function Badge({
  variant = "neutral",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
