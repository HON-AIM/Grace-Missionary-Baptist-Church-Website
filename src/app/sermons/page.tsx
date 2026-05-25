"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import {
  FaPlay,
  FaHeadphones,
  FaClock,
  FaUser,
  FaYoutube,
  FaCalendar,
} from "react-icons/fa";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Sermon } from "@/lib/types";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function stripMarkdown(text: string): string {
  return text
    .replace(/[*_~`]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/- /g, "")
    .trim();
}

function getYoutubeEmbed(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sermons")
      .select("*")
      .eq("is_published", true)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (data) setSermons(data);
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
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Sermons
              </span>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Messages That Transform
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                Listen to recent sermons and grow in your walk with Christ.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SERMONS LIST */}
        <SectionWrapper className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sermons.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-400 text-lg">No sermons available yet.</p>
                <p className="text-navy-500 text-sm mt-2">Check back soon for new messages.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  {sermons.map((sermon, i) => {
                    const videoId = sermon.youtube_url
                      ? getYoutubeEmbed(sermon.youtube_url)
                      : null;
                    return (
                      <motion.div
                        key={sermon.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="group rounded-2xl bg-white border border-navy-100/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {sermon.thumbnail && (
                            <div className="sm:w-48 shrink-0 relative overflow-hidden">
                              <img
                                src={sermon.thumbnail}
                                alt={sermon.title}
                                className="h-48 sm:h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-navy-400 mb-1">
                              <span className="inline-flex items-center gap-1">
                                <FaUser className="h-3 w-3" />
                                {sermon.pastor}
                              </span>
                              <span className="text-navy-200">•</span>
                              <span className="inline-flex items-center gap-1">
                                <FaCalendar className="h-3 w-3" />
                                {formatDate(sermon.date)}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-bold text-navy-800 group-hover:text-gold-600 transition-colors">
                              {sermon.title}
                            </h3>
                            {sermon.scripture && (
                              <p className="mt-1 text-xs font-medium text-gold-600">
                                {sermon.scripture}
                              </p>
                            )}
                            {sermon.description && (
                              <p className="mt-2 text-sm text-navy-500 line-clamp-2">
                                {stripMarkdown(sermon.description)}
                              </p>
                            )}
                            <div className="mt-4 flex items-center gap-3">
                              {videoId && (
                                <a
                                  href={sermon.youtube_url!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-red-700"
                                >
                                  <FaYoutube className="h-3 w-3" />
                                  Watch
                                </a>
                              )}
                              {!videoId && sermon.youtube_url && (
                                <a
                                  href={sermon.youtube_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-full bg-navy-800 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-gold-500 hover:text-navy-900"
                                >
                                  <FaPlay className="h-3 w-3" />
                                  Listen
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* SIDEBAR */}
                <div className="space-y-8">
                  <motion.div
                    {...fadeUp}
                    className="rounded-2xl bg-white border border-navy-100/50 p-6 shadow-lg"
                  >
                    <h3 className="font-serif text-xl font-bold text-navy-800 mb-4">
                      Recent Sermons
                    </h3>
                    <div className="space-y-3">
                      {sermons.slice(0, 5).map((s) => (
                        <div
                          key={s.id}
                          className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gold-50 cursor-pointer"
                        >
                          {s.thumbnail && (
                            <img
                              src={s.thumbnail}
                              alt=""
                              className="w-12 h-9 rounded object-cover shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-navy-700 group-hover:text-gold-600 transition-colors truncate">
                              {s.title}
                            </p>
                            <p className="text-xs text-navy-400">
                              {s.pastor} &middot;{" "}
                              {formatDate(s.date)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="rounded-2xl bg-navy-800 p-6 shadow-lg"
                  >
                    <FaHeadphones className="h-8 w-8 text-gold-400" />
                    <h3 className="mt-4 font-serif text-lg font-bold text-white">
                      Never Miss a Message
                    </h3>
                    <p className="mt-2 text-sm text-white/60">
                      Subscribe to our podcast and receive new sermons
                      automatically.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-full bg-gold-500 px-4 py-2.5 text-xs font-semibold text-navy-900 transition-all hover:bg-gold-400">
                        Subscribe
                      </button>
                      <button className="rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10">
                        RSS Feed
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    {...fadeUp}
                    transition={{ duration: 0.6, delay: 0.25 }}
                  >
                    <Link
                      href="/contact"
                      className="flex flex-col items-center rounded-2xl border-2 border-dashed border-gold-300 bg-gold-50/50 p-6 text-center transition-all hover:bg-gold-100 hover:border-gold-400"
                    >
                      <span className="font-serif text-lg font-bold text-gold-700">
                        Request Prayer
                      </span>
                      <p className="mt-1 text-xs text-gold-600">
                        Share your prayer request with us
                      </p>
                      <span className="mt-2 text-sm font-semibold text-gold-600">
                        &rarr;
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
