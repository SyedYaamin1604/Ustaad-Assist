import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Share, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GradingCriteriaCard } from "@/components/assessment/GradingCriteriaCard";
import { StudentGradeRow } from "@/components/assessment/StudentGradeRow";
import { GradeRow, MOCK_GRADE_ROWS, MOCK_WEIGHTAGE } from "@/types/assessment";

interface ResultsGradesScreenProps {
  onBack: () => void;
  onExport?: () => void;
}

const SORT_OPTIONS = ["Rank (High-Low)", "Roll No", "Grade (A-F)"];
const GRADE_ORDER: Record<string, number> = { A: 0, "B+": 1, B: 2, "C+": 3, C: 4, D: 5, F: 6 };

function rollNumber(rollLabel: string): number {
  const match = rollLabel.match(/(\d+)\s*·/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortRows(rows: GradeRow[], sort: string): GradeRow[] {
  const withMarks = rows.filter((r) => r.marksEntered);
  const withoutMarks = rows.filter((r) => !r.marksEntered);

  const sorted = [...withMarks].sort((a, b) => {
    if (sort === "Roll No") return rollNumber(a.rollLabel) - rollNumber(b.rollLabel);
    if (sort === "Grade (A-F)") return (GRADE_ORDER[a.grade] ?? 99) - (GRADE_ORDER[b.grade] ?? 99);
    return b.percent - a.percent; // Rank (High-Low)
  });

  // Students with missing marks always sort to the bottom, regardless of sort mode
  return [...sorted, ...withoutMarks];
}

export function ResultsGradesScreen({ onBack, onExport }: ResultsGradesScreenProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const missingCount = MOCK_GRADE_ROWS.filter((row) => !row.marksEntered).length;
  const isIncomplete = missingCount > 0;

  const rows = useMemo(() => {
    const filtered = MOCK_GRADE_ROWS.filter(
      (row) =>
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.rollLabel.toLowerCase().includes(search.toLowerCase())
    );
    return sortRows(filtered, sort);
  }, [search, sort]);

  const handleShare = async () => {
    const summary = MOCK_GRADE_ROWS.map(
      (r) => `${r.name}: ${r.marksEntered ? `${r.percent.toFixed(1)}% (${r.grade})` : "marks pending"}`
    ).join("\n");
    try {
      await Share.share({
        message: `Results & Grades — Database Systems CS-301\n\n${summary}`,
      });
    } catch {
      Alert.alert("Couldn't share", "Something went wrong opening the share sheet.");
    }
  };

  const handleMore = () => {
    Alert.alert("More options", "Duplicate, delete and LMS export will be wired up once the backend is ready.");
  };

  const handleExport = () => {
    Alert.alert("Export started", "Generating the PDF grade sheet — this will hand off to the backend next.");
    onExport?.();
  };

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-10" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={onBack} className="w-9 h-9 rounded-full bg-white items-center justify-center">
            <Feather name="chevron-left" size={18} color="#0F172A" />
          </Pressable>
          <View className="flex-row gap-2">
            <Pressable onPress={handleShare} className="w-9 h-9 rounded-full bg-white items-center justify-center">
              <Feather name="share" size={16} color="#0F172A" />
            </Pressable>
            <Pressable onPress={handleMore} className="w-9 h-9 rounded-full bg-white items-center justify-center">
              <Feather name="more-horizontal" size={18} color="#0F172A" />
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mb-1">
          <Text className="font-outfit-bold text-[26px] text-black">Results & Grades</Text>
          {isIncomplete && <StatusBadge label="Incomplete" tone="warning" dot />}
        </View>
        <Text className="font-outfit text-sm text-slate-500 mb-4">Database Systems CS-301 · Mid-term Standing</Text>

        {isIncomplete && (
          <View className="flex-row items-center bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-3 mb-4">
            <Feather name="alert-triangle" size={16} color="#B45309" />
            <Text className="flex-1 font-outfit-medium text-[13px] text-amber-700 ml-2">
              {missingCount} of {MOCK_GRADE_ROWS.length} students still need marks entered. This sheet won't be
              final until every student is in.
            </Text>
          </View>
        )}

        <GradingCriteriaCard totalLabel="Total Weightage: 100%" items={MOCK_WEIGHTAGE} />

        <View className="mt-4 mb-3">
          <SearchInput value={search} onChangeText={setSearch} placeholder="Search student or roll no..." />
        </View>

        <View className="mb-4">
          <SegmentedPills options={SORT_OPTIONS} value={sort} onChange={setSort} />
        </View>

        <View className="flex-row gap-3 mb-5">
          <View className="flex-1 bg-white rounded-2xl border border-slate-100 p-3.5">
            <View className="flex-row items-center mb-1">
              <Ionicons name="stats-chart-outline" size={14} color="#64748B" />
              <Text className="font-outfit-medium text-xs text-slate-500 ml-1.5">Class Average</Text>
            </View>
            <Text className="font-outfit-bold text-lg text-black">76.4% (B)</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl border border-slate-100 p-3.5">
            <View className="flex-row items-center mb-1">
              <Ionicons name="trophy-outline" size={14} color="#64748B" />
              <Text className="font-outfit-medium text-xs text-slate-500 ml-1.5">Highest</Text>
            </View>
            <Text className="font-outfit-bold text-lg text-black">94.0% (A)</Text>
          </View>
        </View>

        <Text className="font-outfit-semibold text-[15px] text-black mb-3">
          Enrolled Students ({rows.length})
        </Text>

        {rows.length === 0 ? (
          <View className="items-center py-10">
            <Text className="font-outfit-medium text-slate-400">No students match your search</Text>
          </View>
        ) : (
          rows.map((row) => <StudentGradeRow key={row.id} row={row} />)
        )}

        <View className="mt-3">
          <PrimaryButton
            label={isIncomplete ? `Export blocked — ${missingCount} student missing marks` : "Export grade sheet (PDF)"}
            onPress={handleExport}
            disabled={isIncomplete}
          />
        </View>
      </ScrollView>
    </View>
  );
}
