import React, { ReactNode } from "react";
import { Pressable, View, Text } from "react-native";
import { ChevronRight } from "lucide-react-native";

type MenuListItemProps = {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  titleColor?: string;
  subtitleColor?: string;
};

/**
 * One tappable row: leading icon in a tinted circle, a title +
 * subtitle stack, and a trailing chevron. Used for Course Material,
 * Reports & Audits, Topic Analysis, Clone Semester and Sign Out so
 * every row in the list shares identical spacing and alignment.
 */
export function MenuListItem({
  icon,
  iconBgColor,
  title,
  subtitle,
  onPress,
  showChevron = true,
  titleColor = "#111114",
  subtitleColor = "#6B7078",
}: MenuListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center bg-white rounded-3xl px-4 py-4 active:opacity-70"
      style={{ minHeight: 76 }}
    >
      <View
        className="items-center justify-center rounded-full mr-3"
        style={{ width: 44, height: 44, backgroundColor: iconBgColor }}
      >
        {icon}
      </View>

      <View className="flex-1">
        <Text
          className="text-base font-semibold"
          style={{ color: titleColor }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            className="text-sm mt-0.5"
            style={{ color: subtitleColor }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {showChevron ? (
        <View
          className="items-center justify-center rounded-full bg-gray-100"
          style={{ width: 32, height: 32 }}
        >
          <ChevronRight size={16} color="#6B7078" />
        </View>
      ) : null}
    </Pressable>
  );
}