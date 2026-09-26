import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

type FormInputProps = TextInputProps & {
  label: string;
};

const FormInput = ({ label, ...props }: FormInputProps) => {
  return (
    <View
      className="bg-[var(--color-primary)] border border-[#eef0f6] rounded-3xl px-4 py-4 mb-4"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <Text className="text-[11px] font-outfit-semibold text-[var(--primary-font)]/40 tracking-wider mb-1.5">
        {label.toUpperCase()}
      </Text>
      <TextInput
        className="text-[16px] font-outfit text-[var(--primary-font)] p-0"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
};

export default FormInput;
