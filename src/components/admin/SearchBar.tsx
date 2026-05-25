"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  type: "announcement" | "sermon" | "event";
  url: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const q = `%${query}%`;

      const [
        { data: announcements },
        { data: sermons },
        { data: events },
      ] = await Promise.all([
        supabase.from("announcements").select("id, title").ilike("title", q).limit(3),
        supabase.from("sermons").select("id, title").ilike("title", q).limit(3),
        supabase.from("events").select("id, title").ilike("title", q).limit(3),
      ]);

      const all: SearchResult[] = [
        ...(announcements || []).map((a) => ({
          id: a.id,
          title: a.title,
          type: "announcement" as const,
          url: `/admin/announcements/${a.id}/edit`,
        })),
        ...(sermons || []).map((s) => ({
          id: s.id,
          title: s.title,
          type: "sermon" as const,
          url: `/admin/sermons/${s.id}/edit`,
        })),
        ...(events || []).map((e) => ({
          id: e.id,
          title: e.title,
          type: "event" as const,
          url: `/admin/events/${e.id}/edit`,
        })),
      ];

      setResults(all);
      setLoading(false);
      setOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const typeStyles: Record<string, string> = {
    announcement: "bg-gold-500/10 text-gold-500",
    sermon: "bg-blue-500/10 text-blue-400",
    event: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div ref={containerRef} className="relative w-full lg:max-w-md">
      <div className="relative">
        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search announcements, sermons, events..."
          className="w-full pl-10 pr-9 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white text-sm placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/60 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300 transition-colors"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 w-full bg-navy-800 border border-navy-700/50 rounded-xl shadow-2xl shadow-navy-900/50 overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-4 text-center">
                <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-navy-500 text-sm">
                No results found
              </div>
            ) : (
              <div className="divide-y divide-navy-700/30">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-navy-700/30 transition-colors"
                  >
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyles[result.type]}`}
                    >
                      {result.type}
                    </span>
                    <span className="text-navy-200 text-sm truncate">
                      {result.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
