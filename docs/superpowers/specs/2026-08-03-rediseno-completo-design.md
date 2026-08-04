# Rediseño completo de transformia-web

**Fecha:** 2026-08-03
**Estado:** Aprobado para pasar a plan de implementación

## Contexto

El sitio actual (Astro 5 + React 19 + Tailwind 4, landing page de una sola página) ya tiene una identidad visual "cyberpunk/terminal IA" reconocible (fondo oscuro, neones morado/azul/rosa, tipografía monospace, HUD con LEDs y data-streams), pero:

- Cada sección (`Hero`, `QueHacemos`, `QuienesSomos`, `Soluciones`, `MetodologiaTrabajo`, `PorQueElegirnos`, `CallToAction`, `Navbar`, `Footer`) reimplementa desde cero las mismas piezas decorativas (grid-lines, glitch-text, corner-elements, orbs, badges tipo terminal, parallax de mouse) con valores de color y spacing ligeramente distintos entre sí (ej. `--purple: #8a42ff` en `MetodologiaTrabajo.astro` vs `#b042ff` en el resto).
- Todas las animaciones (parallax, hover 3D, fade-ins) están hechas a mano con JS vanilla y `IntersectionObserver`/`setTimeout`, duplicadas casi idénticamente en `Hero`, `CallToAction`, `ContactoForm`, `QueHacemos`, `PorQueElegirnos`.
- `/contacto` no existe como página aunque dos CTAs del sitio apuntan ahí; `ContactoForm.astro` (el formulario, bien construido) está huérfano — no se importa en ningún lugar.
- El formulario de contacto simula un envío exitoso con `setTimeout`; no llega a ningún destino real.
- `PorQueElegirnos` muestra métricas sin respaldo (100% Compromiso, 24/7 Soporte, +94% Satisfacción) y una cita genérica de Steve Jobs sin relación con Transformia.
- El footer linkea a `/privacidad` y `/terminos`, que tampoco existen.
- La información de contacto es inconsistente: `Navbar`/`Footer` usan datos reales de Colombia (+57 321 259 6437, Tauramena/Casanare, transformia.desarrollo@gmail.com), mientras `ContactoForm.astro` tiene datos placeholder de México (+52 55..., CDMX, contacto@transformia.com).

Objetivo del rediseño: un sitio "supremamente profesional", con los mejores estilos posibles, eficiente, enfocado en lo que Transformia realmente ofrece, con estética moderna/innovadora/tecnológica, manteniendo la paleta de colores actual de Transformia.

## Alcance

Rediseño completo: las 7 secciones de `index.astro` + creación de `/contacto` real + stubs de `/privacidad` y `/terminos` para no dejar 404s desde el footer. No incluye rearquitecturar `/cotizacion.astro` (fuera de esta iteración) ni escribir contenido legal real para privacidad/términos.

## Decisiones de diseño

1. **Dirección visual**: refinar la identidad cyberpunk/terminal actual (no migrar a un estilo distinto). Menos ruido decorativo repetido, mejor jerarquía tipográfica, micro-interacciones más cuidadas. Se mantiene la paleta: `--neon-purple: #b042ff`, `--neon-blue: #4287ff`, `--neon-pink: #ff42b0`, `--neon-green: #42ff66`, `--neon-yellow: #e8ff42`, fondo `#0a0a14`.
2. **Motor de animación**: migrar de JS vanilla/CSS keyframes a GSAP (con `gsap.utils`, `ScrollTrigger`).
3. **Alcance de contenido**: reescribir/reforzar el copy de cada sección para comunicar con más fuerza los servicios reales de Transformia, no solo restyling visual.
4. **Métricas de PorQueElegirnos**: eliminar los números inventados (100%, 24/7, +94%) y reemplazar por diferenciadores cualitativos. Eliminar la cita de Steve Jobs y reemplazar por una frase propia de Transformia.
5. **Arquitectura**: construir un sistema de diseño compartido (tokens CSS + componentes Astro reutilizables) en vez de mantener CSS duplicado por sección, y en vez de migrar a React/librería de componentes tipo shadcn (se descarta por agregar peso de JS innecesario a un sitio mayormente estático).
6. **Formulario de contacto**: queda visualmente terminado y con micro-interacciones GSAP, pero **sin backend real** — muestra un aviso honesto de "aún no conectado" en lugar de simular un envío exitoso. No se integra ningún servicio de terceros (Formspree, EmailJS, etc.) en esta iteración.

## Sistema de diseño compartido

### Tokens (`src/styles/tokens.css`)

Archivo único con las variables CSS que hoy están duplicadas (y a veces con valores distintos) en cada componente:

- Colores: `--neon-purple`, `--neon-blue`, `--neon-pink`, `--neon-green`, `--neon-yellow`, `--dark-bg`, `--darker-bg`, `--dark-purple`.
- Tipografía: familias ya existentes (Space Grotesk para cuerpo, Space Mono para labels/terminal).
- Spacing/radii usados de forma consistente en las secciones (paddings de sección, border-radius de cards).

Se importa una sola vez en `MainLayout.astro`. Ningún componente vuelve a declarar `:root { --neon-purple: ... }` dentro de su propio `<style>`.

### Componentes compartidos (`src/components/ui/`)

