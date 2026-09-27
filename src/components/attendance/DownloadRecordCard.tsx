import React from "react";
import { Pressable, Text, View } from "react-native";
import { Download } from "lucide-react-native";

interface DownloadRecordCardProps {
  onPress?: () => void;
}

export function DownloadRecordCard({ onPress }: DownloadRecordCardProps) {
  return (
    <View className="mt-6 flex-row items-center justify-between rounded-2xl bg-emerald-500 px-5 py-4">
      <View className="pr-3">
        <Text className="text-base font-bold text-white">
          Need official record?
        </Text>
        <Text className="mt-0.5 text-xs font-medium text-white/80">
          Download signed PDF roster
        </Text>
      </View>
      <Pressable
        onPress={onPress}
        className="h-11 w-11 items-center justify-center rounded-full bg-black"
      >
        <Download size={18} color="#ffffff" />
      </Pressable>
    </View>
  );
}