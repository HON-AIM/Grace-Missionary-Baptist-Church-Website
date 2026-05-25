"use client";

import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: number;
  icon: IconType;
  color: "gold" | "blue" | "green" | "purple";
  href?: string;
  subtitle?: string;
  index?: number;
}

const colorMap: Record<string, { bg: string; text: string; border: string; bar: string; gradient: string }> = {
  gold: {
    bg: "bg-gold-500/10",
    text: "text-gold-500",
    border: "border-gold-500/20",
    bar: "bg-gold-500",
    gradient: "from-gold-500/5",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    bar: "bg-blue-500",
    gradient: "from-blue-500/5",
  },
  green: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    bar: "bg-emerald-500",
    gradient: "from-emerald-500/5",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    bar: "bg-purple-500",
    gradient: "from-purple-500/5",
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  subtitle,
  index = 0,
}: StatsCardProps) {
  const c = colorMap[color];

  const content = (
    <div
      className={`block bg-navy-800 border ${c.border} rounded-xl p-6 ${href ? "cursor-pointer" : ""} hover:shadow-xl hover:shadow-navy-900/50 hover:border-opacity-60 transition-all duration-300 relative overflow-hidden group`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${c.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-navy-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-1.5 tabular-nums">
              {value.toLocaleString()}
            </p>
            {subtitle && (
              <p className="text-navy-500 text-xs mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${c.bg} ${href ? "group-hover:scale-110" : ""} transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${c.text}`} />
          </div>
        </div>

        <div className="mt-4 h-1 w-full bg-navy-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${c.bar}`}
          />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
      >
        <Link href={href}>{content}</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      {content}
    </motion.div>
  );
}
