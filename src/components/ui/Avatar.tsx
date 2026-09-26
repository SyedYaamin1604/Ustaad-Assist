import { Text, View } from "react-native";

interface AvatarProps {
  label: string;
  bgClassName?: string;
  textClassName?: string;
  sizeClassName?: string;
}

export function Avatar({
  label,
  bgClassName = "bg-[var(--color-purple)]",
  textClassName = "text-black",
  sizeClassName = "w-10 h-10",
}: AvatarProps) {
  return (
    <View className={`${sizeClassName} ${bgClassName} rounded-full items-center justify-center`}>
      <Text className={`font-outfit-semibold text-sm ${textClassName}`}>{label}</Text>
    </View>
  );
}
