"use client";

import { Expand } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { GalleryCategory, GalleryImage } from "@/lib/types";
import { SectionHeading } from "../ui/SectionHeading";
import { SmartImage } from "../ui/SmartImage";

const Lightbox = dynamic(() => import("../ui/Lightbox"), { ssr: false });

const tabs: { value: GalleryCategory | "todas"; label: string }[] = [
  { value: "todas", label: "Todo" },
  { value: "jardines", label: "Jardines" },
  { value: "propiedades", label: "Propiedades" },
];

const shapeClass = {
  tall: "row-span-2",
  wide: "sm:col-span-2",
  square: "",
};

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [tab, setTab] = useState<GalleryCategory | "todas">("todas");
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => (tab === "todas" ? images : images.filter((i) => i.category === tab)), [images, tab]);

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="bg-bosque py-24 text-marfil sm:py-32">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="galeria-titulo"
            tone="light"
            eyebrow="Galería"
            title="Fotos de jardines y propiedades"
            intro="Jardines que hemos creado y diseñado, y propiedades de nuestro catálogo."
          />
          <div role="tablist" aria-label="Filtrar galería" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                onClick={() => setTab(t.value)}
                className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-bold tracking-[0.04em] transition ${
                  tab === t.value
                    ? "border-dorado bg-dorado text-noche"
                    : "border-marfil/25 text-marfil hover:border-marfil/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-14 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[14rem]">
          {list.map((img, i) => (
            <li key={img.id} className={shapeClass[img.shape ?? "square"]}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block h-full w-full overflow-hidden rounded-[1.25rem] bg-bosque-medio"
                aria-label={`Ampliar imagen: ${img.alt}`}
              >
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[600ms] ease-(--ease-suave) group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-noche/75 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-left font-serif text-lg italic text-marfil">{img.alt}</span>
                  <Expand className="h-5 w-5 shrink-0 text-dorado-claro" aria-hidden />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open != null && <Lightbox images={list} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />}
    </section>
  );
}
