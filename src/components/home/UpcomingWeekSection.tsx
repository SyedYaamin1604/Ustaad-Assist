import React from "react";
import { Pressable, Text, View } from "react-native";

import type { PlanSession } from "@/utils/plan";
import UpcomingClassItem from "./UpcomingClassItem";

interface UpcomingWeekSectionProps {
  sessions: PlanSession[];
  onPressViewAll?: () => void;
  onPressItem?: (id: string) => void;
}

export default function UpcomingWeekSection({ sessions, onPressViewAll, onPressItem }: UpcomingWeekSectionProps) {
  return (
    <View className="mx-5 mt-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-[18px] font-outfit-bold text-gray-900">Upcoming this week</Text>
        <Pressable onPress={onPressViewAll} hitSlop={8}>
          <Text className="text-[13px] font-outfit-medium text-gray-500">View all</Text>
        </Pressable>
      </View>

      {sessions.length === 0 ? (
        <View className="rounded-2xl bg-gray-50 px-4 py-5">
          <Text className="font-outfit text-sm text-gray-500">No other classes in the next seven days.</Text>
        </View>
      ) : (
        sessions.map((session, index) => (
          <UpcomingClassItem
            key={session.id}
            session={session}
            onPress={onPressItem}
            isLast={index === sessions.length - 1}
          />
        ))
      )}
    </View>
  );
}
