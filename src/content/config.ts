// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const casosDeExito = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casos-de-exito' }),
  schema: z.object({
    cliente: z.string(),
    industria: z.string(),
    dolor: z.string(),
    solucion: z.string(),
    capacidades: z.array(z.string()),
    stack: z.array(z.string()),
    resultado: z.string(),
    status: z.enum(['ejecutado', 'propuesta']),
    featured: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { 'casos-de-exito': casosDeExito, blog };
