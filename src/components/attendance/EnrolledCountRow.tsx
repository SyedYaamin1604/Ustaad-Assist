import React from "react";
import { Text, View } from "react-native";

interface EnrolledCountRowProps {
  count: number;
}

export function EnrolledCountRow({ count }: EnrolledCountRowProps) {
  return (
    <View className="mx-5 mt-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
        <Text className="text-sm font-outfit-bold text-neutral-900">
          {count} Enrolled
        </Text>
      </View>
      <Text className="font-outfit text-xs text-neutral-400">Tap row to toggle absence</Text>
    </View>
  );
}