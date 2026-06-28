"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Upload, Users, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { getCurrentUser, setCurrentUser } from "@/lib/storage";
import { User } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-change", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-change", onStorage);
    };
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/upload", label: "Upload", icon: Upload },
        { href: "/community", label: "Community", icon: Users },
      ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen size={22} className="text-faith-600" />
          <span className="font-serif font-bold text-xl text-gray-900">FaithNotes</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-faith-50 text-faith-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-faith-100 flex items-center justify-center text-faith-700 font-semibold text-sm">
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button onClick={logout} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-faith-50 hover:text-faith-700 font-medium"
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium mt-2">
              <LogOut size={18} /> Log out
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
              <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary text-center">Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary text-center">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
