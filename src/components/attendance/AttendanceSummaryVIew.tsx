import React from "react";
import { ScrollView, View } from "react-native";
import { BarChart3, AlertTriangle } from "lucide-react-native";
import { StatCard } from "./StatCard";
import { SectionLabel } from "./SectionLabel";
import { WarningBanner } from "./WarningBanner";
import { StudentSummaryRow } from "./StudentSummaryRow";
import { DownloadRecordCard } from "./DownloadRecordCard";
import { StudentSummary } from "../../types/attendance";

interface AttendanceSummaryViewProps {
  overallPct: number;
  atRiskCount: number;
  atRiskStudents: StudentSummary[];
  satisfactoryStudents: StudentSummary[];
  satisfactoryCount: number;
  onDownloadRoster?: () => void;
}

export function AttendanceSummaryView({
  overallPct,
  atRiskCount,
  atRiskStudents,
  satisfactoryStudents,
  satisfactoryCount,
  onDownloadRoster,
}: AttendanceSummaryViewProps) {
  return (
    <ScrollView
      className="mt-5 flex-1 px-5"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row gap-3">
        <StatCard
          icon={<BarChart3 size={16} color="#BE185D" />}
          badgeLabel="Overall"
          value={`${overallPct}%`}
          caption="Cohort Average"
          bgClassName="bg-rose-100"
        />
        <StatCard
          icon={<AlertTriangle size={16} color="#B45309" />}
          badgeLabel="Alert"
          value={`${atRiskCount}`}
          caption="At-Risk (<75%)"
          bgClassName="bg-amber-100"
        />
      </View>

      <SectionLabel
        label="BELOW 75% ATTENDANCE THRESHOLD"
        dotClassName="bg-amber-500"
      />
      <WarningBanner message="Action required / Exam eligibility warning" />

      {atRiskStudents.map((student) => (
        <StudentSummaryRow key={student.id} student={student} />
      ))}

      <SectionLabel
        label="SATISFACTORY (75% AND ABOVE)"
        dotClassName="bg-emerald-500"
        trailing={`${satisfactoryCount} Students`}
      />

      {satisfactoryStudents.map((student) => (
        <StudentSummaryRow key={student.id} student={student} />
      ))}

      <DownloadRecordCard onPress={onDownloadRoster} />
    </ScrollView>
  );
}