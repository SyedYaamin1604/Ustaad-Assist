import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import type { Material, MaterialFolder } from "@/api/types";
import { MaterialFolderGrid } from "@/components/material/MaterialFolderGrid";
import { MaterialHomeHeader } from "@/components/material/MaterialHomeHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import type { MaterialFileType } from "@/types/material";
import { materialFileType } from "@/utils/material";
import { useTabBarInset } from "@/utils/tab-bar";

interface MaterialHomeScreenProps {
  courseCode: string;
  courseName: string;
  semester: string | null;
  materials: Material[];
  folders: MaterialFolder[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenFolder: (folder: MaterialFolder) => void;
  onOpenUpload: () => void;
}

const TYPE_FILTERS: { label: string; type: MaterialFileType | null }[] = [
  { label: "All Files", type: null },
  { label: "PDFs", type: "pdf" },
  { label: "Slides", type: "pptx" },
  { label: "Docs", type: "docx" },
];

export function MaterialHomeScreen({
  courseCode,
  courseName,
  semester,
  materials,
  folders,
  refreshing,
  onRefresh,
  onOpenFolder,
  onOpenUpload,
}: MaterialHomeScreenProps) {
  const tabBarInset = useTabBarInset();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MaterialFileType | null>(null);

  const options = TYPE_FILTERS.map((f) =>
    f.type === null ? f.label : `${f.label} (${materials.filter((m) => materialFileType(m) === f.type).length})`,
  );
  const activeLabel = options[TYPE_FILTERS.findIndex((f) => f.type === typeFilter)];

  // A folder shows if its name matches, or any file inside it does, and it holds the chosen file type.
  const visibleFolders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return folders.filter((folder) => {
      const matchesSearch =
        !q || folder.topic_title.toLowerCase().includes(q) || folder.materials.some((m) => m.title.toLowerCase().includes(q));
      const matchesType = !typeFilter || folder.materials.some((m) => materialFileType(m) === typeFilter);
      return matchesSearch && matchesType;
    });
  }, [folders, search, typeFilter]);

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView
        contentContainerClassName="px-5 pt-2"
        contentContainerStyle={{ paddingBottom: tabBarInset + 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <MaterialHomeHeader
          courseCode={courseCode}
          semesterLabel={semester}
          courseTitle="Course Material"
          subtitle={`${courseName} · ${materials.length} Files`}
        />

        <View className="mb-4">
          <SearchInput value={search} onChangeText={setSearch} placeholder="Search material, slides, notes..." />
        </View>

        <View className="mb-1">
          <SegmentedPills
            options={options}
            value={activeLabel}
            onChange={(label) => setTypeFilter(TYPE_FILTERS[options.indexOf(label)]?.type ?? null)}
          />
        </View>

        <MaterialFolderGrid
          folders={visibleFolders}
          emptyLabel={
            materials.length === 0
              ? "No material yet. Upload slides or notes and link them to a topic."
              : "No folders match your search or filter."
          }
          onSelectFolder={onOpenFolder}
        />
      </ScrollView>

      <Pressable
        onPress={onOpenUpload}
        style={{ bottom: tabBarInset + 16, elevation: 6 }}
        className="absolute right-5 flex-row items-center bg-[var(--color-secondary)] rounded-full pl-4 pr-5 py-3.5 shadow-lg"
      >
        <Feather name="plus" size={16} color="#fff" />
        <Text className="font-outfit-semibold text-[13px] text-[var(--secondary-font)] ml-2">Upload file</Text>
      </Pressable>
    </View>
  );
}
