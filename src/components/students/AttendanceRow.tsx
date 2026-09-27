import React from 'react';
import { View, Text } from 'react-native';
import type { LectureAttendance } from '../../types/students-status';

export default function AttendanceRow({ label, status }: LectureAttendance) {
  const isPresent = status === 'Present';
  return (
    <View className="flex-row items-center justify-between border-b border-gray-50 py-2.5 last:border-b-0">
      <Text className="font-outfit text-sm text-gray-600">{label}</Text>
      <View className={`rounded-full px-3 py-1 ${isPresent ? 'bg-emerald-50' : 'bg-red-50'}`}>
        <Text
          className={`text-xs font-outfit-semibold ${isPresent ? 'text-emerald-600' : 'text-red-500'}`}
        >
          {status}
        </Text>
      </View>
    </View>
  );
}