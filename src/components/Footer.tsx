"use client";

import Link from "next/link";
import { FaFacebook, FaYoutube, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from "react-icons/fa";

const CrossIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M2 12h20" strokeLinecap="round" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-navy-900 text-white overflow-hidden">
      <CrossIcon className="absolute top-8 right-8 h-16 w-16 text-white/5" />
      <CrossIcon className="absolute bottom-8 left-8 h-12 w-12 text-white/5 rotate-45" />

      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-500 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-gold-400/50">
                <img
                  src="/images/GMBC_logo.jpg"
                  alt="GMBC Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold leading-tight text-white">
                  Grace Missionary
                </h3>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold-400">
                  Baptist Church
                </p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">
              &ldquo;Embracing Faith, Compassion and Togetherness&rdquo;
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: FaFacebook, href: "#", label: "Facebook" },
                { icon: FaYoutube, href: "#", label: "YouTube" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all duration-300 hover:bg-gold-500 hover:text-navy-900 hover:shadow-lg hover:shadow-gold-500/25"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gold-500" />
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Ministries", href: "/ministries" },
                { label: "Sermons", href: "/sermons" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/50 transition-all duration-300 hover:text-gold-400 hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-6 relative inline-block">
              Service Times
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gold-500" />
            </h4>
            <ul className="space-y-4 text-sm text-white/50">
              {[
                { day: "Sunday School", time: "8:00 AM – 9:00 AM" },
                { day: "Sunday Service", time: "9:00 AM – 11:30 AM" },
                { day: "Wed. Prayer Meeting", time: "5:30 PM – 7:00 PM" },
                { day: "Thurs. Bible Study", time: "5:00 PM – 7:00 PM" },
                { day: "Monthly Vigil", time: "Last Friday, 12 Midnight" },
              ].map((s) => (
                <li key={s.day} className="border-l-2 border-gold-500/30 pl-3">
                  <span className="block font-medium text-white/80">{s.day}</span>
                  <span className="text-xs text-gold-300/70">{s.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 h-0.5 w-8 rounded-full bg-gold-500" />
            </h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>Grace Missionary Baptist Church</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="h-4 w-4 shrink-0 text-gold-400" />
                <span>+234 (0) 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="h-4 w-4 shrink-0 text-gold-400" />
                <span>info@gmbc.org</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06]">
              <h5 className="flex items-center gap-2 text-sm font-semibold text-gold-400">
                <FaHeart className="h-3 w-3" />
                Give &amp; Support
              </h5>
              <p className="mt-2 text-xs text-white/40 leading-relaxed">
                Polaris Bank | 1140235436
                <br />
                Association of Grace Missionary Baptist
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-white/30">
              &copy; {currentYear} Grace Missionary Baptist Church. All rights reserved.
            </p>
            <p className="text-xs text-white/20 font-serif italic">
              &ldquo;Go ye therefore, and teach all nations&rdquo; — Matthew 28:19 (KJV)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
