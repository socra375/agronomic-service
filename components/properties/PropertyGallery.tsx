"use client";

import { Images } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { PropertyImage } from "@/lib/types";
import { SmartImage } from "../ui/SmartImage";

const Lightbox = dynamic(() => import("../ui/Lightbox"), { ssr: false });

/** Mosaico de fotos de la ficha: una grande y hasta cuatro pequeñas. */
export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [main, ...rest] = images;
  const thumbs = rest.slice(0, 4);
  if (!main) return null;

  return (
    <>
      <div className="grid gap-3 sm:h-[34rem] sm:grid-cols-4 sm:grid-rows-2">
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-arena sm:col-span-2 sm:row-span-2 sm:aspect-auto"
          aria-label={`Ver fotos de ${title}`}
        >
          <SmartImage
            src={main.src}
            alt={main.alt}
            fill
            priority
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-(--ease-suave) group-hover:scale-105"
          />
        </button>
        {thumbs.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => setOpen(i + 1)}
            className={`group relative hidden overflow-hidden rounded-[1.25rem] bg-arena sm:block ${thumbs.length < 3 ? "sm:col-span-2" : ""}`}
            aria-label={`Ampliar: ${img.alt}`}
          >
            <SmartImage
              src={img.src}
              alt={img.alt}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-[1.2s] ease-(--ease-suave) group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen(0)}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-arena-borde bg-white px-5 text-sm font-bold text-bosque transition hover:border-bosque"
      >
        <Images className="h-4 w-4" aria-hidden />
        Ver las {images.length} fotos
      </button>

      {open != null && <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndexChange={setOpen} />}
    </>
  );
}
