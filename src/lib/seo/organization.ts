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
