"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sun, Zap, Heart, ArrowLeft, ChevronRight } from "lucide-react";
import { getSermonById } from "@/lib/storage";
import { DailyDevotion } from "@/lib/types";

const DAY_COLORS = [
  "from-violet-50 to-purple-50 border-violet-100",
  "from-blue-50 to-indigo-50 border-blue-100",
  "from-emerald-50 to-teal-50 border-emerald-100",
  "from-amber-50 to-yellow-50 border-amber-100",
  "from-rose-50 to-pink-50 border-rose-100",
  "from-sky-50 to-cyan-50 border-sky-100",
];

const DAY_ACCENT = [
  "text-violet-600",
  "text-blue-600",
  "text-emerald-600",
  "text-amber-600",
  "text-rose-600",
  "text-sky-600",
];

function DevotionCard({ devotion, isActive, onClick }: { devotion: DailyDevotion; isActive: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border p-5 transition-all bg-gradient-to-br ${DAY_COLORS[(devotion.day - 1) % DAY_COLORS.length]} ${
        isActive ? "shadow-md scale-[1.01]" : "hover:shadow-sm hover:scale-[1.005]"
      }`}
    >
      <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${DAY_ACCENT[(devotion.day - 1) % DAY_ACCENT.length]}`}>
        Day {devotion.day}
      </div>
      <div className="font-semibold text-gray-900">{devotion.title}</div>
      {isActive && (
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
              <Sun size={14} /> Morning Reflection
            </div>
            <p className="text-gray-600 leading-relaxed">{devotion.reflection}</p>
          </div>

          <div className="bg-white/60 rounded-xl p-3 border border-white/80">
            <div className={`text-xs font-bold uppercase tracking-widest ${DAY_ACCENT[(devotion.day - 1) % DAY_ACCENT.length]} mb-1`}>
              {devotion.verse.reference}
            </div>
            <p className="text-gray-700 italic">"{devotion.verse.text}"</p>
            <p className="text-xs text-gray-400 mt-1">{devotion.verse.context}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
              <Zap size={14} /> Today's Challenge
            </div>
            <p className="text-gray-600">{devotion.challenge}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
              <Heart size={14} /> Prayer
            </div>
            <p className="text-gray-600 italic leading-relaxed">{devotion.prayer}</p>
          </div>
        </div>
      )}
      {!isActive && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <span>Tap to open</span> <ChevronRight size={12} />
        </div>
      )}
    </div>
  );
}

export default function DevotionsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sermon, setSermon] = useState<ReturnType<typeof getSermonById>>(null);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const s = getSermonById(id);
    if (!s) { router.push("/dashboard"); return; }
    setSermon(s);
  }, [id, router]);

  if (!sermon) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-faith-600" /></div>;

  const { dailyDevotions, title } = sermon.analysis;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/sermon/${sermon.id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Sermon
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-faith-100 text-faith-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <BookOpen size={14} /> 6-Day Devotion Plan
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">{title}</h1>
          <p className="text-gray-500">One week of daily spiritual growth from this sermon</p>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dailyDevotions.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`flex-shrink-0 w-12 h-12 rounded-xl font-semibold text-sm transition-all ${
                activeDay === d.day
                  ? "bg-faith-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-faith-50 hover:text-faith-600"
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {dailyDevotions.map((devotion) => (
            <DevotionCard
              key={devotion.day}
              devotion={devotion}
              isActive={activeDay === devotion.day}
              onClick={() => setActiveDay(activeDay === devotion.day ? 0 : devotion.day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
