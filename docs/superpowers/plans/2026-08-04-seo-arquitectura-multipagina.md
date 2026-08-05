# SEO técnico y arquitectura multipágina Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir transformia-web de una landing de una sola página a un sitio multipágina completo (servicios, casos de éxito, nosotros, blog) con una capa técnica de SEO real (sitemap, robots, meta tags por página, JSON-LD), usando el contenido real ya documentado en `docs/transformia-projects-context.md` y el sistema de diseño compartido ya existente.

**Architecture:** Astro 5 + React 19 + Tailwind 4 (sin cambios de stack). Se agrega `@astrojs/sitemap`, un componente `SEO.astro` reutilizable con helpers de JSON-LD en `src/lib/seo/`, y dos Content Collections (`casos-de-exito`, `blog`) con el loader API de Astro 5 (`glob()`). Las 7 líneas de servicio se implementan como páginas Astro estáticas (no colección) porque cada una necesita un layout visual propio; los casos de éxito y el blog sí son colecciones porque son datos con la misma forma que crecen con el tiempo.

**Tech Stack:** Astro 5.4, React 19, Tailwind 4, Astro Content Collections (loader API), `@astrojs/sitemap`, `sharp` (solo para el script de generación de la imagen OG, no en runtime).

## Global Constraints

- Stack sin cambios: Astro 5 + React 19 + Tailwind 4. Nuevas dependencias permitidas: `@astrojs/sitemap` (runtime), `sharp` (devDependency, solo usado por `scripts/generate-og-image.mjs`).
- Paleta de color obligatoria, ya definida en `src/styles/tokens.css` — no redeclarar `:root { --neon-purple: ... }` en ningún componente nuevo: `--neon-purple: #b042ff`, `--neon-blue: #4287ff`, `--neon-pink: #ff42b0`, `--neon-green: #42ff66`, `--neon-yellow: #e8ff42`, `--dark-bg: #0a0a14`, `--darker-bg: #070710`, `--dark-purple: #1a142d`.
- Dominio de producción: `https://transformia.dev` (usado literal en `astro.config.mjs`, `robots.txt` y los helpers de `src/lib/seo/`).
- No introducir framework de testing. Verificación = `npm run build` (compila sin errores) + revisión manual en `npm run dev` en desktop y viewport 375px, tal como quedó confirmado en el plan de rediseño visual anterior.
- No fabricar cifras de negocio, fechas o resultados no verificados. El caso `tracing-b4` es una **propuesta técnica no ejecutada** — nunca se presenta con lenguaje de resultado entregado; su `status` en el frontmatter es `'propuesta'` y su layout debe mostrar un badge distinto al de los casos `'ejecutado'`.
- Todo el contenido de casos de éxito sale de `docs/transformia-projects-context.md` (ya escrito y verificado) — no se inventa contenido de proyectos.
- Mercado objetivo: LatAm hispanohablante. No se agregan rutas `/en/`, no se usa schema `LocalBusiness`, no se inventan URLs de redes sociales (`sameAs`) — el footer ya tiene los social links como `href="#"` marcados `social-link--pending`, eso no cambia en este plan.
- Datos de contacto reales a reutilizar en JSON-LD y contenido nuevo: teléfono `+57 321 259 6437`, correo `transformia.desarrollo@gmail.com`, ubicación `Tauramena, Casanare, Colombia`.
- Los slugs de servicio ya están hardcodeados en `src/components/SolucionesComponents/CarouselSlides/*.astro` (links hoy rotos): `desarrollo`, `transformacion`, `ia`, `asesoria`, `iot`, `arquitectura`, `database`. Se usan tal cual, sin renombrar.

---

## Task 1: Infraestructura de SEO técnico

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Create: `src/lib/seo/organization.ts`
- Create: `src/lib/seo/breadcrumb.ts`
- Create: `src/lib/seo/service.ts`
- Create: `src/lib/seo/article.ts`
- Create: `src/components/SEO.astro`
- Modify: `src/layouts/MainLayout.astro`
- Create: `public/robots.txt`

**Interfaces:**
- Produces: `organizationSchema(): object`, `breadcrumbSchema(items: {name: string; path: string}[], site: URL): object`, `serviceSchema({name, description, url}): object`, `articleSchema({title, description, pubDate, updatedDate?, url, image}): object` — todos devuelven objetos JSON-LD planos.
- Produces: `<SEO title description type? image? noindex? jsonLd? />` — componente Astro.
- Produces: `MainLayout` ahora acepta `Props { title: string; description: string; image?: string; type?: 'website' | 'article'; noindex?: boolean; jsonLd?: Record<string, unknown>[] }` (antes solo aceptaba `title`). Todas las páginas que la usan deben actualizarse para pasar `description` (se hace en las tareas siguientes, a medida que se toca cada página).

- [ ] **Step 1: Instalar @astrojs/sitemap**

Run: `npm install @astrojs/sitemap`

- [ ] **Step 2: Configurar `astro.config.mjs`**

Reemplazar todo el archivo:

```js
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://transformia.dev',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/cotizacion'),
    }),
  ]
});
```

- [ ] **Step 3: Crear `src/lib/seo/organization.ts`**

```ts
// src/lib/seo/organization.ts
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Transformia',
    url: 'https://transformia.dev',
    description:
      'Transformia diseña y desarrolla software a medida para empresas en LatAm, con especialización en inteligencia artificial aplicada y un equipo boutique enfocado en velocidad de entrega.',
    email: 'transformia.desarrollo@gmail.com',
    telephone: '+57-321-259-6437',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tauramena',
      addressRegion: 'Casanare',
      addressCountry: 'CO',
    },
  };
}
```

- [ ] **Step 4: Crear `src/lib/seo/breadcrumb.ts`**

```ts
// src/lib/seo/breadcrumb.ts
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site).toString(),
    })),
  };
}
```

- [ ] **Step 5: Crear `src/lib/seo/service.ts`**

```ts
// src/lib/seo/service.ts
export interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string;
}

export function serviceSchema({ name, description, url }: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'Transformia',
      url: 'https://transformia.dev',
    },
    areaServed: 'LatAm',
  };
}
```

- [ ] **Step 6: Crear `src/lib/seo/article.ts`**

```ts
// src/lib/seo/article.ts
export interface ArticleSchemaInput {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  url: string;
  image: string;
}

export function articleSchema({ title, description, pubDate, updatedDate, url, image }: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    url,
    image,
    author: {
      '@type': 'Organization',
      name: 'Transformia',
    },
  };
}
```

- [ ] **Step 7: Crear `src/components/SEO.astro`**

```astro
---
// src/components/SEO.astro
export interface Props {
  title: string;
  description: string;
  type?: 'website' | 'article';
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const {
  title,
  description,
  type = 'website',
  image = '/og-default.jpg',
  noindex = false,
  jsonLd = [],
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImageURL = new URL(image, Astro.site);
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<meta property="og:type" content={type} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:site_name" content="Transformia" />
<meta property="og:locale" content="es_CO" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />

{jsonLd.map((schema) => (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
))}
```

- [ ] **Step 8: Modificar `src/layouts/MainLayout.astro`**

Reemplazar todo el archivo (mantiene Navbar/Footer/estilos/scripts existentes, cambia solo el bloque de `<head>` relacionado a SEO y el frontmatter de props):

```astro
---
// MainLayout.astro - Componente de layout principal que contiene elementos comunes

import '../styles/tokens.css';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import SEO from '../components/SEO.astro';
import { organizationSchema } from '../lib/seo/organization';

export interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const {
  title,
  description,
  image,
  type,
  noindex = false,
  jsonLd = [],
} = Astro.props;
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

  <!-- Global styles -->
  <link rel="stylesheet" href="/styles/global.css">

  <!-- SEO -->
  <SEO
    title={title}
    description={description}
    image={image}
    type={type}
    noindex={noindex}
    jsonLd={[organizationSchema(), ...jsonLd]}
  />

  <!-- Estilos básicos para asegurar que no haya márgenes extra -->
  <style>
    /* Reset básico para eliminar márgenes y padding por defecto */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Space Grotesk', sans-serif;
      background-color: #0a0a14;
      color: white;
      overflow-x: hidden;
      width: 100%;
    }

    main {
      width: 100%;
      display: block;
    }

    /* Variables CSS globales (paleta y tipografía compartidas vienen de tokens.css) */

    /* Estilo de scrollbar personalizada - estética cibernética */
    /* Webkit browsers (Chrome, Safari, Opera) */
    ::-webkit-scrollbar {
      width: 10px;
      background-color: var(--darker-bg);
    }

    ::-webkit-scrollbar-track {
      background-color: rgba(10, 10, 20, 0.8);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, var(--neon-purple), var(--neon-blue));
      border-radius: 10px;
      border: 2px solid rgba(10, 10, 20, 0.8);
      box-shadow: 0 0 10px rgba(176, 66, 255, 0.5);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, var(--neon-pink), var(--neon-purple));
    }

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--neon-purple) var(--darker-bg);
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <Navbar />

  <!-- Main content -->
  <main>
    <slot />
  </main>

  <!-- Footer -->
  <Footer />

  <!-- JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Smooth scroll para enlaces internos
      document.querySelectorAll('a[href^="#"]').forEach((anchor: Element) => {
        anchor.addEventListener('click', (e: Event) => {
          e.preventDefault();

          const element = e.currentTarget as HTMLAnchorElement;
          const targetId = element.getAttribute('href');

          if (!targetId || targetId === '#') return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const headerOffset = 80; // Ajustar por la altura del navbar
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Cerrar menú móvil si está abierto
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
              mobileMenu.classList.remove('active');
              document.body.style.overflow = '';
            }
          }
        });
      });

      // Animación para elementos al hacer scroll
      const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');

        elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;

          if (elementPosition < windowHeight * 0.85) {
            element.classList.add('animated');
          }
        });
      };

      // Inicializar animaciones al cargar
      setTimeout(animateOnScroll, 100);

      // Event listener para animaciones al hacer scroll
      window.addEventListener('scroll', animateOnScroll);

      // Detectar dispositivos táctiles y desactivar algunos efectos
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (isTouchDevice) {
        document.body.classList.add('touch-device');
      }

      // Asegurarse de que las animaciones también funcionen después de la navegación
      // Verificar animaciones después de cada click en enlaces del navbar
      const navLinks = document.querySelectorAll('.navbar-link, .menu-link, .mobile-menu-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          // Dar tiempo para que el scroll termine
          setTimeout(animateOnScroll, 800);
        });
      });
    });
  </script>
</body>
</html>
```

- [ ] **Step 9: Crear `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /cotizacion

Sitemap: https://transformia.dev/sitemap-index.xml
```

- [ ] **Step 10: Verificar el build**

Run: `npm run build`
Expected: falla porque `index.astro`, `privacidad.astro` y `terminos.astro` todavía llaman `<Layout title="...">` / `<MainLayout title="...">` sin `description`, que ahora es una prop requerida por el tipo `Props`. Este error es esperado en este punto — se resuelve página por página en las tareas siguientes. Confirmar que el error señalado es exactamente falta de `description` en esas tres páginas (no otro error de sintaxis).

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/lib/seo src/components/SEO.astro src/layouts/MainLayout.astro public/robots.txt
git commit -m "feat: add SEO infrastructure (sitemap, SEO component, JSON-LD helpers)"
```

---

## Task 2: Aplicar SEO a las páginas existentes simples

**Files:**
- Modify: `src/pages/contacto.astro`
- Modify: `src/pages/cotizacion.astro`

**Interfaces:**
- Consumes: `MainLayout` Props de Task 1.

- [ ] **Step 1: Actualizar `src/pages/contacto.astro`**

Reemplazar todo el archivo:

```astro
---
// src/pages/contacto.astro
import MainLayout from '../layouts/MainLayout.astro';
import ContactoForm from '../components/ContactoForm.astro';
---

<MainLayout
  title="Contacto | Transformia"
  description="Escribinos para contar tu proyecto de software. Transformia responde por WhatsApp, teléfono o correo — sin formularios eternos ni intermediarios."
>
  <ContactoForm />
</MainLayout>
```

- [ ] **Step 2: Actualizar la etiqueta `MainLayout` en `src/pages/cotizacion.astro`**

Buscar la línea (cerca del inicio del archivo, después del frontmatter):

```astro
<MainLayout title="Cotización Personalizada | Transformia">
```

Reemplazar por:

```astro
<MainLayout
  title="Cotización Personalizada | Transformia"
  description="Cotización personalizada de Transformia para un cliente específico."
  noindex={true}
