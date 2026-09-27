import { Feather } from "@expo/vector-icons";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface MaterialListHeaderProps {
  categoryLabel: string;
  subtitle: string;
  onBack: () => void;
  onOpenMenu: () => void;
}

export function MaterialListHeader({ categoryLabel, subtitle, onBack, onOpenMenu }: MaterialListHeaderProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>

        <View className="flex-row items-center bg-[var(--color-primary)] rounded-full px-3 py-1.5">
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/50">Course Material</Text>
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/30 mx-1.5">/</Text>
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]">{categoryLabel}</Text>
        </View>

        <Pressable onPress={onOpenMenu} className="w-9 h-9 rounded-full bg-[var(--color-primary)] items-center justify-center">
          <Feather name="more-vertical" size={18} color="#0F172A" />
        </Pressable>
      </View>

      <Text className="font-outfit-bold text-[28px] text-[var(--primary-font)] mb-1">{categoryLabel}</Text>
      <Text className="font-outfit text-sm text-[var(--primary-font)]/50 mb-4">{subtitle}</Text>
    </View>
  );
}
