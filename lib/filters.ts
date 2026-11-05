import { normalize } from "./normalize";
import type { FeatureKey, Operation, Property, PropertyType } from "./types";

/**
 * Filtros del catálogo. Son funciones puras y no dependen de React:
 * - se prueban con vitest (`tests/filters.test.ts`);
 * - en la fase 2 se pueden mover al servidor (consulta a Supabase) sin cambiar la interfaz.
 */

export type SortKey = "recientes" | "precio-asc" | "precio-desc" | "area-desc";

export interface PropertyFilters {
  q: string;
  location: string;
  type: PropertyType | "";
  operation: Operation | "";
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  features: FeatureKey[];
  sort: SortKey;
}

export const emptyFilters: PropertyFilters = {
  q: "",
  location: "",
  type: "",
  operation: "",
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  features: [],
  sort: "recientes",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  villa: "Villa",
  casa: "Casa",
  apartamento: "Apartamento",
  solar: "Solar",
  finca: "Finca",
};

export const operationLabels: Record<Operation, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

export const featureLabels: Record<FeatureKey, string> = {
  piscina: "Piscina",
  jardin: "Jardín",
  "vista-al-mar": "Vista al mar",
  parqueo: "Parqueo",
  amueblado: "Amueblado",
  seguridad: "Seguridad 24/7",
  terraza: "Terraza",
  "cerca-playa": "Cerca de la playa",
};

export const sortLabels: Record<SortKey, string> = {
  recientes: "Más recientes",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  "area-desc": "Mayor superficie",
};

export const priceSteps = [50_000, 100_000, 150_000, 250_000, 400_000, 600_000, 1_000_000, 2_000_000];

function searchableText(p: Property): string {
  return normalize(
    [p.title, p.summary, p.location, p.address, propertyTypeLabels[p.type], ...p.features.map((f) => featureLabels[f])].join(" "),
  );
}

export function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  const terms = normalize(filters.q).split(/\s+/).filter(Boolean);
  const location = normalize(filters.location);

  const result = properties.filter((p) => {
    if (terms.length) {
      const text = searchableText(p);
      if (!terms.every((t) => text.includes(t))) return false;
    }
    if (location && normalize(p.location) !== location) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.operation && p.operation !== filters.operation) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    if (filters.bedrooms != null && p.bedrooms < filters.bedrooms) return false;
    if (filters.features.length && !filters.features.every((f) => p.features.includes(f))) return false;
    return true;
  });

  return sortProperties(result, filters.sort);
}

export function sortProperties(properties: Property[], sort: SortKey): Property[] {
  const list = [...properties];
  switch (sort) {
    case "precio-asc":
      return list.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return list.sort((a, b) => b.price - a.price);
    case "area-desc":
      return list.sort((a, b) => b.areaM2 - a.areaM2);
    default:
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

/** Número de filtros activos (sin contar el orden). Se usa en el botón móvil y en «Limpiar». */
export function countActiveFilters(f: PropertyFilters): number {
  return (
    (f.q.trim() ? 1 : 0) +
    (f.location ? 1 : 0) +
    (f.type ? 1 : 0) +
    (f.operation ? 1 : 0) +
    (f.minPrice != null ? 1 : 0) +
    (f.maxPrice != null ? 1 : 0) +
    (f.bedrooms != null ? 1 : 0) +
    f.features.length
  );
}

/* ---------- Sincronización con la URL ----------
 * ?q=&loc=&tipo=&op=&min=&max=&hab=&car=piscina,jardin&orden=
 */

type ParamsLike = { get(name: string): string | null };

function toNumber(v: string | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function isIn<T extends string>(value: string | null, allowed: readonly T[]): value is T {
  return value != null && (allowed as readonly string[]).includes(value);
}

export function parseFilters(params: ParamsLike): PropertyFilters {
  const types = Object.keys(propertyTypeLabels) as PropertyType[];
  const ops = Object.keys(operationLabels) as Operation[];
  const sorts = Object.keys(sortLabels) as SortKey[];
  const features = Object.keys(featureLabels) as FeatureKey[];

  const tipo = params.get("tipo");
  const op = params.get("op");
  const orden = params.get("orden");

  return {
    q: params.get("q") ?? "",
    location: params.get("loc") ?? "",
    type: isIn(tipo, types) ? tipo : "",
    operation: isIn(op, ops) ? op : "",
    minPrice: toNumber(params.get("min")),
    maxPrice: toNumber(params.get("max")),
    bedrooms: toNumber(params.get("hab")),
    features: (params.get("car") ?? "")
      .split(",")
      .filter((f): f is FeatureKey => isIn(f, features)),
    sort: isIn(orden, sorts) ? orden : "recientes",
  };
}

export function serializeFilters(f: PropertyFilters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.location) p.set("loc", f.location);
  if (f.type) p.set("tipo", f.type);
  if (f.operation) p.set("op", f.operation);
  if (f.minPrice != null) p.set("min", String(f.minPrice));
  if (f.maxPrice != null) p.set("max", String(f.maxPrice));
  if (f.bedrooms != null) p.set("hab", String(f.bedrooms));
  if (f.features.length) p.set("car", f.features.join(","));
  if (f.sort !== "recientes") p.set("orden", f.sort);
  return p.toString();
}
