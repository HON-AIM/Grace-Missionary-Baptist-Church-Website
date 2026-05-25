"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ScriptureData {
  text: string;
  reference: string;
}

export default function ScriptureBanner() {
  const [data, setData] = useState<ScriptureData>({
    text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world.",
    reference: "Matthew 28:19–20 (KJV)",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_settings")
      .select("weekly_scripture, weekly_scripture_ref")
      .limit(1)
      .single()
      .then(({ data: row }) => {
        if (row?.weekly_scripture) {
          setData({
            text: row.weekly_scripture,
            reference: row.weekly_scripture_ref || "The Holy Bible",
          });
        }
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900">
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-serif text-7xl md:text-9xl text-gold-500/20 leading-none block -mb-12">
            &ldquo;
          </span>
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light italic leading-relaxed text-white/90 px-4">
            {data.text}
          </p>
          <span className="font-serif text-7xl md:text-9xl text-gold-500/20 leading-none block -mt-8">
            &rdquo;
          </span>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-gold-500/10 border border-gold-500/20 px-6 py-2">
            <span className="h-3 w-3 rounded-full bg-gold-400 animate-pulse" />
            <p className="font-serif text-base font-semibold text-gold-300">
              {data.reference}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
