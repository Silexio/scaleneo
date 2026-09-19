"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Plug } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

function ConnectIcon() {
  const { pending } = useLinkStatus();

  if (pending) return <Spinner label="Ouverture de la page de connexion" />;
  return <Plug className="size-4" aria-hidden="true" />;
}

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
      <ConnectIcon />
      <span className="sr-only sm:not-sr-only">Connexion IA</span>
    </Link>
  );
}
