import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StudentMark } from "@/types/assessment";

export type MarkStatus = "entered" | "absent" | "skipped";

interface StudentMarkCardProps {
  student: StudentMark;
  currentScore: string;
  status: MarkStatus;
  maxMarks: number;
  onPrev: () => void;
  onNext: () => void;
}

export function StudentMarkCard({ student, currentScore, status, maxMarks, onPrev, onNext }: StudentMarkCardProps) {
  const displayScore = currentScore || "0";

  return (
    <View className="bg-white rounded-3xl border border-slate-100 p-5">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={onPrev} className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center">
          <Feather name="chevron-left" size={16} color="#0F172A" />
        </Pressable>

        <View className="flex-row items-center">
          <Avatar label={student.initials} bgClassName="bg-[var(--color-purple)]" />
          <View className="ml-3">
            <Text className="font-outfit-semibold text-base text-black">{student.name}</Text>
            <Text className="font-outfit text-xs text-slate-400">Roll {student.roll}</Text>
          </View>
        </View>

        <Pressable onPress={onNext} className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center">
          <Feather name="chevron-right" size={16} color="#0F172A" />
        </Pressable>
      </View>

      <View className="flex-row items-center justify-center gap-2 mb-4">
        <Text className="font-outfit text-[13px] text-slate-500">Avg: {student.avgPercent}%</Text>
        {student.aboveAvg && status === "entered" && (
          <StatusBadge label={`Above class avg (${(maxMarks * 0.78).toFixed(1)})`} tone="warning" />
        )}
        {status === "absent" && <StatusBadge label="Marked absent" tone="danger" />}
        {status === "skipped" && <StatusBadge label="Skipped — mark left blank" tone="neutral" />}
      </View>

      {status === "entered" ? (
        <View className="flex-row items-baseline justify-center mb-2">
          <Text className="font-outfit-bold text-5xl text-black">{displayScore}</Text>
          <Text className="font-outfit-medium text-xl text-slate-400 ml-1">/{maxMarks}</Text>
        </View>
      ) : (
        <View className="items-center justify-center mb-2 py-4">
          <Text className="font-outfit-bold text-2xl text-slate-300">— / {maxMarks}</Text>
        </View>
      )}

      <View className="flex-row items-center justify-center">
        <View className="w-1 h-1 rounded-full bg-slate-300 mr-1.5" />
        <Text className="font-outfit text-xs text-slate-400">
          {status === "entered" ? "Auto-advancing on complete entry" : "Type a score to overwrite this mark"}
        </Text>
      </View>
    </View>
  );
}
