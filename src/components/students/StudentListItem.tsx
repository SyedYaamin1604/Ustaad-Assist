import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { StudentWithAttendance } from '@/api/types';
import { avatarColors, formatPercent, initials } from '@/utils/format';

interface StudentListItemProps {
  student: StudentWithAttendance;
  onPress: (student: StudentWithAttendance) => void;
}

export default function StudentListItem({ student, onPress }: StudentListItemProps) {
  const avatar = avatarColors(student.roll_no);
  const noClassesYet = student.attendance_percentage === null;
  // below_threshold is worked out by the backend against this course's threshold.
  const pill = noClassesYet
    ? { bg: 'bg-gray-100', text: 'text-gray-500' }
    : student.below_threshold
      ? { bg: 'bg-red-50', text: 'text-red-500' }
      : { bg: 'bg-emerald-50', text: 'text-emerald-600' };

  return (
    <TouchableOpacity
      onPress={() => onPress(student)}
      activeOpacity={0.8}
      className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
    >
      <View className="flex-row items-center flex-1">
        <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: avatar.bg }}>
          <Text className="text-sm font-outfit-bold" style={{ color: avatar.text }}>
            {initials(student.name)}
          </Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-[15px] font-outfit-semibold text-gray-900" numberOfLines={1}>
            {student.name}
          </Text>
          <Text className="font-outfit mt-0.5 text-xs text-gray-400">Roll {student.roll_no}</Text>
        </View>
      </View>

      <View className={`rounded-full px-2.5 py-1 ${pill.bg}`}>
        <Text className={`text-xs font-outfit-bold ${pill.text}`}>{formatPercent(student.attendance_percentage)}</Text>
      </View>
    </TouchableOpacity>
  );
}
