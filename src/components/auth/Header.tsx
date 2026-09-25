import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type HeaderProps = {
    title: string;
    subtitle: string;
    showBack?: boolean;
    onBackPress?: () => void;
};

const Header = ({ title, subtitle, showBack = true, onBackPress }: HeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBackPress) return onBackPress();
        if (router.canGoBack()) router.back();
    };

    return (
        <View className="mb-7 py-10">
            <Text className="text-[34px] font-outfit-bold text-[var(--color-secondary)] leading-[36px] tracking-tight">
                {title}
            </Text>
            <Text className="text-[15px] font-outfit text-[var(--primary-font)]/40 mt-3 leading-5">
                {subtitle}
            </Text>
        </View>
    );
};

export default Header;
