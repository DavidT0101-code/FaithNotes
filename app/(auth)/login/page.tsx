"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(222_20%_8%)] px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/50 group-hover:shadow-violet-500/30 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl text-white">FaithNotes</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/40 mt-1">Sign in to your account</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-6 space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/60 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email"
                className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/60 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" autoComplete="current-password"
                className="input" />
            </div>
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="btn-primary w-full py-3 disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <><Sparkles className="w-4 h-4" /> Sign in</>}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm text-white/35 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-violet-400 font-medium hover:text-violet-300 transition-colors">Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}