>
```

No se modifica nada más del archivo (el resto de la lógica de cotización queda fuera de alcance).

- [ ] **Step 3: Verificar en el navegador**

Run: `npm run dev`
Navegar a `http://localhost:4321/contacto` y confirmar (ver código fuente / DevTools) que `<meta name="description">` muestra el texto nuevo. Navegar a `http://localhost:4321/cotizacion` y confirmar que el HTML incluye `<meta name="robots" content="noindex, nofollow">`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/contacto.astro src/pages/cotizacion.astro
git commit -m "feat: add per-page SEO description and noindex to contacto/cotizacion"
```

---

## Task 3: Imagen OG por defecto

**Files:**
- Create: `scripts/generate-og-image.mjs`
- Create: `public/og-default.jpg` (generado por el script, se commitea el binario resultante)
- Modify: `package.json` (agregar `sharp` como devDependency y un script `generate:og`)

**Interfaces:**
- Produces: `public/og-default.jpg`, 1200×630, referenciado por defecto en `SEO.astro` (Task 1).

- [ ] **Step 1: Instalar sharp como devDependency**

Run: `npm install -D sharp`

- [ ] **Step 2: Agregar el script `generate:og` a `package.json`**

En la sección `"scripts"` de `package.json`, agregar:

```json
"generate:og": "node scripts/generate-og-image.mjs"
```

(El objeto `scripts` queda con `dev`, `build`, `preview`, `astro` ya existentes más esta línea nueva.)

- [ ] **Step 3: Crear `scripts/generate-og-image.mjs`**

```js
// scripts/generate-og-image.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

