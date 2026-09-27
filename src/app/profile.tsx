// screens/Profile.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Folder, FileText, Activity, Copy, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";

import { ProfileHeader } from "../components/profile/ProfileHeader";
import { MenuListItem } from "../components/profile/MenuListItems";
import { CourseSettingsCard } from "../components/profile/CourseSettingsCard";
import { colors } from "../types/profile-theme";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [threshold, setThreshold] = useState(75);
  const [autoSync, setAutoSync] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "calendar" | "clipboard" | "attendance" | "checklist" | "more"
  >("more");

  return (
    <View className="flex-1" style={{ backgroundColor: colors.screenBg }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.screenBg} />

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 140 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name="Dr. Ahmed"
          role="Prof. of Computer Science · FAST NUC"
          onPressBack={() => router.back()}
        />

        <View className="mt-8">
          <Text className="text-4xl font-outfit-bold text-gray-900">
            More & Settings
          </Text>
          <Text className="font-outfit text-base text-gray-500 mt-2">
            Configure workspace, rosters, and teaching tools
          </Text>
        </View>

        <View className="mt-6" style={{ gap: 12 }}>
          <MenuListItem
            icon={<Folder size={20} color={colors.iconLavenderFg} />}
            iconBgColor={colors.iconLavenderBg}
            title="Course Material"
            subtitle="Lecture slides, assignments, and papers"
            onPress={() => router.push("/(tabs)/material")}
          />
          <MenuListItem
            icon={<FileText size={20} color={colors.iconCreamFg} />}
            iconBgColor={colors.iconCreamBg}
            title="Reports & Audits"
            subtitle="Official PDF attendance rosters & grades"
            onPress={() => router.push("/report")}
          />
          <MenuListItem
            icon={<Activity size={20} color={colors.iconGrayFg} />}
            iconBgColor={colors.iconGrayBg}
            title="Topic Analysis"
            subtitle="Cohort diagnostic and pacing health"
            onPress={() => { }}
          />
        </View>

        <View className="mt-4">
          <CourseSettingsCard
            courseName="Course Settings"
            semesterLabel="Fall 2026 CS-301"
            threshold={threshold}
            onThresholdChange={setThreshold}
            autoSync={autoSync}
            onAutoSyncChange={setAutoSync}
            onPress={() => router.push("./settings")}
          />
        </View>

        <View className="mt-4" style={{ gap: 12 }}>
          <MenuListItem
            icon={<Copy size={18} color={colors.iconGrayFg} />}
            iconBgColor={colors.iconGrayBg}
            title="Clone Semester"
            subtitle="Import syllabus & grading scheme to next term"
            onPress={() => router.push("/course/clone")}
          />
          <MenuListItem
            icon={<LogOut size={18} color={colors.iconRoseFg} />}
            iconBgColor={colors.iconRoseBg}
            title="Sign Out"
            subtitle="Log out of FAST faculty workspace"
            titleColor={colors.iconRoseFg}
            onPress={() => {router.push("/signin")}}
          />
        </View>
      </ScrollView>
    </View>
  );
}