"use client";

import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineSparkles } from "react-icons/hi";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface WelcomeCardProps {
  name: string;
  index?: number;
}

export default function WelcomeCard({ name, index = 0 }: WelcomeCardProps) {
  const displayName = name ? name.split("@")[0] : "Admin";
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700/50 rounded-2xl p-6 lg:p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 shrink-0">
            <HiOutlineUser className="w-7 h-7 text-navy-900" />
          </div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl font-serif font-bold text-white"
            >
              {greeting}, {displayName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-navy-400 text-sm mt-1"
            >
              Welcome to the Grace Missionary Baptist Church admin panel
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-xl"
        >
          <HiOutlineSparkles className="w-4 h-4 text-gold-500" />
          <span className="text-gold-400 text-sm font-medium">Admin Dashboard</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
