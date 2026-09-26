import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"];

export function NumericKeypad({ onKeyPress }: NumericKeypadProps) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {KEYS.map((key) => (
        <Pressable
          key={key}
          onPress={() => onKeyPress(key)}
          className="w-[31%] mb-3 bg-slate-100 rounded-2xl py-4 items-center justify-center active:bg-slate-200"
        >
          {key === "backspace" ? (
            <Feather name="delete" size={20} color="#0F172A" />
          ) : (
            <Text className="font-outfit-semibold text-xl text-black">{key}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
