"use client";

import { Check, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  featureLabels,
  operationLabels,
  priceSteps,
  propertyTypeLabels,
  sortLabels,
  type PropertyFilters,
  type SortKey,
} from "@/lib/filters";
import { formatCompactUSD } from "@/lib/format";
import type { FeatureKey, Operation, PropertyType } from "@/lib/types";

export type FiltersChange = (patch: Partial<PropertyFilters>) => void;

/* ---------- Buscador con debounce ---------- */

export function SearchBox({
  value,
  onChange,
  className = "",
  id = "buscar",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  id?: string;
}) {
  const [text, setText] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(onChange);
  latest.current = onChange;

  // Si el valor cambia desde fuera (p. ej. «Limpiar»), se refleja en el input.
  useEffect(() => setText(value), [value]);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const update = (v: string) => {
    setText(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => latest.current(v), 250);
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar propiedades
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gris" aria-hidden />
      <input
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="Buscar por zona, tipo o característica…"
        value={text}
        onChange={(e) => update(e.target.value)}
        className="field !rounded-full !pl-11 !pr-11"
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText("");
            latest.current("");
          }}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gris hover:bg-arena hover:text-bosque"
          aria-label="Borrar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ---------- Piezas reutilizables ---------- */

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-arena-borde pt-6 first:border-t-0 first:pt-0">
      <legend className="label mb-3 !text-xs uppercase !tracking-[0.18em] text-dorado-oscuro">{title}</legend>
      {children}
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition ${
        active ? "border-bosque bg-bosque text-marfil" : "border-arena-borde bg-white text-tinta hover:border-bosque/40"
      }`}
    >
      {active && <Check className="h-3.5 w-3.5" aria-hidden />}
      {children}
    </button>
  );
}

export function OperationToggle({ value, onChange }: { value: Operation | ""; onChange: (v: Operation | "") => void }) {
  const options: [Operation | "", string][] = [["", "Todas"], ...(Object.entries(operationLabels) as [Operation, string][])];
  return (
    <div role="radiogroup" aria-label="Operación" className="inline-flex w-full rounded-full border border-arena-borde bg-white p-1">
      {options.map(([v, label]) => (
        <button
          key={label}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`min-h-10 flex-1 rounded-full px-4 text-sm font-bold transition ${
            value === v ? "bg-bosque text-marfil" : "text-tinta hover:text-bosque"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function LocationSelect({
  value,
  locations,
  onChange,
  id = "filtro-ubicacion",
}: {
  value: string;
  locations: string[];
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        Ubicación
      </label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todas las zonas</option>
        {locations.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </>
  );
}

export function TypeSelect({ value, onChange, id = "filtro-tipo" }: { value: PropertyType | ""; onChange: (v: PropertyType | "") => void; id?: string }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        Tipo de propiedad
      </label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value as PropertyType | "")}>
        <option value="">Cualquier tipo</option>
        {Object.entries(propertyTypeLabels).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

export function PriceSelect({
  kind,
  value,
  onChange,
  id,
}: {
  kind: "min" | "max";
  value: number | null;
  onChange: (v: number | null) => void;
  id: string;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {kind === "min" ? "Precio mínimo" : "Precio máximo"}
      </label>
      <select
        id={id}
        className="field"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      >
        <option value="">{kind === "min" ? "Sin mínimo" : "Sin máximo"}</option>
        {priceSteps.map((v) => (
          <option key={v} value={v}>
            {kind === "min" ? "Desde" : "Hasta"} {formatCompactUSD(v)}
          </option>
        ))}
      </select>
    </>
  );
}

export function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="orden" className="hidden text-sm font-semibold text-gris sm:block">
        Ordenar:
      </label>
      <select id="orden" className="field !min-h-11 !w-auto !py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value as SortKey)}>
        {Object.entries(sortLabels).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------- Panel completo (barra lateral y cajón móvil) ---------- */

export function FilterPanel({
  filters,
  locations,
  onChange,
  idPrefix,
}: {
  filters: PropertyFilters;
  locations: string[];
  onChange: FiltersChange;
  idPrefix: string;
}) {
  const toggleFeature = (f: FeatureKey) =>
    onChange({
      features: filters.features.includes(f) ? filters.features.filter((x) => x !== f) : [...filters.features, f],
    });

  return (
    <div className="space-y-6">
      <Group title="Operación">
        <OperationToggle value={filters.operation} onChange={(operation) => onChange({ operation })} />
      </Group>

      <Group title="Ubicación">
        <LocationSelect id={`${idPrefix}-loc`} value={filters.location} locations={locations} onChange={(location) => onChange({ location })} />
      </Group>

      <Group title="Tipo">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(propertyTypeLabels) as [PropertyType, string][]).map(([v, label]) => (
            <Chip key={v} active={filters.type === v} onClick={() => onChange({ type: filters.type === v ? "" : v })}>
              {label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Precio (USD)">
        {/* En la barra lateral (lg) no caben dos selectores lado a lado */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <PriceSelect id={`${idPrefix}-min`} kind="min" value={filters.minPrice} onChange={(minPrice) => onChange({ minPrice })} />
          <PriceSelect id={`${idPrefix}-max`} kind="max" value={filters.maxPrice} onChange={(maxPrice) => onChange({ maxPrice })} />
        </div>
      </Group>

      <Group title="Habitaciones">
        <div className="flex flex-wrap gap-2">
          <Chip active={filters.bedrooms == null} onClick={() => onChange({ bedrooms: null })}>
            Todas
          </Chip>
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} active={filters.bedrooms === n} onClick={() => onChange({ bedrooms: filters.bedrooms === n ? null : n })}>
              {n}+
            </Chip>
          ))}
        </div>
      </Group>

      <Group title="Características">
        <div className="flex flex-wrap gap-2">
          {(Object.entries(featureLabels) as [FeatureKey, string][]).map(([v, label]) => (
            <Chip key={v} active={filters.features.includes(v)} onClick={() => toggleFeature(v)}>
              {label}
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  );
}

/* ---------- Chips de filtros activos ---------- */

export function ActiveFilterChips({ filters, onChange, onClear }: { filters: PropertyFilters; onChange: FiltersChange; onClear: () => void }) {
  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.q.trim()) chips.push({ key: "q", label: `«${filters.q.trim()}»`, remove: () => onChange({ q: "" }) });
  if (filters.operation) chips.push({ key: "op", label: operationLabels[filters.operation], remove: () => onChange({ operation: "" }) });
  if (filters.location) chips.push({ key: "loc", label: filters.location, remove: () => onChange({ location: "" }) });
  if (filters.type) chips.push({ key: "tipo", label: propertyTypeLabels[filters.type], remove: () => onChange({ type: "" }) });
  if (filters.minPrice != null) chips.push({ key: "min", label: `Desde ${formatCompactUSD(filters.minPrice)}`, remove: () => onChange({ minPrice: null }) });
  if (filters.maxPrice != null) chips.push({ key: "max", label: `Hasta ${formatCompactUSD(filters.maxPrice)}`, remove: () => onChange({ maxPrice: null }) });
  if (filters.bedrooms != null) chips.push({ key: "hab", label: `${filters.bedrooms}+ hab.`, remove: () => onChange({ bedrooms: null }) });
  for (const f of filters.features) {
    chips.push({ key: `car-${f}`, label: featureLabels[f], remove: () => onChange({ features: filters.features.filter((x) => x !== f) }) });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filtros activos">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-salvia-claro px-3.5 text-sm font-semibold text-bosque transition hover:bg-salvia-medio"
          aria-label={`Quitar filtro ${c.label}`}
        >
          {c.label}
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ))}
      <button type="button" onClick={onClear} className="ml-1 min-h-9 px-2 text-sm font-bold text-dorado-oscuro underline-offset-4 hover:underline">
        Limpiar todo
      </button>
    </div>
  );
}
