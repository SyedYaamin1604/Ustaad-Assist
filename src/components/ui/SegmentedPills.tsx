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
              isActive ? "bg-[var(--color-secondary)] border-[var(--color-secondary)]" : "bg-[var(--color-primary)] border-[var(--primary-font)]/15"
            }`}
          >
            <Text
              className={`font-outfit-medium text-[13px] ${isActive ? "text-[var(--secondary-font)]" : "text-[var(--primary-font)]/65"}`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
