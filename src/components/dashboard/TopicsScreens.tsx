import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import StepProgress from "./StepProgress";

/** The server splits the same way: trim each line and drop the blank ones. */
export function countTopicLines(raw: string): number {
  return raw.split("\n").filter((line) => line.trim() !== "").length;
}

interface TopicsScreenProps {
  /** The whole textarea, one topic per line — sent to the backend as-is. */
  value: string;
  onChange: (next: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onImportOutline: () => void;
  busy?: boolean;
  importing?: boolean;
}

const TopicsScreens = ({ value, onChange, onBack, onContinue, onImportOutline, busy = false, importing = false }: TopicsScreenProps) => {
  const count = countTopicLines(value);
  const canContinue = count > 0 && !busy;

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onBack} className="h-12 w-12 items-center justify-center rounded-full bg-slate-200">
          <Text className="text-2xl font-outfit text-[var(--color-secondary)]">←</Text>
        </TouchableOpacity>
        <StepProgress current={2} total={3} />
      </View>

      <Text className="mb-1 text-2xl font-outfit-bold text-slate-900">Your topics</Text>
      <Text className="font-outfit mb-6 text-sm text-slate-500">
        One topic per line, in the order you teach them. Just the titles — you can say how many classes each needs
        after you see the plan.
      </Text>

      <View className="mb-4 rounded-2xl bg-white p-4">
        <TextInput
          multiline
          value={value}
          onChangeText={onChange}
          placeholder={"Introduction to Database Systems\nThe Relational Model\nEntity Relationship Modelling\nSQL: Queries and Joins"}
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
          className="min-h-[220px] text-sm font-outfit-medium leading-6 text-slate-800"
        />
        <Text className={`mt-2 text-xs font-outfit-medium ${count > 0 ? "text-emerald-700" : "text-slate-400"}`}>
          {count === 1 ? "1 topic detected" : `${count} topics detected`}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onImportOutline}
        disabled={importing}
        className="mb-6 flex-row items-center justify-center rounded-full bg-white py-4"
      >
        {importing ? (
          <ActivityIndicator color="#0F172A" />
        ) : (
          <Text className="font-outfit-semibold text-slate-900">📄 Import course outline instead</Text>
        )}
      </TouchableOpacity>

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

export default TopicsScreens;
