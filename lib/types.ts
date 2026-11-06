/**
 * Modelos de datos. Los campos coinciden con las tablas que se crearán en Supabase
 * en la fase 2, así solo habrá que cambiar la capa `lib/data`.
 */

export type PropertyType = "villa" | "casa" | "apartamento" | "solar" | "finca";
export type Operation = "venta" | "alquiler";

export type FeatureKey =
  | "piscina"
  | "jardin"
  | "vista-al-mar"
  | "parqueo"
  | "amueblado"
  | "seguridad"
  | "terraza"
  | "cerca-playa";

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  price: number;
  currency: "USD" | "DOP";
  operation: Operation;
  type: PropertyType;
  /** Zona. Coincide con `Zone.name`. */
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  lotM2?: number;
  parking?: number;
  features: FeatureKey[];
  images: PropertyImage[];
  featured: boolean;
  lat: number;
  lng: number;
  /** Fecha ISO. */
  createdAt: string;
}

/** Diapositiva del hero. Si tiene `propertySlug`, el detalle se toma de esa propiedad. */
export interface HeroSlide {
  id: string;
  /** Título grande, en lenguaje llano: qué es y dónde. */
  title: string;
  image: PropertyImage;
  /** Categoría corta: «Jardinería», «Propiedad en venta»… */
  label: string;
  /** Línea de dato concreto (nombre y precio, o el servicio). */
  detail?: string;
  href: string;
  propertySlug?: string;
}

export interface Zone {
  name: string;
  province: string;
  tagline: string;
  image: PropertyImage;
}

export type ServiceIcon = "trees" | "flower" | "sprout" | "clipboard" | "lightbulb";

/**
 * - "portafolio": servicios que se muestran con fotos (jardines). En la fase 2 el admin
 *   sube imágenes a la galería en la categoría «jardines».
 * - "consulta": servicios sin portafolio visual; se atienden en el apartado de chat.
 */
export type ServiceMode = "portafolio" | "consulta";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
  mode: ServiceMode;
  includes: string[];
  /** Foto de portada, solo para los servicios de portafolio. */
  image?: PropertyImage;
}

/** Solo jardines y propiedades llevan imágenes. */
export type GalleryCategory = "jardines" | "propiedades";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Forma en la cuadrícula. */
  shape?: "tall" | "wide" | "square";
}

export interface Lead {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  source?: string;
}
