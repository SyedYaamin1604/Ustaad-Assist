import { MaterialCategoryGrid } from "@/components/material/MaterialCategoryGrid";
import { MaterialHomeHeader } from "@/components/material/MaterialHomeHeader";
import { MaterialOfflineStorageCard } from "@/components/material/MaterialOfflineStorageCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { fetchAllMaterials, fetchMaterialCategories } from "@/services/materialService";
import { MaterialCategoryKey, MaterialCategoryMeta, MaterialFile } from "@/types/material";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

interface MaterialHomeScreenProps {
  courseId: string;
  refreshToken?: number;
  onOpenCategory: (key: MaterialCategoryKey) => void;
}

export function MaterialHomeScreen({ courseId, refreshToken = 0, onOpenCategory }: MaterialHomeScreenProps) {
  const [categories, setCategories] = useState<MaterialCategoryMeta[]>([]);
  const [allFiles, setAllFiles] = useState<MaterialFile[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Files");

  useEffect(() => {
    let cancelled = false;
    // Only show the loading state on the very first load — a refreshToken bump
    // (e.g. after an upload) should update the grid silently, not blank it out.
    if (categories.length === 0) setLoading(true);
    Promise.all([fetchMaterialCategories(courseId), fetchAllMaterials()]).then(([cats, files]) => {
      if (cancelled) return;
      setCategories(cats);
      setAllFiles(files);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, refreshToken]);

  const totalFiles = categories.reduce((sum, c) => sum + c.fileCount, 0);

  const filterOptions = useMemo(() => {
    const pdfCount = allFiles.filter((f) => f.fileType === "pdf").length;
    const slideCount = allFiles.filter((f) => f.fileType === "pptx").length;
    const zipCount = allFiles.filter((f) => f.fileType === "zip").length;
    return ["All Files", `PDFs (${pdfCount})`, `Slides (${slideCount})`, `Zips (${zipCount})`];
  }, [allFiles]);

  const visibleCategories = useMemo(() => {
    let result = categories;

    if (search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) => c.label.toLowerCase().includes(q));
    }

    const activeType = typeFilter.startsWith("PDFs")
      ? "pdf"
      : typeFilter.startsWith("Slides")
        ? "pptx"
        : typeFilter.startsWith("Zips")
          ? "zip"
          : null;

    if (activeType) {
      const categoriesWithType = new Set(allFiles.filter((f) => f.fileType === activeType).map((f) => f.categoryKey));
      result = result.filter((c) => categoriesWithType.has(c.key));
    }

    return result;
  }, [categories, search, typeFilter, allFiles]);

  return (
    <View className="flex-1 bg-[var(--color-accent)]">
      <ScrollView contentContainerClassName="px-5 pt-2 pb-32" showsVerticalScrollIndicator={false}>
        <MaterialHomeHeader
          courseCode="CS-301"
          semesterLabel="Semester VI"
          courseTitle="Course Material"
          subtitle={`Database Systems CS-301 · ${totalFiles} Files`}
          onOpenFilters={() => Alert.alert("Filters", "Advanced filters (date range, size, uploader) aren't built yet — use the chips below for now.")}
          onOpenMenu={() => Alert.alert("Course menu", "Export material list, storage settings and archive options will live here.")}
        />

        <View className="mb-4">
          <SearchInput value={search} onChangeText={setSearch} placeholder="Search material, slides, notes..." />
        </View>

        <View className="mb-1">
          <SegmentedPills options={filterOptions} value={typeFilter} onChange={setTypeFilter} />
        </View>

        <MaterialCategoryGrid
          categories={visibleCategories}
          emptyLabel={isLoading ? "Loading material..." : "No categories match your search/filter."}
          onSelectCategory={(category) => onOpenCategory(category.key)}
        />

        <MaterialOfflineStorageCard
          usedLabel="645 MB of 2 GB cached"
          onManage={() => Alert.alert("Offline storage", "Managing cached files will be available once local caching is implemented.")}
        />
      </ScrollView>
    </View>
  );
}