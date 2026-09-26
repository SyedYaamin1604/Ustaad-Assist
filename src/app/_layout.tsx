import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-SemiBold': require('../../assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  });


  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack initialRouteName="signin" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signin" options={{ title: "Sign In", headerShown: false }} />
        <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ title: "Forgot Password", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerShown: true }} />
        <Stack.Screen name="settings" options={{ title: "Settings", headerShown: true }} />
        <Stack.Screen name="course/[id]" options={{ title: "Course", headerShown: true }} />
        <Stack.Screen name="course/new" options={{ title: "New Course", headerShown: true }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
