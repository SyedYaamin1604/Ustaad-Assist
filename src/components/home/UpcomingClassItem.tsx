import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";

export interface UpcomingClassItemData {
  id: string;
  dayAbbrev: string;
  dayNumber: string;
  title: string;
  subtitle: string;
  flagLabel?: string;
}

interface UpcomingClassItemProps {
  item: UpcomingClassItemData;
  onPress?: (id: string) => void;
  isLast?: boolean;
}

export default function UpcomingClassItem({
  item,
  onPress,
  isLast = false,
}: UpcomingClassItemProps) {
  return (
    <Pressable
      onPress={() => onPress?.(item.id)}
      className={`flex-row items-center rounded-2xl bg-gray-50 px-4 py-3.5 ${
        isLast ? "" : "mb-3"
      }`}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Text className="text-[10px] font-semibold uppercase text-gray-500">
          {item.dayAbbrev}
        </Text>
        <Text className="text-[15px] font-bold leading-4 text-gray-900">
          {item.dayNumber}
        </Text>
      </View>

      <View className="ml-3.5 flex-1">
        <Text className="text-[15px] font-semibold text-gray-900" numberOfLines={1}>
          {item.title}
        </Text>
        <View className="mt-0.5 flex-row items-center">
          <Text className="text-[12.5px] text-gray-500" numberOfLines={1}>
            {item.subtitle}
          </Text>
          {item.flagLabel ? (
            <View className="ml-2 flex-row items-center">
              <View className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              <Text className="text-[12.5px] font-medium text-red-500">
                {item.flagLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <ChevronRight size={18} color="#9CA3AF" />
    </Pressable>
  );
}