"use client";

import { useLinkStatus } from "next/link";
import type { LucideIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface PendingIconProps {
  icon: LucideIcon;
  label: string;
}

/** Link icon that turns into a spinner while its navigation is pending. */
export function PendingIcon({ icon: Icon, label }: PendingIconProps) {
  const { pending } = useLinkStatus();

  if (pending) return <Spinner label={label} />;
  return <Icon className="size-4 shrink-0" aria-hidden="true" />;
}
