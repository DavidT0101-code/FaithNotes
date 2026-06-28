import { NextRequest, NextResponse } from "next/server";
import { analyzeSermon, getYouTubeTranscript, extractYouTubeId } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;
    let transcript = "";

    if (type === "youtube") {
      const url = formData.get("url") as string;
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
      }
      transcript = await getYouTubeTranscript(videoId);
    } else if (type === "audio" || type === "video") {
      // For audio/video files, we use a placeholder transcript for now.
      // In production, integrate OpenAI Whisper or AssemblyAI for transcription.
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Check if a manual transcript was provided (user paste)
      const manualTranscript = formData.get("transcript") as string;
      if (manualTranscript && manualTranscript.trim().length > 100) {
        transcript = manualTranscript;
      } else {
        // Placeholder: tell the user we need a transcription service
        return NextResponse.json(
          {
            error:
              "Audio/video transcription requires a Whisper API key. Please paste the sermon transcript manually, or use a YouTube link.",
            needsTranscript: true,
          },
          { status: 422 }
        );
      }
    } else if (type === "text") {
      transcript = formData.get("transcript") as string;
      if (!transcript || transcript.trim().length < 100) {
        return NextResponse.json({ error: "Transcript is too short" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Unknown source type" }, { status: 400 });
    }

    if (transcript.trim().length < 50) {
      return NextResponse.json({ error: "Could not extract transcript from source" }, { status: 422 });
    }

    const analysis = await analyzeSermon(transcript);
    return NextResponse.json({ analysis, transcript });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
