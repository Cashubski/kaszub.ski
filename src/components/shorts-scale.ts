/** Small drawing helpers shared by the Shorts* chart components. No dependencies. */
import data from '../data/shorts/analytics.json';

export const analytics = data;

export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
export const log10 = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  r0 + ((Math.log10(v) - Math.log10(d0)) / (Math.log10(d1) - Math.log10(d0))) * (r1 - r0);
export const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
export const num = (v: number) => Math.round(v).toLocaleString('en-GB');
export const pct = (share: number, digits = 0) => `${(share * 100).toFixed(digits)}%`;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "2026-09-19" to "19 September 2026" */
export const longDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} ${months[m - 1]} ${y}`;
};
export const dayNumber = (iso: string) => Math.round(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / 86400000);

/** One sentence reused in every chart caption: the range and the export date, both from manifest.json via the aggregates file. */
export const sourceLine = `YouTube Analytics, ${longDate(data.en.range.start)} to ${longDate(data.en.range.end)}; exported ${longDate(data.en.exported_at)}.`;

/** Every chart is drawn twice, for the text column and for a phone, and CSS shows one. */
export interface Variant { key: 'wide' | 'narrow'; W: number; H: number; }
export const series = { en: 'CleverFacts, English', pl: 'Ogarnik, Polish' };
