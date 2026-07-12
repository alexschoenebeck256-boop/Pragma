import { type Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get the Stripe instance for the frontend.
 * Uses the publishable key from environment (VITE_STRIPE_PUBLISHABLE_KEY).
 * Falls back to a placeholder key that won't work in production but allows
 * the dev build to compile without env vars configured.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";
    if (!key) {
      console.warn(
        "VITE_STRIPE_PUBLISHABLE_KEY is not set — Stripe payments will not work until a key is configured.",
      );
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

/**
 * Server-side Stripe secret key (only available in server functions/routes).
 * Access via process.env.STRIPE_SECRET_KEY.
 */
export function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set — configure it before processing payments.",
    );
  }
  return key;
}