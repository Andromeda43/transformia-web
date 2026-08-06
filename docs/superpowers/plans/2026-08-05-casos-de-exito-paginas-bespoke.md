# Casos de éxito bespoke + página completa de Frigorinoquia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sacar `casos-de-exito` de Content Collections (que queda exclusivo para `blog`), convertir los 6 casos en páginas Astro individuales, y construir la página completa de Frigorinoquia con las capturas y fotos reales ya disponibles en `src/assets/casos-de-exito/frigorinoquia/`, animada con GSAP.

**Architecture:** Astro 5 + GSAP (ya instalado). Una fuente de datos local liviana (`src/data/casosDeExito.ts`) reemplaza `getCollection('casos-de-exito')` para el listado del hub y de la home. `CaseStudyLayout.astro` pasa de recibir un `CollectionEntry` a recibir props sueltas, y sigue siendo el layout compartido de los 5 casos "de texto". Frigorinoquia no usa ese layout — es una página bespoke propia con su propia composición visual (galería de capturas, evidencia física, diagrama animado de las 6 apps, contador animado).

**Tech Stack:** Astro 5.4, `astro:assets` (`<Image>`) para las imágenes reales, GSAP + ScrollTrigger (ya en el proyecto desde el rediseño visual), TypeScript.

## Global Constraints

- `blog` sigue siendo una Content Collection — no se toca en este plan.
- La colección `casos-de-exito` (`src/content/casos-de-exito/*.md` y su entrada en `src/content/config.ts`) se elimina al terminar el plan — no debe quedar ningún archivo ni referencia.
- Ninguna cifra se inventa. El "56.57%" del contador animado de Frigorinoquia sale literalmente de `screenshot-reporte-beneficio-animales.png` (campo "Rendimiento Promedio" del reporte real).
- Todas las imágenes reales de Frigorinoquia se sirven vía `astro:assets` (`<Image>`), nunca `<img src="...">` crudo — los originales pesan hasta ~1.5MB y necesitan compresión/responsive automática.
- La foto `foto-etiqueta-zpl-producto-terminado.jpg` (producto cárnico visible) se muestra siempre recortada dentro de una tarjeta con `object-fit: cover` y una caption — nunca a página completa ni como fondo de sección.
- Paleta y tipografía: solo variables de `src/styles/tokens.css` (`--neon-purple`, `--neon-blue`, `--font-mono`, `--font-body`, `--radius-card`, etc.) — ningún componente nuevo redeclara `:root`.
- No se introduce framework de testing. Verificación = `npm run build` + revisión visual en `npm run dev`, consistente con el resto del proyecto.
- El rediseño "premium" de las secciones de casos de éxito y blog en la home NO es parte de este plan — es un diseño separado, siguiente a este.

---

## Task 1: Utilidad GSAP de contador animado

**Files:**
- Create: `src/scripts/animations/counter.ts`

**Interfaces:**
- Produces: `animateCounters(selector: string): void` — para cada elemento que matchee `selector`, lee `data-target` (número, puede tener decimales) y `data-suffix` (string opcional) de sus `dataset`, y anima el `textContent` de 0 al valor final cuando el elemento entra en viewport. Respeta `prefers-reduced-motion` (salta directo al valor final sin animar). Consumido por Task 5 (página de Frigorinoquia).

- [ ] **Step 1: Crear `src/scripts/animations/counter.ts`**

```ts
// src/scripts/animations/counter.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateCounters(selector: string): void {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((target) => {
    const rawTarget = target.dataset.target ?? '0';
    const targetValue = parseFloat(rawTarget);
    const decimals = rawTarget.includes('.') ? rawTarget.split('.')[1].length : 0;
    const suffix = target.dataset.suffix ?? '';

    if (prefersReducedMotion) {
      target.textContent = `${targetValue.toFixed(decimals)}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    ScrollTrigger.create({
      trigger: target,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: targetValue,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            target.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
          },
        });
      },
    });
  });
}
```

- [ ] **Step 2: Verificar el build**

Run: `npm run build`
Expected: build termina sin errores (el archivo no se usa todavía en ningún lado, solo se confirma que no rompe TypeScript/el bundling).

- [ ] **Step 3: Commit**

```bash
git add src/scripts/animations/counter.ts
git commit -m "feat: add animated counter GSAP utility"
```

---

## Task 2: Componentes visuales — marco de captura y diagrama de pipeline

**Files:**
- Create: `src/components/casos-de-exito/AppScreenshotFrame.astro`
- Create: `src/components/casos-de-exito/FrigorinoquiaPipeline.astro`

**Interfaces:**
- Produces: `<AppScreenshotFrame src={ImageMetadata} alt={string} label?={string} />` — envuelve una captura de pantalla en un marco tipo "browser chrome" (barra superior con puntos + label opcional). Consumido por Task 5.
- Produces: `<FrigorinoquiaPipeline />` — diagrama horizontal de 6 nodos (Apertura → Presa → Granel → Despacho → Reportes → Cobranza) con línea conectora que se dibuja al hacer scroll. Sin props — contenido fijo, específico de este caso. Consumido por Task 5.

- [ ] **Step 1: Crear `src/components/casos-de-exito/AppScreenshotFrame.astro`**

```astro
---
// src/components/casos-de-exito/AppScreenshotFrame.astro
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

interface Props {
  src: ImageMetadata;
  alt: string;
  label?: string;
}

const { src, alt, label } = Astro.props;
---

<figure class="screenshot-frame">
  <div class="frame-chrome">
    <span class="frame-dot frame-dot--red"></span>
    <span class="frame-dot frame-dot--yellow"></span>
    <span class="frame-dot frame-dot--green"></span>
    {label && <span class="frame-label">{label}</span>}
  </div>
  <Image src={src} alt={alt} widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 600px" loading="lazy" />
</figure>

