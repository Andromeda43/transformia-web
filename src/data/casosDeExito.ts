// src/data/casosDeExito.ts
import type { ImageMetadata } from 'astro';
import frigorinoquiaThumb from '../assets/casos-de-exito/frigorinoquia/screenshot-reporte-beneficio-animales.png';

export interface CasoDeExito {
  slug: string;
  cliente: string;
  industria: string;
  resultadoCorto: string;
  status: 'ejecutado' | 'propuesta';
  featured: boolean;
  image?: ImageMetadata;
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
    image: frigorinoquiaThumb,
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
