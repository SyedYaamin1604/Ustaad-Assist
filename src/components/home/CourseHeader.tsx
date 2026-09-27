import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronDown, Settings } from "lucide-react-native";

interface CourseHeaderProps {
  courseName: string;
  dateLabel: string;
  /** Opens the course list to switch course. */
  onPressCourseSwitcher?: () => void;
  onPressSettings?: () => void;
}

export default function CourseHeader({ courseName, dateLabel, onPressCourseSwitcher, onPressSettings }: CourseHeaderProps) {
  return (
    <View className="flex-row items-start justify-between px-5 pt-3 pb-4">
      <Pressable onPress={onPressCourseSwitcher} className="flex-1 pr-3" hitSlop={8} accessibilityLabel="Switch course">
        <View className="flex-row items-center">
          <Text className="text-[22px] font-outfit-bold text-gray-900 flex-shrink" numberOfLines={1}>
            {courseName}
          </Text>
          <ChevronDown size={20} color="#111827" className="ml-1" />
        </View>
        <Text className="font-outfit mt-0.5 text-[13px] text-gray-500">{dateLabel}</Text>
      </Pressable>

      {onPressSettings && (
        <Pressable
          onPress={onPressSettings}
          hitSlop={8}
          accessibilityLabel="Course settings"
          className="h-11 w-11 items-center justify-center rounded-full bg-gray-100"
        >
          <Settings size={20} color="#111827" />
        </Pressable>
      )}
    </View>
  );
}
