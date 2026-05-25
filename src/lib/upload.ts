export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
export const MAX_SIZE = 5 * 1024 * 1024;
export const MAX_WIDTH = 1920;
export const THUMBNAIL_SIZE = 300;
export const COMPRESSION_QUALITY = 0.8;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImage(file: File): ValidationResult {
  if (!file) return { valid: false, error: "No file provided" };

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  if (file.size > MAX_SIZE) {
    const mb = MAX_SIZE / 1024 / 1024;
    return {
      valid: false,
      error: `File too large. Maximum size is ${mb}MB.`,
    };
  }

  return { valid: true };
}

export function sanitizeFilename(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .slice(0, -(ext.length + 1))
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
  const sanitized = base || "image";
  return `${sanitized}.${ext}`;
}

export function compressImage(
  file: File,
  maxWidth = MAX_WIDTH,
  quality = COMPRESSION_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function generateThumbnail(
  file: File,
  size = THUMBNAIL_SIZE
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let { width, height } = img;
      if (width > height) {
        if (width > size) {
          height = Math.round((height * size) / width);
          width = size;
        }
      } else {
        if (height > size) {
          width = Math.round((width * size) / height);
          height = size;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Thumbnail generation failed"));
        },
        "image/webp",
        0.7
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