const gridLines = [
  ...Array.from({ length: 20 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${HEIGHT}" />`),
  ...Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${WIDTH}" y2="${i * 60}" />`),
].join('');

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a14" />
      <stop offset="100%" stop-color="#1a142d" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b042ff" />
      <stop offset="100%" stop-color="#4287ff" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g opacity="0.15" stroke="#b042ff" stroke-width="1">${gridLines}</g>
  <rect x="80" y="${HEIGHT / 2 - 4}" width="220" height="8" fill="url(#accent)" />
  <text x="80" y="${HEIGHT / 2 - 40}" font-family="Space Mono, monospace" font-size="72" font-weight="700" fill="#ffffff" letter-spacing="2">TRANSFORMIA</text>
  <text x="80" y="${HEIGHT / 2 + 60}" font-family="Space Grotesk, sans-serif" font-size="30" fill="rgba(255,255,255,0.75)">Software a medida · Inteligencia Artificial aplicada</text>
</svg>
`;

const outputPath = path.join(__dirname, '..', 'public', 'og-default.jpg');

await sharp(Buffer.from(svg))
  .jpeg({ quality: 90 })
  .toFile(outputPath);

console.log(`OG image generado en ${outputPath}`);
```

- [ ] **Step 4: Ejecutar el script**

Run: `npm run generate:og`
Expected: imprime `OG image generado en .../public/og-default.jpg` sin error.

- [ ] **Step 5: Verificar la imagen generada**

Run: `file public/og-default.jpg`
Expected: reporta un JPEG de 1200x630. Abrir el archivo y confirmar visualmente que se ve el fondo oscuro con grid, la barra de acento morado/azul y el texto "TRANSFORMIA" legible (si la fuente Space Mono no está instalada en el sistema que corrió el script, el texto puede caer a una fuente monospace genérica — es aceptable para esta iteración, pero debe seguir siendo legible y no verse roto/superpuesto).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/generate-og-image.mjs public/og-default.jpg
git commit -m "feat: generate default OG image"
```

---

## Task 4: Configuración de Content Collections

**Files:**
- Create: `src/content/config.ts`

**Interfaces:**
- Produces: colecciones `'casos-de-exito'` y `'blog'`, consumidas por Tasks 5 y 6 vía `getCollection()` / `getEntry()` / `render()` de `astro:content`.
- Produces: tipo `CollectionEntry<'casos-de-exito'>` con `data: { cliente, industria, dolor, solucion, capacidades: string[], stack: string[], resultado, status: 'ejecutado' | 'propuesta', featured: boolean }`.
- Produces: tipo `CollectionEntry<'blog'>` con `data: { title, description, pubDate: Date, updatedDate?: Date, tags: string[], draft: boolean }`.

- [ ] **Step 1: Crear `src/content/config.ts`**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const casosDeExito = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casos-de-exito' }),
  schema: z.object({
    cliente: z.string(),
    industria: z.string(),
    dolor: z.string(),
    solucion: z.string(),
    capacidades: z.array(z.string()),
    stack: z.array(z.string()),
    resultado: z.string(),
    status: z.enum(['ejecutado', 'propuesta']),
    featured: z.boolean().default(false),
  }),
});

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

export const collections = { 'casos-de-exito': casosDeExito, blog };
```

- [ ] **Step 2: Verificar el build**

Run: `npm run build`
Expected: sigue fallando por la misma razón que en Task 1 (index/privacidad/terminos sin `description`) — no debe aparecer ningún error nuevo relacionado a `astro:content` o a las colecciones vacías. Si aparece un error sobre `src/content/casos-de-exito` o `src/content/blog` no encontrados, crear ambos directorios vacíos primero con `mkdir -p src/content/casos-de-exito src/content/blog` y repetir el build.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define casos-de-exito and blog content collections"
```

---

## Task 5: Casos de éxito — contenido, layout y páginas

**Files:**
- Modify: `src/styles/tokens.css` (agregar `--neon-yellow-rgb`)
- Create: `src/content/casos-de-exito/tesla-gps.md`
- Create: `src/content/casos-de-exito/frigorinoquia.md`
- Create: `src/content/casos-de-exito/tracing-colombina.md`
- Create: `src/content/casos-de-exito/feriaapp.md`
- Create: `src/content/casos-de-exito/portafolio-interlink.md`
- Create: `src/content/casos-de-exito/tracing-b4.md`
- Create: `src/components/CaseStudyCard.astro`
- Create: `src/layouts/CaseStudyLayout.astro`
- Create: `src/pages/casos-de-exito/index.astro`
- Create: `src/pages/casos-de-exito/[slug].astro`

**Interfaces:**
- Consumes: `MainLayout` (Task 1), `breadcrumbSchema` (Task 1), colección `'casos-de-exito'` (Task 4), `GridBackground`/`SectionHeader`/`TechBadge` (existentes en `src/components/ui/`).
- Produces: `<CaseStudyCard entry={CollectionEntry<'casos-de-exito'>} />`, consumido también por la home en Task 12.

- [ ] **Step 1: Agregar `--neon-yellow-rgb` a `src/styles/tokens.css`**

Agregar esta línea junto a los otros `*-rgb` (después de `--neon-green-rgb`):

```css
  --neon-yellow-rgb: 232, 255, 66;
```

- [ ] **Step 2: Crear `src/content/casos-de-exito/tesla-gps.md`**

```markdown
---
cliente: "Tesla GPS"
industria: "Instalación y monitoreo de GPS vehicular"
dolor: "Tesla GPS es una empresa de instalación y monitoreo de dispositivos GPS vehiculares en Cali. Su operación —clientes, vehículos, instalaciones, inventario de equipos, planes de monitoreo— se llevaba de forma dispersa, apoyada en hojas de cálculo y registros manuales: sin trazabilidad confiable del GPS y la SIM instalados en cada vehículo, inventario a ciegas sin descuento automático, renovaciones de planes que se perdían por falta de alertas, información fragmentada entre cliente/vehículo/plan/historial, y sin control de acceso por roles."
solucion: "Un sistema web centralizado, hecho a la medida del flujo real de Tesla GPS, que ordena toda la operación en una sola plataforma con acceso diferenciado por rol. Se apoya en trazabilidad de punta a punta (vehículo, GPS y SIM identificados por IMEI y número, con historial de reemplazos), control operativo real (inventario serializado que se descuenta solo al cerrar una orden, renovaciones con alertas automáticas) y orden por roles (Administrador, Administrador de Punto, Recepcionista, Técnico y Soporte, con seguridad garantizada a nivel de base de datos)."
capacidades:
  - "Gestión de clientes y vehículos con múltiples teléfonos de contacto"
  - "Órdenes de servicio con ciclo completo (pendiente → en proceso → cerrada) y cierre técnico con firma en pantalla"
  - "Cumplimiento de habeas data (Ley 1581) con aceptación de términos versionados"
  - "Inventario serializado de GPS y SIM con alta por lote y trazabilidad por unidad"
  - "Planes y renovaciones con cálculo automático de vencimiento y alertas de fidelización"
  - "Notificaciones al cliente por WhatsApp"
  - "Dashboards por rol y módulo de soporte de solo lectura"
stack:
  - "React"
  - "Supabase"
  - "PostgreSQL"
  - "Row Level Security"
resultado: "Tesla GPS pasa de una operación dispersa en hojas de cálculo a una plataforma única donde cada cliente, vehículo, dispositivo y plan es trazable, cada rol tiene su espacio, y la información está disponible en tiempo real para tomar decisiones — sin perder de vista una renovación ni un equipo."
status: "ejecutado"
featured: true
---

Sistema de gestión operativa construido por Transformia para Tesla GPS, empresa de instalación y monitoreo de dispositivos GPS vehiculares en Cali.
```

- [ ] **Step 3: Crear `src/content/casos-de-exito/frigorinoquia.md`**

```markdown
---
cliente: "Frigorinoquia"
industria: "Planta de beneficio animal y desposte"
dolor: "Frigorinoquia es una planta de beneficio animal (sacrificio) y sala de desposte mixto. Todo el proceso —desde el ingreso del animal hasta la salida del producto— se documentaba en papel y Excel: apertura de lote manual, pesaje sin sistema, sin visibilidad de inventario en cámara fría, despacho propenso a error en guías escritas a mano, reportes gerenciales tardíos, cobranza de maquila calculada manualmente y trazabilidad animal incompleta entre el ingreso, el examen ante/post mortem y el destino final de cada corte."
solucion: "Una suite de seis aplicaciones web independientes, cada una responsable de una estación física de la planta, conectadas a la misma base de datos con trazabilidad de extremo a extremo: desde el animal vivo hasta el corte empacado despachado al cliente. El peso se captura directamente de báscula serial en tiempo real, las etiquetas se generan automáticamente en ZPL, el inventario de cámara fría se actualiza solo con cada pesaje vía funciones transaccionales, y la liquidación de maquila se genera a partir de esos mismos datos operativos."
capacidades:
  - "app_apertura: apertura de lote, fichas técnicas de cortes, consolidados diarios"
  - "app_presa y app_granel: pesaje en báscula serial en tiempo real con impresión automática de etiqueta ZPL"
  - "app_despacho: guías, certificados de rendimiento y calidad, despacho de canales enteras y de cortes empacados"
  - "app_reportes: dashboard de KPIs y exportación a PDF/Excel"
  - "app_cobranza: liquidación automática de maquila y cuentas por cobrar"
  - "Trazabilidad completa por lote: beneficio → desposte → pesaje → despacho → cliente"
stack:
  - "Python"
  - "FastAPI"
  - "Supabase (PostgreSQL)"
  - "PySerial"
  - "ZPL/Zebra"
resultado: "Frigorinoquia pasa de un proceso documentado en papel y Excel a una suite conectada donde cada animal, lote, corte y despacho queda trazado de punta a punta, con el peso capturado directamente de báscula, las etiquetas impresas automáticamente, el inventario descontado en tiempo real, y la cobranza generada a partir de los mismos datos operativos, sin doble digitación."
status: "ejecutado"
featured: true
---

Suite de seis aplicaciones web construidas por Transformia para digitalizar la trazabilidad completa de beneficio y desposte de Frigorinoquia.
```

- [ ] **Step 4: Crear `src/content/casos-de-exito/tracing-colombina.md`**

```markdown
---
cliente: "Colombina Conservas"
industria: "Manufactura de alimentos"
dolor: "Colombina Conservas programaba su producción mediante órdenes de trabajo semanales compartidas como archivos Excel sueltos por correo. No había trazabilidad sistemática de qué ingrediente, lote y peso exacto se usaba en cada bache, los pesos se anotaban a mano sin validar contra la fórmula esperada, y gerencia no tenía visibilidad en tiempo real de cuántos baches iban ni cuál era la eficiencia operativa del turno — esa información solo se conocía después, reconstruida a mano."
solucion: "Tracing 2.0: un flujo de 4 fases que convierte la orden de producción semanal en un ciclo de captura de datos en tiempo real. Planeación formaliza el punto de entrada, un proceso de scraping automatizado extrae y carga esa información a PostgreSQL, los formuladores operan en planta con una app de escritorio que registra cada pesaje/escaneo bache por bache, y un dashboard en tiempo real visualiza esa misma base de datos con filtro cruzado por fecha y elemento."
capacidades:
  - "Ingesta y limpieza automática de la orden de producción en Excel hacia PostgreSQL"
  - "Escaneo de ingredientes por código de barras y pesaje en báscula serial con validación de tolerancia contra la fórmula"
  - "Conversión automática de unidades (G, L, ML, GL) a KG"
  - "Impresión de etiqueta ZPL por ingrediente y bache"
  - "Dashboard en tiempo real: bache actual, fórmulas creadas/faltantes, eficiencia operativa"
  - "Informe final en PDF con el resumen de consumo por material"
stack:
  - "Python"
  - "Tkinter"
  - "pandas"
  - "PostgreSQL"
  - "PySerial"
resultado: "Colombina pasa de una orden de producción en Excel suelta por correo a un ciclo de trazabilidad continuo: se planea, se scrapea automáticamente hacia PostgreSQL, se ejecuta en planta con pesaje y escaneo validados contra la fórmula esperada, y todo se refleja en un dashboard en tiempo real que gerencia puede filtrar sin esperar al cierre del turno."
status: "ejecutado"
featured: true
---

Ciclo de trazabilidad de 4 fases (Tracing 2.0) construido por Transformia para la operación de formulación de Colombina Conservas.
```

- [ ] **Step 5: Crear `src/content/casos-de-exito/feriaapp.md`**

```markdown
---
cliente: "FeriaApp (patrocinado por Frigorinoquia)"
industria: "Marketplace de ganado — Orinoquía colombiana"
dolor: "La compraventa de ganado en la Orinoquía colombiana (Casanare, Meta, Arauca, Vichada) ocurre en un mercado fragmentado y mayormente informal: sin canal directo entre ganadero y comerciante, sin forma de validar confianza entre desconocidos, comunicación lenta por llamadas o mensajes sueltos sin seguimiento estructurado, y una gran parte de los usuarios potenciales operan con conectividad rural intermitente que la mayoría de apps no contempla."
solucion: "Una aplicación móvil (Expo + React Native) que funciona como marketplace de ganado, conectando dos roles: ganaderos, que publican animales de forma gratuita e ilimitada, y comerciantes, que acceden mediante membresía mensual. Sobre esa base, la plataforma resuelve solicitudes de compra estructuradas, chat en tiempo real, reseñas y calificación de perfiles, y búsqueda avanzada por ubicación geográfica — todo optimizado para conectividad limitada en zonas rurales."
capacidades:
  - "Registro y publicación de animales, gratuita e ilimitada para ganaderos"
  - "Acceso de comerciantes por membresía mensual con notificación de vencimiento"
  - "Solicitudes de compra sobre publicaciones específicas y chat en tiempo real"
  - "Sistema de reseñas y calificación de perfiles"
  - "Búsqueda avanzada con filtros y ubicación geográfica por departamento/municipio"
  - "Notificaciones push e in-app, diseño optimizado para conectividad limitada"
stack:
  - "React Native (Expo)"
  - "TypeScript"
  - "Supabase"
  - "TanStack React Query"
  - "Zustand"
resultado: "FeriaApp le da a la Orinoquía ganadera un canal formal de compraventa que antes no existía: los ganaderos publican sin costo, los comerciantes acceden mediante un modelo de membresía que sostiene la operación, y ambos negocian con chat directo, solicitudes rastreables y reputación visible por reseñas — pensado para funcionar incluso con la conectividad limitada típica de las fincas alejadas."
status: "ejecutado"
featured: false
---

Marketplace móvil de ganado construido por Transformia, patrocinado por Frigorinoquia, para conectar ganaderos y comerciantes en la Orinoquía colombiana.
```

- [ ] **Step 6: Crear `src/content/casos-de-exito/portafolio-interlink.md`**

```markdown
---
cliente: "Interlink (agencia de marketing digital, Australia)"
industria: "Portafolio multi-cliente — agencia de marketing digital"
dolor: "Durante una pasantía en Interlink, una agencia de marketing digital australiana, cada cliente de la agencia necesitaba un sitio de marketing propio, con calidad de producción, en industrias completamente distintas entre sí (entretenimiento nocturno, coaching de bienestar, servicios del hogar, entretenimiento infantil), sin presupuesto ni tiempo para reinventar la base técnica en cada proyecto."
solucion: "Un portafolio de seis sitios web independientes, todos sobre una base técnica común (Astro + TypeScript, arquitectura static-first) pero cada uno con su propia estrategia de contenido, patrón de integración de backend y enfoque de animación — desde efectos de scroll hechos a mano hasta plataformas de reservas con Supabase o pipelines de leads con Google Apps Script."
capacidades:
  - "AlphaMen: sitio de reservas para entretenimiento nocturno con scroll cinematográfico y carrusel de performers hecho a mano"
  - "Empress Nic: blog con content collections, captura de lead-magnet vía Google Apps Script, testimonios en vivo desde Google Sheets"
  - "Harmony Home: marketing + dashboard de cliente/admin con Supabase, motor de reservas con reglas de negocio por tipo de propiedad"
  - "Interlink Agency Landing: bento-grid de servicios, animación custom en canvas/SVG, sitemap y accesibilidad WCAG"
  - "Super Hero Parties: motor de animación JS vanilla para sprites voladores, captura de leads con Google Sheets + WhatsApp deep-link"
stack:
  - "Astro 4/5"
  - "TypeScript"
  - "Supabase"
  - "Google Apps Script"
  - "GSAP / Framer Motion"
resultado: "Seis sitios de producción entregados para seis clientes de industrias distintas, cada uno con identidad visual propia construida específicamente para su nicho, compartiendo un patrón técnico común que permitió moverse rápido sin sacrificar calidad ni originalidad por sitio."
status: "ejecutado"
featured: false
---

Portafolio de seis sitios web de marketing construidos durante una pasantía en Interlink, agencia de marketing digital australiana — la base del portafolio actual de Transformia.
```

- [ ] **Step 7: Crear `src/content/casos-de-exito/tracing-b4.md`**

```markdown
---
cliente: "ACFEC — Organizaciones ganaderas campesinas de la Orinoquía"
industria: "Trazabilidad agroalimentaria bovina"
dolor: "Las organizaciones de Agricultura Campesina, Familiar, Étnica y Comunitaria (ACFEC) bovinas de la Orinoquía colombiana (Boyacá, Casanare, Arauca y Meta) están excluidas de las cadenas agroalimentarias formales: más del 80% no tiene registro activo en SINIGAN, los intermediarios informales capturan hasta el 40% del valor final por falta de registros verificables, entre el 8% y el 15% de los bovinos son rechazados en planta por documentación sanitaria incompleta, y las soluciones de trazabilidad comerciales existentes no aplican a un contexto con conectividad rural del 18%-34%."
solucion: "TRACING B-4.0: una propuesta técnica de sistema de trazabilidad agroalimentaria co-diseñado con las comunidades ACFEC, con cuatro módulos — trazabilidad de campo con identificación RFID y app móvil offline-first, integración oficial con SINIGAN-ICA en planta de beneficio, comercialización con código QR trazable al consumidor final, y gobernanza de datos colectiva donde la información queda en propiedad de cada organización ACFEC, no de la plataforma."
capacidades:
  - "Identificación individual por arete RFID con lectura desde app móvil offline-first"
  - "Sincronización automática asíncrona en cuanto detecta señal"
  - "Integración con el protocolo oficial API SINIGAN-ICA"
  - "Certificado digital de inocuidad y origen vinculado al historial RFID"
  - "Código QR trazable al consumidor final con panel de precios de mercado en tiempo real"
  - "Dashboard de gobernanza de datos por organización, con control de acceso y auditoría"
stack:
  - "RFID"
  - "App móvil offline-first (Android/iOS)"
  - "Integración SINIGAN-ICA"
  - "Cloud en COP (AWS/Azure Colombia)"
resultado: "Propuesta presentada a la Convocatoria No. 47 de Minciencias/SGR, con un piloto especificado de 25 fincas y ~2.500 bovinos en cuatro departamentos. El proyecto no fue financiado ni ejecutado — quedó en fase de formulación técnica. Ninguna cifra de impacto fue verificada en campo."
status: "propuesta"
featured: false
---

Propuesta técnica completa (45 páginas) de sistema de trazabilidad bovina para organizaciones ACFEC de la Orinoquía, presentada a Minciencias/SGR por la Fundación Parque Tecnológico de Software de la Amazorinoquia con Transformia como equipo de desarrollo tecnológico. **No ejecutado.**
```

- [ ] **Step 8: Crear `src/components/CaseStudyCard.astro`**

```astro
---
// src/components/CaseStudyCard.astro
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'casos-de-exito'>;
}

const { entry } = Astro.props;
const { cliente, industria, resultado, status } = entry.data;
---

<a href={`/casos-de-exito/${entry.id}`} class="case-card">
  {status === 'propuesta' && <span class="case-card-badge">Propuesta técnica</span>}
  <h3 class="case-card-title">{cliente}</h3>
  <p class="case-card-industry">{industria}</p>
  <p class="case-card-result">{resultado.slice(0, 140)}...</p>
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

- [ ] **Step 9: Crear `src/layouts/CaseStudyLayout.astro`**

```astro
---
// src/layouts/CaseStudyLayout.astro
import MainLayout from './MainLayout.astro';
import SectionHeader from '../components/ui/SectionHeader.astro';
import GridBackground from '../components/ui/GridBackground.astro';
import TechBadge from '../components/ui/TechBadge.astro';
import { breadcrumbSchema } from '../lib/seo/breadcrumb';
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'casos-de-exito'>;
}

const { entry } = Astro.props;
const { cliente, industria, dolor, solucion, capacidades, stack, resultado, status } = entry.data;

const pageTitle = `${cliente} — Caso de éxito | Transformia`;
const description = `${cliente} (${industria}): ${dolor.slice(0, 140)}...`;
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Casos de éxito', path: '/casos-de-exito' },
  { name: cliente, path: `/casos-de-exito/${entry.id}` },
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

- [ ] **Step 10: Crear `src/pages/casos-de-exito/index.astro`**

```astro
---
// src/pages/casos-de-exito/index.astro
import { getCollection } from 'astro:content';
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import CaseStudyCard from '../../components/CaseStudyCard.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';

const allCases = await getCollection('casos-de-exito');
const ejecutados = allCases.filter((c) => c.data.status === 'ejecutado');
const propuestas = allCases.filter((c) => c.data.status === 'propuesta');

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
        {ejecutados.map((entry) => <CaseStudyCard entry={entry} />)}
      </div>

      {propuestas.length > 0 && (
        <div class="propuestas-block">
          <h2 class="propuestas-title">Propuestas técnicas</h2>
          <p class="propuestas-subtitle">
            Proyectos formulados por Transformia que aún no fueron financiados o ejecutados. Se documentan por transparencia, no como resultados entregados.
          </p>
          <div class="cards-grid">
            {propuestas.map((entry) => <CaseStudyCard entry={entry} />)}
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

- [ ] **Step 11: Crear `src/pages/casos-de-exito/[slug].astro`**

```astro
---
// src/pages/casos-de-exito/[slug].astro
import { getCollection, type CollectionEntry } from 'astro:content';
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('casos-de-exito');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'casos-de-exito'>;
}

const { entry } = Astro.props;
---

<CaseStudyLayout entry={entry} />
```

- [ ] **Step 12: Verificar el build y las rutas**

Run: `npm run build`
Expected: mismo error pendiente sobre `index.astro`/`privacidad.astro`/`terminos.astro` sin `description` (se resuelve en tareas posteriores) — nada nuevo relacionado a `casos-de-exito`.

Run: `npm run dev`
Navegar a `http://localhost:4321/casos-de-exito` y confirmar que aparecen 5 tarjetas en la sección principal y 1 tarjeta (`tracing-b4`) en la sección "Propuestas técnicas" con su badge visible. Navegar a `http://localhost:4321/casos-de-exito/tesla-gps` y a `http://localhost:4321/casos-de-exito/tracing-b4`, confirmar que esta última muestra el badge "Propuesta técnica — no ejecutada" de forma clara.

- [ ] **Step 13: Commit**

```bash
git add src/styles/tokens.css src/content/casos-de-exito src/components/CaseStudyCard.astro src/layouts/CaseStudyLayout.astro src/pages/casos-de-exito
git commit -m "feat: add case studies collection, layout and pages"
```

---

## Task 6: Blog — infraestructura y posts semilla

**Files:**
- Create: `src/content/blog/como-elegir-desarrollo-a-medida-vs-saas.md`
- Create: `src/content/blog/que-significa-ia-aplicada-en-software.md`
- Create: `src/components/BlogPostCard.astro`
- Create: `src/layouts/BlogLayout.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`

**Interfaces:**
- Consumes: `MainLayout`, `breadcrumbSchema`, `articleSchema` (Task 1), colección `'blog'` (Task 4).
- Produces: `<BlogPostCard entry={CollectionEntry<'blog'>} />`, consumido también por la home en Task 12.

- [ ] **Step 1: Crear `src/content/blog/como-elegir-desarrollo-a-medida-vs-saas.md`**

```markdown
---
title: "Software a medida vs. SaaS genérico: cómo decidir sin perder plata"
description: "Un SaaS genérico resuelve rápido pero te ata a su modelo de datos. Guía práctica para decidir cuándo conviene construir a medida."
pubDate: 2026-07-20
tags: ["desarrollo a medida", "arquitectura de software"]
draft: false
---

## El error más común

La mayoría de empresas arranca con un SaaS genérico porque es lo más rápido de poner en marcha. El problema no es esa decisión inicial — es no revisarla cuando el negocio ya no encaja en el molde del SaaS.

## Tres señales de que ya no te sirve un SaaS genérico

1. **Estás pagando por módulos que no usás** para acceder a los dos o tres que sí necesitás.
2. **Tu proceso real no cabe en el flujo que el SaaS asume** — terminás con hojas de cálculo paralelas para lo que el sistema no contempla.
3. **Los datos de tu operación viven en una plataforma de un tercero**, sin API completa ni forma real de sacarlos si cambiás de proveedor.

## Cuándo sí conviene desarrollo a medida

Cuando tu operación tiene una lógica de negocio específica — trazabilidad por unidad, roles particulares, integraciones con hardware propio — un sistema construido para ese flujo exacto termina costando menos en el tiempo que un SaaS genérico forzado a encajar, más el costo invisible de los procesos paralelos que ese SaaS no cubre.

## Cómo lo evaluamos en Transformia

Antes de proponer desarrollo a medida, miramos si un SaaS existente ya resuelve el 80% del problema real. Si lo resuelve, no tiene sentido construir desde cero. Si no — si el negocio tiene una lógica operativa propia que ningún SaaS genérico contempla — ahí es donde a medida gana, y lo decimos así de directo en la primera reunión, no después de vender el proyecto.
```

- [ ] **Step 2: Crear `src/content/blog/que-significa-ia-aplicada-en-software.md`**

```markdown
---
title: "Qué significa realmente 'IA aplicada' en un proyecto de software"
description: "IA aplicada no es meter un chatbot. Es usar modelos y datos para resolver un cuello de botella operativo concreto. Así lo definimos en Transformia."
pubDate: 2026-07-28
tags: ["inteligencia artificial", "automatización"]
draft: false
---

## El término está gastado

"Inteligencia artificial" hoy se usa para casi cualquier cosa con una API de un modelo de lenguaje conectada. Eso genera una expectativa equivocada: que agregar IA es agregar un chat flotante en una esquina de la pantalla.

## Lo que de verdad mueve la aguja

En los proyectos donde IA aplicada funciona, el patrón se repite: hay un cuello de botella operativo específico — clasificar, predecir, extraer, validar — que hoy alguien hace a mano y no escala. La IA no reemplaza el criterio humano ahí, reemplaza el trabajo repetitivo que rodea ese criterio.

## Tres preguntas antes de meter IA a un proyecto

1. **¿Qué decisión o tarea repetitiva estamos automatizando, exactamente?** Si no hay una respuesta concreta, probablemente no hace falta IA todavía.
2. **¿Tenemos datos reales para entrenar o para dar contexto al modelo?** Sin datos propios, cualquier IA aplicada es genérica y reemplazable.
3. **¿Qué pasa si el modelo se equivoca?** Si el costo de un error es alto, el diseño necesita un humano en el loop, no automatización ciega.

## Cómo lo trabajamos en Transformia

Nuestra especialización en IA no es "le agregamos un modelo a lo que ya tenías". Es identificar, dentro del sistema que estamos construyendo de todos modos, el punto exacto donde un modelo hace un trabajo que hoy consume horas humanas — y medir si de verdad conviene automatizarlo antes de escribir una línea de código.
```

- [ ] **Step 3: Crear `src/components/BlogPostCard.astro`**

```astro
---
// src/components/BlogPostCard.astro
import type { CollectionEntry } from 'astro:content';

interface Props {
  entry: CollectionEntry<'blog'>;
}

const { entry } = Astro.props;
const { title, description, pubDate, tags } = entry.data;

const formattedDate = pubDate.toLocaleDateString('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<a href={`/blog/${entry.id}`} class="post-card">
  <span class="post-card-date">{formattedDate}</span>
  <h3 class="post-card-title">{title}</h3>
  <p class="post-card-description">{description}</p>
  <div class="post-card-tags">
    {tags.map((tag) => <span class="post-card-tag">{tag}</span>)}
  </div>
</a>

<style>
  .post-card {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.75rem;
    background: rgba(26, 20, 45, 0.6);
    border: 1px solid rgba(var(--neon-purple-rgb), 0.25);
    border-radius: var(--radius-card);
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
  }

  .post-card:hover {
    border-color: var(--neon-purple);
    box-shadow: 0 10px 30px rgba(var(--neon-purple-rgb), 0.15);
    transform: translateY(-4px);
  }

  .post-card-date {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--neon-blue);
  }

  .post-card-title {
    font-family: var(--font-body);
    font-size: 1.2rem;
  }

  .post-card-description {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .post-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .post-card-tag {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    padding: 0.15rem 0.5rem;
  }
</style>
```

- [ ] **Step 4: Crear `src/layouts/BlogLayout.astro`**

```astro
---
// src/layouts/BlogLayout.astro
import { render, type CollectionEntry } from 'astro:content';
import MainLayout from './MainLayout.astro';
import GridBackground from '../components/ui/GridBackground.astro';
import { breadcrumbSchema } from '../lib/seo/breadcrumb';
import { articleSchema } from '../lib/seo/article';

interface Props {
  entry: CollectionEntry<'blog'>;
}

const { entry } = Astro.props;
const { title, description, pubDate, updatedDate } = entry.data;
const { Content } = await render(entry);

const formattedDate = pubDate.toLocaleDateString('es-CO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const url = new URL(`/blog/${entry.id}`, Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: title, path: `/blog/${entry.id}` },
];
---

<MainLayout
  title={`${title} | Blog Transformia`}
  description={description}
  type="article"
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    articleSchema({ title, description, pubDate, updatedDate, url, image: new URL('/og-default.jpg', Astro.site).toString() }),
  ]}
>
  <article class="post">
    <GridBackground opacity={0.25} />
    <div class="container">
      <span class="post-date">{formattedDate}</span>
      <h1 class="post-title">{title}</h1>
      <div class="post-body">
        <Content />
      </div>
      <a href="/blog" class="back-link">← Ver todos los artículos</a>
    </div>
  </article>
</MainLayout>

<style>
  .post {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 720px;
    margin: 0 auto;
  }

  .post-date {
    font-family: var(--font-mono);
    color: var(--neon-blue);
    font-size: 0.9rem;
  }

  .post-title {
    font-family: var(--font-body);
    font-size: clamp(2rem, 4vw, 2.8rem);
    margin: 1rem 0 2rem;
  }

  .post-body {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.8;
  }

  .post-body :global(h2) {
    font-family: var(--font-body);
    color: var(--neon-purple);
    font-size: 1.4rem;
    margin: 2rem 0 1rem;
  }

  .post-body :global(p) {
    margin-bottom: 1.25rem;
  }

  .post-body :global(ul),
  .post-body :global(ol) {
    margin: 0 0 1.25rem 1.5rem;
  }

  .post-body :global(li) {
    margin-bottom: 0.5rem;
  }

  .back-link {
    display: inline-block;
    margin-top: 3rem;
    color: var(--neon-purple);
    font-family: var(--font-mono);
    text-decoration: none;
  }

  .back-link:hover {
    text-decoration: underline;
  }
</style>
```

- [ ] **Step 5: Crear `src/pages/blog/index.astro`**

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import BlogPostCard from '../../components/BlogPostCard.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';

const allPosts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Blog', path: '/blog' },
];
---

<MainLayout
  title="Blog | Transformia"
  description="Artículos de Transformia sobre desarrollo de software a medida, inteligencia artificial aplicada y arquitectura de sistemas."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <section class="blog-section">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader
        title="BLOG"
        badge="TRANSFORMIA"
        subtitle="Ideas y aprendizajes de proyectos reales de desarrollo de software e inteligencia artificial aplicada."
      />

      {allPosts.length > 0 ? (
        <div class="posts-grid">
          {allPosts.map((entry) => <BlogPostCard entry={entry} />)}
        </div>
      ) : (
        <p class="empty-state">Todavía no hay artículos publicados. Volvé pronto.</p>
      )}
    </div>
  </section>
</MainLayout>

<style>
  .blog-section {
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

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.75rem;
  }

  .empty-state {
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 768px) {
    .blog-section {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 6: Crear `src/pages/blog/[slug].astro`**

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, type CollectionEntry } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('blog', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'blog'>;
}

const { entry } = Astro.props;
---

<BlogLayout entry={entry} />
```

- [ ] **Step 7: Verificar el build y las rutas**

Run: `npm run build`
Expected: mismo pendiente de `index.astro`/`privacidad.astro`/`terminos.astro`, nada nuevo relacionado a `blog`.

Run: `npm run dev`
Navegar a `http://localhost:4321/blog`, confirmar que aparecen 2 tarjetas ordenadas por fecha (el post del 28 de julio primero). Abrir cada post y confirmar que el contenido markdown se renderiza con títulos y listas con el estilo correcto.

- [ ] **Step 8: Commit**

```bash
git add src/content/blog src/components/BlogPostCard.astro src/layouts/BlogLayout.astro src/pages/blog
git commit -m "feat: add blog collection, layout, pages and seed posts"
```

---

## Task 7: Hub de servicios + primeras 3 páginas (desarrollo, transformación, IA)

**Files:**
- Create: `src/components/ServiceCard.astro`
- Create: `src/pages/servicios/index.astro`
- Create: `src/pages/servicios/desarrollo.astro`
- Create: `src/pages/servicios/transformacion.astro`
- Create: `src/pages/servicios/ia.astro`

**Interfaces:**
- Produces: `<ServiceCard slug title description icon? />`, reutilizado en el hub y en la home (Task 12).
- Consumes: `MainLayout`, `serviceSchema`, `breadcrumbSchema` (Task 1); componentes existentes `DesarrolloSlide`, `TransformacionSlide`, `InteligenciaSlide` (`src/components/SolucionesComponents/CarouselSlides/`) como tarjeta visual dentro de cada página de servicio.

- [ ] **Step 1: Crear `src/components/ServiceCard.astro`**

```astro
---
// src/components/ServiceCard.astro
interface Props {
  slug: string;
  title: string;
  description: string;
}

const { slug, title, description } = Astro.props;
---

<a href={`/servicios/${slug}`} class="service-card-link">
  <h3 class="service-card-link-title">{title}</h3>
  <p class="service-card-link-description">{description}</p>
  <span class="service-card-link-cta">Conocer más →</span>
</a>

<style>
  .service-card-link {
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

  .service-card-link:hover {
    border-color: var(--neon-purple);
    box-shadow: 0 10px 30px rgba(var(--neon-purple-rgb), 0.15);
    transform: translateY(-4px);
  }

  .service-card-link-title {
    font-family: var(--font-body);
    font-size: 1.2rem;
  }

  .service-card-link-description {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .service-card-link-cta {
    margin-top: auto;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--neon-blue);
  }
</style>
```

- [ ] **Step 2: Crear `src/pages/servicios/index.astro`**

```astro
---
// src/pages/servicios/index.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';

const services = [
  { slug: 'desarrollo', title: 'Desarrollo de Software a Medida', description: 'Aplicaciones web, móviles y sistemas de gestión construidos para tu operación específica, no para un caso de uso genérico.' },
  { slug: 'transformacion', title: 'Transformación Digital y Automatización', description: 'Digitalizamos procesos analógicos y automatizamos flujos repetitivos con tecnología a la medida de tu operación.' },
  { slug: 'ia', title: 'Inteligencia Artificial y Data Analytics', description: 'IA aplicada a un cuello de botella operativo concreto, no un chatbot genérico — con datos reales y un humano en el loop donde importa.' },
  { slug: 'asesoria', title: 'Asesoría en Optimización de Procesos', description: 'Identificamos cuellos de botella operativos y proponemos soluciones tecnológicas concretas para eliminarlos.' },
  { slug: 'iot', title: 'Internet of Things y Sistemas Físicos', description: 'Conectamos hardware — sensores, básculas, impresoras — con software que captura datos en tiempo real desde el mundo físico.' },
  { slug: 'arquitectura', title: 'Arquitectura de Software', description: 'Diseño técnico, modelado de casos de uso y decisiones de arquitectura antes de escribir una línea de código de producción.' },
  { slug: 'database', title: 'Gestión de Bases de Datos', description: 'Diseño, implementación y optimización de bases de datos SQL y NoSQL para operaciones que necesitan rendimiento y trazabilidad reales.' },
];

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
];
---

<MainLayout
  title="Servicios | Transformia"
  description="Desarrollo de software a medida, inteligencia artificial aplicada, IoT, arquitectura y bases de datos. Las 7 líneas de trabajo de Transformia."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <section class="servicios-hub">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader
        title="SERVICIOS"
        badge="ALTA TECNOLOGÍA"
        subtitle="Siete líneas de trabajo, un mismo equipo boutique especializado en inteligencia artificial aplicada."
      />
      <div class="services-grid">
        {services.map((service) => <ServiceCard {...service} />)}
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .servicios-hub {
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

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.75rem;
  }

  @media (max-width: 768px) {
    .servicios-hub {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 3: Crear `src/pages/servicios/desarrollo.astro`**

```astro
---
// src/pages/servicios/desarrollo.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import DesarrolloSlide from '../../components/SolucionesComponents/CarouselSlides/DesarrolloSlide.astro';
import CaseStudyCard from '../../components/CaseStudyCard.astro';
import { getCollection } from 'astro:content';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/desarrollo', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Desarrollo de Software', path: '/servicios/desarrollo' },
];

const relatedSlugs = ['tesla-gps', 'frigorinoquia'];
const relatedCases = (await getCollection('casos-de-exito')).filter((c) => relatedSlugs.includes(c.id));
---

<MainLayout
  title="Desarrollo de Software a Medida | Transformia"
  description="Aplicaciones web, móviles y sistemas de gestión construidos para tu operación específica, no para un caso de uso genérico. Desarrollo de software a medida en Transformia."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Desarrollo de Software a Medida', description: 'Aplicaciones web, móviles y sistemas de gestión construidos para tu operación específica.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="DESARROLLO DE SOFTWARE A MEDIDA" badge="SERVICIO" />

      <DesarrolloSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            La mayoría de los problemas operativos serios no caben en un SaaS genérico: tienen roles específicos, integraciones con hardware propio, o una lógica de negocio que ningún producto de estante contempla. Ahí es donde construimos software a medida — aplicaciones web, apps móviles y sistemas de gestión diseñados alrededor de tu proceso real, no al revés.
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Levantamos el modelo de datos y la arquitectura antes de escribir código de producción, construimos por módulos en etapas aprobadas, y entregamos con migración de datos históricos, capacitación por rol y manuales de usuario — no solo el código.
          </p>
        </section>

        {relatedCases.length > 0 && (
          <section class="block">
            <h2>Casos de éxito relacionados</h2>
            <div class="related-grid">
              {relatedCases.map((entry) => <CaseStudyCard entry={entry} />)}
            </div>
          </section>
        )}

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 4: Crear `src/pages/servicios/transformacion.astro`**

Mismo patrón que `desarrollo.astro` (Step 3), con estos valores específicos:

```astro
---
// src/pages/servicios/transformacion.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import TransformacionSlide from '../../components/SolucionesComponents/CarouselSlides/TransformacionSlide.astro';
import CaseStudyCard from '../../components/CaseStudyCard.astro';
import { getCollection } from 'astro:content';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/transformacion', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Transformación Digital', path: '/servicios/transformacion' },
];

const relatedSlugs = ['frigorinoquia', 'tracing-colombina'];
const relatedCases = (await getCollection('casos-de-exito')).filter((c) => relatedSlugs.includes(c.id));
---

<MainLayout
  title="Transformación Digital y Automatización | Transformia"
  description="Digitalizamos procesos analógicos y automatizamos flujos repetitivos con tecnología a la medida. Transformación digital real, no un dashboard encima del mismo proceso en papel."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Transformación Digital y Automatización', description: 'Digitalización de procesos analógicos y automatización de flujos repetitivos.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="TRANSFORMACIÓN DIGITAL Y AUTOMATIZACIÓN" badge="SERVICIO" />

      <TransformacionSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            Cuando un proceso todavía vive en papel, Excel o WhatsApp, el costo no es solo el tiempo perdido — es la falta de trazabilidad y la imposibilidad de tomar decisiones con datos reales mientras la operación ocurre. Digitalizamos ese proceso capturando el dato en la fuente (báscula, escáner, formulario) en vez de reconstruirlo a mano después.
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Mapeamos el flujo real antes de automatizar nada — no digitalizamos un proceso roto, lo corregimos primero. Priorizamos captura en la fuente y actualización de inventario/estado en tiempo real vía funciones transaccionales, para que dos personas nunca vean datos desincronizados.
          </p>
        </section>

        {relatedCases.length > 0 && (
          <section class="block">
            <h2>Casos de éxito relacionados</h2>
            <div class="related-grid">
              {relatedCases.map((entry) => <CaseStudyCard entry={entry} />)}
            </div>
          </section>
        )}

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 5: Crear `src/pages/servicios/ia.astro`**

Mismo patrón, con estos valores específicos:

```astro
---
// src/pages/servicios/ia.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import InteligenciaSlide from '../../components/SolucionesComponents/CarouselSlides/InteligenciaSlide.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/ia', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Inteligencia Artificial', path: '/servicios/ia' },
];
---

