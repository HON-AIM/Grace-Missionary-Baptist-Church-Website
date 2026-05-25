"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePhotograph } from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Image {
  id: string;
  caption: string;
  image_url: string;
  created_at: string;
}

export default function RecentUploads() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery")
        .select("id, caption, image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data) setImages(data);
      setLoading(false);
    }
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="bg-navy-800 border border-navy-700/50 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-28 bg-navy-700 rounded" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-navy-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden"
    >
      <div className="p-6 border-b border-navy-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HiOutlinePhotograph className="w-5 h-5 text-gold-500" />
          <h3 className="text-lg font-semibold text-white">Recent Uploads</h3>
        </div>
        <Link
          href="/admin/gallery"
          className="text-xs text-gold-500/80 hover:text-gold-400 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="p-4">
        {images.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-navy-500 text-sm">No images uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-lg overflow-hidden bg-navy-700"
              >
                <img
                  src={img.image_url}
                  alt={img.caption || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                  <p className="text-white text-xs truncate font-medium">
                    {img.caption || "Untitled"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