<style>
  .screenshot-frame {
    margin: 0;
    border-radius: var(--radius-card);
    overflow: hidden;
    border: 1px solid rgba(var(--neon-purple-rgb), 0.25);
    background: rgba(10, 10, 20, 0.6);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .screenshot-frame:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(var(--neon-purple-rgb), 0.2);
  }

  .frame-chrome {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.9rem;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(var(--neon-purple-rgb), 0.2);
  }

  .frame-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }

  .frame-dot--red {
    background: #ff5f57;
  }

  .frame-dot--yellow {
    background: #febc2e;
  }

  .frame-dot--green {
    background: #28c840;
  }

  .frame-label {
    margin-left: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .screenshot-frame :global(img) {
    display: block;
    width: 100%;
    height: auto;
  }
</style>
```

- [ ] **Step 2: Crear `src/components/casos-de-exito/FrigorinoquiaPipeline.astro`**

```astro
---
// src/components/casos-de-exito/FrigorinoquiaPipeline.astro
const nodes = [
  { label: 'Apertura', desc: 'Apertura de lote' },
  { label: 'Presa', desc: 'Pesaje individual' },
  { label: 'Granel', desc: 'Pesaje por canastilla' },
  { label: 'Despacho', desc: 'Guías y certificados' },
  { label: 'Reportes', desc: 'KPIs en tiempo real' },
  { label: 'Cobranza', desc: 'Liquidación de maquila' },
];
---

<div class="pipeline" id="frigorinoquia-pipeline">
  <svg class="pipeline-lines" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true">
    <line x1="100" y1="20" x2="1100" y2="20" class="pipeline-line-track"></line>
    <line x1="100" y1="20" x2="1100" y2="20" class="pipeline-line-draw"></line>
  </svg>
  <div class="pipeline-nodes">
    {nodes.map((node) => (
      <div class="pipeline-node">
        <span class="node-dot"></span>
        <span class="node-label">{node.label}</span>
        <span class="node-desc">{node.desc}</span>
      </div>
    ))}
  </div>
</div>

<style>
  .pipeline {
    position: relative;
    padding: 3rem 0 1rem;
  }

  .pipeline-lines {
    position: absolute;
    top: 1.6rem;
    left: 0;
    width: 100%;
    height: 40px;
    display: none;
  }

  .pipeline-line-track {
    stroke: rgba(var(--neon-purple-rgb), 0.15);
    stroke-width: 2;
  }

  .pipeline-line-draw {
    stroke: var(--neon-purple);
    stroke-width: 2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }

  .pipeline-nodes {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    position: relative;
    z-index: 2;
  }

  .pipeline-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
    opacity: 0;
  }

  .node-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--dark-bg);
    border: 2px solid var(--neon-purple);
    box-shadow: 0 0 10px rgba(var(--neon-purple-rgb), 0.5);
  }

  .node-label {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: white;
    font-weight: 600;
  }

  .node-desc {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (min-width: 769px) {
    .pipeline-lines {
      display: block;
    }
  }

  @media (max-width: 768px) {
    .pipeline-nodes {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('frigorinoquia-pipeline');
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = container.querySelectorAll('.pipeline-node');
    const line = container.querySelector('.pipeline-line-draw');

    if (prefersReducedMotion) {
      gsap.set(nodes, { opacity: 1 });
      if (line) gsap.set(line, { strokeDashoffset: 0 });
      return;
    }

    ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (line) {
          gsap.to(line, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' });
        }
        gsap.to(nodes, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.2,
        });
      },
    });
  });
</script>
```

- [ ] **Step 3: Verificar el build**

Run: `npm run build`
Expected: build sin errores (ninguno de los dos componentes se usa todavía).

- [ ] **Step 4: Commit**

```bash
git add src/components/casos-de-exito
git commit -m "feat: add screenshot frame and pipeline diagram components"
```

---

## Task 3: Fuente de datos de casos de éxito + refactor de `CaseStudyCard`

**Files:**
- Create: `src/data/casosDeExito.ts`
- Modify: `src/components/CaseStudyCard.astro`

**Interfaces:**
- Produces: `interface CasoDeExito { slug: string; cliente: string; industria: string; resultadoCorto: string; status: 'ejecutado' | 'propuesta'; featured: boolean }` y el array `casosDeExito: CasoDeExito[]` con los 6 casos. Consumido por Tasks 4 (hub, teaser de home).
- Produces: `CaseStudyCard.astro` ahora acepta `{ slug, cliente, industria, resultadoCorto, status }` como props sueltas (antes: `{ entry: CollectionEntry<'casos-de-exito'> }`). Consumido por Task 4.

- [ ] **Step 1: Crear `src/data/casosDeExito.ts`**

```ts
// src/data/casosDeExito.ts
export interface CasoDeExito {
  slug: string;
  cliente: string;
  industria: string;
  resultadoCorto: string;
  status: 'ejecutado' | 'propuesta';
  featured: boolean;
}

export const casosDeExito: CasoDeExito[] = [
  {
    slug: 'tesla-gps',
    cliente: 'Tesla GPS',
    industria: 'Instalación y monitoreo de GPS vehicular',
    resultadoCorto:
      'Tesla GPS pasa de una operación dispersa en hojas de cálculo a una plataforma única donde cada cliente, vehículo, dispositivo y plan es trazable, cada rol tiene su espacio, y la información está disponible en tiempo real para tomar decisiones — sin perder de vista una renovación ni un equipo.',
    status: 'ejecutado',
    featured: true,
  },
  {
    slug: 'frigorinoquia',
    cliente: 'Frigorinoquia',
    industria: 'Planta de beneficio animal y desposte',
    resultadoCorto:
      'Frigorinoquia pasa de un proceso documentado en papel y Excel a una suite conectada donde cada animal, lote, corte y despacho queda trazado de punta a punta, con el peso capturado directamente de báscula, las etiquetas impresas automáticamente, el inventario descontado en tiempo real, y la cobranza generada a partir de los mismos datos operativos, sin doble digitación.',
    status: 'ejecutado',
    featured: true,
  },
  {
    slug: 'tracing-colombina',
    cliente: 'Colombina Conservas',
    industria: 'Manufactura de alimentos',
    resultadoCorto:
      'Colombina pasa de una orden de producción en Excel suelta por correo a un ciclo de trazabilidad continuo: se planea, se scrapea automáticamente hacia PostgreSQL, se ejecuta en planta con pesaje y escaneo validados contra la fórmula esperada, y todo se refleja en un dashboard en tiempo real que gerencia puede filtrar sin esperar al cierre del turno.',
    status: 'ejecutado',
    featured: true,
  },
  {
    slug: 'feriaapp',
    cliente: 'FeriaApp (patrocinado por Frigorinoquia)',
    industria: 'Marketplace de ganado — Orinoquía colombiana',
    resultadoCorto:
      'FeriaApp le da a la Orinoquía ganadera un canal formal de compraventa que antes no existía: los ganaderos publican sin costo, los comerciantes acceden mediante un modelo de membresía que sostiene la operación, y ambos negocian con chat directo, solicitudes rastreables y reputación visible por reseñas.',
    status: 'ejecutado',
    featured: false,
  },
  {
    slug: 'portafolio-interlink',
    cliente: 'Interlink (agencia de marketing digital, Australia)',
    industria: 'Portafolio multi-cliente — agencia de marketing digital',
    resultadoCorto:
      'Seis sitios de producción entregados para seis clientes de industrias distintas, cada uno con identidad visual propia construida específicamente para su nicho, compartiendo un patrón técnico común que permitió moverse rápido sin sacrificar calidad ni originalidad por sitio.',
    status: 'ejecutado',
    featured: false,
  },
  {
    slug: 'tracing-b4',
    cliente: 'ACFEC — Organizaciones ganaderas campesinas de la Orinoquía',
    industria: 'Trazabilidad agroalimentaria bovina',
    resultadoCorto:
      'Propuesta presentada a la Convocatoria No. 47 de Minciencias/SGR, con un piloto especificado de 25 fincas y ~2.500 bovinos en cuatro departamentos. El proyecto no fue financiado ni ejecutado — quedó en fase de formulación técnica.',
    status: 'propuesta',
    featured: false,
  },
];
```

- [ ] **Step 2: Reemplazar `src/components/CaseStudyCard.astro`**

```astro
---
// src/components/CaseStudyCard.astro
interface Props {
  slug: string;
  cliente: string;
  industria: string;
  resultadoCorto: string;
  status: 'ejecutado' | 'propuesta';
}

