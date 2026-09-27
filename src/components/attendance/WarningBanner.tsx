import React from "react";
import { Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";

interface WarningBannerProps {
  message: string;
}

export function WarningBanner({ message }: WarningBannerProps) {
  return (
    <View className="mt-3 flex-row items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5">
      <AlertTriangle size={16} color="#B45309" />
      <Text className="flex-1 text-xs font-outfit-medium text-amber-800">
        {message}
      </Text>
    </View>
  );
}