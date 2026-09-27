/**
 * Getting a file off the phone: the document picker and the camera.
 * Both resolve to null when the teacher cancels.
 */

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import type { LocalFile } from "./storage";

export type PickedFile = LocalFile & { size: number | null };

export async function pickDocument(types: string[] = ["*/*"]): Promise<PickedFile | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: types, copyToCacheDirectory: true });
  if (result.canceled) return null;

  const asset = result.assets[0];
  return { uri: asset.uri, name: asset.name, mimeType: asset.mimeType ?? null, size: asset.size ?? null };
}

export async function takePhoto(): Promise<PickedFile | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Camera access is needed to photograph a class list or course outline. You can allow it in Settings.");
  }

  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName ?? `class-list-${Date.now()}.jpg`,
    mimeType: asset.mimeType ?? "image/jpeg",
    size: asset.fileSize ?? null,
  };
}
