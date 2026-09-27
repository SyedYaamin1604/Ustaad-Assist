import { Text, View } from "react-native";

import { SessionCard } from "@/components/plan/SessionCard";
import type { PlanSession } from "@/utils/plan";
import { groupByWeek } from "@/utils/plan";

interface WeekListViewProps {
  sessions: PlanSession[];
  currentWeek: number;
  highlightId?: string;
  onOpenSession: (id: string) => void;
}

export function WeekListView({ sessions, currentWeek, highlightId, onOpenSession }: WeekListViewProps) {
  return (
    <View>
      {groupByWeek(sessions).map((week) => {
        const isCurrent = week.weekNo === currentWeek;
        const classCount = week.sessions.filter((s) => s.status !== "cancelled").length;

        return (
          <View key={week.weekNo} className="mb-2">
            <View
              className={`flex-row items-center justify-between rounded-2xl px-4 py-3 mb-3 ${
                isCurrent ? "bg-[#DFE6FB]" : "bg-slate-200/70"
              }`}
            >
              <View className="flex-row items-center">
                <View className={`w-2.5 h-2.5 rounded-full mr-2.5 ${isCurrent ? "bg-black" : "bg-slate-500"}`} />
                <Text className="font-outfit-semibold text-base text-black">
                  Week {week.weekNo} · {classCount} {classCount === 1 ? "class" : "classes"}
                </Text>
              </View>
              <Text className="font-outfit text-[13px] text-slate-600">{week.rangeLabel}</Text>
            </View>

            {week.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                highlighted={session.id === highlightId}
                onPress={() => onOpenSession(session.id)}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}
