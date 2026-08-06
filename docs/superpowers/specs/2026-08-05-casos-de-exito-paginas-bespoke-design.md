# Casos de éxito: páginas individuales bespoke + página completa de Frigorinoquia

**Fecha:** 2026-08-05
**Estado:** Aprobado para pasar a plan de implementación

## Contexto

El plan anterior (`2026-08-04-seo-arquitectura-multipagina`) implementó `casos-de-exito` como una Content Collection (`src/content/casos-de-exito/*.md`) con un layout genérico (`CaseStudyLayout.astro`) compartido por los 6 casos. Funciona, pero es un molde único: mismo orden de secciones, mismo tratamiento visual, solo texto — no hay lugar para mostrar capturas reales del producto, fotos de campo, ni animaciones a medida por caso.

Ahora existen activos reales del primer caso — Frigorinoquia —, ya subidos a `src/assets/casos-de-exito/frigorinoquia/`:

- 6 capturas de pantalla reales de las apps del sistema (`app_apertura`, `app_pesaje`, 3 variantes de `app_despacho`, `app_recepcion`, 2 variantes de `app_reportes`).
- 2 fotos reales de planta: una etiqueta ZPL recién impresa sobre producto empacado, y una foto de prueba de impresora.
- Una guía de despacho real (documento tipo PDF), con los datos del cliente ya censurados por el propio sistema (asteriscos) — sin problema de privacidad para publicar.

Decisión del usuario: mantener Content Collections únicamente para `blog` (contenido que crece con el tiempo, prosa). Los casos de éxito son pocos (6, con "próximos proyectos" ocasionales) y cada uno merece una página propia con su propio criterio visual — igual que ya son las 7 páginas de `/servicios/*`.

## Alcance

- Los 6 casos de éxito pasan de la colección a páginas Astro individuales en `src/pages/casos-de-exito/*.astro`.
- **Frigorinoquia** recibe el tratamiento completo: galería de capturas reales, evidencia física (etiquetas, guía de despacho), diagrama animado del flujo de las 6 apps, contador animado con una cifra real del reporte, todo con GSAP (ScrollTrigger para reveals, reutilizando los utils ya existentes en `src/scripts/animations/`).
- Los otros 5 casos (`tesla-gps`, `tracing-colombina`, `feriaapp`, `portafolio-interlink`, `tracing-b4`) migran a páginas bespoke con el mismo contenido de texto que ya tienen hoy (sin activos reales todavía) — visualmente equivalentes al `CaseStudyLayout` actual, pero como archivos propios en vez de entradas de colección. Se enriquecen individualmente en el futuro cuando haya activos reales de cada uno.
- La colección `casos-de-exito` (`src/content/config.ts` entrada correspondiente, y los 6 `.md`) se elimina una vez migrado todo el contenido. `blog` no se toca.
- El hub `/casos-de-exito` se actualiza para listar las 6 páginas desde una fuente de datos local liviana en vez de `getCollection`.

**Fuera de alcance** (explícito, para no perder el hilo con lo que el usuario pidió después en la misma conversación):
- El rediseño "premium" de las secciones "Casos de Éxito" y "Del Blog" en la home — es un frente independiente, se diseña por separado a continuación de este.
- Enriquecer los otros 5 casos con activos reales — se hace cuando existan, caso por caso.
- Tocar la colección `blog` — queda exactamente como está.

## Decisiones de diseño

### 1. Fuente de datos del hub

Nuevo archivo `src/data/casosDeExito.ts`: un array tipado con los campos que el hub necesita para las tarjetas (`slug`, `cliente`, `industria`, `resultadoCorto`, `status`, `featured`) — sin duplicar el contenido completo de cada página, que vive únicamente en su propio `.astro`. `CaseStudyCard.astro` pasa de recibir `entry: CollectionEntry<'casos-de-exito'>` a recibir estos mismos campos como props sueltas.

### 2. Páginas bespoke — patrón para los 5 casos "de texto"

Mismo patrón que hoy usa `CaseStudyLayout.astro` (dolor → solución → capacidades → stack → resultado, con el badge de "Propuesta técnica" para `tracing-b4`), pero cada uno como archivo propio en `src/pages/casos-de-exito/`, con su contenido pegado directamente (ya está escrito, es mover texto, no redactar de nuevo). Se mantiene `SectionHeader`, `GridBackground`, `TechBadge` — el sistema de diseño no cambia, solo la fuente del contenido.

