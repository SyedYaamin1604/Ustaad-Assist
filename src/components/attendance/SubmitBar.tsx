import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { ArrowRight } from "lucide-react-native";

interface SubmitBarProps {
  presentCount: number;
  leaveCount: number;
  absentCount: number;
  submitting?: boolean;
  onSubmit?: () => void;
}

export function SubmitBar({ presentCount, leaveCount, absentCount, submitting = false, onSubmit }: SubmitBarProps) {
  return (
    <View className="mx-5 mb-4 flex-row items-center justify-between rounded-full bg-black px-2 py-2 pl-5">
      <Text className="text-xs font-outfit-medium text-white">
        {presentCount} Present · {leaveCount} Leave · {absentCount} Absent
      </Text>
      <Pressable
        onPress={onSubmit}
        disabled={submitting}
        className="flex-row items-center gap-1.5 rounded-full bg-white px-4 py-2.5"
      >
        {submitting ? (
          <ActivityIndicator color="#171717" size="small" />
        ) : (
          <>
            <Text className="text-xs font-outfit-bold text-neutral-900">Submit attendance</Text>
            <ArrowRight size={14} color="#171717" />
          </>
        )}
      </Pressable>
    </View>
  );
}
