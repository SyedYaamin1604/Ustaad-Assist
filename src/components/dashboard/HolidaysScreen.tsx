import { ActivityIndicator, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

import type { DayName, Holiday } from "@/api/types";
import { DAY_NAMES, dayLabel, parseISODate, shortMonth } from "@/utils/date";
import StepProgress from "./StepProgress";

interface HolidaysScreenProps {
  holidays: Holiday[];
  classDays: DayName[];
  /** is_active per holiday id — true means no class that day. */
  active: Record<string, boolean>;
  onToggle: (id: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  busy?: boolean;
}

// JS getDay() is Sunday-first; the backend's day names are Monday-first.
function weekdayOf(iso: string): DayName {
  return DAY_NAMES[(parseISODate(iso).getDay() + 6) % 7];
}

const HolidaysScreen = ({ holidays, classDays, active, onToggle, onBack, onGenerate, busy = false }: HolidaysScreenProps) => {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onBack} className="h-12 w-12 items-center justify-center rounded-full bg-slate-200">
          <Text className="text-2xl font-outfit text-[var(--color-secondary)]">←</Text>
        </TouchableOpacity>
        <StepProgress current={3} total={3} />
      </View>

      <Text className="mb-1 text-2xl font-outfit-bold text-slate-900">Holidays</Text>
      <Text className="font-outfit mb-6 text-sm text-slate-500">
        Public holidays in your semester are already filled in. Switch off any your university does not observe.
      </Text>

      <View className="mb-6 rounded-2xl bg-white">
        {holidays.length === 0 ? (
          <Text className="font-outfit p-5 text-sm text-slate-500">No public holidays fall inside these dates.</Text>
        ) : (
          holidays.map((h) => {
            const date = parseISODate(h.date);
            const weekday = weekdayOf(h.date);
            const clashes = classDays.includes(weekday);
            return (
              <View key={h.id} className="flex-row items-center gap-3 border-b border-slate-100 p-4">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                  <Text className="text-xs font-outfit-semibold">{date.getDate().toString().padStart(2, "0")}</Text>
                  <Text className="font-outfit text-[10px] uppercase text-slate-400">{shortMonth(date)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-outfit-semibold text-slate-900">{h.name ?? "Holiday"}</Text>
                  <Text className="font-outfit text-xs text-slate-400">
                    {dayLabel(weekday)} · {clashes ? "Falls on a class day" : "No class that day"}
                  </Text>
                </View>
                <Switch value={active[h.id] ?? h.is_active} onValueChange={() => onToggle(h.id)} />
              </View>
            );
          })
        )}
      </View>

      <TouchableOpacity
        onPress={onGenerate}
        disabled={busy}
        className={`items-center rounded-full bg-slate-900 py-4 ${busy ? "opacity-70" : ""}`}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text className="font-outfit-semibold text-white">Generate my plan →</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HolidaysScreen;
