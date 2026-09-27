import { Pressable, Text, View } from "react-native";

export type AssessmentFilter = "Upcoming" | "Completed" | "Not scheduled";

interface AssessmentStatusTabsProps {
  value: AssessmentFilter;
  onChange: (value: AssessmentFilter) => void;
  counts: Record<AssessmentFilter, number>;
}

const TABS: AssessmentFilter[] = ["Upcoming", "Completed", "Not scheduled"];

export function AssessmentStatusTabs({ value, onChange, counts }: AssessmentStatusTabsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {TABS.map((tab) => {
        const isActive = tab === value;
        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            className={`flex-row items-center rounded-full px-3.5 py-2 ${
              isActive ? "bg-[var(--color-secondary)]" : "bg-[var(--color-primary)] border border-[var(--primary-font)]/15"
            }`}
          >
            <Text className={`font-outfit-medium text-[13px] ${isActive ? "text-[var(--secondary-font)]" : "text-[var(--primary-font)]/65"}`}>
              {tab}
            </Text>
            <View
              className={`ml-1.5 w-4 h-4 rounded-full items-center justify-center ${
                isActive ? "bg-[var(--color-primary)]/25" : "bg-[var(--primary-font)]/5"
              }`}
            >
              <Text className={`font-outfit-semibold text-[10px] ${isActive ? "text-[var(--secondary-font)]" : "text-[var(--primary-font)]/55"}`}>
                {counts[tab]}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
