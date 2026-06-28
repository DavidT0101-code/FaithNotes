"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  BookOpen, Upload, Sparkles, Users, ChevronRight, Play,
  Brain, Heart, Zap, Globe, ArrowRight, Check, Calendar, Star,
} from "lucide-react";

function Particles() {
  const pts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 5.3) % 90}%`,
    top: `${10 + (i * 7.1) % 80}%`,
    dur: 3 + (i % 4),
    delay: (i * 0.45) % 4,
    size: i % 3 === 0 ? 3 : 2,
    color: i % 3 === 0 ? "rgba(167,139,250,0.5)" : i % 3 === 1 ? "rgba(245,158,11,0.35)" : "rgba(236,72,153,0.35)",
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p) => (
        <div key={p.id} className="absolute rounded-full animate-particle"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, background: p.color, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const features = [
  { icon: Upload, title: "Upload Any Sermon", desc: "MP3, WAV, MP4, or YouTube link — processed instantly.", gradient: "from-violet-600/20 to-purple-600/10", border: "border-violet-500/20", iconBg: "bg-violet-500/20", iconColor: "text-violet-300" },
  { icon: Sparkles, title: "AI-Powered Analysis", desc: "200-word summary, main points, Bible verses, action steps.", gradient: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/20", iconBg: "bg-amber-500/20", iconColor: "text-amber-300" },
  { icon: Calendar, title: "6-Day Devotion Plan", desc: "Daily reflections, challenges, and prayer focus all week.", gradient: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/20", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-300" },
  { icon: Brain, title: "Sermon Quiz", desc: "5 questions to test and reinforce understanding.", gradient: "from-blue-500/20 to-indigo-500/10", border: "border-blue-500/20", iconBg: "bg-blue-500/20", iconColor: "text-blue-300" },
  { icon: Users, title: "Share with Friends", desc: "Add friends and share sermons across your community.", gradient: "from-rose-500/20 to-pink-500/10", border: "border-rose-500/20", iconBg: "bg-rose-500/20", iconColor: "text-rose-300" },
  { icon: Globe, title: "Bible Verse Detection", desc: "Every scripture auto-extracted and explained in context.", gradient: "from-cyan-500/20 to-sky-500/10", border: "border-cyan-500/20", iconBg: "bg-cyan-500/20", iconColor: "text-cyan-300" },
];

const steps = [
  { num: "01", icon: Upload, title: "Upload", desc: "Drop your sermon file or paste a YouTube URL." },
  { num: "02", icon: Sparkles, title: "AI Processes", desc: "Claude AI extracts every insight in seconds." },
  { num: "03", icon: Heart, title: "Grow All Week", desc: "Daily devotions, quizzes, prayer focus — all ready." },
];

const testimonials = [
  { name: "Sarah M.", role: "Small Group Leader", text: "FaithNotes transformed how our group engages with Sunday sermons. We actually live them out all week!", avatar: "S" },
  { name: "James K.", role: "Youth Pastor", text: "The quiz feature is incredible for our youth group. Kids are actually retaining the message now.", avatar: "J" },
  { name: "Maria L.", role: "Daily Devotional Seeker", text: "I upload our pastor's sermon every Sunday and have a full week of devotions ready. Life-changing.", avatar: "M" },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[hsl(222_20%_8%)] overflow-x-hidden">
      {/* ── Nav ─────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[hsl(222_20%_8%/0.8)] backdrop-blur-xl border-b border-white/8"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-white">FaithNotes</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">Sign in</Link>
          <Link href="/signup" className="btn-primary text-sm py-2 px-5">
            <Sparkles className="w-3.5 h-3.5" /> Get started
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden hero-bg">
        <Particles />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto text-center pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-violet-500/12 border border-violet-500/25 text-violet-300 rounded-full px-5 py-2 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Spiritual Growth
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            Turn every sermon into{" "}
            <span className="gradient-text font-serif italic">a week</span>
            <br />of growth
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any sermon — audio, video, or YouTube — and instantly receive a personalized 6-day devotion plan, quiz, prayer guide, and Bible verse breakdown.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-base px-8 py-3.5 group w-full sm:w-auto">
              Start for free <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              <Play className="w-4 h-4 text-violet-400" /> See how it works
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-5 text-sm text-white/20">
            No credit card required · Free to start
          </motion.p>

          {/* Hero preview */}
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.45 }} className="mt-16 relative mx-auto max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/15 via-purple-500/8 to-violet-500/15 blur-xl rounded-3xl" />
            <div className="relative glass rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/50" /><div className="w-3 h-3 rounded-full bg-amber-400/50" /><div className="w-3 h-3 rounded-full bg-emerald-400/50" /></div>
                <div className="flex-1 h-7 bg-white/5 rounded-lg flex items-center px-3"><span className="text-xs text-white/25">Processing sermon...</span></div>
              </div>
              <div className="space-y-2.5">
                {["Extracting YouTube transcript", "Analyzing with Claude AI", "Generating 6-day devotions", "Creating quiz questions"].map((label, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i < 3 ? "bg-emerald-400" : "bg-violet-500/40"}`}>
                      {i < 3 ? <Check className="w-3 h-3 text-white" /> : null}
                    </div>
                    <span className={`text-sm flex-1 ${i < 3 ? "text-white/60" : "text-white/35"}`}>{label}</span>
                    {i === 3 && (
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-violet-400 rounded-full" initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ duration: 1.5, delay: 1 }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(222_20%_8%)] to-transparent" />
      </section>

      {/* ── How it works ─────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4"><ArrowRight className="w-3.5 h-3.5" /> How it works</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-3">Three steps to a week of growth</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.12}>
                <div className="relative text-center group">
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full bg-violet-500/8 border border-violet-500/15 animate-pulse-glow" style={{ animationDelay: `${i * 0.5}s` }} />
                    <div className="absolute inset-3 rounded-full bg-violet-500/12 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-6 h-6 text-violet-400" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">{i + 1}</span>
                  </div>
                  <div className="text-6xl font-bold text-white/4 font-serif absolute -top-3 left-1/2 -translate-x-1/2 select-none pointer-events-none">{step.num}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222_20%_8%)] via-violet-950/20 to-[hsl(222_20%_8%)]" />
        <div className="relative max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4"><Zap className="w-3.5 h-3.5" /> Features</div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 font-serif">Everything you need to grow</h2>
              <p className="text-white/35 max-w-xl mx-auto">One sermon. A full week of structured spiritual formation.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-2xl border p-5 bg-gradient-to-br ${f.gradient} ${f.border} overflow-hidden group cursor-default`}>
                  <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}><Star className="w-5 h-5 text-amber-400 fill-amber-400" /></motion.div>)}
              </div>
              <h2 className="text-4xl font-bold text-white font-serif">Loved by believers</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-white/8 bg-white/4 p-6 group hover:border-white/15 transition-all">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-white/55 mb-5 italic text-sm leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{t.avatar}</div>
                    <div>
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-white/30">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-violet-500/25 p-10 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-700/35 via-purple-700/25 to-violet-900/50" />
              <div className="absolute animate-shimmer inset-0 opacity-20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-400/15 blur-3xl" />
              <div className="relative">
                <Sparkles className="w-10 h-10 text-violet-300 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4 font-serif">Ready to grow deeper?</h2>
                <p className="text-violet-200/60 mb-10 text-lg">Join thousands of believers turning Sunday sermons into daily transformation.</p>
                <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-4 rounded-xl hover:bg-violet-50 transition-colors text-base shadow-xl group">
                  Create your free account <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-5 text-violet-300/40 text-sm">Free forever · No credit card</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────── */}
      <footer className="border-t border-white/8 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center"><BookOpen className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-semibold text-white">FaithNotes</span>
          </div>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} FaithNotes. Built to deepen your walk with God.</p>
          <div className="flex gap-5 text-xs text-white/25">
            <Link href="/login" className="hover:text-white/50 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-white/50 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
