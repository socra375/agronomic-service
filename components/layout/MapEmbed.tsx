/**
 * Mapa de OpenStreetMap incrustado. No necesita API key; `loading="lazy"` evita que
 * frene la carga inicial.
 */
export function MapEmbed({
  lat,
  lng,
  title,
  zoom = 0.02,
  className = "",
}: {
  lat: number;
  lng: number;
  title: string;
  zoom?: number;
  className?: string;
}) {
  const bbox = [lng - zoom, lat - zoom * 0.6, lng + zoom, lat + zoom * 0.6].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <div className={`bg-bosque-medio ${className}`}>
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0 grayscale-[35%] sepia-[15%]"
      />
    </div>
  );
}
