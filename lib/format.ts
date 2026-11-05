import type { Property } from "./types";

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: string) {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("es-DO", { style: "currency", currency, maximumFractionDigits: 0 });
    formatters.set(currency, f);
  }
  return f;
}

export function formatPrice(property: Pick<Property, "price" | "currency" | "operation">): string {
  const base = formatter(property.currency).format(property.price);
  return property.operation === "alquiler" ? `${base} /mes` : base;
}

/** Etiqueta corta para selectores de precio: 150000 → "US$150 mil". */
export function formatCompactUSD(value: number): string {
  if (value >= 1_000_000) {
    return `US$${(value / 1_000_000).toLocaleString("es-DO", { maximumFractionDigits: 1 })} M`;
  }
  if (value >= 1_000) return `US$${Math.round(value / 1_000)} mil`;
  return `US$${value}`;
}

export function formatArea(m2: number): string {
  return `${m2.toLocaleString("es-DO")} m²`;
}
