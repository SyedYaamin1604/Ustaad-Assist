import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

type PasswordInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
};

const PasswordInput = ({ label = "Password", value, onChangeText }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <View
      className="bg-[var(--color-primary)] border border-[#eef0f6] rounded-3xl px-4 py-4 mb-4 flex-row items-center justify-between"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View className="flex-1">
        <Text className="text-[11px] font-outfit-semibold text-[var(--primary-font)]/40 tracking-wider mb-1.5">
          {label.toUpperCase()}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          placeholder="••••••••••••"
          placeholderTextColor="#9ca3af"
          className="text-[16px] font-outfit text-[var(--primary-font)] p-0"
        />
      </View>

      <Pressable onPress={() => setVisible((prev) => !prev)} hitSlop={10} className="ml-2">
        <Feather name={visible ? "eye-off" : "eye"} size={20} color="#9ca3af" />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
