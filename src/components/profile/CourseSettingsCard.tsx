import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight, SlidersHorizontal } from "lucide-react-native";

import { colors } from "@/types/profile-theme";

type CourseSettingsCardProps = {
  courseName: string;
  semesterLabel: string;
  threshold: number;
  classDaysLabel: string;
  onPress: () => void;
};

/** The selected course at a glance; tapping opens its settings. */
export function CourseSettingsCard({ courseName, semesterLabel, threshold, classDaysLabel, onPress }: CourseSettingsCardProps) {
  return (
    <Pressable onPress={onPress} className="bg-white rounded-3xl px-5 py-5 active:opacity-80">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="items-center justify-center rounded-full mr-3" style={{ width: 44, height: 44, backgroundColor: colors.black }}>
            <SlidersHorizontal size={18} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-outfit-semibold text-gray-900">Course Settings</Text>
            <Text className="font-outfit text-sm text-gray-500 mt-0.5" numberOfLines={1}>
              {[courseName, semesterLabel].filter(Boolean).join(" · ")}
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color="#6B7078" />
      </View>

      <View className="h-px bg-gray-100 my-4" />

      <View className="flex-row">
        <View className="flex-1">
          <Text className="font-outfit text-xs text-gray-500">Attendance threshold</Text>
          <Text className="font-outfit-bold text-lg text-gray-900 mt-0.5">{threshold}%</Text>
        </View>
        <View className="flex-1">
          <Text className="font-outfit text-xs text-gray-500">Class days</Text>
          <Text className="font-outfit-bold text-lg text-gray-900 mt-0.5">{classDaysLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}
