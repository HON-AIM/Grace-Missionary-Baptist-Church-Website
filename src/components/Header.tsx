"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-navy-900/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 md:h-12 md:w-12 overflow-hidden rounded-full border-2 border-gold-400/50">
              <img
                src="/images/GMBC_logo.jpg"
                alt="GMBC Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1
                className={`font-serif text-base md:text-lg font-bold leading-tight transition-colors ${
                  scrolled ? "text-navy-800" : "text-white"
                }`}
              >
                Grace Missionary
              </h1>
              <p
                className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  scrolled ? "text-gold-500" : "text-gold-300"
                }`}
              >
                Baptist Church
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                  scrolled
                    ? "text-navy-800 hover:text-gold-500"
                    : "text-white/80 hover:text-white"
                } ${
                  pathname === item.href
                    ? scrolled
                      ? "text-gold-600"
                      : "text-gold-300"
                    : ""
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                    pathname === item.href ? "w-full" : "w-0"
                  } ${scrolled ? "bg-gold-500" : "bg-gold-300"}`}
                />
              </Link>
            ))}
            <Link
              href="/contact"
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                scrolled
                  ? "bg-gold-500 text-navy-900 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/25"
                  : "border border-white/30 text-white hover:bg-white hover:text-navy-900"
              }`}
            >
              Plan A Visit
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className={`h-0.5 w-6 rounded-full transition-colors ${
                scrolled || isOpen ? "bg-navy-800" : "bg-white"
              }`}
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`h-0.5 w-6 rounded-full transition-colors ${
                scrolled || isOpen ? "bg-navy-800" : "bg-white"
              }`}
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className={`h-0.5 w-6 rounded-full transition-colors ${
                scrolled || isOpen ? "bg-navy-800" : "bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/98 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`text-2xl font-serif font-bold transition-colors hover:text-gold-500 ${
                      pathname === item.href ? "text-gold-500" : "text-navy-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/contact"
                  className="mt-4 inline-block rounded-full bg-gold-500 px-8 py-3 text-lg font-semibold text-navy-900 transition-all hover:bg-gold-400"
                >
                  Plan A Visit
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
