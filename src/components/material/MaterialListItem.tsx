import { MaterialTopicTag } from "@/components/material/MaterialTopicTag";
import { MaterialFile } from "@/types/material";
import { getFileTypeIconMeta } from "@/utils/material";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface MaterialListItemProps {
  file: MaterialFile;
  onDownload?: (file: MaterialFile) => void;
}

export function MaterialListItem({ file, onDownload }: MaterialListItemProps) {
  const iconMeta = getFileTypeIconMeta(file.fileType);

  return (
    <View className="flex-row items-center bg-[var(--color-primary)] rounded-2xl px-3.5 py-3 mb-3 shadow-sm">
      <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${iconMeta.bgClass}`}>
        <Feather name={iconMeta.icon} size={18} color="#0F172A" />
      </View>

      <View className="flex-1 mr-2">
        <Text numberOfLines={1} className="font-outfit-semibold text-[14px] text-[var(--primary-font)]">
          {file.fileName}
        </Text>
        <Text className="font-outfit text-xs text-[var(--primary-font)]/45 mt-0.5">
          {file.uploadedLabel} · {file.sizeLabel}
        </Text>
        {file.topic && (
          <View className="mt-1.5">
            <MaterialTopicTag topic={file.topic} />
          </View>
        )}
      </View>

      <Pressable
        onPress={() => onDownload?.(file)}
        accessibilityRole="button"
        accessibilityLabel={`Download ${file.fileName}`}
        className="w-9 h-9 rounded-full bg-[var(--primary-font)]/5 items-center justify-center"
      >
        <Feather name="download" size={16} color="#0F172A" />
      </Pressable>
    </View>
  );
}
