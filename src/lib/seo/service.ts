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
