import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import type { Topic } from "@/api/types";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SelectModal } from "@/components/ui/SelectModal";
import { pickDocument, type PickedFile } from "@/lib/pickers";
import { formatBytes } from "@/utils/format";
import { showError } from "@/utils/errors";
import { fileTypeOf, getFileTypeIconMeta } from "@/utils/material";

export type MaterialUpload = { file: PickedFile; title: string; topicId: string | null };

interface UploadMaterialModalProps {
  visible: boolean;
  topics: Topic[];
  /** Pre-selected topic (e.g. opened from a class or from inside a folder). */
  initialTopicId: string | null;
  uploading: boolean;
  onClose: () => void;
  onUpload: (upload: MaterialUpload) => void;
}

const MAX_BYTES = 50 * 1024 * 1024;
const UNSORTED = "Unsorted (no topic)";

// Parent should remount (key) it each time it opens, so it starts empty.
export function UploadMaterialModal({ visible, topics, initialTopicId, uploading, onClose, onUpload }: UploadMaterialModalProps) {
  const [picked, setPicked] = useState<PickedFile | null>(null);
  const [title, setTitle] = useState("");
  const [topicId, setTopicId] = useState<string | null>(initialTopicId);
  const [isTopicPickerOpen, setTopicPickerOpen] = useState(false);

  const topicTitle = topics.find((t) => t.id === topicId)?.title ?? null;

  const browse = async () => {
    try {
      const file = await pickDocument();
      if (!file) return;
      if (file.size !== null && file.size > MAX_BYTES) {
        showError(new Error(`That file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_BYTES)}.`), "File too large");
        return;
      }
      setPicked(file);
      // Default the title to the file name, without the extension.
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch (error) {
      showError(error, "Couldn't open the file");
    }
  };

  const fileIconMeta = picked ? getFileTypeIconMeta(fileTypeOf(picked.mimeType ?? null, picked.name)) : null;

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-[var(--color-secondary)]/40">
          <Pressable className="absolute inset-0" onPress={onClose} />

          <View className="bg-[var(--color-primary)] rounded-t-[28px] px-5 pt-5 pb-8 max-h-[92%]">
            <View className="flex-row items-start justify-between mb-1">
              <View className="flex-1 mr-3">
                <Text className="font-outfit-bold text-2xl text-[var(--primary-font)]">Upload Material</Text>
                <Text className="font-outfit text-[13px] text-slate-500 mt-1">Slides, assignments, notes or reference files</Text>
              </View>
              <Pressable onPress={onClose} className="w-9 h-9 rounded-full bg-slate-200 items-center justify-center">
                <Feather name="x" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mt-4" keyboardShouldPersistTaps="handled">
              <Pressable onPress={browse} className="items-center border border-dashed border-[var(--primary-font)]/20 rounded-2xl py-6 px-4">
                <View className="w-12 h-12 rounded-full bg-[var(--color-yellow)] items-center justify-center mb-3">
                  <Feather name="upload-cloud" size={20} color="#0F172A" />
                </View>
                <Text className="font-outfit-medium text-[14px] text-[var(--primary-font)]">
                  <Text className="underline font-outfit-semibold">Tap to browse</Text> your files
                </Text>
                <Text className="font-outfit text-xs text-[var(--primary-font)]/40 mt-1">PDF, PPTX, DOCX, ZIP up to 50 MB</Text>
              </Pressable>

              {picked && fileIconMeta && (
                <View className="flex-row items-center bg-[var(--primary-font)]/5 rounded-2xl px-3.5 py-3 mt-3">
                  <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${fileIconMeta.bgClass}`}>
                    <Feather name={fileIconMeta.icon} size={16} color="#0F172A" />
                  </View>
                  <View className="flex-1 mr-2">
                    <Text numberOfLines={1} className="font-outfit-semibold text-[13px] text-[var(--primary-font)]">
                      {picked.name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Ionicons name="checkmark-circle" size={12} color="#0F9D63" />
                      <Text className="font-outfit text-xs text-[var(--primary-font)]/45 ml-1">{formatBytes(picked.size)} · Ready</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setPicked(null)} className="w-7 h-7 items-center justify-center">
                    <Feather name="x" size={14} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/60 mt-5 mb-2">Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. ER Modelling Slides"
                placeholderTextColor="#94A3B8"
                className="bg-[var(--primary-font)]/5 rounded-2xl px-4 py-3.5 font-outfit text-[15px] text-[var(--primary-font)]"
              />

              <Text className="font-outfit-medium text-[13px] text-[var(--primary-font)]/60 mt-5 mb-2">Topic (sets the folder)</Text>
              <Pressable
                onPress={() => setTopicPickerOpen(true)}
                className="flex-row items-center justify-between bg-[var(--primary-font)]/5 rounded-2xl px-5 py-4"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <Feather name="tag" size={14} color="#0F172A" />
                  <Text numberOfLines={1} className="font-outfit-medium text-[14px] ml-2.5 text-[var(--primary-font)]">
                    {topicTitle ?? UNSORTED}
                  </Text>
                </View>
                <Feather name="chevron-down" size={16} color="#64748B" />
              </Pressable>

              <View className="mt-6">
                <PrimaryButton
                  label={uploading ? "Uploading..." : "Upload material"}
                  onPress={() => picked && onUpload({ file: picked, title: title.trim() || picked.name, topicId })}
                  disabled={!picked || uploading}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SelectModal
        visible={isTopicPickerOpen}
        title="Link to topic"
        options={topics.map((t) => t.title)}
        value={topicTitle}
        onSelect={(selected) => setTopicId(topics.find((t) => t.title === selected)?.id ?? null)}
        onClose={() => setTopicPickerOpen(false)}
        allowClear
      />
    </>
  );
}
