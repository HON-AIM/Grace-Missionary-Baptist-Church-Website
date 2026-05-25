"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";

interface GalleryPreviewProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
  category?: string;
}

export default function GalleryPreview({
  open,
  onClose,
  imageUrl,
  caption,
  category,
}: GalleryPreviewProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-10 p-2 bg-navy-900 border border-navy-700 rounded-full text-navy-300 hover:text-white transition-all shadow-xl"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
            <div className="bg-navy-900 border border-navy-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-center bg-black/40 max-h-[70vh]">
                <img
                  src={imageUrl}
                  alt={caption || "Gallery image"}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
              {(caption || category) && (
                <div className="p-4">
                  {caption && (
                    <p className="text-white text-sm font-medium">{caption}</p>
                  )}
                  {category && (
                    <p className="text-navy-400 text-xs mt-1">{category}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
