import "../global.css";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SplashScreen from "../components/splash/SplashScreen";

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-SemiBold': require('../../assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  });

  // Gates the real Stack until the animated splash has held for its
  // guaranteed minimum duration and faded out (see SPLASH_MIN_DURATION_MS
  // in components/splash/theme.ts).
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, []);

  // Fonts aren't loaded yet — keep this exactly as before so the native/
  // static splash (from app.json) stays up rather than flashing an
  // unstyled screen. Nothing renders here on purpose.
  if (!fontsLoaded) {
    return null;
  }

  // Fonts are ready, but our animated splash hasn't finished its hold +
  // fade-out yet. Render it full-screen with nothing else mounted, so
  // there's no route flash underneath it and no header/back-gesture to
  // fight while it's up.
  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <SafeAreaProvider className="bg-none">
      <Stack initialRouteName="signin" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signin" options={{ title: "Sign In", headerShown: false }} />
        <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ title: "Forgot Password", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: "Settings", headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard", headerShown: false }} />
        <Stack.Screen name="attendance" options={{ title: "Attendance", headerShown: false }} />
        <Stack.Screen name="report" options={{ title: "Report", headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ title: "Course", headerShown: true }} />
        <Stack.Screen
          name="course/new"
          options={{ title: "New Course", headerShown: false, presentation: "transparentModal", animation: "none" }}
        />
        <Stack.Screen name="course/clone" options={{ title: "Clone Course", headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;