- **`GridBackground.astro`** — el fondo de rejilla animada que hoy se repite (con variaciones) en `QueHacemos`, `QuienesSomos`, `Soluciones`, `MetodologiaTrabajo`, `PorQueElegirnos`, `Footer`. Props: `opacity`, `size`.
- **`SectionHeader.astro`** — patrón título + línea animada + subtítulo/badge, repetido en las 7 secciones. Props: `title`, `subtitle`, `badge?`.
- **`TechBadge.astro`** — badges tipo terminal (ej. "ALTA TECNOLOGÍA", tech-badges de servicios). Props: `label`, `color?`.
- **`GlowOrbs.astro`** — orbes de fondo difuminados (`PorQueElegirnos` los tiene, se generaliza para reusar donde aporte).
- **`CornerFrame.astro`** — esquinas decorativas tipo HUD (top-left/top-right/bottom-left/bottom-right), repetidas en `CallToAction`, `ContactoForm`, `Cotizacion`.

Cada sección importa solo las piezas que necesita; el markup de contenido queda como lo específico de cada `.astro`.

## Motor de animación GSAP

Nuevo directorio `src/scripts/animations/`:

- **`scrollReveal.ts`** — envuelve `ScrollTrigger` para las animaciones de aparición de tarjetas al hacer scroll. Reemplaza los `IntersectionObserver` manuales de `QueHacemos.astro` y `PorQueElegirnos.astro`.
- **`parallax.ts`** — usa `gsap.quickTo()` junto con `gsap.utils.clamp`/`mapRange` para el parallax de mouse en fondos y orbes. Reemplaza las 4 copias casi idénticas del mismo `mousemove` handler en `Hero`, `CallToAction`, `ContactoForm`, `cotizacion.astro`.
- **`magnetic.ts`** — hover 3D de botones y tarjetas (`cyber-button`, `servicio-card`), usando `gsap.utils.mapRange` en vez de la trigonometría manual actual en `CallToAction.astro` y `QueHacemos.astro`.

`NeuralNetwork.astro` conserva su lógica de generación SVG (es específica del hero, no vale la pena generalizarla), pero sus timings de propagación de señal migran de `setTimeout` anidados a `gsap.timeline()`.

Se agrega `gsap` como dependencia en `package.json` (no está instalado actualmente).

## Contenido y tratamiento por sección

| Sección | Se mantiene | Cambia |
|---|---|---|
| Navbar | Estructura, links de ancla, menú numerado, botón CONTACTAR | Usa `GridBackground`/tokens compartidos; blur refinado |
| Hero | `NeuralNetwork.astro` como pieza central | Copy de headline/subheadline más fuerte; timings a `gsap.timeline()` |
| QuiénesSomos | 3 tarjetas (Esencia/Visión/Enfoque) + sección de Valores | Cita de Steve Jobs → frase propia de Transformia; terminal visual con componentes compartidos |
| QuéHacemos | 5 tarjetas de servicio (Observamos/Diseñamos/Desarrollamos/Optimizamos/Integramos) + bloque "Desarrollo a medida" | Copy más orientado a beneficio concreto; animaciones migradas a GSAP |
| Soluciones | Sistema de 7 tabs (Desarrollo, Transformación, Inteligencia, Asesoría, IoT, Arquitectura, Bases de Datos) | Solo tratamiento visual con el sistema de diseño compartido |
| Metodología | Timeline interactivo (Cliente → Descubrimiento → ... pasos) + tarjetas de beneficios | Solo refinamiento visual y de tokens |
| PorQueElegirnos | 6 diferenciadores cualitativos, animación de círculo orbital | Métricas inventadas eliminadas; reemplazadas por keywords/diferenciadores sin números falsos |
| CallToAction | Estructura de "interfaz" con botón cyber y canales de contacto | Copy más directo; usa `CornerFrame` compartido |
| Footer | Estructura, contacto real (Casanare, Colombia), tech badges | Links `/privacidad` y `/terminos` dejan de ser 404; social links `href="#"` se marcan visualmente como pendientes en vez de simularse como funcionales |

## Página de contacto y limpieza

- Se crea `src/pages/contacto.astro` que usa `ContactoForm.astro` dentro de `MainLayout`.
- `ContactoForm.astro` se corrige: información de contacto placeholder de México reemplazada por la real de Transformia (Colombia/Casanare, ya presente en `Navbar`/`Footer`).
- El submit del formulario deja de simular un "¡MENSAJE ENVIADO!" falso; muestra un estado honesto indicando que el envío directo aún no está conectado (ej. invita a usar el teléfono/email listados mientras tanto).
- `src/pages/privacidad.astro` y `src/pages/terminos.astro`: páginas mínimas placeholder (usan `MainLayout`, título + mensaje de "contenido en preparación") para que los links del footer no rompan. No se redacta contenido legal real.

## Verificación

- `npm run dev` y revisión manual de las 9 páginas/secciones en viewport desktop y mobile (375px).
- Confirmar que no quedan referencias rotas: `/contacto`, `/privacidad`, `/terminos` responden 200.
- Confirmar que no hay `:root` duplicados con valores de color distintos entre archivos.
- Revisión visual de que las animaciones GSAP no regresionan el comportamiento actual (parallax, reveals, hover).

## Fuera de alcance

- `/cotizacion.astro` (sistema de cotizaciones vía GitHub raw + Markdown) no se toca en esta iteración.
- Integración de un backend/servicio real para el formulario de contacto (queda para una iteración futura, cuando el usuario defina el servicio a usar).
- Contenido legal real para privacidad/términos de uso.
- Social links reales (LinkedIn/Twitter/Facebook/Instagram) — hoy son `href="#"` placeholder; se mantienen como pendientes, marcados honestamente.
