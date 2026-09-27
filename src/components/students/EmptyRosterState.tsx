import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowRight, ClipboardList, FileUp, GraduationCap, Info } from 'lucide-react-native';

interface EmptyRosterStateProps {
  courseCode: string;
  onCaptureClassList: () => void;
  onImportFile: () => void;
  onPasteList: () => void;
}

/**
 * Illustration block: three soft rotated "blobs" behind a white card,
 * a graduation-cap glyph, and a small pill inviting the first import.
 */
function RosterIllustration() {
  return (
    <View className="items-center justify-center py-4">
      <View className="h-44 w-44 items-center justify-center">
        <View className="absolute h-32 w-32 rounded-[36px] bg-amber-200/70" style={{ transform: [{ rotate: '-18deg' }], top: 6, left: 2 }} />
        <View className="absolute h-28 w-28 rounded-[32px] bg-violet-200/70" style={{ transform: [{ rotate: '14deg' }], top: 2, right: 0 }} />
        <View className="absolute h-24 w-24 rounded-[28px] bg-emerald-200/70" style={{ transform: [{ rotate: '-8deg' }], bottom: 0, right: 10 }} />

        <View className="h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-sm">
          <GraduationCap size={40} color="#111827" strokeWidth={1.5} />
        </View>

        <View className="absolute -bottom-4 flex-row items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <View className="h-2 w-2 rounded-full bg-amber-500" />
          <Text className="text-xs font-outfit-medium text-gray-600">No students yet</Text>
        </View>
      </View>
    </View>
  );
}

export default function EmptyRosterState({ courseCode, onCaptureClassList, onImportFile, onPasteList }: EmptyRosterStateProps) {
  return (
    <View className="flex-1 bg-slate-50 px-5 pt-4">
      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-base font-outfit-semibold text-gray-900">Student Roster</Text>
        <View className="rounded-full bg-indigo-100 px-2.5 py-1">
          <Text className="text-xs font-outfit-semibold text-indigo-600">{courseCode}</Text>
        </View>
      </View>

      <View className="flex-1 justify-center pb-24">
        <RosterIllustration />

        <Text className="mt-8 text-center text-2xl font-outfit-bold leading-8 text-gray-900">
          Capture your class list{'\n'}to start taking attendance
        </Text>
        <Text className="font-outfit mt-3 text-center text-sm leading-5 text-gray-500">
          Photograph the printed list or upload the PDF the department sent. You review every name before it is saved.
        </Text>

        <View className="mt-5 flex-row items-center self-center rounded-full border border-gray-200 bg-white px-3 py-1.5">
          <Info size={13} color="#6B7280" />
          <Text className="font-outfit ml-1.5 text-xs text-gray-500">Works with a photo or a PDF</Text>
        </View>

        <TouchableOpacity
          onPress={onCaptureClassList}
          activeOpacity={0.85}
          className="mt-8 flex-row items-center justify-center rounded-full bg-gray-900 py-4"
        >
          <Text className="mr-2 text-base font-outfit-semibold text-white">Capture Class List</Text>
          <View className="h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <ArrowRight size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View className="mt-3 flex-row gap-3">
          <TouchableOpacity
            onPress={onImportFile}
            activeOpacity={0.85}
            className="flex-1 flex-row items-center justify-center rounded-full border border-gray-200 bg-white py-3.5"
          >
            <FileUp size={16} color="#111827" />
            <Text className="ml-2 text-sm font-outfit-semibold text-gray-900">Import file</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPasteList}
            activeOpacity={0.85}
            className="flex-1 flex-row items-center justify-center rounded-full border border-gray-200 bg-white py-3.5"
          >
            <ClipboardList size={16} color="#111827" />
            <Text className="ml-2 text-sm font-outfit-semibold text-gray-900">Paste list</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
