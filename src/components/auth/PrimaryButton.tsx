import React from "react";
import { Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
};

const PrimaryButton = ({ label, onPress }: PrimaryButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[var(--color-secondary)] py-4 rounded-full items-center mb-3 active:opacity-90"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
      }}
    >
      <Text className="text-[var(--secondary-font)] font-outfit-semibold text-[16px]">
        {label}
      </Text>
    </Pressable>
  );
};

export default PrimaryButton;