const { slug, cliente, industria, resultadoCorto, status } = Astro.props;
---

<a href={`/casos-de-exito/${slug}`} class="case-card">
  {status === 'propuesta' && <span class="case-card-badge">Propuesta técnica</span>}
  <h3 class="case-card-title">{cliente}</h3>
  <p class="case-card-industry">{industria}</p>
  <p class="case-card-result">{resultadoCorto.slice(0, 140)}...</p>
  <span class="case-card-link">Ver caso completo →</span>
</a>

<style>
  .case-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.75rem;
    background: rgba(26, 20, 45, 0.6);
    border: 1px solid rgba(var(--neon-purple-rgb), 0.25);
    border-radius: var(--radius-card);
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
  }

  .case-card:hover {
    border-color: var(--neon-purple);
    box-shadow: 0 10px 30px rgba(var(--neon-purple-rgb), 0.15);
    transform: translateY(-4px);
  }

  .case-card-badge {
    align-self: flex-start;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--neon-yellow);
    border: 1px solid var(--neon-yellow);
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
  }

  .case-card-title {
    font-family: var(--font-body);
    font-size: 1.3rem;
    color: white;
  }

  .case-card-industry {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--neon-purple);
  }

  .case-card-result {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .case-card-link {
    margin-top: auto;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--neon-blue);
  }
</style>
```

- [ ] **Step 3: Verificar el build**

Run: `npm run build`
Expected: build FALLA — `src/pages/casos-de-exito/index.astro` y `src/components/home/CasosDeExitoTeaser.astro` todavía usan `<CaseStudyCard entry={entry} />`, que ya no es la firma correcta. Este error es esperado, se resuelve en Task 4. Confirmar que el único error es sobre esos dos archivos (props de `CaseStudyCard`), no otro problema.

- [ ] **Step 4: Commit**

```bash
git add src/data/casosDeExito.ts src/components/CaseStudyCard.astro
git commit -m "feat: add local case studies data source, refactor CaseStudyCard to plain props"
```

---

## Task 4: Migrar los 5 casos de texto + actualizar hub/teaser + eliminar la colección

**Files:**
- Modify: `src/layouts/CaseStudyLayout.astro`
- Create: `src/pages/casos-de-exito/tesla-gps.astro`
- Create: `src/pages/casos-de-exito/tracing-colombina.astro`
- Create: `src/pages/casos-de-exito/feriaapp.astro`
- Create: `src/pages/casos-de-exito/portafolio-interlink.astro`
- Create: `src/pages/casos-de-exito/tracing-b4.astro`
- Delete: `src/pages/casos-de-exito/[slug].astro`
- Modify: `src/pages/casos-de-exito/index.astro`
- Modify: `src/components/home/CasosDeExitoTeaser.astro`
- Modify: `src/content/config.ts`
- Delete: `src/content/casos-de-exito/tesla-gps.md`
- Delete: `src/content/casos-de-exito/frigorinoquia.md`
- Delete: `src/content/casos-de-exito/tracing-colombina.md`
- Delete: `src/content/casos-de-exito/feriaapp.md`
- Delete: `src/content/casos-de-exito/portafolio-interlink.md`
- Delete: `src/content/casos-de-exito/tracing-b4.md`

**Interfaces:**
- Consumes: `casosDeExito` de Task 3, `CaseStudyCard` con props planas de Task 3.
- Produces: `CaseStudyLayout.astro` ahora acepta `{ slug, cliente, industria, dolor, solucion, capacidades, stack, resultado, status }` como props sueltas. Consumido por las 5 páginas de este task (Frigorinoquia, en Task 5, NO usa este layout).

- [ ] **Step 1: Reemplazar `src/layouts/CaseStudyLayout.astro`**

```astro
---
// src/layouts/CaseStudyLayout.astro
import MainLayout from './MainLayout.astro';
import SectionHeader from '../components/ui/SectionHeader.astro';
import GridBackground from '../components/ui/GridBackground.astro';
import TechBadge from '../components/ui/TechBadge.astro';
import { breadcrumbSchema } from '../lib/seo/breadcrumb';

interface Props {
  slug: string;
  cliente: string;
  industria: string;
  dolor: string;
  solucion: string;
  capacidades: string[];
  stack: string[];
  resultado: string;
  status: 'ejecutado' | 'propuesta';
}

const { slug, cliente, industria, dolor, solucion, capacidades, stack, resultado, status } = Astro.props;

const pageTitle = `${cliente} — ${status === 'propuesta' ? 'Propuesta Técnica' : 'Caso de Éxito'} | Transformia`;
const description = `${cliente} (${industria})${status === 'propuesta' ? ' — propuesta técnica no ejecutada' : ''}: ${dolor.slice(0, 140)}...`;
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Casos de éxito', path: '/casos-de-exito' },
  { name: cliente, path: `/casos-de-exito/${slug}` },
];
---

<MainLayout
  title={pageTitle}
  description={description}
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <article class="case-study">
    <GridBackground opacity={0.3} />
    <div class="container">
      {status === 'propuesta' && (
        <div class="status-badge">Propuesta técnica — no ejecutada</div>
      )}
      <SectionHeader
        title={cliente}
        subtitle={industria}
        badge={status === 'ejecutado' ? 'CASO DE ÉXITO' : 'PROPUESTA TÉCNICA'}
      />

      <section class="block">
        <h2>El punto de partida</h2>
        <p>{dolor}</p>
      </section>

      <section class="block">
        <h2>La solución</h2>
        <p>{solucion}</p>
      </section>

      <section class="block">
        <h2>Capacidades</h2>
        <ul class="capacidades-list">
          {capacidades.map((c) => <li>{c}</li>)}
        </ul>
      </section>

      <section class="block">
        <h2>Stack</h2>
        <div class="stack-tags">
          {stack.map((tech) => <TechBadge label={tech} />)}
        </div>
      </section>

      <section class="block">
        <h2>{status === 'propuesta' ? 'Resultado esperado (no verificado)' : 'El resultado'}</h2>
        <p>{resultado}</p>
      </section>

      <a href="/casos-de-exito" class="back-link">← Ver todos los casos de éxito</a>
    </div>
  </article>
</MainLayout>

