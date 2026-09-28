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
  /** Date the copy was last revised (BRIEF.md §14); used for dateModified and the sitemap. */
  revisedISO: '2026-09-28',
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
  /**
   * Contact email (BRIEF.md §14.5), kept in two parts. It is assembled by the Email component in the
   * browser and never written into the HTML as one string; the JSON-LD escapes the "@".
   */
  github: 'https://github.com/Cashubski',
  linkedin: 'https://www.linkedin.com/in/m1k',
  company: { name: 'NeuralTake', legalName: 'Neuraltake Limited', url: 'https://neuraltake.com', role: 'Managing Director and AI Engineer', since: 'October 2024' },
  /** A past employer (BRIEF.md §14.5): on the CV, About and in the JSON-LD; not a work. */
  pastEmployer: { name: 'WorldQuant Brain, LLC', role: 'Quantitative Research Consultant', years: 'October 2023 to October 2024' },
  education: [
    { degree: 'MSc Artificial Intelligence and Medical Imaging', classification: 'on track for Distinction', institution: 'UCL', department: 'Department of Medical Physics and Biomedical Engineering', years: '2025 to 2026' },
    { degree: 'BSc (Hons) Computer Science', classification: '2:1', institution: 'City, University of London', department: null as string | null, years: null as string | null },
  ],
  interests: ['reliable ML', 'production AI', 'product building', 'creative experimentation'],
  languages: 'English (native), Polish (native, bilingual)',
  certifications: 'Bloomberg Market Concepts; Thomson Reuters Eikon v4',
  /** The technical skills line from the CV, in its order. */
  technical: 'Python, SQL, PyTorch, scikit-learn, pandas, NumPy, Matplotlib, NiBabel; Django, PostgreSQL, TypeScript, React, REST APIs, GCP, Playwright, CI/CD, Git/GitHub',
} as const;

/** The email for JSON-LD. Base.astro writes its "@" as the JSON escape \u0040, so the address is never plain text in the page. */
/** Contact is by LinkedIn only; the CV and references are available on request. */
export const contactNote = 'CV and references are available on request.';

export const nav = [
  { label: 'Work', href: '/work' },
  { label: 'Research', href: '/research' },
  { label: 'Products', href: '/products' },
  { label: 'Experiments', href: '/experiments' },
  { label: 'About', href: '/about' },
  { label: 'Open source', href: '/open-source' },
  { label: 'CV', href: '/cv' },
] as const;

export const externalLinks = [
  { label: 'GitHub', href: person.github },
  { label: 'LinkedIn', href: person.linkedin },
] as const;

