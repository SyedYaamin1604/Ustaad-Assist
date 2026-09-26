import React from "react";
import { Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const GoogleButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[var(--color-primary)] border border-[#eef0f6] py-4 rounded-full flex-row items-center justify-center mb-6 active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <AntDesign name="google" size={20} color="#4285F4" style={{ marginRight: 10 }} />
      <Text className="text-[var(--primary-font)] font-outfit-semibold text-[16px]">
        Continue with Google
      </Text>
    </Pressable>
  );
};

export default GoogleButton;
