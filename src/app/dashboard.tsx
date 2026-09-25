// Dashboard.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CourseGrid from "../components/dashboard/CourseGrid";
import CourseTabs from "../components/dashboard/CourseTabs";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import NewCourseButton from "../components/dashboard/NewCourseButton";
import { ACTIVE_COURSES, PAST_COURSES } from "../components/dashboard/dummyCourse";
import type { Course } from "../components/dashboard/CourseCard";

const Dashboard = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "past">("active");

  const courses: Course[] = tab === "active" ? ACTIVE_COURSES : PAST_COURSES;

  const handleSelectCourse = (course: Course) => {
    router.push({ pathname: "/course/[id]", params: { id: course.id } });
  };

  const handleNewCourse = () => {
    router.push("/course/new");
  };

  const DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?name=Dr+Ahmed&background=e2e8f0&color=475569";

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          name="Dr. Ahmed"
          term="Fall 2026 · Week 4"
          avatarUri={DEFAULT_AVATAR_URL}
          onOpenSettings={() => router.push("/settings")}
          onOpenProfile={() => router.push("/profile")}
        />

        <CourseTabs value={tab} onChange={setTab} />

        <CourseGrid
          courses={courses}
          emptyLabel={`No ${tab} courses yet.`}
          onSelectCourse={handleSelectCourse}
        />

        <View className="mt-7">
          <NewCourseButton onPress={handleNewCourse} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
