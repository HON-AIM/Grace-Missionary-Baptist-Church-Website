import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 5;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function sanitize(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/[\\{}[\]()]/g, "")
    .replace(/['"]/g, "")
    .trim()
    .slice(0, 5000);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);
  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (entry.count >= MAX_REQUESTS) return true;
  entry.count++;
  return false;
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) return true;

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });
    const data = await res.json();
    return data.success === true && (data.score || 1) >= 0.5;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, name, email, phone, message, recaptchaToken } = body;

    const cleanedType = type === "prayer" ? "prayer" : "contact";
    const cleanedName = sanitize(name ?? "");
    const cleanedEmail = sanitize(email ?? "");
    const cleanedPhone = sanitize(phone ?? "");
    const cleanedMessage = sanitize(message ?? "");

    if (!cleanedName || cleanedName.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!cleanedEmail || !isValidEmail(cleanedEmail)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const minMessageLength = cleanedType === "prayer" ? 5 : 10;
    if (!cleanedMessage || cleanedMessage.length < minMessageLength) {
      return NextResponse.json(
        { error: cleanedType === "prayer" ? "Please share your prayer request." : "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (recaptchaToken) {
      const valid = await verifyRecaptcha(recaptchaToken);
      if (!valid) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    const logLabel = cleanedType === "prayer" ? "Prayer request" : "Contact form";
    console.log(`${logLabel} submission:`, {
      name: cleanedName,
      email: cleanedEmail,
      phone: cleanedPhone,
      message: cleanedMessage,
    });

    const successMessage =
      cleanedType === "prayer"
        ? "Your prayer request has been received. Our prayer team will pray with you."
        : "Thank you for reaching out. We will get back to you shortly.";

    return NextResponse.json({ success: true, message: successMessage }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
