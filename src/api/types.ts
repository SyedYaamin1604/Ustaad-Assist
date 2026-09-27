/**
 * The shapes the backend sends and accepts.
 *
 * Mirrors backend/src/openapi/schemas.ts and requests.ts, checked against what
 * the services actually return. Field names are snake_case on purpose: they
 * match the API exactly, so there is no mapping layer to keep in step.
 *
 * Two conventions from the backend worth remembering:
 *   - Every id is a bigint sent as a STRING ("8"). Treat ids as opaque.
 *     A few planner outputs (PlannedSession, SessionChange, ...) use numbers.
 *   - Every date is a plain "YYYY-MM-DD" string, never a timestamp.
 */

export type Id = string;
export type DateString = string;

export type DayName = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type Priority = "low" | "normal" | "high";
export type TopicStatus = "pending" | "in_progress" | "completed" | "dropped";
export type SessionStatus = "planned" | "conducted" | "cancelled";
export type SessionKind = "regular" | "makeup" | "revision";
export type AttendanceStatus = "present" | "absent" | "leave";
export type ComponentType = "quiz" | "assignment" | "midterm" | "final" | "participation";
export type ReportType = "result" | "attendance" | "course";
export type DeficitChoice = "drop" | "compress" | "extend";

// ---------------------------------------------------------------- entities

export interface Teacher {
  id: string;
  email: string;
  full_name: string | null;
  department: string | null;
  created_at: string;
}

export interface Course {
  id: Id;
  name: string;
  code: string | null;
  semester: string | null;
  start_date: DateString;
  end_date: DateString;
  class_days: DayName[];
  attendance_threshold: number;
}

export interface CourseListItem extends Course {
  created_at: string;
  topic_count: number;
  student_count: number;
  session_count: number;
  conducted_count: number;
  has_plan: boolean;
}

export interface Topic {
  id: Id;
  order_no: number;
  title: string;
  sessions_needed: number;
  min_sessions: number;
  priority: Priority;
  status: TopicStatus;
}

export interface Holiday {
  id: Id;
  date: DateString;
  name: string | null;
  is_active: boolean;
  source: "preloaded" | "custom";
}

export interface CourseDetail extends Course {
  topics: Topic[];
  holidays: Holiday[];
}

export interface Session {
  id: Id;
  date: DateString;
  week_no: number;
  topic_id: Id | null;
  topic_title: string | null;
  part_no: number | null;
  total_parts: number | null;
  status: SessionStatus;
  kind: SessionKind;
  cancel_reason: string | null;
}

export interface Student {
  id: Id;
  roll_no: string;
  name: string;
}

export interface StudentWithAttendance extends Student {
  present: number;
  absent: number;
  attendance_percentage: number | null;
  below_threshold: boolean;
}

export interface Assessment {
  id: Id;
  type: ComponentType;
  title: string;
  date: DateString | null;
  total_marks: number;
  original_date: DateString | null;
  move_reason: string | null;
}

export interface AssessmentListItem extends Assessment {
  marks_entered: number;
  student_count: number;
  topic_ids: number[];
}

export interface Mark {
  student_id: Id;
  roll_no: string;
  name: string;
  /** null means not entered yet. It is NOT a zero. */
  obtained: number | null;
  /** The student did not sit it. This IS a zero. */
  is_absent: boolean;
}

export interface GradeBand {
  grade: string;
  min_percentage: number;
}

export interface Material {
  id: Id;
  topic_id: Id | null;
  topic_title: string | null;
  title: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_at: string;
}

export interface MaterialFolder {
  topic_title: string;
  topic_id: Id | null;
  count: number;
  materials: Material[];
}

// ----------------------------------------------------------- planner output

export interface PlannedSession {
  date: DateString;
  week_no: number;
  topic_id: number;
  part_no: number | null;
  total_parts: number | null;
}

export interface PlannerTopic {
  id: number;
  order_no: number;
  title: string;
  sessions_needed: number;
  min_sessions: number;
  priority: Priority;
}

export interface AssessmentMove {
  assessment_id: number;
  from: DateString;
  to: DateString;
  /** A finished sentence. Show it as-is. */
  reason: string;
}

/** `moved` has both dates, `added` only `to`, `removed` only `from`. */
export interface SessionChange {
  kind: "moved" | "added" | "removed";
  topic_id: number;
  topic: string;
  from?: DateString;
  to?: DateString;
}

export interface PlanGenerateResult {
  sessions: PlannedSession[];
  overflow: PlannerTopic[];
  assessments_moved: AssessmentMove[];
  slots_total: number;
  slots_unused: number;
  deficit: number;
}

export interface ReplanResult {
  frozen: number;
  sessions: PlannedSession[];
  changes: SessionChange[];
  assessments_moved: AssessmentMove[];
  overflow: PlannerTopic[];
  slots_available: number;
  deficit: number;
}