<MainLayout
  title="Inteligencia Artificial y Data Analytics | Transformia"
  description="IA aplicada a un cuello de botella operativo concreto — no un chatbot genérico. Especialización en inteligencia artificial aplicada a software a medida."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Inteligencia Artificial y Data Analytics', description: 'Soluciones de IA y análisis de datos aplicadas a procesos operativos concretos.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="INTELIGENCIA ARTIFICIAL Y DATA ANALYTICS" badge="SERVICIO — ESPECIALIDAD" />

      <InteligenciaSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            No vendemos IA como feature de marketing. La aplicamos donde hay un cuello de botella operativo específico — clasificar, predecir, extraer, validar — que hoy alguien hace a mano y no escala. Esta es la línea donde Transformia se diferencia: no es un módulo que le agregamos a un sistema, es el punto de partida del diseño cuando el problema lo pide.
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Antes de proponer un modelo, validamos tres cosas: qué tarea repetitiva se automatiza exactamente, si hay datos reales propios para darle contexto al modelo, y qué pasa cuando se equivoca — si el costo de un error es alto, diseñamos con un humano en el loop, no automatización ciega.
          </p>
        </section>

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 6: Verificar rutas**

Run: `npm run dev`
Navegar a `/servicios`, `/servicios/desarrollo`, `/servicios/transformacion`, `/servicios/ia`. Confirmar que las 4 rutas responden 200, que cada página muestra el slide correspondiente más el contenido nuevo, y que `/servicios/desarrollo` muestra las tarjetas de Tesla GPS y Frigorinoquia como casos relacionados.

