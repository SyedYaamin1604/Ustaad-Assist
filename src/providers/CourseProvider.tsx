/**
 * Which course the teacher is working in.
 *
 * The course list (dashboard) picks one; every tab — plan, students,
 * assessments, material — then works inside it. The choice is remembered, so
 * reopening the app returns to the same course.
 *
 * `course` is GET /courses/:id: the course with its topics and holidays, which
 * most screens need (codes and names for headers, topics for pickers).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { coursesApi, type CourseDetail } from "@/api";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/providers/AuthProvider";

const STORAGE_KEY = "ustaadassist.selectedCourseId";

type CourseContextValue = {
  courseId: string | null;
  /** Undefined while loading, or when no course is selected. */
  course: CourseDetail | undefined;
  courseError: string | null;
  /** True until the remembered course id has been read on launch. */
  isRestoring: boolean;
  selectCourse: (courseId: string | null) => void;
  /** Fetch the course again after changing its topics, holidays or settings. */
  reloadCourse: () => void;
};

const CourseContext = createContext<CourseContextValue | null>(null);

export function useCourse(): CourseContextValue {
  const value = use(CourseContext);
  if (!value) throw new Error("useCourse must be used inside <CourseProvider>");
  return value;
}

export function CourseProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  // The remembered course is stored per teacher, so a different account on the
  // same phone never opens someone else's course id.
  const key = userId ? `${STORAGE_KEY}.${userId}` : null;

  // The selection, kept with the storage key it belongs to. Until the stored
  // value for the current key has been read, the provider is still restoring.
  const [selection, setSelection] = useState<{ key: string; courseId: string | null } | null>(null);

  useEffect(() => {
    if (!key) return;
    AsyncStorage.getItem(key)
      .then((stored) => setSelection({ key, courseId: stored }))
      .catch(() => setSelection({ key, courseId: null }));
  }, [key]);

  const isRestoring = key !== null && selection?.key !== key;
  const courseId = key !== null && selection?.key === key ? selection.courseId : null;

  const selectCourse = useCallback(
    (next: string | null) => {
      if (!key) return;
      setSelection({ key, courseId: next });
      if (next) AsyncStorage.setItem(key, next);
      else AsyncStorage.removeItem(key);
    },
    [key],
  );

  const { data, error: courseError, reload: reloadCourse } = useApi(
    courseId ? () => coursesApi.get(courseId) : null,
    [courseId],
  );

  // While switching courses the previous one is still in memory; never hand it out.
  const course = data && String(data.id) === courseId ? data : undefined;

  const value = useMemo<CourseContextValue>(
    () => ({ courseId, course, courseError, isRestoring, selectCourse, reloadCourse }),
    [courseId, course, courseError, isRestoring, selectCourse, reloadCourse],
  );

  return <CourseContext value={value}>{children}</CourseContext>;
}
