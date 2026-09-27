import { Feather } from "@expo/vector-icons";

export type MaterialCategoryKey =
  | "lectures"
  | "assignments"
  | "quizzes"
  | "pastPapers"
  | "references"
  | "notes";

export type MaterialAccentColor = "yellow" | "emerald" | "purple" | "pink" | "blue" | "orange";

export type MaterialFileType = "pdf" | "pptx" | "docx" | "zip" | "other";

/**
 * Describes one category tile on the Course Material home screen (Lectures, Assignments, ...).
 * `fileCount` / `totalSizeLabel` are category-level rollups — the backend field for these
 * doesn't exist yet (see design review: "Material is attached to a course, not to a class"),
 * so this shape only assumes a per-category count + size, nothing more specific.
 */
export interface MaterialCategoryMeta {
  key: MaterialCategoryKey;
  label: string; // "Lectures"
  singularLabel: string; // "lecture" — used to build "Upload lecture"
  icon: keyof typeof Feather.glyphMap;
  color: MaterialAccentColor;
  fileCount: number;
  totalSizeLabel: string; // "420 MB"
}

/** One uploaded file inside a category's listing. */
export interface MaterialFile {
  id: string;
  categoryKey: MaterialCategoryKey;
  fileName: string;
  fileType: MaterialFileType;
  uploadedAt: string; // ISO date — used for real "Recent" sorting
  uploadedLabel: string; // "Uploaded 22 Sep" — display text
  sizeLabel: string; // "14.2 MB"
  topic?: string; // "SQL Joins" — optional, matches "Link to topic (Optional)" in the upload sheet
  visibleToStudents: boolean;
}

/** What the Upload Material sheet collects before calling the service layer. */
export interface MaterialUploadDraft {
  categoryKey: MaterialCategoryKey;
  fileName: string;
  fileSizeLabel: string;
  fileType: MaterialFileType;
  topic: string | null;
  visibleToStudents: boolean;
}
