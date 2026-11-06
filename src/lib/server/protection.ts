import "server-only";
import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { integrations, serverEnv } from "./env";

/* ── Client IP ─────────────────────────────────────────────────────────── */

export async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/* ── Rate limiting ─────────────────────────────────────────────────────── */

const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Fixed-window, in-memory limiter. It protects each server instance without a
 * database; on multi-instance/serverless hosting, enable Turnstile as well.
 */
export function rateLimit(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

/* ── Spam heuristics ───────────────────────────────────────────────────── */

export const MIN_FILL_MS = 3000;

export function looksAutomated({ honeypot, elapsedMs }: { honeypot?: unknown; elapsedMs?: unknown }) {
  const trapped = typeof honeypot === "string" && honeypot.trim().length > 0;
  const tooFast = typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS;
  return trapped || tooFast;
}

export function tooManyLinks(...texts: string[]) {
  return (texts.join(" ").match(/https?:\/\/|www\./gi)?.length ?? 0) > 4;
}

/* ── Cloudflare Turnstile ──────────────────────────────────────────────── */

export async function verifyTurnstile(token: unknown, ip: string) {
  if (!integrations.turnstile) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const body = new URLSearchParams({ secret: serverEnv.turnstileSecret!, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("[turnstile] verification request failed", error);
    return false;
  }
}

/* ── References ────────────────────────────────────────────────────────── */

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Human-friendly reference such as APP-2611-7K4Q9X. */
export function generateReference(prefix: "APP" | "MSG") {
  const now = new Date();
  const yymm = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  let code = "";
  for (let i = 0; i < 6; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${yymm}-${code}`;
}
