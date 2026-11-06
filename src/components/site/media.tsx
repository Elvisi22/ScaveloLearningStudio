import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/content/media";
import { cn } from "@/lib/utils";

const AMBIENT = {
  warm: ["#efe7dc", "#d6c5ae", "#f8f5f0"],
  stone: ["#e7e6e3", "#c9c6bf", "#f5f4f1"],
  dark: ["#2a2622", "#4a3f35", "#0e0d0c"],
} as const;

/** Soft gradient "wallpaper" used when no photograph is available. */
export function AmbientArt({ tone = "warm", className }: { tone?: keyof typeof AMBIENT; className?: string }) {
  const [a, b, base] = AMBIENT[tone];
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0", className)}
      style={{
        background: `radial-gradient(70% 60% at 18% 22%, ${a}, transparent 62%), radial-gradient(65% 70% at 85% 85%, ${b}, transparent 60%), ${base}`,
      }}
    />
  );
}

/**
 * Large, consistently cropped photograph with optional scroll parallax and
 * a legibility gradient for text overlays.
 */
export function CinematicImage({
  photo,
  className,
  sizes = "(min-width: 1440px) 1440px, 100vw",
  preload = false,
  parallax = true,
  overlay,
  rounded = "rounded-[1.75rem] sm:rounded-[2.25rem]",
  fallback = "warm",
  children,
}: {
  photo?: Photo;
  className?: string;
  sizes?: string;
  preload?: boolean;
  parallax?: boolean;
  overlay?: "bottom" | "full";
  rounded?: string;
  fallback?: keyof typeof AMBIENT;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-sand-deep", rounded, className)}>
      {photo?.src ? (
        <div className={cn("absolute inset-0", preload && "animate-settle")}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            preload={preload}
            className={cn("object-cover", parallax && "parallax")}
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </div>
      ) : (
        <AmbientArt tone={fallback} />
      )}
      {overlay === "bottom" ? <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" /> : null}
      {overlay === "full" ? <div aria-hidden className="absolute inset-0 bg-black/45" /> : null}
      {children}
    </div>
  );
}
