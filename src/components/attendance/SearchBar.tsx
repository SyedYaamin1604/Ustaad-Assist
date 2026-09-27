import React from "react";
import { TextInput, View } from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search by student name or roll no...",
}: SearchBarProps) {
  return (
    <View className="mx-5 mt-3 flex-row items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-3">
      <Search size={16} color="#a3a3a3" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a3a3a3"
        className="flex-1 text-sm text-neutral-800"
      />
    </View>
  );
}