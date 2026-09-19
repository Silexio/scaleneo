"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Replays the entrance animation on every route change by remounting its content. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="anim-enter">
      {children}
    </div>
  );
}
