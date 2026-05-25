"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import ServiceTimes from "@/components/ServiceTimes";
import ScriptureBanner from "@/components/ScriptureBanner";
import Announcements from "@/components/Announcements";
import UpcomingEvents from "@/components/UpcomingEvents";
import { createClient } from "@/lib/supabase/client";
import {
  FaPray,
  FaBible,
  FaMusic,
  FaUsers,
  FaDoorOpen,
  FaCamera,
  FaHeart,
  FaChurch,
  FaHandHoldingHeart,
} from "react-icons/fa";

const CrossIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v20M2 12h20" />
  </svg>
);

const ministries = [
  { name: "Bible Study", icon: FaBible, desc: "Deep dive into God's Word for spiritual growth and understanding." },
  { name: "Church School", icon: FaChurch, desc: "Teaching biblical foundations to all ages." },
  { name: "Hospitality", icon: FaHeart, desc: "Welcoming all with the love and warmth of Christ." },
  { name: "Prayer", icon: FaPray, desc: "Intercessory prayer warriors standing in the gap." },
  { name: "Music", icon: FaMusic, desc: "Lifting high the name of Jesus through worship." },
  { name: "Youth", icon: FaUsers, desc: "Raising the next generation of kingdom leaders." },
  { name: "Doorkeeper", icon: FaDoorOpen, desc: "Faithful servants maintaining order and security." },
  { name: "Media Communications", icon: FaCamera, desc: "Spreading the Gospel through digital outreach." },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [pastorMessage, setPastorMessage] = useState("");
  const [bannerText, setBannerText] = useState("");
  const [bannerActive, setBannerActive] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setHeroTitle(data.hero_title || "");
          setHeroSubtitle(data.hero_subtitle || "");
          setPastorMessage(data.pastor_message || "");
          setBannerText(data.announcement_banner || "");
          setBannerActive(data.announcement_banner_active ?? false);
        }
        setSettingsLoaded(true);
      });
  }, []);

  return (
    <>
      <Header />

      <main>
        {/* Announcement banner */}
        {settingsLoaded && bannerActive && bannerText && (
          <div className="bg-gold-500 py-3 px-4 text-center">
            <p className="text-navy-900 text-sm font-semibold">{bannerText}</p>
          </div>
        )}

        {/* ===== 1. HERO SECTION ===== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900">
          <div className="absolute inset-0">
            <img
              src="/images/GMBC_logo.jpg"
              alt=""
              className="h-full w-full object-cover opacity-15 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/70 to-navy-900" />
          </div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 mb-6">
                Welcome to Grace Missionary Baptist Church
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
            >
              {heroTitle || "Embracing Faith,"}
              {heroTitle && <br />}
              {!heroTitle && <><br /><span className="text-gold-400">Compassion &amp; Togetherness</span></>}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mt-6 mx-auto max-w-3xl text-base md:text-lg lg:text-xl text-white/70 font-sans leading-relaxed"
            >
              {heroSubtitle || "A fellowship-driven church focused on worship, prayer, biblical teaching, and community impact."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="group relative overflow-hidden rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-navy-900 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/30"
              >
                <span className="relative z-10">Visit Us</span>
                <span className="absolute inset-0 bg-gold-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/sermons"
                className="rounded-full border border-white/25 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40"
              >
                Watch Sermons
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg
                className="h-6 w-6 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== 2. SERVICE TIMES SECTION ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Join Us
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  Worship With Us
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-4 text-base md:text-lg text-navy-500 max-w-2xl mx-auto">
                  We look forward to welcoming you into the presence of the Lord.
                </p>
              </motion.div>
            </div>
            <ServiceTimes />
          </div>
        </SectionWrapper>

        {/* ===== 3. UPCOMING EVENTS ===== */}
        <UpcomingEvents />

        {/* ===== 4. OUR STORY SECTION ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-gradient-to-br from-cream via-white to-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Our Story
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  A Fellowship Built on Faith
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-6 text-base leading-relaxed text-navy-600">
                  Grace Missionary Baptist Church is a fellowship-driven church
                  based on rich biblical values, spiritual growth, worship,
                  prayer, and community impact.
                </p>
                <p className="mt-4 text-base leading-relaxed text-navy-600">
                  From our earliest days, we have been committed to creating a
                  warm, welcoming environment where every individual can
                  encounter God, grow in their faith, and discover their divine
                  purpose.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gold-50 border border-gold-200/50 px-4 py-3">
                    <CrossIcon className="h-5 w-5 text-gold-600 shrink-0" />
                    <span className="text-sm font-medium text-navy-700">Founded on Scripture</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gold-50 border border-gold-200/50 px-4 py-3">
                    <FaHeart className="h-5 w-5 text-gold-600 shrink-0" />
                    <span className="text-sm font-medium text-navy-700">Rooted in Love</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="/images/PASTOR_logo.jpg"
                    alt="GMBC Church Gathering"
                    className="w-full h-[450px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gold-500/20 rounded-full blur-2xl" />
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 5. WE BELIEVE SECTION ===== */}
        <SectionWrapper className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-navy-800" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeUp}>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Our Belief
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
                What We Believe
              </h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10 relative"
            >
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12">
                <CrossIcon className="absolute top-4 right-4 h-8 w-8 text-gold-500/20" />
                <CrossIcon className="absolute bottom-4 left-4 h-8 w-8 text-gold-500/20" />
                <span className="font-serif text-6xl text-gold-500/20 leading-none block -mb-8 text-left">
                  &ldquo;
                </span>
                <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light italic leading-relaxed text-white/90 px-4 md:px-12">
                  We believe in the Father, the Son, and the Holy Spirit, and we
                  are committed to spreading the Gospel through love and service.
                </p>
                <span className="font-serif text-6xl text-gold-500/20 leading-none block -mt-6 text-right">
                  &rdquo;
                </span>
                <div className="mt-6 flex justify-center gap-6 flex-wrap">
                  <span className="text-sm text-gold-300 border border-gold-500/20 bg-gold-500/10 rounded-full px-4 py-1.5">
                    The Father
                  </span>
                  <span className="text-sm text-gold-300 border border-gold-500/20 bg-gold-500/10 rounded-full px-4 py-1.5">
                    The Son
                  </span>
                  <span className="text-sm text-gold-300 border border-gold-500/20 bg-gold-500/10 rounded-full px-4 py-1.5">
                    The Holy Spirit
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ===== 6. SCRIPTURE HIGHLIGHT ===== */}
        <ScriptureBanner />

        {/* ===== 7. ANNOUNCEMENTS ===== */}
        <Announcements />

        {/* ===== 8. THE POWER OF TOGETHERNESS ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Together in Faith
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  The Power of Togetherness in Faith
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Sunday Worship",
                  time: "9:00 AM – 11:30 AM",
                  desc: "Experience the presence of God through powerful worship and biblical preaching.",
                  icon: FaChurch,
                },
                {
                  title: "Prayer Meetings",
                  time: "Wednesdays, 5:30 PM",
                  desc: "Join together in prayer, interceding for our church, community, and world.",
                  icon: FaPray,
                },
                {
                  title: "Bible Study",
                  time: "Thursdays, 5:00 PM",
                  desc: "Dive deep into God's Word with verse-by-verse teaching and discussion.",
                  icon: FaBible,
                },
                {
                  title: "Monthly Vigil",
                  time: "Last Friday, 12 Midnight",
                  desc: "A powerful night of prayer, worship, and seeking God's face together.",
                  icon: CrossIcon,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-xl bg-gradient-to-b from-cream to-white border border-navy-100/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 hover:border-gold-300 hover:-translate-y-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-100 text-gold-600 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold-500/25">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold text-navy-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-gold-600">
                    {item.time}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div {...fadeUp} className="mt-12 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-gold-500 hover:text-navy-900 hover:shadow-xl hover:shadow-gold-500/25"
              >
                Join Us This Week
                <span aria-hidden="true" className="text-lg">&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ===== 9. GIVING & DONATIONS ===== */}
        <SectionWrapper className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Giving
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
                  Support the Ministry
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-4 text-base md:text-lg text-white/60 max-w-2xl mx-auto">
                  Your generous giving helps us spread the Gospel and serve our community.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-lg mx-auto"
            >
              <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 transition-all duration-300 hover:bg-white/[0.07] hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 group-hover:bg-gold-500/30 transition-colors">
                    <FaHandHoldingHeart className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-center font-serif text-xl font-bold text-white mb-6">
                  Bank Transfer
                </h3>
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <p className="text-xs font-medium uppercase tracking-wider text-gold-400/70">
                      Bank
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      Polaris Bank
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <p className="text-xs font-medium uppercase tracking-wider text-gold-400/70">
                      Account Number
                    </p>
                    <p className="mt-1 text-lg font-bold tracking-wider text-white font-mono">
                      1140235436
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
                    <p className="text-xs font-medium uppercase tracking-wider text-gold-400/70">
                      Account Name
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">
                      Association of Grace Missionary Baptist
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* ===== 10. MINISTRIES GRID ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Our Ministries
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  Serving God, Serving Others
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-4 text-base md:text-lg text-navy-500 max-w-2xl mx-auto">
                  Every member is a minister. Discover a place to serve and grow.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ministries.map((ministry, i) => (
                <motion.div
                  key={ministry.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group rounded-2xl bg-white border border-navy-100/50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 hover:border-gold-300 hover:-translate-y-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-100 text-gold-600 transition-all duration-300 group-hover:bg-gold-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold-500/25">
                    <ministry.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold text-navy-800">
                    {ministry.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-500">
                    {ministry.desc}
                  </p>
                  <div className="mt-4 pt-4 border-t border-navy-100/50">
                    <Link
                      href="/ministries"
                      className="text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors inline-flex items-center gap-1"
                    >
                      Learn more
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 11. PASTOR WELCOME ===== */}
        <SectionWrapper className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-cream" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-200/30 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-2"
              >
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src="/images/PASTOR_logo.jpg"
                      alt="Pastor Ayorinde Gabriel"
                      className="w-full h-[400px] md:h-[480px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="font-serif text-xl font-bold text-white">
                        Pastor Ayorinde Gabriel
                      </p>
                      <p className="text-sm text-gold-300">Lead Pastor, GMBC</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gold-500/20 rounded-full blur-3xl" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-3"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Pastor&apos;s Welcome
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  A Warm Welcome to You
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                {pastorMessage ? (
                  <div className="mt-6 text-base leading-relaxed text-navy-600 space-y-4 whitespace-pre-line">
                    {pastorMessage}
                  </div>
                ) : (
                  <>
                    <p className="mt-6 text-base leading-relaxed text-navy-600">
                      Dear friends and family,
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-navy-600">
                      It is with great joy that I welcome you to Grace Missionary
                      Baptist Church. Whether you are searching for a spiritual home,
                      exploring faith for the first time, or looking to deepen your
                      walk with Christ, you are welcome here.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-navy-600">
                      At GMBC, we are more than a church &mdash; we are a family. A family
                      rooted in faith, strengthened by love, and united in our mission
                      to share the hope of Jesus Christ with our community and the world.
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-navy-600">
                      I look forward to meeting you and walking this journey of faith
                      together. May the Lord richly bless you.
                    </p>
                  </>
                )}
                <p className="mt-6 font-serif text-lg font-semibold text-navy-800">
                  In Christ&apos;s service,
                </p>
                <p className="font-serif text-base text-gold-600">
                  Pastor Ayorinde Gabriel
                </p>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 12. CONTACT CTA ===== */}
        <SectionWrapper className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-500" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.div {...fadeUp}>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-900/60">
                Get in Touch
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mt-3">
                We&apos;d Love to Connect With You
              </h2>
              <p className="mt-4 text-base md:text-lg text-navy-800/80 max-w-2xl mx-auto">
                Whether you have a question, need prayer, or want to learn more
                about GMBC, we are here for you.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-navy-900 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-navy-900 hover:shadow-xl"
                >
                  Contact Us
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border-2 border-navy-900/30 bg-white/20 px-8 py-3.5 font-semibold text-navy-900 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
                >
                  Prayer Request
                </Link>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
