# Rediseño Completo de Transformia-Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar completamente transformia-web (7 secciones de la home + 3 páginas nuevas) sobre un sistema de diseño compartido, con animaciones migradas a GSAP, copy reforzado y sin datos/enlaces falsos.

**Architecture:** Astro 5 + Tailwind 4 (sin cambios de stack). Se agrega una capa de tokens CSS y componentes Astro reutilizables en `src/components/ui/` para eliminar la duplicación de CSS decorativo entre secciones, y un módulo `src/scripts/animations/` con utilidades GSAP que reemplazan el JS vanilla duplicado (parallax, reveals, hover 3D).

**Tech Stack:** Astro 5, Tailwind 4, GSAP (nueva dependencia) + `gsap/ScrollTrigger`. Sin frameworks de testing (el repo no tiene ninguno; verificación por build + revisión visual en dev server, tal como define el spec).

## Global Constraints

- Mantener el stack Astro 5 + React 19 + Tailwind 4; `gsap` es la única dependencia nueva.
- Paleta de color obligatoria (no cambiar valores): `--neon-purple: #b042ff`, `--neon-blue: #4287ff`, `--neon-pink: #ff42b0`, `--neon-green: #42ff66`, `--neon-yellow: #e8ff42`, `--dark-bg: #0a0a14`, `--darker-bg: #070710`.
- No introducir un framework de testing nuevo. Verificación = `npm run build` (compila sin errores) + revisión visual manual en `npm run dev` (desktop y viewport 375px). **Ruling confirmado con el usuario:** ningún implementador ni reviewer debe agregar Vitest/Playwright/etc. ni pedir "tests que cubran el cambio" — la evidencia válida en el reporte de cada tarea es el output de `npm run build` más la verificación visual descrita en esa tarea.
- El formulario de contacto NO debe simular un envío exitoso falso. Debe mostrar honestamente que el envío directo aún no está conectado.
- No fabricar métricas de negocio (porcentajes, cifras de clientes, uptime, etc.) sin respaldo real.
- Todos los anchors internos existentes deben seguir funcionando: `#nosotros`, `#servicios`, `#soluciones`, `#metodologia`, `#porque-elegirnos`, `#contactanos`.
- Cada sección importa únicamente las piezas del design system que necesita; no se reintroducen bloques `:root { --neon-purple: ... }` duplicados dentro de un `<style>` de sección.

---

## Task 1: Agregar GSAP y verificar el build

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: dependencia `gsap` disponible para `import gsap from 'gsap'` y `import { ScrollTrigger } from 'gsap/ScrollTrigger'` en cualquier script de cualquier tarea posterior.

- [ ] **Step 1: Instalar gsap**

Run: `npm install gsap`

- [ ] **Step 2: Verificar que el build sigue funcionando**

Run: `npm run build`
Expected: build termina sin errores (el sitio no usa gsap todavía, solo se confirma que la instalación no rompió nada).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap dependency"
```

---

## Task 2: Tokens de diseño compartidos

**Files:**
- Create: `src/styles/tokens.css`
- Modify: `src/layouts/MainLayout.astro`

**Interfaces:**
- Produces: variables CSS globales (`--neon-purple`, `--neon-blue`, `--neon-pink`, `--neon-green`, `--neon-yellow`, `--dark-bg`, `--darker-bg`, `--dark-purple`, `--font-mono`, `--font-body`, `--radius-card`, `--section-padding-y`) disponibles en cualquier `<style>` de cualquier componente sin necesidad de redeclararlas.

- [ ] **Step 1: Leer MainLayout.astro actual**

Run: `cat "src/layouts/MainLayout.astro"` para confirmar dónde se importan estilos globales hoy (ya importa `global.css`; ahí se agrega el import de `tokens.css`).

- [ ] **Step 2: Crear el archivo de tokens**

```css
/* src/styles/tokens.css */
:root {
  /* Paleta Transformia — única fuente de verdad, no redeclarar en componentes */
  --neon-purple: #b042ff;
  --neon-blue: #4287ff;
  --neon-pink: #ff42b0;
  --neon-green: #42ff66;
  --neon-yellow: #e8ff42;
  --dark-bg: #0a0a14;
  --darker-bg: #070710;
  --dark-purple: #1a142d;

  /* Tipografía */
  --font-mono: 'Space Mono', monospace;
  --font-body: 'Space Grotesk', sans-serif;

  /* Layout */
  --section-padding-y: 7rem;
  --section-padding-y-mobile: 4rem;
  --radius-card: 12px;
  --container-max: 1280px;

  /* RGB para usar en rgba() dinámicos */
  --neon-purple-rgb: 176, 66, 255;
  --neon-blue-rgb: 66, 135, 255;
  --neon-pink-rgb: 255, 66, 176;
  --neon-green-rgb: 66, 255, 102;
}
```

- [ ] **Step 3: Importar tokens.css en MainLayout antes que global.css**

En `src/layouts/MainLayout.astro`, en el frontmatter donde ya se importan estilos, agregar como primera importación:

```astro
import '../styles/tokens.css';
```

(debe ir antes del import de `global.css` para que los tokens estén disponibles al resto de la cascada).

- [ ] **Step 4: Verificar en el navegador**

Run: `npm run dev`
Abrir `http://localhost:4321` y con devtools confirmar en la pestaña Elements → `:root` que las custom properties (`--neon-purple`, etc.) están presentes con los valores correctos.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/layouts/MainLayout.astro
git commit -m "feat: add shared design tokens"
```

---

## Task 3: Primitivas decorativas compartidas (GridBackground, GlowOrbs, CornerFrame)

**Files:**
- Create: `src/components/ui/GridBackground.astro`
- Create: `src/components/ui/GlowOrbs.astro`
- Create: `src/components/ui/CornerFrame.astro`

**Interfaces:**
- Consumes: tokens de `tokens.css` (Task 2) — `--neon-purple-rgb`, etc.
- Produces:
  - `<GridBackground opacity={0.4} size={40} perspective={false} />`
  - `<GlowOrbs count={3} />`
  - `<CornerFrame size={80} />`

  Estas tres se importan en las tareas de sección (Task 7 en adelante) para reemplazar el CSS de fondo duplicado.

- [ ] **Step 1: Crear GridBackground.astro**

```astro
---
// src/components/ui/GridBackground.astro
interface Props {
  opacity?: number;
  size?: number;
  perspective?: boolean;
}
const { opacity = 0.4, size = 40, perspective = false } = Astro.props;
---
<div
  class="ui-grid-background"
  class:list={{ 'ui-grid-background--perspective': perspective }}
  style={`--grid-opacity:${opacity}; --grid-size:${size}px;`}
  aria-hidden="true"
></div>

