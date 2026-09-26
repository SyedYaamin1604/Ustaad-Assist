import React from "react";
import { View, Text } from "react-native";

type HeaderProps = {
    title: string;
    subtitle: string;
    showBack?: boolean;
    onBackPress?: () => void;
};

const Header = ({ title, subtitle }: HeaderProps) => {
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
