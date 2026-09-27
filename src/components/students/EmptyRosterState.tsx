import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  MoreVertical,
  GraduationCap,
  ArrowRight,
  FileUp,
  ClipboardList,
  Info,
  CheckCircle2,
} from 'lucide-react-native';

interface EmptyRosterStateProps {
  courseCode: string;
  onBack: () => void;
  onCaptureClassList: () => void;
  onImportFile: () => void;
  onPasteList: () => void;
}

/**
 * Illustration block: three soft rotated "blobs" behind a white card,
 * a graduation-cap glyph, and a small pill confirming the roster is ready.
 */
function RosterIllustration() {
  return (
    <View className="items-center justify-center py-4">
      <View className="h-44 w-44 items-center justify-center">
        <View
          className="absolute h-32 w-32 rounded-[36px] bg-amber-200/70"
          style={{ transform: [{ rotate: '-18deg' }], top: 6, left: 2 }}
        />
        <View
          className="absolute h-28 w-28 rounded-[32px] bg-violet-200/70"
          style={{ transform: [{ rotate: '14deg' }], top: 2, right: 0 }}
        />
        <View
          className="absolute h-24 w-24 rounded-[28px] bg-emerald-200/70"
          style={{ transform: [{ rotate: '-8deg' }], bottom: 0, right: 10 }}
        />

        <View className="h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-sm">
          <GraduationCap size={40} color="#111827" strokeWidth={1.5} />
        </View>

        <View className="absolute -bottom-4 flex-row items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <View className="h-2 w-2 rounded-full bg-emerald-500" />
          <Text className="text-xs font-outfit-medium text-gray-600">Roster ready to sync</Text>
        </View>
      </View>
    </View>
  );
}

export default function EmptyRosterState({
  courseCode,
  onBack,
  onCaptureClassList,
  onImportFile,
  onPasteList,
}: EmptyRosterStateProps) {
  return (
    <View className="flex-1 bg-slate-50 px-5 pt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <Text className="text-base font-outfit-semibold text-gray-900">Student Roster</Text>
          <View className="rounded-full bg-indigo-100 px-2.5 py-1">
            <Text className="text-xs font-outfit-semibold text-indigo-600">{courseCode}</Text>
          </View>
        </View>

        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <MoreVertical size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View className="flex-1 justify-center pb-10">
        <RosterIllustration />

        <Text className="mt-8 text-center text-2xl font-outfit-bold leading-8 text-gray-900">
          Capture your class list{'\n'}to start taking attendance
        </Text>
        <Text className="font-outfit mt-3 text-center text-sm leading-5 text-gray-500">
          Photograph or upload the PDF the department sent, to start tracking attendance.
        </Text>

        <View className="mt-5 flex-row items-center self-center rounded-full border border-gray-200 bg-white px-3 py-1.5">
          <Info size={13} color="#6B7280" />
          <Text className="font-outfit ml-1.5 text-xs text-gray-500">
            Supports Excel, CSV, or plain text roll numbers
          </Text>
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

        <TouchableOpacity className="mt-4 flex-row items-center justify-center gap-1.5 self-center">
          <CheckCircle2 size={13} color="#9CA3AF" />
          <Text className="text-xs font-outfit-medium text-gray-400 underline">
            Download sample CSV template
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}