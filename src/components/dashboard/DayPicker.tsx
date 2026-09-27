import { Text, TouchableOpacity, View } from "react-native";

import type { DayName } from "@/api/types";
import { DAY_NAMES } from "@/utils/date";

const INITIAL: Record<DayName, string> = { mon: "M", tue: "T", wed: "W", thu: "T", fri: "F", sat: "S", sun: "S" };

const DayPicker = ({ days, setDays }: { days: DayName[]; setDays: (d: DayName[]) => void }) => {
  const toggle = (day: DayName) => setDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);

  return (
    <View className="flex-row justify-between">
      {DAY_NAMES.map((day) => {
        const active = days.includes(day);
        return (
          <TouchableOpacity
            key={day}
            onPress={() => toggle(day)}
            accessibilityLabel={day}
            accessibilityState={{ selected: active }}
            className={`h-9 w-9 items-center justify-center rounded-full ${active ? "bg-slate-900" : "bg-slate-100"}`}
          >
            <Text className={`font-outfit-medium ${active ? "text-white" : "text-slate-600"}`}>{INITIAL[day]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DayPicker;
