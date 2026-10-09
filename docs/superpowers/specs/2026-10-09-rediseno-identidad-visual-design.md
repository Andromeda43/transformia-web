# Rediseño de identidad visual de transformia-web: dirección "software en operación"

**Fecha:** 2026-10-09 (revisado el mismo día)
**Estado:** Implementado el 2026-10-09 (ver "Decisiones tomadas" al final)

## Contexto

Transformia Zomac SAS es una consultora independiente de software e IA en Colombia. **Construye cualquier tipo de software a la medida**:

- plataformas web multirol
- apps móviles
- bots y automatizaciones
- IA aplicada
- integraciones con sistemas y con hardware
- bases de datos y tableros
- sitios web

Su especialidad son los **sistemas de trazabilidad**, pero no la define: es una fortaleza entre varias.

El portafolio real muestra esa amplitud:

| Tipo de software | Proyecto |
|---|---|
| Plataforma web multirol | Tesla GPS: órdenes de servicio, clientes, vehículos, 5 roles |
| App móvil / marketplace | FeriaApp: chat en tiempo real, dos roles |
| Bot de WhatsApp con validación automática | Vera: comprobantes Bre-B en menos de 10 s |
| Trazabilidad industrial | Frigorinoquia y Colombina |
| Automatización y analítica | Transcarga: Apps Script, Sheets, Looker Studio |
| Sitios web con animación | Portafolio Interlink: 6 sitios |

A quién le habla el sitio: gerentes y dueños de empresas medianas y PYMES, de cualquier sector, que tienen un proceso que no funciona bien (Excel, papel, sistemas que no se hablan, trabajo manual repetitivo). No son técnicos. Buscan evidencia de que lo que se construye funciona, una respuesta rápida y un precio claro.

**Regla de marca:** el sitio habla siempre como **empresa** ("nosotros", "el equipo de Transformia"). Ninguna persona aparece con nombre, foto ni biografía en ninguna página.

El sitio actual (Astro 5, CSS escrito dentro de cada componente, GSAP) usa una estética **synthwave/cyberpunk**: morado neón con resplandor, cuadrícula retro animada, título con glitch, scanlines, partículas y un CTA que imita una terminal ("SISTEMA: ACTIVO"). Se ve como una plantilla de agencia o de un proyecto gamer, no como una empresa que pone software serio en operación.

## Diagnóstico (verificado en el código y en el navegador)

### Marca y contenido

- **El hero muestra datos inventados de marketing.** El panel [RealtimeDashboard.astro](../../../src/components/HeroComponents/RealtimeDashboard.astro) tiene SEO/SEM/Social/Email, "+54%" y "$13.2K". Contradice la regla del spec de SEO ("no hay que inventar nada") y no muestra nada de lo que Transformia construye de verdad.
- **No hay logo.** [public/favicon.svg](../../../public/favicon.svg) es el logo por defecto de Astro, y el H1 del hero repite "TRANSFORMIA" justo debajo del wordmark del navbar.
- **No se ve la amplitud del portafolio.** Vera y Transcarga no aparecen, FeriaApp figura como caso de cliente cuando es producto propio, y los casos del home son casi solo texto, así que no se nota la variedad (web, móvil, bots, IA, trazabilidad).
- **El tono no coincide con el de las propuestas.** Las propuestas comerciales son cálidas y narrativas (dolor → solución → entregables → resultado). El sitio a ratos es frío y de "terminal".

### Errores que hay que corregir antes del rediseño

| Problema | Dónde |
|---|---|
| El teléfono y el correo publicados son viejos (+57 321 259 6437, transformia.desarrollo@gmail.com). Los oficiales son +57 300 823 4881 e info@transformia.dev | `Navbar`, `Footer`, `ContactoForm`, `privacidad`, `terminos`, `lib/seo/organization.ts` |
| La política de datos (Ley 1581) no identifica al responsable del tratamiento por razón social y NIT | [privacidad.astro](../../../src/pages/privacidad.astro) |
| Hay voseo ("tenés", "escribinos", "entre vos") mezclado con tuteo | `privacidad`, `terminos`, `PorQueElegirnosTeaser`, post `como-elegir-desarrollo-a-medida-vs-saas.md` |
| `MainLayout` enlaza `/styles/global.css`, que da **404** | [MainLayout.astro:44](../../../src/layouts/MainLayout.astro:44) |
| Hay CSS que nadie importa: `global.css`, `hero.css`, `herobuttons.css`, `hero-decorations.css`, `markdown-quotation-styles.css` y el layout `Layout.astro` | `src/styles/`, `src/layouts/` |
| Tailwind está instalado y configurado, pero nunca se importa `@import "tailwindcss"`, así que no genera ninguna utilidad | `tailwind.config.js`, `astro.config.mjs` |
| La cotización de ejemplo tiene correos ficticios `@transformia.com` y un nombre de persona inventado | `src/cotizaciones/ejemplo-cliente.md` |

