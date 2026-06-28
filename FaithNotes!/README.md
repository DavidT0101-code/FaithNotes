# FaithNotes

Turn any sermon into a week of spiritual growth.

## Features

- **Upload Sermons** — YouTube URL, MP3, WAV, MP4, or paste transcript
- **AI Analysis** — 200-word summary, main points, key takeaways, action steps, Bible verse detection
- **6-Day Devotion Plan** — Daily reflection, challenge, verse, and prayer for each day
- **Quiz** — 5 questions to test sermon comprehension
- **Prayer Focus** — Personalized prayer guidance from the sermon
- **Community** — Add friends, share sermons publicly or privately

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Deploying

### Vercel + Supabase (recommended)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` to Vercel environment variables
4. Deploy — it's live!

**Future: Supabase integration**
- Replace `localStorage` in `src/lib/storage.ts` with Supabase client calls
- Add Supabase auth to replace the simple email-based auth
- Store sermons, users, and friendships in Postgres tables

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **Anthropic Claude** (AI analysis)
- **youtube-transcript** (YouTube transcription)
- **LocalStorage** (temporary data layer — replace with Supabase)

## Audio/Video Transcription

For MP3/WAV/MP4 files, production transcription requires:
- [OpenAI Whisper API](https://platform.openai.com/docs/guides/speech-to-text)
- [AssemblyAI](https://www.assemblyai.com/)

Add the API key and wire it into `src/app/api/process-sermon/route.ts`.
