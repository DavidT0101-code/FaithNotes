"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Search, BookOpen, Loader2, Globe } from "lucide-react";
import { getCurrentUser, getUsers, getSermons, saveUser, getUserById } from "@/lib/storage";
import { User, Sermon } from "@/lib/types";

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [publicSermons, setPublicSermons] = useState<Sermon[]>([]);
  const [search, setSearch] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
    setAllUsers(getUsers().filter((x) => x.id !== u.id));
    setPublicSermons(getSermons().filter((s) => s.isPublic && s.userId !== u.id));
    setLoading(false);
  }, [router]);

  const addFriend = (friendId: string) => {
    if (!user) return;
    if (user.friends.includes(friendId)) { setAddMsg("Already friends!"); return; }
    const updated = { ...user, friends: [...user.friends, friendId] };
    saveUser(updated);
    setUser(updated);
    const friend = getUserById(friendId);
    setAddMsg(`Added ${friend?.name ?? "friend"}!`);
    setTimeout(() => setAddMsg(""), 3000);
  };

  const removeFriend = (friendId: string) => {
    if (!user) return;
    const updated = { ...user, friends: user.friends.filter((f) => f !== friendId) };
    saveUser(updated);
    setUser(updated);
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><Loader2 className="animate-spin text-faith-600" size={32} /></div>;

  const friends = allUsers.filter((u) => user?.friends.includes(u.id));
  const suggestions = allUsers.filter((u) => !user?.friends.includes(u.id) && (
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold font-serif mb-2">Community</h1>
          <p className="text-gray-400">Grow together with friends in faith</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: People */}
          <div className="space-y-6">
            {/* Search */}
            <div className="card">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><UserPlus size={16} className="text-faith-600" /> Find Friends</h2>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-9 text-sm py-2"
                  placeholder="Search by name or email..."
                />
              </div>
              {addMsg && <p className="text-sm text-faith-600 mb-3">{addMsg}</p>}
              <div className="space-y-3">
                {suggestions.slice(0, 8).map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-faith-100 text-faith-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{u.name}</div>
                      <div className="text-xs text-gray-400 truncate">{u.email}</div>
                    </div>
                    <button onClick={() => addFriend(u.id)} className="text-xs px-3 py-1 bg-faith-100 text-faith-700 rounded-full hover:bg-faith-200 transition-colors font-medium">
                      Add
                    </button>
                  </div>
                ))}
                {suggestions.length === 0 && <p className="text-sm text-gray-400">No users found</p>}
              </div>
            </div>

            {/* Friends */}
            {friends.length > 0 && (
              <div className="card">
                <h2 className="font-semibold mb-4 flex items-center gap-2"><Users size={16} className="text-faith-600" /> Your Friends ({friends.length})</h2>
                <div className="space-y-3">
                  {friends.map((f) => (
                    <div key={f.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {f.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{f.name}</div>
                      </div>
                      <button onClick={() => removeFriend(f.id)} className="text-xs text-gray-400 hover:text-red-400 transition-colors">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Public Sermons */}
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <Globe size={18} className="text-faith-600" /> Public Sermons
            </h2>
            {publicSermons.length === 0 ? (
              <div className="card text-center py-12">
                <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No public sermons yet</p>
                <p className="text-sm text-gray-400 mt-1">Make your sermons public to share with the community</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {publicSermons.map((s) => (
                  <Link key={s.id} href={`/sermon/${s.id}`} className="card hover:shadow-md transition-all group block">
                    {s.thumbnailUrl && <img src={s.thumbnailUrl} alt="" className="w-full h-28 object-cover rounded-xl mb-3" />}
                    <div className="text-xs text-gray-400 mb-1">by {s.userName}</div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-faith-700 transition-colors">{s.analysis.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{s.analysis.summary.slice(0, 100)}…</p>
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {s.analysis.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge bg-faith-100 text-faith-700 text-xs">{tag}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
