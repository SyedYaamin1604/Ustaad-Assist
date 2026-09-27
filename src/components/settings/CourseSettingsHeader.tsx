import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface CourseSettingsHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export default function CourseSettingsHeader({ title, subtitle, onBack }: CourseSettingsHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
      <Pressable onPress={onBack} hitSlop={10} className="w-10 h-10 rounded-full bg-white items-center justify-center">
        <ChevronLeft size={20} color="#111318" strokeWidth={2.5} />
      </Pressable>

      <View className="flex-1 items-center px-2">
        <Text className="text-[16px] font-outfit-bold text-[#0F1424]" numberOfLines={1}>
          {title}
        </Text>
        <Text className="font-outfit text-[12px] text-[#8A8F9C] mt-0.5" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {/* Balances the back button so the title stays centred. */}
      <View className="w-10 h-10" />
    </View>
  );
}