/** Homepage evidence ledger (BRIEF.md §14.1): three entries, each with context; dated where the number changes over time. */
export const ledger = [
  {
    value: '1,027',
    unit: 'MRI acquisitions evaluated',
    context: 'Retrospective prostate DWI dataset, 627 patients, patient-level cross-validation, UCL MSc research.',
    asOf: 'Thesis, October 2025 to August 2026',
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
] as const;

/** Longer notes for the open-source page, keyed by pull request. British English, no invented numbers. */
export const openSourceNotes: Record<string, string> = {
  'https://github.com/domokane/FinancePy/pull/277': 'When the cost of carry equals the riskless rate, the Bjerksund and Stensland exercise boundary is undefined: beta is exactly one and the trigger price divides by zero. The library raised. Just below that point the approximation also fell under the European price, which an American option cannot do. The fix returns the European value where early exercise is never optimal and floors the approximation at the European bound, since both are lower bounds on the American price. Found by checking every American pricer against a 2,000-step binomial tree and against the no-dividend identity.',
  'https://github.com/domokane/FinancePy/pull/278': 'The schedule generator produced the right coupon dates on its first call and different ones on every call after, because the first call replaced the maturity date with its weekend-adjusted version and later calls stepped backwards from that. Most products call the generator twice, so bonds with floating coupons, cross-currency swaps and cliquet options received shifted dates and a spurious one-day stub whenever the maturity fell on a weekend or holiday. One existing test had silently encoded the bug: its stored value included a one-day option that should not exist.',
  'https://github.com/domokane/FinancePy/pull/279': 'The forward-start option class referenced calendar settings it never set, so it could not be constructed, and its valuation loop priced an extra option before the start date. Rewritten as the sequence of at-the-money forward-start options between reset dates, and tested against the Rubinstein 1991 closed form for one period and against the library’s own cliquet option for several.',
  'https://github.com/domokane/FinancePy/pull/280': 'Two error messages concatenated an enum to a string, so an invalid option type raised a Python TypeError from the message itself instead of the library’s FinError.',
  'https://github.com/domokane/FinancePy/pull/281': 'Four of the six Monte Carlo pricing methods returned NaN for every input: they passed the option type in the position the model reserves for the interest rate. A test now prices the same call with all six variants and pins each to the closed form.',
  'https://github.com/domokane/FinancePy/pull/282': 'Under a flat volatility the fair variance strike of a variance swap must equal the squared volatility, whatever the rate and dividend yield. It came out too high by twice the dividend yield, because the log-contract drift used the rate alone and the option portfolio was compounded at the wrong rate, and it crashed on large strike grids. Fixed against the Demeterfi, Derman, Kamal and Zhou replication and verified to within 0.2 percent across rate and yield combinations.',
  'https://github.com/polakowo/vectorbt/pull/872': 'The deflated Sharpe ratio of Bailey and López de Prado uses the raw kurtosis, which is 3 for Gaussian returns and recovers the classic Lo standard error. The implementation passed excess kurtosis, so the variance term was off by three quarters of the squared Sharpe ratio and could turn negative. It also zero-filled missing returns before computing skewness. Both fixed, with tests against the paper’s formula.',
  'https://github.com/polakowo/vectorbt/pull/873': 'Found with a harness that runs every function through both the Numba and Rust engines on clean, gappy, constant and short inputs. The one discrepancy: expanding windows shorter than the minimum period raised an error in Numba and returned NaN in Rust and pandas.',
  'https://github.com/skfolio/skfolio/pull/341': 'Weights are the benchmark plus a linear tilt in cross-sectionally demeaned characteristics, and the few coefficients maximise the realised CRRA utility of the return path, with no expected-return or covariance estimate. The smooth case is concave and solved with a trust-region method using the analytic gradient and Hessian; long-only and transaction-cost variants use a quasi-Newton method. Reviewed in discussion, including a look-ahead bias the reviewer caught and I fixed.',
  'https://github.com/skfolio/skfolio/pull/342': 'Adds streaming updates to the Schur complementary allocation and to the covariance-based distance estimator, so both can be fed new observations without refitting on history. Chunked updates reproduce the batch fit exactly.',
  'https://github.com/skfolio/skfolio/pull/340': 'Turns one panel field into a library of trailing statistics and lags as a single multi-factor exposure, with a policy for listing gaps: either invalidate the lookback or measure it in active observations.',
};

/** The short "now" line on the homepage. */
export const now = {
  label: 'Now',
  text: 'Competing in the 2026 RSNA Knee Abnormality Detection challenge on Kaggle (ongoing), and engineering AI Zuzi for a client through NeuralTake, my consultancy.',
  links: [
    { label: 'RSNA entry', href: '/work/rsna-kaggle' },
    { label: 'AI Zuzi', href: '/work/aizuzi' },
  ],
} as const;

/** The quiet text row under the four homepage cards (BRIEF.md §14.1): the consultancy and the ongoing competition, by link only. */
export const homeAlso = [
  { label: 'NeuralTake', note: 'my consultancy', href: '/work/neuraltake' },
  { label: 'RSNA knee MRI challenge', note: 'ongoing', href: '/work/rsna-kaggle' },
  { label: 'Open source', note: 'eight merged fixes', href: '/open-source' },
] as const;

/**
 * Open-source contributions to quantitative-finance libraries (CV, "Open source" section).
 * Only merged pull requests are listed as merged; the skfolio work is under review and says so.
 * Every link is to the pull request itself, so the claim can be checked.
 */
export const openSource = [
  {
    project: 'FinancePy',
    projectUrl: 'https://github.com/domokane/FinancePy',
    what: 'a derivatives-pricing library',
    when: 'September 2026',
    status: 'six pull requests merged',
    items: [
      { text: 'Fixed the Bjerksund and Stensland American option pricer, which divided by zero at a zero dividend yield and fell below the European price near it; the fix returns the European value when early exercise is never optimal and floors the approximation at the European bound.', href: 'https://github.com/domokane/FinancePy/pull/277' },
      { text: 'Made date-schedule generation repeatable: a second call stepped back from the adjusted maturity date and shifted every coupon date whenever the maturity fell on a weekend or holiday, which reached bonds, cross-currency swaps and cliquet options.', href: 'https://github.com/domokane/FinancePy/pull/278' },
      { text: 'Rewrote the forward-start option, which could not be constructed, and verified it against the Rubinstein closed form and the library’s cliquet option.', href: 'https://github.com/domokane/FinancePy/pull/279' },
      { text: 'Corrected two FX option error paths that raised a Python type error instead of the library’s own error.', href: 'https://github.com/domokane/FinancePy/pull/280' },
      { text: 'Fixed four of the six Monte Carlo pricing methods, which returned NaN for every input because they passed the option type where the model expects the interest rate.', href: 'https://github.com/domokane/FinancePy/pull/281' },
      { text: 'Fixed the variance-swap fair strike, which was too high by twice the dividend yield and crashed on large strike grids, and verified it against the Demeterfi, Derman, Kamal and Zhou replication.', href: 'https://github.com/domokane/FinancePy/pull/282' },
    ],
  },
  {
    project: 'vectorbt',
    projectUrl: 'https://github.com/polakowo/vectorbt',
    what: 'a backtesting library',
    when: 'September 2026',
    status: 'two pull requests merged',
    items: [
      { text: 'Fixed the deflated Sharpe ratio, which used excess kurtosis where the Bailey and López de Prado formula requires raw kurtosis, and which counted missing returns as zero-return periods.', href: 'https://github.com/polakowo/vectorbt/pull/872' },
      { text: 'Made the Numba and Rust engines agree on expanding windows shorter than the minimum period, matching pandas.', href: 'https://github.com/polakowo/vectorbt/pull/873' },
    ],
  },
  {
    project: 'skfolio',
    projectUrl: 'https://github.com/skfolio/skfolio',
    what: 'a scikit-learn-compatible portfolio-optimisation library',
    when: 'September 2026',
    status: 'three estimators under review',
    items: [
      { text: 'A parametric portfolio policy estimator after Brandt, Santa-Clara and Valkanov (2009): weights as a linear function of characteristics, fitted by maximising realised CRRA utility, with long-only and transaction-cost variants.', href: 'https://github.com/skfolio/skfolio/pull/341' },
      { text: 'Online learning for the Schur complementary allocation, so it can be updated in a stream.', href: 'https://github.com/skfolio/skfolio/pull/342' },
      { text: 'A rolling-window multi-factor exposure estimator with gap-tolerant lags.', href: 'https://github.com/skfolio/skfolio/pull/340' },
    ],
  },
] as const;

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

/** Homepage works (BRIEF.md §14.1): two large flagships, then two supporting cards. The other four are reached from `homeAlso` and the index. */
export const homeOrder = ['miqa', 'aizuzi', 'neuralkite', 'chefbot'] as const;
