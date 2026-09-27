import { Text, View } from "react-native";
import { RefreshCw, Star } from "lucide-react-native";
import { ReportBadge, ReportCard } from "./ReportCard";

type GradeSheetCardProps = {
  progress: number;
  statusLabel: string;
};

export function GradeSheetCard({ progress, statusLabel }: GradeSheetCardProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <ReportCard
      gradientColors={["#FCD34D", "#FBBF24"]}
      icon={<Star size={18} color="#B45309" />}
      badge={<ReportBadge label="Processing" />}
      title="Comprehensive Grade Sheet"
      description="Weighted scores breakdown across quizzes, assignments, and midterm exams."
    >
      <View className="rounded-2xl bg-white/60 p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[13px] text-gray-800">{statusLabel}</Text>
          <Text className="text-[15px] font-bold text-gray-900">
            {clampedProgress}%
          </Text>
        </View>

        <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
          <View
            className="h-2 rounded-full bg-gray-900"
            style={{ width: `${clampedProgress}%` }}
          />
        </View>

        <View className="mt-2 flex-row items-center justify-end gap-1.5">
          <RefreshCw size={12} color="#374151" />
          <Text className="text-[12px] text-gray-700">Generating PDF...</Text>
        </View>
      </View>
    </ReportCard>
  );
}