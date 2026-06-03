"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDateShort } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const categoryStyles: Record<string, string> = {
  General: "bg-navy-700/50 text-navy-300",
  Ministry: "bg-blue-500/10 text-blue-400",
  Event: "bg-purple-500/10 text-purple-400",
  Prayer: "bg-emerald-500/10 text-emerald-400",
  Urgent: "bg-red-500/10 text-red-400",
};

function stripMarkdown(text: string): string {
  return text
    .replace(/[*_~`]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/- /g, "")
    .trim();
}

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("date", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SectionWrapper className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (items.length === 0) return null;

  return (
    <SectionWrapper className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div {...fadeUp}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Church News
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
              Announcements
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
            <p className="mt-4 text-base md:text-lg text-navy-500 max-w-2xl mx-auto">
              Stay informed with the latest updates from GMBC.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Link key={item.id} href={`/announcements/${item.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 hover:-translate-y-2 cursor-pointer ${
                  item.is_pinned
                    ? "border-gold-300 bg-gradient-to-b from-gold-50/50 to-white shadow-lg shadow-gold-500/5"
                    : "border-navy-100/50 bg-gradient-to-b from-cream to-white shadow-lg hover:border-gold-300"
                }`}
              >
                {item.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        categoryStyles[item.category] || categoryStyles.General
                      }`}
                    >
                      {item.category}
                    </span>
                    {item.is_pinned && (
                      <span className="text-xs font-medium text-gold-600">Pinned</span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-navy-800 group-hover:text-gold-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-navy-400">{formatDateShort(item.date)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">
                    {stripMarkdown(item.content).length > 150
                      ? stripMarkdown(item.content).slice(0, 150).trimEnd() + "..."
                      : stripMarkdown(item.content)}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-12 text-center">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-gold-500 hover:text-navy-900 hover:shadow-xl hover:shadow-gold-500/25"
          >
            View All Announcements
            <span aria-hidden="true" className="text-lg">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={className}>{children}</section>;
}