<style>
  .case-study {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 860px;
    margin: 0 auto;
  }

  .status-badge {
    display: inline-block;
    margin-bottom: 1.5rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    background: rgba(var(--neon-yellow-rgb), 0.12);
    border: 1px solid var(--neon-yellow);
    color: var(--neon-yellow);
  }

  .block {
    margin-bottom: 2.5rem;
  }

  .block h2 {
    font-family: var(--font-body);
    font-size: 1.5rem;
    color: var(--neon-purple);
    margin-bottom: 0.75rem;
  }

  .block p {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
  }

  .capacidades-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }

  .capacidades-list li {
    padding-left: 1.5rem;
    position: relative;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
  }

  .capacidades-list li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--neon-purple);
  }

  .stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .back-link {
    display: inline-block;
    margin-top: 2rem;
    color: var(--neon-purple);
    font-family: var(--font-mono);
    text-decoration: none;
  }

  .back-link:hover {
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 2: Crear `src/pages/casos-de-exito/tesla-gps.astro`**

```astro
---
// src/pages/casos-de-exito/tesla-gps.astro
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  slug="tesla-gps"
  cliente="Tesla GPS"
  industria="Instalación y monitoreo de GPS vehicular"
  dolor="Tesla GPS es una empresa de instalación y monitoreo de dispositivos GPS vehiculares en Cali. Su operación —clientes, vehículos, instalaciones, inventario de equipos, planes de monitoreo— se llevaba de forma dispersa, apoyada en hojas de cálculo y registros manuales: sin trazabilidad confiable del GPS y la SIM instalados en cada vehículo, inventario a ciegas sin descuento automático, renovaciones de planes que se perdían por falta de alertas, información fragmentada entre cliente/vehículo/plan/historial, y sin control de acceso por roles."
  solucion="Un sistema web centralizado, hecho a la medida del flujo real de Tesla GPS, que ordena toda la operación en una sola plataforma con acceso diferenciado por rol. Se apoya en trazabilidad de punta a punta (vehículo, GPS y SIM identificados por IMEI y número, con historial de reemplazos), control operativo real (inventario serializado que se descuenta solo al cerrar una orden, renovaciones con alertas automáticas) y orden por roles (Administrador, Administrador de Punto, Recepcionista, Técnico y Soporte, con seguridad garantizada a nivel de base de datos)."
  capacidades={[
    'Gestión de clientes y vehículos con múltiples teléfonos de contacto',
    'Órdenes de servicio con ciclo completo (pendiente → en proceso → cerrada) y cierre técnico con firma en pantalla',
    'Cumplimiento de habeas data (Ley 1581) con aceptación de términos versionados',
    'Inventario serializado de GPS y SIM con alta por lote y trazabilidad por unidad',
    'Planes y renovaciones con cálculo automático de vencimiento y alertas de fidelización',
    'Notificaciones al cliente por WhatsApp',
    'Dashboards por rol y módulo de soporte de solo lectura',
  ]}
  stack={['React', 'Supabase', 'PostgreSQL', 'Row Level Security']}
  resultado="Tesla GPS pasa de una operación dispersa en hojas de cálculo a una plataforma única donde cada cliente, vehículo, dispositivo y plan es trazable, cada rol tiene su espacio, y la información está disponible en tiempo real para tomar decisiones — sin perder de vista una renovación ni un equipo."
  status="ejecutado"
/>
```

- [ ] **Step 3: Crear `src/pages/casos-de-exito/tracing-colombina.astro`**

```astro
---
// src/pages/casos-de-exito/tracing-colombina.astro
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  slug="tracing-colombina"
  cliente="Colombina Conservas"
  industria="Manufactura de alimentos"
  dolor="Colombina Conservas programaba su producción mediante órdenes de trabajo semanales compartidas como archivos Excel sueltos por correo. No había trazabilidad sistemática de qué ingrediente, lote y peso exacto se usaba en cada bache, los pesos se anotaban a mano sin validar contra la fórmula esperada, y gerencia no tenía visibilidad en tiempo real de cuántos baches iban ni cuál era la eficiencia operativa del turno — esa información solo se conocía después, reconstruida a mano."
  solucion="Tracing 2.0: un flujo de 4 fases que convierte la orden de producción semanal en un ciclo de captura de datos en tiempo real. Planeación formaliza el punto de entrada, un proceso de scraping automatizado extrae y carga esa información a PostgreSQL, los formuladores operan en planta con una app de escritorio que registra cada pesaje/escaneo bache por bache, y un dashboard en tiempo real visualiza esa misma base de datos con filtro cruzado por fecha y elemento."
  capacidades={[
    'Ingesta y limpieza automática de la orden de producción en Excel hacia PostgreSQL',
    'Escaneo de ingredientes por código de barras y pesaje en báscula serial con validación de tolerancia contra la fórmula',
    'Conversión automática de unidades (G, L, ML, GL) a KG',
    'Impresión de etiqueta ZPL por ingrediente y bache',
    'Dashboard en tiempo real: bache actual, fórmulas creadas/faltantes, eficiencia operativa',
    'Informe final en PDF con el resumen de consumo por material',
  ]}
  stack={['Python', 'Tkinter', 'pandas', 'PostgreSQL', 'PySerial']}
  resultado="Colombina pasa de una orden de producción en Excel suelta por correo a un ciclo de trazabilidad continuo: se planea, se scrapea automáticamente hacia PostgreSQL, se ejecuta en planta con pesaje y escaneo validados contra la fórmula esperada, y todo se refleja en un dashboard en tiempo real que gerencia puede filtrar sin esperar al cierre del turno."
  status="ejecutado"
/>
```

- [ ] **Step 4: Crear `src/pages/casos-de-exito/feriaapp.astro`**

```astro
---
// src/pages/casos-de-exito/feriaapp.astro
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  slug="feriaapp"
  cliente="FeriaApp (patrocinado por Frigorinoquia)"
  industria="Marketplace de ganado — Orinoquía colombiana"
  dolor="La compraventa de ganado en la Orinoquía colombiana (Casanare, Meta, Arauca, Vichada) ocurre en un mercado fragmentado y mayormente informal: sin canal directo entre ganadero y comerciante, sin forma de validar confianza entre desconocidos, comunicación lenta por llamadas o mensajes sueltos sin seguimiento estructurado, y una gran parte de los usuarios potenciales operan con conectividad rural intermitente que la mayoría de apps no contempla."
  solucion="Una aplicación móvil (Expo + React Native) que funciona como marketplace de ganado, conectando dos roles: ganaderos, que publican animales de forma gratuita e ilimitada, y comerciantes, que acceden mediante membresía mensual. Sobre esa base, la plataforma resuelve solicitudes de compra estructuradas, chat en tiempo real, reseñas y calificación de perfiles, y búsqueda avanzada por ubicación geográfica — todo optimizado para conectividad limitada en zonas rurales."
  capacidades={[
    'Registro y publicación de animales, gratuita e ilimitada para ganaderos',
    'Acceso de comerciantes por membresía mensual con notificación de vencimiento',
    'Solicitudes de compra sobre publicaciones específicas y chat en tiempo real',
    'Sistema de reseñas y calificación de perfiles',
    'Búsqueda avanzada con filtros y ubicación geográfica por departamento/municipio',
    'Notificaciones push e in-app, diseño optimizado para conectividad limitada',
  ]}
  stack={['React Native (Expo)', 'TypeScript', 'Supabase', 'TanStack React Query', 'Zustand']}
  resultado="FeriaApp le da a la Orinoquía ganadera un canal formal de compraventa que antes no existía: los ganaderos publican sin costo, los comerciantes acceden mediante un modelo de membresía que sostiene la operación, y ambos negocian con chat directo, solicitudes rastreables y reputación visible por reseñas — pensado para funcionar incluso con la conectividad limitada típica de las fincas alejadas."
  status="ejecutado"
/>
```

- [ ] **Step 5: Crear `src/pages/casos-de-exito/portafolio-interlink.astro`**

```astro
---
// src/pages/casos-de-exito/portafolio-interlink.astro
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  slug="portafolio-interlink"
  cliente="Interlink (agencia de marketing digital, Australia)"
  industria="Portafolio multi-cliente — agencia de marketing digital"
  dolor="Durante una pasantía en Interlink, una agencia de marketing digital australiana, cada cliente de la agencia necesitaba un sitio de marketing propio, con calidad de producción, en industrias completamente distintas entre sí (entretenimiento nocturno, coaching de bienestar, servicios del hogar, entretenimiento infantil), sin presupuesto ni tiempo para reinventar la base técnica en cada proyecto."
  solucion="Un portafolio de seis sitios web independientes, todos sobre una base técnica común (Astro + TypeScript, arquitectura static-first) pero cada uno con su propia estrategia de contenido, patrón de integración de backend y enfoque de animación — desde efectos de scroll hechos a mano hasta plataformas de reservas con Supabase o pipelines de leads con Google Apps Script."
  capacidades={[
    'AlphaMen: sitio de reservas para entretenimiento nocturno con scroll cinematográfico y carrusel de performers hecho a mano',
    'Empress Nic: blog con content collections, captura de lead-magnet vía Google Apps Script, testimonios en vivo desde Google Sheets',
    'Harmony Home: marketing + dashboard de cliente/admin con Supabase, motor de reservas con reglas de negocio por tipo de propiedad',
    'Interlink Agency Landing: bento-grid de servicios, animación custom en canvas/SVG, sitemap y accesibilidad WCAG',
    'Super Hero Parties: motor de animación JS vanilla para sprites voladores, captura de leads con Google Sheets + WhatsApp deep-link',
  ]}
  stack={['Astro 4/5', 'TypeScript', 'Supabase', 'Google Apps Script', 'GSAP / Framer Motion']}
  resultado="Seis sitios de producción entregados para seis clientes de industrias distintas, cada uno con identidad visual propia construida específicamente para su nicho, compartiendo un patrón técnico común que permitió moverse rápido sin sacrificar calidad ni originalidad por sitio."
  status="ejecutado"
/>
```

- [ ] **Step 6: Crear `src/pages/casos-de-exito/tracing-b4.astro`**

```astro
---
// src/pages/casos-de-exito/tracing-b4.astro
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  slug="tracing-b4"
  cliente="ACFEC — Organizaciones ganaderas campesinas de la Orinoquía"
  industria="Trazabilidad agroalimentaria bovina"
  dolor="Las organizaciones de Agricultura Campesina, Familiar, Étnica y Comunitaria (ACFEC) bovinas de la Orinoquía colombiana (Boyacá, Casanare, Arauca y Meta) están excluidas de las cadenas agroalimentarias formales: más del 80% no tiene registro activo en SINIGAN, los intermediarios informales capturan hasta el 40% del valor final por falta de registros verificables, entre el 8% y el 15% de los bovinos son rechazados en planta por documentación sanitaria incompleta, y las soluciones de trazabilidad comerciales existentes no aplican a un contexto con conectividad rural del 18%-34%."
  solucion="TRACING B-4.0: una propuesta técnica de sistema de trazabilidad agroalimentaria co-diseñado con las comunidades ACFEC, con cuatro módulos — trazabilidad de campo con identificación RFID y app móvil offline-first, integración oficial con SINIGAN-ICA en planta de beneficio, comercialización con código QR trazable al consumidor final, y gobernanza de datos colectiva donde la información queda en propiedad de cada organización ACFEC, no de la plataforma."
  capacidades={[
    'Identificación individual por arete RFID con lectura desde app móvil offline-first',
    'Sincronización automática asíncrona en cuanto detecta señal',
    'Integración con el protocolo oficial API SINIGAN-ICA',
    'Certificado digital de inocuidad y origen vinculado al historial RFID',
    'Código QR trazable al consumidor final con panel de precios de mercado en tiempo real',
    'Dashboard de gobernanza de datos por organización, con control de acceso y auditoría',
  ]}
  stack={['RFID', 'App móvil offline-first (Android/iOS)', 'Integración SINIGAN-ICA', 'Cloud en COP (AWS/Azure Colombia)']}
  resultado="Propuesta presentada a la Convocatoria No. 47 de Minciencias/SGR, con un piloto especificado de 25 fincas y ~2.500 bovinos en cuatro departamentos. El proyecto no fue financiado ni ejecutado — quedó en fase de formulación técnica. Ninguna cifra de impacto fue verificada en campo."
  status="propuesta"
/>
```

- [ ] **Step 7: Borrar `src/pages/casos-de-exito/[slug].astro`**

Run: `rm "src/pages/casos-de-exito/[slug].astro"`

- [ ] **Step 8: Reemplazar `src/pages/casos-de-exito/index.astro`**

```astro
---
// src/pages/casos-de-exito/index.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import CaseStudyCard from '../../components/CaseStudyCard.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { casosDeExito } from '../../data/casosDeExito';

const ejecutados = casosDeExito.filter((c) => c.status === 'ejecutado');
const propuestas = casosDeExito.filter((c) => c.status === 'propuesta');

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Casos de éxito', path: '/casos-de-exito' },
];
---

<MainLayout
  title="Casos de Éxito | Transformia"
  description="Proyectos reales de Transformia: sistemas de trazabilidad, gestión operativa y marketplaces construidos a medida para clientes en Colombia y LatAm."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <section class="casos-section">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader
        title="CASOS DE ÉXITO"
        badge="PROYECTOS REALES"
        subtitle="Sistemas que ya están resolviendo problemas operativos concretos para nuestros clientes."
      />

      <div class="cards-grid">
        {ejecutados.map((c) => <CaseStudyCard {...c} />)}
      </div>

      {propuestas.length > 0 && (
        <div class="propuestas-block">
          <h2 class="propuestas-title">Propuestas técnicas</h2>
          <p class="propuestas-subtitle">
            Proyectos formulados por Transformia que aún no fueron financiados o ejecutados. Se documentan por transparencia, no como resultados entregados.
          </p>
          <div class="cards-grid">
            {propuestas.map((c) => <CaseStudyCard {...c} />)}
          </div>
        </div>
      )}
    </div>
  </section>
</MainLayout>

<style>
  .casos-section {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: var(--container-max);
    margin: 0 auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.75rem;
  }

  .propuestas-block {
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(var(--neon-purple-rgb), 0.2);
  }

  .propuestas-title {
    font-family: var(--font-body);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .propuestas-subtitle {
    color: rgba(255, 255, 255, 0.7);
    max-width: 640px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .casos-section {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 9: Reemplazar `src/components/home/CasosDeExitoTeaser.astro`**

```astro
---
// src/components/home/CasosDeExitoTeaser.astro
import SectionHeader from '../ui/SectionHeader.astro';
import GridBackground from '../ui/GridBackground.astro';
import CaseStudyCard from '../CaseStudyCard.astro';
import { casosDeExito } from '../../data/casosDeExito';

const featured = casosDeExito.filter((c) => c.featured).slice(0, 3);
---

<section class="casos-teaser">
  <GridBackground opacity={0.25} />
  <div class="container">
    <SectionHeader
      title="CASOS DE ÉXITO"
      badge="PROYECTOS REALES"
      subtitle="Sistemas que ya están resolviendo problemas operativos concretos para nuestros clientes."
    />
    <div class="cards-grid">
      {featured.map((c) => <CaseStudyCard {...c} />)}
    </div>
    <a href="/casos-de-exito" class="teaser-cta">Ver todos los casos de éxito →</a>
  </div>
</section>

<style>
  .casos-teaser {
    position: relative;
    width: 100%;
    background-color: var(--dark-purple);
    color: white;
    padding: 6rem 0;
    overflow: hidden;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: var(--container-max);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.75rem;
    width: 100%;
    margin-top: 1rem;
  }

  .teaser-cta {
    margin-top: 3rem;
    color: var(--neon-purple);
    font-family: var(--font-mono);
    text-decoration: none;
  }

  .teaser-cta:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .casos-teaser {
      padding: 4rem 0;
    }
  }
