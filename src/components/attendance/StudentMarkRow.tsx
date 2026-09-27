import React from "react";
import { Pressable, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";

import type { AttendanceStatus, MarkEntry } from "@/types/attendance";
import { avatarColors, initials } from "@/utils/format";

interface StudentMarkRowProps {
  student: MarkEntry;
  onCycleStatus: (studentId: string) => void;
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; pillBg: string; pillText: string; rowBg: string }> = {
  present: { label: "Present", pillBg: "bg-emerald-100", pillText: "text-emerald-700", rowBg: "bg-white" },
  leave: { label: "Leave", pillBg: "bg-violet-100", pillText: "text-violet-700", rowBg: "bg-white" },
  absent: { label: "Absent", pillBg: "bg-red-100", pillText: "text-red-700", rowBg: "bg-red-50 border border-red-200" },
};

export function StudentMarkRow({ student, onCycleStatus }: StudentMarkRowProps) {
  const config = STATUS_CONFIG[student.status];
  const avatar = avatarColors(student.roll_no);

  return (
    <Pressable
      onPress={() => onCycleStatus(student.student_id)}
      className={`mx-5 mt-3 flex-row items-center justify-between rounded-2xl p-3 ${config.rowBg}`}
    >
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
          <Text className={`font-outfit text-xs ${student.status === "absent" ? "text-red-500" : "text-neutral-400"}`}>
            {student.roll_no}
          </Text>
        </View>
      </View>

      <View className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${config.pillBg}`}>
        {student.status === "present" ? (
          <Check size={12} color="#047857" />
        ) : (
          <X size={12} color={student.status === "absent" ? "#B91C1C" : "#6D28D9"} />
        )}
        <Text className={`text-xs font-outfit-semibold ${config.pillText}`}>{config.label}</Text>
      </View>
    </Pressable>
  );
}
