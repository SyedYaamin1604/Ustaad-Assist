import { WeightageItem } from "@/types/assessment";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface GradingCriteriaCardProps {
  totalLabel: string;
  items: WeightageItem[];
}

export function GradingCriteriaCard({ totalLabel, items }: GradingCriteriaCardProps) {
  return (
    <View className="bg-[var(--color-blue)] rounded-3xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-outfit-semibold text-[15px] text-black">Grading Criteria</Text>
        <View className="flex-row items-center bg-white/70 rounded-full px-3 py-1">
          <Feather name="check-circle" size={12} color="#0F172A" />
          <Text className="font-outfit-medium text-xs text-black ml-1.5">{totalLabel}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <Text key={item.label} className="font-outfit text-[13px] text-slate-800">
            {item.label} <Text className="font-outfit-semibold">{item.value}</Text>
          </Text>
        ))}
      </View>
    </View>
  );
}
