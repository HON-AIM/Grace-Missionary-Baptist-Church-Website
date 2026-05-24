"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import ScriptureBanner from "@/components/ScriptureBanner";
import { FaHeart, FaCross, FaChurch, FaPray, FaBible, FaHandHoldingHeart } from "react-icons/fa";

const CrossIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v20M2 12h20" />
  </svg>
);

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const beliefs = [
  { title: "The Father", icon: FaHeart, desc: "We believe in God the Father Almighty, Creator of heaven and earth, whose love endures forever." },
  { title: "The Son", icon: CrossIcon, desc: "We believe in Jesus Christ, His only Son our Lord, who died for our sins and rose again for our salvation." },
  { title: "The Holy Spirit", icon: FaPray, desc: "We believe in the Holy Spirit, the Comforter, who guides, empowers, and transforms us into the likeness of Christ." },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        {/* ===== 1. HERO BANNER ===== */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-navy-900">
          <div className="absolute inset-0">
            <img
              src="/images/GMBC_logo.jpg"
              alt=""
              className="h-full w-full object-cover opacity-10 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/70 to-navy-900" />
          </div>
          <div className="absolute inset-0">
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 mb-6">
                About Us
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                About Grace Missionary
                <br />
                <span className="text-gold-400">Baptist Church</span>
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-sans">
                Discovering faith, building community, and sharing the love of Christ
                since our foundation.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <svg className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== 2. CHURCH STORY ===== */}
        <SectionWrapper className="py-20 md:py-28">
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
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3 leading-tight">
                  A Fellowship Built on
                  <span className="text-gold-600"> Faith &amp; Love</span>
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-6 text-base leading-relaxed text-navy-600">
                  Grace Missionary Baptist Church is a fellowship-driven church
                  based on strong biblical values, spiritual growth, worship,
                  prayer, and community outreach.
                </p>
                <p className="mt-4 text-base leading-relaxed text-navy-600">
                  Since our founding, we have been devoted to creating a place
                  where every soul matters — a sanctuary where the Word of God
                  is preached with clarity, worship is offered in spirit and
                  truth, and the love of Christ is demonstrated through
                  compassionate service.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full bg-gold-100 border border-gold-200/50 px-4 py-2 text-xs font-semibold text-gold-700">
                    Founded in Faith
                  </span>
                  <span className="rounded-full bg-gold-100 border border-gold-200/50 px-4 py-2 text-xs font-semibold text-gold-700">
                    Rooted in Scripture
                  </span>
                  <span className="rounded-full bg-gold-100 border border-gold-200/50 px-4 py-2 text-xs font-semibold text-gold-700">
                    Driven by Love
                  </span>
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
                    alt="Grace Missionary Baptist Church"
                    className="w-full h-[460px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3">
                      <FaChurch className="h-5 w-5 text-gold-400" />
                      <span className="font-serif text-sm text-white/80">GMBC — Where Faith Meets Community</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 3. MISSION STATEMENT ===== */}
        <SectionWrapper className="relative py-20 md:py-28 overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Our Purpose
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                  Mission &amp; Vision
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative overflow-hidden rounded-2xl border border-navy-100/50 bg-gradient-to-br from-cream to-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gold-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-100/50 rounded-bl-full" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-100 text-gold-600 mb-6">
                    <FaHeart className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-navy-800">Our Mission</h3>
                  <p className="mt-4 text-base leading-relaxed text-navy-600">
                    To lead people into a growing relationship with Jesus Christ
                    by creating a welcoming environment for worship, teaching
                    the Word of God with clarity and relevance, and
                    demonstrating His love through compassionate service to our
                    community and beyond.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-navy-100/50 bg-gradient-to-br from-cream to-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gold-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-100/50 rounded-bl-full" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-100 text-gold-600 mb-6">
                    <FaChurch className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-navy-800">Our Vision</h3>
                  <p className="mt-4 text-base leading-relaxed text-navy-600">
                    A vibrant, Spirit-filled church where every individual
                    encounters God&apos;s love, grows in their faith, discovers
                    their God-given purpose, and is equipped to make a lasting
                    impact in their family, community, and the world.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 4. BELIEFS ===== */}
        <SectionWrapper className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-navy-800" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-gold-500 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                  What We Believe
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
                  Our Faith
                </h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 text-center">
                <span className="font-serif text-6xl text-gold-500/20 leading-none block -mb-10 text-left">
                  &ldquo;
                </span>
                <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light italic leading-relaxed text-white/90 px-4 md:px-8">
                  We believe in the Father, the Son, and the Holy Spirit, and we
                  are committed to spreading the Gospel through love and
                  service.
                </p>
                <span className="font-serif text-6xl text-gold-500/20 leading-none block -mt-6 text-right">
                  &rdquo;
                </span>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <span className="rounded-full bg-gold-500/10 border border-gold-500/20 px-4 py-1.5 text-sm text-gold-300">
                    The Father
                  </span>
                  <span className="rounded-full bg-gold-500/10 border border-gold-500/20 px-4 py-1.5 text-sm text-gold-300">
                    The Son
                  </span>
                  <span className="rounded-full bg-gold-500/10 border border-gold-500/20 px-4 py-1.5 text-sm text-gold-300">
                    The Holy Spirit
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {beliefs.map((belief, i) => (
                <motion.div
                  key={belief.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all duration-300 hover:bg-white/[0.06] hover:border-gold-500/30 hover:-translate-y-1"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                    <belief.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-white">
                    {belief.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {belief.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 5. PASTOR SECTION ===== */}
        <SectionWrapper className="py-20 md:py-28 bg-gradient-to-br from-cream via-white to-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src="/images/PASTOR_logo.jpg"
                    alt="Pastor Ayorinde Gabriel"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="font-serif text-xl font-bold text-white">
                      Pastor Ayorinde Gabriel
                    </p>
                    <p className="text-sm text-gold-300">Lead Pastor, GMBC</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gold-500/20 rounded-full blur-3xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Pastoral Leadership
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3 leading-tight">
                  A Heart for God,
                  <br />
                  <span className="text-gold-600">A Heart for People</span>
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-gold-500" />
                <p className="mt-6 text-base leading-relaxed text-navy-600">
                  Pastor Ayorinde Gabriel is the lead pastor of Grace Missionary
                  Baptist Church. With a deep passion for the Word of God and an
                  unwavering love for people, he has devoted his life to
                  teaching, preaching, and shepherding the flock of Christ.
                </p>
                <p className="mt-4 text-base leading-relaxed text-navy-600">
                  His ministry is characterized by a steadfast commitment to
                  sound biblical doctrine, a vibrant prayer life, and a heart
                  for raising up the next generation of leaders for the Kingdom.
                  Under his leadership, GMBC continues to flourish as a beacon
                  of hope, faith, and love in the community.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gold-50 border border-gold-200/50 px-4 py-3">
                    <FaBible className="h-5 w-5 text-gold-600 shrink-0" />
                    <span className="text-sm font-medium text-navy-700">Sound Biblical Teaching</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gold-50 border border-gold-200/50 px-4 py-3">
                    <FaHandHoldingHeart className="h-5 w-5 text-gold-600 shrink-0" />
                    <span className="text-sm font-medium text-navy-700">Compassionate Leadership</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-500 hover:text-navy-900"
                >
                  Contact Pastor
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* ===== 6. SCRIPTURE SECTION ===== */}
        <ScriptureBanner />

        {/* CTA */}
        <SectionWrapper className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800">
                Join Our Church Family
              </h2>
              <p className="mt-4 text-lg text-navy-500">
                We would love to welcome you. Come and experience the love of Christ at GMBC.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-navy-900 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25"
                >
                  Plan Your Visit
                </Link>
                <Link
                  href="/ministries"
                  className="rounded-full border border-navy-300 px-8 py-3.5 font-semibold text-navy-700 transition-all duration-300 hover:border-gold-500 hover:text-gold-600"
                >
                  Explore Ministries
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
