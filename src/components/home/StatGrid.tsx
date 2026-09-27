import React from "react";
import { View } from "react-native";
import { GraduationCap, TrendingUp, Users, ClipboardCheck } from "lucide-react-native";
import StatCard from "./StatCard";

export interface StatsGridData {
  classesCompleted: number;
  classesTarget: number;
  progressPercent: number;
  topicsTotal: number;
  attendancePercent: number;
  studentsCount: number;
  assessmentsDone: number;
  assessmentsLabel: string;
}

export default function StatsGrid({ data }: { data: StatsGridData }) {
  return (
    <View className="mx-5 mt-4">
      <View className="flex-row" style={{ gap: 12 }}>
        <StatCard
          label="Classes"
          value={`${data.classesCompleted} of ${data.classesTarget}`}
          caption="Target for Month"
          icon={GraduationCap}
          bgColor="#2E9E86"
          textColor="#0B3B31"
          iconBgColor="rgba(255,255,255,0.35)"
        />
        <StatCard
          label="Progress"
          value={`${data.progressPercent}%`}
          caption={`${data.topicsTotal} topics total`}
          icon={TrendingUp}
          bgColor="#F0C64A"
          textColor="#4A3A08"
          iconBgColor="rgba(255,255,255,0.4)"
        />
      </View>

      <View className="mt-3 flex-row" style={{ gap: 12 }}>
        <StatCard
          label="Attendance"
          value={`${data.attendancePercent}%`}
          caption={`Avg across ${data.studentsCount} students`}
          icon={Users}
          bgColor="#E88098"
          textColor="#4A0E1E"
          iconBgColor="rgba(255,255,255,0.4)"
        />
        <StatCard
          label="Assessments"
          value={`${data.assessmentsDone} done`}
          caption={data.assessmentsLabel}
          icon={ClipboardCheck}
          bgColor="#8FB4E8"
          textColor="#0F2E52"
          iconBgColor="rgba(255,255,255,0.4)"
        />
      </View>
    </View>
  );
}