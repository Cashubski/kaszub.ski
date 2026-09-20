import Lenis from 'lenis';
/**
 * kaszub.ski motion system. No dependencies; CSS does the animating (src/styles/motion.css), this
 * file only decides WHEN: it tags elements, watches them with one IntersectionObserver and adds
 * `.is-in`. Everything is gated behind the `js` class that the inline script in <head> sets (and
 * withholds under prefers-reduced-motion), so without JS, or if the observer never reports, the
 * page is simply fully visible.
 *
 * Declarative API
 *   data-reveal            text block: rises 18px, fades and de-blurs
 *   data-reveal="block"    large block (figure, card, table): rises and fades, never blurred
 *   data-reveal="fade"     opacity only
 *   data-reveal="mask"     display heading: words rise from a clipped baseline
 *   data-reveal="off"      opt out (also stops the automatic prose defaults)
 *   data-reveal-group[="block|fade"]   every child is revealed, staggered
 *   data-rule[="ink"]      the element's top hairline draws from left to right
 *   data-count             the first number in the text counts up once; ends on the written string
 *   data-draw              an svg (or a wrapper of svgs): strokes draw, bars grow, labels fade in
 *   data-parallax          CSS scroll-driven where supported; otherwise driven from here
 *   data-slide="selector"  a sliding underline for the links matched inside (nav, gallery filters)
 * Automatic: direct children of `.prose` and any figure-sized svg inside `.prose` / `.cs__plate`.
 */
const d = document;
const root = d.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = d) => Array.from(r.querySelectorAll<T>(s));
const BIG = 'figure,table,dl,details,video,section,.table-wrap,.print,.ph';
// Containers that stay put (full-bleed bands, layout grids): their children are revealed instead.
const INNER = '.inkband,.ink,.eband,.eband__list,.eband__after,.spread,.pairs,.offset,.decisions';

/** Words (runs between ordinary spaces) become inline-block spans that CSS lifts from a clipped baseline. */
function mask(el: HTMLElement) {
  const out = d.createDocumentFragment();
  let cur: HTMLElement | null = null, i = 0;
  const word = () => {
    if (!cur) { cur = d.createElement('span'); cur.className = 'mw'; cur.style.setProperty('--i', String(i++)); out.append(cur); }
    return cur;
  };
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType !== 3) { word().append(n); continue; }
    for (const t of (n as Text).data.split(/([ \n\t]+)/)) {
      if (!t) continue;
      if (t.trim()) word().append(t); else { cur = null; out.append(' '); }
    }
  }
  el.replaceChildren(out);
  // The whole title lands within 900ms however many words it has.
  el.style.setProperty('--ms', `${Math.min(70, 260 / i)}ms`);
}

function count(el: HTMLElement) {
  const full = el.textContent ?? '', s = /\d[\d,]*(?:\.\d+)?/.exec(full)?.[0];
  if (!s) return;
  const dec = (s.split('.')[1] ?? '').length, end = Number(s.replace(/,/g, '')), t0 = performance.now();
  const tick = (now: number) => {
    const k = Math.min(1, (now - t0) / 1200);
    let v = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec);
    v = s.includes(',') ? v.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : v.padStart(s.length, '0');
    el.textContent = k < 1 ? full.replace(s, v) : full;
    if (k < 1) requestAnimationFrame(tick);
  };
  tick(t0);
}

/** Classifies an svg's marks once: open strokes draw, solid bars grow from their base, the rest fades in after. */
function prepDraw(svg: SVGSVGElement) {
  let s = 0, f = 0;
  for (const el of $<SVGGraphicsElement>('path,line,polyline,polygon,rect,circle,ellipse,text,image', svg)) {
    const cs = getComputedStyle(el), geo = 'getTotalLength' in el && el.tagName !== 'text';
    const open = geo && (cs.fill === 'none' || el.tagName === 'line') && cs.stroke !== 'none' && cs.strokeDasharray === 'none' && !el.getAttribute('marker-end');
    let kind = 'f';
    if (open) { kind = 's'; el.setAttribute('pathLength', '1'); }
    else if (el.tagName === 'rect' && cs.stroke === 'none' && cs.fill !== 'none' && cs.fillOpacity !== '0') {
      const w = (el as SVGRectElement).width.baseVal.value, h = (el as SVGRectElement).height.baseVal.value;
      if (w > 5 && h > 5 && cs.fill !== 'rgba(0, 0, 0, 0)') kind = w > h * 1.5 ? 'bx' : 'by';
    }
    el.classList.add('dr', `dr-${kind}`);
    el.style.setProperty('--d', `${kind === 'f' ? 450 + Math.min(f++, 40) * 12 : Math.min(s++, 14) * 45}ms`);
  }
}

/** One underline that slides between the links of a nav or filter row. */
function slide(box: HTMLElement) {
  if (box.dataset.slideOn) return;
  box.dataset.slideOn = '1';
  const ind = d.createElement('span');
  ind.className = 'ind';
  ind.setAttribute('aria-hidden', 'true');
  box.append(ind);
  const links = () => $<HTMLAnchorElement>(box.dataset.slide || 'a', box);
  const active = () => links().find((a) => a.matches('[aria-current],.is-active,.is-section'));
  const to = (a?: Element | null) => {
    if (!a || !(a as HTMLElement).offsetParent) { ind.style.opacity = '0'; return; }
    const range = d.createRange();
    range.selectNodeContents(a);
    const r = range.getBoundingClientRect(), b = box.getBoundingClientRect();
    ind.style.opacity = a.matches('.is-section') ? '0.5' : '1';
    ind.style.width = `${r.width}px`;
    ind.style.transform = `translate(${r.left - b.left}px,${r.bottom - b.top + 3}px)`;
  };
  const rest = () => to(active());
  rest();
  requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('ind-on')));
  if (box.hasAttribute('data-slide-hover')) {
    box.addEventListener('pointerover', (e) => { const a = (e.target as Element).closest('a'); if (a && links().includes(a)) to(a); });
    box.addEventListener('pointerleave', rest);
    box.addEventListener('focusin', (e) => to((e.target as Element).closest('a')));
    box.addEventListener('focusout', rest);
  }
  new MutationObserver(rest).observe(box, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  addEventListener('resize', rest);
  d.fonts?.ready.then(rest);
}

