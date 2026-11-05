import { ArrowDown, Search } from "lucide-react";
import { formatCompactUSD } from "@/lib/format";
import { priceSteps, propertyTypeLabels } from "@/lib/filters";
import { heroImage } from "@/lib/sample-data";
import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "../ui/Button";
import { SmartImage } from "../ui/SmartImage";

/**
 * Hero a sangre con barra de búsqueda flotante, al estilo de los buscadores de resorts.
 * El formulario es un GET normal a /propiedades: funciona aunque JavaScript no haya cargado.
 */
export function Hero({ locations }: { locations: string[] }) {
  return (
    <section aria-labelledby="hero-titulo" className="relative isolate flex min-h-[100svh] flex-col bg-bosque">
      <SmartImage
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-noche/55 via-noche/20 to-noche/80" aria-hidden />

      <div className="container-site flex flex-1 flex-col justify-end pb-10 pt-32 sm:pb-14">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow-light">{siteConfig.tagline}</p>
          <h1 id="hero-titulo" className="mt-5 text-[2.75rem] leading-[1.02] !text-marfil sm:text-6xl lg:text-[5.25rem]">
            Exteriores que se viven, <em className="font-normal text-dorado-claro">hogares</em> que inspiran
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-marfil/90 sm:text-xl">
            Diseñamos jardines a medida y te ayudamos a encontrar la propiedad ideal en República Dominicana.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={siteConfig.cta.href} size="lg">
              {siteConfig.cta.label}
            </ButtonLink>
            <ButtonLink href="/propiedades" size="lg" variant="outline-light">
              Ver propiedades
            </ButtonLink>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <form
          action="/propiedades"
          method="get"
          role="search"
          aria-label="Buscar propiedades"
          className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-arena-borde shadow-[0_30px_60px_-25px_rgb(19_38_27_/_0.6)] sm:grid-cols-2 lg:mt-16 lg:grid-cols-[1fr_1fr_1fr_auto] lg:rounded-full"
        >
          <label className="flex flex-col bg-papel px-6 py-3.5 lg:pl-8">
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
          <label className="flex flex-col bg-papel px-6 py-3.5">
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
          <label className="flex flex-col bg-papel px-6 py-3.5">
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
              Buscar
            </button>
          </div>
        </form>

        <a
          href="#servicios"
          className="mx-auto mt-10 hidden h-11 w-11 items-center justify-center rounded-full border border-marfil/40 text-marfil transition hover:bg-marfil hover:text-bosque sm:flex"
          aria-label="Bajar a servicios"
        >
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
