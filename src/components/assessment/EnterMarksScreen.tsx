import { Feather } from "@expo/vector-icons";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { MarkInput, MarksSheet } from "@/api/types";
import { StudentMarkCard, type MarkStatus } from "@/components/assessment/StudentMarkCard";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { EmptyState } from "@/components/ui/ScreenState";
import { COMPONENT_LABEL } from "@/utils/format";
import { useTabBarInset } from "@/utils/tab-bar";

interface EnterMarksScreenProps {
  sheet: MarksSheet;
  saving: boolean;
  onBack: () => void;
  /** Save the rows that changed. Resolves true when saved. */
  onSave: (marks: MarkInput[]) => Promise<boolean>;
}

type Entry = { score: string; status: MarkStatus };

const MAX_DIGITS = 5;

function fromServer(obtained: number | null, isAbsent: boolean): Entry {
  if (isAbsent) return { score: "", status: "absent" };
  if (obtained === null) return { score: "", status: "blank" };
  return { score: String(obtained), status: "entered" };
}

function toInput(studentId: string, entry: Entry): MarkInput {
  if (entry.status === "absent") return { student_id: studentId, is_absent: true };
  if (entry.status === "blank" || entry.score === "") return { student_id: studentId, obtained: null };
  return { student_id: studentId, obtained: Number(entry.score) };
}

export function EnterMarksScreen({ sheet, saving, onBack, onSave }: EnterMarksScreenProps) {
  const tabBarInset = useTabBarInset();
  const { assessment, marks } = sheet;
  const maxMarks = assessment.total_marks;

  const [original] = useState<Record<string, Entry>>(() =>
    Object.fromEntries(marks.map((m) => [m.student_id, fromServer(m.obtained, m.is_absent)])),
  );
  const [entries, setEntries] = useState<Record<string, Entry>>(original);
  // Start at the first student still without a mark.
  const [index, setIndex] = useState(() => {
    const firstBlank = marks.findIndex((m) => m.obtained === null && !m.is_absent);
    return firstBlank >= 0 ? firstBlank : 0;
  });

  if (marks.length === 0) {
    return (
      <View className="flex-1 bg-[var(--color-accent)] px-5 pt-2">
        <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <ArrowLeft size={18} color="#111827" />
        </TouchableOpacity>
        <EmptyState icon="users" title="No students enrolled" message="Add the class list from the Students tab, then enter marks." />
      </View>
    );
  }

  const student = marks[index];
  const entry = entries[student.student_id];
  const resolved = Object.values(entries).filter((e) => e.status !== "blank").length;
  const changed = marks
    .filter((m) => {
      const a = entries[m.student_id];
      const b = original[m.student_id];
      return a.status !== b.status || (a.status === "entered" && Number(a.score) !== Number(b.score));
    })
    .map((m) => toInput(m.student_id, entries[m.student_id]));

  const setEntry = (next: Entry) => setEntries((prev) => ({ ...prev, [student.student_id]: next }));

  const handleKeyPress = (key: string) => {
    const current = entry.status === "entered" ? entry.score : "";
    if (key === "backspace") {
      const next = current.slice(0, -1);
      setEntry(next === "" ? { score: "", status: "blank" } : { score: next, status: "entered" });
      return;
    }
    if (key === "." && current.includes(".")) return;
    if (current.length >= MAX_DIGITS) return;

    const candidate = current === "" && key === "." ? "0." : current + key;
    // The backend rejects a mark above the total; stop the slipped key here instead.
    if (Number(candidate) > maxMarks) return;
    setEntry({ score: candidate, status: "entered" });
  };

  const goNext = () => setIndex((i) => Math.min(i + 1, marks.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  const save = async () => {
    if (changed.length === 0) {
      onBack();
      return;
    }
    if (await onSave(changed)) onBack();
  };

  const handleBack = () => {
    if (changed.length === 0) {
      onBack();
      return;
    }
    Alert.alert("Save marks?", `${changed.length} ${changed.length === 1 ? "mark has" : "marks have"} changed.`, [
      { text: "Discard", style: "destructive", onPress: onBack },
      { text: "Save", onPress: save },
    ]);
  };

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2" contentContainerStyle={{ paddingBottom: tabBarInset + 24 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-1">
          <TouchableOpacity onPress={handleBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft size={18} color="#111827" />
          </TouchableOpacity>
          <View className="items-center flex-1 px-2">
            <Text className="font-outfit-bold text-lg text-[var(--primary-font)]">Enter Marks</Text>
            <Text className="font-outfit text-xs text-[var(--primary-font)]/40" numberOfLines={1}>
              {COMPONENT_LABEL[assessment.type]}: {assessment.title} · Max {maxMarks}
            </Text>
          </View>
          <Pressable onPress={save} disabled={saving} className="w-9 h-9 rounded-full bg-[var(--color-primary)] items-center justify-center">
            {saving ? <ActivityIndicator size="small" color="#0F172A" /> : <Feather name="check" size={18} color="#0F172A" />}
          </Pressable>
        </View>

        <View className="mt-5 mb-5">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-outfit-semibold text-[15px] text-[var(--primary-font)]">
              Student {index + 1} <Text className="font-outfit text-[var(--primary-font)]/40">of {marks.length}</Text>
            </Text>
            <Text className="font-outfit text-[13px] text-[var(--primary-font)]/40">
              {marks.length - resolved} still without a mark
            </Text>
          </View>
          <View className="h-1.5 bg-[var(--primary-font)]/10 rounded-full overflow-hidden">
            <View className="h-full bg-[var(--color-secondary)] rounded-full" style={{ width: `${(resolved / marks.length) * 100}%` }} />
          </View>
        </View>

        <StudentMarkCard
          name={student.name}
          rollNo={student.roll_no}
          currentScore={entry.score}
          status={entry.status}
          maxMarks={maxMarks}
          onPrev={goPrev}
          onNext={goNext}
        />

        <View className="flex-row gap-3 mt-5 mb-5">
          <Pressable
            onPress={() => {
              setEntry({ score: "", status: "absent" });
              goNext();
            }}
            className={`flex-1 items-center py-3.5 rounded-full border ${
              entry.status === "absent" ? "bg-rose-50 border-rose-300" : "bg-[var(--color-primary)] border-[var(--primary-font)]/15"
            }`}
          >
            <Text className={`font-outfit-medium text-[15px] ${entry.status === "absent" ? "text-rose-600" : "text-[var(--primary-font)]"}`}>
              Absent
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setEntry({ score: "", status: "blank" });
              goNext();
            }}
            className="flex-1 items-center py-3.5 rounded-full border bg-[var(--color-primary)] border-[var(--primary-font)]/15"
          >
            <Text className="font-outfit-medium text-[15px] text-[var(--primary-font)]">Leave blank</Text>
          </Pressable>
        </View>

        <NumericKeypad onKeyPress={handleKeyPress} />

        <View className="mt-2">
          {index < marks.length - 1 ? (
            <PrimaryButton label="Next student" onPress={goNext} />
          ) : (
            <PrimaryButton label={saving ? "Saving..." : `Save ${changed.length} ${changed.length === 1 ? "change" : "changes"}`} icon="check" disabled={saving} onPress={save} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
