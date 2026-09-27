import { MaterialListHeader } from "@/components/material/MaterialListHeader";
import { MaterialListItem } from "@/components/material/MaterialListItem";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { fetchMaterialCategoryMeta, fetchMaterialsByCategory } from "@/services/materialService";
import { MaterialCategoryKey, MaterialCategoryMeta, MaterialFile } from "@/types/material";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

interface MaterialListScreenProps {
  categoryKey: MaterialCategoryKey;
  onBack: () => void;
  onOpenUpload: () => void;
}

const REFERENCE_NOW = new Date(2026, 8, 27); // matches the app's "current date"
const RECENT_WINDOW_DAYS = 14;

const FILTERS = ["All", "Recent", "By Topic"] as const;

export function MaterialListScreen({ categoryKey, onBack, onOpenUpload }: MaterialListScreenProps) {
  const [meta, setMeta] = useState<MaterialCategoryMeta | null>(null);
  const [files, setFiles] = useState<MaterialFile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchMaterialCategoryMeta(categoryKey), fetchMaterialsByCategory(categoryKey)]).then(
      ([categoryMeta, categoryFiles]) => {
        if (cancelled) return;
        setMeta(categoryMeta);
        setFiles(categoryFiles);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  const filterOptions = useMemo(() => [`All (${files.length})`, "Recent", "By Topic"], [files.length]);

  const visibleFiles = useMemo(() => {
    if (filter === "Recent") {
      return files
        .filter((f) => {
          const days = (REFERENCE_NOW.getTime() - new Date(f.uploadedAt).getTime()) / (1000 * 60 * 60 * 24);
          return days <= RECENT_WINDOW_DAYS;
        })
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    }
    if (filter === "By Topic") {
      return [...files].sort((a, b) => (a.topic ?? "zzz").localeCompare(b.topic ?? "zzz"));
    }
    return [...files].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [files, filter]);

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-32" showsVerticalScrollIndicator={false}>
        <MaterialListHeader
          categoryLabel={meta?.label ?? ""}
          subtitle={meta ? `${meta.fileCount} files · Database Systems CS-301` : ""}
          onBack={onBack}
          onOpenMenu={() =>
            Alert.alert("Category menu", "Sorting, bulk-download and delete options will live here.")
          }
        />

        <View className="mb-5">
          <SegmentedPills
            options={filterOptions}
            value={filter === "All" ? filterOptions[0] : filter}
            onChange={(v) => setFilter((v.startsWith("All") ? "All" : v) as (typeof FILTERS)[number])}
          />
        </View>

        {isLoading ? (
          <View className="items-center py-16">
            <Text className="font-outfit-medium text-[var(--primary-font)]/40">Loading {meta?.label.toLowerCase() ?? "material"}...</Text>
          </View>
        ) : visibleFiles.length === 0 ? (
          <View className="items-center py-16">
            <Text className="font-outfit-medium text-[var(--primary-font)]/40">Nothing here yet.</Text>
          </View>
        ) : (
          visibleFiles.map((file) => (
            <MaterialListItem
              key={file.id}
              file={file}
              onDownload={(f) => Alert.alert("Download", `Downloading ${f.fileName}... (mock — no file server yet)`)}
            />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={onOpenUpload}
        className="absolute bottom-28 right-5 flex-row items-center bg-[var(--color-secondary)] rounded-full pl-4 pr-5 py-3.5 shadow-lg"
        style={{ elevation: 6 }}
      >
        <Feather name="plus" size={16} color="#fff" />
        <Text className="font-outfit-semibold text-[13px] text-[var(--secondary-font)] ml-2">
          Upload {meta?.singularLabel ?? "material"}
        </Text>
      </Pressable>
    </View>
  );
}
