# transformia.dev

Sitio de Transformia Zomac SAS. Astro 5 estático, CSS con tokens propios y GSAP para el movimiento.

## Comandos

| Comando | Acción |
| :-- | :-- |
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor local en `localhost:4321` |
| `npm run build` | Genera el sitio en `./dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run generate:og` | Regenera `public/og-default.jpg` |

## Dónde está cada cosa

- `src/data/` — **fuente de verdad del contenido**: `site.ts` (contacto, eslogan, navegación), `servicios.ts`, `casosDeExito.ts`, `productos.ts`. Cambiar un teléfono o agregar un servicio se hace aquí, no en los componentes.
- `src/styles/tokens.css` — color, tipografía, espaciado y movimiento. No declarar colores hexadecimales en componentes.
- `src/styles/base.css` — reset, utilidades (`.btn`, `.eyebrow`, `.spot`, `.prose`, `.blueprint`).
- `src/scripts/motion.ts` — motor de animación global por atributos `data-*` (`data-reveal`, `data-split`, `data-count`, `data-magnetic`, `data-spotlight`, `data-rotate`).
- `src/pages/servicios/[slug].astro` — una sola plantilla para los 7 servicios.
- `src/layouts/CaseStudyLayout.astro` — plantilla de casos; slots `solucion-extra` y `evidencia` para casos con material propio.

## Reglas

- El sitio habla siempre como empresa ("nosotros"); no se publican perfiles personales.
- Un caso con `publicado: false` en `casosDeExito.ts` sale de todas las listas. Tesla GPS está así hasta su entrega; para publicarlo, cambia el flag y renombra `src/pages/casos-de-exito/_tesla-gps.astro` quitando el guion bajo.
- Todo el contenido debe verse sin JS y con `prefers-reduced-motion`. Para revisarlo sin animaciones, abre cualquier página con `?sinmovimiento`.
