import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { LectureInfoCard } from "./LectureInfoCard";
import { SearchBar } from "./SearchBar";
import { EnrolledCountRow } from "./EnrolledCountRow";
import { StudentMarkRow } from "./StudentMarkRow";
import { SubmitBar } from "./SubmitBar";
import { AttendanceStatus, LectureInfo, StudentMarkEntry } from "../../types/attendance";

interface AttendanceMarkViewProps {
  lecture: LectureInfo;
  totalEnrolled: number;
  students: StudentMarkEntry[];
  onStudentsChange: (students: StudentMarkEntry[]) => void;
  onSubmit?: () => void;
}

const STATUS_CYCLE: AttendanceStatus[] = ["present", "absent", "leave"];

export function AttendanceMarkView({
  lecture,
  totalEnrolled,
  students,
  onStudentsChange,
  onSubmit,
}: AttendanceMarkViewProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
    );
  }, [students, query]);

  const counts = useMemo(() => {
    return students.reduce(
      (acc, s) => {
        acc[s.status] += 1;
        return acc;
      },
      { present: 0, absent: 0, leave: 0 } as Record<AttendanceStatus, number>
    );
  }, [students]);

  function cycleStatus(id: string) {
    onStudentsChange(
      students.map((s) => {
        if (s.id !== id) return s;
        const currentIndex = STATUS_CYCLE.indexOf(s.status);
        const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
        return { ...s, status: nextStatus };
      })
    );
  }

  return (
    <View className="mt-1 flex-1">
      <LectureInfoCard lecture={lecture} />
      <SearchBar value={query} onChangeText={setQuery} />
      <EnrolledCountRow count={totalEnrolled} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentMarkRow student={item} onCycleStatus={cycleStatus} />
        )}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <SubmitBar
        presentCount={counts.present}
        leaveCount={counts.leave}
        absentCount={counts.absent}
        onSubmit={onSubmit}
      />
    </View>
  );
}