import React from "react";
import { Pressable, Text, View } from "react-native";
import { BookOpen, Check, X } from "lucide-react-native";

interface TodayClassCardProps {
  /** "TODAY'S CLASS" or "NEXT CLASS · TUE 29 SEP" */
  badgeLabel: string;
  topicTitle: string;
  subtitle: string;
  /** Taking the roll is what marks a class conducted. */
  onMarkConducted?: () => void;
  onMarkCancelled?: () => void;
}

export default function TodayClassCard({ badgeLabel, topicTitle, subtitle, onMarkConducted, onMarkCancelled }: TodayClassCardProps) {
  return (
    <View className="mx-5 overflow-hidden rounded-[28px] bg-[#F6C94D] px-5 pb-5 pt-4">
      <View className="self-start rounded-full bg-white/70 px-3.5 py-1.5">
        <Text className="text-[11px] font-outfit-semibold uppercase tracking-wide text-gray-800">{badgeLabel}</Text>
      </View>

      <Text className="mt-3 text-[24px] font-outfit-bold leading-7 text-gray-900">{topicTitle}</Text>

      <View className="mt-1.5 flex-row items-center">
        <BookOpen size={14} color="#57534E" />
        <Text className="font-outfit ml-1 text-[13px] text-gray-700">{subtitle}</Text>
      </View>

      <View className="mt-4 flex-row">
        <Pressable onPress={onMarkConducted} className="mr-3 flex-row items-center rounded-full bg-gray-900 px-5 py-2.5 active:opacity-80">
          <Check size={16} color="#FFFFFF" />
          <Text className="ml-1.5 text-[14px] font-outfit-semibold text-white">Take attendance</Text>
        </Pressable>

        <Pressable onPress={onMarkCancelled} className="flex-row items-center rounded-full bg-white px-5 py-2.5 active:opacity-80">
          <X size={16} color="#111827" />
          <Text className="ml-1.5 text-[14px] font-outfit-semibold text-gray-900">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
