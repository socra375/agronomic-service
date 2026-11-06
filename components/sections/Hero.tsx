import { Search } from "lucide-react";
import { formatCompactUSD } from "@/lib/format";
import { priceSteps, propertyTypeLabels } from "@/lib/filters";
import { siteConfig } from "@/lib/site-config";
import type { HeroSlide } from "@/lib/types";
import { ButtonLink } from "../ui/Button";
import { HeroSlideshow } from "./HeroSlideshow";

/**
 * Hero: fotos que se alternan (HeroSlideshow) + texto fijo.
 * El h1 nombra la categoría y el lugar (no cambia con las fotos, bueno para SEO).
 * El buscador es un GET normal a /propiedades: funciona aunque JavaScript no haya cargado.
 */
export function Hero({ slides, locations }: { slides: HeroSlide[]; locations: string[] }) {
  return (
    <HeroSlideshow slides={slides}>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-xl">
          <h1 className="font-sans text-sm font-bold uppercase tracking-[0.2em] !text-dorado-claro">
            Jardinería y bienes raíces en República Dominicana
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-marfil/90">
            Diseñamos, sembramos y cuidamos jardines, y vendemos y alquilamos casas, villas y solares en Punta Cana, Santo Domingo,
            Santiago y otras zonas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={siteConfig.cta.href} size="lg">
            {siteConfig.cta.label}
          </ButtonLink>
          <ButtonLink href="/propiedades" size="lg" variant="outline-light">
            Ver propiedades
          </ButtonLink>
        </div>
      </div>

      {/* En móvil se oculta: el catálogo de la portada ya trae filtros y así el hero cabe en una pantalla */}
      <form
        action="/propiedades"
        method="get"
        role="search"
        aria-label="Buscar propiedades"
        className="mt-8 hidden gap-px overflow-hidden rounded-2xl bg-arena-borde sm:grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:rounded-full"
      >
        <label className="flex flex-col bg-papel px-6 py-3 lg:pl-8">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-dorado-oscuro">Ubicación</span>
          <select name="loc" className="mt-0.5 appearance-none bg-transparent py-1 text-base font-semibold text-bosque focus:outline-none" defaultValue="">
            <option value="">Todas las zonas</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col bg-papel px-6 py-3">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-dorado-oscuro">Tipo</span>
          <select name="tipo" className="mt-0.5 appearance-none bg-transparent py-1 text-base font-semibold text-bosque focus:outline-none" defaultValue="">
            <option value="">Cualquier tipo</option>
            {Object.entries(propertyTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col bg-papel px-6 py-3">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-dorado-oscuro">Presupuesto</span>
          <select name="max" className="mt-0.5 appearance-none bg-transparent py-1 text-base font-semibold text-bosque focus:outline-none" defaultValue="">
            <option value="">Sin límite</option>
            {priceSteps.map((v) => (
              <option key={v} value={v}>
                Hasta {formatCompactUSD(v)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex bg-papel p-2 sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-bosque px-8 font-bold tracking-[0.06em] text-marfil transition hover:bg-bosque-medio lg:rounded-full"
          >
            <Search className="h-4 w-4" aria-hidden />
            Buscar propiedades
          </button>
        </div>
      </form>
    </HeroSlideshow>
  );
}
