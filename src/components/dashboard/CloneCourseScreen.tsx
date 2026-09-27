import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { CourseListItem, DayName } from "@/api/types";
import { DateField } from "@/components/ui/DateField";
import { classDaysLabel } from "@/utils/date";
import { plural } from "@/utils/format";
import DayPicker from "./DayPicker";

export interface CloneForm {
  sourceId: string | null;
  semester: string;
  startDate: string;
  endDate: string;
  classDays: DayName[];
}

const SOURCE_BG = ["bg-[var(--color-pink)]", "bg-[var(--color-yellow)]", "bg-[var(--color-emerald)]", "bg-[var(--color-blue)]"];

/** What POST /courses/:id/clone actually carries over — it is not optional. */
const COPIED = [
  { icon: "list" as const, title: "Topics and priorities", note: "Reset to not-yet-taught for the new term" },
  { icon: "percent" as const, title: "Weightage & grade scale", note: "Quizzes, midterm, final and the letter grades" },
  { icon: "calendar" as const, title: "Public holidays", note: "Worked out again for the new dates" },
];

interface CloneCourseScreenProps {
  sources: CourseListItem[];
  form: CloneForm;
  onChange: (next: CloneForm) => void;
  onSelectSource: (course: CourseListItem) => void;
  onBack: () => void;
  onSubmit: () => void;
  busy?: boolean;
}

const CloneCourseScreen = ({ sources, form, onChange, onSelectSource, onBack, onSubmit, busy = false }: CloneCourseScreenProps) => {
  const canSubmit = !!form.sourceId && form.classDays.length > 0 && !busy;

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onBack} className="h-12 w-12 items-center justify-center rounded-full bg-slate-300">
          <Text className="text-3xl font-outfit">←</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-1 text-2xl font-outfit-bold text-slate-900">Clone a course</Text>
      <Text className="font-outfit mb-6 text-sm text-slate-500">Start next semester from the preparation you already did.</Text>

      <Text className="mb-3 font-outfit-semibold text-slate-900">Select source course</Text>
      <View className="mb-6 gap-3">
        {sources.length === 0 && (
          <Text className="font-outfit text-sm text-slate-500">You have no courses to clone yet.</Text>
        )}
        {sources.map((course, index) => {
          const selected = form.sourceId === course.id;
          return (
            <TouchableOpacity
              key={course.id}
              onPress={() => onSelectSource(course)}
              className={`rounded-2xl px-5 py-6 ${SOURCE_BG[index % SOURCE_BG.length]} ${selected ? "border-2 border-slate-900" : ""}`}
            >
              {course.semester && (
                <Text className="self-start mb-2 text-[10px] font-outfit-semibold uppercase bg-[var(--color-primary)] px-2 py-1 rounded-lg text-[var(--font-secondary)]/90">
                  {course.semester}
                </Text>
              )}
              <Text className="text-lg font-outfit-bold text-[var(--font-secondary)]">
                {[course.name, course.code].filter(Boolean).join(" ")}
              </Text>
              <Text className="font-outfit text-sm text-[var(--font-secondary)]/90">
                {plural(course.topic_count, "topic")} · {classDaysLabel(course.class_days)} · {plural(course.student_count, "student")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mb-6 rounded-2xl bg-white px-5 py-6">
        <Text className="font-outfit-semibold text-slate-900">What gets copied</Text>
        <Text className="mb-3 font-outfit text-slate-500">Students, attendance and marks stay with the old semester.</Text>
        {COPIED.map((item) => (
          <View key={item.title} className="flex-row items-center py-2">
            <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-slate-100">
              <Feather name={item.icon} size={15} color="#0F172A" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-outfit-semibold text-slate-800">{item.title}</Text>
              <Text className="text-[12px] font-outfit text-slate-400">{item.note}</Text>
            </View>
            <Feather name="check" size={16} color="#059669" />
          </View>
        ))}
      </View>

      <View className="mb-6 rounded-2xl bg-white p-6">
        <Text className="mb-3 text-xl font-outfit-semibold text-[var(--font-secondary)]">New semester</Text>

        <View className="mb-3 rounded-xl bg-slate-50 p-3">
          <Text className="font-outfit mb-1 text-[10px] uppercase text-slate-400">Semester name</Text>
          <TextInput
            className="font-outfit text-base text-slate-900"
            value={form.semester}
            placeholder="e.g. Spring 2027"
            placeholderTextColor="#94a3b8"
            onChangeText={(semester) => onChange({ ...form, semester })}
          />
        </View>

        <View className="mb-3 flex-row gap-3">
          <DateField className="flex-1 bg-slate-50 shadow-none" label="Start date" value={form.startDate} onChange={(startDate) => onChange({ ...form, startDate })} />
          <DateField className="flex-1 bg-slate-50 shadow-none" label="End date" value={form.endDate} onChange={(endDate) => onChange({ ...form, endDate })} />
        </View>

        <Text className="font-outfit mb-2 text-[10px] uppercase text-slate-400">Recurring class days</Text>
        <DayPicker days={form.classDays} setDays={(classDays) => onChange({ ...form, classDays })} />
      </View>

      <TouchableOpacity
        onPress={onSubmit}
        disabled={!canSubmit}
        className={`items-center rounded-full bg-slate-900 py-4 ${canSubmit ? "" : "opacity-50"}`}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text className="font-outfit-semibold text-white">Clone and generate plan →</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CloneCourseScreen;
