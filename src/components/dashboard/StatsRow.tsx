import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { Course } from "./CourseCard";

interface StatsRowProps {
    courses: Course[];
}

const StatsRow = ({ courses }: StatsRowProps) => {
    const total = courses.length;
    const onTrackCount = courses.filter(
        (c) => c.status === "on-track" || c.status === "ahead"
    ).length;
    const completionRate = total === 0 ? 0 : Math.round((onTrackCount / total) * 100);

    return (
        <View className="flex-row gap-4 mt-6">
            <View className="flex-1 p-4 bg-[var(--color-primary)] rounded-2xl border border-[var(--color-secondary)]/20 shadow-sm">
                <Ionicons name="layers-outline" size={24} color="#2563eb" />
                <Text className="text-2xl font-outfit-bold text-[var(--primary-font)]/90 mt-2">{total}</Text>
                <Text className="text-xs text-[var(--primary/font)]/50 mt-0.5">Active Modules</Text>
            </View>

            <View className=" flex-1 p-4 bg-[var(--color-secondary)] rounded-2xl border border-[var(--color-secondary)]/20 shadow-sm">
                <Ionicons name="checkmark-done-circle-outline" size={24} color="#16a34a" />
                <Text className="text-2xl font-outfit-bold text-[var(--primary-font)]/90 mt-2">
                    {completionRate}%
                </Text>
                <Text className="text-xs text-[var(--primary-font)]/50 mt-0.5">On Track</Text>
            </View>
        </View>
    );
};

export default StatsRow;