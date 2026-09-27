import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import type { PlanSession } from "@/utils/plan";
import { partLabel, sessionTitle } from "@/utils/plan";
import { parseISODate, shortWeekday } from "@/utils/date";

interface UpcomingClassItemProps {
  session: PlanSession;
  onPress?: (id: string) => void;
  isLast?: boolean;
}

export default function UpcomingClassItem({ session, onPress, isLast = false }: UpcomingClassItemProps) {
  const date = parseISODate(session.date);
  const subtitle = [`Week ${session.week_no}`, partLabel(session)].filter(Boolean).join(" · ");

  return (
    <Pressable
      onPress={() => onPress?.(session.id)}
      className={`flex-row items-center rounded-2xl bg-gray-50 px-4 py-3.5 ${isLast ? "" : "mb-3"}`}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Text className="text-[10px] font-outfit-semibold uppercase text-gray-500">{shortWeekday(date)}</Text>
        <Text className="text-[15px] font-outfit-bold leading-4 text-gray-900">{date.getDate().toString().padStart(2, "0")}</Text>
      </View>

      <View className="ml-3.5 flex-1">
        <Text className="text-[15px] font-outfit-semibold text-gray-900" numberOfLines={1}>
          {sessionTitle(session)}
        </Text>
        <View className="mt-0.5 flex-row items-center">
          <Text className="font-outfit text-[12.5px] text-gray-500" numberOfLines={1}>
            {subtitle}
          </Text>
          {session.assessment_title ? (
            <View className="ml-2 flex-row items-center">
              <View className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />
              <Text className="text-[12.5px] font-outfit-medium text-red-500">{session.assessment_title}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <ChevronRight size={18} color="#9CA3AF" />
    </Pressable>
  );
}
