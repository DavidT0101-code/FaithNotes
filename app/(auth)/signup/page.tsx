"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader2, CheckCircle2, Sparkles, AlertCircle, Shield, Zap, Heart, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const perks = [
  { icon: Sparkles, text: "AI-powered sermon analysis" },
  { icon: Zap, text: "6-day devotion plans generated instantly" },
  { icon: Heart, text: "Personalized prayer focus every day" },
  { icon: Users, text: "Share sermons with your faith community" },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(222_20%_8%)] px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet-600/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-purple-600/6 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-white/40 mb-8 leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="text-violet-400 font-medium">{email}</span>.<br />
            Click it to activate your account.
          </p>
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-violet-400 font-medium hover:text-violet-300 transition-colors">
            Back to sign in →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[hsl(222_20%_8%)] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-violet-600/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full bg-purple-600/6 blur-3xl pointer-events-none" />

      {/* Left brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-col justify-center w-1/2 px-16 relative"
      >
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/50">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-white">FaithNotes</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Turn every sermon into<br />a week of growth
          </h1>
          <p className="text-white/40 text-lg mb-10 leading-relaxed">
            Join thousands using AI to deepen their faith through personalized devotions, quizzes, and community sharing.
          </p>
          <ul className="space-y-4">
            {perks.map((perk, i) => (
              <motion.li
                key={perk.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <perk.icon className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-white/60 text-sm">{perk.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">FaithNotes</span>
            </Link>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-white">Create your account</h2>
            <p className="text-white/40 mt-1">Free forever. No credit card required.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-6 space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/60 block mb-1.5">Display name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" autoComplete="name" className="input" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 block mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" className="input" />
              </div>
              <div>
                <label className="text-sm font-medium text-white/60 block mb-1.5 flex items-center justify-between">
                  Password
                  {password.length > 0 && (
                    <span className={`text-xs ${password.length >= 8 ? "text-emerald-400" : "text-red-400"}`}>
                      {password.length >= 8 ? "✓ Strong enough" : `${8 - password.length} more chars`}
                    </span>
                  )}
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" autoComplete="new-password" className="input" />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-primary w-full py-3 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Create free account</>
                )}
              </motion.button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-xs text-white/25 pt-1">
              <Shield className="w-3 h-3" />
              By signing up you agree to our Terms &amp; Privacy Policy
            </div>
          </div>

          <p className="text-center text-sm text-white/35 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
