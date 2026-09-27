import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import type { Priority, Topic } from "@/api/types";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

/** The three fields PATCH /topics/:id lets the teacher correct after seeing the plan. */
export type TopicEdit = Pick<Topic, "sessions_needed" | "min_sessions" | "priority">;

interface EditTopicSheetProps {
  topic: Topic | null;
  busy?: boolean;
  onClose: () => void;
  onSave: (edit: TopicEdit) => void;
}

const PRIORITIES: Priority[] = ["low", "normal", "high"];

// Parent should pass key={topic.id} so the sheet resets for each topic.
export function EditTopicSheet({ topic, busy = false, onClose, onSave }: EditTopicSheetProps) {
  const [needed, setNeeded] = useState(topic?.sessions_needed ?? 1);
  const [min, setMin] = useState(topic?.min_sessions ?? 1);
  const [priority, setPriority] = useState<Priority>(topic?.priority ?? "normal");

  if (!topic) return null;

  // min_sessions can never be more than sessions_needed (the database refuses it).
  const changeNeeded = (value: number) => {
    const next = Math.max(1, value);
    setNeeded(next);
    if (min > next) setMin(next);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="bg-white rounded-t-[32px] px-5 pt-3 pb-8">
          <View className="w-10 h-1 rounded-full bg-slate-200 self-center mb-4" />
          <View className="flex-row items-start justify-between mb-5">
            <View className="flex-1 mr-3">
              <Text className="font-outfit-bold text-[28px] leading-8 text-black">{topic.title}</Text>
              <Text className="font-outfit text-sm text-slate-500 mt-1">Topic {topic.order_no}</Text>
            </View>
            <Pressable onPress={onClose} className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
              <Feather name="x" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <View className="flex-1 mr-3">
                <Text className="font-outfit-medium text-base text-black">Sessions needed</Text>
                <Text className="font-outfit text-[13px] text-slate-500">Classes this topic normally takes</Text>
              </View>
              <Stepper value={needed} canDecrease={needed > 1} onChange={changeNeeded} />
            </View>

            <View className="flex-row items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <View className="flex-1 mr-3">
                <Text className="font-outfit-medium text-base text-black">Minimum sessions</Text>
                <Text className="font-outfit text-[13px] text-slate-500">The fewest it could survive on</Text>
              </View>
              <Stepper value={min} canDecrease={min > 1} canIncrease={min < needed} onChange={setMin} />
            </View>

            <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <Text className="font-outfit-medium text-base text-black">Priority</Text>
              <Text className="font-outfit text-[13px] text-slate-500 mb-3">Low-priority topics are dropped first</Text>
              <View className="flex-row gap-2">
                {PRIORITIES.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    className={`flex-1 items-center rounded-full py-3 border ${
                      priority === p ? "bg-black border-black" : "bg-white border-slate-300"
                    }`}
                  >
                    <Text className={`font-outfit-semibold text-[15px] capitalize ${priority === p ? "text-white" : "text-slate-600"}`}>
                      {p}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row items-center my-5">
            <Feather name="info" size={14} color="#64748B" />
            <Text className="font-outfit text-[13px] text-slate-500 ml-2">
              Changing the classes needed will adjust the plan and semester timeline.
            </Text>
          </View>

          <PrimaryButton
            label={busy ? "Saving..." : "Save"}
            icon="check"
            disabled={busy}
            onPress={() => onSave({ sessions_needed: needed, min_sessions: min, priority })}
          />
        </View>
      </View>
    </Modal>
  );
}

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  canDecrease?: boolean;
  canIncrease?: boolean;
}

function Stepper({ value, onChange, canDecrease = true, canIncrease = true }: StepperProps) {
  return (
    <View className="flex-row items-center bg-slate-100 rounded-full p-1">
      <Pressable
        onPress={() => onChange(value - 1)}
        disabled={!canDecrease}
        className={`w-10 h-10 rounded-full bg-white items-center justify-center ${canDecrease ? "" : "opacity-40"}`}
      >
        <Feather name="minus" size={16} color="#0F172A" />
      </Pressable>
      <Text className="font-outfit-bold text-lg text-black w-9 text-center">{value}</Text>
      <Pressable
        onPress={() => onChange(value + 1)}
        disabled={!canIncrease}
        className={`w-10 h-10 rounded-full bg-white items-center justify-center ${canIncrease ? "" : "opacity-40"}`}
      >
        <Feather name="plus" size={16} color="#0F172A" />
      </Pressable>
    </View>
  );
}
