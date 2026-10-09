// src/data/productos.ts — productos propios de Transformia.
import { productosExternos } from './site';

export interface Producto {
  id: 'vera' | 'feriaapp';
  nombre: string;
  categoria: string;
  titular: string;
  descripcion: string;
  puntos: string[];
  stack: string[];
  url: string;
  dominio: string;
  casoSlug?: string;
}

export const productos: Producto[] = [
  {
    id: 'vera',
    nombre: 'Vera',
    categoria: 'Bot de WhatsApp · IA aplicada',
    titular: 'Valida comprobantes Bre-B por WhatsApp en menos de 10 segundos.',
    descripcion:
      'Los comprobantes de transferencia falsos le cuestan plata a los negocios todos los días. Vera recibe la captura por WhatsApp y la cruza con el SMS o el correo que llega a la cuenta del titular. Si coincide, confirma; si no, queda pendiente para que una persona la apruebe.',
    puntos: [
      'Respuesta en menos de 10 segundos',
      'Acepta comprobantes de cualquier banco',
      'Validación contra SMS y correo del titular',
      'Aprobación humana para los casos dudosos',
    ],
    stack: ['WhatsApp', 'IA de visión', 'Supabase'],
    url: productosExternos.vera,
    dominio: 'verabotcol.com',
  },
  {
    id: 'feriaapp',
    nombre: 'FeriaApp',
    categoria: 'App móvil · Marketplace',
    titular: 'El marketplace ganadero de la Orinoquía.',
    descripcion:
      'Ganaderos publican sus animales gratis y sin límite; comerciantes con membresía buscan por zona, envían solicitudes de compra y negocian por chat. Reseñas visibles para comprar con confianza y una app pensada para funcionar con poca señal en finca.',
    puntos: [
      'Publicación gratuita e ilimitada para ganaderos',
      'Chat en tiempo real y solicitudes de compra',
      'Reseñas y reputación de cada perfil',
      'Búsqueda por departamento y municipio',
    ],
    stack: ['React Native', 'Expo', 'Supabase'],
    url: productosExternos.feriaApp,
    dominio: 'feria-app.com',
    casoSlug: 'feriaapp',
  },
];
