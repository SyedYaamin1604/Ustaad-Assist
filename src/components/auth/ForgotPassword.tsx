import React from "react";
import { Text, Pressable, View } from "react-native";

const ForgotPassword = ({ onPress }: { onPress?: () => void }) => {
  return (
    <View className="items-end">
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="text-sm font-outfit text-[var(--primary-font)]/50">
          Forgot password?
        </Text>
      </Pressable>
    </View>
  );
};

export default ForgotPassword;
