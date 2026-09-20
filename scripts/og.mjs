// Generates one 1200x630 Open Graph PNG per page into public/og/ (and into dist/og/ when a
// build exists) by rendering scripts/og-template.html with Playwright. Runs as the last step
// of `npm run build`. Page copy comes from src/data/site.ts (static pages) and the case-study
// frontmatter, so nothing here needs editing when content changes.
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/neuraltake/node_modules/playwright');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'og');
const distDir = join(root, 'dist', 'og');
mkdirSync(outDir, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Minimal frontmatter reader for the scalar fields the card needs (title, editorialTitle, summary, category, years). */
function frontmatter(file) {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z]+):\s*(.+)$/);
    if (kv) out[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }
  return out;
}

const categoryLabel = { research: 'Research', products: 'Products', experiments: 'Experiments' };
const pages = [
  { slug: 'home', kicker: 'AI/ML engineer and founder, London', title: 'Michal Kaszubski', summary: 'I investigate how models fail, build production AI systems and create products that people actually use.', footer: 'portfolio' },
  { slug: 'work', kicker: 'Index of works', title: 'Eight works, three kinds of evidence', summary: 'Research, products and experiments, each labelled by the evidence behind it and dated where the figures change.', footer: 'index of works' },
  { slug: 'research', kicker: 'Works filtered by category', title: 'Research', summary: 'Rigorous ML research: prostate MRI quality assessment at UCL and a public RSNA knee MRI benchmark.', footer: 'research' },
  { slug: 'products', kicker: 'Works filtered by category', title: 'Products', summary: 'Production AI systems and commercial delivery: the NeuralTake consultancy, the AI Zuzi client platform, NeuralKite and a GPT-based cooking assistant.', footer: 'products' },
  { slug: 'experiments', kicker: 'Works filtered by category', title: 'Experiments', summary: 'Automated content pipelines built on APIs: a fictional artist generated through the Eleven Music API, and one short-form concept turned into an English and a Polish video.', footer: 'experiments' },
  { slug: 'about', kicker: 'About', title: 'I like models that know their limits and products that people keep using.', summary: 'UCL MSc in AI and Medical Imaging. Founder and AI engineer at NeuralTake. London, UK.', footer: 'about' },
  { slug: 'cv', kicker: 'Curriculum vitae', title: 'Michal Kaszubski', summary: 'AI/ML engineer and founder in London: research, production systems and products with dated evidence.', footer: 'curriculum vitae' },
  { slug: '404', kicker: 'Error 404', title: 'Nothing at this address.', summary: 'There is no page here. It may have moved, or the link was mistyped.', footer: 'not found' },
];
const workDir = join(root, 'src', 'content', 'work');
for (const f of readdirSync(workDir).filter((f) => f.endsWith('.mdx'))) {
  const fm = frontmatter(join(workDir, f));
  const slug = f.replace(/\.mdx$/, '');
  pages.push({
    slug: `work-${slug}`,
    kicker: fm.years ? `${categoryLabel[fm.category] ?? 'Work'}, ${fm.years}` : (categoryLabel[fm.category] ?? 'Work'),
    title: fm.editorialTitle ?? fm.title ?? slug,
    summary: fm.summary ?? '',
    footer: `case study: ${fm.title ?? slug}`,
  });
}

// Fonts are inlined as data URIs: a page created with setContent cannot fetch file:// resources.
const fontsDir = join(root, 'public', 'fonts');
const template = readFileSync(join(root, 'scripts', 'og-template.html'), 'utf8').replace(
  /url\('\{\{fonts\}\}\/([^']+\.woff2)'\)/g,
  (_, file) => `url('data:font/woff2;base64,${readFileSync(join(fontsDir, file)).toString('base64')}')`,
);
const fonts = pathToFileURL(fontsDir).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const p of pages) {
  const vars = { fonts, kicker: esc(p.kicker), titleClass: p.title.length > 44 ? 'long' : '', title: esc(p.title), summary: esc(p.summary), footer: esc(p.footer) };
  const html = template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load("400 78px 'Newsreader'"),
      document.fonts.load("400 27px 'Instrument Sans'"),
      document.fonts.load("500 22px 'Instrument Sans'"),
    ]);
    await document.fonts.ready;
  });
  const file = join(outDir, `${p.slug}.png`);
  await page.screenshot({ path: file, type: 'png' });
  if (existsSync(join(root, 'dist'))) {
    mkdirSync(distDir, { recursive: true });
    copyFileSync(file, join(distDir, `${p.slug}.png`));
  }
  console.log('og:', `${p.slug}.png`);
}
await browser.close();
