import { useTranslations } from "next-intl";
import { Marquee } from "./tech/Marquee";
import { STACK_TILES } from "./tech/logos";

/**
 * Tech Stack — twin counter-scrolling marquees with category breadcrumb.
 *
 * RSC shell: section header + breadcrumb + container. The animated marquees
 * + reduced-motion fallback live in the Client `Marquee` leaf.
 *
 * Edge fade via mask-image gradient so tiles fade into the bg rather than
 * hard-clip at section boundaries.
 *
 * Anchor is `#stack` per Phase 3 design handoff (renamed from `#tech`).
 */
export function TechStack() {
  const t = useTranslations("tech");

  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-20 py-[clamp(72px,11vw,128px)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 md:mb-16 max-w-[56ch]">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent mb-4">
            {t("eyebrow")}
          </p>
          <h2
            id="stack-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch] mb-6">
            {t("subtitle")}
          </p>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-fg-subtle">
            {t("breadcrumb")}
          </p>
        </header>

        {/* Marquee block with edge fade via mask-image. Two rows in opposite
            directions per brief. */}
        <div
          className="space-y-6"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
        >
          <Marquee tiles={STACK_TILES} direction="left" />
          <Marquee tiles={[...STACK_TILES].reverse()} direction="right" />
        </div>

        {/* Scope-note line — rendered OUTSIDE the masked container so the
            edge-fade gradient does not apply to the text. Body sans (not mono)
            because the disqualifier carries information density that needs
            prose treatment, not footnote treatment. */}
        <p className="mt-12 text-sm md:text-base text-fg-muted leading-relaxed max-w-[55ch]">
          {t("scopeNote")}
        </p>
      </div>
    </section>
  );
}
