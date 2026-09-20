// Writes the favicon set into public/: favicon.svg (source of truth), favicon.ico (PNG-in-ICO, 32px),
// apple-touch-icon.png (180px) and icon-192/512.png. Run once; outputs are committed.
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
mkdirSync(pub, { recursive: true });

// A catalogue plate: paper ground, ink rule at the top, a geometric K, one cobalt square.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#F7F4ED"/>
  <rect width="64" height="5" fill="#151412"/>
  <path d="M18 16v34M18 36l20-20M22 33l20 17" fill="none" stroke="#151412" stroke-width="6" stroke-linecap="square"/>
  <rect x="47" y="45" width="9" height="9" fill="#1B36C4"/>
</svg>`;
writeFileSync(join(pub, 'favicon.svg'), svg);

const png = (size) => sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer();
writeFileSync(join(pub, 'apple-touch-icon.png'), await png(180));
writeFileSync(join(pub, 'icon-192.png'), await png(192));
writeFileSync(join(pub, 'icon-512.png'), await png(512));

// ICO container with a single PNG-compressed 32px entry.
const p32 = await png(32);
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); entry.writeUInt8(32, 1); entry.writeUInt8(0, 2); entry.writeUInt8(0, 3);
entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6); entry.writeUInt32LE(p32.length, 8); entry.writeUInt32LE(22, 12);
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, entry, p32]));
console.log('favicons: done');
