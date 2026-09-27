/** Course material records — the files themselves live in Supabase Storage. */

import { http } from "./client";
import type { Id, Material, MaterialFolder } from "./types";

export type CreateMaterialInput = {
  title: string;
  storage_path: string;
  topic_id?: Id | null;
  mime_type?: string | null;
  size_bytes?: number | null;
};

export const materialsApi = {
  /** Flat and grouped into one folder per topic; untagged files go to "Unsorted". */
  list: (courseId: Id) =>
    http.get<{ materials: Material[]; folders: MaterialFolder[] }>(`/courses/${courseId}/materials`),

  /** Call AFTER the file is uploaded to Storage. */
  create: (courseId: Id, input: CreateMaterialInput) => http.post<Material>(`/courses/${courseId}/materials`, input),

  /** Deletes the record only; returns the path so the app deletes the stored file. */
  remove: (materialId: Id) => http.delete<{ id: Id; storage_path: string }>(`/materials/${materialId}`),
};
