// src/data/casosDeExito.ts
// Casos publicados en el sitio. `publicado: false` mantiene el caso en datos pero lo saca de todas las listas
// (Tesla GPS queda así hasta que el proyecto se entregue y se publique).
import type { ImageMetadata } from 'astro';
import frigorinoquiaThumb from '../assets/casos-de-exito/frigorinoquia/screenshot-reporte-beneficio-animales.png';

export type CaseVisual = 'screenshot' | 'formulacion' | 'marketplace' | 'sitios' | 'propuesta' | 'plataforma';

export interface CasoDeExito {
  slug: string;
  cliente: string;
  nombreCorto?: string;
  industria: string;
  tipo: string;
  relacion: 'cliente' | 'producto' | 'portafolio';
  status: 'ejecutado' | 'propuesta';
  publicado: boolean;
  featured: boolean;
  titular: string;
  dolor: string;
  solucion: string;
  resultado: string;
  metricas: { valor: string; label: string }[];
  stack: string[];
  visual: CaseVisual;
  image?: ImageMetadata;
  urlExterna?: string;
}

const todos: CasoDeExito[] = [
  {
    slug: 'frigorinoquia',
    cliente: 'Frigorinoquia',
    industria: 'Planta de beneficio animal y desposte',
    tipo: 'Trazabilidad industrial',
    relacion: 'cliente',
    status: 'ejecutado',
    publicado: true,
    featured: true,
    titular: 'Seis aplicaciones conectadas que llevan una planta completa del papel a la trazabilidad en tiempo real.',
    dolor: 'Lotes, pesos, inventario y despachos se llevaban en papel y Excel, con reportes que llegaban días tarde.',
    solucion: 'Una suite de seis apps, una por estación de la planta, sobre una sola base de datos.',
    resultado: 'Cada animal, lote, corte y despacho trazado de punta a punta, sin doble digitación.',
    metricas: [
      { valor: '6', label: 'apps conectadas' },
      { valor: '1', label: 'fuente de verdad' },
      { valor: '0', label: 'doble digitación' },
    ],
    stack: ['Python', 'FastAPI', 'Supabase', 'PostgreSQL', 'ZPL'],
    visual: 'screenshot',
    image: frigorinoquiaThumb,
  },
  {
    slug: 'tracing-colombina',
    cliente: 'Colombina Conservas',
    industria: 'Manufactura de alimentos',
    tipo: 'Trazabilidad de producción',
    relacion: 'cliente',
    status: 'ejecutado',
    publicado: true,
    featured: true,
    titular: 'La orden de producción semanal convertida en un ciclo de datos que se ve en tiempo real.',
    dolor: 'Órdenes en Excel por correo y formulación en planta sin registro de lote, peso ni bache.',
    solucion: 'Ingesta automática de la orden, captura validada en planta y tablero en vivo para gerencia.',
    resultado: 'Gerencia ve baches, fórmulas y eficiencia del turno mientras la operación ocurre.',
    metricas: [
      { valor: '4', label: 'fases conectadas' },
      { valor: 'En vivo', label: 'tablero de gerencia' },
    ],
    stack: ['Python', 'PostgreSQL', 'pandas', 'Tkinter', 'ZPL'],
    visual: 'formulacion',
  },
  {
    slug: 'feriaapp',
    cliente: 'FeriaApp',
    industria: 'Marketplace ganadero — Orinoquía',
    tipo: 'App móvil · producto propio',
    relacion: 'producto',
    status: 'ejecutado',
    publicado: true,
    featured: true,
    titular: 'Un canal formal de compraventa de ganado, pensado para fincas con poca señal.',
    dolor: 'La compraventa ocurría por contactos y llamadas, sin forma de validar confianza.',
    solucion: 'App móvil con dos roles, chat en tiempo real, reseñas y búsqueda por ubicación.',
    resultado: 'Ganaderos publican gratis y comerciantes negocian con reputación visible.',
    metricas: [
      { valor: '2', label: 'roles' },
      { valor: 'iOS + Android', label: 'un solo código' },
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase'],
    visual: 'marketplace',
    urlExterna: 'https://feria-app.com/',
  },
  {
    slug: 'portafolio-interlink',
    cliente: 'Interlink',
    industria: 'Agencia de marketing digital — Australia',
    tipo: 'Sitios web',
    relacion: 'portafolio',
    status: 'ejecutado',
    publicado: true,
    featured: false,
    titular: 'Seis sitios de producción, cada uno con identidad propia para su industria.',
    dolor: 'Clientes de nichos muy distintos que necesitaban sitios rápidos y memorables.',
    solucion: 'Una base técnica común en Astro con diseño y animación a la medida de cada marca.',
    resultado: 'Seis sitios entregados, con reservas, captura de leads y animación propia.',
    metricas: [{ valor: '6', label: 'sitios entregados' }],
    stack: ['Astro', 'TypeScript', 'GSAP', 'Supabase'],
    visual: 'sitios',
  },
  {
    slug: 'tracing-b4',
    cliente: 'Organizaciones ganaderas campesinas (ACFEC)',
    nombreCorto: 'TRACING B-4.0',
    industria: 'Trazabilidad agroalimentaria bovina',
    tipo: 'Propuesta técnica',
    relacion: 'cliente',
    status: 'propuesta',
    publicado: true,
    featured: false,
    titular: 'Arquitectura completa de trazabilidad bovina offline-first, de la finca al consumidor.',
    dolor: 'Productores campesinos fuera de la trazabilidad formal y con conectividad rural muy baja.',
    solucion: 'App de campo sin conexión, integración con SINIGAN-ICA y código QR al consumidor.',
    resultado: 'Propuesta formulada para Minciencias; no fue financiada ni ejecutada.',
    metricas: [],
    stack: ['RFID', 'Offline-first', 'API SINIGAN', 'QR'],
    visual: 'propuesta',
  },
  {
    slug: 'tesla-gps',
    cliente: 'Tesla GPS',
    industria: 'Instalación y monitoreo de GPS vehicular',
    tipo: 'Plataforma web multirol',
    relacion: 'cliente',
    status: 'ejecutado',
    publicado: false,
    featured: false,
    titular: 'Una plataforma única para órdenes de servicio, clientes, vehículos e inventario serializado.',
    dolor: 'Operación dispersa en hojas de cálculo, sin trazabilidad de dispositivos ni alertas de renovación.',
    solucion: 'Plataforma web con cinco roles y seguridad a nivel de datos.',
    resultado: 'Cada cliente, vehículo, dispositivo y plan trazable en tiempo real.',
    metricas: [
      { valor: '5', label: 'roles' },
      { valor: '10', label: 'módulos' },
    ],
    stack: ['React', 'TypeScript', 'Supabase', 'Cloudflare'],
    visual: 'plataforma',
  },
];

export const casosDeExito = todos.filter((c) => c.publicado);
export const getCaso = (slug: string) => casosDeExito.find((c) => c.slug === slug);
