import { Pressable, Text, View } from "react-native";
import { ArrowRight, BookOpen } from "lucide-react-native";
import { ReportBadge, ReportCard } from "./ReportCard";

type CourseDeliveryCardProps = {
  weeksLogged: number;
  totalWeeks: number;
  onGenerate?: () => void;
};

export function CourseDeliveryCard({
  weeksLogged,
  totalWeeks,
  onGenerate,
}: CourseDeliveryCardProps) {
  return (
    <ReportCard
      gradientColors={["#C4B5FD", "#A78BFA"]}
      icon={<BookOpen size={18} color="#6D28D9" />}
      badge={<ReportBadge label="Curriculum Audit" />}
      title="Course Delivery & Syllabus Report"
      description="Pacing audit, completed topics checklist, and scheduled makeup sessions."
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-gray-700" />
          <Text className="text-[12px] text-gray-700">
            {weeksLogged} of {totalWeeks} weeks logged
          </Text>
        </View>

        <Pressable
          onPress={onGenerate}
          className="flex-row items-center gap-2 rounded-full bg-gray-900 px-5 py-3.5 active:opacity-80"
        >
          <Text className="text-[14px] font-semibold text-white">
            Generate PDF
          </Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </ReportCard>
  );
}