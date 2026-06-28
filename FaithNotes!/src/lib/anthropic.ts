import Anthropic from "@anthropic-ai/sdk";
import { SermonAnalysis } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeSermon(transcript: string): Promise<SermonAnalysis> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `You are a Christian sermon analyst. Analyze the following sermon transcript and return a comprehensive JSON analysis.

SERMON TRANSCRIPT:
${transcript}

Return ONLY valid JSON in this exact structure (no markdown, no code blocks):
{
  "title": "Sermon title (infer from content if not stated)",
  "summary": "Exactly 200 words summarizing the sermon's core message",
  "mainPoints": [
    {"title": "Point title", "description": "2-3 sentence explanation"}
  ],
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4", "takeaway 5"],
  "actionSteps": ["specific action 1", "specific action 2", "specific action 3"],
  "bibleVerses": [
    {"reference": "John 3:16", "text": "For God so loved...", "context": "Why the pastor used this verse"}
  ],
  "prayerFocus": ["specific prayer point 1", "specific prayer point 2", "specific prayer point 3"],
  "quizQuestions": [
    {
      "question": "Question about the sermon?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct"
    }
  ],
  "dailyDevotions": [
    {
      "day": 1,
      "title": "Day title",
      "reflection": "2-3 sentences for morning reflection",
      "challenge": "One specific challenge for the day",
      "verse": {"reference": "Bible ref", "text": "Verse text", "context": "How it applies"},
      "prayer": "A 2-3 sentence prayer for the day"
    }
  ],
  "tags": ["tag1", "tag2", "tag3"]
}

Requirements:
- mainPoints: 3-5 points
- keyTakeaways: exactly 5
- actionSteps: 3-5 steps
- bibleVerses: all verses mentioned plus relevant ones (minimum 3)
- prayerFocus: 3-5 specific prayer points
- quizQuestions: exactly 5 questions
- dailyDevotions: exactly 6 days (day 1-6, Sunday sermon → weekday devotions)
- tags: 3-5 relevant tags`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  try {
    return JSON.parse(content.text) as SermonAnalysis;
  } catch {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as SermonAnalysis;
    throw new Error("Failed to parse AI response as JSON");
  }
}

export async function getYouTubeTranscript(videoId: string): Promise<string> {
  const { YoutubeTranscript } = await import("youtube-transcript");
  const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
  return transcriptItems.map((item) => item.text).join(" ");
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
