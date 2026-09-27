/**
 * The whole backend, one import away:
 *
 *   import { coursesApi, planApi } from "@/api";
 *
 * Each module maps one-to-one onto a group of backend routes.
 */

export { ApiError } from "./client";
export { attendanceApi } from "./attendance";
export { assessmentsApi } from "./assessments";
export { coursesApi } from "./courses";
export { authApi, dashboardApi, reportsApi } from "./dashboard";
export { materialsApi } from "./materials";
export { planApi } from "./plan";
export { studentsApi } from "./students";
export type * from "./types";
