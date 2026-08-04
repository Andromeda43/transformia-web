# Contexto de Proyectos — Transformia

## Propósito de este documento

Este archivo es contexto de negocio y producto para que otra IA (o un desarrollador) entienda **qué proyectos ha construido Transformia, para qué cliente, qué problema resuelven y cómo están implementados**, antes de escribir o modificar código relacionado.

No es documentación técnica de arquitectura del repo (para eso está el código y los README propios de cada proyecto). Es el "por qué" y el "para quién" detrás de cada sistema.

Cada proyecto se documenta con la misma estructura:

1. **El punto de partida: el dolor** — qué problema real tenía el cliente antes del sistema.
2. **La solución** — la idea central de cómo se resolvió.
3. **Qué hace el sistema (capacidades)** — funcionalidades concretas.
4. **La implementación** — stack tecnológico y metodología de construcción.
5. **El resultado** — el estado final, en términos de negocio.

Cuando se agregue un proyecto nuevo, debe respetar esta misma estructura para mantener el documento consistente y fácil de recorrer.

---

## Proyecto: Sistema de Gestión Operativa — Tesla GPS

### 1. El punto de partida: el dolor

Tesla GPS es una empresa de instalación y monitoreo de dispositivos GPS vehiculares en Cali. Su operación —clientes, vehículos, instalaciones, inventario de equipos, planes de monitoreo— se llevaba de forma dispersa, apoyada en hojas de cálculo y registros manuales. Eso generaba problemas concretos:

- **Sin trazabilidad del dispositivo**: no había forma confiable de saber qué GPS y qué SIM estaban instalados en qué vehículo, ni el historial de reemplazos.
- **Inventario a ciegas**: los equipos y materiales se consumían sin un descuento automático ni control de existencias, lo que dificultaba saber con qué se contaba realmente.
- **Renovaciones que se perdían**: sin alertas, los planes de monitoreo vencían sin seguimiento, con el consiguiente riesgo de perder clientes.
- **Información fragmentada**: los datos del cliente, su vehículo, su plan y su historial de servicio vivían en lugares distintos, sin una vista unificada.
- **Sin control de acceso**: todos veían y tocaban todo, sin roles ni permisos que ordenaran la operación.

### 2. La solución

Un sistema web centralizado, hecho a la medida del flujo real de Tesla GPS, que ordena toda la operación en una sola plataforma con acceso diferenciado por rol. La solución se apoya en tres ideas:

- **Trazabilidad de punta a punta**: desde que llega un cliente hasta que el técnico cierra la instalación, todo queda registrado: el vehículo, el GPS y la SIM específicos que se instalaron (identificados individualmente por IMEI y número), el historial de reemplazos, y el plan asociado.
- **Control operativo real**: el inventario se descuenta solo al cerrar una orden; los equipos GPS y SIM se manejan como unidades serializadas con su propio ciclo de vida; las renovaciones generan alertas automáticas; y cada acción queda registrada.
- **Orden por roles**: cinco perfiles —Administrador, Administrador de Punto, Recepcionista, Técnico y Soporte— donde cada uno accede solo a lo que le corresponde, con la seguridad garantizada a nivel de base de datos, no solo de pantalla.

### 3. Qué hace el sistema (capacidades)

- Gestión de clientes y vehículos, con múltiples teléfonos de contacto y datos completos del vehículo.
- Órdenes de servicio con su ciclo completo (pendiente → en proceso → cerrada), asignación de técnico y cierre técnico con firma.
- Cierre de instalación con validez legal: firma del cliente en pantalla y aceptación de habeas data y términos versionados, conforme a la Ley 1581.
- Inventario serializado de GPS y SIM, con alta por lote, control de bodega y trazabilidad por unidad, además del inventario de consumibles con descuento automático.
- Planes y renovaciones con cálculo automático de vencimiento, panel de seguimiento y alertas de fidelización.
- Notificaciones al cliente por WhatsApp (recordatorios de renovación, avisos y retroalimentación) mediante envío asistido.
- Convenios con concesionarios aliados, gestionados a nivel de vehículo.
- Dashboards por rol y módulo de soporte de solo lectura para consulta rápida.

### 4. La implementación

- **Tecnología**: aplicación web moderna (React) sobre una base de datos robusta con seguridad por roles a nivel de datos (Supabase/PostgreSQL con Row Level Security), desplegada en la nube.
- **Cómo se construyó**: por módulos, en etapas aprobadas, con la arquitectura y el modelo de datos definidos antes de escribir código, priorizando un sistema estable, seguro y escalable.
- **Entrega**: el sistema se acompaña de la migración de los datos históricos de Tesla, capacitación al equipo por rol y manuales de usuario para cada perfil.

### 5. El resultado

Tesla GPS pasa de una operación dispersa en hojas de cálculo a una plataforma única donde cada cliente, vehículo, dispositivo y plan es trazable, cada rol tiene su espacio, y la información está disponible en tiempo real para tomar decisiones —sin perder de vista una renovación ni un equipo.

---

## Proyecto: Suite de Trazabilidad y Desposte — Frigorinoquia

### 1. El punto de partida: el dolor

Frigorinoquia es una planta de beneficio animal (sacrificio) y sala de desposte mixto. El proceso completo —desde que el animal ingresa a la planta hasta que el producto (canal entera o cortes empacados) sale hacia el cliente— tenía los mismos síntomas de una operación no digitalizada:

