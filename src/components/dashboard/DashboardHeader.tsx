import { Feather, Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

interface DashboardHeaderProps {
    name: string;
    term: string;
    avatarUri?: string;
    onOpenSettings?: () => void;
    onOpenProfile?: () => void;
}

const DashboardHeader = ({
    name,
    term,
    avatarUri,
    onOpenSettings,
    onOpenProfile,
}: DashboardHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between">
            <Pressable
                onPress={onOpenProfile}
                accessibilityRole="button"
                accessibilityLabel="Open profile"
                className="flex-row items-center flex-1 mr-4 active:opacity-70"
            >
                <View className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary)]/20 overflow-hidden items-center justify-center shadow-sm">
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} className="w-full h-full" />
                    ) : (
                        <Ionicons name="person" size={34} color="#475569" style={{ marginTop: 10 }} />
                    )}
                </View>
                <View className="ml-3 flex-1">
                    <Text numberOfLines={1} className="text-2xl font-outfit-bold text-[var(--primary-font)]">
                        {name}
                    </Text>
                    <Text numberOfLines={1} className="text-[14px] font-outfit text-[var(--color-secondary)]/40 mt-0.5">
                        {term}
                    </Text>
                </View>
            </Pressable>

            <Pressable
                onPress={onOpenSettings}
                accessibilityRole="button"
                accessibilityLabel="Settings"
                className="w-12 h-12 rounded-full bg-[var(--color-primary)] items-center justify-center shadow-sm active:opacity-80"
                style={{ elevation: 2 }}
            >
                <Feather name="settings" size={25} color="#111111" />
            </Pressable>
        </View>
    );
};

export default DashboardHeader;