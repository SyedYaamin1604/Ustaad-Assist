import { MaterialCategoryKey, MaterialCategoryMeta, MaterialFile, MaterialUploadDraft } from "@/types/material";

/**
 * MOCK DATA LAYER
 * ----------------
 * The backend for Course Material has not been defined yet (it isn't one of the
 * screens covered in the design review, and the review explicitly warns against
 * inventing backend fields/endpoints). Everything below is temporary, in-memory
 * mock data standing in for what will eventually be network calls.
 *
 * Every exported function is `async` and returns a Promise, matching the shape
 * a real API client (e.g. `fetch(...)`) would have. When the backend is ready,
 * only the *bodies* of these functions need to change — no screen or component
 * that calls them needs to be touched.
 */

const CATEGORY_META: Record<MaterialCategoryKey, MaterialCategoryMeta> = {
  lectures: {
    key: "lectures",
    label: "Lectures",
    singularLabel: "lecture",
    icon: "play-circle",
    color: "yellow",
    fileCount: 18,
    totalSizeLabel: "420 MB",
  },
  assignments: {
    key: "assignments",
    label: "Assignments",
    singularLabel: "assignment",
    icon: "file-text",
    color: "emerald",
    fileCount: 6,
    totalSizeLabel: "18 MB",
  },
  quizzes: {
    key: "quizzes",
    label: "Quizzes",
    singularLabel: "quiz",
    icon: "help-circle",
    color: "purple",
    fileCount: 8,
    totalSizeLabel: "12 MB",
  },
  pastPapers: {
    key: "pastPapers",
    label: "Past Papers",
    singularLabel: "past paper",
    icon: "archive",
    color: "pink",
    fileCount: 5,
    totalSizeLabel: "85 MB",
  },
  references: {
    key: "references",
    label: "References",
    singularLabel: "reference",
    icon: "book-open",
    color: "blue",
    fileCount: 7,
    totalSizeLabel: "110 MB",
  },
  notes: {
    key: "notes",
    label: "Notes",
    singularLabel: "note",
    icon: "edit-3",
    color: "orange",
    fileCount: 4,
    totalSizeLabel: "15 MB",
  },
};

const MOCK_FILES: Record<MaterialCategoryKey, MaterialFile[]> = {
  lectures: [
    { id: "lec-1", uploadedAt: "2026-09-22T09:00:00", categoryKey: "lectures", fileName: "07_SQL_Joins_Part2.pdf", fileType: "pdf", uploadedLabel: "Uploaded 22 Sep", sizeLabel: "14.2 MB", topic: "SQL Joins", visibleToStudents: true },
    { id: "lec-2", uploadedAt: "2026-09-18T09:00:00", categoryKey: "lectures", fileName: "06_SQL_Joins_Part1.pdf", fileType: "pdf", uploadedLabel: "Uploaded 18 Sep", sizeLabel: "8.5 MB", topic: "SQL Joins", visibleToStudents: true },
    { id: "lec-3", uploadedAt: "2026-09-14T09:00:00", categoryKey: "lectures", fileName: "05_Relational_Algebra.pptx", fileType: "pptx", uploadedLabel: "Uploaded 14 Sep", sizeLabel: "21.8 MB", topic: "Relational Algebra", visibleToStudents: true },
    { id: "lec-4", uploadedAt: "2026-09-09T09:00:00", categoryKey: "lectures", fileName: "04_ER_Modeling_Final.pdf", fileType: "pdf", uploadedLabel: "Uploaded 09 Sep", sizeLabel: "5.2 MB", topic: "ER Modeling", visibleToStudents: true },
    { id: "lec-5", uploadedAt: "2026-09-03T09:00:00", categoryKey: "lectures", fileName: "03_Schema_Constraints.pdf", fileType: "pdf", uploadedLabel: "Uploaded 03 Sep", sizeLabel: "4.1 MB", topic: "Database Design", visibleToStudents: false },
  ],
  assignments: [
    { id: "asg-1", uploadedAt: "2026-09-20T09:00:00", categoryKey: "assignments", fileName: "Assignment2_Schema.pdf", fileType: "pdf", uploadedLabel: "Uploaded 20 Sep", sizeLabel: "2.1 MB", topic: "Normalization", visibleToStudents: true },
    { id: "asg-2", uploadedAt: "2026-09-05T09:00:00", categoryKey: "assignments", fileName: "Assignment1_ER_Diagrams.docx", fileType: "docx", uploadedLabel: "Uploaded 05 Sep", sizeLabel: "1.4 MB", topic: "ER Modeling", visibleToStudents: true },
  ],
  quizzes: [
    { id: "qz-1", uploadedAt: "2026-09-16T09:00:00", categoryKey: "quizzes", fileName: "Quiz1_Answer_Key.pdf", fileType: "pdf", uploadedLabel: "Uploaded 16 Sep", sizeLabel: "1.1 MB", topic: "ER Modeling", visibleToStudents: false },
  ],
  pastPapers: [
    { id: "pp-1", uploadedAt: "2026-09-01T09:00:00", categoryKey: "pastPapers", fileName: "Midterm_2025_Solved.pdf", fileType: "pdf", uploadedLabel: "Uploaded 01 Sep", sizeLabel: "9.8 MB", topic: "Database Design", visibleToStudents: true },
  ],
  references: [
    { id: "ref-1", uploadedAt: "2026-08-30T09:00:00", categoryKey: "references", fileName: "Silberschatz_Ch5_Excerpt.pdf", fileType: "pdf", uploadedLabel: "Uploaded 30 Aug", sizeLabel: "12.6 MB", topic: "Relational Algebra", visibleToStudents: true },
  ],
  notes: [
    { id: "nt-1", uploadedAt: "2026-09-23T09:00:00", categoryKey: "notes", fileName: "Week4_Recap_Notes.docx", fileType: "docx", uploadedLabel: "Uploaded 23 Sep", sizeLabel: "0.6 MB", topic: "SQL Joins", visibleToStudents: true },
  ],
};

