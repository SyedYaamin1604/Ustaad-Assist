import React from "react";
import { Text, View } from "react-native";
import { StudentSummary } from "../../types/attendance";

interface StudentSummaryRowProps {
  student: StudentSummary;
}

function getStatusColors(pct: number) {
  if (pct < 60) {
    return { text: "text-red-600", bar: "bg-red-500" };
  }
  if (pct < 75) {
    return { text: "text-amber-600", bar: "bg-amber-500" };
  }
  return { text: "text-emerald-600", bar: "bg-emerald-500" };
}

export function StudentSummaryRow({ student }: StudentSummaryRowProps) {
  const { text, bar } = getStatusColors(student.attendancePct);
  const pctLabel =
    student.attendancePct % 1 === 0
      ? `${student.attendancePct}%`
      : `${student.attendancePct.toFixed(1)}%`;

  return (
    <View className="mt-3 rounded-2xl bg-white p-4 shadow-sm shadow-black/5">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          <View
            className={`h-10 w-10 items-center justify-center rounded-full ${student.avatarBg}`}
          >
            <Text className={`text-xs font-outfit-bold ${student.avatarText}`}>
              {student.initials}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-outfit-bold text-neutral-900">
              {student.name}
            </Text>
            <Text className="font-outfit text-xs text-neutral-400">Roll {student.rollNo}</Text>
          </View>
        </View>

        <Text className={`text-lg font-outfit-bold ${text}`}>{pctLabel}</Text>
      </View>

      <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <View
          className={`h-2 rounded-full ${bar}`}
          style={{ width: `${Math.max(student.attendancePct, 4)}%` }}
        />
      </View>

      <Text className="font-outfit mt-1.5 text-right text-[11px] text-neutral-400">
        {student.attended} of {student.totalLectures} attended
      </Text>
    </View>
  );
}