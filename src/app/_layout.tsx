import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

//replace title with headerShown: false property at the time of developing

const RootLayout = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      // NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    <Stack initialRouteName="signin" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" options={{ title: "Sign In", headerShown: true }} />
      <Stack.Screen name="signout" options={{ title: "Sign Out", headerShown: true }} />
      <Stack.Screen name="dashboard" options={{ title: "Dashboard", headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );

}

export default RootLayout;