<style>
  .ui-grid-background {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(var(--neon-purple-rgb), 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(var(--neon-purple-rgb), 0.1) 1px, transparent 1px);
    background-size: var(--grid-size) var(--grid-size);
    opacity: var(--grid-opacity);
    z-index: 0;
    pointer-events: none;
  }

  .ui-grid-background--perspective {
    height: 200%;
    transform: perspective(1000px) rotateX(60deg);
    transform-origin: center top;
    animation: ui-grid-scroll 20s linear infinite;
  }

  @keyframes ui-grid-scroll {
    0% { background-position: 0 0; }
    100% { background-position: 0 1000px; }
  }
</style>
```

- [ ] **Step 2: Crear GlowOrbs.astro**

```astro
---
// src/components/ui/GlowOrbs.astro
interface Props {
  count?: 2 | 3;
}
const { count = 3 } = Astro.props;
const colors = ['var(--neon-purple)', 'var(--neon-blue)', 'var(--neon-pink)'].slice(0, count);
---
<div class="ui-glow-orbs" aria-hidden="true">
  {colors.map((color, i) => (
    <div class="ui-orb" style={`--orb-color:${color}; --orb-delay:${i * 5}s;`} data-orb={i}></div>
  ))}
</div>

<style>
  .ui-glow-orbs {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }

  .ui-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.2;
    background: radial-gradient(circle, var(--orb-color) 0%, transparent 70%);
    animation: ui-orb-float 20s ease-in-out infinite;
    animation-delay: var(--orb-delay);
  }

  .ui-orb[data-orb="0"] { top: 20%; left: 10%; width: 40vw; height: 40vw; }
  .ui-orb[data-orb="1"] { bottom: 10%; right: 5%; width: 30vw; height: 30vw; animation-direction: reverse; }
  .ui-orb[data-orb="2"] { top: 60%; left: 20%; width: 25vw; height: 25vw; }

  @keyframes ui-orb-float {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(5vw, 3vh); }
  }
</style>
```

- [ ] **Step 3: Crear CornerFrame.astro**

```astro
---
// src/components/ui/CornerFrame.astro
interface Props {
  size?: number;
}
const { size = 80 } = Astro.props;
---
<div class="ui-corner-frame" style={`--corner-size:${size}px;`} aria-hidden="true">
  <div class="ui-corner top-left"><span class="h"></span><span class="v"></span></div>
  <div class="ui-corner top-right"><span class="h"></span><span class="v"></span></div>
  <div class="ui-corner bottom-left"><span class="h"></span><span class="v"></span></div>
  <div class="ui-corner bottom-right"><span class="h"></span><span class="v"></span></div>
</div>

<style>
  .ui-corner-frame {
    position: absolute;
    inset: 0;
    z-index: 4;
    pointer-events: none;
  }

  .ui-corner {
    position: absolute;
    width: var(--corner-size);
    height: var(--corner-size);
  }

  .ui-corner .h, .ui-corner .v {
    position: absolute;
    background: var(--neon-purple);
    opacity: 0.6;
    box-shadow: 0 0 10px var(--neon-purple);
  }

  .ui-corner .h { height: 2px; width: 100%; }
  .ui-corner .v { width: 2px; height: 100%; }

  .top-left { top: 30px; left: 30px; }
  .top-left .h, .top-left .v { top: 0; left: 0; }

  .top-right { top: 30px; right: 30px; }
  .top-right .h, .top-right .v { top: 0; right: 0; }

  .bottom-left { bottom: 30px; left: 30px; }
  .bottom-left .h, .bottom-left .v { bottom: 0; left: 0; }

  .bottom-right { bottom: 30px; right: 30px; }
  .bottom-right .h, .bottom-right .v { bottom: 0; right: 0; }

  @media (max-width: 768px) {
    .ui-corner-frame { display: none; }
  }
</style>
```

- [ ] **Step 4: Verificar visualmente**

Crear temporalmente en `src/pages/index.astro` un bloque de prueba con `<GridBackground perspective /> <GlowOrbs /> <CornerFrame />` dentro de una sección con `position: relative; height: 400px`, abrir `npm run dev`, confirmar que las tres piezas se ven (grid en perspectiva, orbes difuminados, esquinas con líneas neón), luego revertir ese bloque de prueba (no se commitea).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/GridBackground.astro src/components/ui/GlowOrbs.astro src/components/ui/CornerFrame.astro
git commit -m "feat: add shared decorative background components"
```

---

## Task 4: Primitivas de contenido compartidas (SectionHeader, TechBadge)

**Files:**
- Create: `src/components/ui/TechBadge.astro`
- Create: `src/components/ui/SectionHeader.astro`

**Interfaces:**
- Consumes: tokens de Task 2.
- Produces:
  - `<TechBadge label="ALTA TECNOLOGÍA" />`
  - `<SectionHeader title="¿QUÉ HACEMOS?" subtitle="..." badge="OPTIONAL" id="servicios-header" />`

  Se usan en Task 7 en adelante como header estándar de cada sección.

- [ ] **Step 1: Crear TechBadge.astro**

```astro
---
// src/components/ui/TechBadge.astro
interface Props {
  label: string;
}
const { label } = Astro.props;
---
<div class="ui-tech-badge">
  <span class="ui-badge-glow"></span>
  {label}
</div>

<style>
  .ui-tech-badge {
    display: inline-block;
    position: relative;
    padding: 0.5rem 1.5rem;
    background-color: rgba(var(--neon-purple-rgb), 0.12);
    border: 1px solid var(--neon-purple);
    border-radius: 20px;
    color: var(--neon-purple);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    overflow: hidden;
  }

  .ui-badge-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(var(--neon-purple-rgb), 0.4), transparent);
    animation: ui-badge-slide 3s ease-in-out infinite;
  }

  @keyframes ui-badge-slide {
    0% { left: -100%; }
    50%, 100% { left: 100%; }
  }
</style>
```

- [ ] **Step 2: Crear SectionHeader.astro**

```astro
---
// src/components/ui/SectionHeader.astro
import TechBadge from './TechBadge.astro';

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  id?: string;
}
const { title, subtitle, badge, id } = Astro.props;
---
<div class="ui-section-header" id={id}>
  {badge && (
    <div class="ui-section-header-badge">
      <TechBadge label={badge} />
    </div>
  )}
  <h2 class="ui-section-header-title">{title}</h2>
  <div class="ui-section-header-line"><span class="ui-line-pulse"></span></div>
  {subtitle && <p class="ui-section-header-subtitle">{subtitle}</p>}
</div>

<style>
  .ui-section-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 4rem;
    position: relative;
  }

  .ui-section-header-badge {
    margin-bottom: 1.25rem;
  }

  .ui-section-header-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    color: white;
    font-family: var(--font-body);
    margin: 0 0 1rem;
    text-shadow: 0 0 10px rgba(var(--neon-purple-rgb), 0.4);
  }

  .ui-section-header-line {
    position: relative;
    width: 120px;
    height: 3px;
    background: rgba(var(--neon-purple-rgb), 0.3);
    margin: 0 auto 1.5rem;
    overflow: hidden;
  }

  .ui-line-pulse {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--neon-purple), transparent);
    animation: ui-line-slide 3s ease-in-out infinite;
  }

  @keyframes ui-line-slide {
    0% { left: -100%; }
    50%, 100% { left: 100%; }
  }

  .ui-section-header-subtitle {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    font-family: var(--font-body);
  }

  @media (max-width: 768px) {
    .ui-section-header { margin-bottom: 3rem; }
  }
</style>
```

