import { Feather, Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface MarksStepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
}

export function MarksStepper({ value, onChange, step = 5 }: MarksStepperProps) {
  return (
    <View className="flex-row items-center justify-between bg-slate-100 rounded-2xl px-4 py-3.5">
      <View className="flex-row items-center">
        <Ionicons name="star" size={16} color="#0F172A" />
        <Text className="font-outfit-medium text-[15px] text-black ml-2">{value} points total</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => onChange(Math.max(0, value - step))}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center"
        >
          <Feather name="minus" size={14} color="#0F172A" />
        </Pressable>
        <Pressable
          onPress={() => onChange(value + step)}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center"
        >
          <Feather name="plus" size={14} color="#0F172A" />
        </Pressable>
      </View>
    </View>
  );
}
