"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { ChurchEvent } from "@/lib/types";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function EventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data);
        setLoading(false);
      });
  }, []);

  const isUpcoming = (date: string) =>
    new Date(date) >= new Date(new Date().toDateString());

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
                Events
              </span>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Gather With Us
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                Join us for worship, fellowship, and community events.
              </p>
            </motion.div>
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <SectionWrapper className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-400 text-lg">No upcoming events at this time.</p>
                <p className="text-navy-500 text-sm mt-2">Check back soon for new events.</p>
              </div>
            ) : (
              <>
                {/* Upcoming events */}
                {events.filter((e) => isUpcoming(e.date)).length > 0 && (
                  <div className="mb-16">
                    <div className="text-center mb-12">
                      <motion.div {...fadeUp}>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                          Coming Up
                        </span>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
                          Upcoming Events
                        </h2>
                        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events
                        .filter((e) => isUpcoming(e.date))
                        .slice(0, 6)
                        .map((event, i) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group rounded-xl bg-gradient-to-b from-cream to-white border border-navy-100/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                          >
                            {event.flyer && (
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={event.flyer}
                                  alt={event.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="p-5">
                              <h3 className="font-serif text-lg font-bold text-navy-800 group-hover:text-gold-600 transition-colors">
                                {event.title}
                              </h3>
                              {event.description && (
                                <p className="mt-2 text-sm text-navy-500 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                              <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-navy-500">
                                  <FaCalendar className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                                  {formatDate(event.date)}
                                </div>
                                {event.time && (
                                  <div className="flex items-center gap-2 text-navy-500">
                                    <FaClock className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                                    {event.time}
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center gap-2 text-navy-500">
                                    <FaMapMarkerAlt className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                                    {event.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Past events */}
                {events.filter((e) => !isUpcoming(e.date)).length > 0 && (
                  <div>
                    <div className="text-center mb-12">
                      <motion.div {...fadeUp}>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">
                          Past Events
                        </span>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-600 mt-2">
                          Previous Gatherings
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-navy-300" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events
                        .filter((e) => !isUpcoming(e.date))
                        .map((event, i) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="group rounded-xl bg-white border border-navy-100/50 overflow-hidden shadow opacity-70 hover:opacity-100 transition-opacity"
                          >
                            {event.flyer && (
                              <div className="relative h-40 overflow-hidden">
                                <img
                                  src={event.flyer}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-serif font-bold text-navy-700">
                                {event.title}
                              </h3>
                              <div className="mt-2 flex items-center gap-2 text-xs text-navy-400">
                                <FaCalendar className="h-3 w-3" />
                                {formatDate(event.date)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
