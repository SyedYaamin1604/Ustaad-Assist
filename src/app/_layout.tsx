import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useFonts } from "expo-font";
// import {
//   Outfit_400Regular,
//   Outfit_500Medium,
//   Outfit_600SemiBold,
//   Outfit_700Bold,
// } from '@expo-google-fonts/outfit';
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
      <Stack initialRouteName="Signin" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Signin" options={{ title: "Sign In", headerShown: true }} />
        <Stack.Screen name="Signout" options={{ title: "Sign Out", headerShown: true }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard", headerShown: true }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;