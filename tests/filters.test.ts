import { describe, expect, it } from "vitest";
import {
  countActiveFilters,
  emptyFilters,
  filterProperties,
  parseFilters,
  serializeFilters,
  type PropertyFilters,
} from "@/lib/filters";
import { properties } from "@/lib/sample-data";

const f = (patch: Partial<PropertyFilters>): PropertyFilters => ({ ...emptyFilters, ...patch });
const slugs = (list: { slug: string }[]) => list.map((p) => p.slug);

describe("filterProperties", () => {
  it("sin filtros devuelve todo, de la más reciente a la más antigua", () => {
    const result = filterProperties(properties, emptyFilters);
    expect(result).toHaveLength(properties.length);
    const dates = result.map((p) => p.createdAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("la búsqueda ignora acentos y mayúsculas", () => {
    expect(slugs(filterProperties(properties, f({ q: "SAMANA" })))).toEqual(["apartamento-vista-bahia-samana"]);
    expect(slugs(filterProperties(properties, f({ q: "jardin golf" })))).toEqual(["casa-del-golf-playa-dorada"]);
  });

  it("la búsqueda encuentra por característica legible", () => {
    const result = filterProperties(properties, f({ q: "vista al mar" }));
    expect(result.every((p) => p.features.includes("vista-al-mar"))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("filtra por zona sin importar los acentos", () => {
    const result = filterProperties(properties, f({ location: "samana" }));
    expect(result.every((p) => p.location === "Samaná")).toBe(true);
  });

  it("aplica el rango de precio con los límites incluidos", () => {
    const result = filterProperties(properties, f({ minPrice: 295_000, maxPrice: 485_000 }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.price >= 295_000 && p.price <= 485_000)).toBe(true);
    expect(slugs(result)).toContain("finca-el-mirador-jarabacoa");
    expect(slugs(result)).toContain("villa-palmeras-punta-cana");
  });

  it("combina tipo, operación, habitaciones y características", () => {
    const result = filterProperties(
      properties,
      f({ type: "villa", operation: "venta", bedrooms: 4, features: ["piscina", "jardin"] }),
    );
    expect(slugs(result).sort()).toEqual(["villa-marina-la-romana", "villa-palmeras-punta-cana"]);
  });

  it("devuelve una lista vacía si nada coincide", () => {
    expect(filterProperties(properties, f({ q: "castillo medieval" }))).toEqual([]);
  });

  it("ordena por precio y por superficie", () => {
    const asc = filterProperties(properties, f({ sort: "precio-asc" })).map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const area = filterProperties(properties, f({ sort: "area-desc" })).map((p) => p.areaM2);
    expect(area).toEqual([...area].sort((a, b) => b - a));
  });
});

describe("URL", () => {
  it("serializa y vuelve a leer los mismos filtros", () => {
    const original = f({
      q: "piscina",
      location: "Punta Cana",
      type: "villa",
      operation: "venta",
      minPrice: 100_000,
      maxPrice: 600_000,
      bedrooms: 3,
      features: ["jardin", "terraza"],
      sort: "precio-desc",
    });
    const parsed = parseFilters(new URLSearchParams(serializeFilters(original)));
    expect(parsed).toEqual(original);
  });

  it("descarta los valores inválidos", () => {
    const parsed = parseFilters(new URLSearchParams("tipo=castillo&min=abc&car=piscina,helipuerto&orden=x"));
    expect(parsed).toEqual(f({ features: ["piscina"] }));
  });

  it("sin filtros la URL queda vacía", () => {
    expect(serializeFilters(emptyFilters)).toBe("");
  });

  it("cuenta los filtros activos", () => {
    expect(countActiveFilters(emptyFilters)).toBe(0);
    expect(countActiveFilters(f({ q: "x", features: ["piscina", "jardin"], sort: "precio-asc" }))).toBe(3);
  });
});
