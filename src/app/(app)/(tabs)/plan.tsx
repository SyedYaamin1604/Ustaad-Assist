/**
 * The teaching plan: the planner's timetable and everything that changes it.
 *
 *   view "plan"     calendar / week list, and the session sheet
 *   view "topics"   correct a topic's classes, minimum, priority or order
 *   view "deficit"  the three computed ways out of a shortage
 *   view "replan"   what moved after a cancellation, deficit fix or rebuild
 *
 * Other screens can deep-link here with params:
 *   ?sessionId=12             open that class's sheet
 *   ?sessionId=12&action=cancel   ...straight into the cancel form
 *   ?view=deficit             open the catch-up options
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { assessmentsApi, coursesApi, dashboardApi, planApi, type DeficitChoice, type ReplanResult, type Topic } from "@/api";
import { DeficitScreen } from "@/components/plan/DeficitScreen";
import type { TopicEdit } from "@/components/plan/EditTopicSheet";
import { PlanUpdatedScreen } from "@/components/plan/PlanUpdatedScreen";
import { SessionSheet } from "@/components/plan/SessionSheet";
import { TeachingPlanScreen } from "@/components/plan/TeachingPlanScreen";
import { TopicsScreen } from "@/components/plan/TopicsScreen";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useAction } from "@/hooks/useAction";
import { useApi } from "@/hooks/useApi";
import { useCourse } from "@/providers/CourseProvider";
import { formatShortDate, parseISODate, todayISO } from "@/utils/date";
import { plural } from "@/utils/format";
import { attachAssessments, lectureNumber } from "@/utils/plan";

type PlanView = "plan" | "replan" | "deficit" | "topics";

type ReplanState = {
  result: ReplanResult;
  subtitle: string;
  /** Set when the replan came from cancelling this session, so it can be undone. */
  cancelledSessionId?: string;
};

