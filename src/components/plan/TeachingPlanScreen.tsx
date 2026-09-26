import { PlanCalendar } from "@/components/plan/PlanCalendar";
import { PlanTopBar } from "@/components/plan/PlanTopBar";
import { SelectedSessionCard } from "@/components/plan/SelectedSessionCard";
import { WeekListView } from "@/components/plan/WeekListView";
import { CourseSummary, PlanSession } from "@/types/plan";
import { toISODate } from "@/utils/date";
import { lectureNumber, nextSession } from "@/utils/plan";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

type PlanMode = "calendar" | "list";

interface TeachingPlanScreenProps {
  course: CourseSummary;
  sessions: PlanSession[];
  holidays: string[];
  behindByWeeks: number;
  onOpenSession: (id: string) => void;
  onOpenDeficit: () => void;
  onOpenTopics: () => void;
}

export function TeachingPlanScreen({
  course,
  sessions,
  holidays,
  behindByWeeks,
  onOpenSession,
  onOpenDeficit,
  onOpenTopics,
}: TeachingPlanScreenProps) {
  const upcoming = nextSession(sessions);
  const [mode, setMode] = useState<PlanMode>("calendar");
  const [selectedDate, setSelectedDate] = useState(() => upcoming?.date ?? toISODate(new Date()));

  const selectedSession = sessions.find((s) => s.date === selectedDate);
  const currentWeek = upcoming?.week_no ?? sessions[sessions.length - 1]?.week_no ?? 1;
  const conductedCount = sessions.filter((s) => s.status === "conducted").length;
  const plannedCount = sessions.filter((s) => s.status !== "cancelled").length;

  const openMenu = () => {
    Alert.alert("Plan options", undefined, [
      { text: "Edit topics", onPress: onOpenTopics },
      { text: "Catch-up options", onPress: onOpenDeficit },
      { text: "Close", style: "cancel" },
    ]);
  };

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-36" showsVerticalScrollIndicator={false}>
        <PlanTopBar label={`${course.code} · ${course.semester}`} onAction={openMenu} />

        <View className="flex-row items-end justify-between mb-1">
          <View>
            <Text className="font-outfit-medium text-xs tracking-widest text-slate-500 mb-1">COURSE TIMELINE</Text>
            <Text className="font-outfit-bold text-[32px] leading-9 text-black">Teaching Plan</Text>
          </View>
          <View className="items-end">
            <Text className="font-outfit-bold text-2xl text-black">
              {conductedCount}/{plannedCount}
            </Text>
            <Text className="font-outfit text-[13px] text-slate-500">Lessons</Text>
          </View>
        </View>
        <Text className="font-outfit text-sm text-slate-500 mb-4">{course.name}</Text>

        <View className="flex-row bg-slate-200/70 rounded-full p-1 mb-4">
          <ModeTab label="Calendar" icon="calendar" active={mode === "calendar"} onPress={() => setMode("calendar")} />
          <ModeTab label="Week list" icon="list" active={mode === "list"} onPress={() => setMode("list")} />
        </View>

        {behindByWeeks > 0 && (
          <Pressable
            onPress={onOpenDeficit}
            className="flex-row items-center bg-rose-100 border border-rose-200 rounded-3xl px-4 py-3.5 mb-4 active:opacity-80"
          >
            <View className="w-9 h-9 rounded-full bg-white items-center justify-center mr-3">
              <Feather name="alert-triangle" size={16} color="#BE123C" />
            </View>
            <View className="flex-1">
              <Text className="font-outfit-semibold text-sm text-rose-800">
                You are {behindByWeeks} {behindByWeeks === 1 ? "week" : "weeks"} behind the plan
              </Text>
              <Text className="font-outfit text-xs text-rose-700 mt-0.5">See ways to catch up</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#BE123C" />
          </Pressable>
        )}

        {mode === "calendar" ? (
          <>
            <PlanCalendar
              sessions={sessions}
              holidays={holidays}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
            <View className="mt-5">
              <SelectedSessionCard
                date={selectedDate}
                session={selectedSession}
                lectureNo={selectedSession ? lectureNumber(sessions, selectedSession.id) : 0}
                course={course}
                onOpen={() => selectedSession && onOpenSession(selectedSession.id)}
              />
            </View>
          </>
        ) : (
          <WeekListView
            sessions={sessions}
            currentWeek={currentWeek}
            classSize={course.classSize}
            highlightId={upcoming?.id}
            onOpenSession={onOpenSession}
          />
        )}
      </ScrollView>
    </View>
  );
}

interface ModeTabProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active: boolean;
  onPress: () => void;
}

function ModeTab({ label, icon, active, onPress }: ModeTabProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center rounded-full py-3 ${active ? "bg-black" : ""}`}
    >
      <Feather name={icon} size={16} color={active ? "#fff" : "#475569"} />
      <Text className={`font-outfit-semibold text-[15px] ml-2 ${active ? "text-white" : "text-slate-600"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
