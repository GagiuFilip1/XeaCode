/**
 * Contact form contract.
 *
 * Plain types module — NO "use client" directive. Both Client Components
 * (`ContactForm.tsx`) and the mock implementation consume this contract as
 * regular JS values, not Client References. (See `.claude/docs/lessons.md` —
 * `"use client" exports become Client References`.)
 *
 * The discriminated `ContactFormResponse` is the SHAPE the future .NET 10
 * Web API must match. When the API arrives, only the implementation behind
 * `src/lib/api/contact.ts` swaps; the form component is unchanged.
 */

export type ContactFormPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export type ContactFormResponse =
  | { ok: true; id: string }
  | { ok: false; error: "validation" | "rate_limited" | "server" };
