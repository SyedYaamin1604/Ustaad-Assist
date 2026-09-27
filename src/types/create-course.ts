export type WeekDay = "M" | "T" | "W" | "T2" | "F" | "S" | "S2";

export const WEEK_DAYS: { key: WeekDay; label: string }[] = [
  { key: "M", label: "M" },
  { key: "T", label: "T" },
  { key: "W", label: "W" },
  { key: "T2", label: "T" },
  { key: "F", label: "F" },
  { key: "S", label: "S" },
  { key: "S2", label: "S" },
];

export interface Topic {
  id: string;
  title: string;
}

export interface GradingCriterion {
  id: string;
  label: string;
  weight: number;
}

export interface Holiday {
  id: string;
  day: string;
  month: string;
  title: string;
  note: string;
  skipClasses: boolean;
}

export interface SourceCourse {
  id: string;
  badge: string;
  title: string;
  meta: string;
  bg: string;
}

export interface CourseDetails {
  courseName: string;
  semesterTerm: string;
  startDate: string;
  endDate: string;
  classDays: WeekDay[];
  aiCopilotEnabled: boolean;
}

export interface NewCourseFormData {
  details: CourseDetails;
  topics: Topic[];
  gradingCriteria: GradingCriterion[];
  holidays: Holiday[];
}

export interface CloneCourseFormData {
  sourceCourseId: string | null;
  copyOptions: {
    topicsAndPriorities: boolean;
    weightageAndGrading: boolean;
    assessmentStructure: boolean;
  };
  details: {
    startDate: string;
    endDate: string;
    classDays: WeekDay[];
  };
}

export const SOURCE_COURSES: SourceCourse[] = [
  {
    id: "cs301",
    badge: "ARCHIVED SYLLABUS",
    title: "Database Systems CS-301",
    meta: "Fall 2025 · 32 sessions · 60 students",
    bg: "bg-[var(--color-pink)]",
  },
  {
    id: "cs201",
    badge: "SPRING COHORT",
    title: "Data Structures CS-201",
    meta: "Spring 2025 · 30 sessions",
    bg: "bg-[var(--color-yellow)]",
  },
  {
    id: "cs202",
    badge: "PAST TERM",
    title: "Algorithms CS-202",
    meta: "Fall 2024 · 32 sessions",
    bg: "bg-[var(--color-emerald)]",
  },
];