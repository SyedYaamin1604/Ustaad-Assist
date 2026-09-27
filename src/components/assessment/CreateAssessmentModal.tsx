import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import type { CreateAssessmentInput } from "@/api/assessments";
import type { ComponentType, Session, Topic } from "@/api/types";
import { AISuggestionBanner } from "@/components/assessment/AISuggestionBanner";
import { MarksStepper } from "@/components/assessment/MarksStepper";
import { TopicChip } from "@/components/assessment/TopicChip";
import { DateTimePickerModal } from "@/components/ui/DateTimePickerModal";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { assessmentDateCheck } from "@/utils/assessment";
import { formatDayMonth, formatShortDate, parseISODate, toISODate, today } from "@/utils/date";
import { COMPONENT_LABEL, COMPONENTS } from "@/utils/format";

interface CreateAssessmentModalProps {
  visible: boolean;
  topics: Topic[];
  /** The current timetable, to check the date against when topics are taught. */
  sessions: Session[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAssessmentInput) => void;
}

const MIN_MARKS = 5;

// Parent should remount (key) it each time it opens, so the form starts empty.
export function CreateAssessmentModal({ visible, topics, sessions, saving, onClose, onSubmit }: CreateAssessmentModalProps) {
  const [type, setType] = useState<ComponentType>("quiz");
  const [title, setTitle] = useState("");
  const [marks, setMarks] = useState(10);
  const [date, setDate] = useState<string | null>(toISODate(today()));
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [isPickerOpen, setPickerOpen] = useState(false);

  // Dropped topics will never be taught, so they cannot be assessed.
  const selectable = topics.filter((t) => t.status !== "dropped");
  const clash = date ? assessmentDateCheck(date, topicIds, sessions) : null;

  const toggleTopic = (id: string) =>
    setTopicIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const canSave = title.trim() !== "" && !saving;

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-[var(--color-secondary)]/40">
          <Pressable className="absolute inset-0" onPress={onClose} />

          <View className="bg-[var(--color-primary)] rounded-t-[28px] px-5 pt-5 pb-8 max-h-[92%]">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="font-outfit-bold text-xl text-[var(--primary-font)]">Create Assessment</Text>
              <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-[var(--primary-font)]/5 items-center justify-center">
                <Feather name="x" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55 mb-2">Assessment Type</Text>
              <SegmentedPills
                options={COMPONENTS.map((c) => COMPONENT_LABEL[c])}
                value={COMPONENT_LABEL[type]}
                onChange={(label) => setType(COMPONENTS.find((c) => COMPONENT_LABEL[c] === label) ?? "quiz")}
              />

              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55 mt-5 mb-2">Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={`e.g. ${COMPONENT_LABEL[type]} 1`}
                placeholderTextColor="#94A3B8"
                className="bg-[var(--primary-font)]/5 rounded-2xl px-4 py-3.5 font-outfit text-[15px] text-[var(--primary-font)]"
              />

              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55 mt-5 mb-2">Date</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setPickerOpen(true)}
                  className="flex-1 flex-row items-center justify-between bg-[var(--primary-font)]/5 rounded-2xl px-4 py-3.5"
                >
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={16} color="#0F172A" />
                    <Text className="font-outfit-medium text-[15px] text-[var(--primary-font)] ml-2.5">
                      {date ? formatShortDate(parseISODate(date)) : "Not scheduled yet"}
                    </Text>
                  </View>
                  <Feather name="chevron-down" size={16} color="#64748B" />
                </Pressable>
                {date && (
                  <Pressable onPress={() => setDate(null)} className="justify-center rounded-2xl bg-[var(--primary-font)]/5 px-4">
                    <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/60">Set later</Text>
                  </Pressable>
                )}
              </View>

              {clash && (
                <View className="mt-4">
                  <AISuggestionBanner
                    message={`These topics are taught until ${formatDayMonth(clash.lastTaught)}. Move to ${formatDayMonth(clash.suggested)}?`}
                    actionLabel="Move"
                    onAccept={() => setDate(clash.suggested)}
                  />
                </View>
              )}

              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55 mt-5 mb-2">Total Marks</Text>
              <MarksStepper value={marks} onChange={(value) => setMarks(Math.max(MIN_MARKS, value))} />

              <View className="flex-row items-center justify-between mt-5 mb-2">
                <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55">Topics it covers</Text>
                <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/40">{topicIds.length} selected</Text>
              </View>
              <Text className="font-outfit text-xs text-[var(--primary-font)]/45 mb-2">
                The planner never schedules it before these are taught.
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {selectable.map((topic) => (
                  <TopicChip key={topic.id} label={topic.title} checked={topicIds.includes(topic.id)} onPress={() => toggleTopic(topic.id)} />
                ))}
                {selectable.length === 0 && (
                  <Text className="font-outfit text-xs text-[var(--primary-font)]/45">This course has no topics yet.</Text>
                )}
              </View>

              <PrimaryButton
                label={saving ? "Creating..." : "Create assessment"}
                disabled={!canSave}
                onPress={() =>
                  onSubmit({ type, title: title.trim(), total_marks: marks, date, topic_ids: topicIds })
                }
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        key={`${isPickerOpen}`}
        mode="date"
        visible={isPickerOpen}
        initialDate={date ? parseISODate(date) : today()}
        onClose={() => setPickerOpen(false)}
        onConfirm={(picked) => setDate(toISODate(picked))}
      />
    </>
  );
}
