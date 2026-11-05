import { Droplets, Flower2, Lamp, Shovel, Sprout, Trees, type LucideIcon } from "lucide-react";
import { servicesImage } from "@/lib/sample-data";
import type { Service, ServiceIcon } from "@/lib/types";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { SmartImage } from "../ui/SmartImage";

const icons: Record<ServiceIcon, LucideIcon> = {
  trees: Trees,
  sprout: Sprout,
  droplets: Droplets,
  lamp: Lamp,
  shovel: Shovel,
  flower: Flower2,
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="py-24 sm:py-32">
      <div className="container-site">
        {/* Bloque editorial: imagen + texto */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-arena">
              <SmartImage src={servicesImage.src} alt={servicesImage.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-2 max-w-[15rem] rounded-2xl bg-bosque p-6 text-marfil shadow-xl sm:-right-6">
              <p className="font-serif text-4xl leading-none text-dorado-claro">100%</p>
              <p className="mt-2 text-sm leading-snug text-salvia-claro">Diseños a la medida de tu espacio, tu clima y tu estilo de vida.</p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHeading
              id="servicios-titulo"
              eyebrow="Diseño de jardines"
              title={
                <>
                  Jardines pensados para <em className="text-salvia">disfrutarse</em>
                </>
              }
              intro="Del primer boceto al mantenimiento: creamos espacios verdes que suben el valor de tu propiedad y se adaptan al clima del Caribe."
            />
            <ButtonLink href="/#solicitar" variant="forest" size="lg" className="mt-9">
              Pedir una visita de diseño
            </ButtonLink>
          </div>
        </div>

        <ul className="mt-24 grid gap-px overflow-hidden rounded-[1.75rem] border border-arena-borde bg-arena-borde sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal as="li" key={s.id} delay={(i % 3) * 90} className="group bg-papel p-8 transition-colors duration-500 hover:bg-arena sm:p-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-salvia-claro text-bosque transition-colors duration-500 group-hover:bg-bosque group-hover:text-dorado-claro">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-7 text-[1.75rem]">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-gris">{s.description}</p>
                <ul className="mt-6 space-y-2 border-t border-arena-borde pt-5 text-sm font-semibold text-tinta">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="h-1 w-1 rounded-full bg-dorado" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
