import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface BottomActionBarProps {
  hasUnsavedChanges: boolean;
  saving?: boolean;
  onSave?: () => void;
}

export default function BottomActionBar({ hasUnsavedChanges, saving = false, onSave }: BottomActionBarProps) {
  const enabled = hasUnsavedChanges && !saving;

  return (
    <View className="flex-row items-center justify-between bg-[#111318] rounded-full mx-5 mb-5 px-2 py-2">
      <Text className="font-outfit text-[13px] text-[#B7BAC6] ml-4">
        {saving ? 'Saving...' : hasUnsavedChanges ? 'Unsaved modifications' : 'All changes saved'}
      </Text>

      <Pressable
        onPress={onSave}
        disabled={!enabled}
        className="flex-row items-center bg-white rounded-full px-5 py-3"
        style={{ opacity: enabled ? 1 : 0.5 }}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#111318" />
        ) : (
          <>
            <Text className="text-[13px] font-outfit-bold text-[#111318] mr-1.5">Save Changes</Text>
            <Check size={14} color="#111318" strokeWidth={3} />
          </>
        )}
      </Pressable>
    </View>
  );
}