- [ ] **Step 7: Commit**

```bash
git add src/components/ServiceCard.astro src/pages/servicios/index.astro src/pages/servicios/desarrollo.astro src/pages/servicios/transformacion.astro src/pages/servicios/ia.astro
git commit -m "feat: add services hub and first 3 service pages"
```

---

## Task 8: Últimas 4 páginas de servicio (asesoría, IoT, arquitectura, database)

**Files:**
- Create: `src/pages/servicios/asesoria.astro`
- Create: `src/pages/servicios/iot.astro`
- Create: `src/pages/servicios/arquitectura.astro`
- Create: `src/pages/servicios/database.astro`

**Interfaces:**
- Consumes: mismo patrón que Task 7 (`MainLayout`, `serviceSchema`, `breadcrumbSchema`, `AsesoriaSlide`/`IoTSlide`/`ArquitecturaSlide`/`DatabaseSlide`).

- [ ] **Step 1: Crear `src/pages/servicios/asesoria.astro`**

```astro
---
// src/pages/servicios/asesoria.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import AsesoriaSlide from '../../components/SolucionesComponents/CarouselSlides/AsesoriaSlide.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/asesoria', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Asesoría en Procesos', path: '/servicios/asesoria' },
];
---

<MainLayout
  title="Asesoría en Optimización de Procesos | Transformia"
  description="Identificamos cuellos de botella operativos y proponemos soluciones tecnológicas concretas para eliminarlos, antes de comprometer presupuesto en desarrollo."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Asesoría en Optimización de Procesos', description: 'Auditoría y estrategia para eliminar cuellos de botella operativos.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="ASESORÍA EN OPTIMIZACIÓN DE PROCESOS" badge="SERVICIO" />

      <AsesoriaSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            No todos los problemas operativos necesitan un sistema nuevo desde el día uno. Antes de proponer desarrollo, auditamos el proceso real, identificamos dónde se pierde tiempo o plata, y proponemos la intervención mínima que resuelve el cuello de botella — que a veces es reordenar un flujo, y a veces sí es construir software.
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Auditoría del proceso actual, definición de la estrategia de intervención y acompañamiento en la implementación, con foco en retorno medible — no en vender horas de consultoría sin un cambio operativo concreto al final.
          </p>
        </section>

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 2: Crear `src/pages/servicios/iot.astro`**

```astro
---
// src/pages/servicios/iot.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import IoTSlide from '../../components/SolucionesComponents/CarouselSlides/IoTSlide.astro';
import CaseStudyCard from '../../components/CaseStudyCard.astro';
import { getCollection } from 'astro:content';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/iot', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'IoT y Sistemas Físicos', path: '/servicios/iot' },
];

const relatedSlugs = ['frigorinoquia', 'tracing-colombina'];
const relatedCases = (await getCollection('casos-de-exito')).filter((c) => relatedSlugs.includes(c.id));
---

<MainLayout
  title="Internet of Things y Sistemas Físicos | Transformia"
  description="Conectamos hardware — básculas, sensores, impresoras — con software que captura datos en tiempo real desde el mundo físico, sin doble digitación."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Internet of Things y Sistemas Físicos', description: 'Integración de sensores y hardware con software para captura de datos en tiempo real.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="INTERNET OF THINGS Y SISTEMAS FÍSICOS" badge="SERVICIO" />

      <IoTSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            Cuando el dato nace en una báscula, un escáner o un sensor y alguien lo transcribe a mano después, ahí se pierde precisión y tiempo. Conectamos ese hardware directamente al sistema — lectura serial en tiempo real, sin el paso intermedio de "anotar y después digitar".
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Integración con báscula, escáner e impresora por puerto serial, con hilos de lectura en background que no bloquean la aplicación, y validación de tolerancia contra el valor esperado antes de aceptar el dato — para que un error de hardware no se propague como si fuera un dato válido.
          </p>
        </section>

        {relatedCases.length > 0 && (
          <section class="block">
            <h2>Casos de éxito relacionados</h2>
            <div class="related-grid">
              {relatedCases.map((entry) => <CaseStudyCard entry={entry} />)}
            </div>
          </section>
        )}

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 3: Crear `src/pages/servicios/arquitectura.astro`**

```astro
---
// src/pages/servicios/arquitectura.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import ArquitecturaSlide from '../../components/SolucionesComponents/CarouselSlides/ArquitecturaSlide.astro';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/arquitectura', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Arquitectura de Software', path: '/servicios/arquitectura' },
];
---

<MainLayout
  title="Arquitectura de Software | Transformia"
  description="Diseño técnico, modelado de casos de uso y decisiones de arquitectura antes de escribir código de producción, para sistemas escalables y mantenibles."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Arquitectura de Software', description: 'Diseño técnico y modelado de sistemas antes de la implementación.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="ARQUITECTURA DE SOFTWARE" badge="SERVICIO" />

      <ArquitecturaSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            Un sistema que se diseña sobre la marcha termina con deuda técnica que se paga varias veces. Levantamos requerimientos, modelamos casos de uso y definimos la arquitectura — módulos, modelo de datos, integraciones — antes de que se escriba la primera línea de código de producción.
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Construimos por módulos, en etapas aprobadas, con el modelo de datos y los diagramas técnicos definidos primero. Esto aplica tanto a proyectos nuevos como a sistemas existentes que necesitan una arquitectura ordenada antes de seguir creciendo.
          </p>
        </section>

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 4: Crear `src/pages/servicios/database.astro`**

```astro
---
// src/pages/servicios/database.astro
import MainLayout from '../../layouts/MainLayout.astro';
import GridBackground from '../../components/ui/GridBackground.astro';
import SectionHeader from '../../components/ui/SectionHeader.astro';
import DatabaseSlide from '../../components/SolucionesComponents/CarouselSlides/DatabaseSlide.astro';
import CaseStudyCard from '../../components/CaseStudyCard.astro';
import { getCollection } from 'astro:content';
import { breadcrumbSchema } from '../../lib/seo/breadcrumb';
import { serviceSchema } from '../../lib/seo/service';

const url = new URL('/servicios/database', Astro.site).toString();
const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Bases de Datos', path: '/servicios/database' },
];

const relatedSlugs = ['tesla-gps'];
const relatedCases = (await getCollection('casos-de-exito')).filter((c) => relatedSlugs.includes(c.id));
---

<MainLayout
  title="Gestión de Bases de Datos | Transformia"
  description="Diseño, implementación y optimización de bases de datos SQL y NoSQL para operaciones que necesitan rendimiento, seguridad y trazabilidad reales."
  jsonLd={[
    breadcrumbSchema(breadcrumbItems, Astro.site!),
    serviceSchema({ name: 'Gestión de Bases de Datos', description: 'Diseño e implementación de bases de datos SQL y NoSQL.', url }),
  ]}
