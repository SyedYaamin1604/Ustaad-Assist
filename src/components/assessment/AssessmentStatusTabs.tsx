import { Pressable, Text, View } from "react-native";

export type AssessmentFilter = "Upcoming" | "Completed" | "Not started";

interface AssessmentStatusTabsProps {
  value: AssessmentFilter;
  onChange: (value: AssessmentFilter) => void;
  counts: { upcoming: number; completed: number; notStarted: number; draft: number };
}

export function AssessmentStatusTabs({ value, onChange, counts }: AssessmentStatusTabsProps) {
  const tabs: { key: AssessmentFilter; count: number }[] = [
    { key: "Upcoming", count: counts.upcoming },
    { key: "Completed", count: counts.completed },
    { key: "Not started", count: counts.notStarted },
  ];

  return (
    <View>
      <View className="flex-row gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === value;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              className={`flex-row items-center rounded-full px-3.5 py-2 ${
                isActive ? "bg-black" : "bg-white border border-slate-200"
              }`}
            >
              <Text className={`font-outfit-medium text-[13px] ${isActive ? "text-white" : "text-slate-600"}`}>
                {tab.key}
              </Text>
              <View
                className={`ml-1.5 w-4 h-4 rounded-full items-center justify-center ${
                  isActive ? "bg-white/25" : "bg-slate-100"
                }`}
              >
                <Text className={`font-outfit-semibold text-[10px] ${isActive ? "text-white" : "text-slate-500"}`}>
                  {tab.count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row items-center mt-3">
        <View className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
        <Text className="font-outfit text-xs text-slate-500 mr-3">{counts.upcoming} Upcoming</Text>
        <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
        <Text className="font-outfit text-xs text-slate-500 mr-3">{counts.completed} Completed</Text>
        <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
        <Text className="font-outfit text-xs text-slate-500">{counts.draft} Draft</Text>
      </View>
    </View>
  );
}
