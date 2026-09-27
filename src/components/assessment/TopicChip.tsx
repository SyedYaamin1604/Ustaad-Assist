import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface TopicChipProps {
  label: string;
  checked?: boolean;
  dashed?: boolean;
  onPress?: () => void;
}

export function TopicChip({ label, checked, dashed, onPress }: TopicChipProps) {
  if (dashed) {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row items-center border border-dashed border-[var(--primary-font)]/20 rounded-full px-4 py-2"
      >
        <Feather name="plus" size={14} color="#64748B" />
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55 ml-1.5">{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center rounded-full px-4 py-2 ${
        checked ? "bg-[var(--primary-font)]/5" : "bg-[var(--color-primary)] border border-[var(--primary-font)]/15"
      }`}
    >
      {checked && (
        <View className="mr-1.5">
          <Feather name="check" size={14} color="#0F172A" />
        </View>
      )}
      <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75">{label}</Text>
    </Pressable>
  );
}
