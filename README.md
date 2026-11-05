# Agronómic Services, S. A. · Sitio web

Sitio web de una empresa dominicana de **diseño de jardines y bienes raíces**. Está hecho con Next.js 15 (App Router), Tailwind CSS 4 y TypeScript.

> **Fase 1 (este repositorio):** la parte pública que ven los clientes, con secciones, catálogo con buscador y filtros, ficha de cada propiedad, galería con lightbox, formulario de solicitud, SEO y diseño responsive.
> **Fase 2:** Supabase, login y panel de administración para cargar propiedades y fotos.
> **Fase 3:** chat interno (Supabase Realtime) y WhatsApp.

## Ejecutar en local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

El sitio queda disponible en http://localhost:3000. Funciona **sin configurar nada más**: usa los datos de ejemplo de `lib/sample-data.ts`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` y `npm start` | Compilación y servidor de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Comprobación de tipos de TypeScript |
| `npm test` | Pruebas de la lógica de filtros (vitest) |

## Estructura

```
app/
  layout.tsx                  Fuentes, metadatos, JSON-LD de la empresa, header y footer
  page.tsx                    Portada: Hero · Servicios · Asesoría (chat) · Catálogo · Zonas · Galería · Nosotros · CTA · Solicitar/Contacto
  propiedades/page.tsx        Catálogo completo: barra lateral de filtros, cajón en móvil y estado en la URL
  propiedades/[slug]/page.tsx Ficha: fotos con lightbox, datos, características, mapa, formulario y similares
  api/solicitudes/route.ts    POST del formulario: valida con zod, filtra bots con honeypot y avisa por correo con Resend
  sitemap.ts · robots.ts · opengraph-image.tsx · not-found.tsx
components/
  layout/      Header, Footer, MapEmbed (OpenStreetMap, sin API key)
  sections/    Hero, Services, ConsultSection, ExploreByZone, Gallery, About, CtaBand, RequestSection, RequestForm
  chat/        ConsultChat (apartado de chat de los servicios de consulta)
  properties/  PropertyCard, PropertyCatalog (variantes compacta y completa), FilterControls, PropertyGallery
  ui/          Button, SectionHeading, Logo, Lightbox, SmartImage, Reveal, SocialIcon
lib/
  site-config.ts   ⚠️ Datos de la empresa (teléfono, correo, dirección, redes): REEMPLAZAR
  sample-data.ts   Propiedades, zonas, servicios y galería de ejemplo
  data/index.ts    Capa de acceso a datos (sample-data hoy, Supabase en la fase 2)
  filters.ts       Búsqueda, filtros, orden y sincronización con la URL (funciones puras y probadas)
  lead-schema.ts   Validación del formulario, compartida entre cliente y servidor
  seo.ts · format.ts · normalize.ts · types.ts
tests/filters.test.ts
```

## Diseño

Se toma de la presentación del proyecto («Plan de proyecto web»):

| Token | Color | Uso |
| --- | --- | --- |
| `bosque` | `#1F3A2B` | Color principal, títulos, footer |
| `salvia` | `#5E8C61` | Acentos e íconos (no se usa como texto sobre fondo claro) |
| `dorado` | `#B8935A` | Botones de acción, con texto `noche` `#13261B` (contraste 5.6:1) |
| `dorado-oscuro` | `#7A5C2E` | Etiquetas en versalitas sobre fondos claros |
| `arena` | `#ECE6D4` | Fondos de sección |
| `marfil` | `#F6F3EA` | Fondo general |

- **Tipografía:** Cormorant Garamond para títulos y Nunito Sans para texto, autoalojadas con `@fontsource` (no dependen de Google Fonts).
- **Referencias:** sitios de resort como Playa Dorada y Bahía Príncipe. Se nota en el hero a sangre con buscador flotante, las tarjetas «Explora por zona», los bloques editoriales y la navegación mínima.

## Catálogo: buscador y filtros