- [ ] **Step 3: Verificar visualmente**

Igual que Task 3 Step 4: probar temporalmente `<SectionHeader title="TEST" subtitle="subtitle test" badge="BADGE" />` en `index.astro`, confirmar en `npm run dev`, revertir.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/TechBadge.astro src/components/ui/SectionHeader.astro
git commit -m "feat: add shared section header and badge components"
```

---

## Task 5: Utilidades de animación GSAP

**Files:**
- Create: `src/scripts/animations/scrollReveal.ts`
- Create: `src/scripts/animations/parallax.ts`
- Create: `src/scripts/animations/magnetic.ts`

**Interfaces:**
- Consumes: `gsap` (Task 1).
- Produces:
  - `revealOnScroll(selector: string, options?: { stagger?: number; y?: number }): void`
  - `initParallax(container: HTMLElement, targets: { el: HTMLElement; strength: number }[]): void`
  - `initMagneticHover(el: HTMLElement, strength?: number): void`

  Estas tres funciones se importan en los `<script>` de las secciones (Task 7 en adelante) para reemplazar `IntersectionObserver` y los `mousemove` handlers manuales.

- [ ] **Step 1: Crear scrollReveal.ts**

```typescript
// src/scripts/animations/scrollReveal.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  stagger?: number;
  y?: number;
}

export function revealOnScroll(selector: string, options: RevealOptions = {}): void {
  const { stagger = 0.1, y = 40 } = options;
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  gsap.set(targets, { opacity: 0, y });

  targets.forEach((target, index) => {
    ScrollTrigger.create({
      trigger: target,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(target, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * stagger,
          ease: 'power2.out',
        });
      },
    });
  });
}
```

- [ ] **Step 2: Crear parallax.ts**

```typescript
// src/scripts/animations/parallax.ts
import gsap from 'gsap';

interface ParallaxTarget {
  el: HTMLElement;
  strength: number;
}

export function initParallax(container: HTMLElement, targets: ParallaxTarget[]): void {
  const movers = targets.map(({ el, strength }) => ({
    el,
    strength,
    quickX: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
    quickY: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
  }));

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    movers.forEach(({ strength, quickX, quickY }) => {
      const clampedStrength = gsap.utils.clamp(0, 60, strength);
      quickX(relX * clampedStrength);
      quickY(relY * clampedStrength);
    });
  });
}
```

- [ ] **Step 3: Crear magnetic.ts**

```typescript
// src/scripts/animations/magnetic.ts
import gsap from 'gsap';

export function initMagneticHover(el: HTMLElement, strength = 20): void {
  const mapRotation = gsap.utils.mapRange(0, 1, -8, 8);

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;

    gsap.to(el, {
      rotateX: mapRotation(1 - relY),
      rotateY: mapRotation(relX),
      y: -5,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  });

  // strength reservado para casos donde el llamador quiera un giro más pronunciado
  void strength;
}
```

- [ ] **Step 4: Verificar que el build sigue pasando**

Run: `npm run build`
Expected: sin errores de TypeScript (estos archivos no se usan todavía, pero deben compilar limpios).

- [ ] **Step 5: Commit**

```bash
git add src/scripts/animations/
git commit -m "feat: add gsap animation utility modules"
```

---

## Task 6: Redesign de Navbar.astro

**Files:**
- Modify: `src/components/Navbar.astro`

**Interfaces:**
- Consumes: tokens de Task 2. No consume componentes `ui/` (el navbar es un caso especial de layout fijo, no una "sección" con fondo decorativo).
- Produces: sin cambios de interfaz pública — sigue siendo `<Navbar />` sin props, usado por `MainLayout.astro`. Los anchors (`#nosotros`, `#servicios`, `#soluciones`, `#metodologia`, `#porque-elegirnos`, `#contactanos`) se mantienen idénticos para no romper la navegación de `index.astro`.

- [ ] **Step 1: Simplificar el CSS del navbar para usar tokens compartidos**

En `src/components/Navbar.astro`, eliminar el bloque `:root { --neon-purple: ...; }` duplicado dentro del `<style>` (ya viene de `tokens.css` global) y dejar solo las variables específicas del navbar:

```astro
<style>
  :root {
    --header-bg: rgba(10, 10, 20, 0.85);
    --header-height: 80px;
  }

  /* el resto de reglas (.site-header, .main-navbar, .menu-link, etc.) se mantiene igual,
     ya que consumen var(--neon-purple) etc. que ahora vienen de tokens.css */
</style>
```

No se toca el HTML del navbar (logo, menú, botón CONTACTAR, menú móvil) — la estructura y los links funcionan correctamente hoy, el problema era solo la duplicación de variables de color.

- [ ] **Step 2: Refinar el blur del header (pulido visual)**

En la regla `.header-background`, subir el blur y agregar una transición suave al estado `scrolled` que ya existe en el script:

```css
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: -1;
  border-bottom: 1px solid rgba(var(--neon-purple-rgb), 0.25);
  transition: background 0.3s ease;
}
```

- [ ] **Step 3: Verificar en el navegador**

Run: `npm run dev`
Abrir `http://localhost:4321`, confirmar: el navbar se ve idéntico en estructura, los 5 links de menú saltan a su sección correspondiente, el botón CONTACTAR salta a `#contactanos`, el menú móvil abre/cierra en viewport 375px.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.astro
git commit -m "refactor: navbar uses shared design tokens"
```

---

## Task 7: Redesign de Hero.astro y migración de NeuralNetwork.astro a GSAP timeline

**Files:**
- Modify: `src/components/Hero.astro`
- Modify: `src/components/HeroComponents/NeuralNetwork.astro`

**Interfaces:**
- Consumes: `initParallax` de `src/scripts/animations/parallax.ts` (Task 5).
- Produces: sin cambios de props públicas — `<Hero />` se sigue usando igual en `index.astro`.

- [ ] **Step 1: Leer el copy actual del Hero**

Run: `rg -n "headline|subheadline|h1|h2" "src/components/Hero.astro"` para ubicar el título y subtítulo actuales antes de reforzarlos.

- [ ] **Step 2: Reforzar el copy del headline**

Reemplazar el `<h1>` y el párrafo de subtítulo del hero por un mensaje que combine la doble naturaleza del nombre (transformación digital + IA) con un beneficio concreto, por ejemplo:

```astro
<h1 class="hero-title">
  Transformación digital + Inteligencia Artificial,
  <span class="hero-title-highlight">a la medida de tu empresa</span>
</h1>
<p class="hero-subtitle">
  Diseñamos, desarrollamos e integramos soluciones tecnológicas propias
  —desde software a medida hasta IA aplicada— para que tu negocio opere
  más rápido, con menos fricción y con datos que sí puedes usar.
