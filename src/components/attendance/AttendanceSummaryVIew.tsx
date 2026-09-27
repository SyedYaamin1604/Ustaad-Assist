import React from "react";
import { ScrollView, Text, View } from "react-native";
import { AlertTriangle, BarChart3 } from "lucide-react-native";

import type { SummaryEntry } from "@/types/attendance";
import { formatPercent } from "@/utils/format";
import { DownloadRecordCard } from "./DownloadRecordCard";
import { SectionLabel } from "./SectionLabel";
import { StatCard } from "./StatCard";
import { StudentSummaryRow } from "./StudentSummaryRow";
import { WarningBanner } from "./WarningBanner";

interface AttendanceSummaryViewProps {
  threshold: number;
  classesHeld: number;
  classAverage: number | null;
  atRisk: SummaryEntry[];
  satisfactory: SummaryEntry[];
  onOpenReport?: () => void;
}

export function AttendanceSummaryView({
  threshold,
  classesHeld,
  classAverage,
  atRisk,
  satisfactory,
  onOpenReport,
}: AttendanceSummaryViewProps) {
  return (
    <ScrollView className="mt-5 flex-1 px-5" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <View className="flex-row gap-3">
        <StatCard
          icon={<BarChart3 size={16} color="#BE185D" />}
          badgeLabel="Overall"
          value={formatPercent(classAverage)}
          caption={`Class average · ${classesHeld} held`}
          bgClassName="bg-rose-100"
        />
        <StatCard
          icon={<AlertTriangle size={16} color="#B45309" />}
          badgeLabel="Alert"
          value={`${atRisk.length}`}
          caption={`At risk (<${threshold}%)`}
          bgClassName="bg-amber-100"
        />
      </View>

      {classesHeld === 0 && (
        <Text className="mt-6 font-outfit text-sm text-neutral-500">
          No class has been conducted yet, so there is nothing to average. Percentages appear after the first roll call.
        </Text>
      )}

      {atRisk.length > 0 && (
        <>
          <SectionLabel label={`BELOW ${threshold}% ATTENDANCE THRESHOLD`} dotClassName="bg-amber-500" trailing={`${atRisk.length} Students`} />
          <WarningBanner message="Action required / Exam eligibility warning" />
          {atRisk.map((student) => (
            <StudentSummaryRow key={student.student_id} student={student} threshold={threshold} />
          ))}
        </>
      )}

      {satisfactory.length > 0 && (
        <>
          <SectionLabel
            label={`SATISFACTORY (${threshold}% AND ABOVE)`}
            dotClassName="bg-emerald-500"
            trailing={`${satisfactory.length} Students`}
          />
          {satisfactory.map((student) => (
            <StudentSummaryRow key={student.student_id} student={student} threshold={threshold} />
          ))}
        </>
      )}

      <DownloadRecordCard onPress={onOpenReport} />
    </ScrollView>
  );
}
