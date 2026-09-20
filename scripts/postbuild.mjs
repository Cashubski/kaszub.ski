// Post-build steps.
// 1. /work shim. The nginx configuration that serves kaszub.ski uses `try_files $uri $uri/ $uri.html =404`.
//    Because `dist/work/` exists (the case studies), nginx answers /work with a 301 to /work/ before it
//    would try /work.html. A copy of the index page at dist/work/index.html makes /work/ render the index
//    instead of a 403. It does NOT remove the redirect: that needs the nginx change described in README.md
//    (`try_files $uri.html $uri $uri/ =404`), after which this shim can be deleted.
// 2. /sitemap.xml. The sitemap integration writes sitemap-index.xml; a copy at /sitemap.xml serves the
//    conventional URL (and the deploy smoke check) as well.
// 3. Unreferenced originals. astro:assets can emit the full-size source of an image next to its resized
//    versions even when no page uses it. Any image in dist/_astro that no HTML, CSS or JS file mentions is removed.
// 4. Image honesty: every <img> candidate must match the aspect ratio of its width and height attributes (fails the build).
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

// 0. Tables. Markdown tables carry no scope and, on phones, are restacked with display: grid, which drops
//    their implicit table semantics. Every header cell gets scope="col" and every table part an explicit
//    ARIA role, written into the HTML so it holds without JavaScript. Runs before the /work shim is copied.
const walkHtml = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walkHtml(p) : p.endsWith('.html') ? [p] : [];
});
let tables = 0;
for (const f of walkHtml(dist)) {
  const html = readFileSync(f, 'utf8');
  if (!html.includes('<table')) continue;
  const out = html
    .replace(/<table(?![^>]*\brole=)/g, '<table role="table"')
    .replace(/<(thead|tbody)(?![^>]*\brole=)/g, '<$1 role="rowgroup"')
    .replace(/<tr(?![^>]*\brole=)/g, '<tr role="row"')
    .replace(/<th(?![a-z])(?![^>]*\bscope=)/g, '<th scope="col" role="columnheader"')
    .replace(/<td(?![^>]*\brole=)/g, '<td role="cell"');
  if (out !== html) { writeFileSync(f, out); tables++; }
}
console.log(`postbuild: table roles and scope written in ${tables} file(s)`);

const src = join(dist, 'work.html');
if (existsSync(src)) {
  mkdirSync(join(dist, 'work'), { recursive: true });
  copyFileSync(src, join(dist, 'work', 'index.html'));
  console.log('postbuild: dist/work/index.html written');
}

const smi = join(dist, 'sitemap-index.xml');
if (existsSync(smi)) {
  copyFileSync(smi, join(dist, 'sitemap.xml'));
  console.log('postbuild: dist/sitemap.xml written');
}

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(dist);
const text = files.filter((f) => ['.html', '.css', '.js', '.xml', '.webmanifest'].includes(extname(f))).map((f) => readFileSync(f, 'utf8')).join('\n');
const astroDir = join(dist, '_astro');
let removed = 0;
if (existsSync(astroDir)) {
  for (const f of readdirSync(astroDir)) {
    if (!['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(extname(f).toLowerCase())) continue;
    if (!text.includes(f) && !text.includes(encodeURI(f))) {
      rmSync(join(astroDir, f));
      removed++;
    }
  }
}
console.log(`postbuild: ${removed} unreferenced image(s) removed from dist/_astro`);

// 4. Image honesty. Every srcset candidate (and the src) of an <img> must have the aspect ratio its
//    width and height attributes claim. astro:assets never upscales: a crop requested wider than its
//    source silently falls back to the uncropped original, which then sits off-centre in its box on
//    high-density screens. This check fails the build if that ever happens again.
const sharp = (await import('sharp')).default;
const dims = new Map();
const sizeOf = async (rel) => {
  if (!dims.has(rel)) {
    const p = join(dist, decodeURI(rel));
    dims.set(rel, existsSync(p) ? await sharp(p).metadata().then((m) => [m.width, m.height]) : null);
  }
  return dims.get(rel);
};
const bad = [];
for (const f of walkHtml(dist)) {
  const html = readFileSync(f, 'utf8');
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    const attr = (n) => tag.match(new RegExp(`\\b${n}="([^"]*)"`))?.[1];
    const w = Number(attr('width')), h = Number(attr('height'));
    if (!w || !h) continue;
    const urls = [attr('src'), ...(attr('srcset') ?? '').split(',').map((c) => c.trim().split(/\s+/)[0])].filter((u) => u && u.startsWith('/_astro/'));
    for (const u of new Set(urls)) {
      const d = await sizeOf(u);
      if (!d) { bad.push(`${f.replace(dist, '')}: ${u} is missing`); continue; }
      if (Math.abs(d[0] / d[1] - w / h) / (w / h) > 0.02) bad.push(`${f.replace(dist, '')}: ${u} is ${d[0]}x${d[1]}, but the img claims ${w}x${h}`);
      if (d[0] > w * 1.01 && u === attr('src')) bad.push(`${f.replace(dist, '')}: src ${u} is ${d[0]} px wide, wider than its width attribute ${w}`);
    }
  }
}
if (bad.length) {
  console.error(`postbuild: ${bad.length} image candidate(s) do not match their declared ratio:\n  ${bad.join('\n  ')}`);
  process.exit(1);
}
console.log('postbuild: every img candidate matches its declared aspect ratio');
