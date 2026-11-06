import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateReference, looksAutomated, rateLimit, tooManyLinks } from "@/lib/server/protection";
import { emptyApplication, parseApplication } from "@/lib/validation";

describe("spam protection", () => {
  it("flags honeypot submissions and implausibly fast ones", () => {
    expect(looksAutomated({ honeypot: "http://spam", elapsedMs: 60_000 })).toBe(true);
    expect(looksAutomated({ honeypot: "", elapsedMs: 500 })).toBe(true);
    expect(looksAutomated({ honeypot: "", elapsedMs: undefined })).toBe(true);
    expect(looksAutomated({ honeypot: "", elapsedMs: 45_000 })).toBe(false);
  });

  it("flags link-stuffed messages", () => {
    expect(tooManyLinks("see https://a.com https://b.com www.c.com https://d.com https://e.com")).toBe(true);
    expect(tooManyLinks("my portfolio is at https://example.com")).toBe(false);
  });

  it("rate limits per key within the window", () => {
    const key = `test:${Math.random()}`;
    expect([1, 2, 3].map(() => rateLimit(key, 2, 60))).toEqual([true, true, false]);
  });

  it("generates readable unique references", () => {
    const refs = new Set(Array.from({ length: 200 }, () => generateReference("APP")));
    expect(refs.size).toBe(200);
    for (const ref of refs) expect(ref).toMatch(/^APP-\d{4}-[0-9A-HJKMNP-TV-Z]{6}$/);
  });
});

describe("slack delivery", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("escapes user input so it cannot trigger mentions or links", async () => {
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.test/T000/B000/XXXX");
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { sendApplicationToSlack } = await import("@/lib/server/slack");

    const parsed = parseApplication({
      ...emptyApplication(),
      program: "undecided",
      format: "EITHER",
      level: "BEGINNER",
      fullName: "<!channel> Mallory",
      email: "mallory@example.com",
      country: "IT",
      objectives: "Click <https://evil.example|here> & win",
      timezone: "Europe/Tirane",
      consent: true,
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const result = await sendApplicationToSlack(parsed.data, "APP-2611-TEST01");
    expect(result).toEqual({ ok: true, simulated: false });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const serialized = JSON.stringify(body.blocks);
    expect(serialized).not.toContain("<!channel>");
    expect(serialized).toContain("&lt;!channel&gt;");
    expect(serialized).not.toContain("<https://evil.example|here>");
    expect(serialized).toContain("&amp; win");
  });

  it("reports failure when Slack rejects the message", async () => {
    vi.stubEnv("SLACK_WEBHOOK_URL", "https://hooks.slack.test/T000/B000/XXXX");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid_token", { status: 403 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { sendContactToSlack } = await import("@/lib/server/slack");
    const result = await sendContactToSlack({ name: "Ada", email: "ada@example.com", topic: "GENERAL", message: "Hello there!" }, "MSG-2611-TEST01");
    expect(result).toEqual({ ok: false });
  });
});
