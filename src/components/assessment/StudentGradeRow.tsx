import { Text, View } from "react-native";

import type { StudentResult } from "@/api/types";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";

const BAND_COLORS = [
  "bg-emerald-100",
  "bg-[var(--color-yellow)]",
  "bg-[var(--color-blue)]",
  "bg-[var(--color-pink)]",
  "bg-amber-100",
  "bg-rose-100",
];

interface StudentGradeRowProps {
  row: StudentResult;
  /** Position of the grade in the course's scale (0 = top band), for its colour. */
  bandIndex: number;
}

export function StudentGradeRow({ row, bandIndex }: StudentGradeRowProps) {
  const color = BAND_COLORS[Math.min(Math.max(bandIndex, 0), BAND_COLORS.length - 1)];

  return (
    <View
      className={`flex-row items-center bg-[var(--color-primary)] rounded-2xl border px-3.5 py-3 mb-2.5 ${
        row.has_missing_marks ? "border-dashed border-amber-300" : "border-[var(--primary-font)]/10"
      }`}
    >
      <Avatar label={row.grade} bgClassName={color} textClassName="text-[var(--primary-font)]" sizeClassName="w-11 h-11" />

      <View className="flex-1 ml-3">
        <Text className="font-outfit-semibold text-[15px] text-[var(--primary-font)]" numberOfLines={1}>
          {row.name}
        </Text>
        <Text className="font-outfit text-xs text-[var(--primary-font)]/40 mt-0.5">{row.roll_no}</Text>
      </View>

      <View className="items-end">
        <Text className="font-outfit-bold text-[15px] text-[var(--primary-font)]">{row.weighted_total.toFixed(1)}%</Text>
        <View className="mt-1">
          {/* A total with missing marks is provisional — the backend never treats a missing mark as zero. */}
          {row.has_missing_marks ? (
            <StatusBadge label={`Provisional · ${row.missing_count} missing`} tone="warning" />
          ) : (
            <StatusBadge label="Final" tone="neutral" />
          )}
        </View>
      </View>
    </View>
  );
}
