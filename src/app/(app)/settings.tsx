/**
 * Course settings.
 *
 *   PATCH /courses/:id            class days, threshold, and name/code/semester/dates
 *   POST  /courses/:id/holidays   only the ticks that changed
 *   POST  /courses/:id/plan/replan   offered when the timetable is affected
 *
 * Changing dates or class days makes the backend answer replan_required; a
 * holiday tick changes which days are free, so it is treated the same way.
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { coursesApi, planApi, type CourseDetail, type DayName } from '@/api';
import BottomActionBar from '@/components/settings/BottomActionBar';
import ClassDaysCard from '@/components/settings/ClassdayCard';
import CourseOverviewCard from '@/components/settings/CourseOverviewCard';
import CourseSettingsHeader from '@/components/settings/CourseSettingsHeader';
import EditCourseInfoSheet, { type CourseInfoEdit } from '@/components/settings/EditCourseInfoSheet';
import HolidaysCard from '@/components/settings/HolidaysCard';
import ThresholdCard from '@/components/settings/ThresholdCard';
import { LoadingState } from '@/components/ui/ScreenState';
import { useAction } from '@/hooks/useAction';
import { useCourse } from '@/providers/CourseProvider';
import { dayLabel, DAY_NAMES, formatFullDate, parseISODate, weeksBetween } from '@/utils/date';
import { plural } from '@/utils/format';

export default function Settings() {
  const { course } = useCourse();
  if (!course) return <LoadingState />;
  // Remount when the saved course changes, so the form starts from the saved values.
  return <SettingsForm key={JSON.stringify([course.class_days, course.attendance_threshold, course.holidays])} course={course} />;
}

function SettingsForm({ course }: { course: CourseDetail }) {
  const router = useRouter();
  const { reloadCourse } = useCourse();
  const { busy, run } = useAction();

  const [classDays, setClassDays] = useState<DayName[]>(course.class_days);
  const [threshold, setThreshold] = useState(course.attendance_threshold);
  const [holidayTicks, setHolidayTicks] = useState<Record<string, boolean>>(
    () => Object.fromEntries(course.holidays.map((h) => [h.id, h.is_active])),
  );
  const [infoCount, setInfoCount] = useState(0);
  const [isInfoOpen, setInfoOpen] = useState(false);

  const daysChanged = classDays.length !== course.class_days.length || classDays.some((d) => !course.class_days.includes(d));
  const thresholdChanged = threshold !== course.attendance_threshold;
  const changedHolidays = course.holidays.filter((h) => holidayTicks[h.id] !== h.is_active);
  const dirty = daysChanged || thresholdChanged || changedHolidays.length > 0;

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  /** After a change to the timetable's inputs, offer to rebuild it right away. */
  const offerReplan = (reason: string) => {
    Alert.alert('Rebuild the plan?', 'Your changes affect which days you teach. Taught classes stay as they are.', [
      { text: 'Later', style: 'cancel' },
      {
        text: 'Rebuild now',
        onPress: async () => {
          const result = await run(() => planApi.replan(course.id, reason), "Couldn't rebuild the plan");
          if (!result) return;
          Alert.alert(
            'Plan rebuilt',
            `${plural(result.changes.length, 'class', 'classes')} moved.${
              result.deficit > 0 ? ` ${plural(result.deficit, 'class', 'classes')} short — see the catch-up options on the plan.` : ''
            }`,
            [{ text: 'Open plan', onPress: () => router.navigate('/plan') }, { text: 'OK' }],
          );
        },
      },
    ]);
  };

  const save = async () => {
    const result = await run(async () => {
      let replanRequired = false;
      if (daysChanged || thresholdChanged) {
        const updated = await coursesApi.update(course.id, {
          ...(daysChanged ? { class_days: classDays } : {}),
          ...(thresholdChanged ? { attendance_threshold: threshold } : {}),
        });
        replanRequired = updated.replan_required;
      }
      if (changedHolidays.length > 0) {
        await coursesApi.setHolidays(course.id, changedHolidays.map((h) => ({ id: h.id, is_active: holidayTicks[h.id] })));
        replanRequired = true;
      }
      return { replanRequired };
    }, "Couldn't save the settings");
    if (!result) return;

    reloadCourse();
    if (result.replanRequired) offerReplan('Course settings changed');
  };

  const saveInfo = async (edit: CourseInfoEdit) => {
    const updated = await run(() => coursesApi.update(course.id, edit), "Couldn't save the course info");
    if (!updated) return;
    setInfoOpen(false);
    reloadCourse();
    if (updated.replan_required) offerReplan('Semester dates changed');
  };

  const title = [course.name, course.code].filter(Boolean).join(' ');

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4FA" />

      <CourseSettingsHeader title="Course settings" subtitle={`Manage ${title}`} onBack={goBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <CourseOverviewCard
          semesterLabel={course.semester ?? 'Semester'}
          courseTitle={title}
          subtitle={`${plural(course.topics.length, 'topic')} · ${DAY_NAMES.filter((d) => course.class_days.includes(d)).map(dayLabel).join(', ')}`}
          dateRangeLabel={`${formatFullDate(course.start_date)} – ${formatFullDate(course.end_date)}`}
          durationLabel={`${weeksBetween(course.start_date, course.end_date)} weeks`}
          onEditPress={() => {
            setInfoCount((n) => n + 1);
            setInfoOpen(true);
          }}
        />

        <ClassDaysCard
          classDays={classDays}
          onToggleDay={(day) =>
            setClassDays((prev) => {
              const next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
              return next.length === 0 ? prev : next; // the backend needs at least one class day
            })
          }
        />

        <ThresholdCard threshold={threshold} onThresholdChange={setThreshold} />

        <HolidaysCard
          items={course.holidays.map((h) => ({
            id: h.id,
            title: h.name ?? 'Holiday',
            subtitle: `${parseISODate(h.date).toLocaleDateString('en-US', { weekday: 'short' })}, ${formatFullDate(h.date)}`,
            enabled: holidayTicks[h.id] ?? h.is_active,
          }))}
          onToggleItem={(id, value) => setHolidayTicks((prev) => ({ ...prev, [id]: value }))}
        />

        <View className="h-4" />
      </ScrollView>

      <BottomActionBar hasUnsavedChanges={dirty} saving={busy} onSave={save} />

      <EditCourseInfoSheet
        key={infoCount}
        visible={isInfoOpen}
        course={course}
        saving={busy}
        onClose={() => setInfoOpen(false)}
        onSave={saveInfo}
      />
    </SafeAreaView>
  );
}
