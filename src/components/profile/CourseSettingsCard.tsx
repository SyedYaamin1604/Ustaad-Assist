import React from "react";
import { View, Text } from "react-native";
import { SlidersHorizontal } from "lucide-react-native";
import { ThresholdSlider } from "../../components/profile/ThresholdSlider";
import { ToggleSwitch } from "../../components/profile/ToggleSwitch";
import { colors } from "../../types/profile-theme";

type CourseSettingsCardProps = {
  courseName: string;
  semesterLabel: string;
  statusLabel?: string;
  threshold: number;
  onPress?: () => void;
  onThresholdChange: (next: number) => void;
  autoSync: boolean;
  onAutoSyncChange: (next: boolean) => void;
};

const THRESHOLD_TICKS = [
  { value: 50, label: "50%" },
  { value: 65, label: "65%" },
  { value: 75, label: "75%" },
  { value: 90, label: "90%" },
];

/**
 * The single largest card on the page: identifies the active course
 * and exposes its two live-editable settings, the attendance
 * threshold slider and the auto-sync toggle, each separated by a
 * hairline divider for clear visual grouping.
 */
export function CourseSettingsCard({
  courseName,
  semesterLabel,
  statusLabel = "Active",
  threshold,
  onThresholdChange,
  autoSync,
  onAutoSyncChange,
}: CourseSettingsCardProps) {
  return (
    <View className="bg-white rounded-3xl px-5 py-5">
      {/* Header row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="items-center justify-center rounded-full mr-3"
            style={{ width: 44, height: 44, backgroundColor: colors.black }}
          >
            <SlidersHorizontal size={18} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-outfit-semibold text-gray-900">
              {courseName}
            </Text>
            <Text className="font-outfit text-sm text-gray-500 mt-0.5">
              {semesterLabel}
            </Text>
          </View>
        </View>

        <View className="rounded-full bg-gray-100 px-3 py-1.5">
          <Text className="text-xs font-outfit-semibold text-gray-700">
            {statusLabel}
          </Text>
        </View>
      </View>

      <View className="h-px bg-gray-100 my-5" />

      {/* Attendance threshold */}
      <Text className="text-base font-outfit-semibold text-gray-900">
        Attendance Warning Threshold
      </Text>
      <Text className="font-outfit text-sm text-gray-500 mt-1 leading-5">
        Students below this threshold are flagged for exam ineligibility.
      </Text>

      <ThresholdSlider
        min={50}
        max={90}
        value={threshold}
        onChange={onThresholdChange}
        ticks={THRESHOLD_TICKS}
      />

      <View className="h-px bg-gray-100 my-5" />

      {/* Auto-sync toggle */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-base font-outfit-semibold text-gray-900">
            Auto-sync semester calendar
          </Text>
          <Text className="font-outfit text-sm text-gray-500 mt-0.5">
            Update schedule from university portal
          </Text>
        </View>
        <ToggleSwitch
          value={autoSync}
          onValueChange={onAutoSyncChange}
          accessibilityLabel="Auto-sync semester calendar"
        />
      </View>
    </View>
  );
}