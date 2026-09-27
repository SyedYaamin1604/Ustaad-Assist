export type AttendanceStatus = "present" | "absent" | "leave";

export interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
}

export interface StudentSummary extends StudentRecord {
  attendancePct: number; // 0-100
  attended: number;
  totalLectures: number;
}

export interface StudentMarkEntry extends StudentRecord {
  status: AttendanceStatus;
}

export interface LectureInfo {
  label: string; // "Lecture 7 · Tue 22 Sep"
  topic: string; // "SQL Joins (Part 2)"
  time: string; // "10:00 AM - 11:30 AM"
}

export type AttendanceView = "mark" | "summary";