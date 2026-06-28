"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Upload, LayoutDashboard, Users, LogOut, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/upload", icon: Upload, label: "Upload Sermon" },
  { href: "/friends", icon: Users, label: "Friends" },
];

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = (user.user_metadata?.display_name as string) || user.email || "Friend";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-full w-60 bg-white/3 backdrop-blur-xl border-r border-white/8 flex flex-col z-40"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-transparent to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="relative p-5 border-b border-white/8">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/40 group-hover:shadow-violet-500/30 transition-shadow">
            <BookOpen className="w-4 h-4 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          <span className="font-semibold text-lg text-white group-hover:text-violet-300 transition-colors">FaithNotes</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 p-3 space-y-1">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-violet-300"
                    : "text-white/45 hover:text-white hover:bg-white/6"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-violet-500/15 border border-violet-500/20"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <item.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Upload CTA */}
      <div className="relative px-3 mb-3">
        <Link href="/upload" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm hover:bg-violet-500/20 transition-all group">
          <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
          <span className="font-medium">New Sermon</span>
        </Link>
      </div>

      {/* User */}
      <div className="relative p-3 border-t border-white/8">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[hsl(222_20%_8%)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-white/35 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 text-xs text-white/30 hover:text-red-400 px-2 py-2 rounded-xl hover:bg-red-500/8 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </motion.aside>
  );
}
