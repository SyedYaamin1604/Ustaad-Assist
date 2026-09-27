import { Stack } from "expo-router";

import { CourseProvider } from "@/providers/CourseProvider";

/** Screens shown only while signed in. They all share the selected course. */
export default function AppLayout() {
  return (
    <CourseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="attendance" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="report/index" />
        <Stack.Screen name="report/[type]" />
        <Stack.Screen name="course/new" options={{ presentation: "transparentModal", animation: "none" }} />
        <Stack.Screen name="course/clone" />
      </Stack>
    </CourseProvider>
  );
}
