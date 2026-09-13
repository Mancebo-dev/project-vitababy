import { Resend } from "resend";

// Initialize with a fallback to avoid errors if API key is not yet set
// The system will only log a warning if we try to send without a real key
export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_dummy_key_do_not_use",
);

// In development/testing, Resend requires using this specific sender address
// unless you have verified your own domain.
export const DEFAULT_SENDER = "onboarding@resend.dev";