- **Apertura de lote manual**: en Excel o papel, sin trazabilidad digital del lote de desposte.
- **Pesaje sin sistema**: el peso de presas y de producto a granel se anotaba a mano; las etiquetas se escribían o imprimían aparte, desconectadas del registro real.
- **Sin visibilidad de inventario**: no había forma de saber en tiempo real qué había disponible en cámara fría por cliente o categoría de corte.
- **Despacho propenso a error**: las guías se llenaban a mano, con errores frecuentes en kilos y cortes, y sin documentos de trazabilidad generados en línea.
- **Reportes gerenciales tardíos**: la consolidación de producción se hacía manualmente en Excel, días después del cierre.
- **Cobranza desconectada de la operación**: las liquidaciones de servicio de desposte (maquila) se calculaban a mano, sin seguimiento sistemático de cartera.
- **Trazabilidad animal incompleta**: el recorrido del animal —ingreso, examen ante mortem, proceso, examen post mortem, pesos, guía SINIGAN, destino— no estaba unificado en un único sistema capaz de responder "de dónde viene y hacia dónde va" cada unidad de producto.

### 2. La solución

Una **suite de seis aplicaciones web independientes**, cada una responsable de una estación de trabajo física de la planta, todas conectadas a la misma base de datos y compartiendo trazabilidad de extremo a extremo: desde el animal vivo (beneficio) hasta el corte empacado despachado al cliente (desposte). La idea central es que **cada estación registra su parte del proceso en tiempo real**, y esos registros se encadenan automáticamente:

- **Trazabilidad animal → producto**: cada canal beneficiada (`cow`) queda vinculada a su guía SINIGAN, su lote de desposte (`desposte_batch`), sus pesos en cada etapa (en pie, en caliente, pre-desposte) y, finalmente, a cada corte o presa que salió de ella (`desposte_cut_result` → `cold_storage_inventory` → `desposte_dispatch_item`).
- **Captura en la fuente, con hardware integrado**: el peso no se anota, se lee directamente de la báscula serial en tiempo real; la etiqueta no se imprime aparte, se genera automáticamente en ZPL al momento del registro.
- **Inventario que se actualiza solo**: cada pesaje alimenta el inventario de cámara fría vía funciones transaccionales en base de datos (RPCs), y el despacho lo descuenta automáticamente — es imposible despachar más de lo disponible.
- **Dos flujos de despacho conviviendo en la misma app**: salida de **canales enteras** recién sacrificadas (beneficio, sin pasar por desposte) y salida de **cortes empacados** (desposte), cada uno con sus propias tablas pero compartiendo transporte y conductor.
- **Cierre del ciclo con reportes y cobranza**: la gerencia consulta KPIs y exporta reportes sin depender de Excel manual, y la liquidación de maquila se genera automáticamente a partir de los pesajes ya registrados, con seguimiento de cartera por cliente.

### 3. Qué hace el sistema (capacidades)

La suite está compuesta por seis aplicaciones, cada una en su propio puerto, que pueden correr en equipos distintos dentro de la planta:

| App | Puerto | Función |
|---|---|---|
| `app_apertura` | 8001 | Apertura de lote, fichas técnicas de cortes, catálogo de cortes, consolidados diarios, registro de pesos (en pie/caliente/pre-desposte) |
| `app_presa` | 8002 | Pesaje de cortes empacados individualmente (vacío/termoencogido), lectura de báscula en tiempo real, impresión automática de etiqueta ZPL |
| `app_granel` | 8003 | Pesaje de cortes a granel por canastilla, acumulado de kilos y unidades, impresión de etiquetas de canastilla |
| `app_despacho` | 8004 | Dos flujos: despacho de desposte (guías, certificados de rendimiento y calidad) y despacho de canales de beneficio (grupos de transporte por conductor/vehículo/precinto/temperatura) |
| `app_reportes` | 8005 | Dashboard de KPIs, reportes de producción/pesos/rendimientos/despachos/inventario, exportación a PDF y Excel |
| `app_cobranza` | 8006 | Liquidación automática de maquila, tarifas configurables, cuentas por cobrar, registro de pagos, pre-facturas en PDF |

Capacidades transversales:

- Trazabilidad completa por lote: beneficio → desposte → pesaje → despacho → cliente.
- Documentos generados por el sistema: guía de despacho, guía consolidada, certificado de rendimientos, certificado de calidad, guía de transporte de canales (individual o impresión en lote).
- Registro de examen ante mortem y post mortem del animal, con decomisos y su motivo.
- Gestión de conductores, vehículos y su verificación.
- Configuración de báscula (puerto serial, baudrate) e impresora (nombre de dispositivo) por estación.

### 4. La implementación

**Stack tecnológico**

| Capa | Tecnología |
|---|---|
| Backend | Python 3.11+, FastAPI, Uvicorn |
| Base de datos | Supabase (PostgreSQL), acceso vía RPCs con `supabase-py` |
| Frontend | Jinja2 templates, HTML/CSS/JS vanilla |
| Validación | Pydantic v2 |
| Báscula | PySerial, hilo daemon de lectura continua (~50 ms) |
| Impresora | ZPL (Zebra); `win32print` en Windows, `lp -o raw` en Linux/macOS |
| Empaquetado | PyInstaller (ejecutable one-file por app) |
| Config | `python-dotenv`, archivo `.env` junto al ejecutable |

**Cómo se construyó**: como seis aplicaciones FastAPI independientes que comparten un módulo `shared/` (cliente Supabase singleton, modelos Pydantic, lector de báscula, impresora), cada una con su propio `router.py`, `services/` y `templates/`. Cada app se despliega y ejecuta de forma aislada en el equipo de su estación de trabajo, pero todas leen y escriben sobre el mismo schema de Supabase, lo que mantiene la trazabilidad unificada sin acoplar el despliegue.

