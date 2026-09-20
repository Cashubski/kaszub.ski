// Prepares the authentic source assets from /var/www/kaszubski/assets for astro:assets.
// One-off step; its outputs are kept in the source tree. Every crop follows BRIEF.md §5, §6 and §10:
//  - AI Zuzi: left-hand feature panel only (testimonial and sign-in form removed)
//  - NeuralTake: hero without the cookie banner
//  - NeuralKite: landing hero; the pipeline-stage row with the company name cropped away (the only
//    permitted still from the demonstration), used as a body figure and as the video poster
//  - Cash Nova: the five album covers that may be shown, and the strongest track's cover
//  - Shorts: consistent 9:16 thumbnails for the two embedded pairs (ids without a real vertical
//    thumbnail are centre-cropped from maxresdefault) and the pair composition for the card
//  - yt_export.py: copied unchanged to public/code for download
// Set IMAGES_OUT to write somewhere other than the project (for comparing before replacing).
import sharp from 'sharp';
import { mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.env.IMAGES_OUT ?? join(dirname(fileURLToPath(import.meta.url)), '..');
const A = '/var/www/kaszubski/assets';
const W = join(root, 'src/assets/work');
const NK = join(W, 'neuralkite');
const CN = join(W, 'cash-nova');
const MS = join(W, 'multilingual-shorts');
const AZ = join(W, 'aizuzi');
const MEDIA = join(root, 'public/media');
const CODE = join(root, 'public/code');
for (const d of [W, NK, CN, MS, AZ, MEDIA, CODE]) mkdirSync(d, { recursive: true });

// AI Zuzi feature panel (source 2880x1800). Crop keeps the headline, tagline and description only:
// the icon rows below the dashed rule (y>759), the testimonial (y>1160) and the form (x>1700) are excluded.
await sharp(join(A, 'raw-aizuzi-home.png')).extract({ left: 0, top: 258, width: 1160, height: 480 })
  .png({ compressionLevel: 9 }).toFile(join(AZ, 'panel.png'));
// NeuralTake hero without cookie banner (banner starts at about y=1577)
await sharp(join(A, 'raw-neuraltake-home.png')).extract({ left: 0, top: 0, width: 2880, height: 1560 })
  .png({ compressionLevel: 9 }).toFile(join(W, 'neuraltake-home.png'));
// NeuralKite landing hero
await sharp(join(A, 'raw-neuralkite-home.png')).extract({ left: 0, top: 0, width: 2880, height: 1520 })
  .png({ compressionLevel: 9 }).toFile(join(NK, 'home.png'));
// NeuralKite pipeline-stage row (permitted still): frame-18, stage row only, company name excluded
await sharp(join(A, 'neuralkite/frame-18.jpg')).extract({ left: 68, top: 196, width: 1564, height: 210 })
  .jpeg({ quality: 88 }).toFile(join(NK, 'stages.jpg'));
// Video poster at the video's own size (the no-JavaScript fallback; with JavaScript LocalVideo lays an HTML cover
// over the player): the permitted stage row, full width, on the site's deep paper
const stages = await sharp(join(NK, 'stages.jpg')).resize({ width: 1564 }).toBuffer();
const sm = await sharp(stages).metadata();
await sharp({ create: { width: 1700, height: 1080, channels: 3, background: '#EBE5D8' } })
  .composite([{ input: stages, left: 68, top: Math.round((1080 - sm.height) / 2) }])
  .jpeg({ quality: 85 }).toFile(join(MEDIA, 'neuralkite-demo-poster.jpg'));
copyFileSync(join(A, 'neuralkite/demo-video.mp4'), join(MEDIA, 'neuralkite-demo.mp4'));
// Portrait
copyFileSync(join(A, 'avatar.jpg'), join(W, 'portrait.jpg'));
// Cash Nova artwork: five album covers and one track cover
for (const f of ['album-gold-coast', 'album-burning-in-the-light', 'album-the-last-lie', 'album-remixes', 'album-midnight-in-cartagena', 'track-sun-comes-up']) {
  copyFileSync(join(A, `cashnova/${f}.webp`), join(CN, `${f}.webp`));
}
// Shorts thumbnails, 9:16, for the two embedded pairs
const thumbs = [
  ['xI79QPSMG8Y', 'cat-safety-en'],
  ['HOlVHw7zaFk', 'cat-safety-pl'],
  ['9GeegzREvX4', 'leftovers-en'],
  ['4qCEGZmO8QI', 'leftovers-pl'],
  ['lF3HxVE3_bY', 'vegetables-en'],
  ['Ppq3D1myxio', 'vegetables-pl'],
];
const fallback = new Set(['4qCEGZmO8QI', 'lh3a-FD4S8E', 'gC9tzkw0avs']);
for (const [id, name] of thumbs) {
  const out = join(MS, `${name}.jpg`);
  if (fallback.has(id)) {
    await sharp(join(A, `shorts/${id}-maxresdefault.jpg`)).extract({ left: 437, top: 0, width: 405, height: 720 }).jpeg({ quality: 86 }).toFile(out);
  } else {
    await sharp(join(A, `shorts/${id}-oardefault.jpg`)).jpeg({ quality: 86 }).toFile(out);
  }
}
// Pair composition for the gallery card: the English cat-safety short beside its Polish adaptation, on paper
const th = async (name) => sharp(join(MS, `${name}.jpg`)).resize({ width: 396, height: 704 }).toBuffer();
await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#EFEBE2' } })
  .composite([{ input: await th('cat-safety-en'), left: 174, top: 48 }, { input: await th('cat-safety-pl'), left: 630, top: 48 }])
  .jpeg({ quality: 86 }).toFile(join(MS, 'pair-cat-safety.jpg'));
// A second composition for the case-study hero and the cards, so the cat-safety pair is seen once, where its counts are discussed
await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#EFEBE2' } })
  .composite([{ input: await th('vegetables-en'), left: 174, top: 48 }, { input: await th('vegetables-pl'), left: 630, top: 48 }])
  .jpeg({ quality: 86 }).toFile(join(MS, 'pair-vegetables.jpg'));
// The analytics exporter, offered for download unchanged
copyFileSync(join(A, 'code/yt_export.py'), join(CODE, 'yt_export.py'));
console.log('images: done');
