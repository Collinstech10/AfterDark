# AFTERDARK

An intimate companion mystery built on Next.js. Luma's AI calls go through a server-only NVIDIA NIM provider with Gemini fallback; neither provider key is sent to the browser.

## Run

1. Copy `.env.example` to `.env.local` and fill credentials locally.
2. Run `npm install`, then apply `supabase/migrations/001_afterdark.sql` in the Supabase SQL editor.
3. Run `npm run dev`.

The migration enables RLS for all player-owned data. Authentication uses Supabase magic links; add your production redirect URL in Supabase Auth settings. Configure a Firebase Web Push certificate (VAPID key) before enabling push permission, and create a scheduled invocation for `scheduleReturnEvents` in your host's cron facility.
"# AfterDark" 
