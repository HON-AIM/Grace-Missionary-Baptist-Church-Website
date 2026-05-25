"use client";

import { useState, useCallback, useRef } from "react";
import { validateImage, compressImage, sanitizeFilename } from "@/lib/upload";

export type UploadStatus = "idle" | "compressing" | "uploading" | "done" | "error";

interface UseFileUploadOptions {
  folder?: string;
}

interface UseFileUploadReturn {
  status: UploadStatus;
  progress: number;
  url: string | null;
  thumbnailUrl: string | null;
  error: string | null;
  upload: (file: File, folder?: string) => Promise<string | null>;
  reset: () => void;
}

export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const { folder: defaultFolder = "uploads" } = options;
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const upload = useCallback(
    async (file: File, folder?: string): Promise<string | null> => {
      const targetFolder = folder || defaultFolder;

      const validation = validateImage(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        setStatus("error");
        return null;
      }

      setStatus("compressing");
      setProgress(0);
      setError(null);

      try {
        const compressed = await compressImage(file);
        const sanitizedName = sanitizeFilename(file.name);
        const formData = new FormData();
        formData.append("file", compressed, sanitizedName);
        formData.append("folder", targetFolder);

        setStatus("uploading");
        setProgress(10);

        abortRef.current = new AbortController();

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          signal: abortRef.current.signal,
        });

        setProgress(80);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        setProgress(100);
        setUrl(data.url);
        setThumbnailUrl(data.thumbnailUrl || null);
        setStatus("done");
        return data.url;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setStatus("idle");
          return null;
        }
        const message =
          err instanceof Error ? err.message : "Upload failed";
        setError(message);
        setStatus("error");
        return null;
      }
    },
    [defaultFolder]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setStatus("idle");
    setProgress(0);
    setUrl(null);
    setThumbnailUrl(null);
    setError(null);
  }, []);

  return { status, progress, url, thumbnailUrl, error, upload, reset };
}
