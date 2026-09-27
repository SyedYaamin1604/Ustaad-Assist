import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import StepProgress from "./StepProgress";
import { Topic } from "../../types/create-course";

interface TopicsScreenProps {
    topics: Topic[];
    onChange: (next: Topic[]) => void;
    onBack: () => void;
    onContinue: () => void;
    onImportOutline: () => void;
}

const TopicsScreens = ({
    topics,
    onChange,
    onBack,
    onContinue,
    onImportOutline,
}: TopicsScreenProps) => {
    const updateTitle = (id: string, title: string) =>
        onChange(topics.map((t) => (t.id === id ? { ...t, title } : t)));

    return (
        <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 24 }}>
            <View className="mb-6 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={onBack}
                    className="h-12 w-12 items-center justify-center rounded-full bg-slate-200"
                >
                    <Text className="text-2xl font-outfit text-[var(--color-secondary)]">←</Text>
                </TouchableOpacity>
                <StepProgress current={2} total={3} />
            </View>

            <Text className="mb-1 text-2xl font-outfit-bold text-slate-900">Your topics</Text>
            <Text className="font-outfit mb-6 text-sm text-slate-500">
                Enter topics in order of delivery or paste your course syllabus.
            </Text>

            <View className="mb-4 rounded-2xl bg-white p-4">
                {topics.map((topic, i) => (
                    <View key={topic.id} className="flex-row items-center gap-3 py-2">
                        <Text className="w-5 text-sm font-outfit-semibold text-slate-400">{i + 1}.</Text>
                        <TextInput
                            value={topic.title}
                            onChangeText={(t) => updateTitle(topic.id, t)}
                            className="flex-1 text-sm font-outfit-medium text-slate-800"
                        />
                    </View>
                ))}
                <Text className="mt-2 text-xs font-outfit-medium text-emerald-700">
                    {topics.length} topics detected
                </Text>
            </View>

            <TouchableOpacity
                onPress={onImportOutline}
                className="mb-6 items-center rounded-full bg-white py-4"
            >
                <Text className="font-outfit-semibold text-slate-900">
                    📄 Import course outline instead
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onContinue}
                disabled={topics.length === 0}
                className="items-center rounded-full bg-slate-900 py-4"
            >
                <Text className="font-outfit-semibold text-white">Continue →</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default TopicsScreens;