import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import type { AssessmentListItem, Topic } from "@/api/types";
import { AssessmentCard } from "@/components/assessment/AssessmentCard";
import { AssessmentStatusTabs, type AssessmentFilter } from "@/components/assessment/AssessmentStatusTabs";
import { assessmentStatus, type AssessmentStatus } from "@/utils/assessment";
import { useTabBarInset } from "@/utils/tab-bar";

interface AssessmentListScreenProps {
  courseLabel: string;
  semester: string | null;
  assessments: AssessmentListItem[];
  topics: Topic[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onOpenAssessment: (id: string) => void;
  onOpenResults: () => void;
}

const FILTER_STATUS: Record<AssessmentFilter, AssessmentStatus[]> = {
  Upcoming: ["scheduled", "needs-marks"],
  Completed: ["graded"],
  "Not scheduled": ["unscheduled"],
};

export function AssessmentListScreen({
  courseLabel,
  semester,
  assessments,
  topics,
  refreshing,
  onRefresh,
  onOpenCreate,
  onOpenAssessment,
  onOpenResults,
}: AssessmentListScreenProps) {
  const tabBarInset = useTabBarInset();
  const [filter, setFilter] = useState<AssessmentFilter>("Upcoming");

  const withStatus = assessments.map((item) => ({ item, status: assessmentStatus(item) }));
  const counts = {
    Upcoming: withStatus.filter((a) => FILTER_STATUS.Upcoming.includes(a.status)).length,
    Completed: withStatus.filter((a) => FILTER_STATUS.Completed.includes(a.status)).length,
    "Not scheduled": withStatus.filter((a) => FILTER_STATUS["Not scheduled"].includes(a.status)).length,
  };
  const visible = withStatus.filter((a) => FILTER_STATUS[filter].includes(a.status));

  const topicTitle = new Map(topics.map((t) => [Number(t.id), t.title]));

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView
        contentContainerClassName="px-5 pt-2"
        contentContainerStyle={{ paddingBottom: tabBarInset + 52 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="bg-[var(--color-primary)] rounded-full px-4 py-1.5">
            <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/65">{semester ?? "This semester"}</Text>
          </View>
          <Pressable onPress={onOpenResults} className="flex-row items-center bg-[var(--color-primary)] rounded-full px-4 py-2">
            <Feather name="bar-chart-2" size={14} color="#0F172A" />
            <Text className="font-outfit-semibold text-xs text-[var(--primary-font)] ml-1.5">Results & grades</Text>
          </Pressable>
        </View>

        <Text className="font-outfit-bold text-[28px] text-[var(--primary-font)] mb-1">Assessments</Text>
        <Text className="font-outfit text-sm text-[var(--primary-font)]/55 mb-4">
          {courseLabel} · {assessments.length} Total Assessments
        </Text>

        <View className="mb-5">
          <AssessmentStatusTabs value={filter} onChange={setFilter} counts={counts} />
        </View>

        {visible.length === 0 ? (
          <View className="items-center py-16">
            <Text className="font-outfit-medium text-[var(--primary-font)]/40">
              {assessments.length === 0 ? "No assessments yet. Tap + to create one." : "Nothing here yet"}
            </Text>
          </View>
        ) : (
          visible.map(({ item, status }) => (
            <AssessmentCard
              key={item.id}
              item={item}
              status={status}
              topicTitles={item.topic_ids.map((id) => topicTitle.get(id)).filter((t): t is string => !!t)}
              onPress={() => onOpenAssessment(item.id)}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={onOpenCreate}
        style={{ bottom: tabBarInset + 36 }}
        className="absolute right-5 w-14 h-14 rounded-full bg-black items-center justify-center shadow-lg"
      >
        <Feather name="plus" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}
