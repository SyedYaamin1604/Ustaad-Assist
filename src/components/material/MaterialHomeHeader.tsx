import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface MaterialHomeHeaderProps {
  courseCode: string;
  semesterLabel: string;
  courseTitle: string;
  subtitle: string;
  onOpenFilters: () => void;
  onOpenMenu: () => void;
}

export function MaterialHomeHeader({
  courseCode,
  semesterLabel,
  courseTitle,
  subtitle,
  onOpenFilters,
  onOpenMenu,
}: MaterialHomeHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center justify-end mb-4">
        <View className="flex-row gap-2">
          <Pressable onPress={onOpenFilters} className="w-9 h-9 rounded-full bg-[var(--color-primary)] items-center justify-center">
            <Feather name="sliders" size={16} color="#0F172A" />
          </Pressable>
          <Pressable onPress={onOpenMenu} className="w-9 h-9 rounded-full bg-[var(--color-primary)] items-center justify-center">
            <Feather name="more-vertical" size={18} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row gap-2 mb-3">
        <View className="bg-[var(--primary-font)]/5 rounded-full px-3 py-1">
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/65">{courseCode}</Text>
        </View>
        <View className="bg-[var(--primary-font)]/5 rounded-full px-3 py-1">
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/65">{semesterLabel}</Text>
        </View>
      </View>

      <Text className="font-outfit-bold text-[28px] text-[var(--primary-font)] mb-1">{courseTitle}</Text>
      <Text className="font-outfit text-sm text-[var(--primary-font)]/50 mb-4">{subtitle}</Text>
    </View>
  );
}
