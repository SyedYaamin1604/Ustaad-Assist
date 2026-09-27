import React from 'react';
import { Text, View } from 'react-native';

import type { DayName } from '@/api/types';
import { DAY_NAMES, dayLabel } from '@/utils/date';
import WeekdayPill from './WeekdayPill';

const INITIAL: Record<DayName, string> = { mon: 'M', tue: 'T', wed: 'W', thu: 'T', fri: 'F', sat: 'S', sun: 'S' };

interface ClassDaysCardProps {
  classDays: DayName[];
  onToggleDay: (day: DayName) => void;
}

export default function ClassDaysCard({ classDays, onToggleDay }: ClassDaysCardProps) {
  const perWeek = classDays.length;

  return (
    <View className="bg-white rounded-3xl px-5 py-5 mx-5 mt-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-[16px] font-outfit-bold text-[#0F1424]">Class Days</Text>
        <View className="bg-[#F4F5FA] rounded-full px-3 py-1.5">
          <Text className="text-[11px] font-outfit-semibold text-[#111318]">Weekly</Text>
        </View>
      </View>
      <Text className="font-outfit text-[12px] text-[#8A8F9C] mb-4">
        {perWeek} {perWeek === 1 ? 'class' : 'classes'} per week. Changing these rebuilds the plan.
      </Text>

      <View className="flex-row justify-between px-1">
        {DAY_NAMES.map((day) => (
          <WeekdayPill
            key={day}
            initial={INITIAL[day]}
            label={dayLabel(day)}
            active={classDays.includes(day)}
            onPress={() => onToggleDay(day)}
          />
        ))}
      </View>
    </View>
  );
}
