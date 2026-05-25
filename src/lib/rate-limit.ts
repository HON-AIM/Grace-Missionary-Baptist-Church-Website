const rateMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60000
) {
  const now = Date.now();
  const record = rateMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "127.0.0.1";
}
