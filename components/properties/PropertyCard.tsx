import { Bath, BedDouble, MapPin, Maximize } from "lucide-react";
import Link from "next/link";
import { operationLabels, propertyTypeLabels } from "@/lib/filters";
import { formatArea, formatPrice } from "@/lib/format";
import type { Property } from "@/lib/types";
import { SmartImage } from "../ui/SmartImage";

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const p = property;
  const cover = p.images[0];
  const isLand = p.type === "solar";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-papel shadow-[0_1px_0_rgb(31_58_43_/_0.06)] ring-1 ring-arena-borde transition-all duration-500 ease-(--ease-suave) hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-30px_rgb(31_58_43_/_0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-arena">
        {cover && (
          <SmartImage
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 26vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-(--ease-suave) group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-marfil/95 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bosque">
            {operationLabels[p.operation]}
          </span>
          {p.featured && (
            <span className="rounded-full bg-dorado px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-noche">
              Destacada
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-dorado-oscuro">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {p.location} · {propertyTypeLabels[p.type]}
        </p>
        <h3 className="mt-3 text-[1.75rem]">
          {/* El enlace cubre toda la tarjeta */}
          <Link href={`/propiedades/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {p.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-gris">{p.summary}</p>

        <div className="mt-auto pt-6">
          <dl className="flex flex-wrap gap-x-5 gap-y-2 border-t border-arena-borde pt-5 text-sm font-semibold text-tinta">
            {!isLand && (
              <>
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Habitaciones</dt>
                  <BedDouble className="h-4 w-4 text-salvia" aria-hidden />
                  <dd>{p.bedrooms} hab.</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Baños</dt>
                  <Bath className="h-4 w-4 text-salvia" aria-hidden />
                  <dd>{p.bathrooms} baños</dd>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Superficie</dt>
              <Maximize className="h-4 w-4 text-salvia" aria-hidden />
              <dd>{formatArea(p.areaM2)}</dd>
            </div>
          </dl>
          <p className="mt-4 font-serif text-[1.75rem] font-semibold leading-none text-bosque">{formatPrice(p)}</p>
        </div>
      </div>
    </article>
  );
}
