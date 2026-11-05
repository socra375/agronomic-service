import { propertyTypeLabels } from "./filters";
import { siteConfig } from "./site-config";
import type { Property } from "./types";

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function localBusinessJsonLd() {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent"],
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: contact.phone,
    email: contact.email,
    areaServed: { "@type": "Country", name: "República Dominicana" },
    address: { "@type": "PostalAddress", addressLocality: contact.address, addressCountry: "DO" },
    geo: { "@type": "GeoCoordinates", latitude: contact.lat, longitude: contact.lng },
    sameAs: siteConfig.social.map((s) => s.href),
    knowsAbout: ["Diseño de jardines", "Paisajismo", "Bienes raíces"],
  };
}

export function propertyJsonLd(p: Property) {
  return {
    "@context": "https://schema.org",
    "@type": p.type === "apartamento" ? "Apartment" : p.type === "solar" || p.type === "finca" ? "Place" : "House",
    name: `${p.title} · ${propertyTypeLabels[p.type]} en ${p.location}`,
    description: p.summary,
    url: absoluteUrl(`/propiedades/${p.slug}`),
    image: p.images.map((i) => i.src),
    ...(p.bedrooms ? { numberOfRooms: p.bedrooms } : {}),
    floorSize: { "@type": "QuantitativeValue", value: p.areaM2, unitCode: "MTK" },
    address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.location, addressCountry: "DO" },
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      businessFunction: p.operation === "venta" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };
}

/** Serializa JSON-LD de forma segura para incrustarlo en <script>. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
