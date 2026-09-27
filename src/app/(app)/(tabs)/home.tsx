import { useRouter } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { dashboardApi, planApi } from "@/api";
import CourseHeader from "@/components/home/CourseHeader";
import PlanAlertBanner from "@/components/home/PlanAlertBanner";
import StatsGrid from "@/components/home/StatGrid";
import TodayClassCard from "@/components/home/TodayClassCard";
import UpcomingWeekSection from "@/components/home/UpcomingWeekSection";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useApi } from "@/hooks/useApi";
import { useCourse } from "@/providers/CourseProvider";
import { addDays, formatLongDate, formatShortDate, parseISODate, toISODate, today } from "@/utils/date";
import { attachAssessments, partLabel, sessionTitle } from "@/utils/plan";
import { useTabBarInset } from "@/utils/tab-bar";

const UPCOMING_DAYS = 7;

/** The course home: today's class, schedule health, the numbers, and the week ahead. */
export default function Home() {
  const router = useRouter();
  const tabBarInset = useTabBarInset();
  const { courseId, course } = useCourse();

  const { data, error, loading, reload } = useApi(
    courseId
      ? async () => {
          const [dashboard, plan] = await Promise.all([dashboardApi.get(courseId), planApi.getSessions(courseId)]);
          return { dashboard, sessions: plan.sessions };
        }
      : null,
    [courseId],
  );

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        {error ? <ErrorState message={error} onRetry={reload} /> : <LoadingState />}
      </SafeAreaView>
    );
  }

  const { dashboard } = data;
  const now = today();
  const todayIso = dashboard.today;
  const next = dashboard.next_session;
  const hasPlan = dashboard.schedule.total_sessions > 0;

  const sessions = attachAssessments(data.sessions, dashboard.assessments.upcoming);
  const weekEnd = toISODate(addDays(now, UPCOMING_DAYS));
  const upcoming = sessions.filter(
    (s) => s.status === "planned" && s.date >= todayIso && s.date <= weekEnd && s.id !== next?.id,
  );

  const courseName = [course?.name, course?.code].filter(Boolean).join(" ");
  const weekLabel = next ? ` · Week ${next.week_no}` : "";

  const openPlan = (params?: Record<string, string>) => router.navigate({ pathname: "/plan", params });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 40, paddingBottom: tabBarInset + 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
      >
        <CourseHeader
          courseName={courseName}
          dateLabel={`${formatLongDate(now)}${weekLabel}`}
          onPressCourseSwitcher={() => router.push("/dashboard")}
          onPressSettings={() => router.push("/settings")}
        />

        {next ? (
          <TodayClassCard
            badgeLabel={next.date === todayIso ? "Today's class" : `Next class · ${formatShortDate(parseISODate(next.date))}`}
            topicTitle={sessionTitle({ topic_title: next.topic_title ?? null, kind: "regular" })}
            subtitle={[`Week ${next.week_no}`, partLabel({ part_no: next.part_no ?? null, total_parts: next.total_parts ?? null })]
              .filter(Boolean)
              .join(" · ")}
            onMarkConducted={() => router.push({ pathname: "/attendance", params: { sessionId: next.id } })}
            onMarkCancelled={() => openPlan({ sessionId: next.id, action: "cancel" })}
          />
        ) : (
          <PlanAlertBanner
            title={hasPlan ? "No classes left in the plan" : "Your plan isn't generated yet"}
            subtitle={hasPlan ? "Every planned class is behind you." : "Add topics and let the planner build your timetable."}
            ctaLabel="Open plan"
            onPressCta={() => openPlan()}
          />
        )}

        {dashboard.schedule.warning && (
          <PlanAlertBanner
            title={dashboard.schedule.warning}
            subtitle={dashboard.last_replan?.reason ?? "See the ways to catch up"}
            ctaLabel="Fix plan"
            onPressCta={() => openPlan({ view: "deficit" })}
          />
        )}

        <StatsGrid dashboard={dashboard} />

        <UpcomingWeekSection
          sessions={upcoming}
          onPressViewAll={() => openPlan()}
          onPressItem={(id) => openPlan({ sessionId: id })}
        />

        <View className="h-2" />
      </ScrollView>
    </SafeAreaView>
  );
}