</style>
```

- [ ] **Step 10: Quitar la colección `casos-de-exito` de `src/content/config.ts`**

Reemplazar todo el archivo:

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 11: Borrar los 6 archivos de la colección**

Run: `rm -rf src/content/casos-de-exito`

- [ ] **Step 12: Verificar el build**

Run: `npm run build`
Expected: falla únicamente porque `src/pages/casos-de-exito/frigorinoquia.astro` todavía no existe (Task 5 lo crea) y el hub/teaser ya no lo pueden importar como ruta pendiente — en realidad el build no debería fallar por eso (astro no valida enlaces salientes), así que el resultado esperado real es: **build limpio**, con 5 nuevas páginas de casos (`tesla-gps`, `tracing-colombina`, `feriaapp`, `portafolio-interlink`, `tracing-b4`) generadas, y CERO referencias a `astro:content`/`getCollection` para `casos-de-exito` en ningún archivo. Confirmar con `grep -rn "casos-de-exito'" src/ --include="*.astro" | grep -i "getCollection\|CollectionEntry"` → sin resultados.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: migrate 5 case studies to bespoke pages, remove casos-de-exito collection"
```

---

## Task 5: Página completa de Frigorinoquia

**Files:**
- Create: `src/pages/casos-de-exito/frigorinoquia.astro`

