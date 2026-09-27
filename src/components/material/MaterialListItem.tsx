import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { Material } from "@/api/types";
import { formatDayMonth, localDateOf } from "@/utils/date";
import { formatBytes } from "@/utils/format";
import { getFileTypeIconMeta, materialFileType } from "@/utils/material";

interface MaterialListItemProps {
  file: Material;
  busy?: boolean;
  onOpen: (file: Material) => void;
  onDelete: (file: Material) => void;
}

export function MaterialListItem({ file, busy = false, onOpen, onDelete }: MaterialListItemProps) {
  const iconMeta = getFileTypeIconMeta(materialFileType(file));

  return (
    <Pressable onPress={() => onOpen(file)} className="flex-row items-center bg-[var(--color-primary)] rounded-2xl px-3.5 py-3 mb-3 shadow-sm active:opacity-80">
      <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${iconMeta.bgClass}`}>
        <Feather name={iconMeta.icon} size={18} color="#0F172A" />
      </View>

      <View className="flex-1 mr-2">
        <Text numberOfLines={1} className="font-outfit-semibold text-[14px] text-[var(--primary-font)]">
          {file.title}
        </Text>
        <Text className="font-outfit text-xs text-[var(--primary-font)]/45 mt-0.5">
          Uploaded {formatDayMonth(localDateOf(file.uploaded_at))} · {formatBytes(file.size_bytes)}
        </Text>
      </View>

      {busy ? (
        <ActivityIndicator color="#0F172A" />
      ) : (
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => onDelete(file)}
            accessibilityLabel={`Delete ${file.title}`}
            className="w-9 h-9 rounded-full bg-[var(--primary-font)]/5 items-center justify-center"
          >
            <Feather name="trash-2" size={15} color="#64748B" />
          </Pressable>
          <Pressable
            onPress={() => onOpen(file)}
            accessibilityLabel={`Open ${file.title}`}
            className="w-9 h-9 rounded-full bg-[var(--primary-font)]/5 items-center justify-center"
          >
            <Feather name="download" size={16} color="#0F172A" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
