import { Pressable, Text, View } from "react-native";
import { FileText, Share2, Star } from "lucide-react-native";

import { ReportBadge, ReportCard } from "./ReportCard";

type GradeSheetCardProps = {
  studentCount: number;
  /** Students whose total is still provisional because a mark is missing. */
  missingCount: number;
  onOpen?: () => void;
  onShare?: () => void;
};

export function GradeSheetCard({ studentCount, missingCount, onOpen, onShare }: GradeSheetCardProps) {
  const complete = studentCount - missingCount;
  const progress = studentCount === 0 ? 0 : Math.round((complete / studentCount) * 100);
  const final = studentCount > 0 && missingCount === 0;

  return (
    <ReportCard
      gradientColors={["#FCD34D", "#FBBF24"]}
      icon={<Star size={18} color="#B45309" />}
      badge={<ReportBadge label={final ? "Final" : "Provisional"} dotColor={final ? "#22C55E" : "#F59E0B"} />}
      title="Result Sheet"
      description="Weighted totals and letter grades across quizzes, assignments, midterm and final."
    >
      <View className="rounded-2xl bg-white/60 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-outfit text-[13px] text-gray-800">
            {studentCount === 0 ? "No students yet" : `${complete} of ${studentCount} students have every mark`}
          </Text>
          <Text className="text-[15px] font-outfit-bold text-gray-900">{progress}%</Text>
        </View>
        <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
          <View className="h-2 rounded-full bg-gray-900" style={{ width: `${progress}%` }} />
        </View>
      </View>

      <View className="mt-5 flex-row items-center gap-3">
        <Pressable onPress={onOpen} className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 active:opacity-80">
          <FileText size={16} color="#FFFFFF" />
          <Text className="text-[14px] font-outfit-semibold text-white">Open</Text>
        </Pressable>
        <Pressable onPress={onShare} className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-white py-3.5 active:opacity-80">
          <Share2 size={16} color="#111827" />
          <Text className="text-[14px] font-outfit-semibold text-gray-900">PDF</Text>
        </Pressable>
      </View>
    </ReportCard>
  );
}
