import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { NumericKeypad } from "@/components/ui/NumericKeypad";
import { MarkStatus, StudentMarkCard } from "@/components/assessment/StudentMarkCard";
import { MOCK_STUDENTS } from "@/types/assessment";

interface EnterMarksScreenProps {
  onBack: () => void;
  onDone: () => void;
}

interface Entry {
  score: string;
  status: MarkStatus;
}

const MAX_MARKS = 15;
const TOTAL_STUDENTS = 60;
const STARTING_INDEX = 23;

export function EnterMarksScreen({ onBack, onDone }: EnterMarksScreenProps) {
  const [studentIndex, setStudentIndex] = useState(0);
  const [entries, setEntries] = useState<Record<number, Entry>>({
    0: { score: "13.5", status: "entered" },
  });

  const student = MOCK_STUDENTS[studentIndex];
  const entry = entries[studentIndex] ?? { score: "", status: "entered" };
  const currentNumber = STARTING_INDEX + studentIndex;
  const remaining = TOTAL_STUDENTS - currentNumber;
  const progress = currentNumber / TOTAL_STUDENTS;
  const enteredCount = Object.values(entries).filter((e) => e.status === "entered" && e.score !== "").length;

  const updateEntry = (index: number, next: Entry) => {
    setEntries((prev) => ({ ...prev, [index]: next }));
  };

  const handleKeyPress = (key: string) => {
    const current = entry.score;
    let next = current;

    if (key === "backspace") {
      next = current.slice(0, -1);
    } else if (key === "." && current.includes(".")) {
      return;
    } else {
      if (current.length >= 4) return;
      const candidate = current + key;
      if (Number(candidate) > MAX_MARKS) return;
      next = candidate;
    }

    updateEntry(studentIndex, { score: next, status: "entered" });
  };

  const goNext = () => {
    if (studentIndex < MOCK_STUDENTS.length - 1) {
      setStudentIndex((i) => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    if (studentIndex > 0) {
      setStudentIndex((i) => i - 1);
    }
  };

  const markAbsent = () => {
    updateEntry(studentIndex, { score: "", status: "absent" });
    goNext();
  };

  const markSkipped = () => {
    updateEntry(studentIndex, { score: "", status: "skipped" });
    goNext();
  };

  const handleFinish = () => {
    const unresolved = MOCK_STUDENTS.length - Object.values(entries).filter((e) => e.status !== "entered" || e.score !== "").length;
    if (unresolved > 0) {
      Alert.alert(
        "Marks in progress",
        `${enteredCount} of ${MOCK_STUDENTS.length} students in this session have marks entered. You can finish now and come back for the rest.`,
        [
          { text: "Keep entering", style: "cancel" },
          { text: "Finish anyway", onPress: onDone },
        ]
      );
      return;
    }
    onDone();
  };

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-1">
          <Pressable onPress={onBack} className="w-9 h-9 rounded-full bg-white items-center justify-center">
            <Feather name="chevron-left" size={18} color="#0F172A" />
          </Pressable>
          <View className="items-center">
            <Text className="font-outfit-bold text-lg text-black">Enter Marks</Text>
            <Text className="font-outfit text-xs text-slate-400">Quiz 2: SQL Joins · Max {MAX_MARKS} Marks</Text>
          </View>
          <Pressable onPress={handleFinish} className="w-9 h-9 rounded-full bg-white items-center justify-center">
            <Feather name="check" size={18} color="#0F172A" />
          </Pressable>
        </View>

        <View className="mt-5 mb-5">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-outfit-semibold text-[15px] text-black">
              Student {currentNumber} <Text className="font-outfit text-slate-400">of {TOTAL_STUDENTS}</Text>
            </Text>
            <Text className="font-outfit text-[13px] text-slate-400">{remaining} remaining</Text>
          </View>
          <View className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <View className="h-full bg-black rounded-full" style={{ width: `${progress * 100}%` }} />
          </View>
        </View>

        <StudentMarkCard
          student={student}
          currentScore={entry.score}
          status={entry.status}
          maxMarks={MAX_MARKS}
          onPrev={goPrev}
          onNext={goNext}
        />

        <View className="flex-row gap-3 mt-5 mb-5">
          <Pressable
            onPress={markAbsent}
            className={`flex-1 items-center py-3.5 rounded-full border ${
              entry.status === "absent" ? "bg-rose-50 border-rose-300" : "bg-white border-slate-200"
            }`}
          >
            <Text className={`font-outfit-medium text-[15px] ${entry.status === "absent" ? "text-rose-600" : "text-black"}`}>
              Absent
            </Text>
          </Pressable>
          <Pressable
            onPress={markSkipped}
            className={`flex-1 items-center py-3.5 rounded-full border ${
              entry.status === "skipped" ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200"
            }`}
          >
            <Text className="font-outfit-medium text-[15px] text-black">Skip</Text>
          </Pressable>
        </View>

        <NumericKeypad onKeyPress={handleKeyPress} />

        <View className="mt-2">
          <PrimaryButton label="Next student" onPress={goNext} />
        </View>
      </ScrollView>
    </View>
  );
}
