// src/lib/seo/article.ts
export interface ArticleSchemaInput {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  url: string;
  image: string;
}

export function articleSchema({ title, description, pubDate, updatedDate, url, image }: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    url,
    image,
    author: {
      '@type': 'Organization',
      name: 'Transformia',
    },
  };
}
