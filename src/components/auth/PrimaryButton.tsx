import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  /** Shows a spinner and ignores presses while a request is in flight. */
  loading?: boolean;
};

const PrimaryButton = ({ label, onPress, loading = false }: PrimaryButtonProps) => {
  return (
    <Pressable
      onPress={loading ? undefined : onPress}
      disabled={loading}
      className={`bg-[var(--color-secondary)] py-4 rounded-full items-center mb-3 active:opacity-90 ${loading ? "opacity-70" : ""}`}
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-[var(--secondary-font)] font-outfit-semibold text-[16px]">{label}</Text>
      )}
    </Pressable>
  );
};

export default PrimaryButton;
