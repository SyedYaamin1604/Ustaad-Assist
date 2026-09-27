import React from "react";
import { Pressable, Text, View } from "react-native";
import { AttendanceView } from "../../types/attendance";

interface TitleBlockProps {
  title: string;
  subtitle: string;
}

export function AttendanceTitleBlock({ title, subtitle }: TitleBlockProps) {
  return (
    <View className="px-5 pt-5">
      <Text className="text-4xl font-extrabold tracking-tight text-neutral-900">
        {title}
      </Text>
      <Text className="mt-1 text-sm text-neutral-500">{subtitle}</Text>
    </View>
  );
}

interface ViewToggleProps {
  value: AttendanceView;
  onChange: (view: AttendanceView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <View className="mx-5 mt-4 flex-row rounded-full bg-neutral-100 p-1">
      <Pressable
        onPress={() => onChange("mark")}
        className={`flex-1 items-center rounded-full py-2.5 ${
          value === "mark" ? "bg-black" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            value === "mark" ? "text-white" : "text-neutral-500"
          }`}
        >
          Mark
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("summary")}
        className={`flex-1 items-center rounded-full py-2.5 ${
          value === "summary" ? "bg-black" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            value === "summary" ? "text-white" : "text-neutral-500"
          }`}
        >
          Summary
        </Text>
      </Pressable>
    </View>
  );
}