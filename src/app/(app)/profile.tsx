import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Copy, FileText, Folder, LayoutGrid, LogOut } from "lucide-react-native";

import { CourseSettingsCard } from "@/components/profile/CourseSettingsCard";
import { MenuListItem } from "@/components/profile/MenuListItems";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useAuth } from "@/providers/AuthProvider";
import { useCourse } from "@/providers/CourseProvider";
import { colors } from "@/types/profile-theme";
import { classDaysLabel } from "@/utils/date";
import { showError } from "@/utils/errors";

/** More & settings: the teacher, the selected course, and the app-wide actions. */
export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { displayName, teacher, session, signOut } = useAuth();
  const { course, selectCourse } = useCourse();

  const role = teacher?.department ?? teacher?.email ?? session?.user.email ?? "";

  const confirmSignOut = () =>
    Alert.alert("Sign out?", "You will need to sign in again to see your courses.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        // The auth guard returns to the sign-in screen once the session is gone.
        onPress: () => {
          selectCourse(null);
          signOut().catch((error) => showError(error, "Couldn't sign out"));
        },
      },
    ]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.screenBg }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.screenBg} />

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader name={displayName} role={role} onPressBack={() => router.back()} />

        <View className="mt-8">
          <Text className="text-4xl font-outfit-bold text-gray-900">More & Settings</Text>
          <Text className="font-outfit text-base text-gray-500 mt-2">Your courses, reports and account</Text>
        </View>

        {course && (
          <>
            <View className="mt-6" style={{ gap: 12 }}>
              <MenuListItem
                icon={<Folder size={20} color={colors.iconLavenderFg} />}
                iconBgColor={colors.iconLavenderBg}
                title="Course Material"
                subtitle="Lecture slides, assignments, and papers"
                onPress={() => router.navigate("/material")}
              />
              <MenuListItem
                icon={<FileText size={20} color={colors.iconCreamFg} />}
                iconBgColor={colors.iconCreamBg}
                title="Reports"
                subtitle="Result sheet, attendance and course delivery"
                onPress={() => router.push("/report")}
              />
            </View>

            <View className="mt-4">
              <CourseSettingsCard
                courseName={[course.name, course.code].filter(Boolean).join(" ")}
                semesterLabel={course.semester ?? ""}
                threshold={course.attendance_threshold}
                classDaysLabel={classDaysLabel(course.class_days)}
                onPress={() => router.push("/settings")}
              />
            </View>
          </>
        )}

        <View className="mt-4" style={{ gap: 12 }}>
          <MenuListItem
            icon={<LayoutGrid size={18} color={colors.iconGrayFg} />}
            iconBgColor={colors.iconGrayBg}
            title="Switch course"
            subtitle="See all your courses"
            onPress={() => router.navigate("/dashboard")}
          />
          <MenuListItem
            icon={<Copy size={18} color={colors.iconGrayFg} />}
            iconBgColor={colors.iconGrayBg}
            title="Clone Semester"
            subtitle="Carry topics and grading into a new term"
            onPress={() => router.push("/course/clone")}
          />
          <MenuListItem
            icon={<LogOut size={18} color={colors.iconRoseFg} />}
            iconBgColor={colors.iconRoseBg}
            title="Sign Out"
            subtitle={session?.user.email ?? undefined}
            titleColor={colors.iconRoseFg}
            onPress={confirmSignOut}
          />
        </View>
      </ScrollView>
    </View>
  );
}
