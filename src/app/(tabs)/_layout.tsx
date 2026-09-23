import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import Dashboard from "./dashboard";
import Plan from "./plan";
import Students from "./students";
import Assessment from "./assessment";
import Material from "./material";

type TabItem = {
    key: string;
    label: string;
    icon: keyof typeof Feather.glyphMap; // restricts to valid Feather icon names
    screen: React.ComponentType;
};

const TABS: TabItem[] = [
    { key: "dashboard", label: "Dashboard", icon: "home", screen: Dashboard },
    { key: "plan", label: "Plan", icon: "calendar", screen: Plan },
    { key: "students", label: "Students", icon: "users", screen: Students },
    { key: "assessment", label: "Assessment", icon: "check-circle", screen: Assessment },
    { key: "material", label: "Material", icon: "file-text", screen: Material },
];

export default function TabsLayout() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const ActiveScreen = TABS.find((tab) => tab.key === activeTab)!.screen;

    return (
        <View className="flex-1">
            {/* Active screen content */}
            <View className="flex-1">
                <ActiveScreen />
            </View>

            {/* Bottom tab bar */}
            <View className="absolute bottom-12 left-0 right-0 items-center mx-10">
                <View
                    className="flex-row justify-center items-center bg-white rounded-full py-2 px-2 w-full shadow-lg"
                    style={{ elevation: 6 }} // NativeWind shadow needs elevation on Android
                >
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                activeOpacity={0.7}
                                onPress={() => setActiveTab(tab.key)}
                                className={`flex-row items-center rounded-full mx-0.5 py-2.5 ${isActive ? "bg-black px-4" : "px-3"
                                    }`}
                            >
                                <Feather
                                    name={tab.icon}
                                    size={20}
                                    color={isActive ? "#FFFFFF" : "#9CA3AF"}
                                />
                                {isActive && (
                                    <Text className="text-white text-[13px] font-semibold ml-1.5">
                                        {tab.label}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}