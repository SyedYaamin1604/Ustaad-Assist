import { Pressable, Text, View } from "react-native";

interface CourseTabsProps {
    value: "active" | "past";
    onChange: (tab: "active" | "past") => void;
}

const TABS: { key: "active" | "past"; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "past", label: "Past" },
];

const CourseTabs = ({ value, onChange }: CourseTabsProps) => {
    return (
        <View className="flex-row gap-2 mt-7">
            {TABS.map(({ key, label }) => {
                const selected = value === key;
                return (
                    <Pressable
                        key={key}
                        onPress={() => onChange(key)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected }}
                        className={`px-5 h-10 rounded-full items-center justify-center active:opacity-80 ${selected ? "bg-[var(--color-secondary)]" : "bg-[var(--color-primary)]"
                            }`}
                    >
                        <Text
                            className={`text-lg ${selected ? "text-[var(--secondary-font)] font-outfit-semibold" : "text-[var(--primary-font)]/40 font-outfit-medium"
                                }`}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default CourseTabs;
