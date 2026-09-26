export type AssessmentTypeOption = "Quiz" | "Assignment" | "Midterm" | "Final" | "Participation";

export type AssessmentStatus = "scheduled" | "marks-not-entered" | "graded" | "draft";

export type CardColor = "yellow" | "blue" | "white";

export interface AssessmentItem {
  id: string;
  type: AssessmentTypeOption;
  title: string;
  status: AssessmentStatus;
  statusLabel: string;
  dateLabel: string;
  marksLabel: string;
  topics?: string[];
  color: CardColor;
  classAverageLabel?: string;
  progressLabel?: string;
  metaLabel?: string;
  editable?: boolean;
}

export interface StudentMark {
  id: string;
  name: string;
  roll: string;
  initials: string;
  avgPercent: number;
  score: number | null;
  aboveAvg: boolean;
}

export type GradeTag = "success" | "neutral" | "warning" | "danger";

export interface GradeRow {
  id: string;
  name: string;
  rollLabel: string;
  percent: number;
  grade: string;
  tagLabel: string;
  tagTone: GradeTag;
  marksEntered: boolean;
}

export interface WeightageItem {
  label: string;
  value: string;
}

export interface AssessmentDraft {
  id?: string;
  type: AssessmentTypeOption;
  title: string;
  marks: number;
  topics: string[];
  scheduledDate: Date;
}

export const MOCK_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "quiz-2",
    type: "Quiz",
    title: "Quiz 2: SQL Joins & Subqueries",
    status: "scheduled",
    statusLabel: "Scheduled",
    dateLabel: "Fri 25 Sep · 10:15 AM",
    marksLabel: "15 marks",
    topics: ["SQL Joins", "Nested Queries", "Aggregations"],
    color: "yellow",
  },
  {
    id: "assignment-2",
    type: "Assignment",
    title: "Assignment 2: Schema Normalization",
    status: "marks-not-entered",
    statusLabel: "Marks not entered",
    dateLabel: "Due Fri 02 Oct · 11:59 PM",
    marksLabel: "25 marks",
    topics: ["1NF", "2NF", "3NF", "BCNF"],
    color: "blue",
  },
  {
    id: "quiz-1",
    type: "Quiz",
    title: "ER Modeling & Relational Algebra",
    status: "graded",
    statusLabel: "Graded",
    dateLabel: "Completed Tue 15 Sep",
    marksLabel: "15 marks",
    color: "white",
    classAverageLabel: "12.4 / 15",
    metaLabel: "42 of 60 marks entered",
  },
  {
    id: "midterm",
    type: "Midterm",
    title: "Midterm Exam (CS-301)",
    status: "draft",
    statusLabel: "Draft",
    dateLabel: "Scheduled Fri 16 Oct",
    marksLabel: "50 marks",
    color: "white",
    metaLabel: "18 questions planned",
    editable: true,
  },
];

export const MOCK_STUDENTS: StudentMark[] = [
  { id: "1", name: "Ayesha Khan", roll: "CS-24-001", initials: "AK", avgPercent: 88, score: null, aboveAvg: true },
  { id: "2", name: "Bilal Ahmed", roll: "CS-24-002", initials: "BA", avgPercent: 79, score: null, aboveAvg: false },
  { id: "3", name: "Hira Siddiqui", roll: "CS-24-003", initials: "HS", avgPercent: 65, score: null, aboveAvg: false },
  { id: "4", name: "Usman Tariq", roll: "CS-24-004", initials: "UT", avgPercent: 81, score: null, aboveAvg: true },
  { id: "5", name: "Zainab Ali", roll: "CS-24-005", initials: "ZA", avgPercent: 74, score: null, aboveAvg: false },
  { id: "6", name: "Danyal Farooq", roll: "CS-24-019", initials: "DF", avgPercent: 74, score: 13.5, aboveAvg: true },
];

export const MOCK_GRADE_ROWS: GradeRow[] = [
  { id: "1", name: "Ayesha Khan", rollLabel: "CS-24-001 · Row 92/100", percent: 92.0, grade: "A", tagLabel: "Top 5%", tagTone: "success", marksEntered: true },
  { id: "2", name: "Bilal Ahmed", rollLabel: "CS-24-002 · Row 85/100", percent: 84.5, grade: "B+", tagLabel: "Weighted", tagTone: "neutral", marksEntered: true },
  { id: "3", name: "Usman Tariq", rollLabel: "CS-24-004 · Row 78/100", percent: 77.0, grade: "B", tagLabel: "Weighted", tagTone: "neutral", marksEntered: true },
  { id: "4", name: "Zainab Ali", rollLabel: "CS-24-005 · Row 69/100", percent: 67.5, grade: "C+", tagLabel: "Weighted", tagTone: "neutral", marksEntered: true },
  { id: "5", name: "Hira Siddiqui", rollLabel: "CS-24-003 · Row 58/100", percent: 56.0, grade: "D", tagLabel: "Review", tagTone: "warning", marksEntered: true },
  { id: "6", name: "Danyal Farooq", rollLabel: "CS-24-019 · Row 48/100", percent: 49.0, grade: "F", tagLabel: "At Risk", tagTone: "danger", marksEntered: true },
  { id: "7", name: "Omar Sheikh", rollLabel: "CS-24-007 · Row —/100", percent: 0, grade: "—", tagLabel: "Marks missing", tagTone: "warning", marksEntered: false },
];

export const MOCK_WEIGHTAGE: WeightageItem[] = [
  { label: "Quizzes", value: "30%" },
  { label: "Assign", value: "30%" },
  { label: "Midterm", value: "30%" },
  { label: "Final", value: "40%" },
  { label: "Part", value: "10%" },
];
