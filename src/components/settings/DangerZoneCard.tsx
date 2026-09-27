// components/DangerZoneCard.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface DangerZoneCardProps {
  onDeletePress?: () => void;
}

export default function DangerZoneCard({ onDeletePress }: DangerZoneCardProps) {
  return (
    <Pressable
      onPress={onDeletePress}
      className="rounded-3xl px-5 py-6 mx-5 mt-4 items-center"
      style={{ backgroundColor: '#FDEDEC', borderWidth: 1, borderColor: '#F7D6D3' }}
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: '#F8D3D1' }}
      >
        <Trash2 size={18} color="#DC2626" />
      </View>
      <Text className="text-[15px] font-outfit-bold mb-1" style={{ color: '#DC2626' }}>
        Delete course and all data
      </Text>
      <Text className="text-[12px] font-outfit-semibold mb-2" style={{ color: '#E06A63' }}>
        This action is irreversible
      </Text>
      <Text className="font-outfit text-[11.5px] text-center leading-[16px]" style={{ color: '#C98F8B' }}>
        Student records, attendance entries, and grade thresholds will be purged permanently.
      </Text>
    </Pressable>
  );
}