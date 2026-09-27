import type { Session } from "@/api/types";
import { addDays, parseISODate, shortMonth, todayISO } from "@/utils/date";

/** A session as the plan screens draw it: the API row plus the assessment falling on that day. */
export type PlanSession = Session & { assessment_title?: string };

/** Mark each class with the assessment (if any) that falls on the same date. */
export function attachAssessments(
  sessions: Session[],
  assessments: { title: string; date: string | null }[],
): PlanSession[] {
  const byDate = new Map<string, string>();
  for (const a of assessments) {
    if (!a.date) continue;
    byDate.set(a.date, byDate.has(a.date) ? `${byDate.get(a.date)}, ${a.title}` : a.title);
  }
  return sessions.map((s) => (byDate.has(s.date) ? { ...s, assessment_title: byDate.get(s.date) } : s));
}

// topic_title is null for makeup and revision classes
export function sessionTitle(session: Pick<Session, "topic_title" | "kind">): string {
  if (session.topic_title) return session.topic_title;
  return session.kind === "revision" ? "Revision class" : "Makeup class";
}

export function partLabel(session: Pick<Session, "part_no" | "total_parts">): string | null {
  if (session.part_no == null || session.total_parts == null || session.total_parts <= 1) return null;
  return `Part ${session.part_no} of ${session.total_parts}`;
}

// Lecture numbers skip cancelled classes. Expects sessions sorted by date.
export function lectureNumber(sessions: Session[], id: string): number {
  const taught = sessions.filter((s) => s.status !== "cancelled");
  return taught.findIndex((s) => s.id === id) + 1;
}

/** The next class still to be taught, today included. */
export function nextSession<T extends Session>(sessions: T[], todayIso: string = todayISO()): T | undefined {
  return sessions.find((s) => s.status === "planned" && s.date >= todayIso);
}

export interface WeekGroup<T extends Session = Session> {
  weekNo: number;
  rangeLabel: string;
  sessions: T[];
}

export function groupByWeek<T extends Session>(sessions: T[]): WeekGroup<T>[] {
  const groups: WeekGroup<T>[] = [];
  for (const session of sessions) {
    const last = groups[groups.length - 1];
    if (last && last.weekNo === session.week_no) {
      last.sessions.push(session);
    } else {
      groups.push({ weekNo: session.week_no, rangeLabel: weekRangeLabel(session.date), sessions: [session] });
    }
  }
  return groups;
}

// Teaching week runs Mon–Sat: "21 Sep – 26 Sep"
function weekRangeLabel(iso: string): string {
  const date = parseISODate(iso);
  const monday = addDays(date, -((date.getDay() + 6) % 7));
  const saturday = addDays(monday, 5);
  const fmt = (d: Date) => `${d.getDate().toString().padStart(2, "0")} ${shortMonth(d)}`;
  return `${fmt(monday)} – ${fmt(saturday)}`;
}
