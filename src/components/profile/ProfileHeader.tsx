import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { initials } from "@/utils/format";

type ProfileHeaderProps = {
  name: string;
  role: string;
  onPressBack?: () => void;
};

export function ProfileHeader({ name, role, onPressBack }: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center">
      <Pressable
        onPress={onPressBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
        className="items-center justify-center bg-white rounded-full mr-3 active:opacity-70"
        style={{
          width: 40,
          height: 40,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <ChevronLeft size={20} color="#111114" />
      </Pressable>

      <View className="rounded-full bg-gray-200 items-center justify-center" style={{ width: 44, height: 44 }}>
        <Text className="font-outfit-bold text-sm text-gray-700">{initials(name)}</Text>
      </View>

      <View className="ml-3 flex-shrink">
        <Text className="text-base font-outfit-semibold text-gray-900" numberOfLines={1}>
          {name}
        </Text>
        <Text className="font-outfit text-sm text-gray-500 mt-0.5" numberOfLines={1}>
          {role}
        </Text>
      </View>
    </View>
  );
}
