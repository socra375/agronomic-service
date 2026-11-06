"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { HeroSlide } from "@/lib/types";
import { SmartImage } from "../ui/SmartImage";

/**
 * Hero con fotos que se alternan (jardines y propiedades).
 *
 * - Fundido lento entre fotos con un acercamiento suave (Ken Burns).
 * - El título entra letra por letra en cada cambio; el saliente sube y desaparece.
 * - El tiempo lo marca la barra de progreso (animación CSS): al terminar, avanza.
 *   Pausar congela la barra, así la foto y la barra siempre van juntas.
 * - Con «reducir movimiento» no avanza solo ni anima letras; se navega con los botones.
 * - El primer título se ve completo desde el primer cuadro (no se anima al cargar).
 */

const SLIDE_MS = 6500;

function AnimatedTitle({ text, state }: { text: string; state: "in" | "out" | "static" }) {
  let i = 0;
  return (
    <span className={`hs-title hs-title--${state}`} aria-hidden={state === "out" || undefined}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="hs-word">
          {[...word].map((ch) => (
            <span key={i} className="hs-letter" style={{ "--i": i++ } as CSSProperties}>
              {ch}
            </span>
          ))}
          {/* espacio entre palabras fuera del recorte */}
          {" "}
        </span>
      ))}
    </span>
  );
}

export function HeroSlideshow({ slides, children }: { slides: HeroSlide[]; children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [changed, setChanged] = useState(false); // false hasta el primer cambio: el título inicial no se anima
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const prevTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = slides.length;
  const paused = userPaused || hidden || reduced;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    const onVis = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", onVis);
      if (prevTimer.current) clearTimeout(prevTimer.current);
    };
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const target = (next + total) % total;
      if (target === index) return;
      setPrev(index);
      setIndex(target);
      setChanged(true);
      if (prevTimer.current) clearTimeout(prevTimer.current);
      prevTimer.current = setTimeout(() => setPrev(null), 1500);
    },
    [index, total],
  );

  const current = slides[index];
  const previous = prev != null ? slides[prev] : null;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Jardines y propiedades destacadas"
      className={`hs relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-noche ${reduced ? "hs--reduced" : ""}`}
    >
      {/* Fotos */}
      <div className="absolute inset-0 -z-10">
        {slides.map((s, i) => {
          const state = i === index ? "is-active" : i === prev ? "is-leaving" : "";
          return (
            <div key={s.id} className={`hs-img ${state}`} aria-hidden={i !== index}>
              <div className="hs-img__zoom">
                <SmartImage
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
        {/* Sombra solo donde va el texto: abajo y a la izquierda, para que la foto se vea */}
        <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/45 to-noche/35" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-noche/55 via-noche/10 to-transparent" aria-hidden />
      </div>

      <div className="container-site flex flex-1 flex-col justify-end pb-8 pt-32 sm:pb-12">
        {/* Título que cambia con cada foto */}
        <p className="hs-stage max-w-[68rem] font-serif text-[2.75rem] leading-[1.02] text-marfil sm:text-6xl lg:text-[5.5rem]" aria-live={paused ? "polite" : "off"}>
          {previous && changed && <AnimatedTitle key={`out-${previous.id}-${index}`} text={previous.title} state="out" />}
          <AnimatedTitle key={`in-${current.id}`} text={current.title} state={changed && !reduced ? "in" : "static"} />
        </p>

        {/* Texto fijo: h1, subtítulo, botones y buscador */}
        {children}

        {/* Controles */}
        <div className="mt-8 flex flex-col gap-4 border-t border-marfil/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={current.href}
            className="group inline-flex min-h-11 min-w-0 items-center gap-3 text-marfil"
            aria-label={`${current.label}: ${current.detail ?? current.title}`}
          >
            <span className="shrink-0 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-dorado-claro">{current.label}</span>
            <span className="truncate text-sm font-semibold sm:text-base">{current.detail}</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]" aria-hidden />
          </Link>

          <div className="flex items-center gap-4">
            <p className="font-serif text-lg tabular-nums text-marfil" aria-hidden>
              {String(index + 1).padStart(2, "0")}
              <span className="text-marfil/50"> / {String(total).padStart(2, "0")}</span>
            </p>
            <div className="flex flex-1 gap-1.5 sm:w-48 sm:flex-none" role="group" aria-label="Elegir foto">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className="group relative h-11 flex-1"
                  aria-label={`Foto ${i + 1}: ${s.title}`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-marfil/25 transition-colors group-hover:bg-marfil/45">
                    {i < index && <span className="absolute inset-0 bg-marfil/70" />}
                    {i === index && (
                      <span
                        key={`${s.id}-${index}`}
                        className="hs-progress absolute inset-0 origin-left bg-dorado-claro"
                        style={{
                          animationDuration: `${SLIDE_MS}ms`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                        onAnimationEnd={() => {
                          // Con «reducir movimiento» la regla global acorta las animaciones: no avanzar solo.
                          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                          goTo(index + 1);
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-marfil transition-colors hover:bg-marfil/15"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-marfil transition-colors hover:bg-marfil/15"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setUserPaused((v) => !v)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-marfil/40 text-marfil transition-colors hover:bg-marfil hover:text-bosque"
                  aria-label={userPaused ? "Reanudar el cambio de fotos" : "Pausar el cambio de fotos"}
                  aria-pressed={userPaused}
                >
                  {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
