"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { FaPlay, FaHeadphones, FaDownload, FaClock, FaUser } from "react-icons/fa";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const sermons = [
  {
    title: "The Great Commission: Our Purpose",
    preacher: "Pastor Ayorinde Gabriel",
    date: "May 18, 2026",
    duration: "45 min",
    series: "Foundations of Faith",
    text: "Matthew 28:18-20",
    excerpt:
      "A powerful message on the Great Commission and our role as believers in fulfilling God's mandate to reach the world with the Gospel.",
  },
  {
    title: "Walking in Divine Love",
    preacher: "Pastor Ayorinde Gabriel",
    date: "May 11, 2026",
    duration: "42 min",
    series: "The Fruit of the Spirit",
    text: "1 Corinthians 13:1-13",
    excerpt:
      "Understanding the depth of God's love and how to walk in divine love towards one another in our daily lives.",
  },
  {
    title: "The Power of Prayer",
    preacher: "Pastor Ayorinde Gabriel",
    date: "May 4, 2026",
    duration: "48 min",
    series: "Prayer Series",
    text: "James 5:13-18",
    excerpt:
      "An exploration of the transformative power of prayer and how it connects us to the heart of God.",
  },
  {
    title: "Building a Strong Foundation",
    preacher: "Pastor Ayorinde Gabriel",
    date: "April 27, 2026",
    duration: "40 min",
    series: "Foundations of Faith",
    text: "Matthew 7:24-27",
    excerpt:
      "Learn how to build your life on the solid rock of God's Word, ensuring stability in every season.",
  },
  {
    title: "Walking in Unity",
    preacher: "Pastor Ayorinde Gabriel",
    date: "April 20, 2026",
    duration: "44 min",
    series: "Church Life",
    text: "Ephesians 4:1-16",
    excerpt:
      "A timely message on the importance of unity in the body of Christ and how we can maintain the bond of peace.",
  },
  {
    title: "Faith That Moves Mountains",
    preacher: "Pastor Ayorinde Gabriel",
    date: "April 13, 2026",
    duration: "46 min",
    series: "Faith Series",
    text: "Mark 11:22-24",
    excerpt:
      "Discover the secrets of unwavering faith that sees beyond circumstances and speaks to mountains.",
  },
];

const series = [
  { name: "Foundations of Faith", count: "3 sermons" },
  { name: "The Fruit of the Spirit", count: "2 sermons" },
  { name: "Prayer Series", count: "4 sermons" },
  { name: "Church Life", count: "2 sermons" },
  { name: "Faith Series", count: "3 sermons" },
];

export default function SermonsPage() {
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {sermons.map((sermon, i) => (
                  <motion.div
                    key={sermon.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group rounded-2xl bg-white border border-navy-100/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="shrink-0">
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gold-100 text-gold-600 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FaPlay className="h-5 w-5 ml-0.5" />
                            </div>
                            <svg className="h-12 w-12 opacity-0 group-hover:opacity-100" viewBox="0 0 60 60">
                              <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-navy-400 mb-1">
                          <span className="inline-flex items-center gap-1">
                            <FaUser className="h-3 w-3" />
                            {sermon.preacher}
                          </span>
                          <span className="text-navy-200">•</span>
                          <span>{sermon.date}</span>
                          <span className="text-navy-200">•</span>
                          <span className="inline-flex items-center gap-1">
                            <FaClock className="h-3 w-3" />
                            {sermon.duration}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-navy-800 group-hover:text-gold-600 transition-colors">
                          {sermon.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-gold-600">
                          {sermon.series} — {sermon.text}
                        </p>
                        <p className="mt-2 text-sm text-navy-500 line-clamp-2">
                          {sermon.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <button className="flex items-center gap-2 rounded-full bg-navy-800 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-gold-500 hover:text-navy-900">
                            <FaPlay className="h-3 w-3" />
                            Listen
                          </button>
                          <button className="flex items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-xs font-semibold text-navy-600 transition-all hover:border-gold-500 hover:text-gold-600">
                            <FaDownload className="h-3 w-3" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* SIDEBAR */}
              <div className="space-y-8">
                <motion.div {...fadeUp} className="rounded-2xl bg-white border border-navy-100/50 p-6 shadow-lg">
                  <h3 className="font-serif text-xl font-bold text-navy-800 mb-4">
                    Sermon Series
                  </h3>
                  <div className="space-y-3">
                    {series.map((s) => (
                      <div
                        key={s.name}
                        className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gold-50 cursor-pointer"
                      >
                        <span className="text-sm font-medium text-navy-700 group-hover:text-gold-600 transition-colors">
                          {s.name}
                        </span>
                        <span className="text-xs text-navy-400">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-2xl bg-navy-800 p-6 shadow-lg">
                  <FaHeadphones className="h-8 w-8 text-gold-400" />
                  <h3 className="mt-4 font-serif text-lg font-bold text-white">
                    Never Miss a Message
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    Subscribe to our podcast and receive new sermons automatically.
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

                <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }}>
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
                    <span className="mt-2 text-sm font-semibold text-gold-600">&rarr;</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
