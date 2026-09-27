export type AttendanceStatus = 'Present' | 'Absent';

export interface LectureAttendance {
  id: string;
  label: string; // e.g. "Lec 8 (Sep 24)"
  status: AttendanceStatus;
}

export interface AssessmentMark {
  id: string;
  type: 'Quiz' | 'Assign';
  title: string;
  score: number;
  maxScore: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  attendancePercentage: number;
}

export interface StudentDetailData extends Student {
  courseName: string;
  courseCode: string;
  lecturesAttended: number;
  totalLectures: number;
  alertThreshold: number;
  attendance: LectureAttendance[];
  assessments: AssessmentMark[];
}

export interface ParsedEntry {
  rollNumber: string;
  name: string;
}