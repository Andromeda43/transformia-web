# SEO técnico y arquitectura multipágina de transformia-web

**Fecha:** 2026-08-04
**Estado:** Aprobado para pasar a plan de implementación

## Contexto

El sitio actual (Astro 5 + React 19 + Tailwind 4) ya recibió un rediseño visual (ver `2026-08-03-rediseno-completo-design.md`, ejecutado): sistema de tokens, componentes compartidos (`GridBackground`, `SectionHeader`, `TechBadge`, `GlowOrbs`), animaciones GSAP, `/contacto` real. Ese trabajo resolvió la consistencia visual pero no tocó la estructura de páginas ni el SEO técnico, que quedaron fuera de su alcance explícitamente.

Diagnóstico actual, verificado en el código:

- **Es un sitio de una sola URL de contenido.** `index.astro` mete Hero, QuiénesSomos, QuéHacemos, Soluciones, Metodología, PorQuéElegirnos y CTA como secciones ancladas (`#servicios`, `#soluciones`...) en la misma página. Las únicas rutas reales son `/`, `/contacto`, `/cotizacion` (cotizaciones privadas por cliente), `/privacidad` y `/terminos` (placeholders literales de "contenido en preparación").
- **`astro.config.mjs` no tiene `site` configurado** → sin esto, Astro no puede generar canonical URLs absolutas ni sitemap.
- **No hay `@astrojs/sitemap` ni `robots.txt`.**
- **El `<meta name="description">` en `MainLayout.astro` está hardcodeado e idéntico en todas las páginas** (el `title` sí varía por página vía prop, la descripción no).
- **Cero Open Graph / Twitter Cards, cero JSON-LD.**
- **Links muertos ya presentes en producción**: los 7 componentes `SolucionesComponents/CarouselSlides/*Slide.astro` ya apuntan a `/servicios/desarrollo`, `/servicios/transformacion`, `/servicios/ia`, `/servicios/asesoria`, `/servicios/iot`, `/servicios/arquitectura`, `/servicios/database` — ninguna de esas rutas existe hoy.

Con una sola URL de contenido real, Google tiene una página para indexar y rankear. Ese es el problema de fondo detrás de "poca visibilidad" y "pocas páginas indexadas".

Existe además `docs/transformia-projects-context.md`: documentación real de 6 proyectos entregados a clientes (Tesla GPS, Frigorinoquia, Tracing 2.0 Colombina, portafolio de 6 sitios en Interlink, FeriaApp) más una propuesta técnica no ejecutada (TRACING B-4.0), cada uno con estructura de 5 secciones (dolor, solución, capacidades, implementación, resultado). Es la fuente de contenido real para casos de éxito — no hay que inventar nada.

**Contexto de negocio** (definido con el usuario): mercado LatAm hispanohablante (sin foco geográfico único, sin necesidad de i18n en inglés); diferenciación en especialización en IA y equipo boutique (rapidez/costo frente a consultoras grandes); dominio de producción `transformia.dev`.

## Alcance

Reestructurar el sitio de una landing de una sola página a una arquitectura multipágina completa (enfoque "ruptura total": cada sección deja de vivir solo como sección de la home y pasa a tener su propia URL indexable), más la capa técnica de SEO necesaria para que esas páginas sean rankeables, más el motor de blog para seguir sumando páginas indexadas en el tiempo.

No incluye: OG images dinámicas por página, rutas en inglés (`/en/`), schema `LocalBusiness`/Google Business Profile, ni el calendario editorial real del blog (la infraestructura queda lista; escribir el volumen de artículos es trabajo continuo aparte). Tampoco incluye backend real para `ContactoForm` ni tocar `/cotizacion.astro` — ambos fuera de alcance ya en el rediseño anterior y siguen sin ser parte de este.

## Arquitectura de información