- La búsqueda de texto no distingue acentos ni mayúsculas («samana» encuentra «Samaná») y revisa título, zona, dirección, tipo y características.
- Filtros: operación (venta o alquiler), ubicación, tipo, precio mínimo y máximo, habitaciones y características. Se ordena por fecha, precio o superficie.
- En `/propiedades` el estado vive en la URL, así que los resultados se pueden compartir: `?q=&loc=&tipo=&op=&min=&max=&hab=&car=piscina,jardin&orden=`.
- El buscador del hero es un formulario GET normal: funciona aunque JavaScript no haya cargado.

## Servicios

Son los servicios de la tarjeta del cliente, divididos según si se muestran con fotos o no (`mode` en `lib/types.ts`):

| Servicio | Modo | Dónde aparece |
| --- | --- | --- |
| Jardinería | `portafolio` | Tarjeta con foto en «Servicios» y fotos en la galería («Jardines») |
| Diseños Ornamentales | `portafolio` | Tarjeta con foto en «Servicios» y fotos en la galería («Jardines») |
| Mantenimiento | `consulta` | Apartado de chat «Asesoría por chat» (`#asesoria`) |
| Supervisión | `consulta` | Apartado de chat |
| Asesoría Técnica | `consulta` | Apartado de chat |

La galería tiene solo dos categorías con imágenes: **jardines** y **propiedades**. En la fase 2 el administrador subirá las fotos a una de las dos. Las descripciones de los servicios son propuestas y hay que validarlas con el cliente.

**El apartado de chat en la fase 1** es una interfaz conversacional: el cliente elige el servicio, escribe su consulta y deja nombre y teléfono (el correo es opcional). La consulta se envía a `/api/solicitudes` con `channel: "chat"` y llega por correo. En la fase 3 el mismo componente pasará a Supabase Realtime para responder en vivo.

## Formulario de solicitud

`POST /api/solicitudes` valida los datos e ignora las solicitudes de bots (campo honeypot).

- **Con** `RESEND_API_KEY`: envía un correo a `LEADS_NOTIFY_TO`. El dominio remitente de `LEADS_NOTIFY_FROM` debe estar verificado en Resend.
- **Sin** `RESEND_API_KEY`: registra la solicitud en la consola del servidor.

> ⚠️ En la fase 1 las solicitudes **no se guardan** en ninguna base de datos. Si se publica el sitio sin configurar Resend, las solicitudes se pierden. Configura Resend antes de publicar.

## Desplegar en Vercel

1. Importa el repositorio en Vercel; detecta Next.js automáticamente.
2. Configura las variables de entorno: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `LEADS_NOTIFY_TO` y `LEADS_NOTIFY_FROM`.
3. Despliega. Las páginas son estáticas, salvo `/api/solicitudes`.

## Contenido por reemplazar antes de publicar

- [ ] Teléfono, correo, dirección, horario, coordenadas y redes en `lib/site-config.ts`.
- [ ] Logo real del cliente en `components/ui/Logo.tsx` (hoy es un logotipo tipográfico provisional).
- [ ] Fotos: las de `lib/sample-data.ts` son de Unsplash y de ejemplo. Si una no carga, `SmartImage` muestra un marcador con los colores de la marca.
- [ ] Propiedades y precios reales (los actuales son ficticios). En la fase 2 se cargarán desde el panel.
- [ ] **Confirmar el nombre de la empresa:** la tarjeta dice «Servicios Agronómicos, S.A»; el sitio usa «Agronómic Services, S. A.» (`lib/site-config.ts` y `components/ui/Logo.tsx`).

## Preparado para las siguientes fases

- **Fase 2:** reemplazar el interior de las funciones de `lib/data/index.ts` por consultas a Supabase. Los tipos de `lib/types.ts` ya reflejan las futuras tablas, y los componentes no cambian. La API de solicitudes guardará además en la tabla `leads`. `robots.ts` ya excluye `/admin`.
- **Fase 3:** la esquina inferior derecha queda libre para el botón flotante de WhatsApp y el chat.