**Base de datos — tablas clave** (schema `public`, configurable vía `APP_SCHEMA`):

- *Beneficio / trazabilidad animal*: `cow`, `dispatch`, `trackingsinigan`, `checkpointinitprocess`, `checkpointantemortemexam`, `checkpointendprocess`, `checkpointpostmortemexam`, `checkpointdispatch`, `checkpoint_pre_desposte`, `dictumcowchannel`, `categorycow`, `typesacrificeforcow`, `originplace`, `typeplace`, `ownercows`.
- *Transporte y despacho de canales*: `dispatch_order`, `dispatch_order_cow`, `carrier`, `transport`.
- *Desposte*: `desposte_batch`, `desposte_batch_cow`, `desposte_batch_cut_config`, `desposte_type`, `desposte_type_cut`, `cut_catalog`, `cut_category`, `packaging_type`, `packaging_size`, `desposte_cut_result`, `cold_storage_inventory`, `desposte_dispatch`, `desposte_dispatch_item`, `client_desposte_config`, `client_desposte_config_cut`, `batch`.
- *Clientes*: `frigorinoquiauser`.
- *Cobranza*: `cobranza_factura`, `cobranza_desposte_factura`, `cobranza_tipo_pago`, `cobranza_config`, `cobranza_recaudo`.

**RPCs transaccionales**: `registrar_pesaje_presa`, `registrar_pesaje_granel`, `confirmar_despacho_desposte` — garantizan que el pesaje/despacho y la actualización del inventario ocurran atómicamente. El despacho de canales (`dispatch_order`/`dispatch_order_cow`) no usa RPC: se inserta directamente, con el consecutivo `guidenumber` generado por trigger/default de la tabla (coexiste con una app de escritorio previa, `DispatchOrders`, que opera sobre las mismas tablas).

**Entrega**: cada aplicación se empaqueta como ejecutable independiente con PyInstaller (`.spec` por app), con el `.env` y los assets (logo ZPL) copiados junto al ejecutable; al iniciar levanta un servidor Uvicorn local y se opera desde el navegador en `localhost:<puerto>`.

### 5. El resultado

Frigorinoquia pasa de un proceso de beneficio y desposte documentado en papel y Excel a una suite conectada donde cada animal, lote, corte y despacho queda trazado de punta a punta: desde el ingreso del animal a la planta hasta la salida del producto —canal entera o corte empacado— hacia el cliente, con el peso capturado directamente de báscula, las etiquetas impresas automáticamente, el inventario descontado en tiempo real, y la liquidación de cobranza generada a partir de los mismos datos operativos, sin doble digitación.

---

## Proyecto: Tracing 2.0 — Colombina

> **Nota de estado**: este proyecto se documenta asumiendo el flujo completo de las 4 fases implementado y en operación (Planeación → Scraping → Formulación → Dashboard en Tiempo Real), integrando el flujo de trabajo definido junto con el MVP de escritorio (`Colombina MVP Tracing`) que cubre la Fase 3 en planta.

### 1. El punto de partida: el dolor

Colombina Conservas programa su producción mediante órdenes de trabajo semanales que se comparten entre áreas como archivos Excel sueltos por correo. A partir de ahí, el dolor se repite en varios puntos:

- **Orden de producción como archivo suelto**: cada semana se genera un `.xls` que viaja por correo y se sube a un formulario de Google para quedar enlazado en un Google Sheets — sin estructura ni validación real.
- **Sin trazabilidad de materia prima en planta**: al momento de formular (pesar y mezclar ingredientes por bache), no había registro sistemático de qué ingrediente, qué lote y qué peso exacto se usó en cada bache.
- **Peso y consumo sin control**: los pesos se tomaban y anotaban manualmente, sin validación de tolerancia contra el peso esperado por fórmula, y sin conversión automática de unidades (G, L, ML, GL, etc.) a un estándar común (KG).
- **Cero visibilidad en tiempo real**: gerencia y planeación no tenían forma de saber, mientras la operación ocurría, cuántos baches iban, qué fórmulas faltaban por preparar o cuál era la eficiencia operativa del turno — esa información solo se conocía después, reconstruida a mano.
- **Doble trabajo entre planeación y formulación**: la información de la orden de producción y la información real de lo ejecutado en planta vivían desconectadas, obligando a conciliar manualmente.

### 2. La solución

**Tracing 2.0**: un flujo de 4 fases que convierte la orden de producción semanal en un ciclo de captura de datos que corre en tiempo real y retroalimenta un dashboard vivo. Cada fase resuelve una parte específica del dolor:

- **Fase 1 — Planeación**: formaliza el punto de entrada. Planeación programa las órdenes de trabajo semanalmente a partir del programa de producción divulgado, en un `.xls` compartido a las áreas, subido vía formulario de Google y almacenado como enlace en un Google Sheets — quedando así como fuente única y trazable del origen del dato.
- **Fase 2 — Scraping**: un proceso automatizado recibe ese archivo, extrae su información (raw), la procesa dejando estrictamente lo necesario, y la carga a una base de datos PostgreSQL. Al terminar, la base de datos queda actualizada y lista para ser operada por planta.
- **Fase 3 — Formulación**: en planta, los formuladores operan con **Tracing 2.0** (implementado como la app de escritorio `Colombina MVP Tracing`, en Python/Tkinter) sabiendo exactamente qué fórmulas preparar y con qué materiales, según la información cargada en la Fase 2. Cada acción de pesaje/escaneo se registra en la base de datos de forma continua, bache por bache, hasta finalizar toda la operación — cerrando el ciclo Formulación → Base de datos → Dashboard.
- **Fase 4 — Dashboard en Tiempo Real**: con la información gestionada en la base de datos, se visualiza en dashboards alimentados en tiempo real por lo que ocurre en Formulación, con filtro cruzado para consultar por fechas y/o elementos.

