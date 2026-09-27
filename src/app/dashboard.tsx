import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CourseGrid from "../components/dashboard/CourseGrid";
import CourseTabs from "../components/dashboard/CourseTabs";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import NewCourseButton from "../components/dashboard/NewCourseButton";
import { ACTIVE_COURSES, PAST_COURSES } from "../components/dashboard/dummyCourse";
import type { Course } from "../components/dashboard/CourseCard";

const Dashboard = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"active" | "past">("active");

  const courses: Course[] = tab === "active" ? ACTIVE_COURSES : PAST_COURSES;

  const handleSelectCourse = (course: Course) => {
    router.push({ pathname: "/(tabs)/Home", params: { id: course.id } });
  };

  const handleNewCourse = () => {
    router.push("/course/new");
  };

  const DEFAULT_AVATAR_URL =
    "https://ui-avatars.com/api/?name=Dr+Ahmed&background=e2e8f0&color=475569";

  return (
    <View className="flex-1 bg-[#f6f7fb]" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 96, // status bar/notch is cleared by the wrapper; content can scroll up to that edge
          paddingBottom: Math.max(insets.bottom + 24, 48),
          paddingHorizontal: 20,
        }}
      >
        <DashboardHeader
          name="Dr. Ahmed"
          term="Fall 2026 · Week 4"
          avatarUri={DEFAULT_AVATAR_URL}
          onOpenSettings={() => router.push("/settings")}
          onOpenProfile={() => router.push("/profile")}
        />

        <View className="my-5">
          <CourseTabs value={tab} onChange={setTab} />
        </View>

        <CourseGrid
          courses={courses}
          emptyLabel={`No ${tab} courses yet.`}
          onSelectCourse={handleSelectCourse}
        />

        <View className="mt-8">
          <NewCourseButton onPress={handleNewCourse} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;