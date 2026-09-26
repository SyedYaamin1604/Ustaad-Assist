import { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  daysInMonth,
  firstWeekdayOfMonth,
  isSameDay,
  to12Hour,
  to24Hour,
} from "@/utils/date";

interface DateTimePickerModalProps {
  visible: boolean;
  initialDate: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export function DateTimePickerModal({ visible, initialDate, onClose, onConfirm }: DateTimePickerModalProps) {
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate);

  const initialTime = useMemo(() => to12Hour(initialDate.getHours()), [initialDate]);
  const [hour12, setHour12] = useState(initialTime.hour12);
  const [minute, setMinute] = useState(Math.round(initialDate.getMinutes() / 5) * 5 % 60);
  const [meridiem, setMeridiem] = useState<"AM" | "PM">(initialTime.meridiem);

  const totalDays = daysInMonth(viewYear, viewMonth);
  const offset = firstWeekdayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (day: number) => {
    setSelectedDay(new Date(viewYear, viewMonth, day));
  };

  const stepMinute = (delta: number) => {
    setMinute((m) => (m + delta + 60) % 60);
  };

  const stepHour = (delta: number) => {
    setHour12((h) => {
      const next = h + delta;
      if (next > 12) return 1;
      if (next < 1) return 12;
      return next;
    });
  };

  const handleConfirm = () => {
    const hours24 = to24Hour(hour12, meridiem);
    const result = new Date(viewYear, viewMonth, selectedDay.getDate(), hours24, minute);
    onConfirm(result);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="bg-white rounded-t-[28px] px-5 pt-5 pb-8">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="font-outfit-bold text-lg text-black">Select Date & Time</Text>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="x" size={18} color="#0F172A" />
            </Pressable>
          </View>

          {/* Month navigation */}
          <View className="flex-row items-center justify-between mb-3">
            <Pressable onPress={goPrevMonth} className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="chevron-left" size={16} color="#0F172A" />
            </Pressable>
            <Text className="font-outfit-semibold text-[15px] text-black">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Pressable onPress={goNextMonth} className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="chevron-right" size={16} color="#0F172A" />
            </Pressable>
          </View>

          {/* Weekday header */}
          <View className="flex-row mb-1">
            {WEEKDAY_LABELS.map((label, i) => (
              <View key={`${label}-${i}`} className="flex-1 items-center py-1">
                <Text className="font-outfit-medium text-xs text-slate-400">{label}</Text>
              </View>
            ))}
          </View>

          {/* Day grid */}
          <View className="flex-row flex-wrap">
            {cells.map((day, i) => {
              const isSelected =
                day != null &&
                isSameDay(selectedDay, new Date(viewYear, viewMonth, day));
              return (
                <View key={i} className="w-[14.28%] items-center py-1">
                  {day == null ? (
                    <View className="w-9 h-9" />
                  ) : (
                    <Pressable
                      onPress={() => selectDay(day)}
                      className={`w-9 h-9 rounded-full items-center justify-center ${
                        isSelected ? "bg-black" : ""
                      }`}
                    >
                      <Text
                        className={`font-outfit-medium text-[13px] ${isSelected ? "text-white" : "text-black"}`}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>

          {/* Time controls */}
          <Text className="font-outfit-medium text-[13px] text-slate-500 mt-5 mb-2">Time</Text>
          <View className="flex-row items-center justify-between bg-slate-100 rounded-2xl px-4 py-3.5">
            <View className="flex-row items-center gap-3">
              <Stepper label={hour12.toString().padStart(2, "0")} onDecrease={() => stepHour(-1)} onIncrease={() => stepHour(1)} />
              <Text className="font-outfit-bold text-lg text-black">:</Text>
              <Stepper label={minute.toString().padStart(2, "0")} onDecrease={() => stepMinute(-5)} onIncrease={() => stepMinute(5)} />
            </View>

            <Pressable
              onPress={() => setMeridiem((m) => (m === "AM" ? "PM" : "AM"))}
              className="bg-black rounded-full px-4 py-2"
            >
              <Text className="font-outfit-semibold text-xs text-white">{meridiem}</Text>
            </Pressable>
          </View>

          <View className="mt-6">
            <PrimaryButton label="Set date & time" icon="check" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Stepper({
  label,
  onDecrease,
  onIncrease,
}: {
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <View className="items-center">
      <Text className="font-outfit-bold text-xl text-black mb-1">{label}</Text>
      <View className="flex-row gap-1.5">
        <Pressable
          onPress={onDecrease}
          className="w-7 h-7 rounded-full bg-white border border-slate-200 items-center justify-center"
        >
          <Feather name="minus" size={12} color="#0F172A" />
        </Pressable>
        <Pressable
          onPress={onIncrease}
          className="w-7 h-7 rounded-full bg-white border border-slate-200 items-center justify-center"
        >
          <Feather name="plus" size={12} color="#0F172A" />
        </Pressable>
      </View>
    </View>
  );
}
