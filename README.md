# UstaadAssist — mobile app

The React Native (Expo SDK 57) app for UstaadAssist. It talks to the Express
backend for everything, and to Supabase for sign-in and file storage only.

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Create `.env.local` from the template and fill it in

   ```bash
   cp .env.example .env.local
   ```

   | Variable | What it is |
   |---|---|
   | `EXPO_PUBLIC_API_URL` | The backend, e.g. `https://<app>.vercel.app`. On a physical phone use your computer's LAN IP, not `localhost`. |
   | `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** key (never the service role key) |
   | `EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET` | Storage bucket for uploads (default `materials`) |
   | `EXPO_PUBLIC_DEMO_TODAY` | Optional. Pretend today is this date, to demo the seeded semester (`2026-11-18`) |

3. In Supabase
   - **Storage:** create a **private** bucket named as above, then run the backend's
     `migrations/003_security.sql` (Supabase → SQL Editor → paste → Run). It adds the storage policies —
     each teacher may only upload, read and delete inside a folder named after their own user id, which is
     how the app builds every path (`<user id>/<course id>/…`) — and turns on row level security for
     every table so the public anon key cannot reach the database directly.
   - **Google sign-in (optional):** enable the Google provider, add `ustaadassist://auth/callback` to the
     allowed redirect URLs, and set `EXPO_PUBLIC_GOOGLE_SIGNIN=true`.

4. Start the app

   ```bash
   npx expo start
   ```

## How the code is organised

```
src/
  app/                  Routes only (Expo Router). Thin: load data, call the API, pick a screen.
    (auth)/             signin, register, forgot-password — shown only while signed out
    (app)/              everything else — shown only while signed in
      (tabs)/           home, plan, students, assessment, material — inside one selected course
      course/           new (setup wizard), clone
      report/           the reports list and a report preview
      attendance, settings, profile, dashboard (the course list)

  api/                  The backend, one module per group of routes. types.ts mirrors the API exactly.
    client.ts           Adds the Supabase token, unwraps { success, data, message }, throws ApiError.

  providers/            AuthProvider (Supabase session + GET /auth/me), CourseProvider (selected course)
  hooks/                useApi (load + reload + refetch on focus), useAction (buttons that call the API)
  lib/                  config (env), supabase client, storage uploads, file pickers, report PDF
  components/<feature>/ Presentational screens and pieces, grouped by feature
  utils/                Small pure helpers: dates, formatting, plan, roster review, assessment status
  types/                UI-only types and theme tokens (API types live in api/types.ts)
```

A request flows one way: **route → `api/*` → backend**. Components receive data
as props and never call the API themselves.

## Rules the app follows from the backend

- Ids are strings, dates are `YYYY-MM-DD`, field names are `snake_case` — exactly as the API sends them.
- Files go to Supabase Storage first; only the storage path is sent to the API.
- Extracted class lists are a draft: the review screen is mandatory before `POST /students/import`.
- A mark that was never entered is `null`, not zero. "Absent" is a real zero.
- Server sentences (`schedule.warning`, `move_reason`, assessment move reasons) are shown as-is.
- Reports are rendered to PDF from the backend's report JSON — nothing is calculated in the app.

## Scanning class lists and outlines

The teacher photographs the printed sheet or uploads the department's PDF; the backend reads it
(free: PDF text, or Tesseract OCR for photos) and the app shows the rows on the review screen.

- **The department's PDF is exact** and takes about a second.
- **A photo takes up to ~30 seconds.** Straight, flat and well-lit photos read fully; rows the OCR is
  unsure about come back with low confidence and are highlighted on the review screen.
- Outline lengths ("Week 3-4: Normalization") are applied to the topics automatically when saved.

## Not available on the backend

- `GET /courses/:id/reports/:type.pdf` returns 503, so the app draws the PDF itself from the JSON report.

The teacher's name comes from the sign-up form: the backend reads it from the Supabase token on
`GET /auth/me`, and it appears on every report.
