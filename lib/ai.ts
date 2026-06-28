import Groq from "groq-sdk";
import type { SermonProcessingResult, DailyDevotion, QuizQuestion } from "@/types";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROCESS_SERMON_PROMPT = `You are a pastoral AI assistant helping Christians grow spiritually from sermons.

Analyze the following sermon transcript and return a JSON object with this exact structure:
{
  "title": "Concise sermon title (if not obvious, create one based on content)",
  "summary": "Engaging 200-word summary capturing the heart of the sermon",
  "main_points": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "key_takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "action_steps": ["Practical step 1", "Practical step 2", "Practical step 3"],
  "bible_verses": [
    {
      "reference": "John 3:16",
      "text": "For God so loved the world...",
      "context": "How this verse was used in the sermon"
    }
  ],
  "devotions": [
    {
      "day": 1,
      "theme": "Theme for this day",
      "reflection": "2-3 sentence reflection connecting to the sermon",
      "challenge": "One practical challenge for the day",
      "verse": { "reference": "...", "text": "...", "context": "..." },
      "prayer_focus": "What to pray about today related to this sermon"
    }
  ],
  "quiz": [
    {
      "question": "Question about the sermon content?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Why this answer is correct based on the sermon"
    }
  ]
}

Rules:
- devotions array must have exactly 6 items (Day 1-6)
- quiz array must have exactly 5 questions of varying difficulty
- bible_verses must include ALL verses mentioned in the sermon (minimum 3)
- Keep language warm, encouraging, and spiritually grounding
- Return ONLY valid JSON, no markdown, no code fences, no extra text

SERMON TRANSCRIPT:
`;

export async function processSermonTranscript(
  transcript: string
): Promise<SermonProcessingResult> {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 8000,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: PROCESS_SERMON_PROMPT + transcript,
      },
    ],
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No response from AI");

  // Strip any accidental markdown fences
  const clean = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  const parsed = JSON.parse(clean) as SermonProcessingResult;

  const devotions: DailyDevotion[] = parsed.devotions.map((d, i) => ({
    ...d,
    id: crypto.randomUUID(),
    sermon_id: "",
    day: i + 1,
  }));

  const quiz: QuizQuestion[] = parsed.quiz.map((q) => ({
    ...q,
    id: crypto.randomUUID(),
    sermon_id: "",
  }));

  return { ...parsed, devotions, quiz };
}

export async function generateYouTubeTranscript(videoId: string): Promise<string> {
  // Try direct timedtext API (works for many videos with captions)
  const attempts = [
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&kind=asr&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en-US&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en-US&kind=asr&fmt=json3`,
  ];

  for (const url of attempts) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      });
      if (!res.ok) continue;
      const raw = await res.text();
      if (!raw || raw.length < 20) continue;
      const data = JSON.parse(raw);
      const events = data?.events;
      if (!events?.length) continue;
      const text = events
        .filter((e: any) => e.segs)
        .map((e: any) => e.segs.map((s: any) => s.utf8 ?? "").join(""))
        .join(" ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (text.length > 100) return text;
    } catch {}
  }

  // Fallback: youtubei.js
  try {
    const { Innertube } = await import("youtubei.js");
    const yt = await Innertube.create();
    const info = await yt.getInfo(videoId);
    const transcriptData = await info.getTranscript();
    const segments = transcriptData?.transcript?.content?.body?.initial_segments ?? [];
    const text = segments
      .map((s: any) => s.snippet?.text ?? "")
      .join(" ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 100) return text;
  } catch {}

  throw new Error("No captions found for this video. Please use a video with the CC (closed captions) button visible in YouTube — try Elevation Church, TD Jakes, or Steven Furtick.");
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  throw new Error(
    "Audio transcription requires a speech-to-text service. Please use a YouTube URL for now."
  );
}
