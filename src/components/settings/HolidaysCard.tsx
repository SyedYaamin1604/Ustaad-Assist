import React from 'react';
import { Text, View } from 'react-native';

import HolidayRow, { type HolidayItem } from './HolidayRow';

interface HolidaysCardProps {
  items: HolidayItem[];
  onToggleItem: (id: string, value: boolean) => void;
}

export default function HolidaysCard({ items, onToggleItem }: HolidaysCardProps) {
  const activeCount = items.filter((i) => i.enabled).length;

  return (
    <View className="bg-white rounded-3xl px-5 py-5 mx-5 mt-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-[16px] font-outfit-bold text-[#0F1424]">Holidays &amp; Off Days</Text>
        <View className="bg-[#F4F5FA] rounded-full px-3 py-1.5">
          <Text className="text-[11px] font-outfit-semibold text-[#111318]">{activeCount} on</Text>
        </View>
      </View>
      <Text className="font-outfit text-[12px] text-[#8A8F9C] mb-2">
        Public holidays in your semester. No class is planned on the ones switched on. To skip an ordinary class day,
        cancel that class from the plan.
      </Text>

      {items.length === 0 ? (
        <Text className="font-outfit text-[12px] text-[#8A8F9C] py-3">No public holidays fall inside the semester.</Text>
      ) : (
        items.map((item, idx) => <HolidayRow key={item.id} item={item} onToggle={onToggleItem} showDivider={idx < items.length - 1} />)
      )}
    </View>
  );
}
