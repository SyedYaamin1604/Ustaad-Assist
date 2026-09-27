import { MaterialCategoryCard } from "@/components/material/MaterialCategoryCard";
import { MaterialCategoryMeta } from "@/types/material";
import { Text, View } from "react-native";

interface MaterialCategoryGridProps {
  categories: MaterialCategoryMeta[];
  emptyLabel?: string;
  onSelectCategory?: (category: MaterialCategoryMeta) => void;
}

export function MaterialCategoryGrid({ categories, emptyLabel, onSelectCategory }: MaterialCategoryGridProps) {
  if (categories.length === 0) {
    return (
      <View className="items-center justify-center py-16">
        <Text className="text-[var(--primary-font)]/40 font-outfit text-sm text-center">
          {emptyLabel ?? "No material yet."}
        </Text>
      </View>
    );
  }

  const rows: MaterialCategoryMeta[][] = Array.from(
    { length: Math.ceil(categories.length / 2) },
    (_, i) => categories.slice(i * 2, i * 2 + 2)
  );

  return (
    <View className="gap-4 mt-5">
      {rows.map((row) => (
        <View key={row[0].key} className="flex-row gap-4">
          {row.map((category) => (
            <View key={category.key} className="flex-1">
              <MaterialCategoryCard category={category} onPress={onSelectCategory} />
            </View>
          ))}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
}
