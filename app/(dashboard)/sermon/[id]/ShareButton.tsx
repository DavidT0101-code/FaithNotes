"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Globe, Lock, Check, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ShareButton({
  sermonId,
  isPublic,
  isOwner,
}: {
  sermonId: string;
  isPublic: boolean;
  isOwner: boolean;
}) {
  const [pub, setPub] = useState(isPublic);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  if (!isOwner) return null;

  async function togglePublic() {
    const supabase = createClient();
    const next = !pub;
    await supabase.from("sermons").update({ is_public: next }).eq("id", sermonId);
    setPub(next);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/sermon/${sermonId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-2 rounded-xl transition-all"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 bg-[hsl(222_20%_11%)] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 w-64 z-20"
            >
              <p className="text-sm font-medium text-white mb-3">Share this sermon</p>

              <button
                onClick={togglePublic}
                className="w-full flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-xl hover:bg-white/6 transition-colors mb-2 text-left"
              >
                {pub ? (
                  <>
                    <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white/70">Public — click to make private</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white/30 shrink-0" />
                    <span className="text-white/50">Private — click to make public</span>
                  </>
                )}
              </button>

              {pub && (
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 text-sm bg-violet-500/15 border border-violet-500/20 text-violet-300 hover:bg-violet-500/25 px-3 py-2.5 rounded-xl transition-all"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy link</>
                  )}
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
