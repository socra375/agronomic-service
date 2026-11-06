import type { Service } from "@/lib/types";
import { ConsultChat } from "../chat/ConsultChat";
import { SectionHeading } from "../ui/SectionHeading";
import { serviceIcons } from "./Services";

/**
 * Apartado de chat: servicios sin portafolio de fotos
 * (Mantenimiento, Supervisión y Asesoría Técnica).
 */
export function ConsultSection({ services }: { services: Service[] }) {
  const consult = services.filter((s) => s.mode === "consulta");

  return (
    <section id="asesoria" aria-labelledby="asesoria-titulo" className="bg-bosque py-24 text-marfil sm:py-32">
      <div className="container-site grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6 xl:col-span-5">
          <SectionHeading
            id="asesoria-titulo"
            tone="light"
            eyebrow="Asesoría por chat"
            title="Mantenimiento, supervisión y asesoría técnica"
            intro="Escríbenos en el chat sobre el cuidado de tu jardín, la supervisión de un proyecto o una duda agronómica. Te responde nuestro equipo técnico."
          />
          <ul className="mt-12 space-y-4">
            {consult.map((s) => {
              const Icon = serviceIcons[s.icon];
              return (
                <li key={s.id} className="flex gap-5 rounded-2xl border border-marfil/10 bg-bosque-medio/60 p-5 sm:p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dorado text-noche">
                    <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-2xl !text-marfil">{s.title}</h3>
                    <p className="mt-1 leading-relaxed text-salvia-claro">{s.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:sticky lg:top-28 lg:col-span-6 xl:col-span-7">
          <ConsultChat services={consult} />
        </div>
      </div>
    </section>
  );
}
