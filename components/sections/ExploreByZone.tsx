import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ZoneWithCount } from "@/lib/data";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { SmartImage } from "../ui/SmartImage";

/** Tarjetas de destino al estilo resort. Cada una abre el catálogo ya filtrado por zona. */
export function ExploreByZone({ zones }: { zones: ZoneWithCount[] }) {
  const visible = zones.filter((z) => z.count > 0).slice(0, 6);
  return (
    <section aria-labelledby="zonas-titulo" className="bg-arena py-24 sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="zonas-titulo"
            eyebrow="Explora por zona"
            title="Del Caribe a la montaña"
            intro="Elige dónde te imaginas viviendo y te mostramos lo disponible en esa zona."
          />
          <Link href="/propiedades" className="group inline-flex items-center gap-2 font-bold text-bosque">
            Ver todas las zonas
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <ul className="no-scrollbar -mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {visible.map((z, i) => (
            <Reveal as="li" key={z.name} delay={(i % 3) * 90} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Link
                href={`/propiedades?loc=${encodeURIComponent(z.name)}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-bosque sm:aspect-[4/5]"
              >
                <SmartImage
                  src={z.image.src}
                  alt={z.image.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 78vw"
                  className="object-cover transition-transform duration-[1.2s] ease-(--ease-suave) group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noche/85 via-noche/10 to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-dorado-claro">{z.province}</p>
                  <h3 className="mt-2 text-4xl !text-marfil">{z.name}</h3>
                  <p className="mt-1 text-marfil/85">{z.tagline}</p>
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-marfil/15 px-4 py-1.5 text-sm font-semibold text-marfil backdrop-blur">
                    {z.count} {z.count === 1 ? "propiedad" : "propiedades"}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
