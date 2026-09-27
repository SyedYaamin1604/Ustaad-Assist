import { useRouter } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { dashboardApi, reportsApi, type ReportType } from "@/api";
import { AttendanceReportCard } from "@/components/report/AttendanceReportCard";
import { CourseDeliveryCard } from "@/components/report/CourseDeliveryCard";
import { GradeSheetCard } from "@/components/report/GradeSheetCard";
import { ReportsHeader } from "@/components/report/ReportsHeader";
import { ReportsTitle } from "@/components/report/ReportsTitle";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useAction } from "@/hooks/useAction";
import { useApi } from "@/hooks/useApi";
import { shareReportPdf } from "@/lib/reportPdf";
import { useCourse } from "@/providers/CourseProvider";

/** The three reports. The numbers on each card come from the dashboard endpoint. */
export default function Reports() {
  const router = useRouter();
  const { courseId, course } = useCourse();
  const { run } = useAction();

  const { data: dashboard, error, loading, reload } = useApi(courseId ? () => dashboardApi.get(courseId) : null, [courseId]);

  if (!course || !courseId) return <LoadingState />;

  const open = (type: ReportType) => router.push({ pathname: "/report/[type]", params: { type } });
  const share = (type: ReportType) =>
    run(async () => shareReportPdf(await reportsApi.get(courseId, type)), "Couldn't create the PDF");

  const courseLabel = [course.code ?? course.name, course.semester].filter(Boolean).join(" · ");

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ReportsHeader courseLabel={courseLabel} onBackPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))} />

      {!dashboard ? (
        error ? <ErrorState message={error} onRetry={reload} /> : <LoadingState />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        >
          <ReportsTitle title="Semester Reports" subtitle={`${[course.name, course.code].filter(Boolean).join(" ")} · Official documentation`} />

          <View className="gap-5 px-6">
            <AttendanceReportCard
              generatedLabel={`${dashboard.attendance.classes_held} classes held`}
              studentCount={dashboard.attendance.student_count}
              onOpen={() => open("attendance")}
              onShare={() => share("attendance")}
            />

            <GradeSheetCard
              studentCount={dashboard.attendance.student_count}
              missingCount={dashboard.results?.students_with_missing_marks ?? 0}
              onOpen={() => open("result")}
              onShare={() => share("result")}
            />

            <CourseDeliveryCard
              conducted={dashboard.schedule.conducted}
              totalSessions={dashboard.schedule.total_sessions}
              onOpen={() => open("course")}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
