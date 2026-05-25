"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePhotograph,
  HiOutlineTrash,
  HiOutlineUpload,
  HiOutlineX,
  HiOutlineEye,
} from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";
import ConfirmModal from "@/components/admin/ConfirmModal";
import GalleryPreview from "@/components/GalleryPreview";
import type { GalleryItem } from "@/lib/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

const CATEGORIES = [
  "Sunday Service",
  "Bible Study",
  "Prayer Meeting",
  "Youth Program",
  "Church Events",
];

interface PendingFile {
  file: File;
  preview: string;
  caption: string;
  category: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchGallery = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const addFiles = (files: FileList) => {
    const newPending: PendingFile[] = [];
    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) continue;
      if (file.size > MAX_SIZE) continue;
      newPending.push({
        file,
        preview: URL.createObjectURL(file),
        caption: "",
        category: "Sunday Service",
      });
    }
    setPending((prev) => [...prev, ...newPending]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removePending = (idx: number) => {
    setPending((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const updatePendingCaption = (idx: number, caption: string) => {
    setPending((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, caption } : p))
    );
  };

  const updatePendingCategory = (idx: number, category: string) => {
    setPending((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, category } : p))
    );
  };

  const handleUploadAll = async () => {
    if (pending.length === 0) return;
    setUploading(true);
    const supabase = createClient();

    for (const p of pending) {
      const ext = p.file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gmbc-media")
        .upload(filePath, p.file, { cacheControl: "3600", upsert: false });

      if (uploadError) continue;

      const { data: urlData } = supabase.storage
        .from("gmbc-media")
        .getPublicUrl(filePath);

      await supabase.from("gallery").insert([
        {
          image_url: urlData.publicUrl,
          caption: p.caption,
          category: p.category,
        },
      ]);
    }

    pending.forEach((p) => URL.revokeObjectURL(p.preview));
    setPending([]);
    setUploading(false);
    fetchGallery();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createClient();

    const item = items.find((i) => i.id === deleteId);
    if (item) {
      const path = item.image_url.split("/").pop();
      if (path) {
        await supabase.storage.from("gmbc-media").remove([`gallery/${path}`]);
      }
    }

    await supabase.from("gallery").delete().eq("id", deleteId);
    setDeleting(false);
    setDeleteId(null);
    fetchGallery();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />

      <GalleryPreview
        open={!!previewItem}
        onClose={() => setPreviewItem(null)}
        imageUrl={previewItem?.image_url || ""}
        caption={previewItem?.caption}
        category={previewItem?.category}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <HiOutlinePhotograph className="w-6 h-6 text-gold-500" />
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
            Gallery
          </h1>
          <p className="text-navy-400 text-sm">
            {items.length} images
          </p>
        </div>
      </motion.div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-gold-500 bg-gold-500/5"
            : "border-navy-600 hover:border-gold-500/50 bg-navy-800/50"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        <HiOutlineUpload
          className={`mx-auto w-10 h-10 transition-colors ${
            dragOver ? "text-gold-400" : "text-navy-500"
          }`}
        />
        <p
          className={`mt-2 text-sm font-medium transition-colors ${
            dragOver ? "text-gold-300" : "text-navy-300"
          }`}
        >
          {dragOver
            ? "Drop images here"
            : "Drag & drop images or click to browse"}
        </p>
        <p className="text-xs text-navy-500 mt-1">
          JPEG, PNG, WebP, or GIF &middot; Max 5MB each
        </p>
      </div>

      {/* Pending previews */}
      <AnimatePresence>
        {pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-navy-800 border border-navy-700/50 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {pending.length} image{pending.length > 1 ? "s" : ""} ready to
                upload
              </h3>
              <button
                onClick={handleUploadAll}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-lg text-sm font-medium hover:bg-gold-400 disabled:opacity-50 transition-all"
              >
                <HiOutlineUpload className="w-4 h-4" />
                {uploading ? "Uploading..." : `Upload All (${pending.length})`}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pending.map((p, i) => (
                <div
                  key={i}
                  className="relative bg-navy-900 border border-navy-700 rounded-lg overflow-hidden group"
                >
                  <div className="aspect-video bg-navy-700">
                    <img
                      src={p.preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <input
                      type="text"
                      value={p.caption}
                      onChange={(e) => updatePendingCaption(i, e.target.value)}
                      placeholder="Caption..."
                      className="w-full px-2 py-1.5 bg-navy-800 border border-navy-700 rounded text-white text-xs placeholder-navy-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                    <select
                      value={p.category}
                      onChange={(e) => updatePendingCategory(i, e.target.value)}
                      className="w-full px-2 py-1.5 bg-navy-800 border border-navy-700 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removePending(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <HiOutlineX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry grid */}
      {items.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                className="group relative bg-navy-800 border border-navy-700/50 rounded-xl overflow-hidden break-inside-avoid cursor-pointer"
                onClick={() => setPreviewItem(item)}
              >
                <img
                  src={item.image_url}
                  alt={item.caption || "Gallery image"}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption && (
                    <p className="text-white text-sm font-medium truncate">
                      {item.caption}
                    </p>
                  )}
                  <p className="text-navy-300 text-xs mt-0.5">
                    {item.category}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewItem(item);
                    }}
                    className="p-1.5 bg-navy-900/80 text-navy-300 rounded-lg hover:text-white transition-all"
                  >
                    <HiOutlineEye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(item.id);
                    }}
                    className="p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all"
                  >
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {items.length === 0 && pending.length === 0 && (
        <div className="text-center py-12 text-navy-500">
          No gallery images yet. Drag & drop or click above to upload.
        </div>
      )}
    </div>
  );
}
