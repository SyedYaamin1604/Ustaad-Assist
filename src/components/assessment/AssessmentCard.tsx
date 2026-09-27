import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AssessmentListItem } from "@/api/types";
import { StatusBadge, type BadgeTone } from "@/components/ui/StatusBadge";
import { STATUS_LABEL, type AssessmentStatus } from "@/utils/assessment";
import { formatShortDate, parseISODate } from "@/utils/date";
import { COMPONENT_LABEL } from "@/utils/format";

interface AssessmentCardProps {
  item: AssessmentListItem;
  status: AssessmentStatus;
  topicTitles: string[];
  onPress?: () => void;
}

const CARD_BG: Record<AssessmentStatus, string> = {
  scheduled: "bg-[var(--color-yellow)]",
  "needs-marks": "bg-[var(--color-blue)]",
  graded: "bg-[var(--color-primary)]",
  unscheduled: "bg-[var(--color-primary)]",
};

const TONE: Record<AssessmentStatus, BadgeTone> = {
  scheduled: "success",
  "needs-marks": "light",
  graded: "light",
  unscheduled: "neutral",
};

export function AssessmentCard({ item, status, topicTitles, onPress }: AssessmentCardProps) {
  const isColored = status === "scheduled" || status === "needs-marks";
  const dateLabel = item.date ? formatShortDate(parseISODate(item.date)) : "No date yet";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-3xl p-4 mb-3 ${CARD_BG[status]} ${!isColored ? "border border-[var(--primary-font)]/10" : ""}`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View
          className={`flex-row items-center rounded-full px-3 py-1 ${isColored ? "bg-[var(--color-secondary)]/10" : "bg-[var(--primary-font)]/5"}`}
        >
          <Feather name={item.type === "assignment" ? "file-text" : "help-circle"} size={12} color="#0F172A" />
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)] ml-1.5">{COMPONENT_LABEL[item.type]}</Text>
        </View>

        <StatusBadge label={STATUS_LABEL[status]} tone={TONE[status]} dot={status === "scheduled"} />
      </View>

      <Text className="font-outfit-bold text-lg text-[var(--primary-font)] mb-2">{item.title}</Text>

      <View className="flex-row items-center mb-1">
        <Feather name={status === "graded" ? "check-circle" : "calendar"} size={13} color="#334155" />
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75 ml-1.5">{dateLabel}</Text>
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75 mx-1.5">·</Text>
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75">{item.total_marks} marks</Text>
      </View>

      {/* The planner moved it past its topics; the reason is a ready-made sentence. */}
      {item.move_reason && (
        <View className="flex-row items-start bg-[var(--color-primary)]/70 rounded-2xl px-3 py-2.5 mt-2">
          <Feather name="info" size={13} color="#0F172A" style={{ marginTop: 2 }} />
          <Text className="font-outfit text-[12.5px] text-[var(--primary-font)] ml-2 flex-1">{item.move_reason}</Text>
        </View>
      )}

      {topicTitles.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {topicTitles.map((topic) => (
            <View key={topic} className={`rounded-full px-3 py-1 ${isColored ? "bg-[var(--color-primary)]/60" : "bg-[var(--primary-font)]/5"}`}>
              <Text className="font-outfit-medium text-xs text-[var(--primary-font)]">{topic}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row items-center justify-between mt-3">
        <Text className="font-outfit text-xs text-[var(--primary-font)]/50">
          {item.student_count === 0 ? "No students enrolled yet" : `${item.marks_entered} of ${item.student_count} marks entered`}
        </Text>
        <View className="w-9 h-9 rounded-full bg-[var(--color-secondary)] items-center justify-center">
          <Feather name="arrow-up-right" size={16} color="#fff" />
        </View>
      </View>
    </Pressable>
  );
}
