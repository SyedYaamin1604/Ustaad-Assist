/** The planner and sessions — backend/src/routes/plan.ts and sessions.ts. */

import { todayISO } from "@/utils/date";
import { http } from "./client";
import type { DeficitChoice, DeficitOptions, Id, PlanGenerateResult, ReplanResult, Session, SessionStatus } from "./types";

export const planApi = {
  /**
   * Build the whole timetable. The backend refuses once any class has been
   * conducted or cancelled — use `replan` from then on.
   */
  generate: (courseId: Id) => http.post<PlanGenerateResult>(`/courses/${courseId}/plan/generate`, {}),

  /** Freeze the past, rebuild the future. `changes` feeds the "what moved" screen. */
  replan: (courseId: Id, reason: string) =>
    http.post<ReplanResult>(`/courses/${courseId}/plan/replan`, { reason, today: todayISO() }),

  getDeficit: (courseId: Id) =>
    http.get<DeficitOptions>(`/courses/${courseId}/plan/deficit`, { today: todayISO() }),

  /** Applies the choice and replans, so the result is a replan result. */
  applyDeficit: (courseId: Id, option: DeficitChoice) =>
    http.post<ReplanResult>(`/courses/${courseId}/plan/deficit/apply`, { option, today: todayISO() }),

  getSessions: (courseId: Id) =>
    http.get<{ sessions: Session[]; weeks: { week_no: number; sessions: Session[] }[] }>(
      `/courses/${courseId}/sessions`,
    ),

  /** `cancel_reason` is required when cancelling. `planned` undoes either. */
  updateSession: (sessionId: Id, status: SessionStatus, cancelReason?: string) =>
    http.patch<Session>(`/sessions/${sessionId}`, { status, cancel_reason: cancelReason }),
};
