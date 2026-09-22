import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();

  const handleGoToTabs = () => {
    // Navigate into the tab navigation (defaults to index / Home tab)
    router.replace("/(tabs)/plan");
  };

  const handleSignOut = () => {
    // Navigate to Sign Out screen
    router.push("/signout");
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="p-6 justify-between flex-grow"
    >
      {/* Top Header Section */}
      <View className="mt-8">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
              Overview
            </Text>
            <Text className="text-3xl font-extrabold text-slate-900 mt-1">
              Dashboard
            </Text>
          </View>

          <Pressable
            onPress={handleSignOut}
            className="p-2.5 rounded-full bg-slate-200 active:bg-slate-300"
          >
            <Ionicons name="log-out-outline" size={20} color="#475569" />
          </Pressable>
        </View>

        <Text className="text-slate-500 text-base">
          Welcome back! Select an option below to proceed into the application.
        </Text>

        {/* Quick Stats / Info Cards */}
        <View className="flex-row gap-4 mt-6">
          <View className="flex-1 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Ionicons name="layers-outline" size={24} color="#2563eb" />
            <Text className="text-2xl font-bold text-slate-900 mt-2">12</Text>
            <Text className="text-xs text-slate-500 mt-0.5">Active Modules</Text>
          </View>

          <View className="flex-1 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Ionicons name="checkmark-done-circle-outline" size={24} color="#16a34a" />
            <Text className="text-2xl font-bold text-slate-900 mt-2">98%</Text>
            <Text className="text-xs text-slate-500 mt-0.5">Completion Rate</Text>
          </View>
        </View>
      </View>

      {/* Main Action Buttons */}
      <View className="gap-3 my-6">
        <Pressable
          onPress={handleGoToTabs}
          className="w-full flex-row items-center justify-center bg-blue-600 active:bg-blue-700 py-4 px-6 rounded-xl shadow-sm"
        >
          <Text className="text-white text-base font-semibold mr-2">
            Enter App (Tabs)
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/plan")}
          className="w-full flex-row items-center justify-center bg-white border border-slate-300 active:bg-slate-100 py-4 px-6 rounded-xl"
        >
          <Text className="text-slate-700 text-base font-medium mr-2">
            Jump to Explore Tab
          </Text>
          <Ionicons name="compass-outline" size={18} color="#334155" />
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          className="w-full items-center justify-center py-3"
        >
          <Text className="text-rose-600 font-semibold text-sm">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}