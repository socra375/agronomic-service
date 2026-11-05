"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "../ui/Logo";
import { ButtonLink } from "../ui/Button";

/**
 * Header fijo. En la portada es transparente sobre el hero y se vuelve sólido al bajar;
 * en el resto de páginas es sólido desde el inicio.
 */
export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = !overHero || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-(--ease-suave) ${
        solid ? "bg-marfil/95 shadow-[0_1px_0_rgb(31_58_43_/_0.08)] backdrop-blur-md" : "bg-gradient-to-b from-noche/50 to-transparent"
      }`}
    >
      <div className={`container-site flex items-center justify-between transition-all duration-500 ${solid ? "h-18" : "h-22"}`}>
        <Link href="/" aria-label={`${siteConfig.name}, ir al inicio`} className="rounded-sm">
          <Logo tone={solid ? "dark" : "light"} />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group relative py-2 text-[0.8125rem] font-bold uppercase tracking-[0.16em] transition-colors ${
                    solid ? "text-bosque" : "text-marfil"
                  }`}
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-dorado transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ButtonLink href={siteConfig.cta.href} variant="gold">
              {siteConfig.cta.label}
            </ButtonLink>
          </div>
          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-full xl:hidden ${solid ? "text-bosque" : "text-marfil"}`}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        hidden={!open}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-arena-borde bg-marfil xl:hidden"
      >
        <nav aria-label="Menú móvil" className="container-site flex flex-col py-8">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-arena-borde py-5 font-serif text-3xl text-bosque"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href={siteConfig.cta.href} size="lg" className="mt-10 w-full" onClick={() => setOpen(false)}>
            {siteConfig.cta.label}
          </ButtonLink>
          <a href={siteConfig.contact.phoneHref} className="mt-6 text-center text-sm font-semibold text-tinta">
            {siteConfig.contact.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
