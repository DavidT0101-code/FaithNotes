import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SermonTabs from "./SermonTabs";
import { formatDate } from "@/lib/utils";
import { BookOpen, Calendar, Globe, Lock } from "lucide-react";
import type { Sermon, DailyDevotion, QuizQuestion } from "@/types";
import ShareButton from "./ShareButton";

export default async function SermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: sermon } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .single();

  if (!sermon || (sermon.user_id !== user!.id && !sermon.is_public)) notFound();

  const { data: devotions } = await supabase
    .from("devotions")
    .select("*")
    .eq("sermon_id", id)
    .order("day");

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("sermon_id", id);

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-3">
          <Calendar className="w-3 h-3" />
          {formatDate(sermon.created_at)}
          <span className="mx-1 opacity-50">·</span>
          <span className="capitalize">{sermon.source_type}</span>
          <span className="mx-1 opacity-50">·</span>
          {sermon.is_public ? (
            <span className="flex items-center gap-1 text-emerald-400/80">
              <Globe className="w-3 h-3" /> Public
            </span>
          ) : (
            <span className="flex items-center gap-1 text-white/30">
              <Lock className="w-3 h-3" /> Private
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">{sermon.title}</h1>
          </div>
          <ShareButton sermonId={id} isPublic={sermon.is_public} isOwner={sermon.user_id === user!.id} />
        </div>
      </div>

      <SermonTabs
        sermon={sermon as Sermon}
        devotions={(devotions ?? []) as DailyDevotion[]}
        questions={(questions ?? []) as QuizQuestion[]}
      />
    </div>
  );
}
