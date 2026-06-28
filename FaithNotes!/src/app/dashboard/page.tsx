"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Calendar, Users, Brain, Loader2 } from "lucide-react";
import { getCurrentUser, getUserSermons, getSharedSermons } from "@/lib/storage";
import { Sermon } from "@/lib/types";

function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Link href={`/sermon/${sermon.id}`} className="card hover:shadow-md transition-all group block">
      {sermon.thumbnailUrl && (
        <img src={sermon.thumbnailUrl} alt="" className="w-full h-36 object-cover rounded-xl mb-4" />
      )}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {sermon.analysis.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge bg-faith-100 text-faith-700 text-xs">{tag}</span>
        ))}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-faith-700 transition-colors">
        {sermon.analysis.title}
      </h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-4">{sermon.analysis.summary.slice(0, 120)}…</p>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1"><BookOpen size={12} /> {sermon.analysis.mainPoints.length} points</span>
        <span className="flex items-center gap-1"><Brain size={12} /> {sermon.analysis.quizQuestions.length} quiz</span>
        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(sermon.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [mySermons, setMySermons] = useState<Sermon[]>([]);
  const [sharedSermons, setSharedSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) { router.push("/login"); return; }
    setMySermons(getUserSermons(user.id));
    setSharedSermons(getSharedSermons(user.id));
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><Loader2 className="animate-spin text-faith-600" size={32} /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold font-serif">Your Sermons</h1>
            <p className="text-gray-400 mt-1">Your library of spiritual growth</p>
          </div>
          <Link href="/upload" className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Upload Sermon
          </Link>
        </div>

        {/* My Sermons */}
        {mySermons.length === 0 ? (
          <div className="text-center py-20 card">
            <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No sermons yet</h2>
            <p className="text-gray-400 mb-6">Upload your first sermon to get started</p>
            <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Upload Your First Sermon
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mySermons.map((s) => <SermonCard key={s.id} sermon={s} />)}
          </div>
        )}

        {/* Shared with me */}
        {sharedSermons.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-faith-600" />
              <h2 className="text-2xl font-semibold font-serif">Shared with You</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedSermons.map((s) => (
                <div key={s.id} className="relative">
                  <SermonCard sermon={s} />
                  <div className="absolute top-3 right-3 badge bg-blue-100 text-blue-700 text-xs">From {s.userName}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
