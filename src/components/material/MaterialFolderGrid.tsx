import { Text, View } from "react-native";

import type { MaterialFolder } from "@/api/types";
import { MaterialFolderCard } from "@/components/material/MaterialFolderCard";
import { folderColor } from "@/utils/material";

interface MaterialFolderGridProps {
  folders: MaterialFolder[];
  emptyLabel?: string;
  onSelectFolder?: (folder: MaterialFolder) => void;
}

export function MaterialFolderGrid({ folders, emptyLabel, onSelectFolder }: MaterialFolderGridProps) {
  if (folders.length === 0) {
    return (
      <View className="items-center justify-center py-16">
        <Text className="text-[var(--primary-font)]/40 font-outfit text-sm text-center">{emptyLabel ?? "No material yet."}</Text>
      </View>
    );
  }

  const rows: MaterialFolder[][] = Array.from({ length: Math.ceil(folders.length / 2) }, (_, i) => folders.slice(i * 2, i * 2 + 2));

  return (
    <View className="gap-4 mt-5">
      {rows.map((row, rowIndex) => (
        <View key={row[0].topic_title} className="flex-row gap-4">
          {row.map((folder, i) => (
            <View key={folder.topic_title} className="flex-1">
              <MaterialFolderCard folder={folder} color={folderColor(rowIndex * 2 + i)} onPress={onSelectFolder} />
            </View>
          ))}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
}
