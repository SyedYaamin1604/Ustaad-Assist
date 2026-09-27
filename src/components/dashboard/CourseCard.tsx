import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import type { CourseListItem } from "@/api/types";
import { classDaysLabel, todayISO } from "@/utils/date";

export type CourseColor = "yellow" | "teal" | "purple" | "pink" | "blue" | "orange";

const COLOR_CYCLE: CourseColor[] = ["yellow", "teal", "purple", "pink", "blue", "orange"];

// Mirrors the course palette in global.css
const CARD_BG: Record<CourseColor, string> = {
  yellow: "bg-[var(--color-yellow)]",
  teal: "bg-[var(--color-emerald)]",
  purple: "bg-[var(--color-purple)]",
  pink: "bg-[var(--color-pink)]",
  blue: "bg-[var(--color-blue)]",
  orange: "bg-[var(--color-orange)]",
};

/** Course cards cycle through the palette so neighbours never share a colour. */
export function courseColor(index: number): CourseColor {
  return COLOR_CYCLE[index % COLOR_CYCLE.length];
}

/** The one-line status under the course name, from the counts the course list already carries. */
function courseStatus(course: CourseListItem): { label: string; dot: string } {
  if (course.end_date < todayISO()) return { label: "Semester ended", dot: "bg-slate-400" };
  if (!course.has_plan) return { label: "Plan not generated", dot: "bg-amber-500" };
  return { label: `${course.conducted_count} of ${course.session_count} classes taught`, dot: "bg-emerald-500" };
}

interface CourseCardProps {
  course: CourseListItem;
  color: CourseColor;
  onPress?: (course: CourseListItem) => void;
}

const CourseCard = ({ course, color, onPress }: CourseCardProps) => {
  const status = courseStatus(course);
  const subtitle = [course.code, classDaysLabel(course.class_days)].filter(Boolean).join(" · ");

  return (
    <Pressable
      onPress={() => onPress?.(course)}
      accessibilityRole="button"
      accessibilityLabel={`${course.name}, ${subtitle}, ${status.label}`}
      className="active:opacity-90"
    >
      <View className={`${CARD_BG[color]} rounded-[28px] p-4 h-[202px] justify-between overflow-hidden`}>
        <Image
          source={require("../../../assets/images/course-background-img.png")}
          resizeMode="contain"
          className="absolute -top-2 -right-2 w-[128px] h-[112px] opacity-50"
        />

        <View className="w-9 h-9 rounded-full bg-[var(--color-primary)] items-center justify-center">
          <Feather name="star" size={16} color="#111111" />
        </View>

        <View>
          <Text numberOfLines={2} className="text-[17px] font-outfit-bold text-[var(--primary-font)] leading-[22px] pr-4">
            {course.name}
          </Text>
          <Text numberOfLines={1} className="text-xs font-outfit text-[var(--primary-font)]/45 mt-1.5">
            {subtitle}
          </Text>
          <View className="flex-row items-center mt-3">
            <View className={`${status.dot} w-2 h-2 rounded-full mr-1.5`} />
            <Text numberOfLines={1} className="text-xs font-outfit-medium text-[var(--primary-font)]/80 flex-1">
              {status.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Arrow sits on the card edge, overlapping into the gutter */}
      <View
        className="absolute -right-4 top-[82px] w-9 h-9 rounded-full bg-[var(--color-secondary)] items-center justify-center"
        style={{ elevation: 4 }}
      >
        <Feather name="arrow-up-right" size={17} color="#ffffff" />
      </View>
    </Pressable>
  );
};

export default CourseCard;