**Interfaces:**
- Consumes: `AppScreenshotFrame` y `FrigorinoquiaPipeline` (Task 2), `animateCounters` (Task 1), `revealOnScroll` (existente en `src/scripts/animations/scrollReveal.ts`), imágenes reales de `src/assets/casos-de-exito/frigorinoquia/`.

- [ ] **Step 1: Crear `src/pages/casos-de-exito/frigorinoquia.astro`**

```astro
---
// src/pages/casos-de-exito/frigorinoquia.astro
import { Image } from 'astro:assets';
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import TechBadge from '../../components/ui/TechBadge.astro';
import AppScreenshotFrame from '../../components/casos-de-exito/AppScreenshotFrame.astro';
import FrigorinoquiaPipeline from '../../components/casos-de-exito/FrigorinoquiaPipeline.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';

import screenshotApertura from '../../assets/casos-de-exito/frigorinoquia/screenshot-apertura.png';
import screenshotPesaje from '../../assets/casos-de-exito/frigorinoquia/screenshot-pesaje.png';
import screenshotRecepcionDashboard from '../../assets/casos-de-exito/frigorinoquia/screenshot-recepcion-dashboard.png';
import screenshotDespachoDesposte from '../../assets/casos-de-exito/frigorinoquia/screenshot-despacho-desposte.png';
import screenshotReporteBeneficio from '../../assets/casos-de-exito/frigorinoquia/screenshot-reporte-beneficio-animales.png';
import fotoImpresora from '../../assets/casos-de-exito/frigorinoquia/foto-etiqueta-zpl-impresora-test.jpg';
import fotoProductoTerminado from '../../assets/casos-de-exito/frigorinoquia/foto-etiqueta-zpl-producto-terminado.jpg';
import screenshotGuiaDespacho from '../../assets/casos-de-exito/frigorinoquia/screenshot-guia-despacho.png';

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Casos de éxito', path: '/casos-de-exito' },
  { name: 'Frigorinoquia', path: '/casos-de-exito/frigorinoquia' },
];

const capacidades = [
  'app_apertura: apertura de lote, fichas técnicas de cortes, consolidados diarios',
  'app_presa y app_granel: pesaje en báscula serial en tiempo real con impresión automática de etiqueta ZPL',
  'app_despacho: guías, certificados de rendimiento y calidad, despacho de canales enteras y de cortes empacados',
  'app_reportes: dashboard de KPIs y exportación a PDF/Excel',
  'app_cobranza: liquidación automática de maquila y cuentas por cobrar',
  'Trazabilidad completa por lote: beneficio → desposte → pesaje → despacho → cliente',
];

const stack = ['Python', 'FastAPI', 'Supabase (PostgreSQL)', 'PySerial', 'ZPL/Zebra'];
---

<MainLayout
  title="Frigorinoquia — Caso de Éxito | Transformia"
  description="Suite de 6 aplicaciones construida por Transformia para Frigorinoquia: trazabilidad completa de beneficio y desposte, desde el animal hasta el despacho, con captura de datos en tiempo real."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <article class="case-frigorinoquia">
    <GridBackground opacity={0.3} perspective />

    <section class="case-hero">
      <div class="container container--hero">
        <SectionHeader
          title="FRIGORINOQUIA"
          badge="CASO DE ÉXITO"
          subtitle="Planta de beneficio animal y desposte — Tauramena, Casanare"
        />
        <p class="hero-lead">
          Seis aplicaciones conectadas que llevan la trazabilidad de Frigorinoquia del papel y el Excel a un sistema en tiempo real: desde que el animal ingresa a la planta hasta que el corte empacado sale hacia el cliente, cada dato queda registrado en el momento en que ocurre — sin doble digitación, sin reconstrucción manual al final del turno.
        </p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="hero-stat-value">6</span>
            <span class="hero-stat-label">Aplicaciones conectadas</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-value">1</span>
            <span class="hero-stat-label">Base de datos, trazabilidad única</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat-value">0</span>
            <span class="hero-stat-label">Doble digitación</span>
          </div>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="block">
        <h2>El punto de partida</h2>
        <p>
          Frigorinoquia es una planta de beneficio animal (sacrificio) y sala de desposte mixto. Todo el proceso —desde el ingreso del animal hasta la salida del producto— se documentaba en papel y Excel: apertura de lote manual, pesaje sin sistema, sin visibilidad de inventario en cámara fría, despacho propenso a error en guías escritas a mano, reportes gerenciales tardíos, cobranza de maquila calculada manualmente y trazabilidad animal incompleta entre el ingreso, el examen ante/post mortem y el destino final de cada corte.
        </p>
      </section>

      <section class="block">
        <h2>La solución</h2>
        <p>
          Una suite de seis aplicaciones web independientes, cada una responsable de una estación física de la planta, conectadas a la misma base de datos con trazabilidad de extremo a extremo: desde el animal vivo hasta el corte empacado despachado al cliente. El peso se captura directamente de báscula serial en tiempo real, las etiquetas se generan automáticamente en ZPL, el inventario de cámara fría se actualiza solo con cada pesaje vía funciones transaccionales, y la liquidación de maquila se genera a partir de esos mismos datos operativos.
        </p>
        <FrigorinoquiaPipeline />
      </section>

      <section class="block">
        <h2>El sistema en operación</h2>
        <p class="block-intro">Seis pantallas, una sola fuente de verdad. Así se ve la trazabilidad en cada estación de la planta.</p>
        <div class="screenshot-grid">
          <AppScreenshotFrame src={screenshotApertura} alt="Pantalla de apertura de lote de desposte en Frigorinoquia" label="Apertura de Lote" />
          <AppScreenshotFrame src={screenshotPesaje} alt="Pantalla de pesaje de presas en tiempo real conectada a báscula" label="Pesaje en Tiempo Real" />
          <AppScreenshotFrame src={screenshotRecepcionDashboard} alt="Dashboard de recepción de animales en planta" label="Dashboard de Recepción" />
          <AppScreenshotFrame src={screenshotDespachoDesposte} alt="Pantalla de despacho de cortes de desposte" label="Despacho de Desposte" />
          <AppScreenshotFrame src={screenshotReporteBeneficio} alt="Reporte de beneficio de animales con KPIs de rendimiento" label="Reportería de Beneficio" />
        </div>
      </section>

      <section class="block">
        <h2>De la pantalla a la planta</h2>
        <p class="block-intro">
          Cada pesaje se traduce en una etiqueta física impresa al instante, y cada despacho sale con su guía generada automáticamente por el sistema — no hay paso manual entre lo que se registra y lo que se imprime.
        </p>
        <div class="evidence-grid">
          <figure class="evidence-card evidence-card--wide">
            <Image src={fotoImpresora} alt="Impresora Zebra imprimiendo etiquetas ZPL con datos de Frigorinoquia en tiempo real" widths={[500, 900]} sizes="(max-width: 768px) 100vw, 500px" loading="lazy" />
            <figcaption>Impresión de etiquetas en tiempo real, directo desde el pesaje</figcaption>
          </figure>
          <figure class="evidence-card">
            <Image src={fotoProductoTerminado} alt="Etiqueta ZPL impresa sobre producto cárnico empacado" widths={[400, 700]} sizes="(max-width: 768px) 100vw, 400px" loading="lazy" />
            <figcaption>Etiqueta sobre producto empacado, lista para despacho</figcaption>
          </figure>
          <figure class="evidence-card evidence-card--document">
            <Image src={screenshotGuiaDespacho} alt="Guía de despacho generada automáticamente por el sistema, con datos del cliente protegidos" widths={[350, 600]} sizes="(max-width: 768px) 100vw, 350px" loading="lazy" />
            <figcaption>Guía de despacho generada automáticamente por el sistema</figcaption>
          </figure>
        </div>
      </section>

      <section class="block">
        <h2>Capacidades</h2>
        <ul class="capacidades-list">
          {capacidades.map((c) => <li>{c}</li>)}
        </ul>
      </section>

      <section class="block">
        <h2>Stack</h2>
        <div class="stack-tags">
          {stack.map((tech) => <TechBadge label={tech} />)}
        </div>
      </section>

      <section class="block block--resultado">
        <h2>El resultado</h2>
        <p>
          Frigorinoquia pasa de un proceso documentado en papel y Excel a una suite conectada donde cada animal, lote, corte y despacho queda trazado de punta a punta, con el peso capturado directamente de báscula, las etiquetas impresas automáticamente, el inventario descontado en tiempo real, y la cobranza generada a partir de los mismos datos operativos, sin doble digitación.
        </p>
        <div class="result-counter">
          <span class="counter" data-target="56.57" data-suffix="%">0%</span>
          <span class="result-counter-label">Rendimiento promedio de beneficio, medido en tiempo real por el sistema</span>
        </div>
      </section>

      <div class="case-actions">
        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
        <a href="/casos-de-exito" class="back-link">← Ver todos los casos de éxito</a>
      </div>
    </div>
  </article>
</MainLayout>

<style>
  .case-frigorinoquia {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 1000px;
    margin: 0 auto;
  }

  .container--hero {
    max-width: 900px;
    text-align: center;
  }

  .hero-lead {
    max-width: 720px;
    margin: 1.5rem auto 2.5rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
    font-size: 1.1rem;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-stat-value {
    font-family: var(--font-mono);
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--neon-purple);
    text-shadow: 0 0 20px rgba(var(--neon-purple-rgb), 0.5);
  }

  .hero-stat-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 160px;
    text-align: center;
  }

  .block {
    margin-bottom: 4rem;
  }

  .block h2 {
    font-family: var(--font-body);
    font-size: 1.75rem;
    color: var(--neon-purple);
    margin-bottom: 1rem;
  }

  .block > p {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
  }

  .block-intro {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2rem;
  }

  .screenshot-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }

  .evidence-card {
    margin: 0;
    border-radius: var(--radius-card);
    overflow: hidden;
    border: 1px solid rgba(var(--neon-purple-rgb), 0.25);
    background: rgba(10, 10, 20, 0.6);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    transform: rotate(-1deg);
    transition: transform 0.3s ease;
  }

  .evidence-card:nth-child(even) {
    transform: rotate(1deg);
  }

  .evidence-card:hover {
    transform: rotate(0deg) translateY(-4px);
  }

  .evidence-card :global(img) {
    display: block;
    width: 100%;
    height: 260px;
    object-fit: cover;
  }

  .evidence-card--document :global(img) {
    height: 320px;
    object-fit: contain;
    background: white;
    padding: 0.5rem;
  }

  .evidence-card figcaption {
    padding: 0.85rem 1rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    border-top: 1px solid rgba(var(--neon-purple-rgb), 0.2);
  }

  .capacidades-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 0.6rem;
  }

  .capacidades-list li {
    padding-left: 1.5rem;
    position: relative;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
  }

  .capacidades-list li::before {
    content: '▹';
    position: absolute;
    left: 0;
    color: var(--neon-purple);
  }

  .stack-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .block--resultado {
    padding: 2.5rem;
    background: rgba(26, 20, 45, 0.5);
    border: 1px solid rgba(var(--neon-purple-rgb), 0.2);
    border-radius: var(--radius-card);
  }

  .result-counter {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .counter {
    font-family: var(--font-mono);
    font-size: 3rem;
    font-weight: 700;
    color: var(--neon-purple);
    text-shadow: 0 0 20px rgba(var(--neon-purple-rgb), 0.5);
  }

  .result-counter-label {
    color: rgba(255, 255, 255, 0.7);
    max-width: 320px;
    font-size: 0.95rem;
  }

  .case-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .cta-link {
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  .back-link {
    color: var(--neon-purple);
    font-family: var(--font-mono);
    text-decoration: none;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  @media (max-width: 900px) {
    .evidence-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .case-frigorinoquia {
      padding: 8rem 0 4rem;
    }

    .hero-stats {
      gap: 2rem;
    }
  }
</style>

<script>
  import { revealOnScroll } from '../../scripts/animations/scrollReveal';
  import { animateCounters } from '../../scripts/animations/counter';

  document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll('.screenshot-grid > *', { stagger: 0.12 });
    revealOnScroll('.evidence-card', { stagger: 0.15 });
    animateCounters('.counter[data-target]');
  });
</script>
```

