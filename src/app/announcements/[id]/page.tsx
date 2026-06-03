"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { FaCalendar, FaArrowLeft, FaBullhorn } from "react-icons/fa";
import type { Announcement } from "@/lib/types";

const categoryStyles: Record<string, string> = {
  General: "bg-navy-700/50 text-navy-300",
  Ministry: "bg-blue-500/10 text-blue-400",
  Event: "bg-purple-500/10 text-purple-400",
  Prayer: "bg-emerald-500/10 text-emerald-400",
  Urgent: "bg-red-500/10 text-red-400",
};

export default function AnnouncementDetailPage() {
  const params = useParams();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("announcements")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        if (data) setAnnouncement(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (!announcement) {
    return (
      <>
        <Header />
        <section className="pt-32 pb-20 bg-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaBullhorn className="mx-auto h-16 w-16 text-navy-300" />
            <h1 className="mt-6 font-serif text-3xl font-bold text-navy-800">Announcement Not Found</h1>
            <p className="mt-2 text-navy-500">This announcement may have been removed or is no longer available.</p>
            <Link
              href="/announcements"
              className="mt-6 inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 font-medium"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Announcements
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main>
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
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium mb-6 transition-colors"
              >
                <FaArrowLeft className="h-4 w-4" />
                Back to Announcements
              </Link>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {announcement.title}
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <FaCalendar className="h-4 w-4" />
                  {formatDate(announcement.date)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    categoryStyles[announcement.category] || categoryStyles.General
                  }`}
                >
                  {announcement.category}
                </span>
                {announcement.is_pinned && (
                  <span className="text-xs font-medium text-gold-400">Pinned</span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {announcement.image && (
                <div className="mb-10 overflow-hidden rounded-2xl">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy-800 prose-p:text-navy-600 prose-a:text-gold-600">
                {announcement.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-navy-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
