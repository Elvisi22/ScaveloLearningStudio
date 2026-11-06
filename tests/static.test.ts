import { afterEach, describe, expect, it, vi } from "vitest";
import imageLoader from "@/lib/image-loader";
import { prefillFromSearch } from "@/lib/prefill";

describe("application prefill from the URL", () => {
  it("pre-selects a valid program, format, class and intent", () => {
    const initial = prefillFromSearch(new URLSearchParams("program=java-foundations&class=java-foundations-jan-2027&intent=consultation"));
    expect(initial).toMatchObject({ program: "java-foundations", classId: "java-foundations-jan-2027", format: "GROUP", intent: "CONSULTATION" });
  });

  it("ignores unknown or mismatched values", () => {
    const initial = prefillFromSearch(new URLSearchParams("program=nope&format=ROOFTOP&class=architecture-spring-2027&intent=hack"));
    expect(initial.program).toBe("modern-software-architecture"); // taken from the valid class
    expect(initial.format).toBe("GROUP");
    expect(initial.intent).toBeUndefined();
    expect(prefillFromSearch(new URLSearchParams("program=java-foundations&class=architecture-spring-2027")).classId).toBeUndefined();
  });

  it("selects private lessons for a package", () => {
    expect(prefillFromSearch(new URLSearchParams("package=PACK_5"))).toMatchObject({ package: "PACK_5", format: "PRIVATE" });
  });
});

describe("static image loader", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("asks Unsplash for the requested width", () => {
    const url = new URL(imageLoader({ src: "https://images.unsplash.com/photo-1?auto=format&fit=crop&w=2400&q=80", width: 828, quality: 75 }));
    expect(url.searchParams.get("w")).toBe("828");
    expect(url.searchParams.get("q")).toBe("75");
  });

  it("prefixes local images with the base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/ScaveloLearningStudio");
    expect(imageLoader({ src: "/images/hero.jpg", width: 640 })).toBe("/ScaveloLearningStudio/images/hero.jpg?w=640");
  });
});