### 3. Página de Frigorinoquia — estructura y GSAP

`src/pages/casos-de-exito/frigorinoquia.astro`, con estas secciones en orden:

1. **Hero del caso**: título "Frigorinoquia", industria, badge "CASO DE ÉXITO", una cifra destacada (6 aplicaciones conectadas, trazabilidad de punta a punta).
2. **El dolor**: texto ya escrito, sin cambios.
3. **La solución**: texto ya escrito + diagrama de las 6 apps (`app_apertura` → `app_presa`/`app_granel` → `app_despacho` → `app_reportes` → `app_cobranza`) con líneas conectoras que se dibujan al hacer scroll — mismo recurso SVG que `NeuralNetwork.astro` ya usa en el Hero, adaptado a un layout horizontal de nodos con etiqueta.
4. **Galería de capturas**: las 6 capturas reales, cada una dentro de un componente `AppScreenshotFrame.astro` (marco tipo "browser chrome" — barra superior con puntos, sombra, bordes redondeados) para que se vean como producto terminado y no como recortes sueltos. Scroll-reveal con `scrollReveal.ts` existente, stagger por tarjeta.
5. **Evidencia física**: las 2 fotos de etiqueta + la captura de la guía de despacho, en tarjetas con leve rotación/sombra (estética "foto pegada"), no a página completa. La foto del producto empacado (carne visible) se recorta/enmarca dentro de la tarjeta — no se usa como fondo ni hero.
6. **Resultado**: texto ya escrito + un contador animado (GSAP) con una cifra real tomada del reporte de beneficio (rendimiento promedio, ej. "+56% rendimiento promedio") — cifra real, no inventada, ya visible en `screenshot-reporte-beneficio-animales.png`.
7. **Stack + CTA**: igual que el resto de casos (`TechBadge` + link a `/contacto` y volver a `/casos-de-exito`).

### 4. Imágenes — `astro:assets`

Todas las imágenes de Frigorinoquia se importan desde `src/assets/casos-de-exito/frigorinoquia/` y se renderizan con el componente `<Image>` de `astro:assets` (no `<img>` crudo) para optimización automática (WebP, tamaños responsive, lazy loading nativo bajo el fold). Los originales pesan hasta ~1.5MB — sin esto, la página pesaría varios MB y golpearía Core Web Vitals, justo lo opuesto a lo que persigue todo el trabajo de SEO ya hecho.

### 5. GSAP — qué se reutiliza y qué es nuevo

Reutiliza tal cual: `scrollReveal.ts` (galería de capturas y evidencia física), `parallax.ts` (si aporta en el hero de la página). Nuevo, chico: un util `counter.ts` en `src/scripts/animations/` — anima un número de 0 al valor final cuando entra en viewport, para la cifra de resultado. El diagrama de las 6 apps reutiliza el patrón de dibujo de líneas SVG de `NeuralNetwork.astro` (no se copia el componente entero, se extrae el patrón a un componente propio y más simple, ya que acá son 6 nodos fijos con etiqueta, no una red aleatoria).

## Verificación

- `npm run build` sin errores; las 6 páginas de casos de éxito responden 200.
- El hub `/casos-de-exito` sigue mostrando 5 casos ejecutados + 1 propuesta (`tracing-b4` con su badge), ahora desde `casosDeExito.ts` en vez de `getCollection`.
- Ningún archivo de `src/content/casos-de-exito/` ni la entrada correspondiente en `src/content/config.ts` sigue existiendo al terminar; `blog` no se modifica.
- Las imágenes de Frigorinoquia se sirven en WebP con tamaños responsive (confirmar en el HTML generado: `<picture>`/`srcset` de `astro:assets`).
- Revisión visual en desktop y 375px: diagrama de 6 apps, galería de capturas, evidencia física y contador animado funcionan y se ven bien en ambos viewports.
- La foto de producto empacado se ve enmarcada/recortada, nunca a página completa.

## Fuera de alcance (recordatorio)

Rediseño premium de las secciones "Casos de Éxito" y "Del Blog" en la home — próximo diseño, independiente de este.
