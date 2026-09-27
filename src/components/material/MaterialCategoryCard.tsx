import { MaterialCategoryMeta } from "@/types/material";
import { ACCENT_BG_CLASS } from "@/utils/material";
import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

interface MaterialCategoryCardProps {
  category: MaterialCategoryMeta;
  onPress?: (category: MaterialCategoryMeta) => void;
}

export function MaterialCategoryCard({ category, onPress }: MaterialCategoryCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(category)}
      accessibilityRole="button"
      accessibilityLabel={`${category.label}, ${category.fileCount} files, ${category.totalSizeLabel}`}
      className="active:opacity-90"
    >
      <View className={`${ACCENT_BG_CLASS[category.color]} rounded-[28px] p-4 h-[132px] justify-between overflow-hidden`}>
        <Image
          source={require("../../../assets/images/course-background-img.png")}
          resizeMode="contain"
          className="absolute -top-2 -right-2 w-[110px] h-[96px] opacity-50"
        />

        <View className="w-8 h-8 rounded-full bg-[var(--color-primary)] items-center justify-center">
          <Feather name="star" size={14} color="#111111" />
        </View>

        <View>
          <Text numberOfLines={1} className="text-[16px] font-outfit-bold text-[var(--primary-font)]">
            {category.label}
          </Text>
          <View className="flex-row items-center mt-1">
            <Feather name="folder" size={11} color="#111111" />
            <Text numberOfLines={1} className="text-xs font-outfit-medium text-[var(--primary-font)]/60 ml-1.5">
              {category.fileCount} files · {category.totalSizeLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Arrow sits on the card edge, overlapping into the gutter — same treatment as CourseCard */}
      <View
        className="absolute -right-3 top-[58px] w-8 h-8 rounded-full bg-[var(--color-secondary)] items-center justify-center"
        style={{ elevation: 4 }}
      >
        <Feather name="arrow-up-right" size={15} color="#ffffff" />
      </View>
    </Pressable>
  );
}
