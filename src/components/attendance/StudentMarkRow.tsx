import React from "react";
import { Pressable, Text, View } from "react-native";
import { Check, X } from "lucide-react-native";
import { AttendanceStatus, StudentMarkEntry } from "../../types/attendance";

interface StudentMarkRowProps {
  student: StudentMarkEntry;
  onCycleStatus: (id: string) => void;
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; pillBg: string; pillText: string; rowBg: string }
> = {
  present: {
    label: "Present",
    pillBg: "bg-emerald-100",
    pillText: "text-emerald-700",
    rowBg: "bg-white",
  },
  leave: {
    label: "Leave",
    pillBg: "bg-violet-100",
    pillText: "text-violet-700",
    rowBg: "bg-white",
  },
  absent: {
    label: "Absent",
    pillBg: "bg-red-100",
    pillText: "text-red-700",
    rowBg: "bg-red-50 border border-red-200",
  },
};

export function StudentMarkRow({ student, onCycleStatus }: StudentMarkRowProps) {
  const config = STATUS_CONFIG[student.status];

  return (
    <Pressable
      onPress={() => onCycleStatus(student.id)}
      className={`mx-5 mt-3 flex-row items-center justify-between rounded-2xl p-3 ${config.rowBg}`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${student.avatarBg}`}
        >
          <Text className={`text-xs font-bold ${student.avatarText}`}>
            {student.initials}
          </Text>
        </View>
        <View>
          <Text className="text-sm font-bold text-neutral-900">
            {student.name}
          </Text>
          <Text
            className={`text-xs ${
              student.status === "absent" ? "text-red-500" : "text-neutral-400"
            }`}
          >
            {student.rollNo}
          </Text>
        </View>
      </View>

      <View
        className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${config.pillBg}`}
      >
        {student.status === "present" ? (
          <Check size={12} color="#047857" />
        ) : (
          <X size={12} color={student.status === "absent" ? "#B91C1C" : "#6D28D9"} />
        )}
        <Text className={`text-xs font-semibold ${config.pillText}`}>
          {config.label}
        </Text>
      </View>
    </Pressable>
  );
}