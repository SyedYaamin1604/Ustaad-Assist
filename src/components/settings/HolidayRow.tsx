import React from 'react';
import { Text, View } from 'react-native';
import { CalendarOff } from 'lucide-react-native';

import Toggle from './Toggle';

export interface HolidayItem {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

interface HolidayRowProps {
  item: HolidayItem;
  onToggle: (id: string, value: boolean) => void;
  showDivider?: boolean;
}

export default function HolidayRow({ item, onToggle, showDivider = true }: HolidayRowProps) {
  return (
    <View>
      <View className="flex-row items-center py-3.5">
        <View className="w-9 h-9 rounded-full bg-[#F4F5FA] items-center justify-center mr-3">
          <CalendarOff size={15} color="#111318" />
        </View>
        <View className="flex-1">
          <Text className="text-[13.5px] font-outfit-bold text-[#0F1424]">{item.title}</Text>
          <Text className="font-outfit text-[11.5px] text-[#8A8F9C] mt-0.5">{item.subtitle}</Text>
        </View>
        <Toggle value={item.enabled} onValueChange={(v) => onToggle(item.id, v)} />
      </View>
      {showDivider && <View className="h-[1px] bg-[#EEF0F5]" />}
    </View>
  );
}
