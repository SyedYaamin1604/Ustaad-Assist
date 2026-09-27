/** Small display helpers shared across screens. */

import type { ComponentType } from "@/api/types";

// "Ayesha Khan" -> "AK"
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_PALETTE = [
  { bg: "#E0E7FF", text: "#4338CA" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#D1FAE5", text: "#047857" },
  { bg: "#FCE7F3", text: "#BE185D" },
  { bg: "#EDE9FE", text: "#6D28D9" },
  { bg: "#E0F2FE", text: "#0369A1" },
];

/** A stable avatar colour per student, so the same person always looks the same. */
export function avatarColors(seed: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

// 86.4 -> "86.4%", 100 -> "100%", null -> "—"
export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

// 2400000 -> "2.3 MB"
export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

export const COMPONENT_LABEL: Record<ComponentType, string> = {
  quiz: "Quiz",
  assignment: "Assignment",
  midterm: "Midterm",
  final: "Final",
  participation: "Participation",
};

export const COMPONENTS: ComponentType[] = ["quiz", "assignment", "midterm", "final", "participation"];

/** "1 class", "3 classes" */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}
