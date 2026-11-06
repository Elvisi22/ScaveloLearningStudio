/**
 * Image loader for static hosting. Unsplash images are resized by Unsplash's
 * own CDN; local images in /public are served as-is (with the base path when
 * the site lives in a sub-folder, e.g. GitHub Pages).
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    return url.toString();
  }
  if (src.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? ""}${src}?w=${width}`;
  }
  return src;
}
