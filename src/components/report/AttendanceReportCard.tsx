import { Pressable, Text, View } from "react-native";
import { Clock, FileText, Share2, UserCheck } from "lucide-react-native";
import { ReportBadge, ReportCard } from "./ReportCard";

type AttendanceReportCardProps = {
  generatedLabel: string;
  studentCount: number;
  onOpen?: () => void;
  onShare?: () => void;
};

export function AttendanceReportCard({
  generatedLabel,
  studentCount,
  onOpen,
  onShare,
}: AttendanceReportCardProps) {
  return (
    <ReportCard
      gradientColors={["#F472A6", "#EC4899"]}
      icon={<UserCheck size={18} color="#DB2777" />}
      badge={<ReportBadge label="Ready to export" dotColor="#22C55E" />}
      title="Attendance Report"
      description="Session-wise student attendance log with below-75% deficit alerts."
    >
      <View className="flex-row items-center gap-1.5">
        <Clock size={13} color="#374151" />
        <Text className="font-outfit text-[12px] text-gray-700">
          {generatedLabel} · {studentCount} Students
        </Text>
      </View>

      <View className="mt-5 flex-row items-center gap-3">
        <Pressable
          onPress={onOpen}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 active:opacity-80"
        >
          <FileText size={16} color="#FFFFFF" />
          <Text className="text-[14px] font-outfit-semibold text-white">Open</Text>
        </Pressable>

        <Pressable
          onPress={onShare}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-white py-3.5 active:opacity-80"
        >
          <Share2 size={16} color="#111827" />
          <Text className="text-[14px] font-outfit-semibold text-gray-900">
            Share
          </Text>
        </Pressable>
      </View>
    </ReportCard>
  );
}