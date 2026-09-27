import { Pressable, Text, View } from "react-native";
import { ArrowRight, BookOpen } from "lucide-react-native";

import { ReportBadge, ReportCard } from "./ReportCard";

type CourseDeliveryCardProps = {
  conducted: number;
  totalSessions: number;
  onOpen?: () => void;
};

export function CourseDeliveryCard({ conducted, totalSessions, onOpen }: CourseDeliveryCardProps) {
  return (
    <ReportCard
      gradientColors={["#C4B5FD", "#A78BFA"]}
      icon={<BookOpen size={18} color="#6D28D9" />}
      badge={<ReportBadge label="Curriculum Audit" />}
      title="Course Delivery Report"
      description="Every class, what it covered, and why any were cancelled."
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 flex-1 mr-2">
          <View className="h-1.5 w-1.5 rounded-full bg-gray-700" />
          <Text className="font-outfit text-[12px] text-gray-700">
            {conducted} of {totalSessions} classes conducted
          </Text>
        </View>

        <Pressable onPress={onOpen} className="flex-row items-center gap-2 rounded-full bg-gray-900 px-5 py-3.5 active:opacity-80">
          <Text className="text-[14px] font-outfit-semibold text-white">Open</Text>
          <ArrowRight size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </ReportCard>
  );
}
