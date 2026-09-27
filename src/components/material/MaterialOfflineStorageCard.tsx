import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface MaterialOfflineStorageCardProps {
  usedLabel: string; // "645 MB of 2 GB cached"
  onManage: () => void;
}

export function MaterialOfflineStorageCard({ usedLabel, onManage }: MaterialOfflineStorageCardProps) {
  return (
    <View className="flex-row items-center justify-between bg-[var(--color-primary)] rounded-2xl px-4 py-3.5 mt-5 shadow-sm">
      <View className="flex-row items-center flex-1 mr-3">
        <Ionicons name="people-circle-outline" size={22} color="#0F172A" />
        <View className="ml-2.5 flex-1">
          <Text className="font-outfit-semibold text-[13px] text-[var(--primary-font)]">Offline Storage</Text>
          <Text numberOfLines={1} className="font-outfit text-xs text-[var(--primary-font)]/45 mt-0.5">
            {usedLabel}
          </Text>
        </View>
      </View>

      <Pressable onPress={onManage} className="bg-[var(--primary-font)]/5 rounded-full px-3.5 py-2">
        <Text className="font-outfit-medium text-xs text-[var(--primary-font)]">Manage</Text>
      </Pressable>
    </View>
  );
}
