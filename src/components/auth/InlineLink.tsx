import React from "react";
import { Text } from "react-native";

type InlineLinkProps = {
  prefix: string;
  linkText: string;
  onPress?: () => void;
};

const InlineLink = ({ prefix, linkText, onPress }: InlineLinkProps) => {
  return (
    <Text className="text-center text-sm font-outfit text-[var(--primary-font)]/40">
      {prefix}{" "}
      <Text onPress={onPress} className="font-outfit-semibold text-[var(--primary-font)] underline">
        {linkText}
      </Text>
    </Text>
  );
};

export default InlineLink;
