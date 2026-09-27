import { Text, View } from "react-native";

interface MaterialHomeHeaderProps {
  courseCode: string;
  semesterLabel: string | null;
  courseTitle: string;
  subtitle: string;
}

export function MaterialHomeHeader({ courseCode, semesterLabel, courseTitle, subtitle }: MaterialHomeHeaderProps) {
  return (
    <View className="mt-2">
      <View className="flex-row gap-2 mb-3">
        <View className="bg-[var(--primary-font)]/5 rounded-full px-3 py-1">
          <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/65">{courseCode}</Text>
        </View>
        {semesterLabel && (
          <View className="bg-[var(--primary-font)]/5 rounded-full px-3 py-1">
            <Text className="font-outfit-medium text-xs text-[var(--primary-font)]/65">{semesterLabel}</Text>
          </View>
        )}
      </View>

      <Text className="font-outfit-bold text-[28px] text-[var(--primary-font)] mb-1">{courseTitle}</Text>
      <Text className="font-outfit text-sm text-[var(--primary-font)]/50 mb-4">{subtitle}</Text>
    </View>
  );
}