export interface DeficitOptions {
  deficit: number;
  drop: {
    type: "drop";
    sessions_recovered: number;
    covers_deficit: boolean;
    topics: { topic_id: number; title: string; sessions_freed: number }[];
  };
  compress: {
    type: "compress";
    sessions_recovered: number;
    covers_deficit: boolean;
    topics: { topic_id: number; title: string; from: number; to: number }[];
  };
  extend: {
    type: "extend";
    sessions_recovered: number;
    covers_deficit: boolean;
    dates: DateString[];
  };
  slots_available: number;
  sessions_needed: number;
}

export interface ScheduleHealth {
  planned_up_to_today: number;
  conducted: number;
  cancelled: number;
  behind_by_weeks: number;
  syllabus_percent: number;
  total_sessions: number;
}

// ------------------------------------------------------------ attendance

export interface SessionAttendanceRow {
  student_id: Id;
  roll_no: string;
  name: string;
  status: AttendanceStatus;
  /** False means nothing was saved yet and `status` is the present default. */
  recorded: boolean;
}

export interface AttendanceSubmitResult {
  session_id: number;
  marked: number;
  present: number;
  absent: number;
  leave: number;
}

export interface AttendanceSummary {
  attendance_threshold: number;
  classes_held: number;
  class_average: number | null;
  students: {
    student_id: Id;
    roll_no: string;
    name: string;
    present: number;
    absent: number;
    leave: number;
    classes_held: number;
    percentage: number | null;
  }[];
  below_threshold: { student_id: Id; roll_no: string; name: string; percentage: number | null }[];
}

// -------------------------------------------------------------- students

export interface StudentRecord extends Student {
  attendance: {
    course_id: Id;
    course_name: string;
    date: DateString;
    topic_title: string | null;
    status: AttendanceStatus;
  }[];
  marks: {
    course_id: Id;
    course_name: string;
    assessment_id: Id;
    type: ComponentType;
    title: string;
    total_marks: number;
    obtained: number | null;
    is_absent: boolean;
  }[];
}

/** A draft read off a photo or PDF. Nothing is saved until /students/import. */
export interface ExtractedStudentRows {
  rows: { roll_no: string | null; name: string | null; confidence: number }[];
  page_count: number;
  source: string;
  saved: false;
  next_step: string;
}

export interface ExtractedTopicRows {
  rows: { title: string; sessions_needed: number | null; confidence: number }[];
  page_count: number;
  source: string;
  saved: false;
  next_step: string;
}

export interface StudentImportResult {
  students: Student[];
  saved: number;
  newly_enrolled: number;
}

// ------------------------------------------------------------- grading

export interface MarksSheet {
  assessment: {
    id: Id;
    type: ComponentType;
    title: string;
    date: DateString | null;
    total_marks: number;
  };
  marks: Mark[];
}

export interface MarkInput {
  student_id: Id;
  /** Omit or send null to clear the mark back to "not entered". */
  obtained?: number | null;
  is_absent?: boolean;
}

export interface ComponentResult {
  component: ComponentType;
  weight: number;
  obtained: number;
  out_of: number;
  percentage: number | null;
  contribution: number;
  missing: { assessment_id: number; title: string }[];
}

export interface StudentResult {
  student_id: number;
  roll_no: string;
  name: string;
  components: ComponentResult[];
  weighted_total: number;
  grade: string;
  /** True means the total is provisional. Show it as such. */
  has_missing_marks: boolean;
  missing_count: number;
}

export interface ResultSummary {
  student_count: number;
  class_average: number | null;
  highest: number | null;
  lowest: number | null;
  grade_distribution: Record<string, number>;
  pass_count: number;
  fail_count: number;
  students_with_missing_marks: number;
}

export interface ResultSet {
  students: StudentResult[];
  summary: ResultSummary;
  weightage: Record<string, number>;
  grade_scale: GradeBand[];
}

export type Weightage = Record<ComponentType, number> & {
  /** Convenience total for the screen. Not a component. */
  total: number;
};

// ------------------------------------------------------ dashboard & reports

export interface Dashboard {
  course: Course;
  today: DateString;
  schedule: ScheduleHealth & {
    /** A finished sentence, or null when on schedule. */
    warning: string | null;
  };
  topics: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    dropped: number;
  };
  next_session: Pick<Session, "id" | "date" | "week_no" | "topic_title" | "part_no" | "total_parts"> | null;
  attendance: {
    classes_held: number;
    class_average: number | null;
    student_count: number;
    below_threshold_count: number;
    below_threshold: { student_id: Id; roll_no: string; name: string; percentage: number | null }[];
  };
  assessments: {
    upcoming: Assessment[];
    marks_outstanding: { id: Id; type: ComponentType; title: string; expected: number; entered: number }[];
  };
  results: Omit<ResultSummary, "student_count"> | null;
  last_replan: { triggered_at: string; reason: string } | null;
}

export interface ReportDocument {
  type: ReportType;
  title: string;
  header: {
    course_name: string;
    course_code: string | null;
    semester: string | null;
    teacher_name: string | null;
    department: string | null;
    generated_on: DateString;
    signature_label: string;
  };
  columns: string[];
  rows: (string | number | null)[][];
  summary: { label: string; value: string | number }[];
  notes: string[];
}
