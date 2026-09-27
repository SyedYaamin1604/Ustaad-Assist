import type { DayName } from "@/api/types";

/** What step 1 of the new-course flow collects — exactly the backend's minimum. */
export interface CourseDetailsForm {
  name: string;
  code: string;
  semester: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  classDays: DayName[];
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** The same checks the backend makes, so the teacher sees them before the request. */
export function validateCourseDetails(form: Pick<CourseDetailsForm, "startDate" | "endDate" | "classDays"> & { name?: string }): string | null {
  if (form.name !== undefined && form.name.trim() === "") return "Enter the course name.";
  if (!DATE_PATTERN.test(form.startDate) || !DATE_PATTERN.test(form.endDate)) return "Pick a start and end date.";
  if (form.endDate <= form.startDate) return "The end date must be after the start date.";
  if (form.classDays.length === 0) return "Pick at least one class day.";
  return null;
}
