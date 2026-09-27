import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  icon: React.ReactNode;
  badgeLabel: string;
  value: string;
  caption: string;
  bgClassName: string;
  badgeBgClassName?: string;
}

export function StatCard({
  icon,
  badgeLabel,
  value,
  caption,
  bgClassName,
  badgeBgClassName = "bg-white/60",
}: StatCardProps) {
  return (
    <View className={`flex-1 rounded-3xl p-4 ${bgClassName}`}>
      <View className="flex-row items-center justify-between">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
          {icon}
        </View>
        <View className={`rounded-full px-2.5 py-1 ${badgeBgClassName}`}>
          <Text className="text-[10px] font-outfit-semibold text-neutral-700">
            {badgeLabel}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-3xl font-outfit-bold text-neutral-900">
        {value}
      </Text>
      <Text className="mt-0.5 text-xs font-outfit-medium text-neutral-600">
        {caption}
      </Text>
    </View>
  );
}