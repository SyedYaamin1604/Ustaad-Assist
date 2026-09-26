import { Pressable, Text, View } from "react-native";

interface SegmentedPillsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedPills({ options, value, onChange }: SegmentedPillsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={`px-4 py-2.5 rounded-full border ${
              isActive ? "bg-black border-black" : "bg-white border-slate-200"
            }`}
          >
            <Text
              className={`font-outfit-medium text-[13px] ${isActive ? "text-white" : "text-slate-600"}`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
