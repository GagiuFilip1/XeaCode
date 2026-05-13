"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  submitContact,
  type ContactFormPayload,
} from "@/lib/api/contact";
import { spring, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ContactSuccess } from "./ContactSuccess";

/**
 * Contact form — single Client Component owning all state and the dispatch
 * to the mock submit. Pattern that future forms inherit.
 *
 * Architecture:
 * - Controlled inputs via `useState<FormValues>`.
 * - Hand-rolled `validateContact()` runs on blur (per-field UX) and on submit
 *   (gate). Errors are tagged with simple enums (`"required" | "invalid"`),
 *   localized at render time via `useTranslations`.
 * - State machine: idle → submitting → success | error → idle (on edit).
 * - Reduced-motion: gates the submit-button `whileTap` and the success
 *   card's slide-in. The form itself is fully functional in either mode.
 *
 * NOTE: every visible string comes from `useTranslations` against the
 * `contact.form` namespace. No hardcoded copy.
 */

type FormValues = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type RequiredField = "name" | "email" | "message";
type FieldError = "required" | "invalid";
type FormErrors = Partial<Record<RequiredField, FieldError>>;

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; reason: "validation" | "rate_limited" | "server" }
  | { kind: "success"; id: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_VALUES: FormValues = { name: "", email: "", company: "", message: "" };

function validateContact(v: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!v.name.trim()) errors.name = "required";
  if (!v.email.trim()) {
    errors.email = "required";
  } else if (!EMAIL_RX.test(v.email.trim())) {
    errors.email = "invalid";
  }
  if (!v.message.trim()) errors.message = "required";
  return errors;
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const tContact = useTranslations("contact");
  const reduced = usePrefersReducedMotion();

  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  const submitting = status.kind === "submitting";

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear any existing field error as the user types — less aggressive UX
    if ((errors as Record<string, FieldError | undefined>)[key as string]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    // Clear server-error banner once the user is engaging again
    if (status.kind === "error") {
      setStatus({ kind: "idle" });
    }
  };

  const validateField = (key: RequiredField) => {
    const all = validateContact(values);
    setErrors((prev) => ({ ...prev, [key]: all[key] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const fieldErrors = validateContact(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    setStatus({ kind: "submitting" });

    const payload: ContactFormPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim() || undefined,
      message: values.message.trim(),
    };

    try {
      const response = await submitContact(payload);
      if (response.ok) {
        setStatus({ kind: "success", id: response.id });
      } else {
        setStatus({ kind: "error", reason: response.error });
      }
    } catch {
      setStatus({ kind: "error", reason: "server" });
    }
  };

  const fieldErrorMessage = (key: RequiredField): string | null => {
    const err = errors[key];
    if (!err) return null;
    return err === "required" ? t("validationRequired") : t("validationEmail");
  };

  // ---- Render ----

  if (status.kind === "success") {
    return <ContactSuccess />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <AnimatePresence>
        {status.kind === "error" && (
          <motion.div
            role="alert"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={spring}
            className={cn(
              "rounded-xl border border-rose-500/30 bg-rose-500/[0.06]",
              "px-4 py-3",
            )}
          >
            <p className="text-sm font-medium text-rose-300 mb-0.5">
              {t("errorTitle")}
            </p>
            <p className="text-xs text-fg-muted">{t("errorMessage")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Field
        id="contact-name"
        label={t("name")}
        error={fieldErrorMessage("name")}
      >
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => validateField("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          disabled={submitting}
          className={inputClass(!!errors.name)}
        />
      </Field>

      <Field
        id="contact-email"
        label={t("email")}
        error={fieldErrorMessage("email")}
      >
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => validateField("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          disabled={submitting}
          className={inputClass(!!errors.email)}
        />
      </Field>

      <Field id="contact-company" label={t("company")}>
        <input
          id="contact-company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          disabled={submitting}
          className={inputClass(false)}
        />
      </Field>

      <Field
        id="contact-message"
        label={t("message")}
        error={fieldErrorMessage("message")}
      >
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => validateField("message")}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          disabled={submitting}
          className={cn(inputClass(!!errors.message), "resize-y min-h-[120px]")}
        />
      </Field>

      {/* Submit-adjacent preform note — second render site for contact.preformNote
          (the first is in the section header). Risk-reversals land hardest at
          submit anxiety, not section entry — Growth Hacker plan-review flag.
          Same translation key as the header copy; visual repetition is
          intentional. text-fg-muted (not accent) per Brand Guardian. */}
      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-fg-muted max-w-[55ch] -mb-2">
        {tContact("preformNote")}
      </p>

      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={reduced || submitting ? undefined : { scale: 0.98 }}
        transition={spring}
        className={cn(
          "inline-flex items-center justify-center",
          "h-12 px-6 min-w-[160px] rounded-full",
          "bg-accent text-bg hover:bg-accent-strong",
          "text-sm font-medium tracking-tight",
          "transition-colors duration-200",
          "shadow-card",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "self-start",
        )}
      >
        {submitting ? t("submitting") : t("submit")}
      </motion.button>
    </form>
  );
}

// ---- Local helpers ----

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-mono uppercase tracking-[0.2em] text-fg-subtle"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-rose-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return cn(
    "w-full rounded-lg",
    "bg-bg-elevated/60",
    "border",
    hasError ? "border-rose-500/50" : "border-border hover:border-border-strong",
    "px-4 py-3",
    "text-base text-fg",
    "focus:outline-none focus:border-accent focus:bg-bg-elevated",
    "transition-colors duration-200",
    "disabled:opacity-60 disabled:cursor-not-allowed",
  );
}
