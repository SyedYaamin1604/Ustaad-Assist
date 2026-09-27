import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import DayPicker from "./DayPicker";
import { CloneCourseFormData, SOURCE_COURSES } from "../../types/create-course";

interface CloneCourseScreenProps {
  onBack: () => void;
  onComplete: (data: CloneCourseFormData) => void;
}

const CloneCourseScreen = ({ onBack, onComplete }: CloneCourseScreenProps) => {
  const [form, setForm] = useState<CloneCourseFormData>({
    sourceCourseId: SOURCE_COURSES[0].id,
    copyOptions: {
      topicsAndPriorities: true,
      weightageAndGrading: true,
      assessmentStructure: true,
    },
    details: {
      startDate: "2026-09-01",
      endDate: "2026-12-20",
      classDays: ["T", "F"],
    },
  });

  const toggleCopy = (key: keyof CloneCourseFormData["copyOptions"]) =>
    setForm((f) => ({ ...f, copyOptions: { ...f.copyOptions, [key]: !f.copyOptions[key] } }));

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-12 w-12 items-center justify-center rounded-full bg-slate-300"
        >
          <Text className="text-3xl font-outfit">←</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-1 text-2xl font-bold text-slate-900">Clone a course</Text>
      <Text className="mb-6 text-sm text-slate-500">
        Duplicate syllabus, weightage & pacing to a new cohort
      </Text>

      <Text className="mb-3 font-semibold text-slate-900">Select source course</Text>
      <View className="mb-6 gap-3 ">
        {SOURCE_COURSES.map((course) => {
          const selected = form.sourceCourseId === course.id;
          return (
            <TouchableOpacity
              key={course.id}
              onPress={() => setForm((f) => ({ ...f, sourceCourseId: course.id }))}
              className={`rounded-2xl px-5 py-7 ${course.bg} ${selected ? "border-2 border-slate-900" : ""
                }`}
            >
              <Text className="self-start mb-2 text-[10px] font-semibold uppercase bg-[var(--color-primary)] w-30 px-2 py-1 rounded-lg text-[var(--font-secondary)]/90">
                {course.badge}
              </Text>
              <Text className="text-lg font-bold text-[var(--font-secondary)]">{course.title}</Text>
              <Text className="text-sm text-[var(--font-secondary)]/90">{course.meta}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="mb-6 rounded-2xl bg-white px-5 py-7">
        <Text className="font-semibold text-slate-900">What gets copied</Text>
        <Text className="mb-2 font-outfit text-slate-500">Choose elements to carry forward into the clone</Text>

        <View className="flex-row items-center justify-between py-2">
          <View className="flex-column items-start justify-start">
            <Text className="text-[14px] mb-1 font-semibold text-slate-800">Topics and priorities</Text>
            <Text className="text-[12px] font-semibold text-slate-400">9 topics, delivery pacing order</Text>
          </View>
          <Switch
            value={form.copyOptions.topicsAndPriorities}
            onValueChange={() => toggleCopy("topicsAndPriorities")}
          />
        </View>
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-column items-start justify-start">

            <Text className="text-[14px] font-semibold text-slate-800">
              Weightage & grading scheme
            </Text>
            <Text className="text-[12px] font-semibold text-slate-400">
              Quizzes 10%, Mid 30%, etc.
            </Text>
          </View>
          <Switch
            value={form.copyOptions.weightageAndGrading}
            onValueChange={() => toggleCopy("weightageAndGrading")}
          />
        </View>
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-column items-start justify-start">
            <Text className="text-[14px] font-semibold text-slate-800">Assessment structure</Text>
            <Text className="text-[12px] font-semibold text-slate-400">Draft quizzes & assignment milestones</Text>
          </View>
          <Switch
            value={form.copyOptions.assessmentStructure}
            onValueChange={() => toggleCopy("assessmentStructure")}
          />
        </View>
      </View>

      <View className="mb-6 rounded-2xl bg-white p-6">
        <Text className="mb-3 text-xl font-semibold text-[var(--font-secondary)]">New semester schedule</Text>
        <View className="mb-3 flex-row gap-3">
          <View className="flex-1 rounded-xl bg-slate-50 p-3">
            <Text className="mb-1 text-[10px] uppercase text-slate-400">Start date</Text>
            <TextInput
              value={form.details.startDate}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, details: { ...f.details, startDate: t } }))
              }
            />
          </View>
          <View className="flex-1 rounded-xl bg-slate-50 p-3">
            <Text className="mb-1 text-[10px] uppercase text-slate-400">End date</Text>
            <TextInput
              value={form.details.endDate}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, details: { ...f.details, endDate: t } }))
              }
            />
          </View>
        </View>
        <Text className="mb-2 text-[10px] uppercase text-slate-400">Recurring class days</Text>
        <DayPicker
          days={form.details.classDays}
          setDays={(classDays) =>
            setForm((f) => ({ ...f, details: { ...f.details, classDays } }))
          }
        />
      </View>

      <TouchableOpacity
        onPress={() => onComplete(form)}
        disabled={!form.sourceCourseId}
        className="items-center rounded-full bg-slate-900 py-4"
      >
        <Text className="font-semibold text-white">Clone and generate plan →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default CloneCourseScreen;