// Field names mirror the API responses (see UstaadAssist-Frontend-Screens, section C)
// so the mocks can be swapped for real data without reshaping.

export type SessionStatus = "scheduled" | "conducted" | "cancelled";

export type SessionKind = "regular" | "makeup" | "revision";

export type TopicPriority = "low" | "normal" | "high";

export type TopicStatus = "pending" | "in_progress" | "done";

export type DeficitType = "drop" | "compress" | "extend";

export interface CourseSummary {
  id: string;
  code: string;
  name: string;
  semester: string;
  timeLabel: string;
  room: string;
  classSize: number;
}

// GET /courses/:id/sessions
export interface PlanSession {
  id: string;
  date: string; // YYYY-MM-DD
  week_no: number;
  topic_id: string | null; // null for makeup and revision classes
  topic_title: string | null;
  part_no: number | null;
  total_parts: number | null;
  status: SessionStatus;
  kind: SessionKind;
  cancel_reason: string | null;
  // Display extras shown in the design but not yet in the API contract
  description?: string;
  slides_count?: number;
  assessment_title?: string;
  attended?: number;
}

// PATCH /topics/:id
export interface PlanTopic {
  id: string;
  order_no: number;
  title: string;
  sessions_needed: number;
  min_sessions: number;
  priority: TopicPriority;
  status: TopicStatus;
}

// POST /courses/:id/plan/replan — `reason` is written by the server and shown as-is
export interface PlanChange {
  id: string;
  label: string;
  title: string;
  from_date: string;
  to_date: string;
  reason: string;
}

export interface ReplanResult {
  sessions: PlanChange[];
  assessments: PlanChange[];
}

// GET /courses/:id/plan/deficit
export interface DeficitOption {
  type: DeficitType;
  title: string;
  description: string;
  sessions_recovered: number;
  affects: string[];
  highlight: string;
  coverage_percent: number;
  recommended?: boolean;
}

export interface DeficitSummary {
  available: number;
  needed: number;
  done: number;
  reason: string;
  options: DeficitOption[];
}

export const MOCK_COURSE: CourseSummary = {
  id: "cs-301",
  code: "CS-301",
  name: "Database Systems",
  semester: "Semester 5",
  timeLabel: "10:00 – 11:30 AM",
  room: "Lab 2",
  classSize: 34,
};

export const MOCK_BEHIND_BY_WEEKS = 1;

export const MOCK_HOLIDAYS = ["2026-09-09"];

function session(
  id: string,
  date: string,
  week_no: number,
  topic: { id: string; title: string } | null,
  part: [number, number] | null,
  status: SessionStatus,
  extra: Partial<PlanSession> = {}
): PlanSession {
  return {
    id,
    date,
    week_no,
    topic_id: topic?.id ?? null,
    topic_title: topic?.title ?? null,
    part_no: part?.[0] ?? null,
    total_parts: part?.[1] ?? null,
    status,
    kind: "regular",
    cancel_reason: null,
    ...extra,
  };
}

const T = {
  er: { id: "t1", title: "ER Modeling Fundamentals" },
  relModel: { id: "t2", title: "Relational Model" },
  algebra: { id: "t3", title: "Relational Algebra Operators" },
  sqlBasics: { id: "t4", title: "SQL Basics" },
  joins: { id: "t5", title: "SQL Joins" },
  aggregation: { id: "t6", title: "SQL Aggregation & Group By" },
  normalization: { id: "t7", title: "Database Normalization: 1NF to 3NF" },
  indexing: { id: "t8", title: "Indexing & B-Trees" },
  transactions: { id: "t9", title: "Transactions & Concurrency" },
  advTransactions: { id: "t10", title: "Advanced Transactions" },
};

export const MOCK_SESSIONS: PlanSession[] = [
  session("s1", "2026-09-01", 1, T.er, [1, 1], "conducted", { description: "Entities, attributes and relationships", attended: 33 }),
  session("s2", "2026-09-04", 1, T.relModel, [1, 1], "conducted", { description: "Relations, keys and integrity constraints", attended: 31 }),
  session("s3", "2026-09-08", 2, T.algebra, [1, 2], "conducted", { description: "Select, Project, Cartesian Product", attended: 32 }),
  session("s4", "2026-09-11", 2, T.algebra, [2, 2], "conducted", { description: "Joins, Union, Difference, Division", attended: 30 }),
  session("s5", "2026-09-15", 3, T.sqlBasics, [1, 1], "conducted", { description: "SELECT, WHERE, ORDER BY", attended: 32 }),
  session("s6", "2026-09-18", 3, T.joins, [1, 3], "cancelled", { cancel_reason: "Campus holiday (mid-term prep)" }),
  session("s7", "2026-09-22", 4, T.joins, [1, 3], "conducted", { description: "Inner, Left, Right & Full Outer Joins", slides_count: 2, attended: 32 }),
  session("s8", "2026-09-25", 4, T.joins, [2, 3], "conducted", { description: "Multi-table joins and self joins", assessment_title: "Quiz 2", attended: 29 }),
  session("s9", "2026-09-29", 5, T.joins, [3, 3], "scheduled", { description: "Subqueries vs joins", slides_count: 2 }),
  session("s10", "2026-10-02", 5, T.aggregation, [1, 2], "scheduled", { description: "HAVING clause vs WHERE filtering", assessment_title: "Quiz 3" }),
  session("s11", "2026-10-06", 6, T.aggregation, [2, 2], "scheduled", { description: "Window functions primer" }),
  session("s12", "2026-10-09", 6, T.normalization, [1, 2], "scheduled", { description: "Functional dependencies and anomalies" }),
  session("s13", "2026-10-13", 7, T.normalization, [2, 2], "scheduled", { description: "2NF, 3NF and BCNF" }),
  session("s14", "2026-10-16", 7, T.indexing, [1, 2], "scheduled", { description: "Index types and when to use them" }),
  session("s15", "2026-10-20", 8, T.indexing, [2, 2], "scheduled", { description: "B-Tree and B+ Tree structure" }),
  session("s16", "2026-10-23", 8, T.transactions, [1, 2], "scheduled", { description: "ACID properties" }),
  session("s17", "2026-10-27", 9, T.transactions, [2, 2], "scheduled", { description: "Locks and isolation levels" }),
  session("s18", "2026-10-30", 9, T.advTransactions, [1, 1], "scheduled", { description: "Recovery and logging" }),
  session("s19", "2026-11-03", 10, null, null, "scheduled", { kind: "revision", description: "Mid-course recap before the midterm" }),
];

