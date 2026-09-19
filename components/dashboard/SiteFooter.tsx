const SILEXIO_URL = "https://silexio.be";

/** Development credit, linking back to Silexio. */
export function SiteFooter() {
  return (
    <footer className="flex justify-center border-t pt-5 print:hidden">
      <a
        href={SILEXIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
    </footer>
  );
}
