/** Students and enrollment — backend/src/routes/courses.ts and students.ts. */

import { http } from "./client";
import type { ExtractedStudentRows, Id, StudentImportResult, StudentRecord, StudentWithAttendance } from "./types";

export const studentsApi = {
  list: (courseId: Id) => http.get<StudentWithAttendance[]>(`/courses/${courseId}/students`),

  /** Across every course of this teacher the student is enrolled in. */
  get: (studentId: Id) => http.get<StudentRecord>(`/students/${studentId}`),

  /** Reads an uploaded class-list photo or PDF. Returns a DRAFT — nothing is saved. */
  extract: (courseId: Id, storagePath: string) =>
    http.post<ExtractedStudentRows>(`/courses/${courseId}/students/extract`, { storage_path: storagePath }),

  /** Only ever post rows the teacher has reviewed and confirmed. */
  import: (courseId: Id, students: { roll_no: string; name: string }[]) =>
    http.post<StudentImportResult>(`/courses/${courseId}/students/import`, { students }),

  /** Removes the enrollment only; the student record is kept. */
  remove: (courseId: Id, studentId: Id) =>
    http.delete<{ removed: number }>(`/courses/${courseId}/students/${studentId}`),
};
