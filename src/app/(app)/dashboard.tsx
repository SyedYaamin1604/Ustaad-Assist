import { useRouter } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { coursesApi, type CourseListItem } from "@/api";
import CourseGrid from "@/components/dashboard/CourseGrid";
import CourseTabs from "@/components/dashboard/CourseTabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NewCourseButton from "@/components/dashboard/NewCourseButton";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/providers/AuthProvider";
import { useCourse } from "@/providers/CourseProvider";
import { todayISO } from "@/utils/date";

/** The teacher's courses. Picking one opens it in the tabs. */
const Dashboard = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { displayName } = useAuth();
  const { selectCourse } = useCourse();
  const [tab, setTab] = useState<"active" | "past">("active");

  const { data: courses, error, loading, reload } = useApi(() => coursesApi.list(), []);

  // A course is "past" once its end date has gone by.
  const today = todayISO();
  const active = (courses ?? []).filter((c) => c.end_date >= today);
  const past = (courses ?? []).filter((c) => c.end_date < today);
  const visible = tab === "active" ? active : past;

  const currentTerm = active.find((c) => c.semester)?.semester ?? null;

  const handleSelectCourse = (course: CourseListItem) => {
    selectCourse(course.id);
    router.push("/home");
  };

  return (
    <View className="flex-1 bg-[#f6f7fb]" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!courses} onRefresh={reload} />}
        contentContainerStyle={{
          paddingTop: 96,
          paddingBottom: Math.max(insets.bottom + 24, 48),
          paddingHorizontal: 20,
        }}
      >
        <DashboardHeader
          name={displayName}
          term={currentTerm ?? `${active.length} active ${active.length === 1 ? "course" : "courses"}`}
          onOpenSettings={() => router.push("/profile")}
          onOpenProfile={() => router.push("/profile")}
        />

        <View className="my-5">
          <CourseTabs value={tab} onChange={setTab} />
        </View>

        {!courses && loading ? (
          <LoadingState label="Loading your courses..." />
        ) : error && !courses ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <CourseGrid
            courses={visible}
            emptyLabel={tab === "active" ? "No active courses yet. Create one to get started." : "No past courses yet."}
            onSelectCourse={handleSelectCourse}
          />
        )}

        <View className="mt-8">
          <NewCourseButton onPress={() => router.push("/course/new")} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
