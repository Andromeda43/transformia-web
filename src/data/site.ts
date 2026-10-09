// src/data/site.ts
// Datos oficiales de la empresa. Única fuente de verdad para contacto, marca y navegación.

export const empresa = {
  nombre: 'Transformia',
  razonSocial: 'Transformia Zomac SAS',
  nit: '901868040',
  eslogan: 'De la idea a la operación.',
  descripcion:
    'Transformia diseña y construye software a la medida para empresas en Colombia y LatAm: plataformas web, apps móviles, automatización e inteligencia artificial aplicada. Especialistas en sistemas de trazabilidad.',
  ubicacion: { ciudad: 'Tauramena', region: 'Casanare', pais: 'CO' },
  url: 'https://transformia.dev',
} as const;

export const contacto = {
  telefono: '+57 300 823 4881',
  telefonoE164: '+573008234881',
  email: 'info@transformia.dev',
  whatsappBase: 'https://wa.me/573008234881',
} as const;

export function whatsappLink(mensaje = 'Hola, quiero contarles sobre un proyecto de software.') {
  return `${contacto.whatsappBase}?text=${encodeURIComponent(mensaje)}`;
}

export const productosExternos = {
  vera: 'https://www.verabotcol.com/',
  feriaApp: 'https://feria-app.com/',
} as const;

export const navegacion = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos-de-exito', label: 'Casos' },
  { href: '/productos', label: 'Productos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/blog', label: 'Blog' },
] as const;