El ciclo se repite: cada nueva orden de producción reinicia el flujo desde Planeación.

### 3. Qué hace el sistema (capacidades)

**Flujo de datos (Fases 1-2-4):**
- Ingesta y limpieza de la orden de producción en Excel, con carga a PostgreSQL.
- Dashboards en tiempo real alimentados directamente por lo que se registra en planta, con filtro cruzado por fecha y/o elemento.
- Indicadores visualizados: operación en tiempo real, cantidad/bache actual, fórmulas creadas/faltantes, cantidad de productos por fórmula, eficiencia operativa.

**Captura en planta — MVP de escritorio (Fase 3):**
- Carga de la orden de producción desde Excel (`.xlsx`/`.xlsm`) con `pandas`/`openpyxl`.
- Escaneo de ingredientes por código de barras vía puerto serial.
- Pesaje en báscula serial en tiempo real, con validación de tolerancia contra el peso esperado por fórmula.
- Conversión automática de unidades (G, L, ML, GL, etc.) a KG.
- Impresión de etiqueta ZPL en impresora Zebra por cada ingrediente y bache, con detección automática de impresoras instaladas.
- Control de baches: rango inicial/final, bache actual, formuladores asociados al bache vía CIN.
- Informe final en PDF con el resumen de consumo por material al cerrar todos los baches.
- Registro de eventos y errores en log (`app_trazabilidad.log`, nivel `DEBUG`).

### 4. La implementación

**Stack tecnológico**

| Capa | Tecnología |
|---|---|
| Captura en planta | Python 3.10+, Tkinter (aplicación de escritorio) |
| Scraping / ingesta | Python, `pandas`, `openpyxl` |
| Base de datos | PostgreSQL |
| Hardware — báscula y escáner | PySerial, hilos en background (`ScaleReader`, `SerialScannerListener`) |
| Hardware — impresora | ZPL (Zebra); `win32print` en Windows, `lpr`/CUPS en macOS/Linux |
| Reportería | `reportlab` (informe PDF de trazabilidad) |
| Dashboard en tiempo real | Visualización alimentada directamente desde PostgreSQL, con filtro cruzado por fecha/elemento |

**Estructura del MVP de escritorio (`Colombina MVP Tracing`):**

```
main.py                     # Punto de entrada
trazabilidad_app.py         # Clase TrazabilidadApp: UI Tkinter y orquestación
scale_reader.py             # Lectura serial de báscula (hilo en background)
serial_scanner_listener.py  # Lectura serial de escáner de código de barras (hilo en background)
zebra_printer.py            # Generación y envío de ZPL a impresora Zebra
printer_detector.py         # Detección de impresoras instaladas (Windows/Unix)
product_catalog.py          # Catálogo de productos/ingredientes cargados desde Excel
report_generator.py         # Generación de informe PDF de trazabilidad
utils.py                    # Utilidades: puertos, fechas, conversión de unidades, validación de peso
```

**Cómo se construyó**: como un ciclo de 4 fases donde cada una alimenta a la siguiente — Planeación entrega el archivo fuente, Scraping lo normaliza y lo sube a PostgreSQL, Formulación (el MVP de escritorio) lo consume y registra la ejecución real en planta bache por bache, y Dashboard visualiza esa misma base de datos en tiempo real. La app de escritorio corre de forma aislada en el puesto de formulación, con hardware serial conectado localmente (báscula, escáner, impresora Zebra), y su única dependencia externa es la base de datos compartida.

**Dependencias no declaradas en `requirements.txt`** (a instalar manualmente): `reportlab` (usado por `report_generator.py`) y, en Windows, `pywin32` (para `win32print`).

### 5. El resultado

Colombina pasa de una orden de producción en Excel suelta por correo a un ciclo de trazabilidad continuo: la orden se planea, se scrapea automáticamente hacia PostgreSQL, se ejecuta en planta con pesaje y escaneo validados contra la fórmula esperada —con etiqueta ZPL impresa por ingrediente y bache—, y todo eso se refleja en un dashboard en tiempo real que gerencia puede filtrar por fecha o elemento sin esperar al cierre del turno. El ciclo se repite semana a semana con cada nueva orden de producción.

---

## Portafolio: Sitios Web para Clientes — Pasantía en Interlink

> **Nota de estructura**: a diferencia de los proyectos anteriores (un sistema, un cliente, un dolor puntual), esto es un **portafolio de seis sitios web independientes** construidos durante una pasantía en **Interlink**, una agencia de marketing digital australiana. Cada sitio es de un cliente e industria distintos, así que no aplica el esquema de 5 secciones — se documenta como visión general + ficha por sitio + patrones comunes.

### Visión general

Cada carpeta del portafolio es un sitio web independiente, con calidad de producción, que cubre industrias muy distintas: entretenimiento nocturno, coaching de bienestar, servicios del hogar, entretenimiento infantil para fiestas, y el sitio de marketing de la propia agencia. En conjunto conforman el portafolio de **Transformia**.

