import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CourseHeader from "../../components/home/CourseHeader";
import TodayClassCard from "../../components/home/TodayClassCard";
import PlanAlertBanner from "../../components/home/PlanAlertBanner";
import StatsGrid from "../../components/home/StatGrid";
import UpcomingWeekSection from "../../components/home/UpcomingWeekSection";
import { UpcomingClassItemData } from "../../components/home/UpcomingClassItem";
import { router } from "expo-router";
import { useTabBarInset } from "../../utils/tab-bar";

const upcomingItems: UpcomingClassItemData[] = [
  {
    id: "1",
    dayAbbrev: "Fri",
    dayNumber: "25",
    title: "SQL Aggregation & Group By",
    subtitle: "Lecture 8 · Room CS-Lab 2",
  },
  {
    id: "2",
    dayAbbrev: "Tue",
    dayNumber: "29",
    title: "Normalization (1NF to 3NF)",
    subtitle: "Lecture 9",
    flagLabel: "Quiz 2 due",
  },
  {
    id: "3",
    dayAbbrev: "Fri",
    dayNumber: "02",
    title: "BCNF & Decomposition",
    subtitle: "Lecture 10 · Room CS-Lab 2",
  },
];

export default function Home() {
  const tabBarInset = useTabBarInset();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 40, paddingBottom: tabBarInset + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <CourseHeader
          courseName="Database Systems CS-301"
          dateLabel="Tuesday 22 September · Week 4"
          hasNotification
        />

        <TodayClassCard
          timeRangeLabel="10:00 AM - 11:30 AM"
          topicTitle="SQL Joins, part 2 of 3"
          room="Room CS-Lab 2"
          subject="Database Systems"
          onMarkConducted={() => router.push("/attendance")}
        />

        <PlanAlertBanner
          title="You are 1 week behind your plan"
          subtitle="1 lecture rescheduled from last Friday"
          ctaLabel="Fix plan"
        />

        <StatsGrid
          data={{
            classesCompleted: 7,
            classesTarget: 8,
            progressPercent: 44,
            topicsTotal: 14,
            attendancePercent: 86,
            studentsCount: 32,
            assessmentsDone: 2,
            assessmentsLabel: "Quiz 1 & Assignment 1",
          }}
        />

        <UpcomingWeekSection items={upcomingItems} />

        {/* Bottom tab bar is provided by the (tabs) navigator layout,
            so it is intentionally not rendered here. */}
        <View className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}