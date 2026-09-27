import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import AttendanceRow from './AttendanceRow';
import AssessmentItem from './AssessmentItem';
import type { StudentDetailData } from '../../types/students-status';
import { useTabBarInset } from '../../utils/tab-bar';

interface StudentDetailProps {
  student: StudentDetailData;
  onBack: () => void;
}

export default function StudentDetail({ student, onBack }: StudentDetailProps) {
  const tabBarInset = useTabBarInset();
  const isHealthy = student.attendancePercentage >= student.alertThreshold;
  const accent = isHealthy ? '#059669' : '#EF4444';
  const trackColor = isHealthy ? '#A7F3D0' : '#FECACA';

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-4">
      {/* Header */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <Text className="ml-4 text-base font-outfit-semibold text-gray-500">Student Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: tabBarInset + 24 }} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View className="mt-4 items-center rounded-3xl bg-white py-7 shadow-sm">
          <View
            className="h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: student.avatarBg }}
          >
            <Text className="text-lg font-outfit-bold" style={{ color: student.avatarText }}>
              {student.initials}
            </Text>
          </View>
          <Text className="mt-3 text-xl font-outfit-bold text-gray-900">{student.name}</Text>
          <Text className="font-outfit mt-1 text-sm text-gray-400">
            Roll {student.rollNumber} · {student.courseName} {student.courseCode}
          </Text>
        </View>

        {/* Attendance */}
        <Text className="mb-2 mt-6 text-xs font-outfit-semibold tracking-wide text-gray-400">
          ATTENDANCE (ALERT THRESHOLD)
        </Text>
        <View className="rounded-3xl bg-white p-4 shadow-sm">
          <View className="flex-row items-end justify-between">
            <Text className="text-4xl font-outfit-bold" style={{ color: accent }}>
              {student.attendancePercentage.toFixed(1)}%
            </Text>
            <Text className="font-outfit mb-1 text-xs text-gray-400">
              {student.lecturesAttended} of {student.totalLectures} lectures attended
            </Text>
          </View>

          <View
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: trackColor }}
          >
            <View
              className="h-1.5 rounded-full"
              style={{
                width: `${Math.min(student.attendancePercentage, 100)}%`,
                backgroundColor: accent,
              }}
            />
          </View>

          <View className="mt-3">
            {student.attendance.map((lecture) => (
              <AttendanceRow key={lecture.id} {...lecture} />
            ))}
          </View>
        </View>

        {/* Assessment marks */}
        <Text className="mb-2 mt-6 text-xs font-outfit-semibold tracking-wide text-gray-400">
          ASSESSMENT MARKS
        </Text>
        {student.assessments.map((mark) => (
          <AssessmentItem key={mark.id} {...mark} />
        ))}
      </ScrollView>
    </View>
  );
}