"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineSpeakerphone,
  HiOutlineBookOpen,
  HiOutlinePhotograph,
  HiOutlineCalendar,
  HiOutlineTemplate,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineMenu,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
  { href: "/admin/announcements", label: "Announcements", icon: HiOutlineSpeakerphone },
  { href: "/admin/sermons", label: "Sermons", icon: HiOutlineBookOpen },
  { href: "/admin/gallery", label: "Gallery", icon: HiOutlinePhotograph },
  { href: "/admin/events", label: "Events", icon: HiOutlineCalendar },
  { href: "/admin/homepage", label: "Homepage", icon: HiOutlineTemplate },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-navy-700/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <span className="text-navy-900 font-serif font-bold text-lg">G</span>
          </div>
          <div>
            <h2 className="text-white font-serif font-bold text-lg">GMBC</h2>
            <p className="text-navy-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold-500/10 text-gold-500 border border-gold-500/20"
                  : "text-navy-300 hover:text-white hover:bg-navy-800/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-500"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-700/50 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
              <HiOutlineUserCircle className="w-5 h-5 text-navy-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-navy-300 text-sm truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-navy-400 hover:text-red-400 hover:bg-red-500/5 w-full transition-all duration-200"
        >
          <HiOutlineLogout className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy-800 text-gold-500 rounded-lg shadow-lg hover:bg-navy-700 transition-colors"
        aria-label="Open sidebar"
      >
        <HiOutlineMenu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col w-72 h-screen bg-navy-900 border-r border-navy-700/50 sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 z-50 h-screen w-72 bg-navy-900 border-r border-navy-700/50 flex flex-col shadow-2xl"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-navy-300 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
