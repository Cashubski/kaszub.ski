/**
 * Site-wide data. Everything a future edit touches lives here or in the
 * content collection (src/content/work), not in markup.
 * Every value traces to /var/www/kaszubski/BRIEF.md.
 */
export const site = {
  url: 'https://kaszub.ski',
  name: 'Michal Kaszubski',
  /** Used in <title> suffixes and the OG images. */
  shortName: 'kaszub.ski',
  /** Date the verified figures were taken (BRIEF.md v2). */
  factsDate: '15 September 2026',
  factsDateISO: '2026-09-15',
  /** Date the copy was last revised (BRIEF.md §13); used for dateModified and the sitemap. */
  revisedISO: '2026-09-20',
  locale: 'en_GB',
} as const;

/** Stable JSON-LD identifier for the Person, shared by every page that refers to him. */
export const personId = 'https://kaszub.ski/#person';

export const person = {
  name: 'Michal Kaszubski',
  givenName: 'Michal',
  familyName: 'Kaszubski',
  role: 'AI/ML engineer and founder',
  /** Hero supporting sentence (BRIEF.md §2, may be lightly refined). */
  lede: 'I investigate how models fail, build production AI systems and create products that people actually use.',
  location: 'London, UK',
  /** Contact email is a PLACEHOLDER until confirmed: null means the row is omitted or rendered as "on request". */
  email: null as string | null,
  github: 'https://github.com/Cashubski',
  linkedin: 'https://www.linkedin.com/in/m1k',
  company: { name: 'NeuralTake', url: 'https://neuraltake.com' },
  education: [
    { degree: 'MSc in AI and Medical Imaging', institution: 'UCL', years: '2025 to 2026' },
    { degree: 'BSc Computer Science', institution: 'City, University of London', years: null as string | null },
  ],
  interests: ['reliable ML', 'production AI', 'product building', 'creative experimentation'],
} as const;

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Research', href: '/research' },
  { label: 'Products', href: '/products' },
  { label: 'Experiments', href: '/experiments' },
  { label: 'About', href: '/about' },
  { label: 'CV', href: '/cv' },
] as const;

export const externalLinks = [
  { label: 'GitHub', href: person.github },
  { label: 'LinkedIn', href: person.linkedin },
] as const;

/** Homepage evidence ledger (BRIEF.md §4): four entries, each with context; dated where the number changes over time. */
export const ledger = [
  {
    value: '1,027',
    unit: 'MRI acquisitions evaluated',
    context: 'Retrospective prostate DWI dataset, 627 patients, patient-level cross-validation, UCL MSc research.',
    asOf: 'Thesis, 2026',
    kind: 'Research evidence',
  },
  {
    value: 'About 50',
    unit: 'business users',
    context: 'Of AI Zuzi, a production AI platform I engineer for a client through NeuralTake.',
    asOf: 'Stated September 2026',
    kind: 'Commercial validation',
  },
  {
    value: '25,000+',
    unit: 'ChefBot conversations',
    context: 'A GPT-based cooking assistant I designed, rated 4.7 from 100+ ratings on the GPT store. Conversations, not people.',
    asOf: 'GPT store listing, screenshots from September 2026',
    kind: 'User adoption',
  },
  {
    value: '727,000',
    unit: 'views',
    context: 'Combined across an English and a Polish short-form channel, both produced through an automated API pipeline, about 1,000 subscribers each. Views, not unique viewers.',
    asOf: 'YouTube Analytics export, 19 September 2026',
    kind: 'Audience reach',
  },
] as const;

/** The short "now" line on the homepage. */
export const now = {
  label: 'Now',
  text: 'Competing in the 2026 RSNA Knee Abnormality Detection challenge on Kaggle (ongoing), and engineering AI Zuzi for a client through NeuralTake, my consultancy.',
  links: [
    { label: 'RSNA entry', href: '/work/rsna-kaggle' },
    { label: 'AI Zuzi', href: '/work/aizuzi' },
    { label: 'NeuralTake', href: '/work/neuraltake' },
  ],
} as const;

/** The unfiltered index at /work. */
export const indexPage = {
  path: '/work',
  title: 'Index of works',
  description: 'All eight works: two research studies, four products and two automated API pipelines, each with its evidence type, result and where to inspect it.',
  intro: 'Eight works in catalogue order: two research studies, four products and two automated API pipelines. Each card names the kind of evidence it rests on.',
} as const;

/** Category labels and descriptions for the gallery filters and category pages. */
export const categories = {
  research: {
    label: 'Research',
    path: '/research',
    title: 'Research',
    description: 'ML research: model reliability in prostate MRI at UCL, and an ongoing entry to a public RSNA knee MRI benchmark.',
    intro: 'Work judged by scientific standards: patient-level splits, plain status wording, and results only where they exist.',
  },
  products: {
    label: 'Products',
    path: '/products',
    title: 'Products',
    description: 'Production AI systems and commercial delivery: the NeuralTake consultancy, the AI Zuzi client platform, NeuralKite and a GPT-based cooking assistant.',
    intro: 'Work where the evidence is production software, signed contracts and people using the thing.',
  },
  experiments: {
    label: 'Experiments',
    path: '/experiments',
    title: 'Experiments',
    description: 'Automated API pipelines: a fictional artist generated through the Eleven Music API, and one short-form concept turned into two localised videos.',
    intro: 'Automated content pipelines that I built and ran through APIs. The work is pipeline engineering, and the measured outcome is audience response.',
  },
} as const;

export type CategoryKey = keyof typeof categories;

/** Homepage order of works (BRIEF.md §13.3): two large flagships, then AI Zuzi leading the rest. */
export const homeOrder = ['miqa', 'neuraltake', 'aizuzi', 'neuralkite', 'chefbot', 'rsna-kaggle', 'cash-nova', 'multilingual-shorts'] as const;
