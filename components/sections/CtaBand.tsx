import { ctaImage } from "@/lib/sample-data";
import { ButtonLink } from "../ui/Button";
import { SmartImage } from "../ui/SmartImage";

export function CtaBand() {
  return (
    <section aria-labelledby="cta-titulo" className="relative isolate overflow-hidden bg-bosque py-28 sm:py-36">
      <SmartImage src={ctaImage.src} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-noche/65" aria-hidden />
      <div className="container-site text-center">
        <p className="eyebrow eyebrow-light justify-center">Empecemos</p>
        <h2 id="cta-titulo" className="mx-auto mt-5 max-w-3xl text-4xl !text-marfil sm:text-6xl">
          Tu próximo hogar merece un jardín a su altura
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/#solicitar" size="lg">
            Solicitar servicio
          </ButtonLink>
          <ButtonLink href="/propiedades" size="lg" variant="outline-light">
            Explorar propiedades
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
