import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Upload, BookOpen, ArrowRight, Flame, Sparkles, Calendar, Brain } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Sermon } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const displayName = (user?.user_metadata?.display_name as string) || "Friend";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const latestSermon = sermons?.[0] as Sermon | undefined;
  const dayOfWeek = new Date().getDay();
  const devotionDay = dayOfWeek === 0 ? 6 : dayOfWeek;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-white/30 mb-1">{today}</p>
        <h1 className="text-3xl font-bold text-white">Good {getGreeting()}, {displayName} 👋</h1>
        <p className="text-white/40 mt-1">Your spiritual growth dashboard</p>
      </div>

      {/* Today's devotion */}
      {latestSermon && (
        <div className="relative rounded-2xl overflow-hidden p-6 mb-6 border border-violet-500/25">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-700/40 via-purple-700/25 to-violet-900/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent animate-shimmer opacity-50" />
          <div className="relative flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-300" />
                <span className="text-sm text-white/70 font-medium">Day {devotionDay} Devotion</span>
              </div>
              <h2 className="text-xl font-bold text-white">{latestSermon.title}</h2>
            </div>
            <Calendar className="w-5 h-5 text-white/40" />
          </div>
          <Link
            href={`/sermon/${latestSermon.id}?tab=devotions&day=${devotionDay}`}
            className="relative inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all hover:-translate-y-0.5"
          >
            Open today&apos;s devotion <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Sermons uploaded", value: sermons?.length ?? 0, icon: Upload, color: "text-violet-400", bg: "bg-violet-500/15" },
          { label: "Devotion streak", value: "–", icon: Flame, color: "text-amber-400", bg: "bg-amber-500/15" },
          { label: "Quizzes taken", value: "–", icon: Brain, color: "text-emerald-400", bg: "bg-emerald-500/15" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/35 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent sermons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Sermons</h2>
        <Link href="/upload" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
          <Upload className="w-3.5 h-3.5" /> Upload new
        </Link>
      </div>

      {!sermons?.length ? (
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-14 text-center hover:border-violet-500/30 transition-colors">
          <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-violet-400/50" />
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">Upload your first sermon</h3>
          <p className="text-white/35 mb-7 text-sm max-w-xs mx-auto">
            Add a sermon to get your personalized 6-day devotion plan, quiz, and prayer guide.
          </p>
          <Link href="/upload" className="btn-primary inline-flex text-sm py-2.5 px-6">
            <Upload className="w-4 h-4" /> Upload sermon
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {(sermons as Sermon[]).map((sermon) => (
            <Link
              key={sermon.id}
              href={`/sermon/${sermon.id}`}
              className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 p-4 hover:bg-white/7 hover:border-violet-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{sermon.title}</p>
                <p className="text-sm text-white/35">
                  {formatDate(sermon.created_at)} · {sermon.source_type}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
