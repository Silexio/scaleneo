import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  label?: string;
}

/** Indeterminate activity indicator, announced to assistive technology. */
export function Spinner({ className, label = "Chargement en cours" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}
