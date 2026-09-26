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
  white: "bg-white",
};

export function AssessmentCard({ item, onPress, onEdit }: AssessmentCardProps) {
  const isColored = item.color !== "white";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-3xl p-4 mb-3 ${COLOR_BG[item.color]} ${!isColored ? "border border-slate-100" : ""}`}
    >
      {/* Top row: type pill + status badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View
          className={`flex-row items-center rounded-full px-3 py-1 ${
            isColored ? "bg-black/10" : "bg-slate-100"
          }`}
        >
          <Feather
            name={item.type === "Assignment" ? "file-text" : item.status === "draft" ? "edit-3" : "help-circle"}
            size={12}
            color="#0F172A"
          />
          <Text className="font-outfit-medium text-xs text-black ml-1.5">
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
      <Text className="font-outfit-bold text-lg text-black mb-2">{item.title}</Text>

      {/* Date + marks row */}
      <View className="flex-row items-center mb-1">
        <Feather name={item.status === "graded" ? "check-circle" : "calendar"} size={13} color="#334155" />
        <Text className="font-outfit-medium text-[13px] text-slate-700 ml-1.5">{item.dateLabel}</Text>
        <Text className="font-outfit-medium text-[13px] text-slate-700 mx-1.5">·</Text>
        <Text className="font-outfit-medium text-[13px] text-slate-700">{item.marksLabel}</Text>
      </View>

      {/* Graded: class average row */}
      {item.status === "graded" && item.classAverageLabel && (
        <View className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-3 py-2.5 mt-2">
          <Text className="font-outfit-medium text-[13px] text-slate-500">Class Average</Text>
          <Text className="font-outfit-bold text-base text-black">{item.classAverageLabel}</Text>
        </View>
      )}

      {/* Topic chips */}
      {item.topics && item.topics.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {item.topics.map((topic) => (
            <View key={topic} className={`rounded-full px-3 py-1 ${isColored ? "bg-white/60" : "bg-slate-100"}`}>
              <Text className="font-outfit-medium text-xs text-black">{topic}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Meta row (marks entered / questions planned) + trailing affordance */}
      {(item.metaLabel || isColored) && (
        <View className="flex-row items-center justify-between mt-3">
          {item.metaLabel ? (
            <Text className="font-outfit text-xs text-slate-400">{item.metaLabel}</Text>
          ) : (
            <View />
          )}

          {isColored ? (
            <View className="w-9 h-9 rounded-full bg-black items-center justify-center">
              <Feather name="arrow-up-right" size={16} color="#fff" />
            </View>
          ) : item.status === "graded" ? (
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          ) : item.editable ? (
            <Pressable
              onPress={onEdit}
              className="flex-row items-center bg-slate-100 rounded-full px-3 py-1.5"
            >
              <Feather name="edit-2" size={12} color="#0F172A" />
              <Text className="font-outfit-medium text-xs text-black ml-1.5">Edit</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}