function init() {
  // Header: condensed state and hairline after the first few pixels of scroll (not an animation, so it runs regardless).
  const head = d.querySelector<HTMLElement>('.site-head');
  const scrolled = () => head?.classList.toggle('is-scrolled', scrollY > 12);
  if (head && !head.dataset.on) { head.dataset.on = '1'; addEventListener('scroll', scrolled, { passive: true }); scrolled(); }

  if (!root.classList.contains('js') || !('IntersectionObserver' in window)) return;

  // Automatic defaults for MDX prose: every direct child is revealed; known containers reveal their children instead.
  // Heights are read in one pass before anything is written: a tall text block is never blurred.
  const auto = $('.prose > *, .prose :is(' + INNER + ') > *, .prose > :is(ul, ol) > li, .prose > .table-wrap tbody > tr')
    .filter((el) => !el.hasAttribute('data-reveal') && !el.closest('[data-reveal="off"]') && !el.matches(INNER + ',ul,ol'))
    .map((el) => [el, el.matches(BIG) || el.offsetHeight > 300 || !!el.querySelector('img,svg,video,table')] as const);
  for (const [el, big] of auto) {
    el.setAttribute('data-reveal', big ? 'block' : '');
    if (el.matches('h2:not(.inkband__title)')) el.setAttribute('data-rule', '');
  }
  $('[data-reveal-group]').forEach((g) => Array.from(g.children).forEach((c) => c.hasAttribute('data-reveal') || c.setAttribute('data-reveal', g.dataset.revealGroup ?? '')));
  $('[data-reveal="mask"]:not(.is-split)').forEach((el) => { mask(el); el.classList.add('is-split'); });
  for (const svg of $<SVGSVGElement>('.prose svg, .cs__plate svg, svg[data-draw], [data-draw] svg')) {
    if (svg.dataset.drawn || svg.viewBox.baseVal.width < 100 || svg.closest('[data-draw="off"]')) continue;
    svg.dataset.drawn = '1';
    prepDraw(svg);
    if (!svg.closest('[data-draw]')) svg.parentElement?.setAttribute('data-draw', '');
  }
  $('[data-slide]').forEach(slide);

  let first = true;
  const io = new IntersectionObserver((entries) => {
    root.dataset.motion = '1';
    let i = 0;
    for (const e of entries) {
      const el = e.target as HTMLElement;
      // Anything already above the viewport (anchor jumps, restored scroll) is shown without ceremony.
      if (!e.isIntersecting && e.boundingClientRect.bottom > 0) continue;
      // A drawing waits until a third of it is on screen, so the strokes are seen being made.
      if (e.isIntersecting && el.hasAttribute('data-draw') && e.intersectionRatio < 0.3 && e.boundingClientRect.height < innerHeight) continue;
      io.unobserve(el);
      if (e.isIntersecting) {
        // The first batch is what is on screen at load: quicker and tighter, done inside 900ms.
        el.style.setProperty('--d', `${Math.min(i++, 5) * (first ? 50 : 80)}ms`);
        if (first) el.style.setProperty('--t', '0.6s');
        if (el.hasAttribute('data-count')) count(el);
      }
      el.classList.add('is-in');
    }
    first = false;
  }, { rootMargin: '0px 0px -10% 0px', threshold: [0, 0.3] });
  for (const el of $('[data-reveal]:not([data-reveal="off"]), [data-rule], [data-count], [data-draw]')) {
    if (!el.dataset.seen) { el.dataset.seen = '1'; io.observe(el); }
  }

  // Parallax and reading progress are CSS scroll-driven animations; this is the fallback where those are unsupported.
  if (!CSS.supports('animation-timeline: view()') && !root.dataset.scrollFb) {
    root.dataset.scrollFb = '1';
    let queued = false;
    const frame = () => {
      queued = false;
      const vh = innerHeight;
      root.style.setProperty('--progress', String(Math.min(1, scrollY / Math.max(1, root.scrollHeight - vh))));
      for (const el of $('[data-parallax]')) {
        const r = el.getBoundingClientRect();
        if (r.bottom > -40 && r.top < vh + 40) el.style.setProperty('--py', `${((r.top + r.height / 2) / vh - 0.5) * 24}px`);
      }
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
    frame();
  }
}

init();
// If Astro's client router is ever enabled, the same init runs after each swap; every step above is idempotent.
d.addEventListener('astro:page-load', init);


/* Inertia scrolling. Wheel and trackpad input is eased; touch keeps the platform's own momentum. Off under
   reduced motion. The window is still scrolled natively, so sticky elements, scroll-driven CSS, anchors and the
   IntersectionObserver reveals all keep working. */
(() => {
  const w = window as unknown as { __lenis?: Lenis };
  if (w.__lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false, anchors: { offset: -80 } });
  w.__lenis = lenis;
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
})();
