import { LectureInfo, StudentMarkEntry, StudentSummary } from "../../types/attendance";

export const lectureInfo: LectureInfo = {
  label: "Lecture 7 · Tue 22 Sep",
  topic: "SQL Joins (Part 2)",
  time: "10:00 AM - 11:30 AM",
};

export const atRiskStudents: StudentSummary[] = [
  {
    id: "cs-24-003",
    name: "Hira Siddiqui",
    rollNo: "CS-24-003",
    initials: "HS",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-600",
    attendancePct: 62.5,
    attended: 5,
    totalLectures: 8,
  },
  {
    id: "cs-24-005",
    name: "Zainab Ali",
    rollNo: "CS-24-005",
    initials: "ZA",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-600",
    attendancePct: 71.0,
    attended: 5,
    totalLectures: 8,
  },
  {
    id: "cs-24-019",
    name: "Danyal Farooq",
    rollNo: "CS-24-019",
    initials: "DF",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-600",
    attendancePct: 50.0,
    attended: 4,
    totalLectures: 8,
  },
];

export const satisfactoryStudents: StudentSummary[] = [
  {
    id: "cs-24-001",
    name: "Ayesha Khan",
    rollNo: "CS-24-001",
    initials: "AK",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-600",
    attendancePct: 100,
    attended: 8,
    totalLectures: 8,
  },
  {
    id: "cs-24-002",
    name: "Bilal Ahmed",
    rollNo: "CS-24-002",
    initials: "BA",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-600",
    attendancePct: 87.5,
    attended: 7,
    totalLectures: 8,
  },
  {
    id: "cs-24-004",
    name: "Usman Tariq",
    rollNo: "CS-24-004",
    initials: "UT",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-600",
    attendancePct: 100,
    attended: 8,
    totalLectures: 8,
  },
];

export const satisfactoryCount = 28;

export const markEntries: StudentMarkEntry[] = [
  {
    id: "cs-24-001",
    name: "Ayesha Khan",
    rollNo: "CS-24-001",
    initials: "AK",
    avatarBg: "bg-indigo-100",
    avatarText: "text-indigo-600",
    status: "present",
  },
  {
    id: "cs-24-002",
    name: "Bilal Ahmed",
    rollNo: "CS-24-002",
    initials: "BA",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-600",
    status: "present",
  },
  {
    id: "cs-24-003",
    name: "Hira Siddiqui",
    rollNo: "CS-24-003",
    initials: "HS",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-600",
    status: "leave",
  },
  {
    id: "cs-24-004",
    name: "Usman Tariq",
    rollNo: "CS-24-004",
    initials: "UT",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-600",
    status: "present",
  },
  {
    id: "cs-24-005",
    name: "Zainab Ali",
    rollNo: "CS-24-005",
    initials: "ZA",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-600",
    status: "absent",
  },
  {
    id: "cs-24-006",
    name: "Hamza Sheikh",
    rollNo: "CS-24-006",
    initials: "HS",
    avatarBg: "bg-sky-100",
    avatarText: "text-sky-600",
    status: "present",
  },
];