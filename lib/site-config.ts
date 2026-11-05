/**
 * Datos de la empresa en un solo lugar.
 * ⚠️ Lo marcado REEMPLAZAR es un marcador de posición: la presentación del proyecto
 * no indica teléfono, correo, dirección ni redes sociales.
 */
export const siteConfig = {
  name: "Agronómic Services, S. A.",
  shortName: "Agronómic Services",
  tagline: "Diseño de jardines y bienes raíces",
  description:
    "Empresa dominicana de diseño de jardines y bienes raíces. Encuentra villas, casas y solares en República Dominicana y transforma tus exteriores con un jardín a medida.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://agronomicservices.com.do", // REEMPLAZAR
  locale: "es_DO",
  contact: {
    phone: "+1 (809) 000-0000", // REEMPLAZAR
    phoneHref: "tel:+18090000000", // REEMPLAZAR
    email: "info@agronomicservices.com.do", // REEMPLAZAR
    address: "Santo Domingo, República Dominicana", // REEMPLAZAR: zona del cliente no indicada
    hours: "Lunes a sábado · 8:00 a. m. – 6:00 p. m.", // REEMPLAZAR
    lat: 18.4861, // REEMPLAZAR
    lng: -69.9312, // REEMPLAZAR
  },
  social: [
    { name: "Instagram", href: "https://instagram.com/", icon: "instagram" }, // REEMPLAZAR
    { name: "Facebook", href: "https://facebook.com/", icon: "facebook" }, // REEMPLAZAR
  ] as const,
  nav: [
    { label: "Servicios", href: "/#servicios" },
    { label: "Propiedades", href: "/propiedades" },
    { label: "Galería", href: "/#galeria" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ],
  cta: { label: "Solicitar servicio", href: "/#solicitar" },
};
