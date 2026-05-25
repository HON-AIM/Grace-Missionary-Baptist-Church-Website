"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionWrapper from "@/components/SectionWrapper";
import GalleryPreview from "@/components/GalleryPreview";
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Sunday Service",
  "Bible Study",
  "Prayer Meeting",
  "Youth Program",
  "Church Events",
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-navy-900 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gold-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-gold-500 rounded-full blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Gallery
              </span>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Our Church in Pictures
              </h1>
              <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gold-500" />
              <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
                Moments captured in worship, fellowship, and service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* GALLERY */}
        <SectionWrapper className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-center justify-center gap-2 mb-12"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/25"
                      : "bg-white border border-navy-200 text-navy-600 hover:border-gold-500 hover:text-gold-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            <GalleryPreview
              open={!!previewItem}
              onClose={() => setPreviewItem(null)}
              imageUrl={previewItem?.image_url || ""}
              caption={previewItem?.caption}
              category={previewItem?.category}
            />

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-400 text-lg">
                  {activeCategory === "All"
                    ? "No gallery images yet."
                    : `No images in "${activeCategory}".`}
                </p>
                <p className="text-navy-500 text-sm mt-2">
                  Check back soon for new photos.
                </p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                      className="group relative rounded-xl overflow-hidden break-inside-avoid cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                      onClick={() => setPreviewItem(item)}
                    >
                      <img
                        src={item.image_url}
                        alt={item.caption || "Gallery image"}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        {item.caption && (
                          <p className="text-white text-sm font-medium">
                            {item.caption}
                          </p>
                        )}
                        <p className="text-gold-300 text-xs mt-0.5">
                          {item.category}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </>
  );
}
