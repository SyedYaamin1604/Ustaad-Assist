import { Text, View } from "react-native";

export type BadgeTone = "success" | "neutral" | "warning" | "danger" | "dark" | "light";

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
}

const TONE_CLASSES: Record<BadgeTone, { bg: string; text: string; dot: string }> = {
  success: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  neutral: { bg: "bg-[var(--primary-font)]/5", text: "text-[var(--primary-font)]/55", dot: "bg-[var(--primary-font)]/40" },
  warning: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  danger: { bg: "bg-rose-100", text: "text-rose-600", dot: "bg-rose-500" },
  dark: { bg: "bg-[var(--color-secondary)]", text: "text-[var(--secondary-font)]", dot: "bg-[var(--color-primary)]" },
  light: { bg: "bg-[var(--color-primary)]", text: "text-[var(--primary-font)]/75", dot: "bg-[var(--primary-font)]/40" },
};

export function StatusBadge({ label, tone = "neutral", dot = false }: StatusBadgeProps) {
  const c = TONE_CLASSES[tone];
  return (
    <View className={`flex-row items-center self-start rounded-full px-3 py-1 ${c.bg}`}>
      {dot && <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.dot}`} />}
      <Text className={`font-outfit-medium text-xs ${c.text}`}>{label}</Text>
    </View>
  );
}
