import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { MaterialHomeScreen } from "@/components/material/MaterialHomeScreen";
import { MaterialListScreen } from "@/components/material/MaterialListScreen";
import { UploadMaterialModal } from "@/components/material/UploadMaterialModal";
import { fetchMaterialCategories } from "@/services/materialService";
import { MaterialCategoryKey, MaterialCategoryMeta } from "@/types/material";

const COURSE_ID = "course-cs301";

const Material = () => {
  const [view, setView] = useState<"home" | "list">("home");
  const [activeCategory, setActiveCategory] = useState<MaterialCategoryKey | null>(null);
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [categories, setCategories] = useState<MaterialCategoryMeta[]>([]);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    fetchMaterialCategories(COURSE_ID).then(setCategories);
  }, [refreshToken]);

  const openCategory = (key: MaterialCategoryKey) => {
    setActiveCategory(key);
    setView("list");
  };

  const openUpload = () => {
    if (!activeCategory) return;
    setUploadOpen(true);
  };

  const handleUploaded = () => {
    setRefreshToken((t) => t + 1);
    Alert.alert("Uploaded", "Material added — the backend endpoint for this is still in development, so this is stored in memory only for now.");
  };

  if (view === "list" && activeCategory) {
    return (
      <>
        <MaterialListScreen
          key={`${activeCategory}-${refreshToken}`}
          categoryKey={activeCategory}
          onBack={() => setView("home")}
          onOpenUpload={openUpload}
        />
        <UploadMaterialModal
          visible={isUploadOpen}
          initialCategoryKey={activeCategory}
          categories={categories}
          onClose={() => setUploadOpen(false)}
          onUploaded={handleUploaded}
        />
      </>
    );
  }

  return <MaterialHomeScreen key={refreshToken} courseId={COURSE_ID} onOpenCategory={openCategory} />;
};

export default Material;
