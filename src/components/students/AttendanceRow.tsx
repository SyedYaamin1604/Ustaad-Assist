import React from 'react';
import { Text, View } from 'react-native';

import type { AttendanceStatus } from '@/api/types';

const STYLE: Record<AttendanceStatus, { label: string; bg: string; text: string }> = {
  present: { label: 'Present', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  absent: { label: 'Absent', bg: 'bg-red-50', text: 'text-red-500' },
  leave: { label: 'Leave', bg: 'bg-violet-50', text: 'text-violet-600' },
};

export default function AttendanceRow({ label, status }: { label: string; status: AttendanceStatus }) {
  const style = STYLE[status];
  return (
    <View className="flex-row items-center justify-between border-b border-gray-50 py-2.5">
      <Text className="font-outfit text-sm text-gray-600 flex-1 mr-2" numberOfLines={1}>
        {label}
      </Text>
      <View className={`rounded-full px-3 py-1 ${style.bg}`}>
        <Text className={`text-xs font-outfit-semibold ${style.text}`}>{style.label}</Text>
      </View>
    </View>
  );
}