Todos los proyectos comparten una base técnica común (Astro + TypeScript, arquitectura static-first), pero cada uno explora una estrategia de contenido, un patrón de integración de backend o un enfoque de animación distinto — desde efectos de scroll/partículas hechos a mano hasta plataformas de reservas con Supabase o pipelines de leads con Google Apps Script.

### Índice de proyectos

| Proyecto | Industria | Stack destacado |
|---|---|---|
| AlphaMen | Reservas / entretenimiento nocturno para adultos | Astro 5, TypeScript, Framer Motion |
| Brightline Creative | Agencia de marketing digital (ejercicio técnico) | Astro 5, TypeScript, Lottie |
| Empress Nic | Coaching de bienestar / intimidad | Astro 5, Google Apps Script |
| Harmony Home | Servicios de limpieza para hogares y alquileres de corta estadía | Astro 5, Tailwind v4, Supabase |
| Interlink Agency Landing | Agencia de marketing full-service (auto-promoción) | Astro 4, React islands, GSAP |
| Super Hero Parties | Entretenimiento infantil para fiestas | Astro 4, Tailwind, Vercel |

### AlphaMen

Sitio de marketing para una empresa de entretenimiento masculino / reserva de eventos (despedidas de soltera, eventos privados).

- **Stack**: Astro 5, TypeScript, CSS escrito a mano, `framer-motion`, `lucide-astro`. Totalmente estático, sin backend.
- **Funcionalidades**:
  - Sitio multi-página con una página dedicada al roster de performers (`guys.astro`)
  - Efecto de scroll cinematográfico "estilo Apple" hecho a mano, usando `IntersectionObserver`/`requestAnimationFrame` para difuminar, escalar y desvanecer secciones
  - Clase `CarouselManager` hecha a mano que controla los carruseles de imágenes por performer (auto-rotación, pausa al hover, precarga, pausa/reanudación según visibilidad) en 8 perfiles
  - Fondos de spotlight/partículas/grid neón con CSS y animaciones de scroll-reveal

### Brightline Creative

Sitio de una sola página para una agencia de marketing y branding ficticia, construido como ejercicio técnico.

- **Stack**: Astro 5, TypeScript, CSS escrito a mano (sin framework), Lottie-web (CDN), Google Fonts.
- **Funcionalidades**:
  - Arquitectura por secciones basada en componentes (Header, Hero, About, Services, Portfolio, Contact, Footer)
  - Animaciones de entrada escalonadas hechas a mano (`elegant-entry`, `elegant-fade-in`, `elegant-scale-in`) más un efecto de glow/glitch LED en el titular
  - Tres animaciones Lottie JSON cargadas y ajustadas en velocidad del lado del cliente
  - Scroll-reveal basado en `IntersectionObserver` y tarjetas de servicio con hover-glow
  - Patrón de contenido típico de agencia de marketing: grilla de servicios, barra de estadísticas, formulario de contacto multi-campo

### Empress Nic

Sitio de aterrizaje y embudo de reservas para una práctica de coaching de sexualidad sagrada / intimidad y sanación somática.

- **Stack**: Astro 5 con content collections (blog con schema Zod), CSS plano, sin framework de cliente. La lógica de backend corre enteramente en **Google Apps Script**.
- **Funcionalidades**:
  - Blog basado en content collections, con posts categorizados y ruteo `[slug]`
  - Captura de lead-magnet en la sección Hero que dispara una automatización en Apps Script: registra en Google Sheets y envía un PDF por correo vía GmailApp
  - Carrusel de testimonios en vivo, obtenido del lado del cliente desde una Google Sheet pública a través de una web app de Apps Script desplegada
  - Páginas de aterrizaje dedicadas por servicio ofrecido, mapa embebido y tarjetas de contacto de click-to-call

### Harmony Home

Sitio de marketing **más** una plataforma de cliente/administrador para un negocio de limpieza residencial.

- **Stack**: Astro 5, TypeScript, Tailwind CSS v4, **Supabase** (Postgres + Auth), `lottie-web`, Vitest para tests unitarios.
- **Funcionalidades**:
  - Páginas públicas de marketing (Hero, Services, Benefits, Packages, Reviews) más páginas de aterrizaje por servicio
  - Dashboard de cliente autenticado para gestionar múltiples propiedades ("homes") y reservas
  - Motor de reservas con franjas horarias por día de la semana y reglas de negocio (p. ej. reservas de fin de semana restringidas a tipos de propiedad BnB/comercial)
  - Área de administración para gestión de reservas/empleados y un módulo separado de entrenamiento de personal
  - Modelo de datos con roles (`user`/`admin`) y catálogo de servicios tipado

### Interlink Agency Landing

El sitio promocional de la propia agencia — "One Agency. Total Control." — posicionando a Interlink como un proveedor todo-en-uno de Marketing, Diseño, Servicio al Cliente y Logística.

- **Stack**: Astro 4 (salida estática) con islands de `@astrojs/react`, TypeScript, GSAP 3 + ScrollTrigger, `@astrojs/sitemap`. Desplegable en Netlify o GitHub Pages.
- **Funcionalidades**:
  - Trabajo de animación custom en canvas/SVG: fondo animado de red neuronal, líneas de gradiente fluidas, orbes con parallax, titular hero con efecto scramble-text
  - Sección de servicios en bento-grid (Desarrollo Web, Marketing, Diseño de Marca, SEO, Servicio al Cliente, Logística) con mini-mockups de UI a medida por servicio
  - Sección de portafolio con una página de caso de estudio dedicada y un componente `PortfolioTimeline`
  - Construcción consciente de accesibilidad: consideraciones WCAG, soporte de reduced-motion, ajuste de performance orientado a Core Web Vitals

