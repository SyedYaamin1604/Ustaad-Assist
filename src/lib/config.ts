/**
 * Everything the app reads from the environment, in one place.
 *
 * Expo only inlines `process.env.EXPO_PUBLIC_*` when it is written out in full,
 * so each variable is read by name below rather than through a loop.
 *
 * Copy `.env.example` to `.env.local` and fill it in. Only public values belong
 * here — the Supabase anon key is designed to ship inside the app, the service
 * role key never is.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`${name} is not set. Copy .env.example to .env.local, fill it in, then restart Expo.`);
  }
  return value.trim();
}

export const config = {
  /** The Express backend, e.g. https://ustaadassist.vercel.app (no trailing slash). */
  apiUrl: required("EXPO_PUBLIC_API_URL", process.env.EXPO_PUBLIC_API_URL).replace(/\/+$/, ""),

  supabaseUrl: required("EXPO_PUBLIC_SUPABASE_URL", process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: required("EXPO_PUBLIC_SUPABASE_ANON_KEY", process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),

  /** Supabase Storage bucket for material, class-list photos and course outlines. */
  storageBucket: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || "materials",

  /**
   * Show "Continue with Google". Off unless set to "true" — it only works once
   * the Google provider is enabled in the Supabase dashboard.
   */
  googleSignIn: process.env.EXPO_PUBLIC_GOOGLE_SIGNIN?.trim() === "true",

  /**
   * Optional. Pretend today is this date (YYYY-MM-DD) when talking to the
   * planner, so a whole semester can be demonstrated without waiting for it.
   * The backend accepts `today` on exactly these endpoints for that reason.
   */
  demoToday: process.env.EXPO_PUBLIC_DEMO_TODAY?.trim() || null,
};
