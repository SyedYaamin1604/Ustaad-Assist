import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import type { Priority, Topic } from "@/api/types";
import { EditTopicSheet, type TopicEdit } from "@/components/plan/EditTopicSheet";
import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { StatusBadge, type BadgeTone } from "@/components/ui/StatusBadge";

interface TopicsScreenProps {
  topics: Topic[];
  /** Planned classes still to come. */
  classesLeft: number;
  /** A topic change has made the timetable out of date. */
  needsReplan: boolean;
  busy: boolean;
  onBack: () => void;
  onSave: (topic: Topic, edit: TopicEdit) => Promise<boolean>;
  onSwap: (a: Topic, b: Topic) => void;
  onRebuild: () => void;
}

const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  low: "neutral",
  normal: "light",
  high: "dark",
};

/** Taught and dropped topics are history: they cannot be edited or moved. */
const isLocked = (topic: Topic) => topic.status === "completed" || topic.status === "dropped";

export function TopicsScreen({ topics, classesLeft, needsReplan, busy, onBack, onSave, onSwap, onRebuild }: TopicsScreenProps) {
  const [editing, setEditing] = useState<Topic | null>(null);

  const remaining = topics.filter((t) => !isLocked(t));
  const neededSessions = remaining.reduce((sum, t) => sum + t.sessions_needed, 0);
  const minimumSessions = remaining.reduce((sum, t) => sum + t.min_sessions, 0);

  const canMove = (index: number, delta: number) => {
    const target = index + delta;
    return !busy && target >= 0 && target < topics.length && !isLocked(topics[index]) && !isLocked(topics[target]);
  };

  const saveTopic = async (edit: TopicEdit) => {
    if (editing && (await onSave(editing, edit))) setEditing(null);
  };

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-36" showsVerticalScrollIndicator={false}>
        <PlanTopBar label={`Topics · ${topics.length}`} onBack={onBack} />

        <Text className="font-outfit-bold text-[32px] leading-9 text-black mb-1">Topics</Text>
        <Text className="font-outfit text-[15px] text-slate-500 mb-5">
          Order sets the plan. Tap a topic to change how many classes it needs.
        </Text>

        {needsReplan && (
          <View className="flex-row items-center bg-[#DFE6FB] rounded-3xl px-4 py-3.5 mb-4">
            <Feather name="refresh-cw" size={16} color="#0F172A" />
            <Text className="font-outfit-medium text-sm text-black ml-3 flex-1">
              Your changes affect the timetable.
            </Text>
            <Pressable onPress={onRebuild} disabled={busy} className="bg-black rounded-full px-4 py-2">
              {busy ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="font-outfit-semibold text-xs text-white">Rebuild plan</Text>
              )}
            </Pressable>
          </View>
        )}

        <View className="flex-row bg-white rounded-[28px] p-4 mb-5">
          <Stat label="Classes left" value={classesLeft} />
          <Stat label="Topics need" value={neededSessions} warn={neededSessions > classesLeft} />
          <Stat label="At minimum" value={minimumSessions} warn={minimumSessions > classesLeft} />
        </View>

        {topics.map((topic, index) => {
          const locked = isLocked(topic);
          return (
            <Pressable
              key={topic.id}
              onPress={() => !locked && !busy && setEditing(topic)}
              className={`flex-row items-center rounded-3xl p-4 mb-3 ${
                locked ? "bg-slate-100 border border-slate-200" : "bg-white border border-slate-100 active:opacity-80"
              }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${locked ? "bg-slate-200" : "bg-black"}`}>
                <Text className={`font-outfit-bold text-sm ${locked ? "text-slate-500" : "text-white"}`}>{topic.order_no}</Text>
              </View>

              <View className="flex-1 mr-2">
                <Text
                  className={`font-outfit-semibold text-base ${locked ? "text-slate-500" : "text-black"} ${
                    topic.status === "dropped" ? "line-through" : ""
                  }`}
                >
                  {topic.title}
                </Text>
                <View className="flex-row items-center flex-wrap gap-2 mt-1.5">
                  <Text className="font-outfit text-xs text-slate-500">
                    {topic.sessions_needed} {topic.sessions_needed === 1 ? "class" : "classes"} · min {topic.min_sessions}
                  </Text>
                  {topic.status === "completed" ? (
                    <StatusBadge label="Taught" tone="success" />
                  ) : topic.status === "dropped" ? (
                    <StatusBadge label="Dropped" tone="danger" />
                  ) : (
                    <>
                      <StatusBadge
                        label={`${topic.priority[0].toUpperCase()}${topic.priority.slice(1)} priority`}
                        tone={PRIORITY_TONE[topic.priority]}
                      />
                      {topic.status === "in_progress" && <StatusBadge label="In progress" tone="warning" />}
                    </>
                  )}
                </View>
              </View>

              {locked ? (
                <Feather name="lock" size={16} color="#94A3B8" />
              ) : (
                <View className="gap-1">
                  <MoveButton icon="chevron-up" enabled={canMove(index, -1)} onPress={() => onSwap(topic, topics[index - 1])} />
                  <MoveButton icon="chevron-down" enabled={canMove(index, 1)} onPress={() => onSwap(topic, topics[index + 1])} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <EditTopicSheet key={editing?.id} topic={editing} busy={busy} onClose={() => setEditing(null)} onSave={saveTopic} />
    </View>
  );
}

function Stat({ label, value, warn = false }: { label: string; value: number; warn?: boolean }) {
  return (
    <View className="flex-1 items-center">
      <Text className={`font-outfit-bold text-2xl ${warn ? "text-red-600" : "text-black"}`}>{value}</Text>
      <Text className="font-outfit text-xs text-slate-500">{label}</Text>
    </View>
  );
}

function MoveButton({ icon, enabled, onPress }: { icon: keyof typeof Feather.glyphMap; enabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled}
      hitSlop={4}
      className={`w-8 h-8 rounded-full bg-slate-100 items-center justify-center ${enabled ? "" : "opacity-30"}`}
    >
      <Feather name={icon} size={16} color="#0F172A" />
    </Pressable>
  );
}