</p>
```

(Mantener las clases `hero-title`, `hero-title-highlight`, `hero-subtitle` con los estilos que ya existan en el `<style>` del Hero; solo cambia el texto).

- [ ] **Step 3: Reemplazar el parallax manual del Hero por `initParallax`**

Ubicar el `<script>` del Hero que hace `mousemove` manual sobre los elementos decorativos de fondo, y reemplazarlo por:

```astro
<script>
  import { initParallax } from '../scripts/animations/parallax';

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLElement>('.hero-section');
    const glow = document.querySelector<HTMLElement>('.hero-glow'); // ajustar al selector real de fondo del Hero
    if (container && glow) {
      initParallax(container, [{ el: glow, strength: 30 }]);
    }
  });
</script>
```

(El selector `.hero-glow` debe ajustarse al nombre real de clase del elemento de brillo/fondo que hoy se mueve con `mousemove` en `Hero.astro` — confirmar el nombre exacto leyendo el archivo antes de escribir este paso).

- [ ] **Step 4: Migrar NeuralNetwork.astro de `setTimeout` anidados a `gsap.timeline()`**

En `src/components/HeroComponents/NeuralNetwork.astro`, reemplazar la función `propagateSignal(layerIndex, originNodeIndex)` (líneas ~841-878 del archivo actual, que encadena `setTimeout` recursivos) por una timeline GSAP:

```typescript
import gsap from 'gsap';

function propagateSignal(layerIndex: number, originNodeIndex: number) {
  if (layerIndex >= layers.length) return;

  const currentLayer = layers[layerIndex];
  const currentNodes = currentLayer.querySelectorAll('.node');
  const nodesToActivate = Math.floor(Math.random() * 3) + 1;

  const tl = gsap.timeline();

  for (let i = 0; i < nodesToActivate; i++) {
    let nodeIndex: number;
    if (Math.random() > 0.7) {
      const offset = Math.floor(Math.random() * 3) - 1;
      nodeIndex = Math.max(0, Math.min(currentNodes.length - 1, originNodeIndex + offset));
    } else {
      nodeIndex = Math.floor(Math.random() * currentNodes.length);
    }

    const node = currentNodes[nodeIndex] as HTMLElement;

    tl.call(() => {
      activateNode(node);
      if (layerIndex < layers.length - 1) {
        gsap.delayedCall(0.1, () => propagateSignal(layerIndex + 1, nodeIndex));
      }
    }, undefined, i * 0.05);
  }
}
```

`activateNode` se mantiene igual (solo agrega/quita la clase `.active`). Esto reemplaza la cadena de `setTimeout` por llamadas programadas en una timeline, lo que permite en el futuro pausar/reanudar toda la animación con `tl.pause()`/`tl.resume()` si hiciera falta (ej. respetar `prefers-reduced-motion`).

- [ ] **Step 5: Respetar `prefers-reduced-motion`**

Al inicio del script de `NeuralNetwork.astro`, antes de llamar a `initialize()`:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  initialize();
} else {
  generateConnections();
}
```

- [ ] **Step 6: Verificar en el navegador**

Run: `npm run dev`
Abrir `http://localhost:4321`, confirmar que la red neuronal del hero sigue animándose (nodos activándose, líneas de conexión), que el parallax de fondo responde al mouse, y que el headline nuevo se ve correctamente en desktop y en 375px.

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.astro src/components/HeroComponents/NeuralNetwork.astro
git commit -m "feat: strengthen hero copy and migrate neural network timing to gsap"
```

---

## Task 8: Redesign de QuienesSomos.astro

**Files:**
- Modify: `src/components/QuienesSomos.astro`

**Interfaces:**
- Consumes: `GridBackground`, `SectionHeader` (Task 3, 4), `revealOnScroll` (Task 5).
- Produces: sin cambios de props — `<QuienesSomos />` sigue igual en `index.astro`.

- [ ] **Step 1: Reemplazar el fondo y el header manuales por los componentes compartidos**

En el frontmatter:

```astro
---
import GridBackground from './ui/GridBackground.astro';
import SectionHeader from './ui/SectionHeader.astro';
---
```

Reemplazar `<div class="nosotros-grid-bg"></div>` por `<GridBackground opacity={0.4} />`, y el bloque `<div class="nosotros-header">...</div>` (título + línea) por:

```astro
<SectionHeader
  title="¿QUIÉNES SOMOS?"
  subtitle="El aliado tecnológico que traduce desafíos empresariales en crecimiento digital."
/>
```

Eliminar del `<style>` las reglas ya cubiertas por los componentes compartidos: `.nosotros-grid-bg`, `.nosotros-header`, `.nosotros-title`, `.nosotros-line`, `.glitch-effect` y sus keyframes asociados (el título ya no usa el efecto glitch — se retira porque dificulta la lectura y no aporta a "profesional").

- [ ] **Step 2: Reemplazar la cita de Steve Jobs por una frase propia de Transformia**

En el bloque `.retro-terminal` (terminal `INNOVACIÓN.SYS`), reemplazar:

```astro
<p class="quote-text">"La innovación distingue a los líderes de los seguidores."</p>
<p class="quote-author">— Steve Jobs</p>
```

por:

```astro
<p class="quote-text">"No vendemos software: construimos la infraestructura digital sobre la que tu empresa va a crecer."</p>
<p class="quote-author">— Equipo Transformia</p>
```

- [ ] **Step 3: Migrar el fade-in de las tarjetas a `revealOnScroll`**

Las 3 tarjetas (`NUESTRA ESENCIA`, `NUESTRA VISIÓN`, `NUESTRO ENFOQUE`) hoy no tienen animación de entrada por scroll explícita en el script — se agrega:

```astro
<script>
  import { revealOnScroll } from '../scripts/animations/scrollReveal';

  document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll('.nosotros-card', { stagger: 0.15 });
  });
</script>
```

- [ ] **Step 4: Verificar en el navegador**

Run: `npm run dev`
Confirmar: la sección `#nosotros` conserva las 3 tarjetas, el terminal con la nueva frase, y los valores (Innovación/Disrupción/Excelencia/Colaboración) sin cambios. Las tarjetas aparecen con fade-in al hacer scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/QuienesSomos.astro
git commit -m "refactor: quienessomos uses shared components, replace generic quote"
```

---

## Task 9: Redesign de QueHacemos.astro

**Files:**
- Modify: `src/components/QueHacemos.astro`

**Interfaces:**
- Consumes: `GridBackground`, `SectionHeader` (Task 3, 4), `revealOnScroll`, `initMagneticHover` (Task 5).
- Produces: sin cambios de props.

- [ ] **Step 1: Reemplazar fondo y header por componentes compartidos**

```astro
---
import GridBackground from './ui/GridBackground.astro';
import SectionHeader from './ui/SectionHeader.astro';
---

