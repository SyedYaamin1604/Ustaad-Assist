import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, Share2, UserPlus } from 'lucide-react-native';

import type { StudentWithAttendance } from '@/api/types';
import { useTabBarInset } from '@/utils/tab-bar';
import StudentListItem from './StudentListItem';

interface StudentsListProps {
  courseCode: string;
  courseName: string;
  semester: string | null;
  students: StudentWithAttendance[];
  refreshing: boolean;
  onRefresh: () => void;
  onSelectStudent: (student: StudentWithAttendance) => void;
  onAddStudents: () => void;
  onShare: () => void;
}

export default function StudentsList({
  courseCode,
  courseName,
  semester,
  students,
  refreshing,
  onRefresh,
  onSelectStudent,
  onAddStudents,
  onShare,
}: StudentsListProps) {
  const [query, setQuery] = useState('');
  const tabBarInset = useTabBarInset();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.roll_no.toLowerCase().includes(q));
  }, [query, students]);

  const belowCount = students.filter((s) => s.below_threshold).length;

  return (
    <View className="flex-1 bg-slate-50 px-5 pt-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={onAddStudents} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <UserPlus size={17} color="#111827" />
        </TouchableOpacity>

        <View className="rounded-full bg-white px-3 py-1.5 shadow-sm">
          <Text className="text-xs font-outfit-semibold text-gray-600">{[courseCode, semester].filter(Boolean).join(' · ')}</Text>
        </View>

        <TouchableOpacity onPress={onShare} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <Share2 size={17} color="#111827" />
        </TouchableOpacity>
      </View>

      <Text className="mt-5 text-3xl font-outfit-bold text-gray-900">Students</Text>
      <Text className="font-outfit mt-1 text-sm text-gray-400">
        {courseName} · {students.length} Students{belowCount > 0 ? ` · ${belowCount} below threshold` : ''}
      </Text>

      <View className="mt-4 flex-row items-center rounded-full bg-white px-4 py-3 shadow-sm">
        <Search size={16} color="#9CA3AF" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or roll number..."
          placeholderTextColor="#9CA3AF"
          className="font-outfit ml-2 flex-1 text-sm text-gray-800"
        />
      </View>

      <ScrollView
        className="mt-5"
        contentContainerStyle={{ paddingBottom: tabBarInset + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.map((student) => (
          <StudentListItem key={student.id} student={student} onPress={onSelectStudent} />
        ))}

        {filtered.length === 0 && (
          <Text className="font-outfit mt-8 text-center text-sm text-gray-400">No students match &quot;{query}&quot;.</Text>
        )}
      </ScrollView>
    </View>
  );
}
