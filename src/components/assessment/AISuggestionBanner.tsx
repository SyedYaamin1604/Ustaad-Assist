import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface AISuggestionBannerProps {
  message: string;
  actionLabel?: string;
  onAccept?: () => void;
}

export function AISuggestionBanner({ message, actionLabel = "Accept", onAccept }: AISuggestionBannerProps) {
  return (
    <View className="flex-row items-center bg-[var(--color-emerald)] rounded-full pl-2 pr-2 py-2">
      <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center mr-2">
        <Ionicons name="bulb-outline" size={16} color="#fff" />
      </View>
      <Text className="flex-1 font-outfit-medium text-[12.5px] text-white leading-4">{message}</Text>
      <Pressable onPress={onAccept} className="bg-black rounded-full px-4 py-2 ml-2">
        <Text className="font-outfit-semibold text-xs text-white">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