<GridBackground opacity={0.3} />

<SectionHeader
  title="¿QUÉ HACEMOS?"
  subtitle="Transformamos ideas en soluciones digitales de alto impacto"
/>
```

Eliminar `.cyber-background`, `.grid-lines`, `.section-header`, `.section-title`, `.glitch-text` y sus keyframes del `<style>` (cubiertos por los componentes).

- [ ] **Step 2: Reforzar el copy de cada tarjeta de servicio hacia el beneficio, no solo la actividad**

Mantener los 5 títulos (Observamos/Diseñamos/Desarrollamos/Optimizamos/Integramos) y sus tech-badges, pero ajustar las descripciones para que digan qué gana el cliente, no solo qué hace Transformia. Ejemplo para las 2 primeras (aplicar el mismo criterio a las 3 restantes manteniendo su badge y tema):

```astro
<h3 class="servicio-title">Observamos</h3>
<p class="servicio-description">
  Antes de escribir una línea de código, mapeamos tus procesos reales.
  El resultado: sabes exactamente dónde estás perdiendo tiempo y dinero,
  con datos — no con suposiciones.
</p>
```

```astro
<h3 class="servicio-title">Diseñamos</h3>
<p class="servicio-description">
  Diseño centrado en quien realmente usa el sistema todos los días,
  no en lo que se ve bien en una presentación. Menos capacitación,
  más adopción desde el primer día.
</p>
```

- [ ] **Step 3: Reemplazar el hover 3D manual por `initMagneticHover`**

El script actual calcula `rotateX`/`rotateY` a mano en el listener `mousemove` de `.servicio-card`. Reemplazar ese bloque por:

```astro
<script>
  import { initMagneticHover } from '../scripts/animations/magnetic';
  import { revealOnScroll } from '../scripts/animations/scrollReveal';

  document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll('.servicio-card', { stagger: 0.1 });

    document.querySelectorAll<HTMLElement>('.servicio-card').forEach((card) => {
      initMagneticHover(card, 8);
    });
  });
</script>
```

Eliminar el `IntersectionObserver` manual y el listener `mousemove` original que quedan reemplazados por estas dos llamadas.

- [ ] **Step 4: Verificar en el navegador**

Run: `npm run dev`
Confirmar: las 5 tarjetas de servicio se ven con el nuevo copy, hacen fade-in al entrar en viewport, y responden con inclinación 3D suave al mover el mouse encima. El bloque "Desarrollo a medida" con la lista de features y el stack tecnológico se mantiene sin cambios.

- [ ] **Step 5: Commit**

```bash
git add src/components/QueHacemos.astro
git commit -m "refactor: quehacemos uses shared components, strengthen copy, migrate to gsap"
```

---

## Task 10: Redesign de Soluciones.astro (wrapper)

**Files:**
- Modify: `src/components/Soluciones.astro`

**Interfaces:**
- Consumes: `GridBackground`, `SectionHeader`, `TechBadge` (Task 3, 4). No modifica `SolucionesTabCards.astro` ni los 7 slides — su contenido (Desarrollo, Transformación, Inteligencia, Asesoría, IoT, Arquitectura, Bases de Datos) queda intacto por decisión del spec.
- Produces: sin cambios de props.

- [ ] **Step 1: Reemplazar fondo y header del wrapper**

```astro
---
import SolucionesTabCards from './SolucionesComponents/SolucionesTabCards.astro';
import GridBackground from './ui/GridBackground.astro';
import SectionHeader from './ui/SectionHeader.astro';
---

<section id="soluciones" class="soluciones-section">
  <GridBackground opacity={0.5} perspective />

  <div class="container">
    <SectionHeader
      title="SOLUCIONES / SERVICIOS"
      badge="ALTA TECNOLOGÍA"
      subtitle="Soluciones digitales de vanguardia que transforman desafíos en oportunidades de crecimiento para tu negocio."
    />

    <div class="tab-cards-wrapper">
      <SolucionesTabCards />
    </div>
  </div>
</section>
```

Eliminar del `<style>` las reglas ahora cubiertas por los componentes compartidos: `.grid-background`, `.matrix-bg` (el matrix-bg se retira — es ruido decorativo redundante con el grid en perspectiva, consistente con "menos ruido decorativo repetido" del spec), `.section-header`, `.section-title`, `.title-text`, `.separator`, `.badge-container`, `.tech-badge`, `.title-line`.

- [ ] **Step 2: Verificar en el navegador**

Run: `npm run dev`
Confirmar: la sección `#soluciones` conserva el sistema de 7 tabs funcionando (click en cada tab cambia el slide activo), el grid de fondo en perspectiva se ve, y el header nuevo con badge se renderiza correctamente.

- [ ] **Step 3: Commit**

```bash
git add src/components/Soluciones.astro
git commit -m "refactor: soluciones wrapper uses shared components"
```

---

## Task 11: Redesign de MetodologiaTrabajo.astro (wrapper)

**Files:**
- Modify: `src/components/MetodologiaTrabajo.astro`

**Interfaces:**
- Consumes: `GridBackground` (Task 3). No modifica `MetodologiaHeader.astro`, `MetodologiaCycle.astro` ni `MetodologiaBeneficios.astro` — su contenido (timeline Cliente → Descubrimiento → ... y tarjetas de beneficios) queda intacto.
- Produces: sin cambios de props.

- [ ] **Step 1: Reemplazar el fondo cyberpunk manual por GridBackground**

```astro
---
import MetodologiaHeader from './MetodologiaComponents/MetodologiaHeader.astro';
import MetodologiaCycle from './MetodologiaComponents/MetodologiaCycle.astro';
import MetodologiaBeneficios from './MetodologiaComponents/MetodologiaBeneficios.astro';
import GridBackground from './ui/GridBackground.astro';
---

<section id="metodologia" class="metodologia-section">
  <GridBackground opacity={0.5} perspective />

  <div class="container">
    <MetodologiaHeader />
    <div class="header-cycle-spacer"></div>
    <MetodologiaCycle />
    <div class="section-spacer"></div>
    <MetodologiaBeneficios />
  </div>
</section>
```

Eliminar del `<style>`: `.cyberpunk-background`, `.digital-grid`, `.code-lines` y sus keyframes (el "efecto lluvia de código" se retira — es la tercera capa de ruido de fondo distinta en esta sección; el grid en perspectiva compartido ya cubre la ambientación técnica). Mantener `.tech-ui-elements` (las esquinas HUD) tal cual, o migrarlas a `<CornerFrame />` si el layout de la sección lo permite sin romper el `.scanning-line` existente — verificar visualmente antes de decidir.

- [ ] **Step 2: Verificar en el navegador**

Run: `npm run dev`
Confirmar: la sección `#metodologia` conserva el header "METODOLOGÍA ÁGIL", el timeline interactivo completo (click en cada paso del 1 al N abre su tarjeta de info), y las tarjetas de beneficios, todo sin regresiones.

- [ ] **Step 3: Commit**

