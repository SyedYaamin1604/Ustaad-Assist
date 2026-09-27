import type { PlanSession } from "@/utils/plan";
import { MONTH_NAMES, daysInMonth, firstWeekdayOfMonth, parseISODate, toISODate } from "@/utils/date";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

interface PlanCalendarProps {
  sessions: PlanSession[];
  holidays: string[];
  selectedDate: string;
  onSelect: (iso: string) => void;
}

interface DayCell {
  iso: string;
  day: number;
  inMonth: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCells(year: number, month: number): DayCell[] {
  const lead = firstWeekdayOfMonth(year, month);
  const total = daysInMonth(year, month);
  const cells: DayCell[] = [];

  for (let i = lead; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    cells.push({ iso: toISODate(d), day: d.getDate(), inMonth: false });
  }
  for (let day = 1; day <= total; day++) {
    cells.push({ iso: toISODate(new Date(year, month, day)), day, inMonth: true });
  }
  for (let day = 1; cells.length % 7 !== 0; day++) {
    const d = new Date(year, month + 1, day);
    cells.push({ iso: toISODate(d), day: d.getDate(), inMonth: false });
  }
  return cells;
}

export function PlanCalendar({ sessions, holidays, selectedDate, onSelect }: PlanCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = parseISODate(selectedDate);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  // One class per day; if a date holds a cancelled class and its replacement, show the live one.
  const sessionByDate = useMemo(() => {
    const map = new Map<string, PlanSession>();
    for (const s of sessions) {
      const existing = map.get(s.date);
      if (!existing || existing.status === "cancelled") map.set(s.date, s);
    }
    return map;
  }, [sessions]);
  const classWeekdays = useMemo(() => new Set(sessions.map((s) => parseISODate(s.date).getDay())), [sessions]);
  const cells = buildCells(visibleMonth.year, visibleMonth.month);

  const shiftMonth = (delta: number) => {
    setVisibleMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  return (
    <View className="bg-white rounded-[32px] p-5">
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <Feather name="calendar" size={20} color="#0F172A" />
          <Text className="font-outfit-bold text-xl text-black ml-2.5">
            {MONTH_NAMES[visibleMonth.month]} {visibleMonth.year}
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={8}>
            <Feather name="chevron-left" size={20} color="#475569" />
          </Pressable>
          <Pressable onPress={() => shiftMonth(1)} hitSlop={8}>
            <Feather name="chevron-right" size={20} color="#475569" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row mb-2">
        {WEEKDAYS.map((label, index) => (
          <Text
            key={label}
            style={{ width: "14.2857%" }}
            className={`text-center text-[13px] ${
              classWeekdays.has(index) ? "font-outfit-semibold text-slate-800" : "font-outfit text-slate-500"
            }`}
          >
            {label}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell) => {
          const session = cell.inMonth ? sessionByDate.get(cell.iso) : undefined;
          const isSelected = cell.inMonth && cell.iso === selectedDate;
          const isCancelled = session?.status === "cancelled";
          const isHoliday = cell.inMonth && holidays.includes(cell.iso);

          let circle = "bg-white border border-slate-200";
          let text = "text-black";
          if (!cell.inMonth) {
            circle = "bg-slate-50";
            text = "text-slate-300";
          } else if (isSelected) {
            circle = "bg-black";
            text = "text-white";
          } else if (isCancelled) {
            circle = "bg-slate-200";
            text = "text-slate-500";
          } else if (session) {
            circle = "bg-[#3EB6AA]";
          } else if (isHoliday) {
            circle = "bg-slate-100 border border-slate-200";
            text = "text-slate-400";
          }

          return (
            <View key={cell.iso} style={{ width: "14.2857%" }} className="items-center mb-2">
              <Pressable
                onPress={() => onSelect(cell.iso)}
                disabled={!cell.inMonth}
                className={`w-10 h-10 rounded-full items-center justify-center overflow-hidden ${circle}`}
              >
                <Text className={`font-outfit-semibold text-[15px] ${text}`}>{cell.day}</Text>
                {isCancelled && (
                  <View className="absolute w-[2px] h-12 bg-red-600" style={{ transform: [{ rotate: "45deg" }] }} />
                )}
                {session?.assessment_title && (
                  <View className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-black"}`} />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>

      <View className="flex-row items-center justify-between border-t border-slate-100 pt-4 mt-2">
        <LegendItem label="Class" swatch={<View className="w-3.5 h-3.5 rounded-full bg-[#3EB6AA]" />} />
        <LegendItem label="Selected" swatch={<View className="w-3.5 h-3.5 rounded-full bg-black" />} />
        <LegendItem
          label="Cancelled"
          swatch={
            <View className="w-3.5 h-3.5 rounded-full bg-slate-200 items-center justify-center overflow-hidden">
              <View className="w-[2px] h-5 bg-red-600" style={{ transform: [{ rotate: "45deg" }] }} />
            </View>
          }
        />
        <LegendItem label="Quiz" swatch={<View className="w-2 h-2 rounded-full bg-black" />} />
      </View>
    </View>
  );
}

function LegendItem({ label, swatch }: { label: string; swatch: React.ReactNode }) {
  return (
    <View className="flex-row items-center">
      {swatch}
      <Text className="font-outfit text-[13px] text-slate-600 ml-1.5">{label}</Text>
    </View>
  );
}
