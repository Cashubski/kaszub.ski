// Copies the exact woff2 subsets the site uses from the fontsource packages
// into public/fonts so they can be preloaded with stable URLs. Run once after
// `npm install` (also invoked by `npm run fonts`).
import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'fonts');
mkdirSync(out, { recursive: true });

const files = [
  ['@fontsource-variable/instrument-sans/files', 'instrument-sans-latin-wght-normal.woff2'],
  ['@fontsource-variable/instrument-sans/files', 'instrument-sans-latin-ext-wght-normal.woff2'],
  ['@fontsource-variable/newsreader/files', 'newsreader-latin-opsz-normal.woff2'],
  ['@fontsource-variable/newsreader/files', 'newsreader-latin-ext-opsz-normal.woff2'],
];
for (const [pkg, file] of files) {
  copyFileSync(join(root, 'node_modules', pkg, file), join(out, file));
  console.log('fonts:', file);
}
