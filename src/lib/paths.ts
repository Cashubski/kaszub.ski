/** With build.format 'file', Astro.url.pathname carries ".html"; normalise to the public route. */
export function cleanPath(pathname: string): string {
  const p = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return p === '' ? '/' : p;
}

/** OG image slug for a route: "/" -> "home", "/work/miqa" -> "work-miqa". */
export function ogSlug(path: string): string {
  const p = cleanPath(path);
  return p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '-');
}

export function isActive(current: string, href: string): boolean {
  const c = cleanPath(current);
  if (href === '/') return c === '/';
  return c === href;
}

export function isSection(current: string, href: string): boolean {
  const c = cleanPath(current);
  return href === '/work' && c.startsWith('/work/');
}

/**
 * Display titles: keep a hyphenated word ("AI-native", "gold-labelled") on one line, so a headline never
 * breaks after the hyphen. Returns escaped HTML for `set:html`.
 */
export function titleHtml(text: string): string {
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .split(' ')
    .map((w) => (w.includes('-') ? `<span style="white-space:nowrap">${esc(w)}</span>` : esc(w)))
    .join(' ')
    // A figure stays with its noun ("58 gold-labelled", "4,407 reports").
    .replace(/(^|\s)(\d[\d,.]*) /g, '$1$2&nbsp;');
}
