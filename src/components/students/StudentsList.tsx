import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ArrowLeft, Share2, Search } from 'lucide-react-native';
import StudentListItem from './StudentListItem';
import type { Student } from '../../types/students-status';
import { useTabBarInset } from '../../utils/tab-bar';

interface StudentsListProps {
  courseCode: string;
  section: string;
  courseName: string;
  students: Student[];
  onBack: () => void;
  onSelectStudent: (student: Student) => void;
  onShare: () => void;
}

export default function StudentsList({
  courseCode,
  section,
  courseName,
  students,
  onBack,
  onSelectStudent,
  onShare,
}: StudentsListProps) {
  const [query, setQuery] = useState('');
  const tabBarInset = useTabBarInset();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
    );
  }, [query, students]);

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

        <View className="rounded-full bg-white px-3 py-1.5 shadow-sm">
          <Text className="text-xs font-semibold text-gray-600">
            {courseCode} · Section {section}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onShare}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Share2 size={17} color="#111827" />
        </TouchableOpacity>
      </View>

      <Text className="mt-5 text-3xl font-extrabold text-gray-900">Students</Text>
      <Text className="mt-1 text-sm text-gray-400">
        {courseName} {courseCode} · {students.length} Students
      </Text>

      <View className="mt-4 flex-row items-center rounded-full bg-white px-4 py-3 shadow-sm">
        <Search size={16} color="#9CA3AF" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or roll number..."
          placeholderTextColor="#9CA3AF"
          className="ml-2 flex-1 text-sm text-gray-800"
        />
      </View>

      <ScrollView
        className="mt-5"
        contentContainerStyle={{ paddingBottom: tabBarInset + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((student) => (
          <StudentListItem key={student.id} student={student} onPress={onSelectStudent} />
        ))}

        {filtered.length === 0 && (
          <Text className="mt-8 text-center text-sm text-gray-400">
            No students match &quot;{query}&quot;.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}