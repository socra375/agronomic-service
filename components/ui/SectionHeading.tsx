import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  id?: string;
}

/** Etiqueta en versalitas + título serif + entradilla: el patrón de la presentación. */
export function SectionHeading({ eyebrow, title, intro, align = "left", tone = "dark", as: Tag = "h2", id }: Props) {
  const center = align === "center";
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow ${tone === "light" ? "eyebrow-light" : ""} ${center ? "justify-center" : ""}`}>{eyebrow}</p>
      <Tag
        id={id}
        className={`mt-4 text-4xl sm:text-5xl lg:text-[3.5rem] ${tone === "light" ? "!text-marfil" : ""}`}
      >
        {title}
      </Tag>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${tone === "light" ? "text-salvia-claro" : "text-gris"}`}>{intro}</p>
      )}
    </div>
  );
}
