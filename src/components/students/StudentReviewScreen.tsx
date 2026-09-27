import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { useTabBarInset } from '@/utils/tab-bar';
import { ISSUE_TEXT, isBlocking, newRow, rowIssues, type RosterRow } from '@/utils/roster';

interface StudentReviewScreenProps {
  rows: RosterRow[];
  onChange: (rows: RosterRow[]) => void;
  saving: boolean;
  onBack: () => void;
  /** Go back to capture another page; rows are kept. */
  onAddPage: () => void;
  onConfirm: () => void;
}

/**
 * Nothing extracted or pasted is saved until the teacher confirms it here.
 * This screen is mandatory — see utils/roster.ts for why.
 */
export default function StudentReviewScreen({ rows, onChange, saving, onBack, onAddPage, onConfirm }: StudentReviewScreenProps) {
  const tabBarInset = useTabBarInset();
  const issues = rowIssues(rows);
  const blockingCount = [...issues.values()].filter((list) => list.some(isBlocking)).length;
  const canSave = rows.length > 0 && blockingCount === 0 && !saving;

  const update = (key: string, patch: Partial<RosterRow>) =>
    // An edited row has been checked by the teacher, so it is no longer low-confidence.
    onChange(rows.map((r) => (r.key === key ? { ...r, ...patch, confidence: 1 } : r)));

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingBottom: tabBarInset + 110 }} className="px-5 pt-4" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft size={18} color="#111827" />
          </TouchableOpacity>
          <View className="ml-4 flex-1">
            <Text className="text-base font-outfit-bold text-gray-900">Review class list</Text>
            <Text className="font-outfit text-xs text-gray-400">
              {rows.length} {rows.length === 1 ? 'student' : 'students'} · check every roll number before saving
            </Text>
          </View>
        </View>

        {blockingCount > 0 && (
          <View className="mt-4 flex-row items-center rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3">
            <Feather name="alert-triangle" size={16} color="#B45309" />
            <Text className="ml-2 flex-1 font-outfit-medium text-[13px] text-amber-800">
              {blockingCount} {blockingCount === 1 ? 'row needs' : 'rows need'} fixing before the list can be saved.
            </Text>
          </View>
        )}

        <View className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <View className="flex-row border-b border-gray-100 px-4 py-2.5">
            <Text className="w-[38%] text-[11px] font-outfit-semibold uppercase tracking-wide text-gray-400">Roll no</Text>
            <Text className="flex-1 text-[11px] font-outfit-semibold uppercase tracking-wide text-gray-400">Name</Text>
          </View>

          {rows.map((row) => {
            const rowProblems = issues.get(row.key) ?? [];
            const blocking = rowProblems.some(isBlocking);
            return (
              <View
                key={row.key}
                className={`border-b border-gray-100 px-4 py-2 ${blocking ? 'bg-red-50' : rowProblems.length ? 'bg-amber-50' : ''}`}
              >
                <View className="flex-row items-center">
                  <TextInput
                    value={row.roll_no}
                    onChangeText={(roll_no) => update(row.key, { roll_no })}
                    placeholder="Roll no"
                    placeholderTextColor="#CBD5E1"
                    autoCapitalize="characters"
                    className="w-[38%] pr-2 font-outfit-semibold text-sm text-gray-900"
                  />
                  <TextInput
                    value={row.name}
                    onChangeText={(name) => update(row.key, { name })}
                    placeholder="Full name"
                    placeholderTextColor="#CBD5E1"
                    autoCapitalize="words"
                    className="flex-1 font-outfit text-sm text-gray-800"
                  />
                  <Pressable
                    onPress={() => onChange(rows.filter((r) => r.key !== row.key))}
                    hitSlop={8}
                    accessibilityLabel="Delete row"
                    className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                  >
                    <Feather name="trash-2" size={14} color="#64748B" />
                  </Pressable>
                </View>
                {rowProblems.length > 0 && (
                  <Text className={`mt-1 font-outfit text-[11px] ${blocking ? 'text-red-600' : 'text-amber-700'}`}>
                    {rowProblems.map((issue) => ISSUE_TEXT[issue]).join(' · ')}
                  </Text>
                )}
              </View>
            );
          })}

          <Pressable onPress={() => onChange([...rows, newRow()])} className="flex-row items-center justify-center py-3.5">
            <Feather name="plus" size={14} color="#0F172A" />
            <Text className="ml-1.5 font-outfit-semibold text-sm text-gray-900">Add a row</Text>
          </Pressable>
        </View>

        <TouchableOpacity onPress={onAddPage} className="mt-4 flex-row items-center justify-center rounded-full border border-gray-200 bg-white py-3.5">
          <Feather name="camera" size={15} color="#111827" />
          <Text className="ml-2 font-outfit-semibold text-sm text-gray-900">Capture another page</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="absolute inset-x-0 bottom-0 bg-slate-50 px-5 pt-3" style={{ paddingBottom: tabBarInset + 12 }}>
        <TouchableOpacity
          onPress={onConfirm}
          disabled={!canSave}
          activeOpacity={0.85}
          className={`flex-row items-center justify-center rounded-full py-4 ${canSave ? 'bg-gray-900' : 'bg-gray-300'}`}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-outfit-semibold text-white">
              Confirm and save {rows.length} {rows.length === 1 ? 'student' : 'students'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
