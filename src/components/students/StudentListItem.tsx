import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Student } from '../../types/students-status';

interface StudentListItemProps {
  student: Student;
  onPress: (student: Student) => void;
}

export default function StudentListItem({ student, onPress }: StudentListItemProps) {
  const isHealthy = student.attendancePercentage >= 75;

  return (
    <TouchableOpacity
      onPress={() => onPress(student)}
      activeOpacity={0.8}
      className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
    >
      <View className="flex-row items-center">
        <View
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: student.avatarBg }}
        >
          <Text className="text-sm font-bold" style={{ color: student.avatarText }}>
            {student.initials}
          </Text>
        </View>
        <View className="ml-3">
          <Text className="text-[15px] font-semibold text-gray-900">{student.name}</Text>
          <Text className="mt-0.5 text-xs text-gray-400">Roll {student.rollNumber}</Text>
        </View>
      </View>

      <View
        className={`rounded-full px-2.5 py-1 ${isHealthy ? 'bg-emerald-50' : 'bg-red-50'}`}
      >
        <Text
          className={`text-xs font-bold ${isHealthy ? 'text-emerald-600' : 'text-red-500'}`}
        >
          {student.attendancePercentage}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}