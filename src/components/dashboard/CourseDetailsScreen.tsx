import React from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { DateField } from "@/components/ui/DateField";
import type { CourseDetailsForm } from "@/types/create-course";
import DayPicker from "./DayPicker";
import StepProgress from "./StepProgress";

/** Suggestions only — the backend stores any text. */
function semesterOptions(): string[] {
  const year = new Date().getFullYear();
  return [`Fall ${year}`, `Spring ${year + 1}`, `Summer ${year + 1}`, `Fall ${year + 1}`];
}

interface CourseDetailsScreenProps {
  value: CourseDetailsForm;
  onChange: (next: CourseDetailsForm) => void;
  onBack: () => void;
  onContinue: () => void;
  busy?: boolean;
}

const CourseDetailsScreen = ({ value, onChange, onBack, onContinue, busy = false }: CourseDetailsScreenProps) => {
  const canContinue = value.name.trim() !== "" && value.classDays.length > 0 && !busy;

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onBack} className="h-12 w-12 items-center justify-center rounded-full bg-slate-200 shadow-sm">
          <Text className="text-2xl font-outfit text-[var(--color-secondary)]">←</Text>
        </TouchableOpacity>
        <StepProgress current={1} total={3} />
      </View>

      <Text className="mb-1 text-2xl font-outfit-bold text-slate-900">Course details</Text>
      <Text className="font-outfit mb-6 text-sm text-slate-500">
        Just the basics. Everything else is asked for later, when it is needed.
      </Text>

      <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="font-outfit mb-1 text-xs uppercase text-slate-400">Course name</Text>
        <TextInput
          value={value.name}
          onChangeText={(name) => onChange({ ...value, name })}
          placeholder="e.g. Database Systems"
          placeholderTextColor="#94a3b8"
          className="text-lg font-outfit-semibold text-slate-900"
        />
      </View>

      <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="font-outfit mb-1 text-xs uppercase text-slate-400">Course code (optional)</Text>
        <TextInput
          value={value.code}
          onChangeText={(code) => onChange({ ...value, code })}
          placeholder="e.g. CS-301"
          placeholderTextColor="#94a3b8"
          autoCapitalize="characters"
          className="text-lg font-outfit-semibold text-slate-900"
        />
      </View>

      <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="font-outfit mb-3 text-xs uppercase text-slate-400">Semester term (optional)</Text>
        <View className="flex-row flex-wrap gap-2">
          {semesterOptions().map((term) => {
            const isSelected = value.semester === term;
            return (
              <TouchableOpacity
                key={term}
                onPress={() => onChange({ ...value, semester: isSelected ? "" : term })}
                className={`rounded-xl px-4 py-2.5 border ${
                  isSelected ? "bg-slate-900 border-slate-900" : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text className={`text-sm font-outfit-semibold ${isSelected ? "text-white" : "text-slate-700"}`}>{term}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="mb-4 flex-row gap-3">
        <DateField
          className="flex-1"
          label="Start date"
          value={value.startDate}
          onChange={(startDate) => onChange({ ...value, startDate })}
        />
        <DateField
          className="flex-1"
          label="End date"
          value={value.endDate}
          onChange={(endDate) => onChange({ ...value, endDate })}
        />
      </View>

      <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <Text className="font-outfit mb-3 text-xs uppercase text-slate-400">Class days</Text>
        <DayPicker days={value.classDays} setDays={(classDays) => onChange({ ...value, classDays })} />
      </View>

      <TouchableOpacity
        onPress={onContinue}
        disabled={!canContinue}
        className={`items-center rounded-full bg-slate-900 py-4 ${canContinue ? "" : "opacity-50"}`}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text className="font-outfit-semibold text-white">Continue →</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CourseDetailsScreen;
