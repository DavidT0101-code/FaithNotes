import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processSermonTranscript, transcribeAudio } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sourceType = (formData.get("source_type") as string) || "audio";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Transcribe with Groq Whisper
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const transcript = await transcribeAudio(buffer, file.name);

    if (!transcript || transcript.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not transcribe the audio. Make sure the file has clear speech." },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;
    const { data: uploadData } = await supabase.storage
      .from("sermons")
      .upload(fileName, buffer, { contentType: file.type });

    // Process with AI
    const result = await processSermonTranscript(transcript);

    // Save sermon
    const { data: sermon, error: sermonError } = await supabase
      .from("sermons")
      .insert({
        user_id: user.id,
        title: result.title,
        source_type: sourceType,
        file_path: uploadData?.path,
        transcript,
        summary: result.summary,
        main_points: result.main_points,
        key_takeaways: result.key_takeaways,
        action_steps: result.action_steps,
        bible_verses: result.bible_verses,
        is_public: false,
      })
      .select()
      .single();

    if (sermonError) throw new Error(`DB save failed: ${sermonError.message}`);

    // Save devotions
    await supabase.from("devotions").insert(
      result.devotions.map((d) => ({
        sermon_id: sermon.id,
        day: d.day,
        theme: d.theme,
        reflection: d.reflection,
        challenge: d.challenge,
        verse: d.verse,
        prayer_focus: d.prayer_focus,
      }))
    );

    // Save quiz
    await supabase.from("quiz_questions").insert(
      result.quiz.map((q) => ({
        sermon_id: sermon.id,
        question: q.question,
        options: q.options,
        correct_index: q.correct_index,
        explanation: q.explanation,
      }))
    );

    return NextResponse.json({ sermon_id: sermon.id });
  } catch (err) {
    console.error("Process sermon error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Processing failed" },
      { status: 500 }
    );
  }
}