>
  <section class="service-page">
    <GridBackground opacity={0.3} />
    <div class="container">
      <SectionHeader title="GESTIÓN DE BASES DE DATOS" badge="SERVICIO" />

      <DatabaseSlide />

      <div class="service-content">
        <section class="block">
          <h2>Qué resuelve</h2>
          <p>
            Un modelo de datos mal diseñado se nota tarde — cuando el sistema ya está en producción y cada consulta lenta o cada tabla sin normalizar cuesta caro cambiar. Diseñamos el modelo de datos pensando en el volumen y el patrón de acceso real de tu operación desde el principio.
          </p>
        </section>

        <section class="block">
          <h2>Cómo trabajamos</h2>
          <p>
            Trabajamos tanto con bases relacionales (PostgreSQL) como no relacionales (MongoDB, Redis) según lo que el caso de uso pida, con seguridad a nivel de datos cuando el sistema lo requiere (por ejemplo, Row Level Security en Supabase para control de acceso por rol) y funciones transaccionales para operaciones que no pueden quedar a mitad de camino.
          </p>
        </section>

        {relatedCases.length > 0 && (
          <section class="block">
            <h2>Casos de éxito relacionados</h2>
            <div class="related-grid">
              {relatedCases.map((entry) => <CaseStudyCard entry={entry} />)}
            </div>
          </section>
        )}

        <a href="/contacto" class="cta-link">Hablemos de tu proyecto →</a>
      </div>
    </div>
  </section>
</MainLayout>

<style>
  .service-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
  }

  .service-content {
    margin-top: 3rem;
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

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .cta-link {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.9rem 1.75rem;
    background: linear-gradient(135deg, var(--neon-purple), var(--neon-blue));
    border-radius: 4px;
    color: white;
    font-family: var(--font-mono);
    text-decoration: none;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .service-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 5: Verificar las 7 rutas de servicio**

Run: `npm run dev`
Navegar a las 7 rutas (`/servicios/desarrollo`, `/transformacion`, `/ia`, `/asesoria`, `/iot`, `/arquitectura`, `/database`) y confirmar 200 en todas. Volver a `/` (todavía sin rediseñar) y en `SolucionesTabCards` hacer clic en "Conocer más" de cada uno de los 7 tabs — confirmar que ninguno da 404 (arregla los enlaces rotos mencionados en el spec).

- [ ] **Step 6: Commit**

```bash
git add src/pages/servicios/asesoria.astro src/pages/servicios/iot.astro src/pages/servicios/arquitectura.astro src/pages/servicios/database.astro
git commit -m "feat: add remaining 4 service pages"
```

---

## Task 9: Página `/nosotros`

**Files:**
- Create: `src/pages/nosotros.astro`
- Modify: `src/pages/index.astro` (solo remover el import y la sección de `QuienesSomos`, `QueHacemos`, `MetodologiaTrabajo`, `PorQueElegirnos` — el resto de la reescritura de la home ocurre en Task 12, este paso solo evita que la misma sección quede duplicada en dos rutas al mismo tiempo)

**Interfaces:**
- Consumes: `QuienesSomos`, `QueHacemos`, `MetodologiaTrabajo`, `PorQueElegirnos` (componentes existentes en `src/components/`, sin cambios en su código interno).

- [ ] **Step 1: Crear `src/pages/nosotros.astro`**

```astro
---
// src/pages/nosotros.astro
import MainLayout from '../layouts/MainLayout.astro';
import QuienesSomos from '../components/QuienesSomos.astro';
import QueHacemos from '../components/QueHacemos.astro';
import MetodologiaTrabajo from '../components/MetodologiaTrabajo.astro';
import PorQueElegirnos from '../components/PorQueElegirnos.astro';
import { breadcrumbSchema } from '../lib/seo/breadcrumb';

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/nosotros' },
];
---

<MainLayout
  title="Nosotros | Transformia"
  description="Transformia es un equipo boutique especializado en inteligencia artificial aplicada y desarrollo de software a medida. Conocé quiénes somos, cómo trabajamos y por qué elegirnos."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <div class="nosotros-spacer"></div>
  <QuienesSomos />
  <QueHacemos />
  <MetodologiaTrabajo />
  <PorQueElegirnos />
</MainLayout>

<style>
  .nosotros-spacer {
    height: 5rem;
  }

  @media (max-width: 768px) {
    .nosotros-spacer {
      height: 3rem;
    }
  }
</style>
```

- [ ] **Step 2: Quitar `QuienesSomos`, `QueHacemos`, `MetodologiaTrabajo` y `PorQueElegirnos` de `src/pages/index.astro`**

En el frontmatter, eliminar estas líneas de import:

```astro
import QuienesSomos from '../components/QuienesSomos.astro';
import QueHacemos from '../components/QueHacemos.astro';
import MetodologiaTrabajo from '../components/MetodologiaTrabajo.astro';
import PorQueElegirnos from '../components/PorQueElegirnos.astro';
```

En el template, eliminar estos bloques:

```astro
  <section id="nosotros" class="section-anchor">
    <QuienesSomos />
  </section>

  <section id="servicios" class="section-anchor">
    <QueHacemos />
  </section>
```

y

```astro
  <section id="metodologia" class="section-anchor">
    <MetodologiaTrabajo />
  </section>

  <section id="porque-elegirnos" class="section-anchor">
    <PorQueElegirnos />
  </section>
```

No tocar nada más de `index.astro` en este paso — el resto de la reescritura (incluyendo el import/uso de `Soluciones` y el script de anclas) se hace completo en Task 12 para no editar el mismo archivo en pasos parciales inconsistentes. El archivo queda temporalmente con imports/secciones de `Hero`, `Soluciones` y `CallToAction` sin tocar todavía.

- [ ] **Step 3: Verificar**

Run: `npm run dev`
Navegar a `http://localhost:4321/nosotros` y confirmar que las 4 secciones (Quiénes Somos, Qué Hacemos, Metodología, Por Qué Elegirnos) se ven completas, con sus animaciones funcionando igual que antes en la home. Navegar a `/` y confirmar que esas 4 secciones ya no aparecen ahí (la página se ve incompleta/con huecos en este punto — es esperado, se termina de reordenar en Task 12).

- [ ] **Step 4: Commit**

```bash
git add src/pages/nosotros.astro src/pages/index.astro
git commit -m "feat: add /nosotros page, remove its sections from home"
```

---

## Task 10: Navbar con rutas reales

**Files:**
- Modify: `src/components/Navbar.astro`

**Interfaces:**
- Ninguna nueva — cambia únicamente el contenido de links y se elimina la función `highlightCurrentSection` (dependía de `section[id]` en la misma página, ya no aplica en un sitio multipágina).

- [ ] **Step 1: Reemplazar los links del menú desktop**

Buscar el bloque (dentro de `<ul class="menu-items">`):

```astro
            <li class="menu-item">
              <a href="/#nosotros" class="menu-link">
                <span class="link-number">01</span>
                <span class="link-text">Quiénes Somos</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/#servicios" class="menu-link">
                <span class="link-number">02</span>
                <span class="link-text">Qué Hacemos</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/#soluciones" class="menu-link">
                <span class="link-number">03</span>
                <span class="link-text">Soluciones</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/#metodologia" class="menu-link">
                <span class="link-number">04</span>
                <span class="link-text">Metodología</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/#porque-elegirnos" class="menu-link">
                <span class="link-number">05</span>
                <span class="link-text">Por Qué Elegirnos</span>
              </a>
            </li>
```

Reemplazar por:

```astro
            <li class="menu-item">
              <a href="/servicios" class="menu-link">
                <span class="link-number">01</span>
                <span class="link-text">Servicios</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/casos-de-exito" class="menu-link">
                <span class="link-number">02</span>
                <span class="link-text">Casos de Éxito</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/nosotros" class="menu-link">
                <span class="link-number">03</span>
                <span class="link-text">Nosotros</span>
              </a>
            </li>
            <li class="menu-item">
              <a href="/blog" class="menu-link">
                <span class="link-number">04</span>
                <span class="link-text">Blog</span>
              </a>
            </li>
```

- [ ] **Step 2: Reemplazar el botón de contacto del navbar desktop**

Buscar:

```astro
        <a href="/#contactanos" class="contact-button">
```

Reemplazar por:

```astro
        <a href="/contacto" class="contact-button">
```

- [ ] **Step 3: Reemplazar los links del menú móvil**

Buscar el bloque (dentro de `<ul class="mobile-menu-items">`):

```astro
      <li class="mobile-menu-item">
        <a href="/#nosotros" class="mobile-menu-link">
          <span class="link-number">01</span>
          <span class="link-text">Quiénes Somos</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/#servicios" class="mobile-menu-link">
          <span class="link-number">02</span>
          <span class="link-text">Qué Hacemos</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/#soluciones" class="mobile-menu-link">
          <span class="link-number">03</span>
          <span class="link-text">Soluciones</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/#metodologia" class="mobile-menu-link">
          <span class="link-number">04</span>
          <span class="link-text">Metodología</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/#porque-elegirnos" class="mobile-menu-link">
          <span class="link-number">05</span>
          <span class="link-text">Por Qué Elegirnos</span>
        </a>
      </li>
```

Reemplazar por:

```astro
      <li class="mobile-menu-item">
        <a href="/servicios" class="mobile-menu-link">
          <span class="link-number">01</span>
          <span class="link-text">Servicios</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/casos-de-exito" class="mobile-menu-link">
          <span class="link-number">02</span>
          <span class="link-text">Casos de Éxito</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/nosotros" class="mobile-menu-link">
          <span class="link-number">03</span>
          <span class="link-text">Nosotros</span>
        </a>
      </li>
      <li class="mobile-menu-item">
        <a href="/blog" class="mobile-menu-link">
          <span class="link-number">04</span>
          <span class="link-text">Blog</span>
        </a>
      </li>
```

- [ ] **Step 4: Reemplazar el botón de contacto del menú móvil**

Buscar:

```astro
      <a href="/#contactanos" class="mobile-contact-button">CONTACTAR AHORA</a>
```

Reemplazar por:

```astro
      <a href="/contacto" class="mobile-contact-button">CONTACTAR AHORA</a>
```

- [ ] **Step 5: Eliminar la lógica de scroll-spy del script**

Dentro del `<script>` al final del archivo, buscar y eliminar por completo este bloque (ya no aplica: dependía de `section[id]` presentes en la misma página, y ahora el menú apunta a rutas distintas):

```astro
    // Efecto de línea activa al hacer scroll
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.menu-link');

    function highlightCurrentSection() {
      const scrollY = window.scrollY;

      sections.forEach(section => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop - 200;
        const sectionHeight = sectionElement.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `/#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightCurrentSection);

    // Inicializar el resaltado de la sección actual
    highlightCurrentSection();
```

El `<script>` debe seguir teniendo el resto de la lógica intacta: `handleScroll` (efecto de blur al hacer scroll) y toda la funcionalidad del menú móvil (abrir/cerrar, cerrar al hacer clic fuera o en un link).

- [ ] **Step 6: Verificar en el navegador**

Run: `npm run dev`
En cualquier página, abrir el navbar desktop y confirmar que "Servicios", "Casos de Éxito", "Nosotros" y "Blog" navegan a sus rutas reales. Achicar a 375px, abrir el menú móvil y confirmar los mismos 4 links más el botón "CONTACTAR AHORA", y que el menú se sigue abriendo/cerrando correctamente.

- [ ] **Step 7: Commit**

```bash
git add src/components/Navbar.astro
git commit -m "feat: replace navbar anchor links with real routes"
```

---

## Task 11: Footer con columnas de enlaces

**Files:**
- Modify: `src/components/Footer.astro`

**Interfaces:**
- Ninguna nueva — agrega una tercera columna al grid existente (`.footer-content` pasa de 2 a 3 columnas en desktop).

- [ ] **Step 1: Ampliar el grid de 2 a 3 columnas**

Buscar en el `<style>`:

```css
  .footer-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-bottom: 3rem;
  }
```

Reemplazar por:

```css
  .footer-content {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  .footer-links-column {
    display: flex;
    flex-direction: column;
  }

  .footer-links-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .footer-links-list a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-family: var(--font-body);
    font-size: 0.95rem;
    transition: color 0.3s ease;
  }

  .footer-links-list a:hover {
    color: var(--neon-purple);
  }
```

- [ ] **Step 2: Agregar la nueva columna de enlaces al markup**

Buscar en el template (justo antes de `<!-- Columna de contacto -->`):

```astro
      <!-- Columna de contacto -->
```

Insertar antes de esa línea:

```astro
      <!-- Columna de enlaces -->
      <div class="footer-links-column">
        <h3 class="footer-title">Servicios</h3>
        <ul class="footer-links-list">
          <li><a href="/servicios/desarrollo">Desarrollo de Software</a></li>
          <li><a href="/servicios/ia">Inteligencia Artificial</a></li>
          <li><a href="/servicios/transformacion">Transformación Digital</a></li>
          <li><a href="/servicios">Ver todos los servicios →</a></li>
        </ul>
      </div>

      <!-- Columna de contacto -->
```

- [ ] **Step 3: Ajustar la media query de 992px para 3 columnas**

Buscar:

```css
  @media (max-width: 992px) {
    .footer-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }
```

Esta regla ya colapsa a 1 columna en tablet/mobile — sigue funcionando igual con 3 columnas de origen, no necesita cambios.

- [ ] **Step 4: Agregar enlaces a Casos de Éxito y Blog en la barra legal**

Buscar:

```astro
      <div class="footer-legal">
        <a href="/privacidad" class="legal-link">Política de Privacidad</a>
        <a href="/terminos" class="legal-link">Términos de Uso</a>
      </div>
```

Reemplazar por:

```astro
      <div class="footer-legal">
        <a href="/casos-de-exito" class="legal-link">Casos de Éxito</a>
        <a href="/blog" class="legal-link">Blog</a>
        <a href="/privacidad" class="legal-link">Política de Privacidad</a>
        <a href="/terminos" class="legal-link">Términos de Uso</a>
      </div>
```

- [ ] **Step 5: Verificar en el navegador**

Run: `npm run dev`
En desktop, confirmar que el footer muestra 3 columnas (logo/social, servicios, contacto) y que los links de servicios navegan correctamente. En 375px, confirmar que las 3 columnas colapsan a una sola sin overflow horizontal.

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add services link column to footer"
```

---

## Task 12: Reescribir la home con teasers

**Files:**
- Create: `src/components/home/ServiciosTeaser.astro`
- Create: `src/components/home/CasosDeExitoTeaser.astro`
- Create: `src/components/home/PorQueElegirnosTeaser.astro`
- Create: `src/components/home/BlogTeaser.astro`
- Modify: `src/pages/index.astro`
- Delete: `src/components/Soluciones.astro` (queda sin uso una vez que `index.astro` deja de importarlo — se reemplaza por `ServiciosTeaser`, que reutiliza `SolucionesTabCards` directamente)

**Interfaces:**
- Consumes: `SolucionesTabCards` (existente, sin cambios), `CaseStudyCard`/`BlogPostCard` (Tasks 5 y 6), `getCollection` de `astro:content`.

- [ ] **Step 1: Crear `src/components/home/ServiciosTeaser.astro`**

```astro
---
// src/components/home/ServiciosTeaser.astro
import SectionHeader from '../ui/SectionHeader.astro';
import GridBackground from '../ui/GridBackground.astro';
import SolucionesTabCards from '../SolucionesComponents/SolucionesTabCards.astro';
---

<section class="servicios-teaser">
  <GridBackground opacity={0.3} perspective />
  <div class="container">
    <SectionHeader
      title="QUÉ HACEMOS"
      badge="ALTA TECNOLOGÍA"
      subtitle="Siete líneas de trabajo, un mismo equipo boutique especializado en inteligencia artificial aplicada."
    />
    <div class="tab-cards-wrapper">
      <SolucionesTabCards />
    </div>
    <a href="/servicios" class="teaser-cta">Ver todos los servicios →</a>
  </div>
</section>

<style>
  .servicios-teaser {
    position: relative;
    width: 100%;
    background-color: var(--dark-bg);
    color: white;
    padding: 6rem 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .container {
    width: 100%;
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tab-cards-wrapper {
    width: 100%;
    max-width: 1100px;
    margin-top: 2rem;
  }

  .teaser-cta {
    margin-top: 3rem;
    color: var(--neon-purple);
    font-family: var(--font-mono);
    text-decoration: none;
    font-size: 1rem;
  }

  .teaser-cta:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .servicios-teaser {
      padding: 4rem 0;
    }
  }
</style>
```

- [ ] **Step 2: Crear `src/components/home/CasosDeExitoTeaser.astro`**

```astro
---
// src/components/home/CasosDeExitoTeaser.astro
import { getCollection } from 'astro:content';
import SectionHeader from '../ui/SectionHeader.astro';
import GridBackground from '../ui/GridBackground.astro';
import CaseStudyCard from '../CaseStudyCard.astro';

const featured = (await getCollection('casos-de-exito', ({ data }) => data.featured)).slice(0, 3);
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
      {featured.map((entry) => <CaseStudyCard entry={entry} />)}
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

- [ ] **Step 3: Crear `src/components/home/PorQueElegirnosTeaser.astro`**

```astro
---
// src/components/home/PorQueElegirnosTeaser.astro
import SectionHeader from '../ui/SectionHeader.astro';
import GlowOrbs from '../ui/GlowOrbs.astro';

const diferenciadores = [
  { title: 'Especialización en IA', text: 'No agregamos IA como feature — la aplicamos donde hay un cuello de botella operativo real que justifica automatizarlo.' },
  { title: 'Equipo boutique', text: 'Sin capas de gestión innecesarias entre vos y quien construye tu sistema. Decisiones rápidas, entregas rápidas.' },
  { title: 'Arquitectura antes que código', text: 'Modelamos el problema antes de escribir producción, para no pagar deuda técnica evitable más adelante.' },
];
---

<section class="porque-teaser">
  <GlowOrbs count={2} />
  <div class="container">
    <SectionHeader
      title="POR QUÉ ELEGIRNOS"
      subtitle="En Transformia llevamos tus ideas al siguiente nivel, con soluciones tecnológicas que marcan la diferencia en un mercado en constante evolución."
    />
    <div class="diferenciadores-grid">
      {diferenciadores.map((d) => (
        <div class="diferenciador-card">
          <h3>{d.title}</h3>
          <p>{d.text}</p>
        </div>
      ))}
    </div>
    <a href="/nosotros" class="teaser-cta">Conocer más sobre nosotros →</a>
  </div>
</section>

<style>
  .porque-teaser {
    position: relative;
    width: 100%;
    background-color: var(--dark-bg);
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

  .diferenciadores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.75rem;
    width: 100%;
    margin-top: 1rem;
  }

  .diferenciador-card {
    padding: 1.75rem;
    background: rgba(26, 20, 45, 0.6);
    border: 1px solid rgba(var(--neon-purple-rgb), 0.25);
    border-radius: var(--radius-card);
    text-align: center;
  }

  .diferenciador-card h3 {
    font-family: var(--font-body);
    color: var(--neon-purple);
    font-size: 1.15rem;
    margin-bottom: 0.75rem;
  }

  .diferenciador-card p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    font-size: 0.95rem;
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
    .porque-teaser {
      padding: 4rem 0;
    }
  }
