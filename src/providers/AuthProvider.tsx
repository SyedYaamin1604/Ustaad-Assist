/**
 * Who is signed in.
 *
 * Supabase does the signing in; the backend only verifies the token. After any
 * sign-in the backend's GET /auth/me is called, which creates the teacher row
 * on first use (the API contract asks for exactly this).
 */

import type { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { authApi, type Teacher } from "@/api";
import { supabase } from "@/lib/supabase";

// Closes the browser tab on web once Google redirects back.
WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  session: Session | null;
  teacher: Teacher | null;
  /** The name to greet the teacher with. */
  displayName: string;
  /** True until the stored session has been read on launch. */
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  /** Resolves with true when the teacher still has to confirm their email. */
  signUp: (fullName: string, email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = use(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

/** Supabase errors are Error-shaped already; this just makes the call sites one line. */
function throwIf(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  // Kept with the user it belongs to, so a different sign-in never shows the old profile.
  const [profile, setProfile] = useState<{ userId: string; teacher: Teacher } | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  // Register / load the teacher row whenever a different user signs in.
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    authApi
      .me()
      .then((teacher) => setProfile({ userId, teacher }))
      // A failure here is not fatal: every other request carries the token and
      // will surface its own error if the backend is unreachable.
      .catch(() => undefined);
  }, [userId]);

  const teacher = profile && profile.userId === userId ? profile.teacher : null;

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    throwIf(error);
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    // The backend has no endpoint for the teacher's name yet, so it is kept in
    // the Supabase user metadata, where the app can still read it.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });
    throwIf(error);
    return { needsConfirmation: data.session === null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = Linking.createURL("auth/callback");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true },
    });
    throwIf(error);
    if (!data.url) throw new Error("Google sign-in is not available right now.");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success") return; // the teacher closed the browser

    const code = Linking.parse(result.url).queryParams?.code;
    if (typeof code !== "string") throw new Error("Google sign-in did not complete. Please try again.");

    const exchanged = await supabase.auth.exchangeCodeForSession(code);
    throwIf(exchanged.error);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    throwIf(error);
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    throwIf(error);
  }, []);

  const displayName = useMemo(() => {
    const metadataName = session?.user.user_metadata?.full_name;
    return (
      teacher?.full_name ??
      (typeof metadataName === "string" && metadataName.trim() !== "" ? metadataName : null) ??
      session?.user.email?.split("@")[0] ??
      "Teacher"
    );
  }, [teacher, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      teacher,
      displayName,
      isLoading,
      signIn,
      signUp,
      signInWithGoogle,
      sendPasswordReset,
      signOut,
    }),
    [session, teacher, displayName, isLoading, signIn, signUp, signInWithGoogle, sendPasswordReset, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
