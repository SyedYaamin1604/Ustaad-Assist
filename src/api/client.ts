/**
 * The one place the app talks HTTP to the backend.
 *
 * Every response from the backend has the same envelope:
 *   { success: true,  data: {...}, message: null }
 *   { success: false, data: null,  message: "Course not found" }
 *
 * This file attaches the Supabase token, unwraps `data` on success and turns
 * everything else into an ApiError carrying the server's message, so screens
 * can show that message as-is.
 */

import { config } from "@/lib/config";
import { supabase } from "@/lib/supabase";

export class ApiError extends Error {
  /** HTTP status, or 0 when the server could not be reached at all. */
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Envelope<T> = { success: boolean; data: T; message: string | null };

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type Query = Record<string, string | null | undefined>;

function withQuery(path: string, query?: Query): string {
  if (!query) return path;
  const pairs = Object.entries(query).filter((pair): pair is [string, string] => !!pair[1]);
  if (pairs.length === 0) return path;
  const search = pairs.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  return `${path}?${search.join("&")}`;
}

async function request<T>(method: Method, path: string, body?: unknown, query?: Query): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${config.apiUrl}${withQuery(path, query)}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your internet connection and try again.");
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await response.json()) as Envelope<T>;
  } catch {
    // Not JSON — e.g. a proxy error page. Fall through to the generic message.
  }

  if (!response.ok || !envelope?.success) {
    // The token was rejected (expired and could not refresh, or revoked).
    // Signing out sends the teacher back to the sign-in screen.
    if (response.status === 401 && token) await supabase.auth.signOut();

    throw new ApiError(response.status, envelope?.message ?? `The server answered ${response.status}.`);
  }

  return envelope.data;
}

export const http = {
  get: <T>(path: string, query?: Query) => request<T>("GET", path, undefined, query),
  post: <T>(path: string, body: unknown = {}) => request<T>("POST", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
