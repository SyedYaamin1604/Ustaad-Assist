import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { initials } from "@/utils/format";

/**
 * entered — a score is typed in
 * absent  — did not sit it: a real zero
 * blank   — not entered yet: NOT a zero, reported as missing
 */
export type MarkStatus = "entered" | "absent" | "blank";

interface StudentMarkCardProps {
  name: string;
  rollNo: string;
  currentScore: string;
  status: MarkStatus;
  maxMarks: number;
  onPrev: () => void;
  onNext: () => void;
}

export function StudentMarkCard({ name, rollNo, currentScore, status, maxMarks, onPrev, onNext }: StudentMarkCardProps) {
  return (
    <View className="bg-[var(--color-primary)] rounded-3xl border border-[var(--primary-font)]/10 p-5">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={onPrev} className="w-9 h-9 rounded-full bg-[var(--color-accent)] items-center justify-center">
          <Feather name="chevron-left" size={16} color="#0F172A" />
        </Pressable>

        <View className="flex-row items-center flex-1 justify-center px-2">
          <Avatar label={initials(name)} bgClassName="bg-[var(--color-purple)]" />
          <View className="ml-3 flex-shrink">
            <Text className="font-outfit-semibold text-base text-[var(--primary-font)]" numberOfLines={1}>
              {name}
            </Text>
            <Text className="font-outfit text-xs text-[var(--primary-font)]/40">Roll {rollNo}</Text>
          </View>
        </View>

        <Pressable onPress={onNext} className="w-9 h-9 rounded-full bg-[var(--color-accent)] items-center justify-center">
          <Feather name="chevron-right" size={16} color="#0F172A" />
        </Pressable>
      </View>

      <View className="flex-row items-center justify-center gap-2 mb-4">
        {status === "absent" && <StatusBadge label="Marked absent — counts as 0" tone="danger" />}
        {status === "blank" && <StatusBadge label="Not entered yet" tone="neutral" />}
        {status === "entered" && <StatusBadge label="Mark entered" tone="success" />}
      </View>

      {status === "entered" ? (
        <View className="flex-row items-baseline justify-center mb-2">
          <Text className="font-outfit-bold text-5xl text-[var(--primary-font)]">{currentScore}</Text>
          <Text className="font-outfit-medium text-xl text-[var(--primary-font)]/40 ml-1">/{maxMarks}</Text>
        </View>
      ) : (
        <View className="items-center justify-center mb-2 py-4">
          <Text className="font-outfit-bold text-2xl text-[var(--primary-font)]/25">— / {maxMarks}</Text>
        </View>
      )}

      <View className="flex-row items-center justify-center">
        <View className="w-1 h-1 rounded-full bg-[var(--primary-font)]/25 mr-1.5" />
        <Text className="font-outfit text-xs text-[var(--primary-font)]/40">Type a score with the keypad below</Text>
      </View>
    </View>
  );
}
