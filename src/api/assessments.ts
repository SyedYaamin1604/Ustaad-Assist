/** Assessments, marks and grading — backend/src/routes/courses.ts and assessments.ts. */

import { http } from "./client";
import type {
  Assessment,
  AssessmentListItem,
  ComponentType,
  GradeBand,
  Id,
  MarkInput,
  MarksSheet,
  ResultSet,
  Weightage,
} from "./types";

export type CreateAssessmentInput = {
  type: ComponentType;
  title: string;
  total_marks: number;
  date?: string | null;
  /** The topics it covers, so the planner never schedules it before they are taught. */
  topic_ids?: Id[];
};

export const assessmentsApi = {
  list: (courseId: Id) => http.get<AssessmentListItem[]>(`/courses/${courseId}/assessments`),

  create: (courseId: Id, input: CreateAssessmentInput) =>
    http.post<Assessment>(`/courses/${courseId}/assessments`, input),

  /** Every enrolled student in roll-number order, with or without a mark. */
  getMarks: (assessmentId: Id) => http.get<MarksSheet>(`/assessments/${assessmentId}/marks`),

  /** Send what has been entered; sending again overwrites. */
  saveMarks: (assessmentId: Id, marks: MarkInput[]) =>
    http.post<{ saved: number; ignored: number }>(`/assessments/${assessmentId}/marks`, { marks }),

  /** The same computation that produces the result PDF. */
  results: (courseId: Id) => http.get<ResultSet>(`/courses/${courseId}/results`),

  getWeightage: (courseId: Id) => http.get<Weightage>(`/courses/${courseId}/weightage`),

  /** Must total 100. Anything left out counts as 0. */
  setWeightage: (courseId: Id, weights: Record<ComponentType, number>) =>
    http.put<Weightage>(`/courses/${courseId}/weightage`, weights),

  getGradeScale: (courseId: Id) => http.get<GradeBand[]>(`/courses/${courseId}/grade-scale`),

  /** Replaces the whole scale. The lowest band must start at 0. */
  setGradeScale: (courseId: Id, bands: GradeBand[]) =>
    http.put<GradeBand[]>(`/courses/${courseId}/grade-scale`, { bands }),
};
