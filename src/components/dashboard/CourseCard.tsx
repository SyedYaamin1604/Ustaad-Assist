// CourseCard.tsx
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

export type CourseColor = "yellow" | "teal" | "purple" | "pink" | "blue" | "orange";
export type CourseStatus = "on-track" | "behind" | "ahead" | "at-risk";

export interface Course {
    id: string;
    title: string;
    code: string;
    schedule: string;
    color: CourseColor;
    status: CourseStatus;
    statusLabel: string;
}

interface CourseCardProps {
    course: Course;
    onPress?: (course: Course) => void;
}

// Mirrors the course palette in global.css
const CARD_BG: Record<CourseColor, string> = {
    yellow: "bg-[var(--color-yellow)]",
    teal: "bg-[var(--color-emerald)]",
    purple: "bg-[var(--color-purple)]",
    pink: "bg-[var(--color-pink)]",
    blue: "bg-[var(--color-blue)]",
    orange: "bg-[var(--color-orange)]",
};

const STATUS_DOT: Record<CourseStatus, string> = {
    "on-track": "bg-emerald-500",
    ahead: "bg-emerald-500",
    behind: "bg-amber-500",
    "at-risk": "bg-rose-500",
};

const CourseCard = ({ course, onPress }: CourseCardProps) => {
    return (
        <Pressable
            onPress={() => onPress?.(course)}
            accessibilityRole="button"
            accessibilityLabel={`${course.title}, ${course.code}, ${course.statusLabel}`}
            className="active:opacity-90"
        >
            <View className={`${CARD_BG[course.color]} rounded-[28px] p-4 h-[202px] justify-between overflow-hidden`}>
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
                        {course.title}
                    </Text>
                    <Text numberOfLines={1} className="text-xs font-outfit text-[var(--primary-font)]/45 mt-1.5">
                        {course.code} · {course.schedule}
                    </Text>
                    <View className="flex-row items-center mt-3">
                        <View className={`${STATUS_DOT[course.status]} w-2 h-2 rounded-full mr-1.5`} />
                        <Text numberOfLines={1} className="text-xs font-outfit-medium text-[var(--primary-font)]/80">
                            {course.statusLabel}
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
