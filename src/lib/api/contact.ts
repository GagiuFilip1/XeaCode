/**
 * Single import site for the contact submit endpoint.
 *
 * Today: re-exports the mock. When the .NET 10 Web API arrives, this file
 * is the ONE place that changes — point `submitContact` at the real HTTP
 * fetch implementation. The form, the contract types, and the success/error
 * UI all stay the same.
 */

export { submitContact } from "./contact.mock";
export type {
  ContactFormPayload,
  ContactFormResponse,
} from "./contracts/contact";
