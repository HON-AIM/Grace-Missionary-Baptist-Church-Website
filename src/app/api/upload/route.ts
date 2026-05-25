import { NextResponse } from "next/server";
import sharp from "sharp";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const ALLOWED_FOLDERS = ["announcements", "sermons", "gallery", "events", "uploads"];
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const THUMB_SIZE = 300;

function isValidOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gmbc.org";
  if (origin) return origin === siteUrl;
  if (referer) return referer.startsWith(siteUrl);
  return false;
}

function sanitizeName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  if (!ALLOWED_EXTENSIONS.includes(ext)) return `image-${Date.now()}.jpg`;
  const base = name
    .slice(0, -(ext.length + 1))
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40);
  return `${base || "image"}-${Date.now()}.${ext}`;
}

export async function POST(request: Request) {
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid type. Allowed: JPEG, PNG, WebP` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const metadata = await sharp(buffer).metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
      return NextResponse.json(
        { error: "Invalid image format detected server-side" },
        { status: 400 }
      );
    }

    const compressed = await sharp(buffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const thumbnail = await sharp(buffer)
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: "cover" })
      .webp({ quality: 70 })
      .toBuffer();

    const sanitized = sanitizeName(file.name);
    const mainPath = `${folder}/${sanitized}`;
    const thumbPath = `${folder}/thumb_${sanitized.replace(/\.\w+$/, ".webp")}`;

    const { error: mainError } = await supabase.storage
      .from("gmbc-media")
      .upload(mainPath, compressed, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (mainError) {
      return NextResponse.json({ error: mainError.message }, { status: 500 });
    }

    const { error: thumbError } = await supabase.storage
      .from("gmbc-media")
      .upload(thumbPath, thumbnail, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (thumbError) {
      await supabase.storage.from("gmbc-media").remove([mainPath]);
      return NextResponse.json({ error: thumbError.message }, { status: 500 });
    }

    const { data: mainUrl } = supabase.storage
      .from("gmbc-media")
      .getPublicUrl(mainPath);

    const { data: thumbUrl } = supabase.storage
      .from("gmbc-media")
      .getPublicUrl(thumbPath);

    return NextResponse.json(
      { url: mainUrl.publicUrl, thumbnailUrl: thumbUrl.publicUrl },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
