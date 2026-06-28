# FaithNotes — Setup Guide

## Stack
- **Next.js 15** (App Router)
- **Supabase** (auth, database, storage)
- **Claude claude-sonnet-4-6** (sermon analysis, devotions, quiz)
- **Vercel** (deployment)
- **Tailwind CSS + Framer Motion** (UI)

---

## 1. Install dependencies

```bash
cd faithnotes
npm install
```

---

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. In **SQL Editor**, paste and run the full contents of `supabase/schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

---

## 3. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
ANTHROPIC_API_KEY=         # from console.anthropic.com
NEXT_PUBLIC_SUPABASE_URL=  # your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # your Supabase anon key
SUPABASE_SERVICE_ROLE_KEY= # your Supabase service role key (keep secret)
```

---

## 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 5. Audio/Video transcription (optional)

For MP3/WAV/MP4 uploads, you need a speech-to-text provider.
Options:
- **OpenAI Whisper API** — `openai.audio.transcriptions.create()`
- **Deepgram** — great for long-form audio

Update `lib/ai.ts` → `transcribeAudio()` with your chosen provider.

YouTube URLs work out of the box (no extra setup needed).

---

## 6. Deploy to Vercel

```bash
npx vercel
```

Add all `.env.local` values as **Environment Variables** in your Vercel project settings.

---

## Features Checklist

- [x] Landing page
- [x] Sign up / Sign in (Supabase Auth)
- [x] Upload sermon (YouTube URL, MP3, WAV, MP4)
- [x] AI processing: title, 200-word summary, main points, takeaways, action steps
- [x] Bible verse detection
- [x] 6-day devotion plan (reflection, challenge, verse, prayer focus)
- [x] 5-question comprehension quiz with scoring
- [x] Sermon sharing (public/private toggle + shareable link)
- [x] Friends system (add by email, accept/decline requests)
- [x] Friends' public sermon feed
- [x] Dashboard with streak tracking

---

## Folder Structure

```
faithnotes/
├── app/
│   ├── page.tsx              # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx        # Sidebar layout
│   │   ├── dashboard/page.tsx
│   │   ├── upload/page.tsx
│   │   ├── sermon/[id]/      # Summary, devotions, quiz tabs
│   │   └── friends/          # Friends & shared sermons
│   └── api/
│       └── process-sermon/   # AI processing endpoint
├── components/ui/
│   └── Sidebar.tsx
├── lib/
│   ├── ai.ts                 # Claude API + transcript helpers
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── types/index.ts
└── supabase/schema.sql       # Run this in Supabase SQL Editor
```
