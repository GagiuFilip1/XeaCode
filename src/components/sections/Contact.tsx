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
 */
export function Contact() {
  const t = useTranslations("contact");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-20 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 md:mb-20 max-w-3xl">
          <h2
            id="contact-title"
            className="font-display text-4xl md:text-5xl tracking-tighter leading-[0.95] text-fg mb-4"
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-fg-muted leading-relaxed max-w-[55ch]">
            {t("subtitle")}
          </p>
          <p className="mt-4 text-xs font-mono uppercase tracking-[0.18em] text-fg-muted max-w-[55ch]">
            {t("preformNote")}
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
