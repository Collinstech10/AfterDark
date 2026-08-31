# Deploy AFTERDARK

## 1. Put the project in a Git repository

Push this folder to a private GitHub repository. Never commit `.env.local`.

## 2. Create the Supabase schema

In Supabase SQL Editor, run `supabase/migrations/001_afterdark.sql`. In **Authentication → URL Configuration**, add your production URL and `http://localhost:3000` as redirect URLs.

## 3. Create a Vercel project

Import the repository at vercel.com. Vercel discovers Next.js automatically through `vercel.json`.

Add these Production environment variables from `.env.example`:

- `NVIDIA_API_KEY`, `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Firebase `NEXT_PUBLIC_FIREBASE_*` values
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY`, `EMAIL_FROM`

Never put server-only values in any `NEXT_PUBLIC_` variable.

## 4. Configure providers

- **Paystack:** set webhook URL to `https://YOUR_DOMAIN/api/paystack/webhook` and use a test transaction first.
- **Resend:** verify `EMAIL_FROM` domain.
- **Firebase:** create a Web Push VAPID key before turning on notification permission.
- **Supabase:** keep RLS enabled and do not expose the service-role key.

## 5. Deploy and verify

Deploy from Vercel, then verify sign-in, a conversation response, memory persistence, payment webhook delivery, and a notification token registration. Run a daily hosted cron that calls the autonomous-event scheduler from a protected server endpoint; do not expose the scheduler publicly.
