import { ReactNode } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ReportCardProps = {
  gradientColors: [string, string];
  icon: ReactNode;
  badge?: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export function ReportCard({
  gradientColors,
  icon,
  badge,
  title,
  description,
  children,
}: ReportCardProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="overflow-hidden rounded-[28px]"
    >
      <View className="p-6">
        <View className="flex-row items-center justify-between">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white/90">
            {icon}
          </View>
          {badge}
        </View>

        <Text className="mt-5 text-[24px] font-extrabold leading-7 text-gray-900">
          {title}
        </Text>
        <Text className="mt-2 text-[14px] leading-5 text-gray-900/70">
          {description}
        </Text>

        <View className="mt-5">{children}</View>
      </View>
    </LinearGradient>
  );
}

type ReportBadgeProps = {
  label: string;
  dotColor?: string;
};

export function ReportBadge({ label, dotColor }: ReportBadgeProps) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5">
      {dotColor ? (
        <View
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      ) : null}
      <Text className="text-[12px] font-semibold text-gray-900">{label}</Text>
    </View>
  );
}