export default function Plan() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string; action?: string; view?: string }>();
  const { courseId, course, reloadCourse } = useCourse();
  const { busy, run } = useAction();

  const [view, setView] = useState<PlanView>("plan");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<"actions" | "cancel">("actions");
  const [replan, setReplan] = useState<ReplanState | null>(null);
  const [needsReplan, setNeedsReplan] = useState(false);

  const { data, error, loading, reload } = useApi(
    courseId
      ? async () => {
          const [plan, dashboard, assessments] = await Promise.all([
            planApi.getSessions(courseId),
            dashboardApi.get(courseId),
            assessmentsApi.list(courseId),
          ]);
          return { sessions: attachAssessments(plan.sessions, assessments), warning: dashboard.schedule.warning };
        }
      : null,
    [courseId],
  );

  const deficit = useApi(view === "deficit" && courseId ? () => planApi.getDeficit(courseId) : null, [courseId, view]);

  // Deep links from the home screen: act on each new set of params once...
  const linkKey = [params.sessionId, params.action, params.view].join("|");
  const [handledLink, setHandledLink] = useState("||");
  if (linkKey !== handledLink) {
    setHandledLink(linkKey);
    if (params.sessionId) {
      setView("plan");
      setSheetMode(params.action === "cancel" ? "cancel" : "actions");
      setActiveSessionId(params.sessionId);
    }
    if (params.view === "deficit") setView("deficit");
  }

  // ...then clear them, so returning to the tab does not reopen the sheet.
  useEffect(() => {
    if (params.sessionId || params.view) router.setParams({ sessionId: undefined, action: undefined, view: undefined });
  }, [params.sessionId, params.view, router]);

  if (!course || !courseId) return <LoadingState />;
  if (!data) return error ? <ErrorState message={error} onRetry={reload} /> : <LoadingState label="Loading the plan..." />;

  const { sessions } = data;
  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const holidays = course.holidays.filter((h) => h.is_active).map((h) => h.date);
  const today = todayISO();

  /** After anything that changes the plan, refresh the plan and the course (topic statuses). */
  const refreshAll = () => {
    reload();
    reloadCourse();
  };

  const showReplan = (next: ReplanState) => {
    setReplan(next);
    setView("replan");
    refreshAll();
  };

  // ---------------------------------------------------------- sessions

  const markConducted = async () => {
    if (!activeSessionId) return false;
    const updated = await run(() => planApi.updateSession(activeSessionId, "conducted"), "Couldn't mark the class conducted");
    if (updated) refreshAll();
    return !!updated;
  };

  const undoConducted = async () => {
    if (!activeSessionId) return;
    await run(() => planApi.updateSession(activeSessionId, "planned"), "Couldn't undo");
    refreshAll();
  };

  const cancelSession = async (reason: string) => {
    if (!activeSession) return;
    const day = formatShortDate(parseISODate(activeSession.date));
    const sessionId = activeSession.id;

    const result = await run(async () => {
      await planApi.updateSession(sessionId, "cancelled", reason);
      return planApi.replan(courseId, `Class on ${day} cancelled: ${reason}`);
    }, "Couldn't cancel the class");

    if (!result) {
      reload(); // the cancel may have gone through even if the replan did not
      return;
    }
    setActiveSessionId(null);
    showReplan({ result, subtitle: `We rebuilt the rest of the semester around the cancelled class on ${day}.`, cancelledSessionId: sessionId });
  };

  const undoCancellation = async () => {
    const sessionId = replan?.cancelledSessionId;
    if (!sessionId) return;
    const undone = await run(async () => {
      await planApi.updateSession(sessionId, "planned");
      return planApi.replan(courseId, "Cancellation undone");
    }, "Couldn't undo the cancellation");
    if (!undone) return;
    setReplan(null);
    setView("plan");
    refreshAll();
  };

  const takeAttendance = (sessionId: string) => {
    setActiveSessionId(null);
    router.push({ pathname: "/attendance", params: { sessionId } });
  };

  // ------------------------------------------------------------ planner

  const generate = async () => {
    const result = await run(() => planApi.generate(courseId), "Couldn't generate the plan");
    if (!result) return;
    refreshAll();
    if (result.deficit > 0) {
      Alert.alert(
        `${plural(result.deficit, "class", "classes")} short`,
        `These topics did not fit: ${result.overflow.map((t) => t.title).join(", ")}. Open the catch-up options to fix it.`,
      );
    }
  };

  const rebuild = async () => {
    const result = await run(() => planApi.replan(courseId, "Plan rebuilt by the teacher"), "Couldn't rebuild the plan");
    if (!result) return;
    setNeedsReplan(false);
    showReplan({ result, subtitle: "Taught classes stay as they are. Everything from today onwards was worked out again." });
  };

  const applyDeficit = async (choice: DeficitChoice) => {
    const result = await run(() => planApi.applyDeficit(courseId, choice), "Couldn't apply that option");
    if (!result) return;
    const label = { drop: "dropped the lowest-priority topics", compress: "shortened topics", extend: "added makeup classes" }[choice];
    showReplan({ result, subtitle: `We ${label} and rebuilt the plan.` });
  };

  // ------------------------------------------------------------- topics

  const saveTopic = async (topic: Topic, edit: TopicEdit) => {
    // Send only what changed.
    const changes: Partial<TopicEdit> = {};
    if (edit.sessions_needed !== topic.sessions_needed) changes.sessions_needed = edit.sessions_needed;
    if (edit.min_sessions !== topic.min_sessions) changes.min_sessions = edit.min_sessions;
    if (edit.priority !== topic.priority) changes.priority = edit.priority;
    if (Object.keys(changes).length === 0) return true;

    const updated = await run(() => coursesApi.updateTopic(topic.id, changes), "Couldn't save the topic");
    if (!updated) return false;
    if (updated.replan_required) setNeedsReplan(true);
    reloadCourse();
    return true;
  };

  /**
   * Swap two topics' positions. (course_id, order_no) is unique, so a direct
   * swap would collide: park one on a free number first.
   */
  const swapTopics = async (a: Topic, b: Topic) => {
    const parking = Math.max(...course.topics.map((t) => t.order_no)) + 1;
    const done = await run(async () => {
      await coursesApi.updateTopic(a.id, { order_no: parking });
      await coursesApi.updateTopic(b.id, { order_no: a.order_no });
      await coursesApi.updateTopic(a.id, { order_no: b.order_no });
      return true;
    }, "Couldn't reorder the topics");
    reloadCourse();
    if (done) setNeedsReplan(true);
  };

  // -------------------------------------------------------------- views

  if (view === "replan" && replan) {
    return (
      <PlanUpdatedScreen
        result={replan.result}
        subtitle={replan.subtitle}
        lockedSessions={sessions.filter((s) => s.status === "conducted")}
        busy={busy}
        onBack={() => setView("plan")}
        onAccept={() => {
          setReplan(null);
          setView("plan");
        }}
        onUndo={replan.cancelledSessionId ? undoCancellation : undefined}
        onOpenDeficit={() => setView("deficit")}
      />
    );
  }

  if (view === "deficit") {
    if (!deficit.data) {
      return deficit.error ? <ErrorState message={deficit.error} onRetry={deficit.reload} /> : <LoadingState label="Working out the options..." />;
    }
    return <DeficitScreen options={deficit.data} busy={busy} onBack={() => setView("plan")} onApply={applyDeficit} />;
  }

  if (view === "topics") {
    return (
      <TopicsScreen
        topics={course.topics}
        classesLeft={sessions.filter((s) => s.status === "planned" && s.date >= today).length}
        needsReplan={needsReplan}
        busy={busy}
        onBack={() => setView("plan")}
        onSave={saveTopic}
        onSwap={swapTopics}
        onRebuild={rebuild}
      />
    );
  }

  return (
    <>
      <TeachingPlanScreen
        course={course}
        sessions={sessions}
        holidays={holidays}
        warning={data.warning}
        refreshing={loading}
        generating={busy}
        onRefresh={reload}
        onOpenSession={(id) => {
          setSheetMode("actions");
          setActiveSessionId(id);
        }}
        onOpenDeficit={() => setView("deficit")}
        onOpenTopics={() => setView("topics")}
        onRebuild={rebuild}
        onGenerate={generate}
      />
      <SessionSheet
        key={`${activeSessionId ?? "none"}-${sheetMode}`}
        session={activeSession}
        initialMode={sheetMode}
        lectureNo={activeSession ? lectureNumber(sessions, activeSession.id) : 0}
        course={course}
        busy={busy}
        onClose={() => setActiveSessionId(null)}
        onTakeAttendance={() => activeSession && takeAttendance(activeSession.id)}
        onMarkConducted={markConducted}
        onUndoConducted={undoConducted}
        onCancel={cancelSession}
        onOpenCatchUp={() => {
          setActiveSessionId(null);
          setView("deficit");
        }}
        onAttachMaterial={() => {
          setActiveSessionId(null);
          router.navigate({
            pathname: "/material",
            params: activeSession?.topic_id ? { topicId: activeSession.topic_id } : undefined,
          });
        }}
      />
    </>
  );
}
