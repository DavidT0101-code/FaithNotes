"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getDayLabel } from "@/lib/utils";
import { BookOpen, Calendar, Brain, Target, CheckCircle2, X, Star } from "lucide-react";
import type { Sermon, DailyDevotion, QuizQuestion } from "@/types";

const tabs = [
  { id: "summary", label: "Summary", icon: BookOpen },
  { id: "devotions", label: "Devotions", icon: Calendar },
  { id: "quiz", label: "Quiz", icon: Brain },
];

const dayColors = [
  { bg: "from-violet-600/50 to-purple-700/40", border: "border-violet-500/20", accent: "text-violet-300", tag: "bg-violet-500/15" },
  { bg: "from-blue-600/50 to-indigo-700/40", border: "border-blue-500/20", accent: "text-blue-300", tag: "bg-blue-500/15" },
  { bg: "from-emerald-600/50 to-teal-700/40", border: "border-emerald-500/20", accent: "text-emerald-300", tag: "bg-emerald-500/15" },
  { bg: "from-amber-600/50 to-orange-700/40", border: "border-amber-500/20", accent: "text-amber-300", tag: "bg-amber-500/15" },
  { bg: "from-rose-600/50 to-pink-700/40", border: "border-rose-500/20", accent: "text-rose-300", tag: "bg-rose-500/15" },
  { bg: "from-cyan-600/50 to-sky-700/40", border: "border-cyan-500/20", accent: "text-cyan-300", tag: "bg-cyan-500/15" },
];