### Super Hero Parties

Sitio de marketing para un negocio de entretenimiento infantil con temática de superhéroes para fiestas (Adelaide, Australia).

- **Stack**: Astro 4, Tailwind CSS, TypeScript. Desplegado en Vercel. El "backend" es un webhook de Google Apps Script que escribe en Google Sheets.
- **Funcionalidades**:
  - Temática visual estilo cómic: logo SVG animado, fondos de halftone, gráficos de acción "POW!/ZAP!"
  - Motor de animación en JS vanilla hecho a mano (`HeroFlightController`) que genera sprites de héroes voladores con rastros de partículas y múltiples rutas de vuelo — sin librería de animación
  - Formulario de contacto con captura de leads en doble canal: registro en Google Sheets más un enlace deep-link de WhatsApp auto-generado para seguimiento instantáneo
  - Sitio multi-página que incluye un componente de tarifas/paquetes con lógica de cupones y un creador de invitaciones digitales a medida

### Patrones comunes del portafolio

- **Astro-first**: todos los proyectos están construidos sobre Astro (v4 o v5), priorizando salida estática y mínimo JavaScript del lado del cliente.
- **Animación a medida por encima de librerías pesadas**: la mayoría de los sitios hacen a mano sus efectos de scroll/partículas/carrusel en lugar de depender de frameworks de animación — GSAP y Framer Motion solo aparecen donde la complejidad de la interacción lo justificaba.
- **Backends livianos**: cuando un proyecto necesita persistencia sin infraestructura completa, Google Apps Script + Sheets es el patrón recurrente de bajo costo (Empress Nic, Super Hero Parties). Harmony Home es la excepción, usando Supabase para un modelo completo de datos de auth + reservas.
- **Identidad visual a medida por nicho**: el lenguaje de diseño de cada sitio está construido específicamente para su industria — estilo cómic para fiestas infantiles, tonos suaves/espirituales para coaching de bienestar, estética bold nocturna para entretenimiento para adultos, corporativo-limpio para los sitios de agencia.

---

## Proyecto: FeriaApp — Marketplace de Ganado

### 1. El punto de partida: el dolor

La compraventa de ganado en la Orinoquía colombiana (Casanare, Meta, Arauca, Vichada) ocurre en un mercado fragmentado y mayormente informal:

- **Sin canal directo entre ganadero y comerciante**: la oferta de animales se mueve por contactos personales, referencias o ferias físicas, sin un lugar centralizado donde publicar o buscar ganado.
- **Sin forma de validar confianza**: comprar o vender ganado implica confiar en un desconocido, sin historial ni reputación visible antes de cerrar el trato.
- **Comunicación lenta y desorganizada**: negociar una compra (precio, cantidad, condiciones) dependía de llamadas o mensajes sueltos, sin un registro estructurado de la solicitud ni seguimiento de su estado.
- **Zonas rurales con conectividad limitada**: gran parte de los usuarios potenciales —ganaderos en fincas alejadas— operan con conexión intermitente, algo que la mayoría de apps no contempla en su diseño.
- **Sin monetización clara para el operador**: al no existir una plataforma, tampoco había un modelo de negocio sostenible que separara el uso gratuito (publicar como ganadero) del uso comercial (comprar como comerciante).

### 2. La solución

Una aplicación móvil (Expo + React Native) que funciona como **marketplace de ganado**, patrocinada por Frigorinoquia, que conecta a dos roles claramente diferenciados:

- **Ganaderos**, que publican animales de forma gratuita e ilimitada.
- **Comerciantes**, que acceden a la plataforma mediante una membresía mensual para poder buscar y comprar.

Sobre esa base de dos roles, la plataforma resuelve el resto del flujo de compraventa: **solicitudes de compra** estructuradas sobre cada publicación, **chat en tiempo real** para negociar directamente, **reseñas y calificación de perfiles** para construir confianza entre usuarios, y **búsqueda avanzada con filtros y ubicación geográfica** para encontrar ganado por zona. Todo corre sobre Supabase (Postgres + Auth + Storage + Edge Functions), con notificaciones push e in-app que mantienen a los usuarios al tanto sin que tengan que revisar la app constantemente — un punto clave dado que la app está **optimizada para conectividad limitada en zonas rurales**.

### 3. Qué hace el sistema (capacidades)

- Registro y publicación de animales, gratuita e ilimitada para ganaderos.
- Acceso de comerciantes mediante membresía mensual (con notificación de vencimiento).
- Solicitudes de compra sobre publicaciones específicas.
- Chat en tiempo real entre ganadero y comerciante.
- Sistema de reseñas y calificación de perfiles.
- Búsqueda avanzada con filtros y ubicación geográfica (departamentos/municipios).
- Favoritos para guardar publicaciones de interés.
- Notificaciones push e in-app: nuevos mensajes, nuevas publicaciones, solicitudes de compra, vencimiento de membresía.
- Diseño optimizado para conectividad limitada, pensado para el contexto rural de la Orinoquía.

### 4. La implementación

**Stack tecnológico**

| Área | Tecnología |
|---|---|
| Framework | React Native 0.81 (Expo SDK 54) |
| Lenguaje | TypeScript |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Estado remoto | TanStack React Query |
| Estado local | Zustand |
| Navegación | React Navigation (native-stack + bottom-tabs) |
| Formularios | React Hook Form + Zod |
| UI | React Native Paper + SVG propios |

