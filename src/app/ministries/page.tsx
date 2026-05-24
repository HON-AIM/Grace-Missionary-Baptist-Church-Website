"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import { FaBible, FaChurch, FaHeart, FaPray, FaMusic, FaUsers, FaDoorOpen, FaCamera, FaHandHoldingHeart, FaChild } from "react-icons/fa";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ministries = [
  {
    name: "Bible Study",
    icon: FaBible,
    color: "from-blue-500 to-indigo-600",
    desc: "Our Bible Study ministry provides in-depth teaching of God's Word, helping believers grow in their knowledge and understanding of Scripture. We explore the Bible verse by verse, precept upon precept.",
    schedule: "Thursdays, 5:00 PM – 7:00 PM",
  },
  {
    name: "Church School",
    icon: FaChurch,
    color: "from-emerald-500 to-teal-600",
    desc: "Church School is designed to teach biblical foundations to members of all ages. From children to adults, we provide age-appropriate lessons that build a strong spiritual foundation.",
    schedule: "Sundays, 8:00 AM – 9:00 AM",
  },
  {
    name: "Hospitality",
    icon: FaHeart,
    color: "from-rose-500 to-pink-600",
    desc: "The Hospitality ministry ensures that everyone who walks through our doors feels the warmth and love of Christ. We serve with joy, making every guest feel at home.",
    schedule: "Every Sunday & Special Events",
  },
  {
    name: "Prayer",
    icon: FaPray,
    color: "from-purple-500 to-violet-600",
    desc: "The Prayer ministry is the backbone of our church. We gather to intercede for the church, the community, and the nations. Prayer changes things, and we believe in its power.",
    schedule: "Wednesdays, 5:30 PM – 7:00 PM",
  },
  {
    name: "Music",
    icon: FaMusic,
    color: "from-amber-500 to-orange-600",
    desc: "The Music ministry leads the congregation into the presence of God through spirit-filled worship. From the choir to the band, every note is offered as a sacrifice of praise.",
    schedule: "Rehearsals: Saturdays, 3:00 PM",
  },
  {
    name: "Youth",
    icon: FaUsers,
    color: "from-cyan-500 to-blue-600",
    desc: "The Youth ministry is dedicated to raising the next generation of kingdom leaders. Through engaging activities, mentorship, and biblical teaching, we equip young people for their God-given purpose.",
    schedule: "Fridays, 5:00 PM – 7:00 PM",
  },
  {
    name: "Doorkeeper",
    icon: FaDoorOpen,
    color: "from-slate-500 to-gray-600",
    desc: "The Doorkeeper ministry serves with diligence and dedication, ensuring order, safety, and a welcoming atmosphere during all church services and events.",
    schedule: "During all services",
  },
  {
    name: "Media Communications",
    icon: FaCamera,
    color: "from-red-500 to-rose-600",
    desc: "The Media ministry spreads the Gospel beyond our walls through digital platforms, live streaming, social media, and creative content production.",
    schedule: "Ongoing",
  },
];

export default function MinistriesPage() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Our Ministries
              </span>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Serving God, Serving Others
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                Every member is a minister. Discover where God is calling you to serve.
              </p>
            </motion.div>
          </div>
        </section>

        {/* MINISTRIES GRID */}
        <SectionWrapper className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ministries.map((ministry, i) => (
                <motion.div
                  key={ministry.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-2xl bg-white border border-navy-100/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`bg-gradient-to-r ${ministry.color} p-6`}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                        <ministry.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        {ministry.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-relaxed text-navy-600">
                      {ministry.desc}
                    </p>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-gold-50 px-3 py-2">
                      <svg className="h-4 w-4 text-gold-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium text-gold-700">
                        {ministry.schedule}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* GET INVOLVED */}
        <SectionWrapper className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div {...fadeUp}>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Get Involved
                </span>
                <h2 className="section-title mt-3">Find Your Place to Serve</h2>
                <div className="gold-accent mt-4" />
                <p className="mt-6 text-base leading-relaxed text-navy-600">
                  At GMBC, we believe that every believer has been given gifts to
                  serve the body of Christ. Whether you are passionate about
                  teaching, music, prayer, or hospitality, there is a place for you.
                </p>
                <p className="mt-4 text-base leading-relaxed text-navy-600">
                  Ministry is not just about what you do on Sunday — it is about
                  living a life of service every day. Join a ministry team and
                  discover the joy of serving God alongside your church family.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-500 hover:text-navy-900"
                >
                  I Want to Serve
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: FaHandHoldingHeart, label: "Serve" },
                  { icon: FaPray, label: "Pray" },
                  { icon: FaMusic, label: "Worship" },
                  { icon: FaChild, label: "Teach" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="group rounded-xl bg-cream border border-navy-100/50 p-6 text-center transition-all duration-300 hover:border-gold-300 hover:shadow-lg"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition-colors group-hover:bg-gold-500 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-3 font-serif text-sm font-bold text-navy-800">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </SectionWrapper>

        {/* CTA */}
        <SectionWrapper className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-800">
                Have Questions About a Ministry?
              </h2>
              <p className="mt-4 text-lg text-navy-500">
                We would love to help you find your place in the body of Christ.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 font-semibold text-navy-900 transition-all duration-300 hover:bg-gold-400 hover:shadow-xl hover:shadow-gold-500/25"
              >
                Contact Us
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
