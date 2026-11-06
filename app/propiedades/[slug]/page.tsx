import { Bath, BedDouble, Car, Check, MapPin, Maximize, Ruler } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapEmbed } from "@/components/layout/MapEmbed";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { RequestForm } from "@/components/sections/RequestForm";
import { getProperties, getPropertyBySlug, getServices, getSimilarProperties } from "@/lib/data";
import { featureLabels, operationLabels, propertyTypeLabels } from "@/lib/filters";
import { formatArea, formatPrice } from "@/lib/format";
import { extraServiceOptions } from "@/lib/lead-schema";
import { jsonLdScript, propertyJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const properties = await getProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return { title: "Propiedad no encontrada" };
  const title = `${p.title} · ${propertyTypeLabels[p.type]} en ${operationLabels[p.operation].toLowerCase()} en ${p.location}`;
  return {
    title,
    description: `${p.summary} ${formatPrice(p)}.`,
    alternates: { canonical: `/propiedades/${p.slug}` },
    openGraph: {
      title,
      description: p.summary,
      images: p.images.slice(0, 1).map((i) => ({ url: i.src, alt: i.alt })),
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) notFound();

  const [similar, services] = await Promise.all([getSimilarProperties(p), getServices()]);
  const isLand = p.type === "solar";

  const facts = [
    !isLand && { icon: BedDouble, label: "Habitaciones", value: String(p.bedrooms) },
    !isLand && { icon: Bath, label: "Baños", value: String(p.bathrooms) },
    { icon: Maximize, label: isLand ? "Superficie" : "Construcción", value: formatArea(p.areaM2) },
    p.lotM2 && !isLand && { icon: Ruler, label: "Terreno", value: formatArea(p.lotM2) },
    p.parking && { icon: Car, label: "Parqueos", value: String(p.parking) },
  ].filter(Boolean) as { icon: typeof Bath; label: string; value: string }[];

  const serviceOptions = ["Información sobre esta propiedad", ...services.map((s) => s.title), ...extraServiceOptions];

  return (
    <article className="pb-24 pt-28 sm:pb-32 sm:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(propertyJsonLd(p))} />

      <div className="container-site">
        <nav aria-label="Ruta de navegación" className="mb-6 text-sm text-gris">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-bosque">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/propiedades" className="hover:text-bosque">
                Propiedades
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/propiedades?loc=${encodeURIComponent(p.location)}`} className="hover:text-bosque">
                {p.location}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-bosque">
              {p.title}
            </li>
          </ol>
        </nav>

        <header className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-bosque px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-marfil">
                {operationLabels[p.operation]}
              </span>
              <span className="rounded-full bg-arena px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-bosque">
                {propertyTypeLabels[p.type]}
              </span>
            </div>
            <h1 className="mt-4 text-5xl sm:text-6xl">{p.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-lg text-tinta">
              <MapPin className="h-4 w-4 text-dorado-oscuro" aria-hidden />
              {p.address}, {p.location}
            </p>
          </div>
          <p className="font-serif text-4xl font-semibold text-bosque sm:text-5xl">{formatPrice(p)}</p>
        </header>

        <PropertyGallery images={p.images} title={p.title} />

        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <dl className="grid grid-cols-2 [&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1 gap-px overflow-hidden rounded-[1.25rem] bg-arena-borde ring-1 ring-arena-borde sm:grid-cols-3 lg:grid-cols-5">
              {facts.map((f) => (
                <div key={f.label} className="bg-papel p-5">
                  <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-gris">
                    <f.icon className="h-4 w-4 text-salvia" aria-hidden />
                    {f.label}
                  </dt>
                  <dd className="mt-2 font-serif text-3xl font-semibold leading-none text-bosque">{f.value}</dd>
                </div>
              ))}
            </dl>

            <section aria-labelledby="descripcion" className="mt-14">
              <p className="eyebrow">Descripción</p>
              <h2 id="descripcion" className="mt-3 text-4xl">
                {p.summary}
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-tinta">
                {p.description.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </section>

            <section aria-labelledby="caracteristicas" className="mt-14">
              <p className="eyebrow">Características</p>
              <h2 id="caracteristicas" className="mt-3 text-4xl">
                Lo que incluye
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 rounded-xl bg-papel px-4 py-3.5 font-semibold text-bosque ring-1 ring-arena-borde">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-salvia-claro">
                      <Check className="h-4 w-4" aria-hidden />
                    </span>
                    {featureLabels[f]}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="ubicacion" className="mt-14">
              <p className="eyebrow">Ubicación</p>
              <h2 id="ubicacion" className="mt-3 text-4xl">
                {p.location}
              </h2>
              <MapEmbed
                lat={p.lat}
                lng={p.lng}
                zoom={0.03}
                title={`Mapa de ${p.title} en ${p.location}`}
                className="mt-6 h-80 overflow-hidden rounded-[1.25rem] ring-1 ring-arena-borde"
              />
              <p className="mt-3 text-sm text-gris">La ubicación en el mapa es aproximada.</p>
            </section>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4" aria-labelledby="solicitar-info">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-t-[1.5rem] bg-bosque px-6 py-6 text-marfil">
                <p className="eyebrow eyebrow-light">Información y visitas</p>
                <h2 id="solicitar-info" className="mt-2 text-3xl !text-marfil">
                  Solicita información o una visita
                </h2>
                <p className="mt-2 text-sm text-salvia-claro">
                  O llámanos al{" "}
                  <a href={siteConfig.contact.phoneHref} className="font-bold text-marfil underline-offset-4 hover:underline">
                    {siteConfig.contact.phone}
                  </a>
                </p>
              </div>
              <div className="[&>form]:rounded-t-none">
                <RequestForm
                  compact
                  serviceOptions={serviceOptions}
                  defaultService="Información sobre esta propiedad"
                  defaultMessage={`Hola, me interesa «${p.title}» (${p.location}). ¿Podrían darme más información?`}
                  source={`Propiedad: ${p.slug}`}
                />
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section aria-labelledby="similares" className="mt-24 border-t border-arena-borde pt-16">
            <p className="eyebrow">También te puede interesar</p>
            <h2 id="similares" className="mt-3 text-4xl sm:text-5xl">
              Propiedades similares
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((s) => (
                <li key={s.id}>
                  <PropertyCard property={s} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
