/**
 * Clone a course into a new semester, then build its plan.
 *
 *   POST /courses/:id/clone        topics, weightage and grade scale come across
 *   PATCH /courses/:id             only if the class days changed (clone keeps the source's)
 *   POST /courses/:id/plan/generate
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { coursesApi, planApi, type CourseDetail, type CourseListItem, type PlanGenerateResult } from "@/api";
import CloneCourseScreen, { type CloneForm } from "@/components/dashboard/CloneCourseScreen";
import { PlanGeneratedScreen } from "@/components/plan/PlanGeneratedScreen";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useAction } from "@/hooks/useAction";
import { useApi } from "@/hooks/useApi";
import { useCourse } from "@/providers/CourseProvider";
import { validateCourseDetails } from "@/types/create-course";

const EMPTY_FORM: CloneForm = { sourceId: null, semester: "", startDate: "", endDate: "", classDays: [] };

export default function CloneCourse() {
  const router = useRouter();
  const { selectCourse } = useCourse();
  const { busy, run } = useAction();

  const { data: courses, error, loading, reload } = useApi(() => coursesApi.list(), []);
  const [form, setForm] = useState<CloneForm>(EMPTY_FORM);
  const [created, setCreated] = useState<{ course: CourseDetail; plan: PlanGenerateResult } | null>(null);

  const source = courses?.find((c) => c.id === form.sourceId);

  // Picking a source pre-fills its class days; the teacher sets the new dates.
  const selectSource = (course: CourseListItem) =>
    setForm((prev) => ({ ...prev, sourceId: course.id, classDays: course.class_days }));

  const submit = async () => {
    if (!source) return;
    const problem = validateCourseDetails(form);
    if (problem) {
      Alert.alert("Check the details", problem);
      return;
    }

    const result = await run(async () => {
      const clone = await coursesApi.clone(source.id, {
        semester: form.semester.trim() || undefined,
        start_date: form.startDate,
        end_date: form.endDate,
      });

      const daysChanged =
        form.classDays.length !== source.class_days.length || form.classDays.some((d) => !source.class_days.includes(d));
      if (daysChanged) await coursesApi.update(clone.id, { class_days: form.classDays });

      const plan = await planApi.generate(clone.id);
      const course = await coursesApi.get(clone.id);
      return { course, plan };
    }, "Couldn't clone the course");
    if (!result) return;

    selectCourse(result.course.id);
    setCreated(result);
  };

  if (created) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <PlanGeneratedScreen
          course={created.course}
          topics={created.course.topics}
          result={created.plan}
          onAddStudents={() => router.replace("/students")}
          onOpenDashboard={() => router.replace("/home")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {!courses && loading ? (
        <LoadingState label="Loading your courses..." />
      ) : !courses && error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <CloneCourseScreen
          sources={courses ?? []}
          form={form}
          onChange={setForm}
          onSelectSource={selectSource}
          onBack={() => router.back()}
          onSubmit={submit}
          busy={busy}
        />
      )}
    </SafeAreaView>
  );
}
