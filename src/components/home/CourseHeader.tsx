import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown, Bell } from "lucide-react-native";

interface CourseHeaderProps {
  courseName: string;
  dateLabel: string;
  hasNotification?: boolean;
  onPressCourseSwitcher?: () => void;
  onPressNotifications?: () => void;
}

export default function CourseHeader({
  courseName,
  dateLabel,
  hasNotification = true,
  onPressCourseSwitcher,
  onPressNotifications,
}: CourseHeaderProps) {
  return (
    <View className="flex-row items-start justify-between px-5 pt-3 pb-4">
      <Pressable
        onPress={onPressCourseSwitcher}
        className="flex-1 pr-3"
        hitSlop={8}
      >
        <View className="flex-row items-center">
          <Text className="text-[22px] font-outfit-bold text-gray-900" numberOfLines={1}>
            {courseName}
          </Text>
          <ChevronDown size={20} color="#111827" className="ml-1" />
        </View>
        <Text className="font-outfit mt-0.5 text-[13px] text-gray-500">{dateLabel}</Text>
      </Pressable>

      <Pressable
        onPress={onPressNotifications}
        hitSlop={8}
        className="h-11 w-11 items-center justify-center rounded-full bg-gray-100"
      >
        <Bell size={20} color="#111827" />
        {hasNotification && (
          <View className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
        )}
      </Pressable>
    </View>
  );
}