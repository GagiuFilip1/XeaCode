import { useTranslations } from "next-intl";
import { ContactForm } from "./contact/ContactForm";
import { ContactDetails } from "./contact/ContactDetails";

/**
 * Contact — 2-column section (form left, details right at lg+; stacked mobile).
 *
 * RSC shell: section heading + container + 2-col grid. The form is a Client
 * leaf (`ContactForm`) holding state + dispatching the mock submit. Details
 * is RSC (`ContactDetails`).
 *
 * Mobile order: form first (primary affordance above the fold), details
 * second. Achieved via the natural source order — desktop reverses nothing
 * since the grid keeps form left already.
 *
 * Per design handoff: section sits on `bg-elevated` for alternating rhythm.
 * The pre-form note is rendered inside `ContactForm` (above the submit
 * button), NOT in this header.
 */
export function Contact() {
  const t = useTranslations("contact");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 py-[clamp(72px,11vw,128px)] bg-bg-elevated"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 md:mb-20 max-w-[56ch]">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-accent mb-4">
            {t("eyebrow")}
          </p>
          <h2
            id="contact-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] gap-12 lg:gap-20 items-start">
          <ContactForm />
          <ContactDetails />
        </div>
      </div>
    </section>
  );
}
