import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import EmptyRosterState from '../../components/students/EmptyRosterState';
import AddStudents from '../../components/students/AddStudents';
import StudentsList from '../../components/students/StudentsList';
import StudentDetail from '../../components/students/StudentDetail';
import type { ParsedEntry, Student, StudentDetailData } from '../../types/students-status';

const COURSE = {
  code: 'CS-301',
  name: 'Database Systems',
  section: 'B',
  term: 'Fall 2026',
};

// Mock attendance/assessment detail, keyed by student id. In production this
// would be fetched once a student is selected.
const STUDENT_DETAILS: Record<string, StudentDetailData> = {
  'CS-24-003': {
    id: 'CS-24-003',
    rollNumber: 'CS-24-003',
    name: 'Hira Siddiqui',
    initials: 'HS',
    avatarBg: '#FEF3C7',
    avatarText: '#B45309',
    attendancePercentage: 64,
    courseName: COURSE.name,
    courseCode: COURSE.code,
    lecturesAttended: 5,
    totalLectures: 8,
    alertThreshold: 75,
    attendance: [
      { id: 'l8', label: 'Lec 8 (Sep 24)', status: 'Present' },
      { id: 'l7', label: 'Lec 7 (Sep 20)', status: 'Present' },
      { id: 'l6', label: 'Lec 6 (Sep 17)', status: 'Absent' },
      { id: 'l5', label: 'Lec 5 (Sep 13)', status: 'Present' },
      { id: 'l4', label: 'Lec 4 (Sep 10)', status: 'Present' },
    ],
    assessments: [
      { id: 'q2', type: 'Quiz', title: 'Quiz 2: SQL Joins', score: 13.5, maxScore: 15 },
      { id: 'a2', type: 'Assign', title: 'Assignment 2: Schema Norm', score: 22, maxScore: 25 },
      { id: 'q1', type: 'Quiz', title: 'Quiz 1: ER Modeling', score: 11, maxScore: 15 },
    ],
  },
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'CS-24-001',
    rollNumber: 'CS-24-001',
    name: 'Ayesha Khan',
    initials: 'AK',
    avatarBg: '#E0E7FF',
    avatarText: '#4338CA',
    attendancePercentage: 88,
  },
  {
    id: 'CS-24-002',
    rollNumber: 'CS-24-002',
    name: 'Bilal Ahmed',
    initials: 'BA',
    avatarBg: '#E0E7FF',
    avatarText: '#4338CA',
    attendancePercentage: 79,
  },
  {
    id: 'CS-24-003',
    rollNumber: 'CS-24-003',
    name: 'Hira Siddiqui',
    initials: 'HS',
    avatarBg: '#FEF3C7',
    avatarText: '#B45309',
    attendancePercentage: 64,
  },
  {
    id: 'CS-24-004',
    rollNumber: 'CS-24-004',
    name: 'Usman Tariq',
    initials: 'UT',
    avatarBg: '#E0E7FF',
    avatarText: '#4338CA',
    attendancePercentage: 85,
  },
  {
    id: 'CS-24-005',
    rollNumber: 'CS-24-005',
    name: 'Zainab Ali',
    initials: 'ZA',
    avatarBg: '#FEF3C7',
    avatarText: '#B45309',
    attendancePercentage: 71,
  },
];

type ScreenView = 'add-students' | 'list' | 'detail';

/**
 * Set this to [] to see the empty-roster flow, or leave populated to see
 * the students list flow — both are driven by the same `students` state.
 */
const SEED_STUDENTS: Student[] = INITIAL_STUDENTS;

export default function StudentsScreen() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [view, setView] = useState<ScreenView>(SEED_STUDENTS.length === 0 ? 'add-students' : 'list');
  const [pendingEntries, setPendingEntries] = useState<ParsedEntry[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const hasStudents = students.length > 0;

  function handleExit() {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/Home');
  }

  function handleReviewAndAdd() {
    // In production this would open a confirm/edit review screen before
    // committing. Here we add the parsed entries straight to the roster.
    const added: Student[] = pendingEntries.map((entry) => ({
      id: entry.rollNumber,
      rollNumber: entry.rollNumber,
      name: entry.name,
      initials: entry.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      avatarBg: '#E0E7FF',
      avatarText: '#4338CA',
      attendancePercentage: 0,
    }));
    setStudents((prev) => [...prev, ...added]);
    setPendingEntries([]);
    setView('list');
  }

  // Empty roster: show the capture/empty-state screen until students exist.
  if (!hasStudents && view !== 'add-students') {
    return (
      <EmptyRosterState
        courseCode={COURSE.code}
        onBack={handleExit}
        onCaptureClassList={() => setView('add-students')}
        onImportFile={() => setView('add-students')}
        onPasteList={() => setView('add-students')}
      />
    );
  }

  if (view === 'add-students') {
    return (
      <AddStudents
        courseName={COURSE.name}
        courseCode={COURSE.code}
        term={COURSE.term}
        entries={pendingEntries}
        onBack={() => setView('list')}
        onOpenCamera={() => {}}
        onUploadPdf={() => {}}
        onChooseFile={() => {}}
        onReviewAndAdd={handleReviewAndAdd}
      />
    );
  }

  if (view === 'detail' && selectedStudentId) {
    const detail = STUDENT_DETAILS[selectedStudentId];
    if (detail) {
      return <StudentDetail student={detail} onBack={() => setView('list')} />;
    }
  }

  return (
    <StudentsList
      courseCode={COURSE.code}
      section={COURSE.section}
      courseName={COURSE.name}
      students={students}
      onBack={handleExit}
      onShare={() => {}}
      onSelectStudent={(student) => {
        setSelectedStudentId(student.id);
        setView('detail');
      }}
    />
  );
}