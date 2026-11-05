"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { SmartImage } from "./SmartImage";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface Props {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/** Visor a pantalla completa: teclado (← → Esc), gestos táctiles, contador y foco atrapado. */
export default function Lightbox({ images, index, onClose, onIndexChange }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const total = images.length;
  const current = images[index];

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!current) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ${index + 1} de ${total}: ${current.alt}`}
      className="fixed inset-0 z-[100] flex flex-col bg-noche/95 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-marfil sm:px-6">
        <p className="text-sm tracking-[0.2em]" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-marfil transition hover:bg-marfil/10"
          aria-label="Cerrar galería"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="pointer-events-none absolute inset-x-4 inset-y-2 sm:inset-x-20">
          <SmartImage
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-noche/60 text-marfil transition hover:bg-marfil hover:text-bosque sm:left-5"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-noche/60 text-marfil transition hover:bg-marfil hover:text-bosque sm:right-5"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      <p className="px-6 pb-5 pt-3 text-center font-serif text-lg italic text-salvia-claro">{current.alt}</p>
    </div>
  );
}
