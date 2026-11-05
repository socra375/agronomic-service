/**
 * Logo tipográfico provisional. REEMPLAZAR por el logo real del cliente
 * (la presentación indica que existe, pero no se entregó el archivo).
 */
export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const main = tone === "light" ? "text-marfil" : "text-bosque";
  const sub = tone === "light" ? "text-dorado-claro" : "text-dorado-oscuro";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className={`h-9 w-9 shrink-0 ${main}`} fill="none" aria-hidden>
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeOpacity="0.35" />
        <path d="M20 31V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 22c-5.5 0-9-4-9-10 5.5 0 9 4 9 10Z" fill="currentColor" fillOpacity="0.9" />
        <path d="M20 19c0-5 3.5-8.5 8.5-8.5 0 5-3.5 8.5-8.5 8.5Z" className="fill-dorado" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.45rem] font-semibold tracking-[0.01em] ${main}`}>Agronómic</span>
        <span className={`mt-1 whitespace-nowrap text-[0.6rem] font-bold uppercase tracking-[0.32em] ${sub}`}>Services, S. A.</span>
      </span>
    </span>
  );
}
