/**
 * The class list.
 *
 *   list    GET /courses/:id/students
 *   add     photo / PDF -> Supabase Storage -> POST /students/extract (a draft), or paste
 *   review  the mandatory check of every row, then POST /students/import
 *   detail  GET /students/:id, and DELETE the enrollment
 *
 * Students are never typed one by one, and nothing captured is saved until the
 * teacher confirms it on the review screen.
 */

import React, { useState } from 'react';
import { Alert, Share } from 'react-native';

import { ApiError, studentsApi, type StudentWithAttendance } from '@/api';
import AddStudents from '@/components/students/AddStudents';
import EmptyRosterState from '@/components/students/EmptyRosterState';
import StudentDetail from '@/components/students/StudentDetail';
import StudentReviewScreen from '@/components/students/StudentReviewScreen';
import StudentsList from '@/components/students/StudentsList';
import { ErrorState, LoadingState } from '@/components/ui/ScreenState';
import { useAction } from '@/hooks/useAction';
import { useApi } from '@/hooks/useApi';
import { pickDocument, takePhoto } from '@/lib/pickers';
import { buildStoragePath, uploadFile } from '@/lib/storage';
import { useAuth } from '@/providers/AuthProvider';
import { useCourse } from '@/providers/CourseProvider';
import { showError } from '@/utils/errors';
import { newRow, parseRosterText, type RosterRow } from '@/utils/roster';

type ScreenView = 'list' | 'add' | 'review' | 'detail';
type AddTab = 'camera' | 'paste' | 'import';

export default function StudentsScreen() {
  const { courseId, course } = useCourse();
  const { session } = useAuth();
  const { busy, run } = useAction();

  const [view, setView] = useState<ScreenView>('list');
  const [addTab, setAddTab] = useState<AddTab>('camera');
  const [pending, setPending] = useState<RosterRow[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [selected, setSelected] = useState<StudentWithAttendance | null>(null);

  const { data: students, error, loading, reload } = useApi(courseId ? () => studentsApi.list(courseId) : null, [courseId]);
  const { data: record } = useApi(selected ? () => studentsApi.get(selected.id) : null, [selected?.id]);

  if (!courseId || !course) return <LoadingState />;

  const courseCode = course.code ?? course.name;
  const courseLabel = [course.name, course.code].filter(Boolean).join(' ') + (course.semester ? ` · ${course.semester}` : '');

  const openAdd = (tab: AddTab) => {
    setAddTab(tab);
    setView('add');
  };

  // ------------------------------------------------------------ capture

  const capture = async (source: 'camera' | 'file') => {
    setCapturing(true);
    try {
      const file = source === 'camera' ? await takePhoto() : await pickDocument(['application/pdf', 'image/*']);
      if (!file) return;

      const path = await uploadFile(file, buildStoragePath(session!.user.id, courseId, 'class-lists', file.name));
      const extracted = await studentsApi.extract(courseId, path);

      // Several pages append to one list before confirming.
      setPending((prev) => [...prev, ...extracted.rows.map((r) => newRow(r.roll_no ?? '', r.name ?? '', r.confidence))]);
      setView('review');
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        // The backend's reader is not switched on yet; it says so in its message.
        Alert.alert("Automatic reading isn't available yet", `${err.message}\n\nYou can paste the list instead.`, [
          { text: 'Paste the list', onPress: () => setAddTab('paste') },
          { text: 'OK', style: 'cancel' },
        ]);
      } else {
        showError(err, "Couldn't read the class list");
      }
    } finally {
      setCapturing(false);
    }
  };

  const reviewPasted = (text: string) => {
    setPending((prev) => [...prev, ...parseRosterText(text)]);
    setView('review');
  };

  // ------------------------------------------------------------- save

  const confirm = async () => {
    const result = await run(
      () => studentsApi.import(courseId, pending.map((r) => ({ roll_no: r.roll_no.trim(), name: r.name.trim() }))),
      "Couldn't save the class list",
    );
    if (!result) return;

    Alert.alert(
      'Class list saved',
      `${result.saved} ${result.saved === 1 ? 'student' : 'students'} saved, ${result.newly_enrolled} newly enrolled in ${courseCode}.`,
    );
    setPending([]);
    setView('list');
    reload();
  };

  const removeSelected = () => {
    if (!selected) return;
    Alert.alert(
      `Remove ${selected.name}?`,
      `They will be taken off ${courseCode}. Their record is kept for your other courses.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const done = await run(() => studentsApi.remove(courseId, selected.id), "Couldn't remove the student");
            if (!done) return;
            setSelected(null);
            setView('list');
            reload();
          },
        },
      ],
    );
  };

  const shareRoster = () => {
    const lines = (students ?? []).map((s) => `${s.roll_no}, ${s.name}`).join('\n');
    Share.share({ message: `${courseLabel}\n\n${lines}` }).catch((err) => showError(err, "Couldn't share"));
  };

  // ------------------------------------------------------------- views

  if (view === 'review') {
    return (
      <StudentReviewScreen
        rows={pending}
        onChange={setPending}
        saving={busy}
        onBack={() => setView('add')}
        onAddPage={() => openAdd('camera')}
        onConfirm={confirm}
      />
    );
  }

  if (view === 'add') {
    return (
      <AddStudents
        key={addTab}
        courseLabel={courseLabel}
        initialTab={addTab}
        pendingCount={pending.length}
        capturing={capturing}
        onBack={() => setView('list')}
        onCapturePhoto={() => capture('camera')}
        onUploadFile={() => capture('file')}
        onReview={reviewPasted}
      />
    );
  }

  if (view === 'detail' && selected) {
    return (
      <StudentDetail
        student={selected}
        record={record}
        courseId={courseId}
        courseLabel={courseLabel}
        threshold={course.attendance_threshold}
        removing={busy}
        onBack={() => {
          setSelected(null);
          setView('list');
        }}
        onRemove={removeSelected}
      />
    );
  }

  if (!students) return error ? <ErrorState message={error} onRetry={reload} /> : <LoadingState label="Loading students..." />;

  if (students.length === 0) {
    return (
      <EmptyRosterState
        courseCode={courseCode}
        onCaptureClassList={() => openAdd('camera')}
        onImportFile={() => openAdd('import')}
        onPasteList={() => openAdd('paste')}
      />
    );
  }

  return (
    <StudentsList
      courseCode={courseCode}
      courseName={course.name}
      semester={course.semester}
      students={students}
      refreshing={loading}
      onRefresh={reload}
      onAddStudents={() => openAdd('camera')}
      onShare={shareRoster}
      onSelectStudent={(student) => {
        setSelected(student);
        setView('detail');
      }}
    />
  );
}
