/**
 * Turn a finished report into a PDF and hand it to the share sheet.
 *
 * The backend assembles every number, row, summary line and note
 * (GET /courses/:id/reports/:type). Its own .pdf renderer is not built yet, so
 * the app draws the PDF — and, like the backend's rule for its renderer, this
 * file only lays out what it is given. It calculates nothing.
 */

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import type { ReportDocument } from "@/api/types";
import { formatFullDate } from "@/utils/date";

function escape(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function reportToHtml(doc: ReportDocument): string {
  const { header } = doc;
  const course = [header.course_name, header.course_code].filter(Boolean).join(" · ");
  const meta = [header.semester, header.teacher_name, header.department].filter(Boolean).map(escape).join(" · ");

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #111; margin: 32px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .course { font-size: 14px; font-weight: 600; }
  .meta { font-size: 12px; color: #555; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
  th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
  th { background: #f3f4f6; }
  .summary { margin-top: 18px; font-size: 12px; }
  .summary td { border: none; padding: 2px 12px 2px 0; }
  .notes { margin-top: 14px; font-size: 11px; color: #555; }
  .footer { margin-top: 48px; display: flex; justify-content: space-between; font-size: 12px; }
  .sign { border-top: 1px solid #111; width: 200px; padding-top: 4px; text-align: center; }
</style></head>
<body>
  <h1>${escape(doc.title)}</h1>
  <div class="course">${escape(course)}</div>
  <div class="meta">${meta}</div>

  <table>
    <thead><tr>${doc.columns.map((c) => `<th>${escape(c)}</th>`).join("")}</tr></thead>
    <tbody>${doc.rows.map((row) => `<tr>${row.map((cell) => `<td>${escape(cell ?? "—")}</td>`).join("")}</tr>`).join("")}</tbody>
  </table>

  <table class="summary">${doc.summary.map((s) => `<tr><td><b>${escape(s.label)}</b></td><td>${escape(s.value)}</td></tr>`).join("")}</table>

  ${doc.notes.length ? `<div class="notes">${doc.notes.map((n) => `<p>${escape(n)}</p>`).join("")}</div>` : ""}

  <div class="footer">
    <div>Generated on ${escape(formatFullDate(header.generated_on))}</div>
    <div class="sign">${escape(header.signature_label)}</div>
  </div>
</body></html>`;
}

export async function shareReportPdf(doc: ReportDocument): Promise<void> {
  const { uri } = await Print.printToFileAsync({ html: reportToHtml(doc) });

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device.");
  }
  await Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: ".pdf", dialogTitle: doc.title });
}
