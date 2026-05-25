"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePhotograph,
  HiOutlineUpload,
  HiOutlineX,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { validateImage, compressImage, sanitizeFilename, ALLOWED_EXTENSIONS, MAX_SIZE } from "@/lib/upload";

interface FileUploadProps {
  folder?: string;
  onUpload: (url: string) => void;
  onDelete?: () => void;
  existingUrl?: string | null;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export default function FileUpload({
  folder = "uploads",
  onUpload,
  onDelete,
  existingUrl,
  className = "",
}: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "compressing" | "uploading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setError(null);
      setStatus("compressing");
      setProgress(0);

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        const compressed = await compressImage(file);
        const sanitizedName = sanitizeFilename(file.name);
        const formData = new FormData();
        formData.append("file", compressed, sanitizedName);
        formData.append("folder", folder);

        setStatus("uploading");
        setProgress(10);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        setProgress(80);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        setProgress(100);
        setStatus("done");
        onUpload(data.url);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setStatus("error");
        URL.revokeObjectURL(objectUrl);
        setPreview(existingUrl || null);
      }
    },
    [folder, onUpload, existingUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleDelete = useCallback(async () => {
    if (!preview) return;
    if (existingUrl) {
      try {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: existingUrl }),
        });
      } catch {}
    }
    setPreview(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    onDelete?.();
    if (fileRef.current) fileRef.current.value = "";
  }, [preview, existingUrl, onDelete]);

  const mb = MAX_SIZE / 1024 / 1024;

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm rounded-lg overflow-hidden border border-navy-700 group"
          >
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-48 object-cover"
            />
            {status === "done" && (
              <div className="absolute top-2 left-2 p-1 bg-emerald-500/80 rounded-full">
                <HiOutlineCheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-2 right-2 p-1.5 bg-navy-900/80 rounded-full text-navy-300 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
            {status === "uploading" && (
              <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-white text-xs mt-2 font-medium">Uploading...</p>
                </div>
              </div>
            )}
            {progress > 0 && progress < 100 && status === "uploading" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-700">
                <div
                  className="h-full bg-gold-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex items-center gap-3 w-full max-w-sm px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              dragOver
                ? "border-gold-500 bg-gold-500/5"
                : "border-navy-600 hover:border-gold-500/50 text-navy-400 hover:text-gold-400"
            }`}
          >
            {status === "compressing" ? (
              <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <>
                <HiOutlinePhotograph className="w-6 h-6 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {status === "uploading"
                      ? "Uploading..."
                      : "Drop image or click to browse"}
                  </p>
                  <p className="text-xs text-navy-500 mt-0.5">
                    JPG, PNG, or WebP &middot; Max {mb}MB
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-red-400 text-xs mt-2"
          >
            <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
