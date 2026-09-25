import React from "react";
import { View, Text, Pressable } from "react-native";

type Tab = "signin" | "create";

type TabsProps = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

const TABS: { key: Tab; label: string }[] = [
  { key: "signin", label: "Sign in" },
  { key: "create", label: "Create account" },
];

const Tabs = ({ activeTab, onChange }: TabsProps) => {
  return (
    <View
      className="flex-row bg-[var(--color-primary)] border border-[#eef0f6] rounded-full p-1 mb-6"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      {TABS.map(({ key, label }) => {
        const active = activeTab === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={`flex-1 py-3 rounded-full items-center ${
              active ? "bg-[var(--color-secondary)]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-[15px] ${
                active ? "font-outfit-semibold text-[var(--secondary-font)]" : "font-outfit text-[var(--primary-font)]/40"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Tabs;
