import { Feather, Ionicons } from "@expo/vector-icons";
import { ArrowLeft } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import type { ResultSet, StudentResult } from "@/api/types";
import { GradingCriteriaCard } from "@/components/assessment/GradingCriteriaCard";
import { StudentGradeRow } from "@/components/assessment/StudentGradeRow";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { EmptyState } from "@/components/ui/ScreenState";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPercent } from "@/utils/format";
import { useTabBarInset } from "@/utils/tab-bar";

interface ResultsGradesScreenProps {
  courseLabel: string;
  results: ResultSet;
  refreshing: boolean;
  onRefresh: () => void;
  onBack: () => void;
  onEditGrading: () => void;
  onOpenReport: () => void;
}

const SORT_OPTIONS = ["Rank (High-Low)", "Roll No", "Grade"];

function sortRows(rows: StudentResult[], sort: string, gradeOrder: Map<string, number>): StudentResult[] {
  return [...rows].sort((a, b) => {
    if (sort === "Roll No") return a.roll_no.localeCompare(b.roll_no, undefined, { numeric: true });
    if (sort === "Grade") return (gradeOrder.get(a.grade) ?? 99) - (gradeOrder.get(b.grade) ?? 99);
    return b.weighted_total - a.weighted_total;
  });
}

export function ResultsGradesScreen({
  courseLabel,
  results,
  refreshing,
  onRefresh,
  onBack,
  onEditGrading,
  onOpenReport,
}: ResultsGradesScreenProps) {
  const tabBarInset = useTabBarInset();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const { summary } = results;
  // The course's own scale, highest band first — never a hard-coded A–F.
  const gradeOrder = useMemo(() => new Map(results.grade_scale.map((b, i) => [b.grade, i])), [results.grade_scale]);
  const gradeFor = (pct: number | null) =>
    pct === null ? "" : ` (${results.grade_scale.find((b) => pct >= b.min_percentage)?.grade ?? "—"})`;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = results.students.filter((r) => r.name.toLowerCase().includes(q) || r.roll_no.toLowerCase().includes(q));
    return sortRows(filtered, sort, gradeOrder);
  }, [search, sort, results.students, gradeOrder]);

  const missing = summary.students_with_missing_marks;

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView
        contentContainerClassName="px-5 pt-2"
        contentContainerStyle={{ paddingBottom: tabBarInset + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft size={18} color="#111827" />
          </TouchableOpacity>
          <Pressable onPress={onOpenReport} className="w-9 h-9 rounded-full bg-[var(--color-primary)] items-center justify-center">
            <Feather name="share" size={16} color="#0F172A" />
          </Pressable>
        </View>

        <View className="flex-row items-center flex-wrap gap-2 mb-1">
          <Text className="font-outfit-bold text-[26px] text-[var(--primary-font)]">Results & Grades</Text>
          {missing > 0 && <StatusBadge label="Provisional" tone="warning" dot />}
        </View>
        <Text className="font-outfit text-sm text-[var(--primary-font)]/55 mb-4">{courseLabel}</Text>

        {missing > 0 && (
          <View className="flex-row items-center bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-3 mb-4">
            <Feather name="alert-triangle" size={16} color="#B45309" />
            <Text className="flex-1 font-outfit-medium text-[13px] text-amber-700 ml-2">
              {missing} of {summary.student_count} students still have marks missing. Their totals leave those marks out
              (they are not counted as zero) until they are entered.
            </Text>
          </View>
        )}

        <GradingCriteriaCard weightage={results.weightage} onPress={onEditGrading} />

        {results.students.length === 0 ? (
          <EmptyState icon="users" title="No students yet" message="Results appear once the class list is added and marks are entered." />
        ) : (
          <>
            <View className="mt-4 mb-3">
              <SearchInput value={search} onChangeText={setSearch} placeholder="Search student or roll no..." />
            </View>

            <View className="mb-4">
              <SegmentedPills options={SORT_OPTIONS} value={sort} onChange={setSort} />
            </View>

            <View className="flex-row gap-3 mb-5">
              <SummaryTile icon="stats-chart-outline" label="Class Average" value={`${formatPercent(summary.class_average)}${gradeFor(summary.class_average)}`} />
              <SummaryTile icon="trophy-outline" label="Highest" value={`${formatPercent(summary.highest)}${gradeFor(summary.highest)}`} />
            </View>

            <Text className="font-outfit-semibold text-[15px] text-[var(--primary-font)] mb-3">
              Enrolled Students ({rows.length}) · {summary.pass_count} passing
            </Text>

            {rows.length === 0 ? (
              <View className="items-center py-10">
                <Text className="font-outfit-medium text-[var(--primary-font)]/40">No students match your search</Text>
              </View>
            ) : (
              rows.map((row) => <StudentGradeRow key={row.student_id} row={row} bandIndex={gradeOrder.get(row.grade) ?? 99} />)
            )}

            <View className="mt-3">
              <PrimaryButton label="Result sheet (PDF)" icon="file-text" onPress={onOpenReport} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryTile({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View className="flex-1 bg-[var(--color-primary)] rounded-2xl border border-[var(--primary-font)]/10 p-3.5">
      <View className="flex-row items-center mb-1">
        <Ionicons name={icon} size={14} color="#64748B" />
        <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/55 ml-1.5">{label}</Text>
      </View>
      <Text className="font-outfit-bold text-lg text-[var(--primary-font)]">{value}</Text>
    </View>
  );
}