### Sistema visual

- **Los tokens no se respetan.** `tokens.css` dice ser la "única fuente de verdad", pero en el código hay unos 30 colores hexadecimales escritos a mano; por ejemplo, el verde `#4aef9e` aparece 16 veces y no está en los tokens.
- **No hay escala tipográfica.** Hay más de 20 tamaños de letra y textos en Space Mono de 0.6–0.7rem que se leen mal. Las fuentes se cargan desde Google Fonts aunque `@fontsource` ya es una dependencia.
- **Hay demasiado movimiento.** Cuento 165 `@keyframes`, 63 `text-shadow` y animaciones infinitas en casi todas las secciones. Solo 6 archivos respetan `prefers-reduced-motion`; el Hero, `SectionHeader` y el CTA no. Parte del contenido arranca en `opacity: 0` y depende de GSAP para aparecer.
- **Todas las secciones se ven iguales.** Siempre pastilla + título en MAYÚSCULAS + línea pulsante + subtítulo centrado, y todas las tarjetas son idénticas.

## Dirección: "software en operación"

Se mantiene el modo oscuro y una identidad técnica, pero la referencia deja de ser el synthwave y pasa a ser **producto real funcionando**: pantallas de sistemas en uso, flujos de datos entre sistemas y estados en vivo. Es sobrio, preciso y basado en evidencia. El visual no se ata a ningún sector ni a ningún dispositivo: muestra que Transformia construye lo que una operación necesite, sea web, móvil, bot, IA o integración.

### Principios

1. **Evidencia antes que decoración.** Cada visual muestra algo real: una captura, un flujo o una cifra verificable. Es la misma lógica de las propuestas (dolor → solución → resultado).
2. **Amplitud con foco.** Se muestra la variedad de lo que se construye, y la trazabilidad aparece como especialidad destacada, no como el todo.
3. **Precisión técnica.** Los datos van en mono y los estados son explícitos (en operación, en entrega, propuesta).
4. **Voz de empresa, cercana.** Español colombiano, tuteando, cálido y directo, con WhatsApp siempre visible. Siempre "nosotros" y nunca una persona.
5. **Transparencia comercial.** Fases con precio fijo, pagos por hitos y un apartado "No incluye", igual que en las propuestas.
6. **Calma.** Las animaciones tienen un propósito; nada se mueve solo para llamar la atención.

## Sistema visual

### Color: tokens por uso

Se reemplaza la paleta de 5 neones por un sistema de tokens con nombre por uso. El color de acento se cambia en un solo lugar.

```css
:root {
  /* Superficies */
  --bg:           #0B0B12;
  --surface-1:    #13131C;
  --surface-2:    #1B1B27;
  --border:       #2A2A3A;
  --border-strong:#3A3A4E;

  /* Texto */
  --text:         #ECECF2;
  --text-muted:   #A0A0B4;
  --text-subtle:  #6E6E84;

  /* Marca y estados */
  --accent:       #B042FF;  /* se mantiene el morado actual: continuidad */
  --accent-text:  #C98BFF;  /* morado para texto sobre fondo oscuro, con buen contraste */
  --signal:       #3DDC97;  /* "en operación", OK; reemplaza #4aef9e/#42ff66/#4aff4a */
  --warning:      #F5B841;  /* "propuesta", "en entrega" */
}
```

Reglas:
- El acento ocupa como máximo el 10% de la pantalla: CTA principal, enlaces y la etiqueta numerada.
- Se eliminan los degradados morado→azul→rosa y los neones rosa, amarillo y naranja.
- Resplandor (`box-shadow` de color) solo en el CTA principal. Los títulos no llevan `text-shadow`.

> **Decisión abierta (paleta).** Si el azul marino con dorado de las propuestas DOCX es la marca de Transformia, recomiendo unificar todo: sitio, propuestas y presentaciones. Ver la opción B en "Decisiones abiertas". El sistema de tokens funciona igual con cualquiera de las dos.

### Tipografía

Se mantiene la familia Space, pero cada fuente pasa a tener un papel definido y se sirve desde el propio sitio con `@fontsource`. Se quita el enlace a Google Fonts.

