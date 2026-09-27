import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { Course, PlanGenerateResult, Topic } from "@/api/types";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { classDaysLabel, formatDayMonth, parseISODate, shortWeekday, weeksBetween } from "@/utils/date";
import { plural } from "@/utils/format";

interface PlanGeneratedScreenProps {
  course: Course;
  topics: Topic[];
  result: PlanGenerateResult;
  onAddStudents: () => void;
  onOpenDashboard: () => void;
}

const PREVIEW_WEEKS = 3;
const MAX_DOTS = 40;

/** Shown straight after the planner builds a timetable: what it made, and anything that did not fit. */
export function PlanGeneratedScreen({ course, topics, result, onAddStudents, onOpenDashboard }: PlanGeneratedScreenProps) {
  const titleById = new Map(topics.map((t) => [Number(t.id), t.title]));

  const weeks = new Map<number, PlanGenerateResult["sessions"]>();
  for (const s of result.sessions) {
    const list = weeks.get(s.week_no) ?? [];
    list.push(s);
    weeks.set(s.week_no, list);
  }
  const firstWeeks = [...weeks.entries()].slice(0, PREVIEW_WEEKS);
  const totalWeeks = weeksBetween(course.start_date, course.end_date);

  const heading = [course.name, course.code].filter(Boolean).join(" ");
  const meta = [course.semester, classDaysLabel(course.class_days), `${totalWeeks} Weeks`].filter(Boolean).join(" · ");

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
      <Text className="mb-5 mt-2 text-center text-xl font-outfit-bold text-slate-900">Semester Plan</Text>

      {/* Hero */}
      <View className="mb-6 overflow-hidden rounded-[32px] bg-[#3EB6AA] p-6">
        <View className="mb-4 self-start rounded-full bg-white/70 px-3 py-1.5">
          <Text className="text-xs font-outfit-bold uppercase tracking-wider text-slate-800">{heading}</Text>
        </View>
        <Text className="mb-4 text-[30px] font-outfit-bold leading-9 text-black">
          {plural(result.sessions.length, "class", "classes")} · {plural(topics.length, "topic")}
        </Text>

        <View className="mb-5 flex-row flex-wrap gap-2">
          {Array.from({ length: Math.min(result.sessions.length, MAX_DOTS) }).map((_, i) => (
            <View key={i} className="h-4 w-4 rounded-full border border-black/40" />
          ))}
        </View>

        <View className="flex-row items-center self-start rounded-full bg-white px-4 py-2">
          <Feather name="calendar" size={14} color="#0F172A" />
          <Text className="ml-2 text-sm font-outfit-semibold text-black">{meta}</Text>
        </View>
      </View>

      {/* Honest warnings: the planner never half-places a topic. */}
      {result.overflow.length > 0 && (
        <View className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-4">
          <View className="mb-1 flex-row items-center">
            <Feather name="alert-triangle" size={16} color="#B45309" />
            <Text className="ml-2 font-outfit-semibold text-amber-900">
              {plural(result.deficit, "class", "classes")} short
            </Text>
          </View>
          <Text className="font-outfit text-sm text-amber-800">
            These topics did not fit before the end date: {result.overflow.map((t) => t.title).join(", ")}. Open the
            plan tab to drop, compress or add makeup classes.
          </Text>
        </View>
      )}

      {result.assessments_moved.map((move) => (
        <View key={move.assessment_id} className="mb-3 rounded-3xl bg-white p-4">
          <Text className="font-outfit text-sm text-slate-700">{move.reason}</Text>
        </View>
      ))}

      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-outfit-bold uppercase tracking-wider text-slate-800">
          First {Math.min(PREVIEW_WEEKS, firstWeeks.length)} weeks
        </Text>
        <Text className="text-sm font-outfit-medium text-slate-500">{weeks.size} weeks planned</Text>
      </View>

      {firstWeeks.map(([weekNo, sessions]) => (
        <View key={weekNo} className="mb-3 rounded-[28px] bg-white p-5">
          <View className="mb-3 flex-row items-baseline border-b border-slate-100 pb-3">
            <Text className="text-xl font-outfit-bold text-black">Week {weekNo}</Text>
            <Text className="ml-2 text-sm font-outfit text-slate-500">
              ({formatDayMonth(sessions[0].date)} – {formatDayMonth(sessions[sessions.length - 1].date)})
            </Text>
          </View>
          {sessions.map((s) => (
            <View key={s.date} className="mb-1.5 flex-row items-start">
              <Text className="mr-2 font-outfit-bold text-black">•</Text>
              <Text className="flex-1 font-outfit-medium text-[15px] text-black">
                {shortWeekday(parseISODate(s.date))}: {titleById.get(s.topic_id) ?? "Class"}
                {s.total_parts && s.total_parts > 1 ? ` (${s.part_no}/${s.total_parts})` : ""}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <Pressable onPress={onAddStudents} className="my-4 flex-row items-center rounded-[28px] bg-[#3EB6AA] p-5 active:opacity-90">
        <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-white">
          <Feather name="user-plus" size={22} color="#0F172A" />
        </View>
        <View className="flex-1">
          <Text className="font-outfit-bold text-base text-black">Add students to start taking attendance</Text>
          <Text className="font-outfit text-sm text-slate-800">Photograph or upload the class list</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-black">
          <Feather name="arrow-right" size={18} color="#fff" />
        </View>
      </Pressable>

      <PrimaryButton label="Open dashboard" icon="arrow-up-right" onPress={onOpenDashboard} />
    </ScrollView>
  );
}
