import { Feather } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChangeText, placeholder = "Search" }: SearchInputProps) {
  return (
    <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3">
      <Feather name="search" size={18} color="#94A3B8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        className="flex-1 ml-2.5 font-outfit text-[15px] text-black"
      />
    </View>
  );
}
