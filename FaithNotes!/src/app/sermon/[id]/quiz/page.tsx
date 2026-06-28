"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, CheckCircle, XCircle, ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { getSermonById } from "@/lib/storage";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sermon, setSermon] = useState<ReturnType<typeof getSermonById>>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const s = getSermonById(id);
    if (!s) { router.push("/dashboard"); return; }
    setSermon(s);
    setAnswers(new Array(s.analysis.quizQuestions.length).fill(null));
  }, [id, router]);

  if (!sermon) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-faith-600" /></div>;

  const questions = sermon.analysis.quizQuestions;
  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const next = () => {
    setSelected(null);
    setShowResult(false);
    if (current + 1 >= questions.length) setDone(true);
    else setCurrent(current + 1);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setDone(false);
  };

  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="card">
            <Trophy size={48} className={`mx-auto mb-4 ${pct >= 80 ? "text-gold-500" : pct >= 60 ? "text-faith-500" : "text-gray-300"}`} />
            <h1 className="text-3xl font-bold font-serif mb-2">
              {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good job!" : "Keep growing!"}
            </h1>
            <p className="text-gray-500 mb-6">You scored {score} out of {questions.length} ({pct}%)</p>

            <div className="grid grid-cols-5 gap-2 mb-8">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${answers[i] === q.correctIndex ? "bg-emerald-400" : "bg-red-300"}`}
                />
              ))}
            </div>

            <div className="space-y-3">
              <button onClick={reset} className="btn-secondary w-full flex items-center justify-center gap-2">
                <RotateCcw size={16} /> Retake Quiz
              </button>
              <Link href={`/sermon/${sermon.id}/devotions`} className="btn-primary w-full flex items-center justify-center gap-2">
                Start 6-Day Devotions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href={`/sermon/${sermon.id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Sermon
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Brain size={24} className="text-gold-500" />
          <div>
            <h1 className="text-2xl font-bold font-serif">Sermon Quiz</h1>
            <p className="text-sm text-gray-400">{sermon.analysis.title}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < current ? "bg-faith-400" : i === current ? "bg-faith-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="card">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Question {current + 1} of {questions.length}
          </div>
          <h2 className="text-xl font-semibold mb-6 leading-relaxed">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((option, idx) => {
              let style = "border-gray-200 hover:border-faith-300 hover:bg-faith-50 cursor-pointer";
              if (showResult) {
                if (idx === q.correctIndex) style = "border-emerald-400 bg-emerald-50";
                else if (idx === selected && idx !== q.correctIndex) style = "border-red-300 bg-red-50";
                else style = "border-gray-100 opacity-60";
              }
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${style}`}
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showResult && idx === q.correctIndex ? "border-emerald-400 bg-emerald-400 text-white" :
                    showResult && idx === selected ? "border-red-400 bg-red-400 text-white" :
                    "border-gray-300 text-gray-500"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-gray-700">{option}</span>
                  {showResult && idx === q.correctIndex && <CheckCircle size={18} className="text-emerald-500 ml-auto" />}
                  {showResult && idx === selected && idx !== q.correctIndex && <XCircle size={18} className="text-red-400 ml-auto" />}
                </div>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {selected === q.correctIndex ? "✓ Correct!" : "✗ Not quite"}
              </p>
              <p className="text-sm text-gray-500">{q.explanation}</p>
            </div>
          )}

          {showResult && (
            <button onClick={next} className="btn-primary mt-5 w-full justify-center">
              {current + 1 >= questions.length ? "See Results" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
