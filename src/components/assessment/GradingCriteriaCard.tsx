import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { ComponentType } from "@/api/types";
import { COMPONENT_LABEL, COMPONENTS } from "@/utils/format";

interface GradingCriteriaCardProps {
  weightage: Record<string, number>;
  onPress?: () => void;
}

export function GradingCriteriaCard({ weightage, onPress }: GradingCriteriaCardProps) {
  const total = COMPONENTS.reduce((sum, c) => sum + (weightage[c] ?? 0), 0);
  const used = COMPONENTS.filter((c: ComponentType) => (weightage[c] ?? 0) > 0);

  return (
    <Pressable onPress={onPress} className="bg-[var(--color-blue)] rounded-3xl p-4 active:opacity-90">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-outfit-semibold text-[15px] text-[var(--primary-font)]">Grading Criteria</Text>
        <View className="flex-row items-center bg-[var(--color-primary)]/70 rounded-full px-3 py-1">
          <Feather name={Math.round(total) === 100 ? "check-circle" : "alert-circle"} size={12} color="#0F172A" />
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)] ml-1.5">Total: {total}%</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-1.5">
        {used.map((c) => (
          <Text key={c} className="font-outfit text-[13px] text-[var(--primary-font)]/85">
            {COMPONENT_LABEL[c]} <Text className="font-outfit-semibold">{weightage[c]}%</Text>
          </Text>
        ))}
      </View>

      {onPress && (
        <View className="flex-row items-center mt-3">
          <Feather name="edit-2" size={12} color="#0F172A" />
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)] ml-1.5">Tap to edit weightage & grade scale</Text>
        </View>
      )}
    </Pressable>
  );
}
