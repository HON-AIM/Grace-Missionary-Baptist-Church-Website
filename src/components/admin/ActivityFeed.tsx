"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineSpeakerphone,
  HiOutlineBookOpen,
  HiOutlinePhotograph,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";

interface Activity {
  id: string;
  type: "announcement" | "sermon" | "gallery" | "event";
  title: string;
  created_at: string;
}

const iconMap = {
  announcement: HiOutlineSpeakerphone,
  sermon: HiOutlineBookOpen,
  gallery: HiOutlinePhotograph,
  event: HiOutlineCalendar,
};

const colorMap = {
  announcement: "bg-gold-500/10 text-gold-500",
  sermon: "bg-blue-500/10 text-blue-400",
  gallery: "bg-emerald-500/10 text-emerald-400",
  event: "bg-purple-500/10 text-purple-400",
};

const labelMap = {
  announcement: "Announcement",
  sermon: "Sermon",
  gallery: "Photo Upload",
  event: "Event",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const supabase = createClient();

      const [announcements, sermons, gallery, events] = await Promise.all([
        supabase.from("announcements").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("sermons").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("gallery").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("events").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      const all: Activity[] = [
        ...(announcements.data || []).map((a) => ({ ...a, type: "announcement" as const })),
        ...(sermons.data || []).map((s) => ({ ...s, type: "sermon" as const })),
        ...(gallery.data || []).map((g) => ({ ...g, type: "gallery" as const })),
        ...(events.data || []).map((e) => ({ ...e, type: "event" as const })),
      ];

      all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setActivities(all.slice(0, 8));
      setLoading(false);
    }
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-28 bg-navy-700 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-navy-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-navy-700/50 flex items-center gap-2.5">
        <HiOutlineClock className="w-5 h-5 text-gold-500" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      <div className="divide-y divide-navy-700/30">
        {activities.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-navy-500 text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, i) => {
            const Icon = iconMap[activity.type];
            return (
              <motion.div
                key={`${activity.type}-${activity.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-navy-700/30 transition-colors"
              >
                <div className={`p-2 rounded-lg shrink-0 ${colorMap[activity.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{activity.title}</p>
                  <p className="text-navy-500 text-xs">{labelMap[activity.type]}</p>
                </div>
                <span className="text-navy-500 text-xs shrink-0">
                  {timeAgo(activity.created_at)}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
