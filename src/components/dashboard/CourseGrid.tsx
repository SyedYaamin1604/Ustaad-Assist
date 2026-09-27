import { Text, View } from "react-native";

import type { CourseListItem } from "@/api/types";
import CourseCard, { courseColor } from "./CourseCard";

interface CourseGridProps {
  courses: CourseListItem[];
  emptyLabel?: string;
  onSelectCourse?: (course: CourseListItem) => void;
}

const CourseGrid = ({ courses, emptyLabel, onSelectCourse }: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <View className="items-center justify-center py-16">
        <Text className="text-[var(--primary-font)]/40 font-outfit text-sm text-center">
          {emptyLabel ?? "No courses yet."}
        </Text>
      </View>
    );
  }

  const rows: CourseListItem[][] = Array.from({ length: Math.ceil(courses.length / 2) }, (_, i) =>
    courses.slice(i * 2, i * 2 + 2),
  );

  return (
    <View className="gap-4 mt-6">
      {rows.map((row, rowIndex) => (
        <View key={row[0].id} className="flex-row gap-4">
          {row.map((course, i) => (
            <View key={course.id} className="flex-1">
              <CourseCard course={course} color={courseColor(rowIndex * 2 + i)} onPress={onSelectCourse} />
            </View>
          ))}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
};

export default CourseGrid;
