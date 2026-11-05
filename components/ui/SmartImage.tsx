"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * Envuelve `next/image`. Si la foto no carga (URL de ejemplo caída, red bloqueada),
 * muestra un marcador con la paleta de la marca en lugar de un ícono roto.
 */
export function SmartImage({ alt, className, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-salvia-claro via-arena to-salvia-medio ${className ?? ""}`}
      >
        <svg viewBox="0 0 48 48" className="h-12 w-12 text-bosque/40" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M24 42V20" />
          <path d="M24 28c-8 0-13-6-13-14 8 0 13 6 13 14Z" />
          <path d="M24 24c0-7 5-12 12-12 0 7-5 12-12 12Z" />
        </svg>
      </div>
    );
  }

  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
