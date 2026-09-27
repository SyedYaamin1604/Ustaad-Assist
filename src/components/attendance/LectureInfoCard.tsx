import React from "react";
import { Pressable, Text, View } from "react-native";
import { BookOpen, ChevronDown, GraduationCap } from "lucide-react-native";

import type { LectureInfo } from "@/types/attendance";

interface LectureInfoCardProps {
  lecture: LectureInfo;
  /** Opens the class picker. */
  onPress?: () => void;
}

export function LectureInfoCard({ lecture, onPress }: LectureInfoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mt-4 flex-row items-center justify-between rounded-2xl bg-white p-3 shadow-sm shadow-black/5"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
          <GraduationCap size={18} color="#4338CA" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-outfit-bold text-neutral-900">{lecture.label}</Text>
          <View className="mt-0.5 flex-row items-center gap-1">
            <BookOpen size={11} color="#a3a3a3" />
            <Text className="font-outfit text-xs text-neutral-400" numberOfLines={1}>
              {lecture.topic}
            </Text>
          </View>
        </View>
      </View>
      <ChevronDown size={18} color="#737373" />
    </Pressable>
  );
}
