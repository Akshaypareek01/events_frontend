/** Production API host (public). Override with NEXT_PUBLIC_API_URL for staging / preview. */
const PRODUCTION_API_URL = "https://eventsapis.samsarawellness.in";

/** Base URL for the Express API (no trailing slash). */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : "http://localhost:4000";
}
