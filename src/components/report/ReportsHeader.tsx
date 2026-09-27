import { Pressable, Text, View } from "react-native";
import { ChevronLeft, SlidersHorizontal } from "lucide-react-native";

type ReportsHeaderProps = {
  courseLabel: string;
  onBackPress?: () => void;
  onFilterPress?: () => void;
};

export function ReportsHeader({
  courseLabel,
  onBackPress,
  onFilterPress,
}: ReportsHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 pt-2">
      <Pressable
        onPress={onBackPress}
        className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-70"
      >
        <ChevronLeft size={20} color="#111827" />
      </Pressable>

      <View className="flex-row items-center gap-2 rounded-full bg-white px-4 py-2">
        <View className="h-1.5 w-1.5 rounded-full bg-gray-900" />
        <Text className="text-[13px] font-semibold text-gray-900">
          {courseLabel}
        </Text>
      </View>

      <Pressable
        onPress={onFilterPress}
        className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-70"
      >
        <SlidersHorizontal size={18} color="#111827" />
      </Pressable>
    </View>
  );
}