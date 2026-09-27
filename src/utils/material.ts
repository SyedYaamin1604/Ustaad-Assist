import { Feather } from "@expo/vector-icons";

import type { Material } from "@/api/types";
import type { MaterialAccentColor, MaterialFileType } from "@/types/material";

const ACCENT_ORDER: MaterialAccentColor[] = ["yellow", "emerald", "purple", "pink", "blue", "orange"];

/** Folders cycle through the palette, like the course cards. */
export function folderColor(index: number): MaterialAccentColor {
  return ACCENT_ORDER[index % ACCENT_ORDER.length];
}

export const ACCENT_BG_CLASS: Record<MaterialAccentColor, string> = {
  yellow: "bg-[var(--color-yellow)]",
  emerald: "bg-[var(--color-emerald)]",
  purple: "bg-[var(--color-purple)]",
  pink: "bg-[var(--color-pink)]",
  blue: "bg-[var(--color-blue)]",
  orange: "bg-[var(--color-orange)]",
};

interface FileTypeIconMeta {
  icon: keyof typeof Feather.glyphMap;
  bgClass: string;
}

const FILE_TYPE_ICON: Record<MaterialFileType, FileTypeIconMeta> = {
  pdf: { icon: "file-text", bgClass: "bg-[var(--color-blue)]/30" },
  pptx: { icon: "layout", bgClass: "bg-[var(--color-orange)]/30" },
  docx: { icon: "file", bgClass: "bg-[var(--color-purple)]/30" },
  image: { icon: "image", bgClass: "bg-[var(--color-pink)]/30" },
  zip: { icon: "archive", bgClass: "bg-[var(--primary-font)]/10" },
  other: { icon: "paperclip", bgClass: "bg-[var(--primary-font)]/10" },
};

export function getFileTypeIconMeta(fileType: MaterialFileType): FileTypeIconMeta {
  return FILE_TYPE_ICON[fileType] ?? FILE_TYPE_ICON.other;
}

/** From the stored MIME type, falling back to the file extension. */
export function fileTypeOf(mimeType: string | null, name: string): MaterialFileType {
  const mime = mimeType ?? "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (mime.includes("presentation") || mime.includes("powerpoint") || ext === "pptx" || ext === "ppt") return "pptx";
  if (mime.includes("word") || ext === "docx" || ext === "doc") return "docx";
  if (mime.startsWith("image/")) return "image";
  if (mime.includes("zip") || ext === "zip") return "zip";
  return "other";
}

export function materialFileType(material: Material): MaterialFileType {
  return fileTypeOf(material.mime_type, material.storage_path);
}

export function totalBytes(materials: Material[]): number {
  return materials.reduce((sum, m) => sum + (m.size_bytes ?? 0), 0);
}
