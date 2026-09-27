import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReportsHeader } from "../components/report/ReportsHeader";
import { ReportsTitle } from "../components/report/ReportsTitle";
import { AttendanceReportCard } from "../components/report/AttendanceReportCard";
import { GradeSheetCard } from "../components/report/GradeSheetCard";
import { CourseDeliveryCard } from "../components/report/CourseDeliveryCard";
import { useRouter } from "expo-router";

export default function Report() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <ReportsHeader
                courseLabel="CS-301 Fall"
                onBackPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/Home"))}
                onFilterPress={() => { }}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <ReportsTitle
                    title="Semester Reports"
                    subtitle="Database Systems CS-301 · Official Documentation"
                />

                <View className="gap-5 px-6">
                    <AttendanceReportCard
                        generatedLabel="Generated today"
                        studentCount={32}
                        onOpen={() => { }}
                        onShare={() => { }}
                    />

                    <GradeSheetCard progress={68} statusLabel="Compiling cohort percentiles..." />

                    <CourseDeliveryCard
                        weeksLogged={14}
                        totalWeeks={16}
                        onGenerate={() => { }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}