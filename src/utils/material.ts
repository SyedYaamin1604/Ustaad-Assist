import { MaterialAccentColor, MaterialFileType } from "@/types/material";
import { Feather } from "@expo/vector-icons";

const TAG_COLOR_ORDER: MaterialAccentColor[] = ["yellow", "blue", "purple", "pink", "emerald", "orange"];

/** Deterministic color per topic string, so the same topic always gets the same tag color. */
export function getTopicTagColor(topic: string): MaterialAccentColor {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) {
    hash = (hash * 31 + topic.charCodeAt(i)) % 997;
  }
  return TAG_COLOR_ORDER[hash % TAG_COLOR_ORDER.length];
}

export const ACCENT_BG_CLASS: Record<MaterialAccentColor, string> = {
  yellow: "bg-[var(--color-yellow)]",
  emerald: "bg-[var(--color-emerald)]",
  purple: "bg-[var(--color-purple)]",
  pink: "bg-[var(--color-pink)]",
  blue: "bg-[var(--color-blue)]",
  orange: "bg-[var(--color-orange)]",
};

export const ACCENT_BG_SOFT_CLASS: Record<MaterialAccentColor, string> = {
  yellow: "bg-[var(--color-yellow)]/30",
  emerald: "bg-[var(--color-emerald)]/25",
  purple: "bg-[var(--color-purple)]/30",
  pink: "bg-[var(--color-pink)]/30",
  blue: "bg-[var(--color-blue)]/30",
  orange: "bg-[var(--color-orange)]/30",
};

interface FileTypeIconMeta {
  icon: keyof typeof Feather.glyphMap;
  bgClass: string;
}

const FILE_TYPE_ICON: Record<MaterialFileType, FileTypeIconMeta> = {
  pdf: { icon: "file-text", bgClass: "bg-[var(--color-blue)]/30" },
  pptx: { icon: "layout", bgClass: "bg-[var(--color-orange)]/30" },
  docx: { icon: "file", bgClass: "bg-[var(--color-purple)]/30" },
  zip: { icon: "archive", bgClass: "bg-[var(--primary-font)]/10" },
  other: { icon: "paperclip", bgClass: "bg-[var(--primary-font)]/10" },
};

export function getFileTypeIconMeta(fileType: MaterialFileType): FileTypeIconMeta {
  return FILE_TYPE_ICON[fileType] ?? FILE_TYPE_ICON.other;
}

/** Guesses a MaterialFileType from a file name's extension — used for the mock "file picker". */
export function inferFileType(fileName: string): MaterialFileType {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "pptx" || ext === "ppt") return "pptx";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "zip") return "zip";
  return "other";
}
