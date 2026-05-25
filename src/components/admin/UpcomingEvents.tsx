"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("id, title, date, time, location")
        .gte("date", new Date().toISOString().split("T")[0])
        .eq("is_published", true)
        .order("date", { ascending: true })
        .limit(5);

      if (data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 bg-navy-700 rounded" />
          <div className="h-16 bg-navy-700 rounded-lg" />
          <div className="h-16 bg-navy-700 rounded-lg" />
          <div className="h-16 bg-navy-700 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-navy-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HiOutlineCalendar className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
        </div>
        <Link
          href="/admin/events"
          className="text-xs text-gold-500/80 hover:text-gold-400 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-navy-700/30">
        {events.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-navy-500 text-sm">No upcoming events</p>
          </div>
        ) : (
          events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 hover:bg-navy-700/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-center shrink-0 w-12">
                  <div className="text-xs text-navy-400 uppercase">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium border bg-gold-500/10 text-gold-500 border-gold-500/20">
                      Event
                    </span>
                  </div>
                  <p className="text-white font-medium text-sm truncate">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-navy-400 text-xs">
                    {event.time && <span>{event.time}</span>}
                    {event.location && (
                      <span className="flex items-center gap-1 truncate">
                        <HiOutlineLocationMarker className="w-3.5 h-3.5 shrink-0" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