```
/                              → landing corto: Hero + teasers con link a cada página completa
/servicios                     → hub, 7 cards
/servicios/desarrollo          → arregla un link ya existente pero roto
/servicios/transformacion      → ídem
/servicios/ia                  → ídem
/servicios/asesoria            → ídem
/servicios/iot                 → ídem
/servicios/arquitectura        → ídem
/servicios/database             → ídem
/nosotros                      → Quiénes Somos + Metodología + Por Qué Elegirnos, expandido
/casos-de-exito                → hub
/casos-de-exito/tesla-gps
/casos-de-exito/frigorinoquia
/casos-de-exito/tracing-colombina
/casos-de-exito/feriaapp
/casos-de-exito/portafolio-interlink
/casos-de-exito/tracing-b4     → badge "Propuesta técnica", nunca presentado como resultado entregado
/blog                          → hub
/blog/[slug]                   → Content Collection, arranca vacía o con 1-2 posts semilla
/contacto, /cotizacion (noindex), /privacidad, /terminos  → ya existen, se mantienen
```

Uso los slugs de servicio que ya están hardcodeados en los `*Slide.astro` (`desarrollo`, `transformacion`, `ia`, `asesoria`, `iot`, `arquitectura`, `database`) en vez de inventar unos nuevos — así de paso quedan resueltos esos 404 latentes.

## Modelo de contenido

- **Servicios (7)**: páginas `.astro` estáticas en `src/pages/servicios/`, no content collection. Cada una expande el copy que ya existe en su `*Slide.astro` correspondiente (título, descripción, features, tags) con prosa real: qué problema resuelve esa línea, cómo trabaja Transformia ahí, qué incluye, y una sección de casos de éxito relacionados (cruce manual por servicio, ya que son solo 7 y fijos). Coincide con el patrón actual del repo — páginas Astro simples sin lógica dinámica, como `contacto.astro`.
- **Casos de éxito**: Content Collection `src/content/casos-de-exito/*.md`, schema Zod calcado de la estructura que ya usa `docs/transformia-projects-context.md`:
  ```ts
  {
    cliente: string,
    industria: string,
    dolor: string,
    solucion: string,
    capacidades: string[],
    stack: string[],
    resultado: string,
    status: 'ejecutado' | 'propuesta',
    featured: boolean
  }
  ```
  `tracing-b4.md` es el único con `status: 'propuesta'`; su layout muestra un badge visible distinto ("Propuesta técnica, no ejecutada") y omite cualquier cifra de resultado como si fuera un hecho consumado — el propio doc fuente ya aclara que ninguna cifra fue verificada en campo.
- **Blog**: Content Collection `src/content/blog/*.md`, schema estándar (`title`, `description`, `pubDate`, `updatedDate?`, `tags: string[]`, `draft: boolean`). Se entrega la infraestructura (colección + layout + hub `/blog` + ruta `[slug]`) lista para recibir contenido; no se compromete un volumen de posts en este alcance.

## Capa técnica de SEO

- `astro.config.mjs`: agregar `site: 'https://transformia.dev'` y la integración `@astrojs/sitemap`.
- `src/components/SEO.astro` (nuevo): props `title`, `description`, `canonical?`, `image?`, `type` (`'website' | 'article'`), `noindex?`, `jsonLd?`. `MainLayout.astro` lo consume en vez del bloque de meta tags hardcodeado actual — cada página pasa su propia `description` (hoy es idéntica en todo el sitio, se corrige acá) y su propio `title`.
- JSON-LD:
  - `Organization` sitewide (nombre, url, descripción, datos de contacto reales ya presentes en `Navbar`/`Footer` — Casanare, Colombia). Sin `sameAs` de redes sociales: hoy son `href="#"` placeholder, no se inventan URLs.
  - `BreadcrumbList` en toda página que no sea `/`.
  - `Service` en cada página de `/servicios/*`.
  - `Article` en cada post de `/blog/*`.
  - Nada de `LocalBusiness`: el mercado es LatAm hispanohablante, no una búsqueda local geolocalizada.
- `public/robots.txt`: `Allow: /`, `Disallow: /cotizacion` (cotizaciones privadas por cliente — contenido duplicado y de bajo valor para indexar), referencia a `/sitemap-index.xml`.
- `cotizacion.astro` recibe además `noindex` vía el prop de `SEO.astro` (cinturón y tirantes junto con robots.txt).
- Imagen OG única (`public/og-default.jpg`) reusada en todas las páginas por ahora; OG dinámica por página queda fuera de alcance.

