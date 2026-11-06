/**
 * Photography used across the site.
 *
 * These are placeholder images from Unsplash (free Unsplash License,
 * https://unsplash.com/license) chosen to set the art direction. Replace them
 * with your own photography before launch: put files in /public/images and use
 * paths such as "/images/hero.jpg". Leaving `src` empty shows a soft gradient.
 */
export type Photo = {
  src: string;
  alt: string;
  /** CSS object-position, e.g. "50% 30%", to control the crop. */
  position?: string;
  credit?: string;
};

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=80`;

export const photos = {
  hero: {
    src: unsplash("photo-1601642964568-1917224f4e4d"),
    alt: "Sunlit minimalist desk with a laptop and desk lamp against a warm white wall",
    position: "50% 60%",
    credit: "Dagny Reese / Unsplash",
  },
  private: {
    src: unsplash("photo-1789724919850-20d7f3a30af0"),
    alt: "Hands writing notes in a planner beside a laptop and a ceramic mug",
    credit: "Swello / Unsplash",
  },
  group: {
    src: unsplash("photo-1694253988732-816ab6e60caa"),
    alt: "Minimalist seminar room with a long table and chairs in soft daylight",
    credit: "Michael Pointner / Unsplash",
  },
  approach: {
    src: unsplash("photo-1764422097938-5db998dac1cb"),
    alt: "Minimalist staircase in shadow with a single patch of sunlight on the wall",
    credit: "强 任 / Unsplash",
  },
  closing: {
    src: unsplash("photo-1472803828399-39d4ac53c6e5"),
    alt: "Dark monochrome concrete steps beside a stone wall",
    credit: "Boris Stefanik / Unsplash",
  },
  workspace: {
    src: unsplash("photo-1766431045544-65685fdf8517"),
    alt: "Quiet study with a wooden desk, desk lamp and bookshelf by the window",
    credit: "Annie Spratt / Unsplash",
  },
} satisfies Record<string, Photo>;

/** Program cover photographs, keyed by program slug. */
export const programCovers: Record<string, string> = {
  "java-foundations": unsplash("photo-1461749280684-dccba630e2f6"),
  "spring-boot-in-practice": unsplash("photo-1486551937199-baf066858de7"),
  "modern-software-architecture": unsplash("photo-1465547277055-25135ea1cb56"),
  "data-analysis-with-python": unsplash("photo-1673553910811-c082ad11ed2b"),
  "technical-interview-preparation": unsplash("photo-1765447041709-9f1efbc81606"),
  "presenting-technical-ideas": unsplash("photo-1780342256302-be0e99a276c3"),
};