```bash
git add src/components/MetodologiaTrabajo.astro
git commit -m "refactor: metodologia wrapper uses shared grid background"
```

---

## Task 12: Redesign de PorQueElegirnos.astro — eliminar métricas falsas

**Files:**
- Modify: `src/components/PorQueElegirnos.astro`

**Interfaces:**
- Consumes: `GridBackground`, `GlowOrbs`, `SectionHeader` (Task 3, 4), `revealOnScroll` (Task 5).
- Produces: sin cambios de props.

- [ ] **Step 1: Reemplazar fondo y header por componentes compartidos**

```astro
---
import GridBackground from './ui/GridBackground.astro';
import GlowOrbs from './ui/GlowOrbs.astro';
import SectionHeader from './ui/SectionHeader.astro';
---

<section id="porque-elegirnos" class="porque-elegirnos-section">
  <GridBackground opacity={0.5} />
  <GlowOrbs />

  <div class="container">
    <SectionHeader
      title="¿POR QUÉ ELEGIRNOS?"
      subtitle="En Transformia llevamos tus ideas al siguiente nivel, con soluciones tecnológicas que marcan la diferencia en un mercado en constante evolución."
    />
    <!-- resto de .main-content sin cambios de estructura -->
  </div>
</section>
```

Eliminar del `<style>`: `.cyber-background`, `.grid-lines`, `.glow-orbs`, `.orb`, `.orb-1/2/3` y sus keyframes, `.section-header`, `.badge`/`.badge-text`/`.badge-light` (código muerto que ya estaba comentado como no usado), `.section-title`, `.title-glitch` y sus keyframes.

- [ ] **Step 2: Reemplazar las tarjetas flotantes con métricas inventadas por diferenciadores cualitativos**

En `.floating-cards-container`, reemplazar:

```astro
<div class="floating-card fc-metric fc-1">
  <div class="fc-value">100%</div>
  <div class="fc-label">Compromiso</div>
</div>

<div class="floating-card fc-metric fc-2">
  <div class="fc-value">24/7</div>
  <div class="fc-label">Soporte</div>
</div>

<div class="floating-card fc-metric fc-3">
  <div class="fc-value">+94%</div>
  <div class="fc-label">Satisfacción</div>
</div>
```

por tres keywords adicionales (sin números), consistentes con las 4 que ya existen (Rapidez, Eficacia, Excelencia, Innovación):

```astro
<div class="floating-card fc-keyword fc-1">Cercanía</div>
<div class="floating-card fc-keyword fc-2">Compromiso</div>
<div class="floating-card fc-keyword fc-3">Adaptabilidad</div>
```

En el `<style>`, eliminar las reglas específicas de `.fc-metric`, `.fc-value`, `.fc-label` y sus colores asociados (`.fc-1 .fc-value`, etc.), y extender las reglas ya existentes de `.fc-keyword`/`.fc-4`.../`.fc-7` para que también apliquen a `.fc-1`, `.fc-2`, `.fc-3` con los mismos colores neón que ya usa el resto de keywords (purple/blue/pink). Las posiciones (`top`/`left`/`right`/`bottom`) y las animaciones `float-random-N` que ya existían para `fc-1`, `fc-2`, `fc-3` se conservan — solo cambia qué contenido/clase llevan, no su posicionamiento.

- [ ] **Step 3: Migrar el fade-in de las tarjetas a `revealOnScroll`**

Reemplazar el `IntersectionObserver` manual del script por:

```astro
<script>
  import { revealOnScroll } from '../scripts/animations/scrollReveal';

  document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll('.ventaja-card', { stagger: 0.15 });
  });
</script>
```

Mantener el listener `mousemove` de `.card-glow` por tarjeta tal cual está (es un efecto de iluminación local por tarjeta, no un parallax de sección — no aplica `initParallax`).

- [ ] **Step 4: Verificar en el navegador**

Run: `npm run dev`
Confirmar: las 6 tarjetas de diferenciadores se ven igual, la animación orbital central se mantiene, y las 7 tarjetas flotantes ahora son todas keywords (sin ningún número/porcentaje inventado).

- [ ] **Step 5: Commit**

```bash
git add src/components/PorQueElegirnos.astro
git commit -m "fix: remove fabricated metrics from porque-elegirnos section"
```

---

## Task 13: Redesign de CallToAction.astro

**Files:**
- Modify: `src/components/CallToAction.astro`

**Interfaces:**
- Consumes: `CornerFrame` (Task 3), `initParallax`, `initMagneticHover` (Task 5).
- Produces: sin cambios de props.

- [ ] **Step 1: Reemplazar las esquinas decorativas manuales por CornerFrame**

```astro
---
import CornerFrame from './ui/CornerFrame.astro';
---

<section id="contactanos" class="cta-section">
  <div class="cta-background">
    <div class="code-matrix"></div>
    <div class="glow-layer"></div>
  </div>

  <CornerFrame />

  <!-- resto de la sección (energy-lines, data-points, cta-container) sin cambios de estructura -->
</section>
```

Eliminar del `<style>` las reglas `.tech-corner`, `.corner-line`, `.top-left/.top-right/.bottom-left/.bottom-right` y sus posiciones específicas (cubiertas por `CornerFrame`). Mantener `.circuit-overlay` — se retira si tras la verificación visual del Step 3 se ve redundante con `.code-matrix`, o se conserva si aporta profundidad; decidir en base a lo que se vea en pantalla, no a priori.

- [ ] **Step 2: Reforzar el copy del CTA hacia un cierre más directo**

Reemplazar:

```astro
<h2 class="cta-headline">
  <span class="text-highlight-start">&lt;</span>
  POTENCIA TU EMPRESA CON SOLUCIONES TECNOLÓGICAS A MEDIDA
  <span class="text-highlight-end">/&gt;</span>
</h2>

<p class="cta-text">
  ¿Listo para dar el salto y convertir tus procesos en motores de innovación y rentabilidad?
  En Transformia estamos preparados para acompañarte en cada paso del camino.
</p>
```

por:

```astro
<h2 class="cta-headline">
  <span class="text-highlight-start">&lt;</span>
  HABLEMOS DE TU PRÓXIMO PROYECTO
  <span class="text-highlight-end">/&gt;</span>
</h2>

<p class="cta-text">
  Contanos qué proceso te está frenando y en una primera llamada te decimos,
  sin rodeos, si podemos ayudarte y cómo. Sin compromiso.
</p>
```

- [ ] **Step 3: Reemplazar el parallax y el hover 3D manuales por las utilidades compartidas**

Reemplazar el bloque `<script>` completo (parallax de `.glow-layer`/`.data-point`, LEDs, hover 3D de `.cyber-button`, delays de `.data-bit`) por:

