const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { success: boolean; minutesLeft: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, minutesLeft: 0 };
  }

  if (record.count >= maxAttempts) {
    const minutesLeft = Math.ceil((record.resetAt - now) / 1000 / 60);
    return { success: false, minutesLeft };
  }

  record.count++;
  return { success: true, minutesLeft: 0 };
}