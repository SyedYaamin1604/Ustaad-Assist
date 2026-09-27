/**
 * Assessments, marks and results.
 *
 *   list     GET  /courses/:id/assessments        + POST to create
 *   marks    GET  /assessments/:id/marks          + POST the changed rows
 *   results  GET  /courses/:id/results            + PUT weightage / grade-scale
 */

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { assessmentsApi, planApi, type ComponentType, type GradeBand, type MarkInput } from "@/api";
import type { CreateAssessmentInput } from "@/api/assessments";
import { AssessmentListScreen } from "@/components/assessment/AssessmentListScreen";
import { CreateAssessmentModal } from "@/components/assessment/CreateAssessmentModal";
import { EnterMarksScreen } from "@/components/assessment/EnterMarksScreen";
import { GradingSettingsSheet } from "@/components/assessment/GradingSettingsSheet";
import { ResultsGradesScreen } from "@/components/assessment/ResultsGradesScreen";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useAction } from "@/hooks/useAction";
import { useApi } from "@/hooks/useApi";
import { useCourse } from "@/providers/CourseProvider";

type AssessmentView = "list" | "marks" | "results";

export default function Assessment() {
  const router = useRouter();
  const { courseId, course } = useCourse();
  const { busy, run } = useAction();

  const [view, setView] = useState<AssessmentView>("list");
  const [openAssessmentId, setOpenAssessmentId] = useState<string | null>(null);
  const [createCount, setCreateCount] = useState(0);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [gradingCount, setGradingCount] = useState(0);
  const [isGradingOpen, setGradingOpen] = useState(false);

  const list = useApi(
    courseId
      ? async () => {
          const [assessments, plan] = await Promise.all([assessmentsApi.list(courseId), planApi.getSessions(courseId)]);
          return { assessments, sessions: plan.sessions };
        }
      : null,
    [courseId],
  );
  const sheet = useApi(view === "marks" && openAssessmentId ? () => assessmentsApi.getMarks(openAssessmentId) : null, [
    view,
    openAssessmentId,
  ]);
  const results = useApi(view === "results" && courseId ? () => assessmentsApi.results(courseId) : null, [view, courseId]);

  if (!courseId || !course) return <LoadingState />;

  const courseLabel = [course.name, course.code].filter(Boolean).join(" ");
  const openReport = () => router.push({ pathname: "/report/[type]", params: { type: "result" } });

  // ------------------------------------------------------------ actions

  const create = async (input: CreateAssessmentInput) => {
    const created = await run(() => assessmentsApi.create(courseId, input), "Couldn't create the assessment");
    if (!created) return;
    setCreateOpen(false);
    list.reload();
    Alert.alert("Assessment created", `${created.title} is ready. Enter marks whenever you have them.`);
  };

  const saveMarks = async (marks: MarkInput[]) => {
    if (!openAssessmentId) return false;
    const result = await run(() => assessmentsApi.saveMarks(openAssessmentId, marks), "Couldn't save the marks");
    if (!result) return false;
    list.reload();
    return true;
  };

  const saveWeightage = async (weights: Record<ComponentType, number>) => {
    const saved = await run(() => assessmentsApi.setWeightage(courseId, weights), "Couldn't save the weightage");
    if (!saved) return;
    setGradingOpen(false);
    results.reload();
  };

  const saveGradeScale = async (bands: GradeBand[]) => {
    const saved = await run(() => assessmentsApi.setGradeScale(courseId, bands), "Couldn't save the grade scale");
    if (!saved) return;
    setGradingOpen(false);
    results.reload();
  };

  // -------------------------------------------------------------- views

  if (view === "marks") {
    if (!sheet.data) return sheet.error ? <ErrorState message={sheet.error} onRetry={sheet.reload} /> : <LoadingState label="Loading the class..." />;
    return (
      <EnterMarksScreen
        key={openAssessmentId ?? ""}
        sheet={sheet.data}
        saving={busy}
        onBack={() => {
          setOpenAssessmentId(null);
          setView("list");
        }}
        onSave={saveMarks}
      />
    );
  }

  if (view === "results") {
    if (!results.data) {
      return results.error ? <ErrorState message={results.error} onRetry={results.reload} /> : <LoadingState label="Working out the results..." />;
    }
    return (
      <>
        <ResultsGradesScreen
          courseLabel={courseLabel}
          results={results.data}
          refreshing={results.loading}
          onRefresh={results.reload}
          onBack={() => setView("list")}
          onEditGrading={() => {
            setGradingCount((n) => n + 1);
            setGradingOpen(true);
          }}
          onOpenReport={openReport}
        />
        <GradingSettingsSheet
          key={gradingCount}
          visible={isGradingOpen}
          weightage={results.data.weightage}
          gradeScale={results.data.grade_scale}
          saving={busy}
          onClose={() => setGradingOpen(false)}
          onSaveWeightage={saveWeightage}
          onSaveGradeScale={saveGradeScale}
        />
      </>
    );
  }

  if (!list.data) return list.error ? <ErrorState message={list.error} onRetry={list.reload} /> : <LoadingState label="Loading assessments..." />;

  return (
    <>
      <AssessmentListScreen
        courseLabel={courseLabel}
        semester={course.semester}
        assessments={list.data.assessments}
        topics={course.topics}
        refreshing={list.loading}
        onRefresh={list.reload}
        onOpenCreate={() => {
          setCreateCount((n) => n + 1);
          setCreateOpen(true);
        }}
        onOpenAssessment={(id) => {
          setOpenAssessmentId(id);
          setView("marks");
        }}
        onOpenResults={() => setView("results")}
      />
      <CreateAssessmentModal
        key={createCount}
        visible={isCreateOpen}
        topics={course.topics}
        sessions={list.data.sessions}
        saving={busy}
        onClose={() => setCreateOpen(false)}
        onSubmit={create}
      />
    </>
  );
}
