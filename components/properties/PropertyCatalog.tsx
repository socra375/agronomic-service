"use client";

import { ArrowRight, SearchX, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  countActiveFilters,
  emptyFilters,
  filterProperties,
  parseFilters,
  serializeFilters,
  type PropertyFilters,
} from "@/lib/filters";
import type { Property } from "@/lib/types";
import { Button, ButtonLink } from "../ui/Button";
import {
  ActiveFilterChips,
  FilterPanel,
  LocationSelect,
  OperationToggle,
  PriceSelect,
  SearchBox,
  SortSelect,
  TypeSelect,
  type FiltersChange,
} from "./FilterControls";
import { PropertyCard } from "./PropertyCard";

interface CatalogProps {
  properties: Property[];
  locations: string[];
}

function resultsLabel(n: number) {
  return n === 1 ? "1 propiedad" : `${n} propiedades`;
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-[1.5rem] border border-dashed border-arena-borde bg-papel px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-arena text-bosque">
        <SearchX className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-6 text-3xl">No encontramos coincidencias</h3>
      <p className="mt-3 max-w-md text-gris">
        Prueba con menos filtros u otra zona. Si buscas algo muy específico, escríbenos y lo buscamos por ti.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="forest" onClick={onClear}>
          Limpiar filtros
        </Button>
        <ButtonLink href="/#solicitar" variant="outline">
          Contarnos qué buscas
        </ButtonLink>
      </div>
    </div>
  );
}

function Grid({ items }: { items: Property[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p, i) => (
        <li key={p.id}>
          <PropertyCard property={p} priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}

/* ======================================================================
 * Variante completa (/propiedades): barra lateral, cajón móvil y estado en la URL.
 * ==================================================================== */

const PAGE_SIZE = 9;

export function CatalogFull({ properties, locations }: CatalogProps) {
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // replaceState de la History API: actualiza useSearchParams sin pedir nada al servidor.
  const setFilters = useCallback((next: PropertyFilters) => {
    const qs = serializeFilters(next);
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setVisible(PAGE_SIZE);
  }, []);

  const onChange: FiltersChange = useCallback((patch) => setFilters({ ...filters, ...patch }), [filters, setFilters]);
  const clear = useCallback(() => setFilters({ ...emptyFilters, sort: filters.sort }), [filters.sort, setFilters]);

  const results = useMemo(() => filterProperties(properties, filters), [properties, filters]);
  const active = countActiveFilters(filters);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <div className="grid gap-10 lg:grid-cols-[18.5rem_1fr] xl:gap-14">
      {/* Barra lateral (escritorio) */}
      <aside className="hidden lg:block" aria-label="Filtros">
        <div className="sticky top-28 rounded-[1.5rem] bg-papel p-7 ring-1 ring-arena-borde">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-serif text-2xl text-bosque">Filtros</p>
            {active > 0 && (
              <button type="button" onClick={clear} className="text-sm font-bold text-dorado-oscuro hover:underline">
                Limpiar ({active})
              </button>
            )}
          </div>
          <FilterPanel filters={filters} locations={locations} onChange={onChange} idPrefix="lateral" />
        </div>
      </aside>

      <div className="min-w-0">
        <SearchBox value={filters.q} onChange={(q) => onChange({ q })} id="buscar-catalogo" />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-bosque" aria-live="polite">
            {resultsLabel(results.length)}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-arena-borde bg-white px-4 text-sm font-bold text-bosque lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filtros
              {active > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bosque px-1 text-[0.6875rem] text-marfil">{active}</span>
              )}
            </button>
            <SortSelect value={filters.sort} onChange={(sort) => onChange({ sort })} />
          </div>
        </div>

        <div className="mt-4">
          <ActiveFilterChips filters={filters} onChange={onChange} onClear={clear} />
        </div>

        <div className="mt-8">
          {results.length ? (
            <>
              <Grid items={results.slice(0, visible)} />
              {visible < results.length && (
                <div className="mt-12 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Mostrar más ({results.length - visible})
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState onClear={clear} />
          )}
        </div>
      </div>

      {/* Cajón de filtros (móvil y tablet) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button type="button" className="absolute inset-0 bg-noche/50" onClick={() => setDrawerOpen(false)} aria-label="Cerrar filtros" tabIndex={-1} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-marfil shadow-2xl">
            <div className="flex items-center justify-between border-b border-arena-borde px-5 py-4">
              <p className="font-serif text-2xl text-bosque">Filtros</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-bosque hover:bg-arena"
                aria-label="Cerrar filtros"
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <FilterPanel filters={filters} locations={locations} onChange={onChange} idPrefix="cajon" />
            </div>
            <div className="flex gap-3 border-t border-arena-borde px-5 py-4">
              <Button variant="outline" onClick={clear} className="flex-1" disabled={active === 0}>
                Limpiar
              </Button>
              <Button variant="forest" onClick={() => setDrawerOpen(false)} className="flex-[2]">
                Ver {resultsLabel(results.length)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ======================================================================
 * Variante compacta (portada): barra horizontal, 6 resultados y enlace al catálogo.
 * ==================================================================== */

export function CatalogCompact({ properties, locations }: CatalogProps) {
  const [filters, setFilters] = useState<PropertyFilters>(emptyFilters);
  const onChange: FiltersChange = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const results = useMemo(() => filterProperties(properties, filters), [properties, filters]);
  const qs = serializeFilters(filters);
  const shown = results.slice(0, 6);

  return (
    <div>
      <div className="rounded-[1.5rem] bg-papel p-4 ring-1 ring-arena-borde sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <SearchBox value={filters.q} onChange={(q) => onChange({ q })} id="buscar-portada" className="md:col-span-2 xl:col-span-1" />
          <LocationSelect id="portada-loc" value={filters.location} locations={locations} onChange={(location) => onChange({ location })} />
          <TypeSelect id="portada-tipo" value={filters.type} onChange={(type) => onChange({ type })} />
          <PriceSelect id="portada-max" kind="max" value={filters.maxPrice} onChange={(maxPrice) => onChange({ maxPrice })} />
          <ButtonLink href={`/propiedades${qs ? `?${qs}` : ""}`} variant="outline" className="!min-h-12">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Más filtros
          </ButtonLink>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-72">
            <OperationToggle value={filters.operation} onChange={(operation) => onChange({ operation })} />
          </div>
          <p className="text-sm font-semibold text-tinta" aria-live="polite">
            {resultsLabel(results.length)}
          </p>
        </div>
      </div>

      <div className="mt-10">
        {shown.length ? <Grid items={shown} /> : <EmptyState onClear={() => setFilters(emptyFilters)} />}
      </div>

      {results.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Link
            href={`/propiedades${qs ? `?${qs}` : ""}`}
            className="group inline-flex items-center gap-3 font-serif text-2xl text-bosque"
          >
            Ver {results.length > shown.length ? `las ${results.length} propiedades` : "el catálogo completo"}
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bosque text-marfil transition group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
