/**
 * Attendance for one class, and the course summary.
 *
 *   mark     GET  /sessions/:id/attendance   everyone, present by default
 *            POST /sessions/:id/attendance   ONLY absentees and leave; marks the class conducted
 *   summary  GET  /courses/:id/attendance/summary
 *
 * Opened with ?sessionId=12, or without one it picks today's class (else the
 * most recent class before today).
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Share2 } from "lucide-react-native";

import { attendanceApi, planApi, type Session } from "@/api";
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { AttendanceMarkView } from "@/components/attendance/AttendanceMarkView";
import { AttendanceSummaryView } from "@/components/attendance/AttendanceSummaryVIew";
import { AttendanceTitleBlock, ViewToggle } from "@/components/attendance/ViewToggle";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { SelectModal } from "@/components/ui/SelectModal";
import { useAction } from "@/hooks/useAction";
import { useApi } from "@/hooks/useApi";
import { useCourse } from "@/providers/CourseProvider";
import type { AttendanceStatus, AttendanceView, MarkEntry, SummaryEntry } from "@/types/attendance";
import { formatShortDate, parseISODate, todayISO } from "@/utils/date";
import { lectureNumber, partLabel, sessionTitle } from "@/utils/plan";

const NEXT_STATUS: Record<AttendanceStatus, AttendanceStatus> = { present: "absent", absent: "leave", leave: "present" };

/** Classes the roll can be taken for: not cancelled, and not in the future. */
function markableSessions(sessions: Session[]): Session[] {
  const today = todayISO();
  return sessions.filter((s) => s.status !== "cancelled" && s.date <= today);
}

function defaultSessionId(sessions: Session[]): string | null {
  const today = todayISO();
  const markable = markableSessions(sessions);
  return (markable.find((s) => s.date === today) ?? markable[markable.length - 1])?.id ?? null;
}

function sessionLabel(sessions: Session[], session: Session): string {
  return `Lecture ${lectureNumber(sessions, session.id)} · ${formatShortDate(parseISODate(session.date))}`;
}