**Cómo se construyó**: organizado por dominio bajo `src/features/` (`auth`, `chat`, `favorites`, `home`, `listings`, `membership`, `notifications`, `profile`, `purchase-requests`, `reviews`), donde cada feature sigue el mismo patrón interno: `api/` (servicios Supabase), `hooks/`, `screens/`, `components/` y `types/`. La lógica de notificaciones (push e in-app) vive en `supabase/functions/` como Edge Functions más triggers de base de datos (`triggers.sql`), separando el envío de eventos de la lógica de la app móvil. El cliente Supabase se centraliza en `src/lib/supabase.ts`, y el estado global de autenticación en `AuthContext`.

**Calidad y CI**: ESLint + Prettier sobre `src/`, chequeo de tipos con `tsc --noEmit`, y un pipeline de GitHub Actions (`.github/workflows/ci.yml`) que corre lint y type-check en cada PR y push a `develop`/`main`.

**Entrega**: proyecto Expo estándar (`npm install && npm start`), desplegable a Android, iOS o Web desde el mismo código base, con variables de entorno (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) apuntando al proyecto Supabase correspondiente.

### 5. El resultado

FeriaApp le da a la Orinoquía ganadera un canal formal de compraventa que antes no existía: los ganaderos publican sin costo y sin límite, los comerciantes acceden mediante un modelo de membresía que sostiene la operación, y ambos negocian con chat directo, solicitudes de compra rastreables y reputación visible por reseñas — todo pensado para funcionar incluso con la conectividad limitada típica de las fincas alejadas de Casanare, Meta, Arauca y Vichada.

---

## Proyecto: TRACING B-4.0 — Trazabilidad Agroalimentaria Bovina ACFEC (propuesta, no ejecutado)

> **Nota de estado**: este proyecto **no llegó a construirse**. Lo que existe es una **propuesta técnica completa** (documento de 45 páginas) presentada a la Convocatoria No. 47 "Agro por la Vida y por la Tierra" de Minciencias / Sistema General de Regalías (SGR), bajo la línea temática 5.2.3 — Tecnologías 4.0 para trazabilidad, monitoreo y optimización de mercados agroalimentarios. Se documenta aquí igual porque contiene una arquitectura de sistema completamente especificada (módulos, integraciones, requisitos no funcionales) que puede retomarse como base de diseño si el proyecto se llega a ejecutar o se adapta a otro cliente.

### 1. El punto de partida: el dolor

Las organizaciones de Agricultura Campesina, Familiar, Étnica y Comunitaria (ACFEC) bovinas de la Orinoquía colombiana (Boyacá, Casanare, Arauca y Meta) están estructuralmente excluidas de las cadenas agroalimentarias formales:

- **Sin trazabilidad digital**: más del 80% de estas organizaciones no tienen registro activo en el SINIGAN (Sistema de Información Nacional de Identificación e Información de Ganado Bovino del ICA), y prácticamente ninguna cubre la cadena completa desde producción hasta comercialización.
- **Captura de valor por intermediarios**: sin registros verificables de origen, calidad e historial sanitario, el intermediario informal captura hasta el 40% del valor final, dejando al productor campesino con precios muy por debajo del mercado formal.
- **Pérdidas evitables en planta de beneficio**: entre el 8% y el 15% de los bovinos presentados en plantas formales son rechazados parcial o totalmente por documentación sanitaria incompleta (guías de movilización, historial de vacunación, períodos de retiro de medicamentos no documentados).
- **Exclusión de mercados de mayor valor**: programas de alimentación escolar, compras públicas y cadenas de distribución modernas exigen trazabilidad certificada como condición de entrada — algo que estas organizaciones no pueden ofrecer.
- **Las soluciones existentes no aplican al contexto**: los sistemas de trazabilidad comerciales están diseñados para grandes productores formales con alta conectividad y personal técnico especializado; en la Orinoquía la conectividad rural es del 18%-34%, haciendo esas soluciones técnica y económicamente inviables para el sector campesino.

### 2. La solución propuesta

**TRACING B-4.0**: un sistema de trazabilidad agroalimentaria digital co-diseñado con las propias comunidades ACFEC, compuesto por cuatro módulos que cubren la cadena bovina completa — desde el animal en finca hasta el consumidor final:

- **Módulo 1 — Trazabilidad de campo**: identificación electrónica RFID (aretes) más aplicación móvil Android/iOS con **arquitectura offline-first** (funciona sin internet y sincroniza de forma asíncrona cuando hay señal), resolviendo directamente la brecha de conectividad rural documentada. Registra nacimiento, crianza, sanidad, medicamentos, períodos de retiro, movilización e indicadores ambientales por finca.
- **Módulo 2 — Transformación**: integración técnica oficial con **SINIGAN-ICA** vía su protocolo API, con recepción, inspección sanitaria y procesamiento en planta de beneficio, generando un certificado digital de inocuidad y origen vinculado al historial RFID del animal.
- **Módulo 3 — Comercialización**: código **QR trazable** con el historial completo del bovino hasta el consumidor final, panel de precios de mercado en tiempo real por municipio y tipo de producto, e interfaz para que compradores formales e institucionales consulten el historial del producto.
- **Módulo de gobernanza de datos colectiva ACFEC**: dashboard administrativo con acceso diferenciado por rol, exportación en formatos estándar (CSV, JSON), auditoría de accesos, y un modelo técnico donde los datos quedan encriptados y asociados a la organización ACFEC —no a la plataforma ni a los ejecutores del proyecto—, garantizando soberanía informacional.

