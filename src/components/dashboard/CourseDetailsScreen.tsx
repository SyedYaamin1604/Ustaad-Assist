import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import StepProgress from "./StepProgress";
import DayPicker from "./DayPicker";
import { CourseDetails } from "../../types/create-course";

const SEMESTER_OPTIONS = ["Fall 2026", "Spring 2027", "Summer 2027", "Winter 2027"];

interface CourseDetailsScreenProps {
  value: CourseDetails;
  onChange: (next: CourseDetails) => void;
  onBack: () => void;
  onContinue: () => void;
}

const CourseDetailsScreen = ({
  value,
  onChange,
  onBack,
  onContinue,
}: CourseDetailsScreenProps) => {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }}>
      {/* Header Navigation */}
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          className="h-12 w-12 items-center justify-center rounded-full bg-slate-200 shadow-sm"
        >
          <Text className="text-2xl font-outfit text-[var(--color-secondary)]">←</Text>
        </TouchableOpacity>
        <StepProgress current={1} total={3} />
      </View>

      <Text className="mb-1 text-2xl font-bold text-slate-900">Course details</Text>
      <Text className="mb-6 text-sm text-slate-500">
        Configure schedule and lecture parameters for this cohort.
      </Text>

      {/* Course Name Input */}
      <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="mb-1 text-xs uppercase text-slate-400">Course name</Text>
        <TextInput
          value={value.courseName}
          onChangeText={(t) => onChange({ ...value, courseName: t })}
          placeholder="e.g. Intro to Computer Science"
          placeholderTextColor="#94a3b8"
          className="text-lg font-semibold text-slate-900"
        />
      </View>

      {/* Semester Term Option Chips */}
      <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-xs uppercase text-slate-400">Semester term</Text>
        <View className="flex-row flex-wrap gap-2">
          {SEMESTER_OPTIONS.map((term) => {
            const isSelected = value.semesterTerm === term;
            return (
              <TouchableOpacity
                key={term}
                onPress={() => onChange({ ...value, semesterTerm: term })}
                className={`rounded-xl px-4 py-2.5 border ${
                  isSelected
                    ? "bg-slate-900 border-slate-900"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? "text-white" : "text-slate-700"
                  }`}
                >
                  {term}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Date Pickers */}
      <View className="mb-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-1 text-xs uppercase text-slate-400">Start date</Text>
          <TextInput
            value={value.startDate}
            onChangeText={(t) => onChange({ ...value, startDate: t })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94a3b8"
            className="text-base font-semibold text-slate-900"
          />
        </View>
        <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-1 text-xs uppercase text-slate-400">End date</Text>
          <TextInput
            value={value.endDate}
            onChangeText={(t) => onChange({ ...value, endDate: t })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94a3b8"
            className="text-base font-semibold text-slate-900"
          />
        </View>
      </View>

      {/* Day Picker */}
      <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-xs uppercase text-slate-400">Class days</Text>
        <DayPicker
          days={value.classDays}
          setDays={(classDays) => onChange({ ...value, classDays })}
        />
      </View>

      {/* AI Copilot Toggle */}
      <TouchableOpacity
        onPress={() => onChange({ ...value, aiCopilotEnabled: !value.aiCopilotEnabled })}
        activeOpacity={0.8}
        className="mb-6 flex-row items-center gap-3 rounded-2xl bg-emerald-100 p-4"
      >
        <Text className="flex-1 font-semibold text-slate-900">Ustaad AI Copilot</Text>
        <Switch
          value={value.aiCopilotEnabled}
          onValueChange={(v) => onChange({ ...value, aiCopilotEnabled: v })}
        />
      </TouchableOpacity>

      {/* Continue CTA */}
      <TouchableOpacity
        onPress={onContinue}
        disabled={!value.courseName || !value.semesterTerm || value.classDays.length === 0}
        className="items-center rounded-full bg-slate-900 py-4 disabled:opacity-50"
      >
        <Text className="font-semibold text-white">Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CourseDetailsScreen;