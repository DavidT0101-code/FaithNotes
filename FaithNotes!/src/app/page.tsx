"use client";

import Link from "next/link";
import { BookOpen, Upload, Users, Sparkles, ChevronRight, Play, Star } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Any Sermon",
    desc: "MP3, WAV, MP4, or paste a YouTube link — we handle the rest instantly.",
    color: "bg-faith-100 text-faith-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    desc: "Get a 200-word summary, main points, key takeaways, Bible verses, and action steps.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: BookOpen,
    title: "6-Day Devotion Plan",
    desc: "Each sermon becomes a week of daily reflections, challenges, and prayers.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Users,
    title: "Share with Friends",
    desc: "Add friends, share sermons, and grow together in community.",
    color: "bg-blue-100 text-blue-600",
  },
];

const testimonials = [
  { name: "Sarah M.", role: "Small Group Leader", text: "FaithNotes transformed how our group engages with Sunday sermons. We actually live them out all week!" },
  { name: "James K.", role: "Youth Pastor", text: "The quiz feature is incredible for our youth group. Kids are actually retaining the message now." },
  { name: "Maria L.", role: "Daily Devotional Seeker", text: "I upload our pastor's sermon every Sunday and have a full week of devotions ready. Life-changing." },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="hero-gradient pt-24 pb-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-faith-100 text-faith-700 rounded-full px-4 py-2 text-sm font-medium mb-8">
            <Sparkles size={14} />
            <span>AI-Powered Spiritual Growth</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Turn any sermon into{" "}
            <span className="gradient-text font-serif italic">a week</span>{" "}
            of growth
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Upload a sermon — video, audio, or YouTube link — and instantly receive AI-generated summaries,
            daily devotions, quizzes, and personalized prayer guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
              Get Started Free <ChevronRight size={20} />
            </Link>
            <Link href="/upload" className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2">
              <Play size={18} /> Try a Sermon
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required · Free to start</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 font-serif">Everything you need to go deeper</h2>
          <p className="text-gray-500 text-center text-lg mb-16">One upload, a full week of spiritual formation.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-[#fafaf9]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 font-serif">How it works</h2>
          <p className="text-gray-500 text-lg mb-16">Three simple steps to a week of spiritual growth.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload", desc: "Drop your sermon file or paste a YouTube URL. We accept MP3, WAV, and MP4." },
              { step: "02", title: "AI Processes", desc: "Our AI transcribes and analyzes the sermon in seconds, extracting every key insight." },
              { step: "03", title: "Grow All Week", desc: "Access your daily devotions, quiz yourself, pray with focus, and share with friends." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-7xl font-bold text-faith-100 mb-2 font-serif">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2 -mt-6">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 font-serif">Loved by believers</h2>
          <div className="flex justify-center gap-1 mb-16">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-gold-500 fill-gold-400" />)}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-faith-600 to-faith-800">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4 font-serif">Start growing today</h2>
          <p className="text-faith-200 text-lg mb-10">Join thousands of believers turning sermons into lasting transformation.</p>
          <Link href="/signup" className="bg-white text-faith-700 font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-faith-50 transition-colors text-lg">
            Create Your Free Account <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-serif text-white text-xl font-bold">FaithNotes</div>
          <p className="text-sm">© 2026 FaithNotes. Built with faith and purpose.</p>
        </div>
      </footer>
    </div>
  );
}