</style>
```

- [ ] **Step 4: Crear `src/components/home/BlogTeaser.astro`**

```astro
---
// src/components/home/BlogTeaser.astro
import { getCollection } from 'astro:content';
import SectionHeader from '../ui/SectionHeader.astro';
import GridBackground from '../ui/GridBackground.astro';
import BlogPostCard from '../BlogPostCard.astro';

const latest = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);
---

{latest.length > 0 && (
  <section class="blog-teaser">
    <GridBackground opacity={0.25} />
    <div class="container">
      <SectionHeader
        title="DEL BLOG"
        subtitle="Ideas y aprendizajes de proyectos reales de desarrollo de software e inteligencia artificial aplicada."
      />
      <div class="posts-grid">
        {latest.map((entry) => <BlogPostCard entry={entry} />)}
      </div>
      <a href="/blog" class="teaser-cta">Ver todos los artículos →</a>
    </div>
  </section>
)}

<style>
  .blog-teaser {
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

  .posts-grid {
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
    .blog-teaser {
      padding: 4rem 0;
    }
  }
</style>
```

- [ ] **Step 5: Reescribir `src/pages/index.astro` por completo**

```astro
---
import Layout from '../layouts/MainLayout.astro';
import Hero from '../components/Hero.astro';
import ServiciosTeaser from '../components/home/ServiciosTeaser.astro';
import CasosDeExitoTeaser from '../components/home/CasosDeExitoTeaser.astro';
import PorQueElegirnosTeaser from '../components/home/PorQueElegirnosTeaser.astro';
import BlogTeaser from '../components/home/BlogTeaser.astro';
import CallToAction from '../components/CallToAction.astro';
import { organizationSchema } from '../lib/seo/organization';
---

<Layout
  title="Transformia - Software a medida e Inteligencia Artificial aplicada"
  description="Transformia diseña y desarrolla software a medida para empresas en LatAm, con especialización en inteligencia artificial aplicada y un equipo boutique enfocado en velocidad de entrega."
  jsonLd={[organizationSchema()]}
>
  <Hero />
  <ServiciosTeaser />
  <CasosDeExitoTeaser />
  <PorQueElegirnosTeaser />
  <BlogTeaser />

  <section id="contactanos">
    <CallToAction />
  </section>
</Layout>
```

Nota: `jsonLd={[organizationSchema()]}` queda duplicado porque `MainLayout` ya lo agrega siempre (Task 1) — no pasa nada por la duplicación funcional en `<script type="application/ld+json">` (Google tolera múltiples bloques del mismo tipo), pero para no repetirlo sin necesidad, quitar esa línea: la home no necesita pasar `jsonLd` en absoluto. Dejar simplemente:

```astro
<Layout
  title="Transformia - Software a medida e Inteligencia Artificial aplicada"
  description="Transformia diseña y desarrolla software a medida para empresas en LatAm, con especialización en inteligencia artificial aplicada y un equipo boutique enfocado en velocidad de entrega."
>
```

(sin el import de `organizationSchema` tampoco, ya que no se usa en ningún otro lado del archivo).

- [ ] **Step 6: Confirmar que nada más importa `Soluciones.astro` y borrarlo**

Run: `grep -rn "Soluciones.astro\|from '.*Soluciones'" src/ --include="*.astro" | grep -v SolucionesComponents`
Expected: sin resultados (index.astro ya no lo importa desde Step 5).

Run: `rm "src/components/Soluciones.astro"`

- [ ] **Step 7: Verificar el build completo**

Run: `npm run build`
Expected: build termina sin errores. Este es el primer build limpio del plan — confirma que `index.astro`, `privacidad.astro` (todavía pendiente, ver Task 13) y `terminos.astro` (ídem) ya no rompen... si `privacidad.astro`/`terminos.astro` siguen sin `description`, el build **debe seguir fallando únicamente por esos dos archivos** en este punto; se resuelve en la Task 13 inmediatamente siguiente.

- [ ] **Step 8: Verificar visualmente**

Run: `npm run dev`
En `http://localhost:4321/`, recorrer de arriba a abajo: Hero → teaser de servicios (con los 7 tabs funcionando) → teaser de casos de éxito (3 tarjetas) → teaser de por qué elegirnos → teaser de blog (2 posts) → CallToAction. Confirmar que todos los CTA de "ver más" navegan a la página correspondiente. Repetir en 375px.

- [ ] **Step 9: Commit**

```bash
git add src/components/home src/pages/index.astro
git rm src/components/Soluciones.astro
git commit -m "feat: rewrite home as teaser landing, remove unused Soluciones wrapper"
```

---

## Task 13: Contenido legal real para `/privacidad` y `/terminos`

**Files:**
- Modify: `src/pages/privacidad.astro`
- Modify: `src/pages/terminos.astro`
- Delete: `src/components/ui/LegalPagePlaceholder.astro` (sin más usos una vez reescritas ambas páginas)

**Interfaces:**
- Ninguna — páginas terminales, no consumidas por otras.

- [ ] **Step 1: Reescribir `src/pages/privacidad.astro`**

```astro
---
// src/pages/privacidad.astro
import MainLayout from '../layouts/MainLayout.astro';
import GridBackground from '../components/ui/GridBackground.astro';
import { breadcrumbSchema } from '../lib/seo/breadcrumb';

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Política de Privacidad', path: '/privacidad' },
];
---

<MainLayout
  title="Política de Privacidad | Transformia"
  description="Cómo Transformia recolecta, usa y protege los datos personales de quienes usan este sitio o contratan nuestros servicios, conforme a la Ley 1581 de 2012 de Colombia."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <section class="legal-page">
    <GridBackground opacity={0.2} />
    <div class="container">
      <h1>Política de Privacidad</h1>
      <p class="legal-updated">Última actualización: agosto de 2026</p>

      <p>
        Transformia ("nosotros") respeta tu privacidad y se compromete a proteger los datos personales que recolectamos a través de este sitio web y de la prestación de nuestros servicios, en cumplimiento de la Ley 1581 de 2012 de Colombia (Régimen General de Protección de Datos Personales) y sus decretos reglamentarios.
      </p>

      <h2>Qué datos recolectamos</h2>
      <p>
        Recolectamos los datos que nos proporcionás voluntariamente al contactarnos por el formulario de <a href="/contacto">contacto</a>, por correo o por teléfono: nombre, correo electrónico, teléfono y la información del proyecto que nos compartas. No recolectamos datos sensibles ni datos de menores de edad a través de este sitio.
      </p>

      <h2>Para qué usamos tus datos</h2>
      <p>
        Usamos tus datos exclusivamente para responder tu consulta, elaborar propuestas o cotizaciones, y dar seguimiento a proyectos en curso. No vendemos ni compartimos tus datos con terceros con fines comerciales.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Como titular de tus datos, tenés derecho a conocer, actualizar, rectificar y solicitar la eliminación de la información que Transformia tenga sobre vos, así como a revocar tu autorización en cualquier momento. Para ejercer estos derechos, escribinos a <a href="mailto:transformia.desarrollo@gmail.com">transformia.desarrollo@gmail.com</a>.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tenés preguntas sobre esta política, escribinos a <a href="mailto:transformia.desarrollo@gmail.com">transformia.desarrollo@gmail.com</a> o llamanos al <a href="tel:+573212596437">+57 321 259 6437</a>.
      </p>

      <p class="legal-disclaimer">
        Este documento es un borrador base y no reemplaza una revisión legal profesional antes de considerarse la política definitiva de la empresa.
      </p>

      <a href="/" class="legal-back">Volver al inicio</a>
    </div>
  </section>
</MainLayout>

<style>
  .legal-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 720px;
    margin: 0 auto;
  }

  .container h1 {
    font-family: var(--font-body);
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  .legal-updated {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 2rem;
  }

  .container h2 {
    font-family: var(--font-body);
    color: var(--neon-purple);
    font-size: 1.3rem;
    margin: 2rem 0 0.75rem;
  }

  .container p {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .container a {
    color: var(--neon-blue);
  }

  .legal-disclaimer {
    margin-top: 2.5rem;
    padding: 1rem 1.25rem;
    border: 1px solid rgba(var(--neon-yellow-rgb), 0.4);
    border-radius: 6px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .legal-back {
    display: inline-block;
    margin-top: 2rem;
    padding: 0.65rem 1.5rem;
    border: 1px solid var(--neon-purple);
    border-radius: 4px;
    text-decoration: none;
    color: white;
    font-family: var(--font-mono);
  }

  @media (max-width: 768px) {
    .legal-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 2: Reescribir `src/pages/terminos.astro`**

```astro
---
// src/pages/terminos.astro
import MainLayout from '../layouts/MainLayout.astro';
import GridBackground from '../components/ui/GridBackground.astro';
import { breadcrumbSchema } from '../lib/seo/breadcrumb';

const breadcrumbItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Términos de Uso', path: '/terminos' },
];
---

