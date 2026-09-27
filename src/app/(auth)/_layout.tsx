import { Stack } from "expo-router";

/** Screens shown only while signed out. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
