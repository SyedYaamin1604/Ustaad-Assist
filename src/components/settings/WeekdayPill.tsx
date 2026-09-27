// components/WeekdayPill.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface WeekdayPillProps {
  initial: string;
  label: string;
  active: boolean;
  onPress?: () => void;
}

export default function WeekdayPill({ initial, label, active, onPress }: WeekdayPillProps) {
  return (
    <Pressable onPress={onPress} className="items-center" style={{ width: 40 }}>
      <View
        className="w-9 h-9 rounded-full items-center justify-center mb-1.5"
        style={{ backgroundColor: active ? '#111318' : '#F0F1F6' }}
      >
        <Text
          className="text-[13px] font-bold"
          style={{ color: active ? '#FFFFFF' : '#B7BAC6' }}
        >
          {initial}
        </Text>
      </View>
      <Text
        className="text-[10px]"
        style={{ color: active ? '#111318' : '#B7BAC6', fontWeight: active ? '700' : '400' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}