```astro
<script>
  import { initParallax } from '../scripts/animations/parallax';
  import { initMagneticHover } from '../scripts/animations/magnetic';

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector<HTMLElement>('.cta-section');
    const glow = document.querySelector<HTMLElement>('.glow-layer');
    const dataPoints = document.querySelectorAll<HTMLElement>('.data-point');

    if (section && glow) {
      const targets = [{ el: glow, strength: 25 }, ...Array.from(dataPoints).map((el) => ({ el, strength: 15 }))];
      initParallax(section, targets);
    }

    const cyberButton = document.querySelector<HTMLElement>('.cyber-button');
    if (cyberButton) {
      initMagneticHover(cyberButton, 10);
    }

    document.querySelectorAll<HTMLElement>('.led.active').forEach((led, index) => {
      led.style.animationDelay = `${index * 0.5}s`;
    });

    document.querySelectorAll<HTMLElement>('.data-bit').forEach((bit, index) => {
      bit.style.animationDelay = `${index * 0.2}s`;
    });
  });
</script>
```

- [ ] **Step 4: Verificar en el navegador**

Run: `npm run dev`
Confirmar: el CTA muestra el nuevo copy, las esquinas HUD se ven vía `CornerFrame`, el fondo responde a parallax de mouse, y el botón "CONTACTAR AHORA" tiene el efecto de inclinación 3D al pasar el mouse y sigue enlazando a `/contacto`.

- [ ] **Step 5: Commit**

```bash
git add src/components/CallToAction.astro
git commit -m "refactor: cta uses shared components, strengthen closing copy"
```

---

## Task 14: Redesign de Footer.astro — arreglar enlaces rotos

**Files:**
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Consumes: tokens de Task 2.
- Produces: sin cambios de props. Los `href="/privacidad"` y `href="/terminos"` pasan a apuntar a páginas reales creadas en Task 16.

- [ ] **Step 1: Marcar honestamente los social links pendientes**

Los 4 `<a href="#" class="social-link">` (LinkedIn, Twitter, Facebook, Instagram) no tienen URL real todavía. Agregar `aria-disabled="true"` y una clase visual distinta para no simular que son funcionales:

```astro
<a href="#" class="social-link social-link--pending" aria-disabled="true" aria-label="LinkedIn (próximamente)" title="Próximamente">
  <!-- svg sin cambios -->
</a>
```

Repetir para los 4 (Twitter, Facebook, Instagram) con su respectivo `aria-label`.

En el `<style>`, agregar:

```css
.social-link--pending {
  opacity: 0.5;
  cursor: default;
}

.social-link--pending:hover {
  transform: none;
  box-shadow: none;
  background: rgba(var(--neon-purple-rgb), 0.1);
  border-color: rgba(var(--neon-purple-rgb), 0.3);
}
```

- [ ] **Step 2: Confirmar que los links legales apuntan a las rutas que se crean en Task 16**

Verificar que el markup ya tiene:

```astro
<a href="/privacidad" class="legal-link">Política de Privacidad</a>
<a href="/terminos" class="legal-link">Términos de Uso</a>
```

(no requiere cambio de código — estos links ya son correctos, lo que falta son las páginas destino, que se crean en Task 16).

- [ ] **Step 3: Verificar en el navegador**

Run: `npm run dev`
Confirmar: los social links se ven visualmente "atenuados"/pendientes y no prometen funcionalidad que no existe; el resto del footer (logo, contacto, tech badges, copyright) se mantiene igual.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro
git commit -m "fix: mark pending social links honestly in footer"
```

---

## Task 15: Página /contacto real + corrección de ContactoForm.astro

**Files:**
- Create: `src/pages/contacto.astro`
- Modify: `src/components/ContactoForm.astro`

**Interfaces:**
- Consumes: `MainLayout.astro` (ya existente), `CornerFrame` (Task 3), `initParallax` (Task 5).
- Produces: ruta `/contacto` responde 200 y usa `ContactoForm.astro`. Los dos CTAs que ya apuntaban a `/contacto` (`CallToAction.astro`, `cotizacion.astro`) dejan de romper.

- [ ] **Step 1: Corregir la información de contacto falsa en ContactoForm.astro**

Reemplazar los datos placeholder de México por los reales de Transformia (los mismos que ya usan `Navbar.astro` y `Footer.astro`):

```astro
<div class="option-details">
  <h3 class="option-title">Llámanos</h3>
  <p class="option-value">+57 321 259 6437</p>
</div>
```

```astro
<div class="option-details">
  <h3 class="option-title">Escríbenos</h3>
  <p class="option-value">transformia.desarrollo@gmail.com</p>
</div>
```

```astro
<div class="option-details">
  <h3 class="option-title">Visítanos</h3>
  <p class="option-value">Tauramena, Casanare, Colombia</p>
</div>
```

- [ ] **Step 2: Reemplazar el envío simulado falso por un estado honesto**

En el `<script>` de `ContactoForm.astro`, ubicar el handler de `submit` que hoy hace `setTimeout` y muestra "¡MENSAJE ENVIADO!". Reemplazarlo por:

```astro
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitButton = document.querySelector('.submit-button') as HTMLButtonElement;
        const buttonText = submitButton.querySelector('.button-text') as HTMLElement;

        buttonText.textContent = 'ENVÍO DIRECTO AÚN NO DISPONIBLE';
        submitButton.disabled = true;
        submitButton.classList.add('submit-button--pending');

        const notice = document.getElementById('form-pending-notice');
        if (notice) notice.style.display = 'block';
      });
    }
  });
</script>
```

Agregar debajo del `<form>`, dentro de `.tech-form`, un aviso visible (oculto por defecto) que se muestra al intentar enviar:

```astro
<div id="form-pending-notice" class="form-pending-notice" style="display: none;">
  Este formulario todavía no envía mensajes automáticamente. Mientras lo conectamos,
  escribinos directo a <a href="mailto:transformia.desarrollo@gmail.com">transformia.desarrollo@gmail.com</a>
  o llamanos al <a href="tel:+573212596437">+57 321 259 6437</a>.
