import React from "react";
import { View } from "react-native";
import { ClipboardCheck, GraduationCap, TrendingUp, Users } from "lucide-react-native";

import type { Dashboard } from "@/api/types";
import { formatPercent, plural } from "@/utils/format";
import StatCard from "./StatCard";

/** The four headline numbers, straight from GET /courses/:id/dashboard. */
export default function StatsGrid({ dashboard }: { dashboard: Dashboard }) {
  const { schedule, topics, attendance, assessments } = dashboard;
  const outstanding = assessments.marks_outstanding.length;

  return (
    <View className="mx-5 mt-4">
      <View className="flex-row" style={{ gap: 12 }}>
        <StatCard
          label="Classes"
          value={`${schedule.conducted} of ${schedule.planned_up_to_today}`}
          caption={`Due so far · ${schedule.total_sessions} in plan`}
          icon={GraduationCap}
          bgColor="#2E9E86"
          textColor="#0B3B31"
          iconBgColor="rgba(255,255,255,0.35)"
        />
        <StatCard
          label="Progress"
          value={`${schedule.syllabus_percent}%`}
          caption={`${topics.completed} of ${plural(topics.total, "topic")} done`}
          icon={TrendingUp}
          bgColor="#F0C64A"
          textColor="#4A3A08"
          iconBgColor="rgba(255,255,255,0.4)"
        />
      </View>

      <View className="mt-3 flex-row" style={{ gap: 12 }}>
        <StatCard
          label="Attendance"
          value={formatPercent(attendance.class_average)}
          caption={
            attendance.below_threshold_count > 0
              ? `${attendance.below_threshold_count} of ${attendance.student_count} below threshold`
              : `Avg across ${plural(attendance.student_count, "student")}`
          }
          icon={Users}
          bgColor="#E88098"
          textColor="#4A0E1E"
          iconBgColor="rgba(255,255,255,0.4)"
        />
        <StatCard
          label="Assessments"
          value={`${assessments.upcoming.length} upcoming`}
          caption={outstanding > 0 ? `${outstanding} need marks` : "All marks entered"}
          icon={ClipboardCheck}
          bgColor="#8FB4E8"
          textColor="#0F2E52"
          iconBgColor="rgba(255,255,255,0.4)"
        />
      </View>
    </View>
  );
}
