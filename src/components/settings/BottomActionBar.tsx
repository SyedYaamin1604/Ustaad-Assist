// components/BottomActionBar.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';

interface BottomActionBarProps {
  hasUnsavedChanges: boolean;
  onSave?: () => void;
}

export default function BottomActionBar({ hasUnsavedChanges, onSave }: BottomActionBarProps) {
  return (
    <View className="flex-row items-center justify-between bg-[#111318] rounded-full mx-5 mb-5 px-2 py-2">
      <Text className="text-[13px] text-[#B7BAC6] ml-4">
        {hasUnsavedChanges ? 'Unsaved modifications' : 'All changes saved'}
      </Text>

      <Pressable
        onPress={onSave}
        disabled={!hasUnsavedChanges}
        className="flex-row items-center bg-white rounded-full px-5 py-3"
        style={{ opacity: hasUnsavedChanges ? 1 : 0.5 }}
      >
        <Text className="text-[13px] font-bold text-[#111318] mr-1.5">Save Changes</Text>
        <Check size={14} color="#111318" strokeWidth={3} />
      </Pressable>
    </View>
  );
}