export default function SermonTabs({
  sermon,
  devotions,
  questions,
}: {
  sermon: Sermon;
  devotions: DailyDevotion[];
  questions: QuizQuestion[];
}) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-white/5 border border-white/8 p-1 rounded-xl w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id ? "text-white" : "text-white/35 hover:text-white/60"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-active"
                className="absolute inset-0 rounded-lg bg-violet-500/20 border border-violet-500/25"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <tab.icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "summary" && <SummaryTab sermon={sermon} />}
          {activeTab === "devotions" && <DevotionsTab devotions={devotions} />}
          {activeTab === "quiz" && <QuizTab questions={questions} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SummaryTab({ sermon }: { sermon: Sermon }) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-400" /> Sermon Summary
        </h2>
        <p className="text-white/55 leading-relaxed">{sermon.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Main Points */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
          <h2 className="font-semibold text-white mb-3">Main Points</h2>
          <ol className="space-y-2.5">
            {sermon.main_points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-white/50">{point}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Key Takeaways */}
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
          <h2 className="font-semibold text-white mb-3">Key Takeaways</h2>
          <ul className="space-y-2.5">
            {sermon.key_takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-white/50">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Steps */}
      <div className="relative rounded-2xl border border-violet-500/20 overflow-hidden p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/20 via-purple-700/10 to-transparent" />
        <div className="relative flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-white">Action Steps This Week</h2>
        </div>
        <ul className="relative space-y-2.5">
          {sermon.action_steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded bg-violet-500/25 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-white/65">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bible Verses */}
      {sermon.bible_verses?.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-violet-400" />
            <h2 className="font-semibold text-white">Bible Verses Detected ({sermon.bible_verses.length})</h2>
          </div>
          <div className="space-y-4">
            {sermon.bible_verses.map((verse, i) => (
              <div key={i} className="border-l-2 border-violet-500/30 pl-4">
                <p className="text-xs font-semibold text-violet-400 mb-0.5">{verse.reference}</p>
                <p className="text-sm italic text-white/50 mb-1">&ldquo;{verse.text}&rdquo;</p>
                <p className="text-xs text-white/30">{verse.context}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DevotionsTab({ devotions }: { devotions: DailyDevotion[] }) {
  const [activeDay, setActiveDay] = useState(1);
  const devotion = devotions.find((d) => d.day === activeDay);
  const color = dayColors[(activeDay - 1) % dayColors.length];

  return (
    <div>
      {/* Day selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {devotions.map((d) => {
          const c = dayColors[(d.day - 1) % dayColors.length];
          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={cn(
                "relative px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all",
                activeDay === d.day ? `${c.accent} border ${c.border} bg-white/8` : "text-white/35 hover:text-white/60 border border-transparent"
              )}
            >
              {activeDay === d.day && (
                <motion.div layoutId="day-active" className="absolute inset-0 rounded-xl bg-white/5" transition={{ type: "spring", bounce: 0.2 }} />
              )}
              <span className="relative z-10">{getDayLabel(d.day)}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {devotion ? (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Header card */}
            <div className={`relative rounded-2xl overflow-hidden p-6 border ${color.border}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${color.bg}`} />
              <div className="relative">
                <div className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-lg ${color.tag} ${color.accent} mb-2`}>
                  Day {devotion.day} · {getDayLabel(devotion.day)}
                </div>
                <h2 className="text-2xl font-bold text-white">{devotion.theme}</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
              <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${color.accent}`}>Reflection</h3>
              <p className="text-white/60 leading-relaxed">{devotion.reflection}</p>
            </div>

            <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Today&apos;s Challenge</h3>
              <p className="text-white/65">{devotion.challenge}</p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
              <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${color.accent}`}>Today&apos;s Verse</h3>
              <div className={`border-l-2 ${color.border} pl-4`}>
                <p className={`text-xs font-bold mb-1 ${color.accent}`}>{devotion.verse?.reference}</p>
                <p className="italic text-white/50">&ldquo;{devotion.verse?.text}&rdquo;</p>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Prayer Focus</h3>
              <p className="text-white/65">{devotion.prayer_focus}</p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12 text-white/30">No devotion found for this day.</div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface QuizState {
  answers: Record<number, number>;
  submitted: boolean;
}

function QuizTab({ questions }: { questions: QuizQuestion[] }) {
  const [state, setState] = useState<QuizState>({ answers: {}, submitted: false });

  const score = state.submitted
    ? questions.filter((q, i) => state.answers[i] === q.correct_index).length
    : 0;

  function handleAnswer(qIndex: number, optIndex: number) {
    if (state.submitted) return;
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [qIndex]: optIndex } }));
  }

  function handleReset() {
    setState({ answers: {}, submitted: false });
  }

  if (!questions.length) {
    return <div className="text-center py-12 text-white/30">No quiz questions yet.</div>;
  }

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {state.submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "relative rounded-2xl overflow-hidden p-6 border",
              score >= 4 ? "border-emerald-500/20" : "border-amber-500/20"
            )}
          >
            <div className={cn(
              "absolute inset-0",
              score >= 4 ? "bg-gradient-to-br from-emerald-700/25 to-teal-700/15" : "bg-gradient-to-br from-amber-700/25 to-orange-700/15"
            )} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < Math.round(score / questions.length * 5) ? "text-amber-400 fill-amber-400" : "text-white/15")} />
                  ))}
                </div>
                <p className="font-bold text-xl text-white">{score}/{questions.length} correct — {pct}%</p>
                <p className="text-sm text-white/50 mt-0.5">
                  {score === questions.length ? "Perfect score! You really paid attention." : score >= 3 ? "Great job! Review the ones you missed." : "Keep studying — the sermon has a lot to offer."}
                </p>
              </div>
              <button onClick={handleReset} className="text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
                Retake
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {questions.map((q, qi) => {
        const answered = state.answers[qi] !== undefined;

        return (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.04 }}
            className="rounded-2xl border border-white/8 bg-white/4 p-5"
          >
            <p className="font-medium text-white mb-3">
              <span className="text-white/25 text-sm mr-2">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = state.answers[qi] === oi;
                const isCorrectOption = state.submitted && oi === q.correct_index;
                const isWrongOption = state.submitted && isSelected && oi !== q.correct_index;

                return (
                  <button
                    key={oi}
                    onClick={() => handleAnswer(qi, oi)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all duration-200",
                      !state.submitted && isSelected
                        ? "border-violet-500/50 bg-violet-500/15 text-violet-200"
                        : isCorrectOption
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                        : isWrongOption
                        ? "border-red-500/40 bg-red-500/10 text-red-300"
                        : "border-white/8 text-white/50 hover:border-white/20 hover:bg-white/5 hover:text-white/70"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {isCorrectOption && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                      {isWrongOption && <X className="w-3.5 h-3.5 shrink-0 text-red-400" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
            {state.submitted && (
              <p className="text-xs text-white/30 mt-3 border-t border-white/6 pt-3">{q.explanation}</p>
            )}
          </motion.div>
        );
      })}

      {!state.submitted && (
        <motion.button
          onClick={() => setState((prev) => ({ ...prev, submitted: true }))}
          disabled={Object.keys(state.answers).length < questions.length}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-primary w-full py-3 disabled:opacity-40"
        >
          Submit answers ({Object.keys(state.answers).length}/{questions.length} answered)
        </motion.button>
      )}
    </div>
  );
}
