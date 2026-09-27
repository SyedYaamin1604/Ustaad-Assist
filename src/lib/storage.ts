/**
 * Supabase Storage helpers.
 *
 * The backend never receives a file. The app uploads here first, then sends the
 * returned path to the API (materials, class-list extraction, outline import).
 */

import { config } from "./config";
import { supabase } from "./supabase";

export type LocalFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

/** Keep only characters that are safe in a storage key. */
function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

/**
 * `<teacher's user id>/8/material/1727440000000-er-slides.pdf`
 *
 * The first folder is the signed-in teacher's own user id. The bucket's
 * policies only allow a teacher into the folder named after them (see
 * README "Storage policies"), so one teacher can never read or delete
 * another's files. The course id comes next so a course's files sit together.
 */
export function buildStoragePath(userId: string, courseId: string, folder: string, fileName: string): string {
  return `${userId}/${courseId}/${folder}/${Date.now()}-${safeFileName(fileName)}`;
}

/** Upload a local file and return its storage path. */
export async function uploadFile(file: LocalFile, path: string): Promise<string> {
  // fetch() on a local file URI gives the raw bytes, which is what
  // Supabase Storage expects from React Native.
  const bytes = await fetch(file.uri).then((res) => res.arrayBuffer());

  const { data, error } = await supabase.storage.from(config.storageBucket).upload(path, bytes, {
    contentType: file.mimeType ?? "application/octet-stream",
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return data.path;
}

export async function removeFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(config.storageBucket).remove([path]);
  if (error) throw new Error(`Could not delete the stored file: ${error.message}`);
}

/** A temporary link for opening a private file. */
export async function getSignedUrl(path: string, expiresInSeconds = 60 * 10): Promise<string> {
  const { data, error } = await supabase.storage
    .from(config.storageBucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw new Error(`Could not open the file: ${error.message}`);
  return data.signedUrl;
}