</div>
```

Y su estilo:

```css
.form-pending-notice {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(var(--neon-yellow-rgb, 232, 255, 66), 0.08);
  border: 1px solid rgba(232, 255, 66, 0.4);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-pending-notice a {
  color: var(--neon-yellow, #e8ff42);
  text-decoration: underline;
}
```

- [ ] **Step 3: Migrar el parallax manual de ContactoForm a `initParallax`**

Igual patrón que Task 13 Step 3, aplicado a `.contacto-section` / `.radial-glow` / `.data-node` de este componente.

- [ ] **Step 4: Crear la página /contacto**

```astro
---
// src/pages/contacto.astro
import MainLayout from '../layouts/MainLayout.astro';
import ContactoForm from '../components/ContactoForm.astro';
---

<MainLayout title="Contacto | Transformia">
  <ContactoForm />
</MainLayout>
```

- [ ] **Step 5: Verificar en el navegador**

Run: `npm run dev`
Navegar a `http://localhost:4321/contacto`, confirmar: el formulario se ve con la información de contacto correcta (Colombia), al enviar sin completar campos requeridos el navegador bloquea el submit por validación nativa (`required`), y al completar y enviar aparece el aviso honesto de "envío directo aún no disponible" en vez de un falso éxito. Confirmar también que el botón "CONTACTAR AHORA" del CTA de la home y el botón "CONSULTAR COTIZACIÓN" de `/cotizacion` navegan correctamente a `/contacto`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/contacto.astro src/components/ContactoForm.astro
git commit -m "feat: add /contacto page and fix fake contact info and fake form success"
```

---

## Task 16: Páginas placeholder /privacidad y /terminos

**Files:**
- Create: `src/components/ui/LegalPagePlaceholder.astro`
- Create: `src/pages/privacidad.astro`
- Create: `src/pages/terminos.astro`

**Interfaces:**
- Consumes: `MainLayout.astro`.
- Produces:
  - `<LegalPagePlaceholder title="..." />` — componente compartido, sin duplicar el bloque de estilos entre las dos páginas.
  - Rutas `/privacidad` y `/terminos` responden 200 (dejan de ser 404 desde los links del footer).

- [ ] **Step 1: Crear el componente compartido LegalPagePlaceholder.astro**

```astro
---
// src/components/ui/LegalPagePlaceholder.astro
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<section class="legal-placeholder">
  <div class="legal-placeholder-content">
    <h1>{title}</h1>
    <p>Estamos preparando el contenido de esta página.</p>
    <p>
      Si tenés alguna consulta mientras tanto, escribinos a
      <a href="mailto:transformia.desarrollo@gmail.com">transformia.desarrollo@gmail.com</a>.
    </p>
    <a href="/" class="legal-placeholder-back">Volver al inicio</a>
  </div>
</section>

<style>
  .legal-placeholder {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--dark-bg);
    color: white;
    padding: 8rem 2rem 4rem;
    text-align: center;
  }

  .legal-placeholder-content {
    max-width: 560px;
  }

  .legal-placeholder-content h1 {
    font-family: var(--font-body);
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .legal-placeholder-content p {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    margin-bottom: 1rem;
    font-family: var(--font-body);
  }

  .legal-placeholder-content a {
    color: var(--neon-purple);
  }

  .legal-placeholder-back {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.65rem 1.5rem;
    border: 1px solid var(--neon-purple);
    border-radius: 4px;
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .legal-placeholder-back:hover {
    background: rgba(var(--neon-purple-rgb), 0.15);
  }
</style>
```

- [ ] **Step 2: Crear privacidad.astro usando el componente compartido**

```astro
---
// src/pages/privacidad.astro
import MainLayout from '../layouts/MainLayout.astro';
import LegalPagePlaceholder from '../components/ui/LegalPagePlaceholder.astro';
---

<MainLayout title="Política de Privacidad | Transformia">
  <LegalPagePlaceholder title="Política de Privacidad" />
</MainLayout>
```

- [ ] **Step 3: Crear terminos.astro usando el mismo componente compartido**

```astro
---
// src/pages/terminos.astro
import MainLayout from '../layouts/MainLayout.astro';
import LegalPagePlaceholder from '../components/ui/LegalPagePlaceholder.astro';
---

<MainLayout title="Términos de Uso | Transformia">
  <LegalPagePlaceholder title="Términos de Uso" />
</MainLayout>
```

- [ ] **Step 4: Verificar en el navegador**

Run: `npm run dev`
Navegar a `http://localhost:4321/privacidad` y `http://localhost:4321/terminos`, confirmar que ambas cargan (sin 404) con el mensaje placeholder y el link "Volver al inicio" funciona. Confirmar desde `/` que los links del footer "Política de Privacidad" y "Términos de Uso" navegan correctamente.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/LegalPagePlaceholder.astro src/pages/privacidad.astro src/pages/terminos.astro
git commit -m "feat: add placeholder privacy and terms pages to fix broken footer links"
```

---

## Task 17: QA visual de sitio completo

**Files:**
- No se crean ni modifican archivos de producto en esta tarea (solo verificación; si aparecen bugs, se corrigen en el archivo correspondiente y se documenta cuál).

**Interfaces:**
- Consumes: todo lo construido en Tasks 1-16.

- [ ] **Step 1: Build de producción**

Run: `npm run build`
Expected: build termina sin errores ni warnings de Astro/TypeScript.

- [ ] **Step 2: Recorrido completo en desktop**

Run: `npm run dev`, abrir `http://localhost:4321` en viewport de escritorio (1280px+) y recorrer en orden: Navbar → Hero → Quiénes Somos → Qué Hacemos → Soluciones (probar los 7 tabs) → Metodología (probar los pasos del timeline) → Por Qué Elegirnos (confirmar que no queda ningún número/porcentaje inventado) → CallToAction → Footer. Confirmar que cada sección usa la paleta de colores consistente (sin ningún morado con valor distinto a `#b042ff`) y que las animaciones GSAP corren sin saltos ni errores en la consola del navegador.

- [ ] **Step 3: Recorrido completo en mobile (375px)**

Repetir el Step 2 con el viewport en 375px de ancho. Confirmar: el menú móvil del navbar abre/cierra, ninguna sección tiene overflow horizontal, el texto es legible sin zoom.

- [ ] **Step 4: Verificar rutas nuevas**

Navegar a `/contacto`, `/privacidad`, `/terminos` y confirmar que las tres responden 200 y se ven correctamente en ambos viewports.

- [ ] **Step 5: Revisar consola del navegador**

Con devtools abierto, recorrer todas las páginas y confirmar 0 errores en consola (los `console.error` de scripts rotos, si aparecen, se corrigen antes de dar la tarea por completa).

- [ ] **Step 6: Commit final (solo si Step 2-5 requirieron fixes)**

```bash
git add -A
git commit -m "fix: address issues found in full-site visual QA pass"
```

Si no hubo fixes que commitear, esta tarea termina en el Step 5 sin commit adicional.

---

## Self-Review (completado por quien escribió el plan)

- **Cobertura del spec**: sistema de diseño compartido → Tasks 2-4; motor GSAP → Task 5 + su uso en Tasks 7,9,12,13,15; las 7 secciones + copy reforzado → Tasks 6-14; métricas falsas eliminadas → Task 12; `/contacto` real + `ContactoForm` corregido → Task 15; `/privacidad`/`/terminos` → Task 16; verificación → Task 17. Todo el spec de 2026-08-03 está cubierto.
- **Placeholders**: sin TBD/TODO; cada step de código tiene contenido real y específico (selectores, copy final, valores de color exactos).
- **Consistencia de tipos/nombres**: `revealOnScroll(selector, options)`, `initParallax(container, targets)`, `initMagneticHover(el, strength)` se usan con la misma firma en todas las tareas que los consumen (7, 8, 9, 12, 13, 15). Los componentes `GridBackground`/`SectionHeader`/`TechBadge`/`GlowOrbs`/`CornerFrame` se consumen con las mismas props definidas en Tasks 3-4 en todas las tareas posteriores.
