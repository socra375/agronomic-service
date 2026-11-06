import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pb-20 pt-36">
      <div className="container-site text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mx-auto mt-5 max-w-2xl text-5xl sm:text-7xl">Página no encontrada</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-gris">
          La página que buscas no existe o la propiedad ya no está disponible.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="forest" size="lg">
            Volver al inicio
          </ButtonLink>
          <ButtonLink href="/propiedades" variant="outline" size="lg">
            Ver propiedades
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
