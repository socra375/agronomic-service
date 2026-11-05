import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading } from "../ui/SectionHeading";
import { RequestForm } from "./RequestForm";

/** Sección «Solicitar» + «Contacto» de la portada. */
export function RequestSection({ serviceOptions }: { serviceOptions: string[] }) {
  const { contact } = siteConfig;
  const items = [
    { icon: Phone, label: "Teléfono", value: contact.phone, href: contact.phoneHref },
    { icon: Mail, label: "Correo", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Ubicación", value: contact.address },
    { icon: Clock, label: "Horario", value: contact.hours },
  ];

  return (
    <section id="solicitar" aria-labelledby="solicitar-titulo" className="bg-arena py-24 sm:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="solicitar-titulo"
            eyebrow="Solicitar servicio"
            title="Cuéntanos tu idea"
            intro="Déjanos tus datos y te contactamos para coordinar una visita, enviarte una propuesta o mostrarte propiedades."
          />
          <ul id="contacto" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-1" aria-label="Datos de contacto">
            {items.map((it) => (
              <li key={it.label} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bosque text-dorado-claro">
                  <it.icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-dorado-oscuro">{it.label}</p>
                  {it.href ? (
                    <a href={it.href} className="mt-0.5 block break-words font-semibold text-bosque hover:underline">
                      {it.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 font-semibold text-bosque">{it.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <RequestForm serviceOptions={serviceOptions} source="Portada" />
        </div>
      </div>
    </section>
  );
}
