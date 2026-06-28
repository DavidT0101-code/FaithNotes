"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Target, Lightbulb, ArrowRight, Heart, Share2, Trash2,
  ChevronDown, ChevronUp, Globe, Lock, Users, Brain,
} from "lucide-react";
import { getSermonById, getCurrentUser, saveSermon, deleteSermon, getUsers } from "@/lib/storage";
import { Sermon, BibleVerse } from "@/lib/types";

function VerseCard({ verse }: { verse: BibleVerse }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:border-faith-200 transition-colors">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-faith-700">{verse.reference}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          <p className="text-gray-700 italic">"{verse.text}"</p>
          <p className="text-sm text-gray-500">{verse.context}</p>
        </div>
      )}
    </div>
  );
}

export default function SermonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [user] = useState(() => getCurrentUser());
  const [shareOpen, setShareOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = getSermonById(id);
    if (!s) { router.push("/dashboard"); return; }
    setSermon(s);
  }, [id, router]);

  if (!sermon) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-faith-600" /></div>;

  const isOwner = user?.id === sermon.userId;
  const analysis = sermon.analysis;

  const togglePublic = () => {
    const updated = { ...sermon, isPublic: !sermon.isPublic, updatedAt: new Date().toISOString() };
    saveSermon(updated);
    setSermon(updated);
  };

  const handleShare = () => {
    const users = getUsers();
    const friend = users.find((u) => u.email === friendEmail.trim());
    if (!friend) { setShareMsg("No user found with that email."); return; }
    if (!sermon.sharedWith.includes(friend.id)) {
      const updated = { ...sermon, sharedWith: [...sermon.sharedWith, friend.id], updatedAt: new Date().toISOString() };
      saveSermon(updated);
      setSermon(updated);
    }
    setShareMsg(`Shared with ${friend.name}!`);
    setFriendEmail("");
  };

  const handleDelete = () => {
    if (!confirm("Delete this sermon?")) return;
    deleteSermon(sermon.id);
    router.push("/dashboard");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {sermon.thumbnailUrl && (
            <img src={sermon.thumbnailUrl} alt="" className="w-full h-56 object-cover rounded-2xl mb-6" />
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            {analysis.tags.map((tag) => (
              <span key={tag} className="badge bg-faith-100 text-faith-700">#{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl font-bold font-serif mb-3">{analysis.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>By {sermon.userName}</span>
            <span>·</span>
            <span>{new Date(sermon.createdAt).toLocaleDateString()}</span>
            {isOwner && (
              <>
                <span>·</span>
                <button onClick={togglePublic} className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                  {sermon.isPublic ? <><Globe size={14} /> Public</> : <><Lock size={14} /> Private</>}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/sermon/${sermon.id}/devotions`} className="btn-primary flex items-center gap-2">
            <BookOpen size={16} /> 6-Day Devotions
          </Link>
          <Link href={`/sermon/${sermon.id}/quiz`} className="btn-secondary flex items-center gap-2">
            <Brain size={16} /> Take Quiz
          </Link>
          <button onClick={copyLink} className="btn-secondary flex items-center gap-2">
            <Share2 size={16} /> {copied ? "Copied!" : "Copy Link"}
          </button>
          {isOwner && (
            <>
              <button onClick={() => setShareOpen(!shareOpen)} className="btn-secondary flex items-center gap-2">
                <Users size={16} /> Share with Friend
              </button>
              <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
        </div>

        {/* Share panel */}
        {shareOpen && (
          <div className="card mb-8 border-faith-100">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Users size={16} className="text-faith-600" /> Share with a Friend</h3>
            <div className="flex gap-3">
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="input flex-1"
                placeholder="Friend's email address"
              />
              <button onClick={handleShare} className="btn-primary px-5">Share</button>
            </div>
            {shareMsg && <p className="text-sm mt-2 text-faith-600">{shareMsg}</p>}
            {sermon.sharedWith.length > 0 && (
              <p className="text-xs text-gray-400 mt-3">Shared with {sermon.sharedWith.length} friend{sermon.sharedWith.length !== 1 ? "s" : ""}</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Summary */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-faith-600" /> Sermon Summary
              </h2>
              <p className="text-gray-600 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Main Points */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target size={18} className="text-faith-600" /> Main Points
              </h2>
              <div className="space-y-4">
                {analysis.mainPoints.map((point, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-faith-100 text-faith-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{point.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bible Verses */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-gold-500" /> Scripture References
              </h2>
              <div className="space-y-3">
                {analysis.bibleVerses.map((verse, i) => (
                  <VerseCard key={i} verse={verse} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Takeaways */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb size={16} className="text-gold-500" /> Key Takeaways
              </h2>
              <ul className="space-y-3">
                {analysis.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                    <ArrowRight size={14} className="text-faith-400 mt-0.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Steps */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={16} className="text-emerald-500" /> Action Steps
              </h2>
              <ul className="space-y-3">
                {analysis.actionSteps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center flex-shrink-0 font-semibold">{i + 1}</span>
                    <span className="text-gray-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prayer Focus */}
            <div className="card bg-gradient-to-br from-faith-50 to-purple-50 border-faith-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart size={16} className="text-faith-500" /> Prayer Focus
              </h2>
              <ul className="space-y-3">
                {analysis.prayerFocus.map((prayer, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                    <span className="text-faith-400">🙏</span>
                    {prayer}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-3">
              <Link href={`/sermon/${sermon.id}/devotions`} className="card hover:shadow-md transition-shadow text-center group">
                <BookOpen size={24} className="text-faith-600 mx-auto mb-2" />
                <div className="font-semibold text-sm">6-Day Devotions</div>
                <div className="text-xs text-gray-400 mt-1">Daily reflection &amp; prayer</div>
              </Link>
              <Link href={`/sermon/${sermon.id}/quiz`} className="card hover:shadow-md transition-shadow text-center group">
                <Brain size={24} className="text-gold-500 mx-auto mb-2" />
                <div className="font-semibold text-sm">Take the Quiz</div>
                <div className="text-xs text-gray-400 mt-1">Test your understanding</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
