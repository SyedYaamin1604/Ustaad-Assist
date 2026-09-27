// components/HolidaysCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import HolidayRow, { HolidayItem } from './HolidayRow';

interface HolidaysCardProps {
  items: HolidayItem[];
  onToggleItem: (id: string, value: boolean) => void;
  onAddDayOff?: () => void;
}

export default function HolidaysCard({ items, onToggleItem, onAddDayOff }: HolidaysCardProps) {
  return (
    <View className="bg-white rounded-3xl px-5 py-5 mx-5 mt-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-[16px] font-outfit-bold text-[#0F1424]">Holidays &amp; Off Days</Text>
        <View className="bg-[#F4F5FA] rounded-full px-3 py-1.5">
          <Text className="text-[11px] font-outfit-semibold text-[#111318]">{items.length} set</Text>
        </View>
      </View>
      <Text className="font-outfit text-[12px] text-[#8A8F9C] mb-2">
        Lectures falling on these dates get exempted.
      </Text>

      <View>
        {items.map((item, idx) => (
          <HolidayRow
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            showDivider={idx < items.length - 1}
          />
        ))}
      </View>

      <Pressable
        onPress={onAddDayOff}
        className="mt-4 border border-dashed rounded-2xl py-3.5 items-center"
        style={{ borderColor: '#D7D9E2' }}
      >
        <View className="flex-row items-center">
          <Plus size={14} color="#111318" />
          <Text className="text-[13px] font-outfit-bold text-[#0F1424] ml-1.5">Add a day off</Text>
        </View>
      </Pressable>

      <Text className="font-outfit text-[11px] text-[#B7BAC6] text-center mt-2.5">
        (for strikes, closures or unforeseen holidays)
      </Text>
    </View>
  );
}