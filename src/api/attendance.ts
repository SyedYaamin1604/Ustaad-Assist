/** Attendance — POST/GET /sessions/:id/attendance and the course summary. */

import { http } from "./client";
import type { AttendanceSubmitResult, AttendanceSummary, Id, SessionAttendanceRow } from "./types";

export const attendanceApi = {
  /** Every enrolled student, defaulting to present where nothing is recorded. */
  getForSession: (sessionId: Id) => http.get<SessionAttendanceRow[]>(`/sessions/${sessionId}/attendance`),

  /**
   * Send ONLY the absentees and students on leave; everyone else is marked
   * present. Submitting again overwrites. Also marks the class conducted.
   */
  submit: (sessionId: Id, absent: Id[], leave: Id[]) =>
    http.post<AttendanceSubmitResult>(`/sessions/${sessionId}/attendance`, { absent, leave }),

  summary: (courseId: Id) => http.get<AttendanceSummary>(`/courses/${courseId}/attendance/summary`),
};
