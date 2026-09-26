import { AISuggestionBanner } from "@/components/assessment/AISuggestionBanner";
import { MarksStepper } from "@/components/assessment/MarksStepper";
import { TopicChip } from "@/components/assessment/TopicChip";
import { DateTimePickerModal } from "@/components/ui/DateTimePickerModal";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { AssessmentDraft, AssessmentItem, AssessmentTypeOption } from "@/types/assessment";
import { formatDateTime } from "@/utils/date";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface CreateAssessmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (draft: AssessmentDraft) => void;
  editingItem?: AssessmentItem | null;
}

const TYPE_OPTIONS: AssessmentTypeOption[] = ["Quiz", "Assignment", "Midterm", "Final", "Participation"];
const BASE_TOPICS = ["SQL Basics", "SQL Joins", "Normalization"];
const DEFAULT_DATE = new Date(2026, 8, 25, 10, 0);

export function CreateAssessmentModal({ visible, onClose, onSubmit, editingItem }: CreateAssessmentModalProps) {
  const isEditing = !!editingItem;

  const [type, setType] = useState<AssessmentTypeOption>("Quiz");
  const [title, setTitle] = useState("Quiz 2: SQL Joins & Subqueries");
  const [marks, setMarks] = useState(15);
  const [scheduledDate, setScheduledDate] = useState(DEFAULT_DATE);
  const [availableTopics, setAvailableTopics] = useState<string[]>(BASE_TOPICS);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(BASE_TOPICS);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isAddingTopic, setAddingTopic] = useState(false);
  const [newTopicText, setNewTopicText] = useState("");

  // Reset / prefill whenever the sheet opens
  useEffect(() => {
    if (!visible) return;
    if (editingItem) {
      setType(editingItem.type);
      setTitle(editingItem.title);
      setMarks(Number(editingItem.marksLabel.replace(/\D/g, "")) || 15);
      setScheduledDate(DEFAULT_DATE);
      setAvailableTopics(editingItem.topics?.length ? editingItem.topics : BASE_TOPICS);
      setSelectedTopics(editingItem.topics ?? BASE_TOPICS);
    } else {
      setType("Quiz");
      setTitle("Quiz 2: SQL Joins & Subqueries");
      setMarks(15);
      setScheduledDate(DEFAULT_DATE);
      setAvailableTopics(BASE_TOPICS);
      setSelectedTopics(BASE_TOPICS);
    }
    setSuggestionDismissed(false);
    setAddingTopic(false);
    setNewTopicText("");
  }, [visible, editingItem]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const confirmAddTopic = () => {
    const trimmed = newTopicText.trim();
    if (trimmed.length > 0 && !availableTopics.includes(trimmed)) {
      setAvailableTopics((prev) => [...prev, trimmed]);
      setSelectedTopics((prev) => [...prev, trimmed]);
    }
    setNewTopicText("");
    setAddingTopic(false);
  };

  const acceptDateSuggestion = () => {
    setScheduledDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      return next;
    });
    setSuggestionDismissed(true);
  };

  const handleSubmit = () => {
    onSubmit({
      id: editingItem?.id,
      type,
      title,
      marks,
      topics: selectedTopics,
      scheduledDate,
    });
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="absolute inset-0" onPress={onClose} />

          <View className="bg-white rounded-t-[28px] px-5 pt-5 pb-8 max-h-[92%]">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="font-outfit-bold text-xl text-black">
                {isEditing ? "Edit Assessment" : "Create Assessment"}
              </Text>
              <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center">
                <Feather name="x" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="font-outfit-medium text-[13px] text-slate-500 mb-2">Assessment Type</Text>
              <SegmentedPills options={TYPE_OPTIONS} value={type} onChange={(v) => setType(v as AssessmentTypeOption)} />

              <Text className="font-outfit-medium text-[13px] text-slate-500 mt-5 mb-2">Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="bg-slate-100 rounded-2xl px-4 py-3.5 font-outfit text-[15px] text-black"
              />

              <Text className="font-outfit-medium text-[13px] text-slate-500 mt-5 mb-2">Scheduled Date & Time</Text>
              <Pressable
                onPress={() => setPickerOpen(true)}
                className="flex-row items-center justify-between bg-slate-100 rounded-2xl px-4 py-3.5"
              >
                <View className="flex-row items-center">
                  <Feather name="calendar" size={16} color="#0F172A" />
                  <Text className="font-outfit-medium text-[15px] text-black ml-2.5">
                    {formatDateTime(scheduledDate)}
                  </Text>
                </View>
                <Feather name="clock" size={16} color="#64748B" />
              </Pressable>

              {!suggestionDismissed && (
                <View className="mt-4">
                  <AISuggestionBanner
                    message="Normalization finishes on 24 Sep. Move to 25 Sep?"
                    onAccept={acceptDateSuggestion}
                  />
                </View>
              )}

              <Text className="font-outfit-medium text-[13px] text-slate-500 mt-5 mb-2">Total Marks</Text>
              <MarksStepper value={marks} onChange={setMarks} />

              <View className="flex-row items-center justify-between mt-5 mb-2">
                <Text className="font-outfit-medium text-[13px] text-slate-500">Linked Topics</Text>
                <Text className="font-outfit-medium text-[13px] text-slate-400">{selectedTopics.length} selected</Text>
              </View>
              <View className="flex-row flex-wrap gap-2 mb-2">
                {availableTopics.map((topic) => (
                  <TopicChip
                    key={topic}
                    label={topic}
                    checked={selectedTopics.includes(topic)}
                    onPress={() => toggleTopic(topic)}
                  />
                ))}
                {!isAddingTopic && <TopicChip label="Add topic" dashed onPress={() => setAddingTopic(true)} />}
              </View>

              {isAddingTopic && (
                <View className="flex-row items-center gap-2 mb-6">
                  <TextInput
                    autoFocus
                    value={newTopicText}
                    onChangeText={setNewTopicText}
                    placeholder="Topic name"
                    placeholderTextColor="#94A3B8"
                    onSubmitEditing={confirmAddTopic}
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 font-outfit text-[13px] text-black"
                  />
                  <Pressable
                    onPress={confirmAddTopic}
                    className="w-9 h-9 rounded-full bg-black items-center justify-center"
                  >
                    <Feather name="check" size={14} color="#fff" />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setAddingTopic(false);
                      setNewTopicText("");
                    }}
                    className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                  >
                    <Feather name="x" size={14} color="#0F172A" />
                  </Pressable>
                </View>
              )}
              {!isAddingTopic && <View className="mb-4" />}

              <PrimaryButton
                label={isEditing ? "Save changes" : "Create & add questions"}
                onPress={handleSubmit}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        visible={isPickerOpen}
        initialDate={scheduledDate}
        onClose={() => setPickerOpen(false)}
        onConfirm={setScheduledDate}
      />
    </>
  );
}
