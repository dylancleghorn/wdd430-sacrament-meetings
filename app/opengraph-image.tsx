import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#f5f7f8", color: "#17242c", display: "flex", height: "100%", padding: "72px", width: "100%" }}>
      <div style={{ borderLeft: "14px solid #006273", display: "flex", flexDirection: "column", paddingLeft: "36px" }}>
        <div style={{ color: "#004656", display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Sousas Ward</div>
        <div style={{ display: "flex", fontFamily: "serif", fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginTop: 28 }}>Sacrament Meeting Planner</div>
        <div style={{ color: "#52616b", display: "flex", fontSize: 30, marginTop: 28 }}>Meeting programs for the ward family.</div>
      </div>
    </div>,
    size,
  );
}
