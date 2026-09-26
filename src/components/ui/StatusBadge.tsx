import { Text, View } from "react-native";

export type BadgeTone = "success" | "neutral" | "warning" | "danger" | "dark" | "light";

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
}

const TONE_CLASSES: Record<BadgeTone, { bg: string; text: string; dot: string }> = {
  success: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  neutral: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  warning: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  danger: { bg: "bg-rose-100", text: "text-rose-600", dot: "bg-rose-500" },
  dark: { bg: "bg-black", text: "text-white", dot: "bg-white" },
  light: { bg: "bg-white", text: "text-slate-700", dot: "bg-slate-400" },
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
