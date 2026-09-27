// components/ClassDaysCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Clock } from 'lucide-react-native';
import WeekdayPill from './WeekdayPill';

export interface WeekdayItem {
  key: string;
  initial: string;
  label: string;
  active: boolean;
}

interface ClassDaysCardProps {
  sessionsPerWeekLabel: string;
  frequencyLabel: string;
  weekdays: WeekdayItem[];
  onToggleDay?: (key: string) => void;
  timeSlotLabel: string;
  roomLabel: string;
}

export default function ClassDaysCard({
  sessionsPerWeekLabel,
  frequencyLabel,
  weekdays,
  onToggleDay,
  timeSlotLabel,
  roomLabel,
}: ClassDaysCardProps) {
  return (
    <View className="bg-white rounded-3xl px-5 py-5 mx-5 mt-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-[16px] font-bold text-[#0F1424]">Class Days</Text>
        <View className="bg-[#F4F5FA] rounded-full px-3 py-1.5">
          <Text className="text-[11px] font-semibold text-[#111318]">{frequencyLabel}</Text>
        </View>
      </View>
      <Text className="text-[12px] text-[#8A8F9C] mb-4">{sessionsPerWeekLabel}</Text>

      <View className="flex-row justify-between mb-4 px-1">
        {weekdays.map((day) => (
          <WeekdayPill
            key={day.key}
            initial={day.initial}
            label={day.label}
            active={day.active}
            onPress={() => onToggleDay?.(day.key)}
          />
        ))}
      </View>

      <View className="flex-row items-center bg-[#F4F5FA] rounded-2xl px-4 py-3">
        <Clock size={15} color="#111318" />
        <Text className="text-[13px] font-semibold text-[#0F1424] ml-2.5">
          Slot: {timeSlotLabel}{' '}
          <Text className="text-[#8A8F9C] font-normal">({roomLabel})</Text>
        </Text>
      </View>
    </View>
  );
}