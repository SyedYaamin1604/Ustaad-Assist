/**
 * Course material, one folder per topic.
 *
 *   list    GET    /courses/:id/materials   (records only — files live in Supabase Storage)
 *   upload  Storage upload, THEN POST /courses/:id/materials with the returned path
 *   open    a signed Storage URL
 *   delete  DELETE /materials/:id, THEN remove the stored file at the returned path
 *
 * ?topicId=7 (from a class in the plan) opens the upload sheet for that topic.
 */

import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { materialsApi, type Material } from "@/api";
import { MaterialHomeScreen } from "@/components/material/MaterialHomeScreen";
import { MaterialListScreen } from "@/components/material/MaterialListScreen";
import { UploadMaterialModal, type MaterialUpload } from "@/components/material/UploadMaterialModal";
import { ErrorState, LoadingState } from "@/components/ui/ScreenState";
import { useApi } from "@/hooks/useApi";
import { buildStoragePath, getSignedUrl, removeFile, uploadFile } from "@/lib/storage";
import { useAuth } from "@/providers/AuthProvider";
import { useCourse } from "@/providers/CourseProvider";
import { showError } from "@/utils/errors";

export default function MaterialTab() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topicId?: string }>();
  const { courseId, course } = useCourse();
  const { session } = useAuth();

  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [upload, setUpload] = useState<{ count: number; open: boolean; topicId: string | null }>({ count: 0, open: false, topicId: null });
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, error, loading, reload } = useApi(courseId ? () => materialsApi.list(courseId) : null, [courseId]);

  const openUpload = (topicId: string | null) => setUpload((prev) => ({ count: prev.count + 1, open: true, topicId }));

  // Deep link from "Attach material" on a class: open the upload sheet once...
  const [handledTopicId, setHandledTopicId] = useState<string | undefined>(undefined);
  if (params.topicId !== handledTopicId) {
    setHandledTopicId(params.topicId);
    if (params.topicId) setUpload((prev) => ({ count: prev.count + 1, open: true, topicId: params.topicId ?? null }));
  }

  // ...then clear the param, so returning to the tab does not reopen it.
  useEffect(() => {
    if (params.topicId) router.setParams({ topicId: undefined });
  }, [params.topicId, router]);

  if (!courseId || !course) return <LoadingState />;
  if (!data) return error ? <ErrorState message={error} onRetry={reload} /> : <LoadingState label="Loading material..." />;

  const courseLabel = [course.name, course.code].filter(Boolean).join(" ");
  const folder = data.folders.find((f) => f.topic_title === openFolder);

  const doUpload = async ({ file, title, topicId }: MaterialUpload) => {
    setUploading(true);
    let storagePath: string | null = null;
    try {
      storagePath = await uploadFile(file, buildStoragePath(session!.user.id, courseId, "material", file.name));
      await materialsApi.create(courseId, {
        title,
        storage_path: storagePath,
        topic_id: topicId,
        mime_type: file.mimeType ?? null,
        size_bytes: file.size,
      });
      setUpload((prev) => ({ ...prev, open: false }));
      reload();
    } catch (err) {
      // The file reached Storage but the record was refused: don't leave it orphaned.
      if (storagePath) removeFile(storagePath).catch(() => undefined);
      showError(err, "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openFile = async (file: Material) => {
    setBusyId(file.id);
    try {
      await Linking.openURL(await getSignedUrl(file.storage_path));
    } catch (err) {
      showError(err, "Couldn't open the file");
    } finally {
      setBusyId(null);
    }
  };

  const deleteFile = (file: Material) => {
    Alert.alert(`Delete ${file.title}?`, "The file is removed for good.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setBusyId(file.id);
          try {
            // The API deletes the record and hands back the path; the app deletes the file.
            const { storage_path } = await materialsApi.remove(file.id);
            await removeFile(storage_path);
          } catch (err) {
            showError(err, "Couldn't delete the file");
          } finally {
            setBusyId(null);
            reload();
          }
        },
      },
    ]);
  };

  const uploadSheet = (
    <UploadMaterialModal
      key={upload.count}
      visible={upload.open}
      topics={course.topics}
      initialTopicId={upload.topicId}
      uploading={uploading}
      onClose={() => setUpload((prev) => ({ ...prev, open: false }))}
      onUpload={doUpload}
    />
  );

  if (folder) {
    return (
      <>
        <MaterialListScreen
          folder={folder}
          courseLabel={courseLabel}
          busyId={busyId}
          onBack={() => setOpenFolder(null)}
          onOpenUpload={() => openUpload(folder.topic_id)}
          onOpenFile={openFile}
          onDeleteFile={deleteFile}
        />
        {uploadSheet}
      </>
    );
  }

  return (
    <>
      <MaterialHomeScreen
        courseCode={course.code ?? course.name}
        courseName={courseLabel}
        semester={course.semester}
        materials={data.materials}
        folders={data.folders}
        refreshing={loading}
        onRefresh={reload}
        onOpenFolder={(f) => setOpenFolder(f.topic_title)}
        onOpenUpload={() => openUpload(null)}
      />
      {uploadSheet}
    </>
  );
}
