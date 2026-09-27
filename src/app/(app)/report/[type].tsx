/**
 * One report, exactly as the backend assembled it (GET /courses/:id/reports/:type).
 * The table, summary and notes are shown as sent; the PDF is a rendering of the same object.
 */

import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { reportsApi, type ReportType } from "@/api";
import { ReportsHeader } from "@/components/report/ReportsHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useAction } from "@/hooks/useAction";
import { useApi } from "@/hooks/useApi";
import { shareReportPdf } from "@/lib/reportPdf";
import { useCourse } from "@/providers/CourseProvider";
import { formatFullDate } from "@/utils/date";

const REPORT_TYPES: ReportType[] = ["result", "attendance", "course"];
const COLUMN_WIDTH = 120;

export default function ReportPreview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string }>();
  const type = REPORT_TYPES.includes(params.type as ReportType) ? (params.type as ReportType) : "result";
  const { courseId, course } = useCourse();
  const { busy, run } = useAction();

  const { data: doc, error, reload } = useApi(courseId ? () => reportsApi.get(courseId, type) : null, [courseId, type]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/report"));

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ReportsHeader courseLabel={course ? [course.code ?? course.name, course.semester].filter(Boolean).join(" · ") : ""} onBackPress={goBack} />

      {!doc ? (
        error ? <ErrorState message={error} onRetry={reload} /> : <LoadingState label="Assembling the report..." />
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
          <Text className="text-[28px] font-outfit-bold leading-8 text-gray-900">{doc.title}</Text>
          <Text className="mt-1 font-outfit-semibold text-sm text-gray-800">
            {[doc.header.course_name, doc.header.course_code].filter(Boolean).join(" · ")}
          </Text>
          <Text className="mt-0.5 font-outfit text-xs text-gray-500">
            {[doc.header.semester, doc.header.teacher_name, doc.header.department, `Generated ${formatFullDate(doc.header.generated_on)}`]
              .filter(Boolean)
              .join(" · ")}
          </Text>

          {doc.summary.length > 0 && (
            <View className="mt-5 flex-row flex-wrap gap-3">
              {doc.summary.map((s) => (
                <View key={s.label} className="min-w-[45%] flex-1 rounded-2xl bg-white p-3.5">
                  <Text className="font-outfit text-xs text-gray-500">{s.label}</Text>
                  <Text className="mt-0.5 font-outfit-bold text-base text-gray-900">{s.value}</Text>
                </View>
              ))}
            </View>
          )}

          <ScrollView horizontal className="mt-5 rounded-2xl bg-white" showsHorizontalScrollIndicator>
            <View>
              <View className="flex-row border-b border-gray-200 bg-gray-100">
                {doc.columns.map((column) => (
                  <Text key={column} style={{ width: COLUMN_WIDTH }} className="px-3 py-2.5 font-outfit-semibold text-xs text-gray-700">
                    {column}
                  </Text>
                ))}
              </View>
              {doc.rows.length === 0 ? (
                <Text className="px-3 py-4 font-outfit text-sm text-gray-500">No rows yet.</Text>
              ) : (
                doc.rows.map((row, rowIndex) => (
                  <View key={rowIndex} className="flex-row border-b border-gray-100">
                    {row.map((cell, cellIndex) => (
                      <Text key={cellIndex} style={{ width: COLUMN_WIDTH }} className="px-3 py-2.5 font-outfit text-xs text-gray-800">
                        {cell ?? "—"}
                      </Text>
                    ))}
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          {doc.notes.map((note) => (
            <View key={note} className="mt-3 flex-row items-start">
              <Feather name="info" size={13} color="#6B7280" style={{ marginTop: 2 }} />
              <Text className="ml-2 flex-1 font-outfit text-xs text-gray-600">{note}</Text>
            </View>
          ))}

          <View className="mt-6">
            <PrimaryButton
              label={busy ? "Preparing PDF..." : "Export PDF"}
              icon="share"
              disabled={busy}
              onPress={() => run(() => shareReportPdf(doc), "Couldn't create the PDF")}
            />
          </View>
          <Pressable onPress={goBack} className="items-center py-4">
            <Text className="font-outfit-semibold text-[15px] text-gray-500">Back to reports</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
