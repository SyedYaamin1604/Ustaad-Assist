import React from "react";
import { View, Text, Pressable } from "react-native";
import UpcomingClassItem, { UpcomingClassItemData } from "./UpcomingClassItem";

interface UpcomingWeekSectionProps {
  items: UpcomingClassItemData[];
  onPressViewAll?: () => void;
  onPressItem?: (id: string) => void;
}

export default function UpcomingWeekSection({
  items,
  onPressViewAll,
  onPressItem,
}: UpcomingWeekSectionProps) {
  return (
    <View className="mx-5 mt-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[18px] font-outfit-bold text-gray-900">
          Upcoming this week
        </Text>
        <Pressable onPress={onPressViewAll} hitSlop={8}>
          <Text className="text-[13px] font-outfit-medium text-gray-500">
            View all
          </Text>
        </Pressable>
      </View>

      <View>
        {items.map((item, index) => (
          <UpcomingClassItem
            key={item.id}
            item={item}
            onPress={onPressItem}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}