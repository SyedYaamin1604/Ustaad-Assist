import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, icon = "arrow-right", disabled = false }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`w-full flex-row items-center justify-center rounded-full py-4 ${
        disabled ? "bg-[var(--primary-font)]/10" : "bg-[var(--color-secondary)] active:opacity-80"
      }`}
    >
      <Text className={`font-outfit-semibold text-[15px] mr-2 ${disabled ? "text-[var(--primary-font)]/40" : "text-[var(--secondary-font)]"}`}>
        {label}
      </Text>
      <Feather name={icon} size={16} color={disabled ? "#94A3B8" : "#fff"} />
    </Pressable>
  );
}
