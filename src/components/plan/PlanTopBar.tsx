import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface PlanTopBarProps {
  label: string;
  onBack?: () => void;
  onAction?: () => void;
  actionIcon?: keyof typeof Feather.glyphMap;
}

export function PlanTopBar({ label, onBack, onAction, actionIcon = "more-vertical" }: PlanTopBarProps) {
  return (
    <View className="flex-row items-center justify-between mb-5">
      {onBack ? (
        <Pressable onPress={onBack} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Feather name="arrow-left" size={20} color="#0F172A" />
        </Pressable>
      ) : (
        <View className="w-11 h-11" />
      )}

      <View className="flex-row items-center bg-white rounded-full px-4 py-2">
        <View className="w-2 h-2 rounded-full bg-black mr-2" />
        <Text className="font-outfit-semibold text-xs tracking-wider text-slate-700 uppercase">{label}</Text>
      </View>

      {onAction ? (
        <Pressable onPress={onAction} className="w-11 h-11 rounded-full bg-white items-center justify-center">
          <Feather name={actionIcon} size={20} color="#0F172A" />
        </Pressable>
      ) : (
        <View className="w-11 h-11" />
      )}
    </View>
  );
}
