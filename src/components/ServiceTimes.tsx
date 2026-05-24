"use client";

import { motion } from "framer-motion";
import { FaClock, FaPray } from "react-icons/fa";

export default function ServiceTimes() {
  const services = [
    { day: "Sunday School", time: "8:00 AM – 9:00 AM" },
    { day: "Sunday Service", time: "9:00 AM – 11:30 AM" },
    { day: "Wednesday Midweek Prayer Meeting", time: "5:30 PM – 7:00 PM" },
    { day: "Thursday Bible Study", time: "5:00 PM – 7:00 PM" },
    { day: "Vigil", time: "Every Last Friday — 12 Midnight" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {services.map((service, i) => (
        <motion.div
          key={service.day}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="group rounded-xl bg-white p-6 shadow-lg shadow-navy-900/5 border border-navy-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 hover:border-gold-300 hover:-translate-y-1"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-600 transition-colors group-hover:bg-gold-500 group-hover:text-white">
              {i === 4 ? <FaPray className="h-4 w-4" /> : <FaClock className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-navy-800 leading-tight">
                {service.day}
              </h3>
            </div>
          </div>
          <div className="ml-[52px]">
            <p className="text-sm font-semibold text-gold-600">
              {service.time}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
