"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineSpeakerphone,
  HiOutlineBookOpen,
  HiOutlinePhotograph,
  HiOutlineCalendar,
} from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import WelcomeCard from "@/components/admin/WelcomeCard";
import StatsCard from "@/components/admin/StatsCard";
import SearchBar from "@/components/admin/SearchBar";
import UpcomingEvents from "@/components/admin/UpcomingEvents";
import RecentUploads from "@/components/admin/RecentUploads";
import QuickActions from "@/components/admin/QuickActions";
import ActivityFeed from "@/components/admin/ActivityFeed";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    totalSermons: 0,
    totalGallery: 0,
    totalEvents: 0,
    publishedAnnouncements: 0,
    publishedSermons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [
        { count: announcements },
        { count: sermons },
        { count: gallery },
        { count: events },
        { count: publishedAnn },
        { count: publishedSer },
      ] = await Promise.all([
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        supabase.from("sermons").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("sermons").select("*", { count: "exact", head: true }).eq("is_published", true),
      ]);

      setStats({
        totalAnnouncements: announcements ?? 0,
        totalSermons: sermons ?? 0,
        totalGallery: gallery ?? 0,
        totalEvents: events ?? 0,
        publishedAnnouncements: publishedAnn ?? 0,
        publishedSermons: publishedSer ?? 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-navy-800 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-navy-800 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-navy-800 rounded-xl" />
          <div className="h-64 bg-navy-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeCard name={user?.email || "Admin"} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center gap-4"
      >
        <div className="flex-1">
          <p className="text-navy-400 text-sm">
            {stats.publishedAnnouncements} published announcements &middot;{" "}
            {stats.publishedSermons} published sermons
          </p>
        </div>
        <SearchBar />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Announcements"
          value={stats.totalAnnouncements}
          icon={HiOutlineSpeakerphone}
          color="gold"
          href="/admin/announcements"
          subtitle={stats.publishedAnnouncements > 0 ? `${stats.publishedAnnouncements} published` : "No announcements"}
          index={0}
        />
        <StatsCard
          title="Sermons"
          value={stats.totalSermons}
          icon={HiOutlineBookOpen}
          color="blue"
          href="/admin/sermons"
          subtitle={stats.publishedSermons > 0 ? `${stats.publishedSermons} published` : "No sermons"}
          index={1}
        />
        <StatsCard
          title="Gallery Images"
          value={stats.totalGallery}
          icon={HiOutlinePhotograph}
          color="green"
          href="/admin/gallery"
          subtitle={`${stats.totalGallery} total images`}
          index={2}
        />
        <StatsCard
          title="Events"
          value={stats.totalEvents}
          icon={HiOutlineCalendar}
          color="purple"
          href="/admin/events"
          subtitle={`${stats.totalEvents} total events`}
          index={3}
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEvents />
        <ActivityFeed />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecentUploads />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-navy-800 border border-navy-700/50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Content Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Announcements",
                total: stats.totalAnnouncements,
                published: stats.publishedAnnouncements,
                color: "gold",
              },
              {
                label: "Sermons",
                total: stats.totalSermons,
                published: stats.publishedSermons,
                color: "blue",
              },
            ].map((item) => {
              const publishedPct = item.total > 0 ? Math.round((item.published / item.total) * 100) : 0;
              const barColor =
                item.color === "gold" ? "bg-gold-500" : "bg-blue-500";
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-navy-400 text-sm">{item.label}</span>
                    <span className="text-navy-400 text-sm">
                      {item.published}/{item.total}
                    </span>
                  </div>
                  <div className="h-2 bg-navy-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${publishedPct}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                  <p className="text-navy-500 text-xs mt-1">
                    {publishedPct}% published
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
