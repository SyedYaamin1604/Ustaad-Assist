import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import type { MaterialFolder } from "@/api/types";
import type { MaterialAccentColor } from "@/types/material";
import { formatBytes, plural } from "@/utils/format";
import { ACCENT_BG_CLASS, totalBytes } from "@/utils/material";

interface MaterialFolderCardProps {
  folder: MaterialFolder;
  color: MaterialAccentColor;
  onPress?: (folder: MaterialFolder) => void;
}

/** One topic's folder — the backend groups material by the topic it is linked to. */
export function MaterialFolderCard({ folder, color, onPress }: MaterialFolderCardProps) {
  const meta = `${plural(folder.count, "file")} · ${formatBytes(totalBytes(folder.materials))}`;

  return (
    <Pressable
      onPress={() => onPress?.(folder)}
      accessibilityRole="button"
      accessibilityLabel={`${folder.topic_title}, ${meta}`}
      className="active:opacity-90"
    >
      <View className={`${ACCENT_BG_CLASS[color]} rounded-[28px] p-4 h-[132px] justify-between overflow-hidden`}>
        <Image
          source={require("../../../assets/images/course-background-img.png")}
          resizeMode="contain"
          className="absolute -top-2 -right-2 w-[110px] h-[96px] opacity-50"
        />

        <View className="w-8 h-8 rounded-full bg-[var(--color-primary)] items-center justify-center">
          <Feather name="star" size={14} color="#111111" />
        </View>

        <View>
          <Text numberOfLines={1} className="text-[16px] font-outfit-bold text-[var(--primary-font)] pr-4">
            {folder.topic_title}
          </Text>
          <View className="flex-row items-center mt-1">
            <Feather name="folder" size={11} color="#111111" />
            <Text numberOfLines={1} className="text-xs font-outfit-medium text-[var(--primary-font)]/60 ml-1.5">
              {meta}
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
