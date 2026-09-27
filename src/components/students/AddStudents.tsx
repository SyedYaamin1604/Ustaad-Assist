import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import {
  ArrowLeft,
  MoreVertical,
  Camera,
  ClipboardList,
  FileUp,
  Upload,
  Info,
  ArrowRight,
} from 'lucide-react-native';
import type { ParsedEntry } from '../../types/students-status';
import { useTabBarInset } from '../../utils/tab-bar';

type AddStudentsTab = 'camera' | 'paste' | 'import';

interface AddStudentsProps {
  courseName: string;
  courseCode: string;
  term: string;
  onBack: () => void;
  onOpenCamera: () => void;
  onUploadPdf: () => void;
  onChooseFile: () => void;
  /** Parsed roll-number/name pairs shown in the review preview below. */
  entries: ParsedEntry[];
  onReviewAndAdd: () => void;
}

const TABS: { key: AddStudentsTab; label: string; icon: typeof Camera }[] = [
  { key: 'camera', label: 'Camera', icon: Camera },
  { key: 'paste', label: 'Paste', icon: ClipboardList },
  { key: 'import', label: 'Import file', icon: FileUp },
];

function SegmentedTabs({
  active,
  onChange,
}: {
  active: AddStudentsTab;
  onChange: (tab: AddStudentsTab) => void;
}) {
  return (
    <View className="flex-row rounded-full bg-gray-100 p-1">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            activeOpacity={0.85}
            className={`flex-1 flex-row items-center justify-center rounded-full py-2.5 ${
              isActive ? 'bg-gray-900' : ''
            }`}
          >
            <Icon size={14} color={isActive ? '#FFFFFF' : '#6B7280'} />
            <Text
              className={`ml-1.5 text-xs font-outfit-semibold ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function CameraTab({
  onOpenCamera,
  onUploadPdf,
}: {
  onOpenCamera: () => void;
  onUploadPdf: () => void;
}) {
  return (
    <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-base font-outfit-bold text-gray-900">Photograph your class list</Text>
      <Text className="font-outfit mt-1.5 text-sm leading-5 text-gray-500">
        Capture the printed roster or the PDF the department sent. The app will extract roll
        numbers and names automatically.
      </Text>

      <View className="mt-5 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <Camera size={26} color="#4F46E5" />
        </View>
        <Text className="mt-3 text-xs font-outfit-medium text-gray-400">
          Align the printed list or PDF in the frame
        </Text>
      </View>

      <TouchableOpacity
        onPress={onOpenCamera}
        activeOpacity={0.85}
        className="mt-5 items-center rounded-full bg-gray-900 py-4"
      >
        <Text className="text-base font-outfit-semibold text-white">Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onUploadPdf}
        activeOpacity={0.85}
        className="mt-3 items-center rounded-full border border-gray-200 py-3.5"
      >
        <Text className="text-sm font-outfit-semibold text-gray-900">Upload PDF</Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row items-center">
        <Info size={13} color="#9CA3AF" />
        <Text className="font-outfit ml-1.5 text-xs text-gray-400">
          Use a well-lit photo with clear text and no glare.
        </Text>
      </View>
    </View>
  );
}

function PasteTab({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-base font-outfit-bold text-gray-900">Paste your roster</Text>
      <Text className="font-outfit mt-1.5 text-sm leading-5 text-gray-500">
        One student per line, as &quot;roll number, name&quot;.
      </Text>
      <TextInput
        multiline
        numberOfLines={6}
        value={value}
        onChangeText={onChange}
        placeholder={'CS-24-001, Ayesha Khan\nCS-24-002, Bilal Ahmed'}
        placeholderTextColor="#9CA3AF"
        className="font-outfit mt-4 h-32 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800"
        textAlignVertical="top"
      />
    </View>
  );
}

function ImportTab({ onChooseFile }: { onChooseFile: () => void }) {
  return (
    <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-base font-outfit-bold text-gray-900">Import a file</Text>
      <Text className="font-outfit mt-1.5 text-sm leading-5 text-gray-500">
        Upload the roster your department shared as Excel, CSV, or plain text.
      </Text>
      <TouchableOpacity
        onPress={onChooseFile}
        activeOpacity={0.85}
        className="mt-5 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10"
      >
        <Upload size={26} color="#4F46E5" />
        <Text className="mt-3 text-xs font-outfit-medium text-gray-400">
          Tap to choose a .csv, .xlsx, or .txt file
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AddStudents({
  courseName,
  courseCode,
  term,
  onBack,
  onOpenCamera,
  onUploadPdf,
  onChooseFile,
  entries,
  onReviewAndAdd,
}: AddStudentsProps) {
  const tabBarInset = useTabBarInset();
  const [activeTab, setActiveTab] = useState<AddStudentsTab>('camera');
  const [pastedText, setPastedText] = useState(
    entries.map((e) => `${e.rollNumber}, ${e.name}`).join('\n')
  );

  const previewLines = useMemo(
    () => pastedText.split('\n').map((l) => l.trim()).filter(Boolean),
    [pastedText]
  );

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: tabBarInset + 110 }} className="px-5 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBack}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={18} color="#111827" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-base font-outfit-bold text-gray-900">Add students</Text>
            <Text className="font-outfit text-xs text-gray-400">
              {courseName} {courseCode} · {term}
            </Text>
          </View>

          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <MoreVertical size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        <View className="mt-5">
          <SegmentedTabs active={activeTab} onChange={setActiveTab} />
        </View>

        {activeTab === 'camera' && (
          <CameraTab onOpenCamera={onOpenCamera} onUploadPdf={onUploadPdf} />
        )}
        {activeTab === 'paste' && <PasteTab value={pastedText} onChange={setPastedText} />}
        {activeTab === 'import' && <ImportTab onChooseFile={onChooseFile} />}

        {/* Parsed entries preview — always visible once there's something to review */}
        {previewLines.length > 0 && (
          <View className="mt-6">
            <View className="flex-row items-center justify-between px-1">
              <Text className="text-xs font-outfit-semibold tracking-wide text-gray-400">
                OR PASTE ENTRIES
              </Text>
              <View className="rounded-full bg-gray-100 px-2 py-0.5">
                <Text className="text-[11px] font-outfit-medium text-gray-500">
                  {previewLines.length} lines
                </Text>
              </View>
            </View>

            <View className="mt-2 rounded-2xl bg-white p-4 shadow-sm">
              <Text className="mb-2 text-xs font-outfit-semibold uppercase tracking-wide text-gray-400">
                Student Entries
              </Text>
              {previewLines.map((line, idx) => (
                <Text key={`${line}-${idx}`} className="py-0.5 font-outfit text-sm text-gray-700">
                  {line}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        className="absolute inset-x-0 bottom-0 bg-slate-50 px-5 pt-3"
        style={{ paddingBottom: tabBarInset + 12 }}
      >
        <TouchableOpacity
          onPress={onReviewAndAdd}
          disabled={previewLines.length === 0}
          activeOpacity={0.85}
          className={`flex-row items-center justify-between rounded-full px-6 py-4 ${
            previewLines.length === 0 ? 'bg-gray-300' : 'bg-gray-900'
          }`}
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