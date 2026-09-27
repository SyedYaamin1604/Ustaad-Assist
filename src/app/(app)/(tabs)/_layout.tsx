import { forwardRef } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Redirect, useRouter, type Href } from "expo-router";

import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useCourse } from "@/providers/CourseProvider";
import { TAB_BAR_BOTTOM_GAP } from "@/utils/tab-bar";

type TabItem = {
    name: string;
    href: Href;
    label: string;
    icon: keyof typeof Feather.glyphMap;
};

// `name` must match the route file name inside (tabs)
const TABS: TabItem[] = [
    { name: "home", href: "/home", label: "Dashboard", icon: "home" },
    { name: "plan", href: "/plan", label: "Plan", icon: "calendar" },
    { name: "students", href: "/students", label: "Students", icon: "users" },
    { name: "assessment", href: "/assessment", label: "Assessment", icon: "check-circle" },
    { name: "material", href: "/material", label: "Material", icon: "file-text" },
];

type TabButtonProps = PressableProps & {
    isFocused?: boolean;
    label: string;
    icon: keyof typeof Feather.glyphMap;
};

// TabTrigger (asChild) injects onPress and isFocused into this component
const TabButton = forwardRef<View, TabButtonProps>(
    ({ isFocused, label, icon, ...props }, ref) => (
        <Pressable
            ref={ref}
            {...props}
            className={`flex-row items-center rounded-full mx-0.5 py-2.5 ${isFocused ? "bg-black px-4" : "px-3"
                }`}
        >
            <Feather name={icon} size={20} color={isFocused ? "#FFFFFF" : "#9CA3AF"} />
            {isFocused && (
                <Text className="text-white text-[13px] font-outfit-semibold ml-1.5">
                    {label}
                </Text>
            )}
        </Pressable>
    )
);
TabButton.displayName = "TabButton";

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { courseId, course, courseError, isRestoring, selectCourse, reloadCourse } = useCourse();

    // Every tab works inside one course. Without one, go and pick it.
    if (isRestoring) return <LoadingState />;
    if (!courseId) return <Redirect href="/dashboard" />;

    if (!course) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                {courseError ? (
                    <View className="flex-1">
                        <ErrorState message={courseError} onRetry={reloadCourse} />
                        <Pressable
                            onPress={() => {
                                selectCourse(null);
                                router.replace("/dashboard");
                            }}
                            className="items-center pb-10"
                        >
                            <Text className="font-outfit-semibold text-slate-500">Choose another course</Text>
                        </Pressable>
                    </View>
                ) : (
                    <LoadingState label="Opening course..." />
                )}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1" edges={["top"]}>
            <Tabs style={{ flex: 1 }}>
                <TabSlot />

                {/* TabList must be a direct child of Tabs so the triggers get registered */}
                <TabList
                    style={{
                        position: "absolute",
                        bottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
                        alignSelf: "center",       // size to content, don't stretch edge-to-edge
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,                     // consistent spacing regardless of active label width
                        backgroundColor: "#FFFFFF",
                        borderRadius: 9999,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        elevation: 8,               // bump above Android content so cards can't bleed through
                        shadowColor: "#000",
                        shadowOpacity: 0.12,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                    }}
                >
                    {TABS.map((tab) => (
                        <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
                            <TabButton label={tab.label} icon={tab.icon} />
                        </TabTrigger>
                    ))}
                </TabList>
            </Tabs>
        </SafeAreaView>
    );
}
