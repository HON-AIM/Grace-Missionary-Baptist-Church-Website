"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiOutlineSpeakerphone,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlinePhotograph,
  HiOutlineTemplate,
  HiOutlineArrowRight,
} from "react-icons/hi";

const actions = [
  {
    href: "/admin/announcements/new",
    label: "New Announcement",
    description: "Share church news",
    icon: HiOutlineSpeakerphone,
    color: "gold",
  },
  {
    href: "/admin/sermons/new",
    label: "New Sermon",
    description: "Upload a message",
    icon: HiOutlineBookOpen,
    color: "blue",
  },
  {
    href: "/admin/events/new",
    label: "New Event",
    description: "Create an event",
    icon: HiOutlineCalendar,
    color: "purple",
  },
  {
    href: "/admin/gallery",
    label: "Upload Photo",
    description: "Add to gallery",
    icon: HiOutlinePhotograph,
    color: "green",
  },
  {
    href: "/admin/homepage",
    label: "Edit Homepage",
    description: "Update content",
    icon: HiOutlineTemplate,
    color: "gold",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  gold: {
    bg: "bg-gold-500/10",
    text: "text-gold-500",
    border: "border-gold-500/20",
    hover: "hover:bg-gold-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    hover: "hover:bg-blue-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    hover: "hover:bg-purple-500/20",
  },
  green: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    hover: "hover:bg-emerald-500/20",
  },
};

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-navy-800 border border-navy-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const c = colorMap[action.color];
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={action.href}
                className={`flex items-center gap-3 p-4 rounded-xl border ${c.border} ${c.bg} ${c.hover} transition-all duration-200 group`}
              >
                <div className={`p-2 rounded-lg ${c.bg}`}>
                  <action.icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{action.label}</p>
                  <p className="text-navy-500 text-xs">{action.description}</p>
                </div>
                <HiOutlineArrowRight
                  className={`w-4 h-4 ${c.text} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200`}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