export const MOCK_TOPICS: PlanTopic[] = [
  { id: "t1", order_no: 1, title: T.er.title, sessions_needed: 1, min_sessions: 1, priority: "high", status: "done" },
  { id: "t2", order_no: 2, title: T.relModel.title, sessions_needed: 1, min_sessions: 1, priority: "high", status: "done" },
  { id: "t3", order_no: 3, title: T.algebra.title, sessions_needed: 2, min_sessions: 1, priority: "normal", status: "done" },
  { id: "t4", order_no: 4, title: T.sqlBasics.title, sessions_needed: 1, min_sessions: 1, priority: "high", status: "done" },
  { id: "t5", order_no: 5, title: T.joins.title, sessions_needed: 3, min_sessions: 2, priority: "high", status: "in_progress" },
  { id: "t6", order_no: 6, title: T.aggregation.title, sessions_needed: 2, min_sessions: 1, priority: "normal", status: "pending" },
  { id: "t7", order_no: 7, title: T.normalization.title, sessions_needed: 2, min_sessions: 1, priority: "high", status: "pending" },
  { id: "t8", order_no: 8, title: T.indexing.title, sessions_needed: 2, min_sessions: 1, priority: "low", status: "pending" },
  { id: "t9", order_no: 9, title: T.transactions.title, sessions_needed: 2, min_sessions: 2, priority: "normal", status: "pending" },
  { id: "t10", order_no: 10, title: T.advTransactions.title, sessions_needed: 1, min_sessions: 1, priority: "low", status: "pending" },
];

export const MOCK_REPLAN: ReplanResult = {
  sessions: [
    {
      id: "c1",
      label: "Topic 5 · Part 1 of 3",
      title: "SQL Joins",
      from_date: "2026-09-18",
      to_date: "2026-09-22",
      reason: "Moved because the class on Fri 18 Sep was cancelled for a campus holiday.",
    },
    {
      id: "c2",
      label: "Topic 6 · Part 1 of 2",
      title: "SQL Aggregation & Group By",
      from_date: "2026-09-29",
      to_date: "2026-10-02",
      reason: "Sequenced after SQL Joins, which now needs one more class to finish.",
    },
  ],
  assessments: [
    {
      id: "a1",
      label: "Quiz 3",
      title: "Quiz 3",
      from_date: "2026-09-18",
      to_date: "2026-09-25",
      reason: "Quiz 3 moved from 18 Sep to 25 Sep because Normalization will not be finished before 24 Sep.",
    },
  ],
};

export const MOCK_DEFICIT: DeficitSummary = {
  available: 29,
  needed: 32,
  done: 7,
  reason: "Due to 2 campus holidays and 1 cancelled lecture, the remaining topics need 32 classes but only 29 are left.",
  options: [
    {
      type: "drop",
      title: "Drop topics",
      description: "Remove 2 low-priority topics to finish on time.",
      sessions_recovered: 3,
      affects: ["Indexing & B-Trees (2 classes)", "Advanced Transactions (1 class)"],
      highlight: "Keeps existing dates",
      coverage_percent: 91,
    },
    {
      type: "compress",
      title: "Compress topics",
      description: "Teach some topics in fewer classes, down to their minimum.",
      sessions_recovered: 3,
      affects: [
        "SQL Aggregation & Group By: 2 classes → 1 class",
        "Normalization: 2 classes → 1 class",
        "Indexing & B-Trees: 2 classes → 1 class",
      ],
      highlight: "No weekend classes",
      coverage_percent: 100,
      recommended: true,
    },
    {
      type: "extend",
      title: "Add extra classes",
      description: "Schedule 3 makeup classes on free Saturdays.",
      sessions_recovered: 3,
      affects: ["Sat 3 Oct", "Sat 17 Oct", "Sat 7 Nov"],
      highlight: "Keeps the full syllabus",
      coverage_percent: 100,
    },
  ],
};
