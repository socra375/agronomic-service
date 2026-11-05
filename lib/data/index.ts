/**
 * Capa de acceso a datos.
 * Hoy devuelve los datos de ejemplo. En la fase 2 se reemplaza el interior de estas
 * funciones por consultas a Supabase sin tocar los componentes.
 */
import { gallery, properties, services, zones } from "../sample-data";
import { normalize } from "../normalize";
import type { GalleryImage, Property, Service, Zone } from "../types";

export async function getProperties(): Promise<Property[]> {
  return properties;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  return properties.filter((p) => p.featured).slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return properties.find((p) => p.slug === slug) ?? null;
}

/** Propiedades parecidas: misma zona o mismo tipo, sin repetir la actual. */
export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  return properties
    .filter((p) => p.id !== property.id && (p.location === property.location || p.type === property.type))
    .slice(0, limit);
}

export interface ZoneWithCount extends Zone {
  count: number;
}

export async function getZones(): Promise<ZoneWithCount[]> {
  return zones.map((z) => ({
    ...z,
    count: properties.filter((p) => normalize(p.location) === normalize(z.name)).length,
  }));
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getGallery(): Promise<GalleryImage[]> {
  return gallery;
}
