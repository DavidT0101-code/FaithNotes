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
  const { YoutubeTranscript } = await import("youtube-transcript");
  const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  return transcriptItems.map((item) => item.text).join(" ");
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  throw new Error(
    "Audio transcription requires a speech-to-text service. Please use a YouTube URL for now."
  );
}
