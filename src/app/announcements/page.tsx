"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { FaCalendar, FaBullhorn, FaLink } from "react-icons/fa";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("announcements")
      .select("*")
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (data) setAnnouncements(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Church News
              </span>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Announcements
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                Stay informed with the latest updates from Grace Missionary Baptist Church.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ANNOUNCEMENTS LIST */}
        <SectionWrapper className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-20">
                <FaBullhorn className="mx-auto h-12 w-12 text-navy-300" />
                <p className="mt-4 text-navy-400 text-lg">No announcements at this time.</p>
                <p className="text-navy-500 text-sm mt-2">Check back soon for updates.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((item, i) => (
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
                        <p className="mt-1 text-xs text-navy-400 flex items-center gap-1">
                          <FaCalendar className="h-3 w-3" />
                          {formatDate(item.date)}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-navy-500">
                          {stripMarkdown(item.content).length > 200
                            ? stripMarkdown(item.content).slice(0, 200).trimEnd() + "..."
                            : stripMarkdown(item.content)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
