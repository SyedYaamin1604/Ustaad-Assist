/** The signed-in teacher, the dashboard and reports. */

import { todayISO } from "@/utils/date";
import { http } from "./client";
import type { Dashboard, Id, ReportDocument, ReportType, Teacher } from "./types";

export const authApi = {
  /** Creates the teacher row on the first call. Call straight after sign-in. */
  me: () => http.get<Teacher>("/auth/me"),
};

export const dashboardApi = {
  /** Every number the course home screen shows, in one request. */
  get: (courseId: Id) => http.get<Dashboard>(`/courses/${courseId}/dashboard`, { today: todayISO() }),
};

export const reportsApi = {
  /** The finished report as data. The server's .pdf form is not available yet (503). */
  get: (courseId: Id, type: ReportType) =>
    http.get<ReportDocument>(`/courses/${courseId}/reports/${type}`, { today: todayISO() }),
};
