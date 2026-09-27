import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import type { Course } from '@/api/types';
import { DateField } from '@/components/ui/DateField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export type CourseInfoEdit = Pick<Course, 'name' | 'code' | 'semester' | 'start_date' | 'end_date'>;

interface EditCourseInfoSheetProps {
  visible: boolean;
  course: Course;
  saving: boolean;
  onClose: () => void;
  onSave: (edit: CourseInfoEdit) => void;
}

// Parent should remount (key) it each time it opens, so it starts from the saved values.
export default function EditCourseInfoSheet({ visible, course, saving, onClose, onSave }: EditCourseInfoSheetProps) {
  const [name, setName] = useState(course.name);
  const [code, setCode] = useState(course.code ?? '');
  const [semester, setSemester] = useState(course.semester ?? '');
  const [startDate, setStartDate] = useState(course.start_date);
  const [endDate, setEndDate] = useState(course.end_date);

  const problem =
    name.trim() === '' ? 'Enter the course name.' : endDate <= startDate ? 'The end date must be after the start date.' : null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="bg-[#F3F4FA] rounded-t-[28px] px-5 pt-5 pb-8 max-h-[92%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-outfit-bold text-xl text-black">Course info</Text>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-white items-center justify-center">
              <Feather name="x" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {[
              { label: 'Course name', value: name, set: setName, placeholder: 'Database Systems' },
              { label: 'Course code', value: code, set: setCode, placeholder: 'CS-301' },
              { label: 'Semester', value: semester, set: setSemester, placeholder: 'Fall 2026' },
            ].map((field) => (
              <View key={field.label} className="mb-3 rounded-2xl bg-white p-4">
                <Text className="font-outfit mb-1 text-xs uppercase text-slate-400">{field.label}</Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  placeholder={field.placeholder}
                  placeholderTextColor="#94a3b8"
                  className="text-base font-outfit-semibold text-slate-900"
                />
              </View>
            ))}

            <View className="mb-3 flex-row gap-3">
              <DateField className="flex-1" label="Start date" value={startDate} onChange={setStartDate} />
              <DateField className="flex-1" label="End date" value={endDate} onChange={setEndDate} />
            </View>

            <Text className="font-outfit text-xs text-slate-500 mb-4">
              Changing the dates rebuilds the plan and adds any public holidays the new range covers.
            </Text>
            {problem && <Text className="font-outfit text-xs text-red-600 mb-3">{problem}</Text>}

            <PrimaryButton
              label={saving ? 'Saving...' : 'Save course info'}
              icon="check"
              disabled={!!problem || saving}
              onPress={() =>
                onSave({
                  name: name.trim(),
                  code: code.trim() || null,
                  semester: semester.trim() || null,
                  start_date: startDate,
                  end_date: endDate,
                })
              }
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
