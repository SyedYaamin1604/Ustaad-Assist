// Settings.tsx
// Course Settings screen for "Database Systems CS-301" — composes all
// section components below the header and above the sticky save bar.

import React, { useState, useMemo } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Flag, CalendarOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import CourseSettingsHeader from '../components/settings/CourseSettingsHeader';
import CourseOverviewCard from '../components/settings/CourseOverviewCard';
import ClassDaysCard, { WeekdayItem } from '../components/settings/ClassdayCard';
import ThresholdCard from '../components/settings/ThresholdCard';
import HolidaysCard from '../components/settings/HolidaysCard';
import { HolidayItem } from '../components/settings/HolidayRow';
import DangerZoneCard from '../components/settings/DangerZoneCard';
import BottomActionBar from '../components/settings/BottomActionBar';

const INITIAL_WEEKDAYS: WeekdayItem[] = [
  { key: 'mon', initial: 'M', label: 'Mon', active: false },
  { key: 'tue', initial: 'T', label: 'Tue', active: true },
  { key: 'wed', initial: 'W', label: 'Wed', active: false },
  { key: 'thu', initial: 'T', label: 'Thu', active: false },
  { key: 'fri', initial: 'F', label: 'Fri', active: true },
  { key: 'sat', initial: 'S', label: 'Sat', active: false },
  { key: 'sun', initial: 'S', label: 'Sun', active: false },
];

const INITIAL_HOLIDAYS: HolidayItem[] = [
  {
    id: 'iqbal-day',
    icon: Sparkles,
    title: 'Iqbal Day',
    subtitle: 'Mon, 09 Nov 2026 · 1 lecture saved',
    enabled: true,
  },
  {
    id: 'quaid-day',
    icon: Flag,
    title: 'Quaid Day',
    subtitle: 'Fri, 25 Dec 2026 · Academic off',
    enabled: true,
  },
  {
    id: 'mid-term-break',
    icon: CalendarOff,
    title: 'Mid-term Break',
    subtitle: '26 Oct – 30 Oct 2026 · 2 lectures',
    enabled: true,
  },
];

export default function Settings() {
  const router = useRouter();
  const [weekdays, setWeekdays] = useState<WeekdayItem[]>(INITIAL_WEEKDAYS);
  const [threshold, setThreshold] = useState(75);
  const [autoNotify, setAutoNotify] = useState(true);
  const [holidays, setHolidays] = useState<HolidayItem[]>(INITIAL_HOLIDAYS);
  const [dirty, setDirty] = useState(true); // mockup shows "Unsaved modifications" by default

  const sessionsPerWeek = useMemo(
    () => weekdays.filter((d) => d.active).length,
    [weekdays]
  );

  const markDirty = () => setDirty(true);

  const handleToggleDay = (key: string) => {
    setWeekdays((prev) =>
      prev.map((d) => (d.key === key ? { ...d, active: !d.active } : d))
    );
    markDirty();
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
    markDirty();
  };

  const handleAutoNotifyChange = (value: boolean) => {
    setAutoNotify(value);
    markDirty();
  };

  const handleToggleHoliday = (id: string, value: boolean) => {
    setHolidays((prev) =>
      prev.map((h) => (h.id === id ? { ...h, enabled: value } : h))
    );
    markDirty();
  };

  const handleSave = () => {
    // Wire up to the course-settings API mutation here.
    setDirty(false);
    router.replace('/(tabs)/Home');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F3F4FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4FA" />

      <CourseSettingsHeader
        title="Course settings"
        subtitle="Manage CS-301 Fall 2026 cohort settings"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/Home'))}
        onMorePress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
      >
        <CourseOverviewCard
          cohortLabel="Undergraduate Cohort"
          courseCode="CS-301"
          courseName="Database Systems"
          department="Department of Computer Science"
          section="B"
          dateRangeLabel="01 Sep 2026 – 20 Dec 2026"
          durationLabel="16 weeks, 32 sessions planned"
          onEditPress={() => {}}
        />

        <ClassDaysCard
          sessionsPerWeekLabel={`${sessionsPerWeek} recurring lecture sessions per week`}
          frequencyLabel="Weekly"
          weekdays={weekdays}
          onToggleDay={handleToggleDay}
          timeSlotLabel="10:00 AM – 11:30 AM"
          roomLabel="Lab 304"
        />

        <ThresholdCard
          threshold={threshold}
          onThresholdChange={handleThresholdChange}
          autoNotify={autoNotify}
          onAutoNotifyChange={handleAutoNotifyChange}
        />

        <HolidaysCard
          items={holidays}
          onToggleItem={handleToggleHoliday}
          onAddDayOff={() => {}}
        />

        <DangerZoneCard onDeletePress={() => {}} />

        <View className="h-4" />
      </ScrollView>

      <BottomActionBar hasUnsavedChanges={dirty} onSave={handleSave} />
    </SafeAreaView>
  );
}