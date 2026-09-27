import React from "react";
import { Pressable, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface AttendanceHeaderProps {
  /** Centered pill label, e.g. "CS-301 · Section B" */
  courseLabel: string;
  onBackPress?: () => void;
  /** Right-side icon button (Share2, Calendar, etc.) */
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export function AttendanceHeader({
  courseLabel,
  onBackPress,
  rightIcon,
  onRightPress,
}: AttendanceHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-3">
      <Pressable
        onPress={onBackPress}
        className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5"
      >
        <ArrowLeft size={18} color="#171717" />
      </Pressable>

      <View className="rounded-full bg-white px-4 py-2 shadow-sm shadow-black/5">
        <Text className="text-xs font-outfit-semibold text-neutral-800">
          {courseLabel}
        </Text>
      </View>

      <Pressable
        onPress={onRightPress}
        className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5"
      >
        {rightIcon}
      </Pressable>
    </View>
  );
}