import React from "react";
import { Text, View } from "react-native";

interface SectionLabelProps {
  label: string;
  dotClassName: string;
  trailing?: string;
}

export function SectionLabel({ label, dotClassName, trailing }: SectionLabelProps) {
  return (
    <View className="mt-6 flex-row items-center justify-between px-1">
      <View className="flex-row items-center gap-2">
        <View className={`h-2 w-2 rounded-full ${dotClassName}`} />
        <Text className="text-xs font-bold tracking-wide text-neutral-500">
          {label}
        </Text>
      </View>
      {trailing ? (
        <Text className="text-xs font-medium text-neutral-400">{trailing}</Text>
      ) : null}
    </View>
  );
}