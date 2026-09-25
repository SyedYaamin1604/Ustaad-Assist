import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { ACTIVE_COURSES, PAST_COURSES } from "../../components/dashboard/dummyCourse";

const CourseDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const course = [...ACTIVE_COURSES, ...PAST_COURSES].find((c) => c.id === id);

    return (
        <View className="flex-1 bg-slate-50 p-6">
            <Text className="text-2xl font-outfit-bold">{course?.title ?? "Course not found"}</Text>
            {course && <Text className="text-slate-500 font-outfit-medium mt-1">{course.code}</Text>}
        </View>
    );
};

export default CourseDetail;
