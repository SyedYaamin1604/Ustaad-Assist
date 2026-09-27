import { View, Text, TouchableOpacity } from "react-native";
import { WEEK_DAYS, WeekDay } from "../../types/create-course";

const DayPicker = ({
  days,
  setDays,
}: {
  days: WeekDay[];
  setDays: (d: WeekDay[]) => void;
}) => {
  const toggle = (day: WeekDay) =>
    setDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);

  return (
    <View className="flex-row justify-between">
      {WEEK_DAYS.map((d, i) => {
        const active = days.includes(d.key);
        return (
          <TouchableOpacity
            key={d.key + i}
            onPress={() => toggle(d.key)}
            className={`h-9 w-9 items-center justify-center rounded-full ${
              active ? "bg-slate-900" : "bg-slate-100"
            }`}
          >
            <Text className={active ? "text-white" : "text-slate-600"}>
              {d.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default DayPicker;