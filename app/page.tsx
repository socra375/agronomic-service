import { CatalogCompact } from "@/components/properties/PropertyCatalog";
import { About } from "@/components/sections/About";
import { ConsultSection } from "@/components/sections/ConsultSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { ExploreByZone } from "@/components/sections/ExploreByZone";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { RequestSection } from "@/components/sections/RequestSection";
import { Services } from "@/components/sections/Services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getGallery, getHeroSlides, getProperties, getServices, getZones } from "@/lib/data";
import { extraServiceOptions } from "@/lib/lead-schema";

export default async function HomePage() {
  const [properties, services, gallery, zones, heroSlides] = await Promise.all([
    getProperties(),
    getServices(),
    getGallery(),
    getZones(),
    getHeroSlides(),
  ]);

  const locations = zones.filter((z) => z.count > 0).map((z) => z.name);

  // Cifras calculadas a partir de los datos, no inventadas.
  const stats = [
    { value: String(properties.length), label: "Propiedades" },
    { value: String(locations.length), label: "Zonas del país" },
    { value: String(services.length), label: "Servicios" },
    { value: "RD", label: "Empresa dominicana" },
  ];

  return (
    <>
      <Hero slides={heroSlides} locations={locations} />
      <Services services={services} />
      <ConsultSection services={services} />

      <section id="propiedades" aria-labelledby="propiedades-titulo" className="py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="propiedades-titulo"
            eyebrow="Catálogo"
            title="Casas, villas y solares en venta y alquiler"
            intro="Villas, casas, apartamentos y solares en las mejores zonas de República Dominicana. Filtra por precio, ubicación y características."
          />
          <div className="mt-12">
            <CatalogCompact properties={properties} locations={locations} />
          </div>
        </div>
      </section>

      <ExploreByZone zones={zones} />
      <Gallery images={gallery} />
      <About stats={stats} />
      <CtaBand />
      <RequestSection serviceOptions={[...services.map((s) => s.title), ...extraServiceOptions]} />
    </>
  );
}