export default function Attendance() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const { courseId, course } = useCourse();
  const { busy, run } = useAction();

  const [view, setView] = useState<AttendanceView>(params.sessionId ? "mark" : "summary");
  const [pickedId, setPickedId] = useState<string | null>(params.sessionId ?? null);
  const [edits, setEdits] = useState<Record<string, AttendanceStatus>>({});
  const [pickerOpen, setPickerOpen] = useState(false);

  const plan = useApi(courseId ? () => planApi.getSessions(courseId) : null, [courseId]);
  const summary = useApi(courseId ? () => attendanceApi.summary(courseId) : null, [courseId]);

  const sessions = plan.data?.sessions ?? [];
  const sessionId = pickedId ?? defaultSessionId(sessions);
  const session = sessions.find((s) => s.id === sessionId);

  const roll = useApi(sessionId ? () => attendanceApi.getForSession(sessionId) : null, [sessionId]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/home"));

  if (!course || !courseId) return <LoadingState />;

  const courseLabel = [course.code ?? course.name, course.semester].filter(Boolean).join(" · ");
  const conductedCount = sessions.filter((s) => s.status === "conducted").length;

  // ---------------------------------------------------------- marking

  const entries: MarkEntry[] = (roll.data ?? []).map((row) => ({
    student_id: row.student_id,
    roll_no: row.roll_no,
    name: row.name,
    status: edits[row.student_id] ?? row.status,
  }));

  const pickSession = (id: string) => {
    setPickedId(id);
    setEdits({});
  };

  const submit = async () => {
    if (!sessionId) return;
    const absent = entries.filter((e) => e.status === "absent").map((e) => e.student_id);
    const leave = entries.filter((e) => e.status === "leave").map((e) => e.student_id);

    const result = await run(() => attendanceApi.submit(sessionId, absent, leave), "Couldn't save attendance");
    if (!result) return;

    setEdits({});
    roll.reload();
    summary.reload();
    plan.reload();
    Alert.alert(
      "Attendance saved",
      `${result.present} present · ${result.absent} absent · ${result.leave} on leave. The class is marked conducted.`,
      [
        { text: "See summary", onPress: () => setView("summary") },
        { text: "Done", onPress: goBack },
      ],
    );
  };

  // ---------------------------------------------------------- summary

  const summaryEntries: SummaryEntry[] = (summary.data?.students ?? []).map((s) => ({
    student_id: s.student_id,
    roll_no: s.roll_no,
    name: s.name,
    percentage: s.percentage,
    present: s.present,
    counted: s.present + s.absent,
  }));
  const belowIds = new Set((summary.data?.below_threshold ?? []).map((s) => s.student_id));
  const atRisk = summaryEntries.filter((s) => belowIds.has(s.student_id));
  const satisfactory = summaryEntries.filter((s) => !belowIds.has(s.student_id) && s.percentage !== null);

  // ------------------------------------------------------------- render

  const renderMark = () => {
    if (!plan.data) return plan.error ? <ErrorState message={plan.error} onRetry={plan.reload} /> : <LoadingState />;
    if (!session) {
      return <EmptyState icon="calendar" title="No class to mark yet" message="Attendance can be taken once a class date arrives." />;
    }
    if (!roll.data) return roll.error ? <ErrorState message={roll.error} onRetry={roll.reload} /> : <LoadingState />;
    if (roll.data.length === 0) {
      return (
        <EmptyState
          icon="users"
          title="No students enrolled"
          message="Add the class list first, then take attendance."
          actionLabel="Add students"
          onAction={() => router.replace("/students")}
        />
      );
    }
    return (
      <AttendanceMarkView
        lecture={{
          label: sessionLabel(sessions, session),
          topic: [sessionTitle(session), partLabel(session)].filter(Boolean).join(" · "),
        }}
        students={entries}
        alreadyRecorded={roll.data.some((r) => r.recorded)}
        submitting={busy}
        onCycleStatus={(id) =>
          setEdits((prev) => {
            const current = prev[id] ?? roll.data?.find((r) => r.student_id === id)?.status ?? "present";
            return { ...prev, [id]: NEXT_STATUS[current] };
          })
        }
        onPickLecture={() => setPickerOpen(true)}
        onSubmit={submit}
      />
    );
  };

  const markable = markableSessions(sessions).slice().reverse();
  const pickerLabels = markable.map((s) => `${sessionLabel(sessions, s)} — ${sessionTitle(s)}`);

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <AttendanceHeader
        courseLabel={courseLabel}
        onBackPress={goBack}
        rightIcon={view === "summary" ? <Share2 size={16} color="#171717" /> : <Calendar size={16} color="#171717" />}
        onRightPress={() =>
          view === "summary" ? router.push({ pathname: "/report/[type]", params: { type: "attendance" } }) : setPickerOpen(true)
        }
      />

      <AttendanceTitleBlock
        title="Attendance"
        subtitle={`${[course.name, course.code].filter(Boolean).join(" ")} · ${conductedCount} ${conductedCount === 1 ? "class" : "classes"} conducted`}
      />

      <ViewToggle value={view} onChange={setView} />

      {view === "summary" ? (
        !summary.data ? (
          summary.error ? <ErrorState message={summary.error} onRetry={summary.reload} /> : <LoadingState />
        ) : (
          <AttendanceSummaryView
            threshold={summary.data.attendance_threshold}
            classesHeld={summary.data.classes_held}
            classAverage={summary.data.class_average}
            atRisk={atRisk}
            satisfactory={satisfactory}
            onOpenReport={() => router.push({ pathname: "/report/[type]", params: { type: "attendance" } })}
          />
        )
      ) : (
        <View className="mt-1 flex-1">{renderMark()}</View>
      )}

      <SelectModal
        visible={pickerOpen}
        title="Choose a class"
        options={pickerLabels}
        value={session ? pickerLabels[markable.findIndex((s) => s.id === session.id)] ?? null : null}
        onSelect={(label) => {
          const index = pickerLabels.indexOf(label);
          if (index >= 0) pickSession(markable[index].id);
          setView("mark");
        }}
        onClose={() => setPickerOpen(false)}
      />
    </SafeAreaView>
  );
}
