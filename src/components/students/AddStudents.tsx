import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ArrowRight, Camera, ClipboardList, FileUp, Info, Upload } from 'lucide-react-native';

import { useTabBarInset } from '@/utils/tab-bar';

type AddStudentsTab = 'camera' | 'paste' | 'import';

interface AddStudentsProps {
  courseLabel: string;
  initialTab?: AddStudentsTab;
  /** Rows already captured (earlier pages) and waiting for review. */
  pendingCount: number;
  /** A photo or file is uploading / being read. */
  capturing: boolean;
  onBack: () => void;
  onCapturePhoto: () => void;
  onUploadFile: () => void;
  /** Review what is pending, plus anything pasted here. */
  onReview: (pastedText: string) => void;
}

const TABS: { key: AddStudentsTab; label: string; icon: typeof Camera }[] = [
  { key: 'camera', label: 'Camera', icon: Camera },
  { key: 'paste', label: 'Paste', icon: ClipboardList },
  { key: 'import', label: 'Import file', icon: FileUp },
];

function SegmentedTabs({ active, onChange }: { active: AddStudentsTab; onChange: (tab: AddStudentsTab) => void }) {
  return (
    <View className="flex-row rounded-full bg-gray-100 p-1">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            activeOpacity={0.85}
            className={`flex-1 flex-row items-center justify-center rounded-full py-2.5 ${isActive ? 'bg-gray-900' : ''}`}
          >
            <Icon size={14} color={isActive ? '#FFFFFF' : '#6B7280'} />
            <Text className={`ml-1.5 text-xs font-outfit-semibold ${isActive ? 'text-white' : 'text-gray-500'}`}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function AddStudents({
  courseLabel,
  initialTab = 'camera',
  pendingCount,
  capturing,
  onBack,
  onCapturePhoto,
  onUploadFile,
  onReview,
}: AddStudentsProps) {
  const tabBarInset = useTabBarInset();
  const [activeTab, setActiveTab] = useState<AddStudentsTab>(initialTab);
  const [pastedText, setPastedText] = useState('');

  const pastedLines = pastedText.split('\n').filter((l) => l.trim()).length;
  const canReview = (pendingCount > 0 || pastedLines > 0) && !capturing;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabBarInset + 110 }}
        className="px-5 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft size={18} color="#111827" />
          </TouchableOpacity>
          <View className="ml-4 flex-1">
            <Text className="text-base font-outfit-bold text-gray-900">Add students</Text>
            <Text className="font-outfit text-xs text-gray-400">{courseLabel}</Text>
          </View>
        </View>

        <View className="mt-5">
          <SegmentedTabs active={activeTab} onChange={setActiveTab} />
        </View>

        {activeTab === 'camera' && (
          <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-base font-outfit-bold text-gray-900">Photograph your class list</Text>
            <Text className="font-outfit mt-1.5 text-sm leading-5 text-gray-500">
              Capture the printed roster. Roll numbers and names are read automatically, and you check them before
              anything is saved. Several pages? Take one photo per page.
            </Text>

            <View className="mt-5 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                {capturing ? <ActivityIndicator color="#4F46E5" /> : <Camera size={26} color="#4F46E5" />}
              </View>
              <Text className="mt-3 text-xs font-outfit-medium text-gray-400">
                {capturing ? 'Reading the photo — this takes up to 30 seconds...' : 'Hold the phone straight above the list'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onCapturePhoto}
              disabled={capturing}
              activeOpacity={0.85}
              className={`mt-5 items-center rounded-full bg-gray-900 py-4 ${capturing ? 'opacity-60' : ''}`}
            >
              <Text className="text-base font-outfit-semibold text-white">Open Camera</Text>
            </TouchableOpacity>

            <View className="mt-4 flex-row items-center">
              <Info size={13} color="#9CA3AF" />
              <Text className="font-outfit ml-1.5 text-xs text-gray-400">Straight, flat and well lit reads best. The department&apos;s PDF is always exact.</Text>
            </View>
          </View>
        )}

        {activeTab === 'paste' && (
          <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-outfit-semibold uppercase tracking-wide text-gray-400">Student entries</Text>
              <Text className="font-outfit text-xs text-gray-400">{pastedLines} lines</Text>
            </View>
            <TextInput
              multiline
              value={pastedText}
              onChangeText={setPastedText}
              placeholder={'CS-24-001, Ayesha Khan\nCS-24-002, Bilal Ahmed'}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              textAlignVertical="top"
              className="mt-3 min-h-[160px] font-outfit text-sm leading-6 text-gray-800"
            />
            <View className="mt-3 flex-row items-center border-t border-gray-100 pt-3">
              <Info size={13} color="#9CA3AF" />
              <Text className="font-outfit ml-1.5 flex-1 text-xs text-gray-400">
                Format: roll number, full name — comma or tab separated, one student per line.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'import' && (
          <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-base font-outfit-bold text-gray-900">Upload the class list file</Text>
            <Text className="font-outfit mt-1.5 text-sm leading-5 text-gray-500">
              The PDF the department sent is read exactly, in a second. A photo or image is read too, and doubtful rows are highlighted for you to check.
            </Text>
            <TouchableOpacity
              onPress={onUploadFile}
              disabled={capturing}
              activeOpacity={0.85}
              className="mt-5 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10"
            >
              {capturing ? <ActivityIndicator color="#4F46E5" /> : <Upload size={26} color="#4F46E5" />}
              <Text className="mt-3 text-xs font-outfit-medium text-gray-400">
                {capturing ? 'Reading the class list...' : 'Tap to choose the PDF (or an image)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {pendingCount > 0 && (
          <View className="mt-4 flex-row items-center rounded-2xl bg-emerald-50 px-4 py-3">
            <View className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
            <Text className="font-outfit-medium text-sm text-emerald-800">
              {pendingCount} {pendingCount === 1 ? 'student' : 'students'} captured so far, waiting for review
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 bg-slate-50 px-5 pt-3" style={{ paddingBottom: tabBarInset + 12 }}>
        <TouchableOpacity
          onPress={() => onReview(pastedText)}
          disabled={!canReview}
          activeOpacity={0.85}
          className={`flex-row items-center justify-between rounded-full px-6 py-4 ${canReview ? 'bg-gray-900' : 'bg-gray-300'}`}
        >
          <Text className="text-base font-outfit-semibold text-white">Review and add</Text>
          <View className="h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <ArrowRight size={15} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