- [ ] **Step 2: Verificar el build**

Run: `npm run build`
Expected: build limpio. Confirmar en el output que `/casos-de-exito/frigorinoquia/index.html` se genera, y que existen archivos de imagen optimizados en `dist/_astro/` correspondientes a las 8 imágenes importadas (nombres con hash, extensión `.webp`).

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev`
Navegar a `/casos-de-exito/frigorinoquia`. Confirmar en desktop: hero con las 3 cifras, el diagrama de 6 nodos se dibuja al hacer scroll hasta esa sección, las 5 capturas se revelan con stagger dentro de sus marcos "browser chrome", las 3 tarjetas de evidencia física se ven con la leve rotación e inclinación (la foto de producto empacado recortada, no a página completa), el contador de "56.57%" anima de 0 al valor final al entrar en viewport. Repetir en 375px: el diagrama pasa a layout vertical, la galería y evidencia colapsan a 1 columna, sin overflow horizontal.

- [ ] **Step 4: Commit**

```bash
git add src/pages/casos-de-exito/frigorinoquia.astro
git commit -m "feat: build full Frigorinoquia case study page with real assets and GSAP"
```

---

## Task 6: QA de casos de éxito

**Files:**
- No se crean ni modifican archivos de producto (solo verificación; si aparecen bugs, se corrigen en el archivo correspondiente y se documenta cuál).

**Interfaces:**
- Consumes: todo lo construido en Tasks 1-5.

- [ ] **Step 1: Build de producción**

Run: `npm run build`
Expected: build termina sin errores. Confirmar que las 6 rutas de casos de éxito (`tesla-gps`, `frigorinoquia`, `tracing-colombina`, `feriaapp`, `portafolio-interlink`, `tracing-b4`) más el hub `/casos-de-exito` generan HTML.

- [ ] **Step 2: Confirmar que no queda nada de la colección**

Run: `test -d src/content/casos-de-exito && echo "TODAVÍA EXISTE" || echo "OK, eliminado"`
Run: `grep -rn "casos-de-exito" src/content/config.ts`
Expected: el directorio no existe; el grep en `config.ts` no devuelve nada (solo `blog` queda en ese archivo).

- [ ] **Step 3: Confirmar optimización de imágenes**

Run: `ls dist/_astro/ | grep -i webp | wc -l`
Expected: mayor a 0 — confirma que `astro:assets` generó variantes WebP de las imágenes de Frigorinoquia.

- [ ] **Step 4: Recorrido visual completo**

Run: `npm run dev`
Recorrer en desktop y 375px: `/casos-de-exito` (5 casos ejecutados + 1 propuesta con badge), cada uno de los 5 casos "de texto" (mismo diseño que antes, ahora en ruta propia), `/casos-de-exito/frigorinoquia` completa (diagrama, galería, evidencia física, contador), y la sección de casos de éxito en la home (`/`) — confirmar que sigue mostrando 3 tarjetas destacadas y que el link de cada una navega a la página bespoke correspondiente.

- [ ] **Step 5: Revisar consola del navegador**

Con devtools abierto, recorrer las 7 rutas de casos de éxito más la home. Confirmar 0 errores de consola.

- [ ] **Step 6: Commit final (solo si el Step 4-5 requirió fixes)**

```bash
git add -A
git commit -m "fix: address issues found in case studies QA pass"
```

Si no hubo fixes, esta tarea termina en el Step 5 sin commit adicional.

---

## Self-Review (completado por quien escribió el plan)

- **Cobertura del spec**: fuente de datos de casos → Task 3; migración de los 5 casos de texto + eliminación de la colección → Task 4; página completa de Frigorinoquia con galería, evidencia física, diagrama animado y contador → Tasks 1, 2, 5; verificación de optimización de imágenes y ausencia total de la colección → Task 6. El spec de 2026-08-05 está cubierto completo. `blog` no se toca en ninguna tarea, consistente con el alcance.
- **Placeholders**: sin TBD/TODO; cada step de código tiene contenido final (copy real, valores exactos, nombres de archivo reales de `src/assets/casos-de-exito/frigorinoquia/`).
- **Consistencia de tipos/nombres**: `animateCounters(selector: string)` se usa con la misma firma en Task 1 (definición) y Task 5 (consumo). `<AppScreenshotFrame src alt label?>` y `<FrigorinoquiaPipeline />` se consumen en Task 5 exactamente como se definen en Task 2. `CasoDeExito` y `casosDeExito` se consumen en Task 4 (hub, teaser) exactamente como se definen en Task 3. `CaseStudyLayout` Props (`slug, cliente, industria, dolor, solucion, capacidades, stack, resultado, status`) se usan de forma idéntica en las 5 páginas de Task 4.
