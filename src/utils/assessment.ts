import type { AssessmentListItem, Session } from "@/api/types";
import { todayISO } from "@/utils/date";

/**
 * Where an assessment stands, worked out from what the list endpoint returns.
 * The backend has no status column; these follow directly from its fields.
 */
export type AssessmentStatus =
  | "unscheduled" //  no date yet
  | "scheduled" //    date still ahead
  | "needs-marks" //  date has passed, some marks still missing
  | "graded"; //      every enrolled student has a mark (or is marked absent)

export function assessmentStatus(item: AssessmentListItem, today = todayISO()): AssessmentStatus {
  if (item.student_count > 0 && item.marks_entered >= item.student_count) return "graded";
  if (!item.date) return "unscheduled";
  if (item.date <= today && item.student_count > 0) return "needs-marks";
  return "scheduled";
}

export const STATUS_LABEL: Record<AssessmentStatus, string> = {
  unscheduled: "Not scheduled",
  scheduled: "Scheduled",
  "needs-marks": "Marks not entered",
  graded: "Graded",
};

/**
 * The planner will not let an assessment fall before its topics are taught
 * (backend §3.3). This finds that problem up front, in the create sheet, using
 * the current timetable:
 *
 *   returns null        — the date is fine
 *   returns a suggestion — the last class of those topics, and the first class after it
 */
export function assessmentDateCheck(
  date: string,
  topicIds: string[],
  sessions: Session[],
): { lastTaught: string; suggested: string } | null {
  if (topicIds.length === 0) return null;

  const live = sessions.filter((s) => s.status !== "cancelled");
  const taughtDates = live.filter((s) => s.topic_id && topicIds.includes(s.topic_id)).map((s) => s.date);
  if (taughtDates.length === 0) return null;

  const lastTaught = taughtDates.sort()[taughtDates.length - 1];
  if (date > lastTaught) return null;

  const next = live.find((s) => s.date > lastTaught);
  return { lastTaught, suggested: next?.date ?? lastTaught };
}
