import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { Material, MaterialFolder } from "@/api/types";
import { MaterialListHeader } from "@/components/material/MaterialListHeader";
import { MaterialListItem } from "@/components/material/MaterialListItem";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { addDays, localDateOf, toISODate, today } from "@/utils/date";
import { formatBytes, plural } from "@/utils/format";
import { totalBytes } from "@/utils/material";
import { useTabBarInset } from "@/utils/tab-bar";

interface MaterialListScreenProps {
  folder: MaterialFolder;
  courseLabel: string;
  /** The file currently being opened or deleted. */
  busyId: string | null;
  onBack: () => void;
  onOpenUpload: () => void;
  onOpenFile: (file: Material) => void;
  onDeleteFile: (file: Material) => void;
}

const RECENT_WINDOW_DAYS = 14;

export function MaterialListScreen({ folder, courseLabel, busyId, onBack, onOpenUpload, onOpenFile, onDeleteFile }: MaterialListScreenProps) {
  const tabBarInset = useTabBarInset();
  const [filter, setFilter] = useState<"All" | "Recent">("All");

  const visibleFiles = useMemo(() => {
    const sorted = [...folder.materials].sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
    if (filter === "All") return sorted;
    const since = toISODate(addDays(today(), -RECENT_WINDOW_DAYS));
    return sorted.filter((f) => localDateOf(f.uploaded_at) >= since);
  }, [folder.materials, filter]);

  const options = [`All (${folder.count})`, "Recent"];

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2" contentContainerStyle={{ paddingBottom: tabBarInset + 80 }} showsVerticalScrollIndicator={false}>
        <MaterialListHeader
          folderLabel={folder.topic_title}
          subtitle={`${plural(folder.count, "file")} · ${formatBytes(totalBytes(folder.materials))} · ${courseLabel}`}
          onBack={onBack}
        />

        <View className="mb-5">
          <SegmentedPills
            options={options}
            value={filter === "All" ? options[0] : "Recent"}
            onChange={(v) => setFilter(v.startsWith("All") ? "All" : "Recent")}
          />
        </View>

        {visibleFiles.length === 0 ? (
          <View className="items-center py-16">
            <Text className="font-outfit-medium text-[var(--primary-font)]/40">
              {filter === "Recent" ? `Nothing uploaded in the last ${RECENT_WINDOW_DAYS} days.` : "Nothing here yet."}
            </Text>
          </View>
        ) : (
          visibleFiles.map((file) => (
            <MaterialListItem key={file.id} file={file} busy={busyId === file.id} onOpen={onOpenFile} onDelete={onDeleteFile} />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={onOpenUpload}
        style={{ bottom: tabBarInset + 16, elevation: 6 }}
        className="absolute right-5 flex-row items-center bg-[var(--color-secondary)] rounded-full pl-4 pr-5 py-3.5 shadow-lg"
      >
        <Feather name="plus" size={16} color="#fff" />
        <Text className="font-outfit-semibold text-[13px] text-[var(--secondary-font)] ml-2">Upload here</Text>
      </Pressable>
    </View>
  );
}
