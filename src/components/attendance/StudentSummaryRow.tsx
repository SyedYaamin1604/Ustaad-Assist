import React from "react";
import { Text, View } from "react-native";

import type { SummaryEntry } from "@/types/attendance";
import { avatarColors, formatPercent, initials } from "@/utils/format";

interface StudentSummaryRowProps {
  student: SummaryEntry;
  threshold: number;
}

function statusColors(pct: number | null, threshold: number) {
  if (pct === null) return { text: "text-neutral-400", bar: "bg-neutral-300" };
  if (pct < threshold - 15) return { text: "text-red-600", bar: "bg-red-500" };
  if (pct < threshold) return { text: "text-amber-600", bar: "bg-amber-500" };
  return { text: "text-emerald-600", bar: "bg-emerald-500" };
}

export function StudentSummaryRow({ student, threshold }: StudentSummaryRowProps) {
  const { text, bar } = statusColors(student.percentage, threshold);
  const avatar = avatarColors(student.roll_no);

  return (
    <View className="mt-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: avatar.bg }}>
            <Text className="text-xs font-outfit-bold" style={{ color: avatar.text }}>
              {initials(student.name)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-outfit-bold text-neutral-900" numberOfLines={1}>
              {student.name}
            </Text>
            <Text className="font-outfit text-xs text-neutral-400">Roll {student.roll_no}</Text>
          </View>
        </View>

        <Text className={`text-lg font-outfit-bold ${text}`}>{formatPercent(student.percentage)}</Text>
      </View>

      <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <View className={`h-2 rounded-full ${bar}`} style={{ width: `${Math.max(student.percentage ?? 0, 4)}%` }} />
      </View>

      <Text className="font-outfit mt-1.5 text-right text-[11px] text-neutral-400">
        {student.present} of {student.counted} attended
      </Text>
    </View>
  );
}
