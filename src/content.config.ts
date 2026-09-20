import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Fixed vocabulary of evidence labels (BRIEF.md §4). */
export const EVIDENCE = [
  'Research evidence',
  'Production deployment',
  'Commercial validation',
  'User adoption',
  'Public benchmark',
  'Audience reach',
  'Creative experiment',
] as const;

export const CATEGORIES = ['research', 'products', 'experiments'] as const;

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      /** Short name used in the index, nav-like contexts and OG images. */
      title: z.string().min(2).max(60),
      /** Longer editorial title for the case-study page and large cards. */
      editorialTitle: z.string().min(2).max(120),
      /** One-line summary answering "what is it?". */
      summary: z.string().min(20).max(260),
      category: z.enum(CATEGORIES),
      /** Michal's role, one line. */
      role: z.string().min(3).max(120),
      /** Year or span, e.g. "2025 to 2026", "2024 to present". Omit while unknown: nothing is printed in its place. */
      years: z.string().min(2).max(40).optional(),
      /** Honest status wording (see BRIEF.md per project). */
      status: z.string().min(3).max(160),
      /** Empty while no evidence can yet be inspected: the card and metadata then print 'None yet verified'. */
      evidence: z.array(z.enum(EVIDENCE)).max(3),
      /** A short qualifier printed in muted ink beside the evidence labels while a label cannot yet be inspected. */
      evidenceNote: z.string().min(3).max(60).optional(),
      technologies: z.array(z.string().min(1).max(40)).min(1).max(10),
      /** The result line shown on cards: numbers with context and dates, never bare. */
      result: z.string().min(10).max(260),
      links: z
        .array(
          z.object({
            label: z.string().min(2).max(80),
            href: z.url().or(z.string().startsWith('/')),
            external: z.boolean().default(false),
            /** Same-site file offered as a download (adds the `download` attribute wherever the link renders). */
            download: z.boolean().default(false),
          }),
        )
        .default([]),
      /** Cover image processed by astro:assets. Omit when no authentic asset exists. */
      cover: image().optional(),
      coverAlt: z.string().max(300).optional(),
      /** Crop anchor for card crops (sharp position), e.g. "top", "left top", "centre". */
      coverPosition: z.string().max(20).default('top'),
      /**
       * How the cover fills its slot. 'cover' crops it to the slot's ratio; 'inset' keeps the
       * image's own ratio and lays it as a smaller print on a paper-deep plate (for a wide crop
       * that should not dominate). 'natural' shows the whole capture at its own ratio, scaled down and
       * never cropped (for a screenshot whose navigation would otherwise be cut mid-word).
       */
      coverFit: z.enum(['cover', 'inset', 'natural']).default('cover'),
      /** A compact card: small cover, no role or tools rows. For supporting work that should not dominate. */
      compact: z.boolean().default(false),
      /** Caption under the cover plate on the case-study page (what it is, when it was taken). */
      coverCaption: z.string().max(300).optional(),
      /** Short caption under the cover on the homepage flagship plate, so a screenshot reads as a quoted artefact. */
      cardCaption: z.string().max(120).optional(),
      /** Short word before the cover caption ("Screenshot", "Artwork", "Thumbnails"). */
      coverLabel: z.string().max(40).optional(),
      /** Method schematic rendered as the plate when no authentic image exists. */
      schematic: z.enum(['miqa', 'rsna', 'chefbot']).optional(),
      /**
       * Typographic plate used on cards when no image exists. Two constructions, so adjacent
       * plates never share a template: 'figure' sets one verified figure large in the serif with
       * its context beneath and a short ruled list; 'line' sets a single serif sentence over a
       * hairline and a dated sans context, with no large figure.
       */
      plate: z
        .object({
          kind: z.enum(['figure', 'line']).default('figure'),
          /** The large figure (kind 'figure', at most 24 characters) or the serif sentence (kind 'line'). */
          figure: z.string().min(1).max(140),
          caption: z.string().min(3).max(200),
          /** Set the plate in the ink-dark register on every page (the primary flagship). */
          ink: z.boolean().default(false),
          /** Up to three further verified figures set as a ruled list at the foot of a 'figure' plate. */
          lines: z
            .array(z.object({ value: z.string().min(1).max(24), context: z.string().min(3).max(120) }))
            .max(3)
            .default([]),
        })
        .optional(),
      /** Lead placeholder for a case study with no authentic imagery and no schematic: a serif line and a dated note. */
      leadPlaceholder: z.object({ text: z.string().min(3).max(160), note: z.string().min(3).max(200) }).optional(),
      /** Catalogue number and homepage order (1 = first). */
      order: z.number().int().min(1).max(99),
      featured: z.boolean().default(false),
      flagship: z.boolean().default(false),
      /** Optional dated metrics used in evidence sections and JSON-LD. */
      metrics: z
        .array(
          z.object({
            value: z.string().min(1).max(60),
            context: z.string().min(3).max(240),
            asOf: z.string().min(4).max(40).optional(),
          }),
        )
        .optional(),
      /** JSON-LD type for the case study. */
      schemaType: z.enum(['CreativeWork', 'SoftwareApplication', 'ScholarlyArticle', 'Thesis']).default('CreativeWork'),
      /** schema.org applicationCategory, only for schemaType SoftwareApplication. */
      applicationCategory: z.string().max(40).optional(),
      /** Meta description for search results and link previews (at most 160 characters); falls back to summary. */
      seoDescription: z.string().min(40).max(160).optional(),
    })
    .refine((d) => d.cover || d.plate, { message: 'Each work needs either a cover image or a typographic plate.' })
    .refine((d) => !d.plate || d.plate.kind === 'line' || d.plate.figure.length <= 24, { message: "A 'figure' plate's figure is at most 24 characters." })
    .refine((d) => !d.cover || d.coverAlt, { message: 'A cover image needs coverAlt.' }),
});

export const collections = { work };
