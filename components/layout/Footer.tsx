import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getZones } from "@/lib/data";
import { Logo } from "../ui/Logo";
import { SocialIcon } from "../ui/SocialIcon";
import { MapEmbed } from "./MapEmbed";

export async function Footer() {
  const { contact } = siteConfig;
  const zones = await getZones();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bosque text-salvia-claro" aria-labelledby="footer-titulo">
      <h2 id="footer-titulo" className="sr-only">
        Información de contacto
      </h2>
      <div className="container-site grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm leading-relaxed">{siteConfig.description}</p>
          <ul className="mt-8 flex gap-3">
            {siteConfig.social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-marfil/20 text-marfil transition hover:border-dorado hover:bg-dorado hover:text-noche"
                >
                  <SocialIcon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
          <div>
            <p className="eyebrow eyebrow-light">Explora</p>
            <ul className="mt-5 space-y-3">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-marfil">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={siteConfig.cta.href} className="transition hover:text-marfil">
                  Solicitar servicio
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow eyebrow-light">Zonas</p>
            <ul className="mt-5 space-y-3">
              {zones.slice(0, 6).map((z) => (
                <li key={z.name}>
                  <Link href={`/propiedades?loc=${encodeURIComponent(z.name)}`} className="transition hover:text-marfil">
                    {z.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4">
          <p className="eyebrow eyebrow-light">Contacto</p>
          <address className="mt-5 space-y-4 not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-dorado-claro" aria-hidden />
              {contact.address}
            </p>
            <p className="flex gap-3">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-dorado-claro" aria-hidden />
              <a href={contact.phoneHref} className="transition hover:text-marfil">
                {contact.phone}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-dorado-claro" aria-hidden />
              <a href={`mailto:${contact.email}`} className="break-all transition hover:text-marfil">
                {contact.email}
              </a>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-dorado-claro" aria-hidden />
              {contact.hours}
            </p>
          </address>
          <MapEmbed
            lat={contact.lat}
            lng={contact.lng}
            title={`Mapa: ${contact.address}`}
            className="mt-6 h-44 overflow-hidden rounded-lg border border-marfil/10"
          />
        </div>
      </div>

      <div className="border-t border-marfil/10">
        <div className="container-site flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name} Todos los derechos reservados.
          </p>
          <p className="text-salvia-medio">República Dominicana</p>
        </div>
      </div>
    </footer>
  );
}
