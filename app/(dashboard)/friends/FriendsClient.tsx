"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, UserPlus, Check, X, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function FriendsClient({
  currentUserId,
  friends,
  pendingRequests,
  friendSermons,
}: {
  currentUserId: string;
  friends: any[];
  pendingRequests: any[];
  friendSermons: any[];
}) {
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [pending, setPending] = useState(pendingRequests);
  const [friendList, setFriendList] = useState(friends);

  async function searchUser(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    setRequestSent(false);

    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, email")
      .eq("email", email.trim().toLowerCase())
      .neq("id", currentUserId)
      .single();

    if (!data) setSearchError("No user found with that email.");
    else setSearchResult(data);
    setSearching(false);
  }

  async function sendRequest() {
    const supabase = createClient();
    await supabase.from("friend_requests").insert({
      sender_id: currentUserId,
      receiver_id: searchResult.id,
      status: "pending",
    });
    setRequestSent(true);
  }

  async function respondRequest(requestId: string, accept: boolean, sender: any) {
    const supabase = createClient();
    await supabase
      .from("friend_requests")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", requestId);

    setPending((prev) => prev.filter((r) => r.id !== requestId));
    if (accept) setFriendList((prev) => [...prev, sender]);
  }

  return (
    <div className="p-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Friends</h1>
        <p className="text-white/40">Share sermons and grow together in faith.</p>
      </motion.div>

      {/* Pending requests */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 mb-5"
          >
            <h2 className="font-semibold text-amber-300 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Friend requests ({pending.length})
            </h2>
            <div className="space-y-2">
              {pending.map((req) => (
                <div key={req.id} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {req.sender?.display_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{req.sender?.display_name}</p>
                    <p className="text-xs text-white/35">{req.sender?.email}</p>
                  </div>
                  <button
                    onClick={() => respondRequest(req.id, true, req.sender)}
                    className="p-1.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => respondRequest(req.id, false, req.sender)}
                    className="p-1.5 bg-red-500/10 border border-red-500/15 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add friend */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/8 bg-white/4 p-6 mb-5"
      >
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-violet-400" /> Add a friend
        </h2>
        <form onSubmit={searchUser} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-violet-500/40 transition-all">
            <Search className="w-4 h-4 text-white/25 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Search by email address"
              className="flex-1 text-sm focus:outline-none bg-transparent text-white placeholder:text-white/25"
            />
          </div>
          <button
            type="submit"
            disabled={!email || searching}
            className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>

        <AnimatePresence>
          {searchError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-red-400 mt-2">
              {searchError}
            </motion.p>
          )}
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-3 bg-violet-500/8 border border-violet-500/15 rounded-xl px-4 py-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {searchResult.display_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{searchResult.display_name}</p>
                <p className="text-xs text-white/40">{searchResult.email}</p>
              </div>
              {requestSent ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Sent!
                </span>
              ) : (
                <button
                  onClick={sendRequest}
                  className="text-xs bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  Add friend
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Friends list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/8 bg-white/4 p-6 mb-5"
      >
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-400" />
          My Friends
          <span className="text-xs text-white/30 font-normal">({friendList.length})</span>
        </h2>
        {!friendList.length ? (
          <p className="text-sm text-white/30 py-4 text-center">
            No friends yet. Search by email to add someone!
          </p>
        ) : (
          <div className="space-y-2">
            {friendList.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {f.display_name?.charAt(0).toUpperCase()}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[hsl(222_20%_11%)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{f.display_name}</p>
                  <p className="text-xs text-white/35">{f.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Friends' sermons */}
      {friendSermons.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-400" />
            Sermons from Friends
          </h2>
          <div className="space-y-2">
            {friendSermons.map((sermon: any, i) => (
              <motion.div key={sermon.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={`/sermon/${sermon.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 hover:bg-white/7 hover:border-violet-500/20 p-4 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{sermon.title}</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      {sermon.profiles?.display_name} · {formatDate(sermon.created_at)}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
