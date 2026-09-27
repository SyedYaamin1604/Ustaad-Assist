import React from "react";
import { View, Text, Pressable } from "react-native";
import { ArrowRight } from "lucide-react-native";

interface PlanAlertBannerProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onPressCta?: () => void;
}

export default function PlanAlertBanner({
  title,
  subtitle,
  ctaLabel = "Fix plan",
  onPressCta,
}: PlanAlertBannerProps) {
  return (
    <View className="mx-5 mt-4 flex-row items-center justify-between rounded-2xl border border-[#F0DFA0] bg-[#FBF3D9] px-4 py-3.5">
      <View className="mr-3 flex-1 flex-row items-start">
        <View className="mr-2.5 mt-1.5 h-2 w-2 rounded-full bg-orange-500" />
        <View className="flex-1">
          <Text className="text-[14px] font-semibold text-gray-900">
            {title}
          </Text>
          <Text className="mt-0.5 text-[12.5px] text-gray-600">
            {subtitle}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onPressCta}
        className="flex-row items-center rounded-full bg-gray-900 px-4 py-2.5"
      >
        <Text className="mr-1 text-[13px] font-semibold text-white">
          {ctaLabel}
        </Text>
        <ArrowRight size={14} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}