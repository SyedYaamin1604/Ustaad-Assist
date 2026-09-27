import type { DayName } from "@/api/types";
import { config } from "@/lib/config";

export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function firstWeekdayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay();
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function to12Hour(hours24: number): { hour12: number; meridiem: "AM" | "PM" } {
  const meridiem: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;
  return { hour12, meridiem };
}

export function to24Hour(hour12: number, meridiem: "AM" | "PM"): number {
  if (meridiem === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Parses a YYYY-MM-DD string as a local date (new Date("2026-09-22") would be UTC midnight).
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function shortWeekday(date: Date): string {
  return SHORT_WEEKDAYS[date.getDay()];
}

export function shortMonth(date: Date): string {
  return MONTH_NAMES[date.getMonth()].slice(0, 3);
}

// "Tue 22 Sep"
export function formatShortDate(date: Date): string {
  return `${shortWeekday(date)} ${date.getDate()} ${shortMonth(date)}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Today as YYYY-MM-DD. Honours EXPO_PUBLIC_DEMO_TODAY so the app and the
 * backend agree on "today" while demonstrating a seeded semester.
 */
export function todayISO(): string {
  return config.demoToday ?? toISODate(new Date());
}

export function today(): Date {
  return parseISODate(todayISO());
}

/** A real timestamp (e.g. material.uploaded_at) as the local calendar date, YYYY-MM-DD. */
export function localDateOf(timestamp: string): string {
  return toISODate(new Date(timestamp));
}

// "22 Sep"
export function formatDayMonth(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${shortMonth(d)}`;
}

// "22 Sep 2026"
export function formatFullDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${shortMonth(d)} ${d.getFullYear()}`;
}

// "Tuesday 22 September"
export function formatLongDate(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return `${weekday} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

/** The backend's day names, in calendar order starting Monday. */
export const DAY_NAMES: DayName[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const DAY_LABEL: Record<DayName, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export function dayLabel(day: DayName): string {
  return DAY_LABEL[day];
}

// ["tue", "fri"] -> "Tue, Fri", always in week order
export function classDaysLabel(days: DayName[]): string {
  return DAY_NAMES.filter((d) => days.includes(d)).map(dayLabel).join(", ");
}

/** Whole weeks between two YYYY-MM-DD dates, rounded up. */
export function weeksBetween(startIso: string, endIso: string): number {
  const days = (parseISODate(endIso).getTime() - parseISODate(startIso).getTime()) / 86_400_000;
  return Math.max(1, Math.ceil((days + 1) / 7));
}

// "Today", "Tomorrow", "In 3 days", "2 days ago"
export function relativeDayLabel(date: Date, reference: Date = today()): string {
  const start = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const diff = Math.round((date.getTime() - start.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
}
