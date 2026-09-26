import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GradeRow } from "@/types/assessment";
import { Text, View } from "react-native";

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-100",
  "B+": "bg-[var(--color-yellow)]",
  B: "bg-[var(--color-blue)]",
  "C+": "bg-[var(--color-pink)]",
  D: "bg-amber-100",
  F: "bg-rose-100",
};

interface StudentGradeRowProps {
  row: GradeRow;
}

export function StudentGradeRow({ row }: StudentGradeRowProps) {
  return (
    <View
      className={`flex-row items-center bg-white rounded-2xl border px-3.5 py-3 mb-2.5 ${
        row.marksEntered ? "border-slate-100" : "border-dashed border-amber-300"
      }`}
    >
      <Avatar
        label={row.marksEntered ? row.grade : "?"}
        bgClassName={row.marksEntered ? (GRADE_COLORS[row.grade] ?? "bg-slate-100") : "bg-amber-50"}
        textClassName={row.marksEntered ? "text-black" : "text-amber-600"}
        sizeClassName="w-11 h-11"
      />

      <View className="flex-1 ml-3">
        <Text className="font-outfit-semibold text-[15px] text-black">{row.name}</Text>
        <Text className="font-outfit text-xs text-slate-400 mt-0.5">{row.rollLabel}</Text>
      </View>

      <View className="items-end">
        <Text className={`font-outfit-bold text-[15px] ${row.marksEntered ? "text-black" : "text-slate-300"}`}>
          {row.marksEntered ? `${row.percent.toFixed(1)}%` : "—"}
        </Text>
        <View className="mt-1">
          <StatusBadge label={row.tagLabel} tone={row.tagTone} />
        </View>
      </View>
    </View>
  );
}