La idea central de diseño es que el sistema **no puede depender de conectividad constante ni de terceros externos**: la arquitectura offline-first ataca la causa técnica raíz, y la transferencia del código fuente a las organizaciones ACFEC al final del proyecto ataca la causa de sostenibilidad — evitando repetir el patrón de dependencia tecnológica que ya generan las soluciones SaaS comerciales.

### 3. Qué haría el sistema (capacidades especificadas)

- Identificación individual de cada bovino por arete RFID, con lectura desde la app móvil offline-first.
- Registro completo por animal: nacimiento, crianza, sanidad, medicamentos y períodos de retiro, movilización, indicadores ambientales de finca (uso de agua, carga animal, manejo de suelo, prácticas agroecológicas).
- Sincronización automática asíncrona con el servidor central en cuanto detecta señal.
- Integración con SINIGAN-ICA para que el registro campesino alimente directamente el sistema nacional oficial de trazabilidad bovina.
- Certificado digital de inocuidad y origen generado en planta de beneficio, vinculado al historial RFID.
- Código QR trazable al consumidor final, con panel de precios de mercado en tiempo real por municipio.
- Dashboard de gobernanza de datos por organización ACFEC, con control de acceso, exportación y auditoría — propiedad colectiva de los datos, no de la plataforma.
- Módulo de indicadores de sostenibilidad ambiental por finca, pensado para habilitar acceso a esquemas de Pago por Servicios Ambientales (PSA) y certificaciones de producción sostenible.

### 4. La implementación propuesta

**Enfoque técnico**

| Componente | Enfoque especificado |
|---|---|
| Identificación animal | RFID (aretes electrónicos), tecnología madura (TRL 9) |
| App de campo | Móvil Android/iOS, arquitectura **offline-first**, sincronización asíncrona |
| Integración oficial | API SINIGAN-ICA (protocolo oficial del ICA) |
| Trazabilidad al consumidor | Código QR con historial completo del bovino |
| Infraestructura cloud | Priorizada en COP (AWS Colombia / Azure Colombia) para evitar riesgo cambiario |
| Gobernanza de datos | Dashboard con control de acceso por rol, exportación CSV/JSON, auditoría; datos encriptados y asociados a cada organización ACFEC |

**Metodología de construcción**: desarrollo ágil (Scrum, sprints quincenales) liderado por la Fundación Parque Tecnológico de Software de la Amazorinoquia, con **co-creación participativa obligatoria** — doce talleres de co-diseño con usuarios ACFEC antes de construir cada módulo, y validación de prototipos con las propias comunidades antes de avanzar. Niveles de madurez tecnológica (TRL) objetivo: Módulo 1 y 3 en TRL 7 (probado en campo), Módulo 2 (integración SINIGAN) en TRL 8 (validado y aprobado por el ICA regional), módulo de gobernanza en TRL 7.

**Piloto de validación**: 25 fincas piloto en Boyacá, Casanare, Arauca y Meta, ~2.500 bovinos trazados, ≥150 productores capacitados y 30 gestores tecnológicos locales certificados (con enfoque diferencial: ≥30% mujeres rurales, ≥40% jóvenes 18-35 años) para dar soporte técnico y sostenibilidad post-proyecto sin depender de los ejecutores originales.

**Modelo de entrega y sostenibilidad**: transferencia formal del código fuente completo a las organizaciones ACFEC co-ejecutoras al finalizar el proyecto, con un modelo de mantenimiento colaborativo de costo compartido entre ellas — el sistema queda en propiedad colectiva, sin licenciamiento ni dependencia tecnológica externa.

**Marco institucional**: entidad proponente Fundación Parque Tecnológico de Software de la Amazorinoquia (desarrollo tecnológico); aliado IES Universidad Nacional Abierta y a Distancia — UNAD, Grupo de investigación CAZAO (investigación de adopción tecnológica y evaluación de impacto antes-después); tres Comités de Ganaderos (Tauramena, Monterrey, Aguazul) como co-ejecutores ACFEC; ICA e INVIMA como validadores normativos; Frigorinoquia Zomac S.A.S. como planta de beneficio de referencia técnica para el piloto. Presupuesto estimado: $13.050.000.000 COP. Duración: 36 meses.

### 5. El resultado (esperado, no verificado — proyecto no ejecutado)

De haberse financiado y ejecutado, TRACING B-4.0 habría llevado a organizaciones ganaderas campesinas de cuatro departamentos de la Orinoquía de operar fuera de cualquier sistema de trazabilidad a tener 25 fincas piloto con ~2.500 bovinos trazados de punta a punta —desde el arete RFID en finca hasta el QR que ve el consumidor final—, integradas al sistema oficial SINIGAN-ICA, con datos en propiedad colectiva de las propias organizaciones y 30 gestores tecnológicos locales capaces de sostener el sistema sin depender de los ejecutores originales. Las metas de impacto declaradas en la propuesta eran +20% de ingreso neto para el productor ACFEC y -15% en pérdidas por rechazos sanitarios en planta. **Ninguna de estas cifras fue verificada en campo**: el proyecto quedó en la fase de formulación de la propuesta técnica, sin financiación ni ejecución confirmada.

---

## Próximos proyectos

_(Agregar aquí los siguientes proyectos de Transformia siguiendo la misma estructura de 5 secciones.)_
