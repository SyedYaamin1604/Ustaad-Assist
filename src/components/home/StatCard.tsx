import React from "react";
import { View, Text } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  iconBgColor: string;
}

export default function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  bgColor,
  textColor,
  iconBgColor,
}: StatCardProps) {
  return (
    <View
      className="flex-1 rounded-[24px] px-4 py-4"
      style={{ backgroundColor: bgColor }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-[13px] font-outfit-medium"
          style={{ color: textColor }}
        >
          {label}
        </Text>
        <View
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={14} color={textColor} />
        </View>
      </View>

      <Text
        className="mt-3 text-[26px] font-outfit-bold"
        style={{ color: textColor }}
      >
        {value}
      </Text>
      <Text
        className="font-outfit mt-0.5 text-[12px]"
        style={{ color: textColor, opacity: 0.75 }}
      >
        {caption}
      </Text>
    </View>
  );
}