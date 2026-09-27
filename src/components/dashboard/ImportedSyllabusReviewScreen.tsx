import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { GradingCriterion, Topic } from "../../types/create-course";

interface ImportedSyllabusReviewScreenProps {
  topics: Topic[];
  onChangeTopics: (next: Topic[]) => void;
  onAddTopic: () => void;
  gradingCriteria: GradingCriterion[];
  onChangeCriterion: (id: string, delta: number) => void;
  onSave: () => void;
}

const ImportedSyllabusReviewScreen = ({
  topics,
  onChangeTopics,
  onAddTopic,
  gradingCriteria,
  onChangeCriterion,
  onSave,
}: ImportedSyllabusReviewScreenProps) => {
  const total = gradingCriteria.reduce((s, c) => s + c.weight, 0);

  const updateTitle = (id: string, title: string) =>
    onChangeTopics(topics.map((t) => (t.id === id ? { ...t, title } : t)));

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }}>
      <Text className="mb-4 text-sm text-slate-500">
        We parsed {topics.length} topics and syllabus grading criteria from your outline.
      </Text>

      <View className="mb-6 rounded-2xl bg-white p-2">
        {topics.map((topic) => (
          <View key={topic.id} className="flex-row items-center gap-3 p-2">
            <TextInput
              value={topic.title}
              onChangeText={(t) => updateTitle(topic.id, t)}
              className="flex-1 text-sm font-semibold text-slate-900"
            />
          </View>
        ))}
        <TouchableOpacity onPress={onAddTopic} className="items-center py-2">
          <Text className="text-sm font-semibold text-slate-700">+ Add topic</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6 rounded-2xl bg-violet-100 p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-semibold text-slate-900">Grading Criteria Weightage</Text>
          <Text className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Total: {total}%
          </Text>
        </View>

        {gradingCriteria.map((c) => (
          <View
            key={c.id}
            className="mb-2 flex-row items-center justify-between rounded-full bg-white/70 px-4 py-2.5"
          >
            <Text className="text-sm font-medium text-slate-800">{c.label}</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => onChangeCriterion(c.id, -5)}
                className="h-7 w-7 items-center justify-center rounded-full bg-white"
              >
                <Text>−</Text>
              </TouchableOpacity>
              <Text className="w-9 text-center text-sm font-semibold text-slate-900">
                {c.weight}%
              </Text>
              <TouchableOpacity
                onPress={() => onChangeCriterion(c.id, 5)}
                className="h-7 w-7 items-center justify-center rounded-full bg-white"
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onSave}
        disabled={total !== 100}
        className="items-center rounded-full bg-slate-900 py-4"
      >
        <Text className="font-semibold text-white">Looks good, save ✓</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default ImportedSyllabusReviewScreen;