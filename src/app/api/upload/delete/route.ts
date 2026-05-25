import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_PREFIXES = ["announcements/", "sermons/", "gallery/", "events/", "uploads/"];

function isValidOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gmbc.org";
  if (origin) return origin === siteUrl;
  if (referer) return referer.startsWith(siteUrl);
  return false;
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
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const pathMatch = url.match(/\/gmbc-media\/(.+)/);
    if (!pathMatch) {
      return NextResponse.json({ error: "Invalid storage URL" }, { status: 400 });
    }

    const fullPath = pathMatch[1];
    const basePath = fullPath.replace(/^\/+/, "");

    const allowed = ALLOWED_PREFIXES.some((p) => basePath.startsWith(p));
    if (!allowed) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const thumbPath = basePath.replace(
      /^(.*\/)([^/]+)$/,
      (_, dir, name) => `${dir}thumb_${name.replace(/\.\w+$/, ".webp")}`
    );

    const pathsToDelete = [basePath];
    if (thumbPath !== basePath) {
      pathsToDelete.push(thumbPath);
    }

    const { error } = await supabase.storage
      .from("gmbc-media")
      .remove(pathsToDelete);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
