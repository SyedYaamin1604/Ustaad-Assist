// components/settings/ProfileHeader.tsx
import React from "react";
import { View, Text, Pressable, Image, ImageSourcePropType } from "react-native";
import { ChevronLeft, SlidersHorizontal } from "lucide-react-native";

type ProfileHeaderProps = {
  name: string;
  role: string;
  avatarSource?: ImageSourcePropType;
  onPressBack?: () => void;
  onPressSettings?: () => void;
};

export function ProfileHeader({
  name,
  role,
  avatarSource,
  onPressBack,
  onPressSettings,
}: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
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

        <View className="rounded-full overflow-hidden bg-gray-200" style={{ width: 44, height: 44 }}>
          {avatarSource ? (
            <Image source={avatarSource} style={{ width: 44, height: 44 }} resizeMode="cover" />
          ) : null}
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

      {/* <Pressable
        onPress={onPressSettings}
        accessibilityRole="button"
        accessibilityLabel="Quick settings"
        className="items-center justify-center bg-white rounded-full active:opacity-70"
        style={{
          width: 44,
          height: 44,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <SlidersHorizontal size={18} color="#111114" />
      </Pressable> */}
    </View>
  );
}