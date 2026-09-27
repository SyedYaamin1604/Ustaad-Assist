import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import type { StudentRecord, StudentWithAttendance } from '@/api/types';
import { formatShortDate, parseISODate } from '@/utils/date';
import { avatarColors, formatPercent, initials } from '@/utils/format';
import { useTabBarInset } from '@/utils/tab-bar';
import AssessmentItem from './AssessmentItem';
import AttendanceRow from './AttendanceRow';

interface StudentDetailProps {
  /** The row from the class list — carries the backend's attendance percentage. */
  student: StudentWithAttendance;
  /** GET /students/:id, or undefined while it loads. */
  record: StudentRecord | undefined;
  courseId: string;
  courseLabel: string;
  threshold: number;
  removing: boolean;
  onBack: () => void;
  onRemove: () => void;
}

export default function StudentDetail({ student, record, courseId, courseLabel, threshold, removing, onBack, onRemove }: StudentDetailProps) {
  const tabBarInset = useTabBarInset();
  const avatar = avatarColors(student.roll_no);

  const percentage = student.attendance_percentage;
  const isHealthy = percentage === null || !student.below_threshold;
  const accent = isHealthy ? '#059669' : '#EF4444';
  const trackColor = isHealthy ? '#A7F3D0' : '#FECACA';

  // A student belongs to the teacher, so the record spans all their courses. Show this one.
  const attendance = (record?.attendance ?? []).filter((a) => String(a.course_id) === courseId).reverse();
  const marks = (record?.marks ?? []).filter((m) => String(m.course_id) === courseId);

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-4">
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <Text className="ml-4 text-base font-outfit-semibold text-gray-500">Student Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: tabBarInset + 24 }} showsVerticalScrollIndicator={false}>
        <View className="mt-4 items-center rounded-3xl bg-white py-7 shadow-sm">
          <View className="h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: avatar.bg }}>
            <Text className="text-lg font-outfit-bold" style={{ color: avatar.text }}>
              {initials(student.name)}
            </Text>
          </View>
          <Text className="mt-3 text-xl font-outfit-bold text-gray-900">{student.name}</Text>
          <Text className="font-outfit mt-1 text-sm text-gray-400">
            Roll {student.roll_no} · {courseLabel}
          </Text>
        </View>

        <Text className="mb-2 mt-6 text-xs font-outfit-semibold tracking-wide text-gray-400">
          ATTENDANCE (ALERT BELOW {threshold}%)
        </Text>
        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-end justify-between">
            <Text className="text-4xl font-outfit-bold" style={{ color: accent }}>
              {formatPercent(percentage)}
            </Text>
            <Text className="font-outfit mb-1 text-xs text-gray-400">
              {student.present} present · {student.absent} absent
            </Text>
          </View>

          <View className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: trackColor }}>
            <View className="h-1.5 rounded-full" style={{ width: `${Math.min(percentage ?? 0, 100)}%`, backgroundColor: accent }} />
          </View>

          <View className="mt-3">
            {!record ? (
              <ActivityIndicator color="#0F172A" style={{ marginVertical: 12 }} />
            ) : attendance.length === 0 ? (
              <Text className="font-outfit py-3 text-sm text-gray-400">No attendance recorded yet.</Text>
            ) : (
              attendance.map((a) => (
                <AttendanceRow
                  key={a.date}
                  label={`${formatShortDate(parseISODate(a.date))}${a.topic_title ? ` · ${a.topic_title}` : ''}`}
                  status={a.status}
                />
              ))
            )}
          </View>
        </View>

        <Text className="mb-2 mt-6 text-xs font-outfit-semibold tracking-wide text-gray-400">ASSESSMENT MARKS</Text>
        {record && marks.length === 0 && <Text className="font-outfit text-sm text-gray-400">No marks entered yet.</Text>}
        {marks.map((mark) => (
          <AssessmentItem key={mark.assessment_id} mark={mark} />
        ))}

        <Pressable onPress={onRemove} disabled={removing} className="mt-6 items-center rounded-full border border-red-200 bg-red-50 py-3.5">
          {removing ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <Text className="font-outfit-semibold text-sm text-red-600">Remove from this course</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