| Rol | Fuente | Tamaño |
|---|---|---|
| Display (H1) | Space Grotesk 600 | `clamp(2.5rem, 5vw, 4rem)`, interlineado 1.05 |
| H2 | Space Grotesk 600 | `clamp(1.75rem, 3vw, 2.5rem)` |
| H3 | Space Grotesk 600 | 1.25rem |
| Cuerpo | Space Grotesk 400 | 1.0625rem, interlineado 1.65, máximo 65 caracteres por línea |
| Pequeño | Space Grotesk 400 | 0.9375rem |
| Etiqueta / dato | Space Mono 400 | 0.8125rem, MAYÚSCULAS, espaciado de 0.08em |

- Los títulos van en minúsculas normales, no en MAYÚSCULAS.
- Space Mono solo para etiquetas, cifras y datos técnicos. Nunca en párrafos ni con menos de 13px.

### Fondo y textura

- Un **plano técnico** estático: cuadrícula de 1px al 4% de opacidad, solo en el hero y el CTA final.
- Se eliminan la cuadrícula en perspectiva animada, las scanlines, las partículas, los círculos flotantes, las figuras geométricas y el glitch.

### Reglas de movimiento

- Cada elemento aparece una sola vez al entrar en pantalla: 400 ms, desplazamiento de 12px y `ease-out`.
- Como máximo una animación continua por pantalla, y solo si comunica algo, como un estado "en operación" o un flujo de datos.
- `prefers-reduced-motion` desactiva todo de forma global en `tokens.css`, no componente por componente.
- El contenido siempre es visible sin JS. El estado oculto inicial solo se aplica si `<html>` tiene la clase `js`.

### Componentes base

| Componente | Cambio |
|---|---|
| `SectionHeader` | Variantes `left` (por defecto) y `center`. Etiqueta en mono numerada ("01 — Servicios") en lugar de pastilla. Sin línea pulsante. |
| `Card` (nuevo, único) | Espacio opcional para imagen o diagrama. Al pasar el mouse cambia el borde a `--border-strong`, sin elevarse ni brillar. |
| `Button` | `primary` (acento sólido), `secondary` (con borde) y `link`. Se elimina `cybr-btn` con glitch. |
| `StatusChip` (nuevo) | Estado con punto de color: `En operación` (signal), `En entrega` (warning), `Propuesta técnica` (warning con borde). |
| `DataPoint` (nuevo) | Cifra en mono más etiqueta, p. ej. **5** roles · **10** módulos. Reemplaza los contadores con resplandor. |
| `DeviceFrame` (nuevo) | Marco de navegador, de teléfono y de chat para mostrar capturas reales de web, móvil y WhatsApp con el mismo estilo. Generaliza el `AppScreenshotFrame` que ya existe. |
| Logo | Wordmark propio y favicon real (ver "No incluye"). |

## Contenido del home

Orden propuesto (reemplaza Hero → Servicios → Casos → Por qué → Blog → CTA):

1. **Hero**
   - H1 con la propuesta de valor, amplia. Opciones:
     - *"Construimos el software que tu operación necesita."* (recomendada: amplia, directa y sin atarse a un sector)
     - *"Software a la medida, con inteligencia artificial, para empresas que quieren operar mejor."*
     - *"De Excel y procesos manuales a sistemas que trabajan por ti."*
   - Subtítulo: plataformas web, apps móviles, automatización e IA aplicada, diseñadas para cómo funciona tu empresa. Especialistas en trazabilidad.
   - Botones: **"Agenda un diagnóstico"** y **"Escríbenos por WhatsApp"**.
   - Visual: un **collage de producto real** en `DeviceFrame`. Una pantalla web de la plataforma multirol (Tesla GPS), un teléfono con FeriaApp y un chat de Vera, superpuestos con un poco de profundidad. Muestra de un vistazo que se construye para web, móvil y conversación. Alternativa: un diagrama de flujo genérico (fuentes como Excel, formularios, WhatsApp, APIs y dispositivos → plataforma → tableros y alertas) con un único punto "en operación".
   - Franja de prueba: nombres de clientes en gris (**solo si cada cliente autoriza**).