## Navegación y home

- **Navbar**: los links de ancla (`/#servicios`, `/#nosotros`, etc.) se reemplazan por rutas reales — Inicio, Servicios, Casos de Éxito, Nosotros, Blog, Contacto. Se retira la lógica de scroll-spy (`highlightCurrentSection`) atada a secciones de una sola home, ya sin sentido en un sitio multipágina.
- **Footer**: suma columnas de enlaces (las 7 líneas de servicio, casos de éxito destacados, legal) — refuerza el enlazado interno que Google usa para descubrir las páginas nuevas.
- **Home (`index.astro`)**: se mantiene `Hero` (con `NeuralNetwork.astro`) como pieza insignia. Debajo, teasers cortos con CTA "ver más" hacia cada página completa: qué hacemos (iconos de las 7 líneas → `/servicios`), 2-3 casos de éxito destacados → `/casos-de-exito`, por qué elegirnos → `/nosotros`, últimos posts → `/blog`, `CallToAction` final (se mantiene). El sistema de tabs `SolucionesTabCards` se reaprovecha como esa franja de teaser en la home en vez de descartarlo.
- Los componentes `QuienesSomos.astro`, `QueHacemos.astro`, `Soluciones.astro` (como sección completa), `MetodologiaTrabajo.astro` y `PorQueElegirnos.astro` dejan de importarse en `index.astro`; su contenido migra a `/nosotros` y a las páginas de `/servicios/*`. Los archivos no se borran de entrada — se evalúa en el plan de implementación si migran de ubicación o quedan como partials reutilizados por las páginas nuevas.

## Páginas legales

`/privacidad` y `/terminos` usan hoy `LegalPagePlaceholder.astro` con el mensaje "contenido en preparación". Se reemplaza por contenido base real: política de privacidad con referencia a habeas data (Ley 1581 de Colombia — Transformia ya trabaja bajo ese marco, según documenta el proyecto Tesla GPS) y términos de uso estándar para un sitio de servicios. Se deja explícito en el commit/PR que es un borrador razonable, no un reemplazo de revisión legal real antes de publicarlo como política definitiva.

## Verificación

- `npm run build` sin errores.
- Cada ruta nueva responde 200 en `npm run dev`; `/cotizacion` incluye `noindex` verificable en el HTML servido.
- `robots.txt` y `sitemap-index.xml` accesibles y con las URLs esperadas (sin `/cotizacion`).
- Cada página tiene `<title>` y `<meta name="description">` distintos entre sí (ya no hay descripción duplicada sitewide).
- JSON-LD de cada tipo de página valida sin errores en el [Rich Results Test](https://search.google.com/test/rich-results) de Google.
- Revisión visual en desktop y 375px de: hub de servicios, una página de servicio, hub de casos de éxito, el caso `tracing-b4` (confirmar que el badge de "propuesta" se ve claramente diferenciado), `/nosotros`, `/blog` vacío o con posts semilla, navbar y footer nuevos, home reestructurada.
- Confirmar que ningún link interno del sitio (navbar, footer, teasers de home, links "conocer más" de los `*Slide.astro`) apunta a una ruta que no existe.

## Fuera de alcance

- OG images dinámicas generadas por página.
- Rutas en inglés / i18n (`/en/`) — mercado definido como LatAm hispanohablante.
- Schema `LocalBusiness` / Google Business Profile.
- Volumen real de contenido del blog más allá de 1-2 posts semilla — el calendario editorial es trabajo continuo, no de este build.
- Backend real para `ContactoForm` y rearquitectura de `/cotizacion.astro` (ya fuera de alcance en el rediseño visual anterior).
- Revisión legal profesional del contenido de `/privacidad` y `/terminos`.
- Redes sociales reales (`sameAs` en JSON-LD, links del footer) — hoy son placeholder, se mantienen como pendientes hasta que existan cuentas reales.
