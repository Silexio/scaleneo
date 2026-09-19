"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plug } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PendingIcon } from "@/components/ui/pending-icon";
import { cn } from "@/lib/utils";

/** Header action linking to the MCP connection page, kept out of the main tabs. */
export function McpConnectButton() {
  const isActive = usePathname() === "/connect";

  return (
    <Link
      href="/connect"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "secondary" : "outline", size: "sm" }),
        "gap-2 shrink-0",
      )}
    >
      <PendingIcon icon={Plug} label="Ouverture de la page de connexion" />
      <span className="sr-only sm:not-sr-only">Connexion IA</span>
    </Link>
  );
}
