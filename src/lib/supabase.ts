/**
 * The Supabase client.
 *
 * Supabase does two jobs for this app and nothing else:
 *   - Auth: sign-in happens here, in the app. The backend only verifies the token.
 *   - Storage: files are uploaded straight to a bucket. They never pass through
 *     the backend, which only stores the returned path.
 */

import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

import { config } from "./config";

// During the static web render there is no window, so there is nothing to persist to.
const isServerRender = Platform.OS === "web" && typeof window === "undefined";

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: isServerRender ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // PKCE lets the Google sign-in redirect hand back a short-lived code
    // instead of the tokens themselves.
    flowType: "pkce",
  },
});

// Refresh the session only while the app is in the foreground, as Supabase
// recommends for React Native.
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
