import { Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SILEXIO_URL = "https://silexio.be";
const REPOSITORY_URL = "https://github.com/Silexio/scaleneo";

/** Development credit and source link. */
export function SiteFooter() {
  return (
    <footer className="grid items-center gap-3 border-t pt-5 sm:grid-cols-[1fr_auto_1fr] print:hidden">
      <span aria-hidden="true" className="hidden sm:block" />
      <a
        href={SILEXIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-self-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG statique, next/image n'optimise pas le SVG et coûte 7 Ko de runtime */}
        <img
          src="/silexio.svg"
          alt=""
          aria-hidden="true"
          width={18}
          height={24}
          className="h-6 w-auto opacity-80 transition-opacity group-hover:opacity-100 dark:invert"
        />
        <span>
          Développé par <span className="font-semibold tracking-wide text-foreground">SILEXIO</span>
        </span>
      </a>

      <a
        href={REPOSITORY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-2 justify-self-center text-muted-foreground hover:text-foreground sm:justify-self-end",
        )}
      >
        <Github className="size-4" aria-hidden="true" />
        Code source
      </a>
    </footer>
  );
}
