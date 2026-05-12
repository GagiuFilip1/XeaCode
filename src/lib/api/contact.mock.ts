import type {
  ContactFormPayload,
  ContactFormResponse,
} from "./contracts/contact";

/**
 * Mock implementation of the contact submit endpoint.
 *
 * Replaces the future `.NET 10 Web API` call until that backend ships. The
 * production swap is a single re-export change in `src/lib/api/contact.ts` —
 * this file gets removed and `contact.live.ts` (or similar) takes its place.
 *
 * Behavior:
 * - Simulates ~1200ms latency so the UI's "submitting" state is exercisable.
 * - Returns a UUID-bearing success for VALID payloads.
 * - Returns `{ ok: false, error: 'validation' }` for clearly-invalid payloads
 *   (defensive backstop — client should catch these first, but the contract
 *   has to express the failure mode for the real API later).
 * - Logs to `console.info` so devs can verify wiring without React DevTools.
 * - NO real persistence, NO real email send.
 *
 * Plain async function — no "use client" directive (the file isn't a React
 * component). Imported by the `ContactForm` Client Component.
 */

const MOCK_LATENCY_MS = 1200;
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function submitContact(
  payload: ContactFormPayload,
): Promise<ContactFormResponse> {
  console.info("[contact.mock] submit", payload);

  await sleep(MOCK_LATENCY_MS);

  // Defensive validation — the form should catch all of these client-side,
  // but the contract reserves the validation error variant for the real API.
  if (!payload.name.trim()) {
    return { ok: false, error: "validation" };
  }
  if (!payload.email.trim() || !EMAIL_RX.test(payload.email.trim())) {
    return { ok: false, error: "validation" };
  }
  if (!payload.message.trim()) {
    return { ok: false, error: "validation" };
  }

  return {
    ok: true,
    id: globalThis.crypto.randomUUID(),
  };
}
