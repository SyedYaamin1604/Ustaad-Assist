import "../global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SplashScreen from "@/components/splash/SplashScreen";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

/**
 * Route groups:
 *   (auth)  sign in, register, forgot password — only while signed OUT
 *   (app)   everything else                      — only while signed IN
 *
 * Signing in or out flips the guards, and Expo Router sends the teacher to
 * index, which redirects to the right place.
 */
function RootNavigator() {
  const { session, isLoading } = useAuth();

  // Gates the real Stack until the animated splash has held for its minimum
  // duration and faded out (see SPLASH_MIN_DURATION_MS in types/splash-theme.ts).
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  // The stored session is normally read long before the splash ends.
  if (isLoading) return null;

  const signedIn = session !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Outfit-Regular": require("../../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-SemiBold": require("../../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../../assets/fonts/Outfit-Bold.ttf"),
  });

  // Keep the native splash (from app.json) up until the fonts are ready, rather
  // than flashing an unstyled screen.
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
