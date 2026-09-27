import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Share2, Calendar } from "lucide-react-native";

import { AttendanceHeader } from "../components/attendance/AttendanceHeader";
import { AttendanceTitleBlock, ViewToggle } from "../components/attendance/ViewToggle";
import { AttendanceSummaryView } from "../components/attendance/AttendanceSummaryVIew";
import { AttendanceMarkView } from "../components/attendance/AttendanceMarkView";
import { AttendanceView, StudentMarkEntry } from "../types/attendance";
import {
  atRiskStudents,
  lectureInfo,
  markEntries,
  satisfactoryCount,
  satisfactoryStudents,
} from "../components/attendance/AttendanceData";

const COURSE_LABEL = "CS-301 · Section B";
const COURSE_SUBTITLE = "Database Systems CS-301 · 8 Lectures conducted";
const OVERALL_PCT = 88;
const TOTAL_ENROLLED = 60;

export default function Attendance() {
  const router = useRouter();
  const [view, setView] = useState<AttendanceView>("summary");
  const [students, setStudents] = useState<StudentMarkEntry[]>(markEntries);

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <AttendanceHeader
        courseLabel={COURSE_LABEL}
        onBackPress={() => router.back()}
        rightIcon={
          view === "summary" ? (
            <Share2 size={16} color="#171717" />
          ) : (
            <Calendar size={16} color="#171717" />
          )
        }
      />

      <AttendanceTitleBlock title="Attendance" subtitle={COURSE_SUBTITLE} />

      <ViewToggle value={view} onChange={setView} />

      {view === "summary" ? (
        <AttendanceSummaryView
          overallPct={OVERALL_PCT}
          atRiskCount={atRiskStudents.length}
          atRiskStudents={atRiskStudents}
          satisfactoryStudents={satisfactoryStudents}
          satisfactoryCount={satisfactoryCount}
          onDownloadRoster={() => {
            // TODO: wire up signed-PDF roster export
          }}
        />
      ) : (
        <View className="mt-1 flex-1">
          <AttendanceMarkView
            lecture={lectureInfo}
            totalEnrolled={TOTAL_ENROLLED}
            students={students}
            onStudentsChange={setStudents}
            onSubmit={() => {
              // TODO: wire up attendance submission
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}