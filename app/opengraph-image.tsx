import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} · ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen para redes sociales, generada con la paleta de la marca. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1F3A2B",
          padding: "72px 80px",
          color: "#F6F3EA",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#B8935A" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40 }}>Agronómic</span>
            <span style={{ fontSize: 16, letterSpacing: 8, color: "#D2B27A" }}>SERVICES, S. A.</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, letterSpacing: 6, color: "#D2B27A" }}>DISEÑO DE JARDINES · BIENES RAÍCES</span>
          <span style={{ fontSize: 76, lineHeight: 1.05, marginTop: 20, maxWidth: 950 }}>
            Exteriores que se viven, hogares que inspiran
          </span>
        </div>
        <span style={{ fontSize: 22, color: "#CFDCCF" }}>República Dominicana</span>
      </div>
    ),
    size,
  );
}
