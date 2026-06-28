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
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  };

  // Fetch the YouTube page to extract caption track URL
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, { headers });
  if (!pageRes.ok) throw new Error("Could not fetch YouTube page");
  const html = await pageRes.text();

  // Extract ytInitialPlayerResponse
  const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;/s);
  if (!match) throw new Error("Could not parse YouTube page data");

  const playerResponse = JSON.parse(match[1]);
  const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!captions || captions.length === 0) {
    throw new Error("Transcript is disabled on this video. Please try a video with closed captions (CC) enabled.");
  }

  // Prefer English captions
  const track = captions.find((c: any) => c.languageCode === "en") || captions[0];
  const captionUrl = track.baseUrl + "&fmt=json3";

  const captionRes = await fetch(captionUrl, { headers });
  if (!captionRes.ok) throw new Error("Could not fetch captions");

  const captionData = await captionRes.json();
  const text = captionData.events
    ?.filter((e: any) => e.segs)
    .map((e: any) => e.segs.map((s: any) => s.utf8).join(""))
    .join(" ")
    .replace(/\n/g, " ")
    .trim();

  if (!text || text.length < 100) throw new Error("Transcript too short or empty.");
  return text;
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  throw new Error(
    "Audio transcription requires a speech-to-text service. Please use a YouTube URL for now."
  );
}
