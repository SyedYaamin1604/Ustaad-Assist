import { forwardRef } from "react";
import { Pressable, PressableProps, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import type { Href } from "expo-router";
import { TAB_BAR_BOTTOM_GAP } from "@/utils/tab-bar";

type TabItem = {
    name: string;
    href: Href;
    label: string;
    icon: keyof typeof Feather.glyphMap;
};

// `name` must match the route file name inside (tabs)
const TABS: TabItem[] = [
    { name: "Home", href: "/(tabs)/Home", label: "Dashboard", icon: "home" },
    { name: "plan", href: "/(tabs)/plan", label: "Plan", icon: "calendar" },
    { name: "students", href: "/(tabs)/students", label: "Students", icon: "users" },
    { name: "assessment", href: "/(tabs)/assessment", label: "Assessment", icon: "check-circle" },
    { name: "material", href: "/(tabs)/material", label: "Material", icon: "file-text" },
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

    return (
        <SafeAreaView className="flex-1" edges={["top"]}>
            <Tabs style={{ flex: 1 }}>
                <TabSlot />

                {/* TabList must be a direct child of Tabs so the triggers get registered */}
                <TabList
                    style={{
                        position: "absolute",
                        bottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
                        left: 40,
                        right: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        borderRadius: 9999,
                        padding: 8,
                        elevation: 6,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
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
