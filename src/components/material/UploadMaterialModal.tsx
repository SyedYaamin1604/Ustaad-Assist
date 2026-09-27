import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SegmentedPills } from "@/components/ui/SegmentedPills";
import { SelectModal } from "@/components/ui/SelectModal";
import { fetchCourseTopics, uploadMaterial } from "@/services/materialService";
import { MaterialCategoryKey, MaterialCategoryMeta } from "@/types/material";
import { getFileTypeIconMeta, inferFileType } from "@/utils/material";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Switch, Text, View } from "react-native";

interface UploadMaterialModalProps {
  visible: boolean;
  initialCategoryKey: MaterialCategoryKey;
  categories: MaterialCategoryMeta[];
  onClose: () => void;
  onUploaded: () => void;
}

// A stand-in for a native file picker result — there's no document-picker package
// in this project yet, so "browsing" mocks selecting one plausible file.
const MOCK_PICKED_FILE = { fileName: "08_Subqueries_Advanced.pdf", sizeLabel: "14.2 MB" };

export function UploadMaterialModal({
  visible,
  initialCategoryKey,
  categories,
  onClose,
  onUploaded,
}: UploadMaterialModalProps) {
  const [destination, setDestination] = useState<MaterialCategoryKey>(initialCategoryKey);
  const [pickedFile, setPickedFile] = useState<typeof MOCK_PICKED_FILE | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string | null>(null);
  const [isTopicPickerOpen, setTopicPickerOpen] = useState(false);
  const [visibleToStudents, setVisibleToStudents] = useState(true);
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setDestination(initialCategoryKey);
    setPickedFile(null);
    setTopic(null);
    setVisibleToStudents(true);
    setUploading(false);
    fetchCourseTopics("course-cs301").then(setTopics);
  }, [visible, initialCategoryKey]);

  const destinationMeta = categories.find((c) => c.key === destination);

  const handleBrowse = () => {
    setPickedFile(MOCK_PICKED_FILE);
  };

  const handleUpload = async () => {
    if (!pickedFile) return;
    setUploading(true);
    try {
      await uploadMaterial({
        categoryKey: destination,
        fileName: pickedFile.fileName,
        fileSizeLabel: pickedFile.sizeLabel,
        fileType: inferFileType(pickedFile.fileName),
        topic,
        visibleToStudents,
      });
      onUploaded();
      onClose();
    } catch {
      Alert.alert("Upload failed", "Something went wrong — please try again.");
    } finally {
      setUploading(false);
    }
  };

  const fileIconMeta = pickedFile ? getFileTypeIconMeta(inferFileType(pickedFile.fileName)) : null;

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-[var(--color-secondary)]/40">
          <Pressable className="absolute inset-0" onPress={onClose} />

          <View className="bg-[var(--color-primary)] rounded-t-[28px] px-5 pt-5 pb-8 max-h-[92%]">
            <View className="flex-row items-start justify-between mb-1">
              <View className="flex-1 mr-3">
                <Text className="font-outfit-bold text-xl text-[var(--primary-font)]">Upload Material</Text>
                <Text className="font-outfit text-[13px] text-[var(--primary-font)]/50 mt-1">
                  Add slides, assignments, notes or reference files
                </Text>
              </View>
              <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-[var(--primary-font)]/5 items-center justify-center">
                <Feather name="x" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
              {/* Drop zone */}
              <Pressable
                onPress={handleBrowse}
                className="items-center border border-dashed border-[var(--primary-font)]/20 rounded-2xl py-6 px-4"
              >
                <View className="w-12 h-12 rounded-full bg-[var(--color-yellow)] items-center justify-center mb-3">
                  <Feather name="upload-cloud" size={20} color="#0F172A" />
                </View>
                <Text className="font-outfit-medium text-[14px] text-[var(--primary-font)]">
                  Drag & drop file or <Text className="underline font-outfit-semibold">tap to browse</Text>
                </Text>
                <Text className="font-outfit text-xs text-[var(--primary-font)]/40 mt-1">
                  PDF, PPTX, DOCX, ZIP up to 50MB
                </Text>
              </Pressable>

              {/* Selected file */}
              {pickedFile && fileIconMeta && (
                <View className="flex-row items-center bg-[var(--primary-font)]/5 rounded-2xl px-3.5 py-3 mt-3">
                  <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${fileIconMeta.bgClass}`}>
                    <Feather name={fileIconMeta.icon} size={16} color="#0F172A" />
                  </View>
                  <View className="flex-1 mr-2">
                    <Text numberOfLines={1} className="font-outfit-semibold text-[13px] text-[var(--primary-font)]">
                      {pickedFile.fileName}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Ionicons name="checkmark-circle" size={12} color="#0F9D63" />
                      <Text className="font-outfit text-xs text-[var(--primary-font)]/45 ml-1">
                        {pickedFile.sizeLabel} · Ready
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setPickedFile(null)} className="w-7 h-7 items-center justify-center">
                    <Feather name="x" size={14} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {/* Destination folder */}
              <View className="flex-row items-center justify-between mt-5 mb-2">
                <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/60">Destination folder</Text>
                <Text className="font-outfit text-xs text-[var(--primary-font)]/35">Required</Text>
              </View>
              <SegmentedPills
                options={categories.map((c) => c.label)}
                value={destinationMeta?.label ?? ""}
                onChange={(label) => {
                  const match = categories.find((c) => c.label === label);
                  if (match) setDestination(match.key);
                }}
              />

              {/* Topic */}
              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/60 mt-5 mb-2">
                Link to topic (Optional)
              </Text>
              <Pressable
                onPress={() => setTopicPickerOpen(true)}
                className="flex-row items-center justify-between bg-[var(--primary-font)]/5 rounded-2xl px-4 py-3.5"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <Feather name="tag" size={14} color="#0F172A" />
                  <Text
                    numberOfLines={1}
                    className={`font-outfit-medium text-[14px] ml-2.5 ${topic ? "text-[var(--primary-font)]" : "text-[var(--primary-font)]/40"}`}
                  >
                    {topic ?? "Select a topic"}
                  </Text>
                </View>
                <Feather name="chevron-down" size={16} color="#64748B" />
              </Pressable>

              {/* Visibility toggle */}
              <View className="flex-row items-center justify-between bg-[var(--primary-font)]/5 rounded-2xl px-4 py-3.5 mt-5">
                <View className="flex-row items-center flex-1 mr-3">
                  <Feather name="eye" size={16} color="#0F172A" />
                  <View className="ml-2.5 flex-1">
                    <Text className="font-outfit-medium text-[14px] text-[var(--primary-font)]">
                      Visible to students immediately
                    </Text>
                    <Text className="font-outfit text-xs text-[var(--primary-font)]/40 mt-0.5">
                      Notify enrolled class via push
                    </Text>
                  </View>
                </View>
                <Switch
                  value={visibleToStudents}
                  onValueChange={setVisibleToStudents}
                  trackColor={{ false: "#E2E4EE", true: "#000000" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E2E4EE"
                />
              </View>

              <View className="mt-6">
                <PrimaryButton
                  label={isUploading ? "Uploading..." : "Upload material"}
                  onPress={handleUpload}
                  disabled={!pickedFile || isUploading}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SelectModal
        visible={isTopicPickerOpen}
        title="Link to topic"
        options={topics}
        value={topic}
        onSelect={(v) => setTopic(v || null)}
        onClose={() => setTopicPickerOpen(false)}
        allowClear
      />
    </>
  );
}
