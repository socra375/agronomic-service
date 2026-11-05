import { ArrowUpRight, ClipboardCheck, Flower2, Lightbulb, Sprout, Trees, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Service, ServiceIcon } from "@/lib/types";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { SmartImage } from "../ui/SmartImage";

export const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  trees: Trees,
  flower: Flower2,
  sprout: Sprout,
  clipboard: ClipboardCheck,
  lightbulb: Lightbulb,
};

/** Servicios con portafolio de fotos: Jardinería y Diseños Ornamentales. */
export function Services({ services }: { services: Service[] }) {
  const portfolio = services.filter((s) => s.mode === "portafolio");

  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="servicios-titulo"
            eyebrow="Nuestros servicios"
            title={
              <>
                Jardines pensados para <em className="text-salvia">disfrutarse</em>
              </>
            }
            intro="Creamos, diseñamos y cuidamos espacios verdes que suben el valor de tu propiedad y se adaptan al clima del Caribe."
          />
          <ButtonLink href="/#galeria" variant="outline" size="lg" className="self-start lg:self-auto">
            Ver proyectos realizados
          </ButtonLink>
        </div>

        <ul className="mt-16 grid gap-8 lg:grid-cols-2">
          {portfolio.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            return (
              <Reveal as="li" key={s.id} delay={i * 120}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-papel ring-1 ring-arena-borde">
                  <div className="relative aspect-[16/10] overflow-hidden bg-arena">
                    {s.image && (
                      <SmartImage
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover transition-transform duration-[1.2s] ease-(--ease-suave) group-hover:scale-105"
                      />
                    )}
                    <span className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-marfil/95 text-bosque">
                      <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-8 sm:p-10">
                    <h3 className="text-4xl">{s.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-gris">{s.description}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {s.includes.map((item) => (
                        <li key={item} className="rounded-full bg-arena px-3.5 py-1.5 text-sm font-semibold text-bosque">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                      <ButtonLink href="/#solicitar" variant="forest">
                        Solicitar {s.title.toLowerCase()}
                      </ButtonLink>
                      <Link href="/#galeria" className="group/link inline-flex items-center gap-1.5 font-bold text-bosque">
                        Ver fotos
                        <ArrowUpRight className="h-4 w-4 transition group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
