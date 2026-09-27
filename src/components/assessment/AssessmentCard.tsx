import { StatusBadge } from "@/components/ui/StatusBadge";
import { AssessmentItem } from "@/types/assessment";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface AssessmentCardProps {
  item: AssessmentItem;
  onPress?: () => void;
  onEdit?: () => void;
}

const COLOR_BG: Record<AssessmentItem["color"], string> = {
  yellow: "bg-[var(--color-yellow)]",
  blue: "bg-[var(--color-blue)]",
  white: "bg-[var(--color-primary)]",
};

export function AssessmentCard({ item, onPress, onEdit }: AssessmentCardProps) {
  const isColored = item.color !== "white";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-3xl p-4 mb-3 ${COLOR_BG[item.color]} ${!isColored ? "border border-[var(--primary-font)]/10" : ""}`}
    >
      {/* Top row: type pill + status badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View
          className={`flex-row items-center rounded-full px-3 py-1 ${
            isColored ? "bg-[var(--color-secondary)]/10" : "bg-[var(--primary-font)]/5"
          }`}
        >
          <Feather
            name={item.type === "Assignment" ? "file-text" : item.status === "draft" ? "edit-3" : "help-circle"}
            size={12}
            color="#0F172A"
          />
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)] ml-1.5">
            {item.status === "graded" ? "Quiz 1" : item.status === "draft" ? "Exam Draft" : item.type}
          </Text>
        </View>

        <StatusBadge
          label={item.statusLabel}
          tone={
            item.status === "scheduled"
              ? "success"
              : item.status === "graded"
                ? "light"
                : item.status === "draft"
                  ? "neutral"
                  : "light"
          }
          dot={item.status === "scheduled"}
        />
      </View>

      {/* Title */}
      <Text className="font-outfit-bold text-lg text-[var(--primary-font)] mb-2">{item.title}</Text>

      {/* Date + marks row */}
      <View className="flex-row items-center mb-1">
        <Feather name={item.status === "graded" ? "check-circle" : "calendar"} size={13} color="#334155" />
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75 ml-1.5">{item.dateLabel}</Text>
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75 mx-1.5">·</Text>
        <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/75">{item.marksLabel}</Text>
      </View>

      {/* Graded: class average row */}
      {item.status === "graded" && item.classAverageLabel && (
        <View className="flex-row items-center justify-between bg-[var(--color-accent)] rounded-2xl px-3 py-2.5 mt-2">
          <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/55">Class Average</Text>
          <Text className="font-outfit-bold text-base text-[var(--primary-font)]">{item.classAverageLabel}</Text>
        </View>
      )}

      {/* Topic chips */}
      {item.topics && item.topics.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {item.topics.map((topic) => (
            <View key={topic} className={`rounded-full px-3 py-1 ${isColored ? "bg-[var(--color-primary)]/60" : "bg-[var(--primary-font)]/5"}`}>
              <Text className="font-outfit-medium text-xs text-[var(--primary-font)]">{topic}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Meta row (marks entered / questions planned) + trailing affordance */}
      {(item.metaLabel || isColored) && (
        <View className="flex-row items-center justify-between mt-3">
          {item.metaLabel ? (
            <Text className="font-outfit text-xs text-[var(--primary-font)]/40">{item.metaLabel}</Text>
          ) : (
            <View />
          )}

          {isColored ? (
            <View className="w-9 h-9 rounded-full bg-[var(--color-secondary)] items-center justify-center">
              <Feather name="arrow-up-right" size={16} color="#fff" />
            </View>
          ) : item.status === "graded" ? (
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          ) : item.editable ? (
            <Pressable
              onPress={onEdit}
              className="flex-row items-center bg-[var(--primary-font)]/5 rounded-full px-3 py-1.5"
            >
              <Feather name="edit-2" size={12} color="#0F172A" />
              <Text className="font-outfit-medium text-xs text-[var(--primary-font)] ml-1.5">Edit</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}
