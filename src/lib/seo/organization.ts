// src/lib/seo/organization.ts
import { contacto, empresa } from '../../data/site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: empresa.nombre,
    legalName: empresa.razonSocial,
    taxID: empresa.nit,
    slogan: empresa.eslogan,
    url: empresa.url,
    logo: `${empresa.url}/favicon.svg`,
    description: empresa.descripcion,
    email: contacto.email,
    telephone: contacto.telefonoE164,
    address: {
      '@type': 'PostalAddress',
      addressLocality: empresa.ubicacion.ciudad,
      addressRegion: empresa.ubicacion.region,
      addressCountry: empresa.ubicacion.pais,
    },
    areaServed: ['CO', 'LatAm'],
  };
}