<MainLayout
  title="Términos de Uso | Transformia"
  description="Condiciones de uso de este sitio y de los servicios de desarrollo de software y consultoría en tecnología ofrecidos por Transformia."
  jsonLd={[breadcrumbSchema(breadcrumbItems, Astro.site!)]}
>
  <section class="legal-page">
    <GridBackground opacity={0.2} />
    <div class="container">
      <h1>Términos de Uso</h1>
      <p class="legal-updated">Última actualización: agosto de 2026</p>

      <p>
        Estos términos regulan el uso de este sitio web y la relación entre Transformia y quienes lo visitan o contratan nuestros servicios de desarrollo de software, transformación digital, inteligencia artificial aplicada, asesoría técnica, IoT, arquitectura de software y bases de datos.
      </p>

      <h2>Uso del sitio</h2>
      <p>
        El contenido de este sitio (textos, diseño, código visible en el navegador) es propiedad de Transformia salvo que se indique lo contrario. Podés navegarlo y compartirlo, pero no reproducirlo comercialmente sin autorización previa.
      </p>

      <h2>Servicios y cotizaciones</h2>
      <p>
        La información publicada en este sitio sobre servicios, metodología y casos de éxito tiene fines informativos. El alcance, tiempos y costos concretos de cada proyecto se definen en una propuesta o cotización individual, no en este sitio.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        Transformia no garantiza que el sitio esté libre de errores en todo momento y no se hace responsable por decisiones tomadas únicamente con base en el contenido publicado aquí, sin una conversación o propuesta formal de por medio.
      </p>

      <h2>Contacto</h2>
      <p>
        Para consultas sobre estos términos, escribinos a <a href="mailto:transformia.desarrollo@gmail.com">transformia.desarrollo@gmail.com</a> o llamanos al <a href="tel:+573212596437">+57 321 259 6437</a>.
      </p>

      <p class="legal-disclaimer">
        Este documento es un borrador base y no reemplaza una revisión legal profesional antes de considerarse la versión definitiva de los términos.
      </p>

      <a href="/" class="legal-back">Volver al inicio</a>
    </div>
  </section>
</MainLayout>

<style>
  .legal-page {
    position: relative;
    padding: 10rem 0 6rem;
    color: white;
  }

  .container {
    position: relative;
    z-index: 10;
    width: 90%;
    max-width: 720px;
    margin: 0 auto;
  }

  .container h1 {
    font-family: var(--font-body);
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  .legal-updated {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 2rem;
  }

  .container h2 {
    font-family: var(--font-body);
    color: var(--neon-purple);
    font-size: 1.3rem;
    margin: 2rem 0 0.75rem;
  }

  .container p {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .container a {
    color: var(--neon-blue);
  }

  .legal-disclaimer {
    margin-top: 2.5rem;
    padding: 1rem 1.25rem;
    border: 1px solid rgba(var(--neon-yellow-rgb), 0.4);
    border-radius: 6px;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .legal-back {
    display: inline-block;
    margin-top: 2rem;
    padding: 0.65rem 1.5rem;
    border: 1px solid var(--neon-purple);
    border-radius: 4px;
    text-decoration: none;
    color: white;
    font-family: var(--font-mono);
  }

  @media (max-width: 768px) {
    .legal-page {
      padding: 8rem 0 4rem;
    }
  }
</style>
```

- [ ] **Step 3: Confirmar que `LegalPagePlaceholder` ya no se usa y borrarlo**

Run: `grep -rn "LegalPagePlaceholder" "src/"`
Expected: sin resultados (ambas páginas ya no lo importan después de los Steps 1-2).

Run: `rm "src/components/ui/LegalPagePlaceholder.astro"`

- [ ] **Step 4: Verificar el build completo del sitio**

Run: `npm run build`
Expected: build termina sin errores. Este es el primer build 100% limpio del plan — confirma que todas las páginas (`index`, `nosotros`, `servicios/*`, `casos-de-exito/*`, `blog/*`, `contacto`, `cotizacion`, `privacidad`, `terminos`) compilan.

- [ ] **Step 5: Verificar en el navegador**

Run: `npm run dev`
Navegar a `/privacidad` y `/terminos`, confirmar que el contenido real se ve (no el placeholder de "contenido en preparación"), que los links del footer siguen apuntando correctamente, y que el botón "Volver al inicio" funciona.

- [ ] **Step 6: Commit**

```bash
git add src/pages/privacidad.astro src/pages/terminos.astro
git rm src/components/ui/LegalPagePlaceholder.astro
git commit -m "feat: replace legal page placeholders with real baseline content"
```

---

## Task 14: QA de sitio completo

**Files:**
- No se crean ni modifican archivos de producto (solo verificación; si aparecen bugs, se corrigen en el archivo correspondiente y se documenta cuál en el commit).

**Interfaces:**
- Consumes: todo lo construido en Tasks 1-13.

- [ ] **Step 1: Build de producción**

Run: `npm run build`
Expected: build termina sin errores ni warnings de Astro/TypeScript.

- [ ] **Step 2: Verificar sitemap y robots**

Run: `npm run preview` (en otra terminal, o después de detener `dev`)
Navegar a `http://localhost:4321/sitemap-index.xml` y confirmar que existe y lista un sitemap hijo. Abrir ese sitemap hijo y confirmar que incluye `/`, `/servicios`, las 7 rutas de servicio, `/casos-de-exito` y sus 6 detalle, `/blog` y sus 2 posts, `/nosotros`, `/contacto`, `/privacidad`, `/terminos` — y que **no** incluye `/cotizacion`. Navegar a `http://localhost:4321/robots.txt` y confirmar el contenido esperado.

- [ ] **Step 3: Recorrido completo en desktop**

Run: `npm run dev`
Recorrer en orden: `/` (Hero → 4 teasers → CallToAction, todos los CTA funcionando) → `/servicios` → cada una de las 7 páginas de servicio → `/casos-de-exito` → cada uno de los 6 casos (confirmar que `tracing-b4` muestra el badge de propuesta) → `/nosotros` (4 secciones completas) → `/blog` → cada uno de los 2 posts → `/contacto` → `/privacidad` → `/terminos`. Confirmar navbar y footer consistentes en todas.

- [ ] **Step 4: Recorrido completo en mobile (375px)**

Repetir el Step 3 en viewport 375px. Confirmar: menú móvil funcional en todas las páginas, sin overflow horizontal en ninguna, texto legible sin zoom.

- [ ] **Step 5: Verificar JSON-LD**

Para `/`, una página de servicio (`/servicios/ia`), un caso de éxito (`/casos-de-exito/tesla-gps`) y un post de blog, ver el código fuente (`curl -s http://localhost:4321/servicios/ia | grep -A2 'application/ld+json'` o DevTools) y confirmar que cada una tiene al menos el bloque `Organization` (heredado de `MainLayout`) más el bloque específico de esa página (`BreadcrumbList`, y `Service`/`Article` según corresponda). Pegar el HTML de al menos una página de cada tipo en el [Rich Results Test](https://search.google.com/test/rich-results) de Google y confirmar que no reporta errores de sintaxis en el JSON-LD.

- [ ] **Step 6: Revisar consola del navegador**

Con devtools abierto, recorrer todas las páginas y confirmar 0 errores en consola. Corregir cualquier `console.error` de scripts rotos antes de dar la tarea por completa.

- [ ] **Step 7: Verificar que no quedan links internos rotos**

Run: `grep -rn 'href="/' src/components src/pages src/layouts --include="*.astro" | grep -oE 'href="/[a-zA-Z0-9/_-]*"' | sort -u`
Para cada ruta interna listada, confirmar que corresponde a una página real del sitio (estática o generada por `getStaticPaths`) o a un ancla dentro de la misma página (`#contactanos` en la home). Cualquier ruta que no corresponda a nada se corrige antes de cerrar la tarea.

- [ ] **Step 8: Commit final (solo si Steps 3-7 requirieron fixes)**

```bash
git add -A
git commit -m "fix: address issues found in full-site SEO and architecture QA pass"
```

Si no hubo fixes que commitear, esta tarea termina en el Step 7 sin commit adicional.

---

## Self-Review (completado por quien escribió el plan)

- **Cobertura del spec**: infraestructura SEO (site, sitemap, SEO.astro, JSON-LD, robots.txt) → Task 1; SEO en páginas simples existentes → Task 2; imagen OG → Task 3; content collections → Task 4; casos de éxito completos (contenido real de `docs/transformia-projects-context.md`, incluyendo `tracing-b4` marcado como propuesta) → Task 5; blog → Task 6; las 7 páginas de servicio con los slugs ya referenciados en el código → Tasks 7-8; `/nosotros` → Task 9; navegación real en Navbar/Footer → Tasks 10-11; home como landing de teasers → Task 12; contenido legal real → Task 13; verificación de sitio completo → Task 14. Todo el spec de 2026-08-04 está cubierto. Fuera de alcance del spec (OG dinámica, i18n, LocalBusiness, backend de contacto, volumen real de blog, revisión legal profesional) no se tocan en ninguna tarea.
- **Placeholders**: sin TBD/TODO; cada step de código tiene contenido final (copy real, valores de color exactos, slugs exactos).
- **Consistencia de tipos/nombres**: `organizationSchema()`, `breadcrumbSchema(items, site)`, `serviceSchema({name, description, url})`, `articleSchema({title, description, pubDate, updatedDate?, url, image})` se usan con la misma firma en todas las tareas que los consumen (2, 5, 6, 7, 8, 9, 12, 13). `MainLayout` Props `{title, description, image?, type?, noindex?, jsonLd?}` se respeta en todas las páginas que lo usan desde Task 1 en adelante. `CollectionEntry<'casos-de-exito'>` y `CollectionEntry<'blog'>` (con `entry.id` como slug, vía `render(entry)` para el body) se usan consistentemente en Tasks 5, 6, 7, 8, 12. `<CaseStudyCard entry={...}>` y `<BlogPostCard entry={...}>` mantienen la misma prop en las 3 tareas que los consumen (5/6 donde se definen, 7/8 donde se usan para "casos relacionados", 12 en los teasers de home).
