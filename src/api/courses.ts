/** Courses, topics and holidays — backend/src/routes/courses.ts and topics.ts. */

import { http } from "./client";
import type {
  Course,
  CourseDetail,
  CourseListItem,
  DayName,
  ExtractedTopicRows,
  Holiday,
  Id,
  Priority,
  Topic,
  TopicStatus,
} from "./types";

export type CreateCourseInput = {
  name: string;
  code?: string | null;
  semester?: string | null;
  start_date: string;
  end_date: string;
  class_days: DayName[];
};

export type UpdateCourseInput = Partial<CreateCourseInput> & { attendance_threshold?: number };

export type CloneCourseInput = {
  name?: string;
  semester?: string;
  start_date?: string;
  end_date?: string;
};

export type UpdateTopicInput = {
  title?: string;
  sessions_needed?: number;
  min_sessions?: number;
  priority?: Priority;
  status?: TopicStatus;
  order_no?: number;
};

export const coursesApi = {
  list: () => http.get<CourseListItem[]>("/courses"),

  /** The course with its topics and holidays. */
  get: (courseId: Id) => http.get<CourseDetail>(`/courses/${courseId}`),

  /** Public holidays for the date range are preloaded by the server. */
  create: (input: CreateCourseInput) => http.post<Course>("/courses", input),

  /** `replan_required` is true when dates or class days changed. */
  update: (courseId: Id, input: UpdateCourseInput) =>
    http.patch<Course & { replan_required: boolean }>(`/courses/${courseId}`, input),

  /** Copies topics, weightage and grade scale. Class days come from the source. */
  clone: (courseId: Id, input: CloneCourseInput) =>
    http.post<Course & { copied: { topics: number; holidays: number } }>(`/courses/${courseId}/clone`, input),

  /** REPLACES every topic of the course. One topic per line. */
  setTopics: (courseId: Id, raw: string) => http.post<Topic[]>(`/courses/${courseId}/topics`, { raw }),

  updateTopic: (topicId: Id, input: UpdateTopicInput) =>
    http.patch<Topic & { course_id: number; replan_required: boolean }>(`/topics/${topicId}`, input),

  /** Send only the holidays whose tick changed. */
  setHolidays: (courseId: Id, holidays: { id: Id; is_active: boolean }[]) =>
    http.post<Holiday[]>(`/courses/${courseId}/holidays`, { holidays }),

  /** Reads an uploaded outline into topics for review. Saves nothing. */
  importOutline: (courseId: Id, storagePath: string) =>
    http.post<ExtractedTopicRows>(`/courses/${courseId}/outline/import`, { storage_path: storagePath }),
};
