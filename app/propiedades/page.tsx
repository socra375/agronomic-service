import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { CatalogFull } from "@/components/properties/PropertyCatalog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProperties, getZones } from "@/lib/data";

export const metadata: Metadata = {
  title: "Propiedades en venta y alquiler",
  description:
    "Villas, casas, apartamentos, solares y fincas en Punta Cana, Playa Dorada, Samaná, Santo Domingo, Jarabacoa y más. Filtra por precio, ubicación y características.",
  alternates: { canonical: "/propiedades" },
};

export default async function PropertiesPage() {
  const [properties, zones] = await Promise.all([getProperties(), getZones()]);
  const locations = zones.filter((z) => z.count > 0).map((z) => z.name);

  return (
    <div className="pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="container-site">
        <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-gris">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-bosque">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-bosque">
              Propiedades
            </li>
          </ol>
        </nav>
        <SectionHeading
          as="h1"
          eyebrow="Catálogo"
          title="Propiedades en venta y alquiler"
          intro="Busca por zona, tipo o característica, y combina los filtros para encontrar la propiedad que se ajusta a ti."
        />
        <div className="mt-14">
          {/* useSearchParams requiere Suspense. El fallback muestra todo el catálogo sin JS (bueno para SEO). */}
          <Suspense
            fallback={
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((p) => (
                  <li key={p.id}>
                    <PropertyCard property={p} />
                  </li>
                ))}
              </ul>
            }
          >
            <CatalogFull properties={properties} locations={locations} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
