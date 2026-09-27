/**
 * The class list review (backend CLAUDE.md §3.7).
 *
 * Extracted or pasted rows are a DRAFT. The teacher reviews them before
 * anything is saved, because a misread roll number (CT-21001 vs CT-2100I)
 * silently corrupts that student's record for the whole semester.
 *
 * These checks match what POST /students/import refuses, so problems are shown
 * on the review screen instead of coming back as an error.
 */

export type RosterRow = {
  /** Local key for the list; not sent to the server. */
  key: string;
  roll_no: string;
  name: string;
  /** 0–1 from extraction. Pasted and hand-typed rows are 1. */
  confidence: number;
};

export type RowIssue = "missing-roll" | "missing-name" | "duplicate" | "low-confidence";

const LOW_CONFIDENCE = 0.8;

let nextKey = 0;
export function newRow(roll_no = "", name = "", confidence = 1): RosterRow {
  nextKey += 1;
  return { key: `row-${nextKey}`, roll_no, name, confidence };
}

/**
 * "CS-24-001, Ayesha Khan" or "CS-24-001<TAB>Ayesha Khan", one per line.
 * The roll number is everything before the first comma or tab.
 */
export function parseRosterText(text: string): RosterRow[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([^,\t]+)[,\t](.*)$/);
      return match ? newRow(match[1].trim(), match[2].trim()) : newRow(line, "");
    });
}

export function rowIssues(rows: RosterRow[]): Map<string, RowIssue[]> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const roll = row.roll_no.trim().toUpperCase();
    if (roll) counts.set(roll, (counts.get(roll) ?? 0) + 1);
  }

  const issues = new Map<string, RowIssue[]>();
  for (const row of rows) {
    const list: RowIssue[] = [];
    const roll = row.roll_no.trim().toUpperCase();
    if (!roll) list.push("missing-roll");
    if (!row.name.trim()) list.push("missing-name");
    // Duplicates are flagged, never merged: one of them was misread.
    if (roll && (counts.get(roll) ?? 0) > 1) list.push("duplicate");
    if (row.confidence < LOW_CONFIDENCE) list.push("low-confidence");
    if (list.length > 0) issues.set(row.key, list);
  }
  return issues;
}

/** Low confidence is a warning to double-check; the rest block saving. */
export function isBlocking(issue: RowIssue): boolean {
  return issue !== "low-confidence";
}

export const ISSUE_TEXT: Record<RowIssue, string> = {
  "missing-roll": "Roll number missing",
  "missing-name": "Name missing",
  duplicate: "Roll number appears twice",
  "low-confidence": "Hard to read — check it",
};
