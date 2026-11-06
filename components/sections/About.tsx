import { Handshake, Leaf, MapPinned } from "lucide-react";
import { aboutImage } from "@/lib/sample-data";
import { SectionHeading } from "../ui/SectionHeading";
import { SmartImage } from "../ui/SmartImage";

const values = [
  {
    icon: Leaf,
    title: "Especies adaptadas al clima",
    text: "Elegimos especies adaptadas al clima dominicano para que tu jardín necesite menos agua y menos mantenimiento.",
  },
  {
    icon: MapPinned,
    title: "Asesoría sobre zonas y terrenos",
    text: "Te asesoramos sobre zonas, plusvalía y el potencial verde de cada propiedad antes de que decidas.",
  },
  {
    icon: Handshake,
    title: "Un solo equipo en todo el proceso",
    text: "Un solo equipo te acompaña en todo el proceso, desde la búsqueda de la propiedad hasta el último arbusto.",
  },
];

export function About({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo" className="py-24 sm:py-32">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <SectionHeading
            id="nosotros-titulo"
            eyebrow="Sobre nosotros"
            title="Empresa dominicana de jardinería y bienes raíces"
            intro="Diseñamos, sembramos y cuidamos jardines, y vendemos y alquilamos propiedades. Un mismo equipo te acompaña desde la búsqueda de la casa hasta el jardín terminado."
          />
          <ul className="mt-12 space-y-8">
            {values.map((v) => (
              <li key={v.title} className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dorado/50 text-dorado-oscuro">
                  <v.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <h3 className="text-2xl">{v.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-gris">{v.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] bg-arena sm:aspect-[4/3] lg:aspect-[5/6]">
            <SmartImage src={aboutImage.src} alt={aboutImage.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <dl className="relative -mt-16 mx-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-arena-borde shadow-[0_30px_60px_-30px_rgb(31_58_43_/_0.5)] sm:mx-8 sm:grid-cols-4 lg:-ml-12 lg:mr-8 lg:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="bg-papel p-5 sm:p-6">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-gris">{s.label}</dt>
                <dd className="mt-1 font-serif text-4xl font-semibold leading-none text-bosque">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