2. **Qué construimos.** Cuatro grupos que ordenan los 7 servicios, cada uno con un ejemplo real:
   - *Plataformas web y apps móviles*: sistemas multirol, marketplaces, portales de cliente. Ejemplo: Tesla GPS, FeriaApp.
   - *IA aplicada y automatización*: bots, validación automática, flujos que eliminan trabajo manual. Ejemplo: Vera, Transcarga.
   - *Integración y datos*: bases de datos, integración entre sistemas y con dispositivos, tableros en tiempo real. Ejemplo: Colombina.
   - *Arquitectura y asesoría*: diagnóstico de procesos y diseño técnico antes de escribir código.
3. **Nuestra especialidad: trazabilidad.** Una franja propia, no todo el sitio, explicada en términos generales: seguir cada unidad, lote o pedido de punta a punta, con el dato capturado en la fuente. Se respalda con Frigorinoquia y Colombina y enlaza a los casos.
4. **Casos.** Cuadrícula variada, no una sola protagonista; cada tarjeta lleva su captura en el `DeviceFrame` que le corresponde y un chip con el tipo de software:
   - Tesla GPS (Plataforma web, chip "En entrega")
   - Frigorinoquia (Trazabilidad)
   - Colombina (Trazabilidad / datos)
   - Portafolio Interlink (Sitios web)
   - Todas con la estructura dolor → solución → resultado en tres líneas.
5. **Productos propios**: Vera y FeriaApp. Muestran que Transformia también construye y opera producto propio.
6. **Cómo trabajamos**, sacado del método de las propuestas:
   - Fases con precio fijo y pagos por hitos.
   - Decisiones de arquitectura desde el día uno (multi-tenant, offline-first cuando aplica).
   - Siempre un apartado "No incluye": sin sorpresas.
   - Equipo boutique: hablas directo con quien construye tu sistema, sin intermediarios. Siempre en voz de empresa, sin nombres.
7. **Blog**: últimos 2 posts.
8. **CTA final**: diagnóstico de 30 minutos, WhatsApp +57 300 823 4881 e info@transformia.dev. Sin teatro de terminal.

`/nosotros` sigue la misma regla: habla de la empresa, su método y sus principios, sin perfiles personales. El footer muestra la razón social y el NIT (dato legal de la empresa).

## Plan por fases

| Fase | Alcance | Criterio de terminado |
|---|---|---|
| **0. Correcciones** | Contacto centralizado en `src/data/contacto.ts` con los datos oficiales; razón social y NIT en privacidad y términos; voseo → tuteo; quitar el enlace a `global.css`, el CSS muerto y `Layout.astro`; decidir si Tailwind se adopta o se quita | `npm run build` sin errores y `grep` sin coincidencias de los datos viejos ni de voseo |
| **1. Base del sistema** | Tokens por uso, escala tipográfica, `@fontsource`, `prefers-reduced-motion` global; componentes `SectionHeader`, `Card`, `Button`, `StatusChip`, `DataPoint`, `DeviceFrame` | Ningún color hexadecimal escrito a mano fuera de `tokens.css` |
| **2. Hero y home** | Hero nuevo, contenido del home según la sección anterior | Revisión visual a 1440px y 375px; ninguna métrica inventada |
| **3. Páginas internas** | Hub y páginas de casos, `/servicios` (agrupado en 4), `/nosotros` (voz de empresa), sección o página de productos (Vera, FeriaApp) | Todas las páginas con los componentes base |
| **4. Pulido** | Revisión de animaciones, contraste AA, estados de foco, imagen OG regenerada con la nueva marca, Lighthouse | Lighthouse ≥ 90 en Performance y Accessibility en móvil |

## No incluye

- Diseño del logo final: se puede generar con Claude Design a partir de un prompt, pero la decisión de marca es tuya.
- Capturas nuevas de proyectos: hay que conseguir capturas limpias, sin datos reales de clientes, de Tesla GPS, FeriaApp y Vera.
- Textos nuevos para el blog.
- Backend del formulario de contacto.
- Cambios a `/cotizacion`, salvo el cambio de datos de contacto.

## Decisiones tomadas

1. **Paleta:** morado (opción A).
2. **Tesla GPS:** fuera del sitio hasta que se entregue (`publicado: false` y página `_tesla-gps.astro`).
3. **Productos:** Vera enlaza a https://www.verabotcol.com/ y FeriaApp a https://feria-app.com/; además hay una página `/productos`.
4. **Eslogan:** "De la idea a la operación." H1 del home: "Construimos el software que tu operación necesita."
5. **Sin personas en el sitio:** todo en voz de empresa.
6. **Stack de movimiento:** GSAP (SplitText, ScrambleText, ScrollTrigger) y SMIL/CSS en lugar de componentes React, para no cargar React en el cliente.