// Kept intentionally at 0: this is local mock data with nowhere to actually travel to.
// The functions below still return Promises (not raw values) so that swapping the
// body for a real fetch() later needs zero changes to any screen that calls them.
// If you want to rehearse loading states against a slow connection, bump this back
// up temporarily (e.g. 250-400ms) — just don't ship it that way.
const MOCK_DELAY_MS = 0;

function delay<T>(value: T): Promise<T> {
  if (MOCK_DELAY_MS === 0) return Promise.resolve(value);
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}


/** Every file across every category — used for the home screen's file-type filter chips. */
export async function fetchAllMaterials(): Promise<MaterialFile[]> {
  return delay(Object.values(MOCK_FILES).flat());
}

/** All six category tiles for the Course Material home screen. */
export async function fetchMaterialCategories(_courseId: string): Promise<MaterialCategoryMeta[]> {
  return delay(Object.values(CATEGORY_META));
}

export async function fetchMaterialCategoryMeta(categoryKey: MaterialCategoryKey): Promise<MaterialCategoryMeta> {
  return delay(CATEGORY_META[categoryKey]);
}

/** Files for a single category's listing screen. */
export async function fetchMaterialsByCategory(categoryKey: MaterialCategoryKey): Promise<MaterialFile[]> {
  return delay(MOCK_FILES[categoryKey] ?? []);
}

/** Distinct topics available for the "Link to topic" selector — course-wide, not category-specific. */
export async function fetchCourseTopics(_courseId: string): Promise<string[]> {
  const all = Object.values(MOCK_FILES).flat();
  const unique = Array.from(new Set(all.map((f) => f.topic).filter((t): t is string => !!t)));
  return delay(unique);
}

/**
 * Mock "upload". Appends to the in-memory list and resolves with the created record,
 * mirroring what a real POST /courses/:id/material endpoint would return.
 */
export async function uploadMaterial(draft: MaterialUploadDraft): Promise<MaterialFile> {
  const created: MaterialFile = {
    id: `${draft.categoryKey}-${Date.now()}`,
    categoryKey: draft.categoryKey,
    fileName: draft.fileName,
    fileType: draft.fileType,
    uploadedAt: new Date().toISOString(),
    uploadedLabel: "Uploaded just now",
    sizeLabel: draft.fileSizeLabel,
    topic: draft.topic ?? undefined,
    visibleToStudents: draft.visibleToStudents,
  };
  MOCK_FILES[draft.categoryKey] = [created, ...(MOCK_FILES[draft.categoryKey] ?? [])];
  CATEGORY_META[draft.categoryKey].fileCount += 1;
  return delay(created);
}