import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const redirectTo = searchParams.get("redirect_to") ?? "/admin";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const url = new URL(`${origin}${redirectTo}`);
      url.searchParams.delete("code");
      url.searchParams.delete("next");
      url.searchParams.delete("redirect_to");
      return NextResponse.redirect(url);
    }
  }

  const url = new URL(`${origin}${next}`);
  url.searchParams.delete("code");
  url.searchParams.delete("next");
  url.searchParams.delete("redirect_to");
  return NextResponse.redirect(url);
}
