import type { AttendanceStatus } from "@/api/types";

export type { AttendanceStatus };

export type AttendanceView = "mark" | "summary";

/** One student on the marking screen. */
export interface MarkEntry {
  student_id: string;
  roll_no: string;
  name: string;
  status: AttendanceStatus;
}

/** One student on the summary screen, with the backend's percentage. */
export interface SummaryEntry {
  student_id: string;
  roll_no: string;
  name: string;
  /** null before any class has been held. */
  percentage: number | null;
  present: number;
  /** Classes that count: present + absent (leave is excused). */
  counted: number;
}

export interface LectureInfo {
  label: string; // "Lecture 7 · Tue 22 Sep"
  topic: string; // "SQL Joins (Part 2 of 3)"
}
