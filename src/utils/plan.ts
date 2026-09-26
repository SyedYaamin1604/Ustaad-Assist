import { PlanSession } from "@/types/plan";
import { addDays, parseISODate, shortMonth, toISODate } from "@/utils/date";

// topic_title is null for makeup and revision classes
export function sessionTitle(session: PlanSession): string {
  if (session.topic_title) return session.topic_title;
  return session.kind === "revision" ? "Revision class" : "Makeup class";
}

export function partLabel(session: PlanSession): string | null {
  if (session.part_no == null || session.total_parts == null) return null;
  return `Part ${session.part_no} of ${session.total_parts}`;
}

// Lecture numbers skip cancelled classes. Expects sessions sorted by date.
export function lectureNumber(sessions: PlanSession[], id: string): number {
  const taught = sessions.filter((s) => s.status !== "cancelled");
  return taught.findIndex((s) => s.id === id) + 1;
}

export function nextSession(sessions: PlanSession[], today: Date = new Date()): PlanSession | undefined {
  const todayIso = toISODate(today);
  return sessions.find((s) => s.status === "scheduled" && s.date >= todayIso);
}

export interface WeekGroup {
  weekNo: number;
  rangeLabel: string;
  sessions: PlanSession[];
}

export function groupByWeek(sessions: PlanSession[]): WeekGroup[] {
  const groups: WeekGroup[] = [];
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
