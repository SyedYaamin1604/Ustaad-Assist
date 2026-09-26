import { useState } from "react";
import { Alert } from "react-native";
import { DeficitScreen } from "@/components/plan/DeficitScreen";
import { PlanUpdatedScreen } from "@/components/plan/PlanUpdatedScreen";
import { SessionSheet } from "@/components/plan/SessionSheet";
import { TeachingPlanScreen } from "@/components/plan/TeachingPlanScreen";
import { TopicsScreen } from "@/components/plan/TopicsScreen";
import {
  DeficitType,
  MOCK_BEHIND_BY_WEEKS,
  MOCK_COURSE,
  MOCK_DEFICIT,
  MOCK_HOLIDAYS,
  MOCK_REPLAN,
  MOCK_SESSIONS,
  MOCK_TOPICS,
  PlanSession,
} from "@/types/plan";
import { toISODate } from "@/utils/date";
import { lectureNumber } from "@/utils/plan";

type PlanView = "plan" | "replan" | "deficit" | "topics";

const Plan = () => {
  const [view, setView] = useState<PlanView>("plan");
  const [sessions, setSessions] = useState<PlanSession[]>(MOCK_SESSIONS);
  const [topics, setTopics] = useState(MOCK_TOPICS);
  const [behindByWeeks, setBehindByWeeks] = useState(MOCK_BEHIND_BY_WEEKS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  // Sessions as they were before a cancellation, so "Undo changes" can restore them
  const [preReplanSessions, setPreReplanSessions] = useState<PlanSession[] | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const updateSession = (id: string, patch: Partial<PlanSession>) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  // TODO: PATCH /sessions/:id, then POST /courses/:id/plan/replan and re-fetch sessions —
  // cancelling rebuilds the whole future plan.
  const handleCancel = (reason: string) => {
    if (!activeSessionId) return;
    setPreReplanSessions(sessions);
    updateSession(activeSessionId, { status: "cancelled", cancel_reason: reason });
    setActiveSessionId(null);
    setView("replan");
  };

  const handleApplyDeficit = (type: DeficitType) => {
    // TODO: POST /courses/:id/plan/deficit/apply, then re-fetch the plan
    const option = MOCK_DEFICIT.options.find((o) => o.type === type);
    setBehindByWeeks(0);
    setView("plan");
    Alert.alert("Plan regenerated", `Applied "${option?.title}". You can pick a different option any time from the plan menu.`);
  };

  if (view === "replan") {
    return (
      <PlanUpdatedScreen
        result={MOCK_REPLAN}
        lockedSessions={sessions.filter((s) => s.status === "conducted" && s.date < toISODate(new Date()))}
        onBack={() => setView("plan")}
        onAccept={() => {
          setPreReplanSessions(null);
          setView("plan");
        }}
        onUndo={() => {
          if (preReplanSessions) setSessions(preReplanSessions);
          setPreReplanSessions(null);
          setView("plan");
        }}
      />
    );
  }

  if (view === "deficit") {
    return <DeficitScreen summary={MOCK_DEFICIT} onBack={() => setView("plan")} onApply={handleApplyDeficit} />;
  }

  if (view === "topics") {
    return (
      <TopicsScreen
        topics={topics}
        availableSessions={sessions.filter((s) => s.status === "scheduled").length}
        onBack={() => setView("plan")}
        onChange={setTopics}
      />
    );
  }

  return (
    <>
      <TeachingPlanScreen
        course={MOCK_COURSE}
        sessions={sessions}
        holidays={MOCK_HOLIDAYS}
        behindByWeeks={behindByWeeks}
        onOpenSession={setActiveSessionId}
        onOpenDeficit={() => setView("deficit")}
        onOpenTopics={() => setView("topics")}
      />
      <SessionSheet
        key={activeSessionId ?? "none"}
        session={activeSession}
        lectureNo={activeSession ? lectureNumber(sessions, activeSession.id) : 0}
        course={MOCK_COURSE}
        onClose={() => setActiveSessionId(null)}
        onMarkConducted={() => activeSessionId && updateSession(activeSessionId, { status: "conducted" })}
        onUndoConducted={() => activeSessionId && updateSession(activeSessionId, { status: "scheduled" })}
        onCancel={handleCancel}
      />
    </>
  );
};

export default Plan;
