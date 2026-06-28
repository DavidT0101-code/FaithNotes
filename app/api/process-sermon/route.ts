import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processSermonTranscript, generateYouTubeTranscript } from "@/lib/ai";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const sourceType = formData.get("source_type") as string;
    const youtubeUrl = formData.get("youtube_url") as string | null;
    const file = formData.get("file") as File | null;

    let transcript = "";
    let thumbnailUrl: string | undefined;
    let filePath: string | undefined;

    if (sourceType === "youtube" && youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (!videoId) return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
      transcript = await generateYouTubeTranscript(videoId);
      thumbnailUrl = getYouTubeThumbnail(videoId);
    } else if (file) {
      // Upload file to Supabase Storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("sermons")
        .upload(fileName, buffer, { contentType: file.type });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      filePath = uploadData.path;

      // For audio/video, you'd call a transcription service here
      // For now we require YouTube or pre-transcribed text
      return NextResponse.json(
        {
          error:
            "Audio/video transcription requires a speech-to-text service (Whisper/Deepgram). Please use a YouTube URL for now, or add your STT provider in lib/ai.ts",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    if (!transcript || transcript.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract a transcript from this content. The video may not have captions enabled." },
        { status: 400 }
      );
    }

    // Process with Claude
    const result = await processSermonTranscript(transcript);

    // Save to database
    const { data: sermon, error: sermonError } = await supabase
      .from("sermons")
      .insert({
        user_id: user.id,
        title: result.title,
        source_type: sourceType,
        source_url: youtubeUrl,
        file_path: filePath,
        transcript,
        summary: result.summary,
        main_points: result.main_points,
        key_takeaways: result.key_takeaways,
        action_steps: result.action_steps,
        bible_verses: result.bible_verses,
        thumbnail_url: thumbnailUrl,
        is_public: false,
      })
      .select()
      .single();

    if (sermonError) throw new Error(`DB save failed: ${sermonError.message}`);

    // Save devotions
    const devotions = result.devotions.map((d) => ({
      sermon_id: sermon.id,
      day: d.day,
      theme: d.theme,
      reflection: d.reflection,
      challenge: d.challenge,
      verse: d.verse,
      prayer_focus: d.prayer_focus,
    }));

    await supabase.from("devotions").insert(devotions);

    // Save quiz
    const questions = result.quiz.map((q) => ({
      sermon_id: sermon.id,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
    }));

    await supabase.from("quiz_questions").insert(questions);

    return NextResponse.json({ sermon_id: sermon.id });
  } catch (err) {
    console.error("Process sermon error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Processing failed" },
      { status: 500 }
    );
  }
}
