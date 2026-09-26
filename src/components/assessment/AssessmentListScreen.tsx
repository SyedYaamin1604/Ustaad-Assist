import { AssessmentCard } from "@/components/assessment/AssessmentCard";
import { AssessmentFilter, AssessmentStatusTabs } from "@/components/assessment/AssessmentStatusTabs";
import { AssessmentItem } from "@/types/assessment";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

interface AssessmentListScreenProps {
  assessments: AssessmentItem[];
  onOpenCreate: () => void;
  onOpenAssessment: (id: string) => void;
  onEditAssessment: (id: string) => void;
}

const FILTER_STATUS: Record<AssessmentFilter, AssessmentItem["status"][]> = {
  Upcoming: ["scheduled", "marks-not-entered"],
  Completed: ["graded"],
  "Not started": ["draft"],
};

export function AssessmentListScreen({
  assessments,
  onOpenCreate,
  onOpenAssessment,
  onEditAssessment,
}: AssessmentListScreenProps) {
  const [filter, setFilter] = useState<AssessmentFilter>("Upcoming");

  const counts = useMemo(
    () => ({
      upcoming: assessments.filter((a) => a.status === "scheduled" || a.status === "marks-not-entered").length,
      completed: assessments.filter((a) => a.status === "graded").length,
      notStarted: assessments.filter((a) => a.status === "draft").length,
      draft: assessments.filter((a) => a.status === "draft").length,
    }),
    [assessments]
  );

  const visibleAssessments = assessments.filter((a) => FILTER_STATUS[filter].includes(a.status));

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-32" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => Alert.alert("Assessments", "This is the top of the Assessments tab — there's nowhere to go back to yet.")}
            className="w-9 h-9 rounded-full bg-white items-center justify-center"
          >
            <Feather name="chevron-left" size={18} color="#0F172A" />
          </Pressable>
          <View className="bg-white rounded-full px-4 py-1.5">
            <Text className="font-outfit-medium text-xs text-slate-600">Fall 2024</Text>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert("Course menu", "Course settings, switch course and archive options will live here.")
            }
            className="w-9 h-9 rounded-full bg-white items-center justify-center"
          >
            <Feather name="menu" size={18} color="#0F172A" />
          </Pressable>
        </View>

        <Text className="font-outfit-bold text-[28px] text-black mb-1">Assessments</Text>
        <Text className="font-outfit text-sm text-slate-500 mb-4">
          Database Systems CS-301 · {assessments.length} Total Assessments
        </Text>

        <View className="mb-5">
          <AssessmentStatusTabs value={filter} onChange={setFilter} counts={counts} />
        </View>

        {visibleAssessments.length === 0 ? (
          <View className="items-center py-16">
            <Text className="font-outfit-medium text-slate-400">Nothing here yet</Text>
          </View>
        ) : (
          visibleAssessments.map((item) => (
            <AssessmentCard
              key={item.id}
              item={item}
              onPress={() => onOpenAssessment(item.id)}
              onEdit={() => onEditAssessment(item.id)}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={onOpenCreate}
        className="absolute bottom-28 right-5 w-14 h-14 rounded-full bg-black items-center justify-center shadow-lg"
      >
        <Feather name="plus" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}
