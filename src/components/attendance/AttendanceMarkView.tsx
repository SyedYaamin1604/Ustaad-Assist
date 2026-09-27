import React, { useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

import type { AttendanceStatus, LectureInfo, MarkEntry } from "@/types/attendance";
import { EnrolledCountRow } from "./EnrolledCountRow";
import { LectureInfoCard } from "./LectureInfoCard";
import { SearchBar } from "./SearchBar";
import { StudentMarkRow } from "./StudentMarkRow";
import { SubmitBar } from "./SubmitBar";

interface AttendanceMarkViewProps {
  lecture: LectureInfo;
  students: MarkEntry[];
  /** True when attendance was already recorded for this class (editing, not taking). */
  alreadyRecorded: boolean;
  submitting: boolean;
  onCycleStatus: (studentId: string) => void;
  onPickLecture: () => void;
  onSubmit: () => void;
}

export function AttendanceMarkView({
  lecture,
  students,
  alreadyRecorded,
  submitting,
  onCycleStatus,
  onPickLecture,
  onSubmit,
}: AttendanceMarkViewProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.roll_no.toLowerCase().includes(q));
  }, [students, query]);

  const counts = students.reduce(
    (acc, s) => {
      acc[s.status] += 1;
      return acc;
    },
    { present: 0, absent: 0, leave: 0 } as Record<AttendanceStatus, number>,
  );

  return (
    <View className="mt-1 flex-1">
      <LectureInfoCard lecture={lecture} onPress={onPickLecture} />
      <SearchBar value={query} onChangeText={setQuery} />
      <EnrolledCountRow count={students.length} />
      {alreadyRecorded && (
        <Text className="mx-5 mt-2 font-outfit text-xs text-indigo-600">
          Already recorded — submitting again replaces it.
        </Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.student_id}
        renderItem={({ item }) => <StudentMarkRow student={item} onCycleStatus={onCycleStatus} />}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <SubmitBar
        presentCount={counts.present}
        leaveCount={counts.leave}
        absentCount={counts.absent}
        submitting={submitting}
        onSubmit={onSubmit}
      />
    </View>
  );
}
