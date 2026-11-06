import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfaf8",
          padding: "72px 80px",
          color: "#1d1d1f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 40, fontWeight: 700, letterSpacing: -1.5 }}>
          {site.name}
          <div style={{ width: 9, height: 9, borderRadius: 999, background: "#8b6a45", marginTop: 20 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.02, letterSpacing: -4, fontWeight: 700, maxWidth: 1000 }}><span>Learn directly from the instructor.</span><span style={{ color: "#8e8e93" }}>Nothing in between.</span></div>
          <div style={{ fontSize: 28, color: "#6e6e73" }}>Private 1-on-1 lessons · Small group classes · Taught live on Slack</div>
        </div>
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 4, color: "#8b6a45", fontWeight: 700 }}>PRIVATE ACADEMY · INSTRUCTOR-LED</div>
      </div>
    ),
    size,
  );
}
