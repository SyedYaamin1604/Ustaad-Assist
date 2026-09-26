import { EditTopicSheet } from "@/components/plan/EditTopicSheet";
import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { StatusBadge, BadgeTone } from "@/components/ui/StatusBadge";
import { PlanTopic, TopicPriority } from "@/types/plan";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface TopicsScreenProps {
  topics: PlanTopic[];
  availableSessions: number;
  onBack: () => void;
  onChange: (topics: PlanTopic[]) => void;
}

const PRIORITY_TONE: Record<TopicPriority, BadgeTone> = {
  low: "neutral",
  normal: "light",
  high: "dark",
};

export function TopicsScreen({ topics, availableSessions, onBack, onChange }: TopicsScreenProps) {
  const [editing, setEditing] = useState<PlanTopic | null>(null);

  const remaining = topics.filter((t) => t.status !== "done");
  const neededSessions = remaining.reduce((sum, t) => sum + t.sessions_needed, 0);
  const minimumSessions = remaining.reduce((sum, t) => sum + t.min_sessions, 0);

  // Taught topics are locked in place, and nothing can move above them.
  const canMove = (index: number, delta: number) => {
    const target = index + delta;
    return target >= 0 && target < topics.length && topics[index].status !== "done" && topics[target].status !== "done";
  };

  const move = (index: number, delta: number) => {
    if (!canMove(index, delta)) return;
    const next = [...topics];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next.map((t, i) => ({ ...t, order_no: i + 1 })));
  };

  const saveTopic = (updated: PlanTopic) => {
    onChange(topics.map((t) => (t.id === updated.id ? updated : t)));
    setEditing(null);
  };

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-36" showsVerticalScrollIndicator={false}>
        <PlanTopBar label={`Topics · ${topics.length}`} onBack={onBack} />

        <Text className="font-outfit-bold text-[32px] leading-9 text-black mb-1">Topics</Text>
        <Text className="font-outfit text-[15px] text-slate-500 mb-5">
          Order sets the plan. Tap a topic to change how many classes it needs.
        </Text>

        <View className="flex-row bg-white rounded-[28px] p-4 mb-5">
          <Stat label="Classes left" value={availableSessions} />
          <Stat label="Topics need" value={neededSessions} warn={neededSessions > availableSessions} />
          <Stat label="At minimum" value={minimumSessions} warn={minimumSessions > availableSessions} />
        </View>

        {topics.map((topic, index) => {
          const isDone = topic.status === "done";
          return (
            <Pressable
              key={topic.id}
              onPress={() => !isDone && setEditing(topic)}
              className={`flex-row items-center rounded-3xl p-4 mb-3 ${
                isDone ? "bg-slate-100 border border-slate-200" : "bg-white border border-slate-100 active:opacity-80"
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isDone ? "bg-slate-200" : "bg-black"}`}
              >
                <Text className={`font-outfit-bold text-sm ${isDone ? "text-slate-500" : "text-white"}`}>
                  {topic.order_no}
                </Text>
              </View>

              <View className="flex-1 mr-2">
                <Text className={`font-outfit-semibold text-base ${isDone ? "text-slate-500" : "text-black"}`}>
                  {topic.title}
                </Text>
                <View className="flex-row items-center flex-wrap gap-2 mt-1.5">
                  <Text className="font-outfit text-xs text-slate-500">
                    {topic.sessions_needed} {topic.sessions_needed === 1 ? "class" : "classes"} · min {topic.min_sessions}
                  </Text>
                  {isDone ? (
                    <StatusBadge label="Taught" tone="success" />
                  ) : (
                    <StatusBadge label={`${topic.priority[0].toUpperCase()}${topic.priority.slice(1)} priority`} tone={PRIORITY_TONE[topic.priority]} />
                  )}
                </View>
              </View>

              {isDone ? (
                <Feather name="lock" size={16} color="#94A3B8" />
              ) : (
                <View className="gap-1">
                  <MoveButton icon="chevron-up" enabled={canMove(index, -1)} onPress={() => move(index, -1)} />
                  <MoveButton icon="chevron-down" enabled={canMove(index, 1)} onPress={() => move(index, 1)} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <EditTopicSheet key={editing?.id} topic={editing} onClose={() => setEditing(null)} onSave={saveTopic} />
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

function MoveButton({
  icon,
  enabled,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  enabled: boolean;
  onPress: () => void;
}) {
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
