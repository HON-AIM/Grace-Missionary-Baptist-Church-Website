"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { ChurchEvent } from "@/lib/types";

export default function UpcomingEvents() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setEvents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (events.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-cream via-white to-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Don&apos;t Miss
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 mt-3">
              Upcoming Events
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-500" />
            <p className="mt-4 text-base md:text-lg text-navy-500 max-w-2xl mx-auto">
              Join us for our upcoming gatherings and special services.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl bg-white border border-navy-100/50 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 hover:-translate-y-2"
            >
              {event.flyer && (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.flyer}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
                <div className="mt-4 space-y-1.5 text-xs text-navy-500">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                    {formatDate(event.date)}
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <FaClock className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {event.time}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full bg-navy-800 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-gold-500 hover:text-navy-900 hover:shadow-xl hover:shadow-gold-500/25"
          >
            View All Events
            <span aria-hidden="true" className="text-lg">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
