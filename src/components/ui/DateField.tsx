import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text } from "react-native";

import { DateTimePickerModal } from "@/components/ui/DateTimePickerModal";
import { formatFullDate, parseISODate, toISODate, today } from "@/utils/date";

interface DateFieldProps {
  label: string;
  /** YYYY-MM-DD, or "" when not picked yet. */
  value: string;
  onChange: (iso: string) => void;
  className?: string;
}

/** A tappable card showing a date, opening a calendar to change it. */
export function DateField({ label, value, onChange, className = "" }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  // A fresh key per opening resets the calendar to the current value.
  const [openCount, setOpenCount] = useState(0);

  return (
    <>
      <Pressable
        onPress={() => {
          setOpenCount((n) => n + 1);
          setOpen(true);
        }}
        className={`rounded-2xl bg-white p-4 shadow-sm active:opacity-80 ${className}`}
      >
        <Text className="font-outfit mb-1 text-xs uppercase text-slate-400">{label}</Text>
        <Text className={`text-base font-outfit-semibold ${value ? "text-slate-900" : "text-slate-400"}`}>
          {value ? formatFullDate(value) : "Pick a date"}
        </Text>
        <Feather name="calendar" size={14} color="#94a3b8" style={{ position: "absolute", right: 16, top: 16 }} />
      </Pressable>

      <DateTimePickerModal
        key={openCount}
        mode="date"
        title={label}
        visible={open}
        initialDate={value ? parseISODate(value) : today()}
        onClose={() => setOpen(false)}
        onConfirm={(date) => onChange(toISODate(date))}
      />
    </>
  );
}
