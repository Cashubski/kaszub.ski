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
  revisedISO: '2026-10-25',
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
  'https://github.com/domokane/FinancePy/pull/283': 'The FX variance swap class could not run at all. Once it did, it carried the same two dividend defects as the equity version fixed earlier, with the foreign rate in place of the dividend yield. Both classes also divided realised variance by the number of observations instead of the number of returns, which understates it by one part in N.',
  'https://github.com/domokane/FinancePy/pull/284': 'The double digital still had the payout-currency errors that had already been corrected in the single digital. A domestic cash payout was discounted at the foreign rate, and a payout of one unit of foreign currency, which is an asset-or-nothing claim, used the cash-or-nothing probability term. A range digital is a digital call at the lower strike less one at the upper strike, so the tests pin it to that difference in both currencies.',
  'https://github.com/domokane/FinancePy/pull/285': 'The rainbow option read an attribute it never set, so it could not be priced. In its one-factor model the correlation of the two rates is the product of their loadings, but the code squared the first and ignored the second, and the Monte Carlo passed the loadings where a correlation matrix was expected. After the fix it matches the equity rainbow option (Stulz 1982) for all four payoffs. FX option rho called a curve method that does not exist.',
  'https://github.com/domokane/FinancePy/pull/286': 'SABR is the market-standard smile model for interest-rate options. In the library the variable holding one minus beta was overwritten by the correlation term before the denominator of the Hagan formula was formed, so the smile was right at the money and wrong away from it. With beta zero and no volatility of volatility, SABR is the Bachelier model and its Black volatility is known exactly: on a 3 percent forward the library was 215 basis points of volatility too high at a 1 percent strike, against 3 for the textbook formula. The fix renames one variable in three places.',
  'https://github.com/domokane/FinancePy/pull/287': 'The swaption volatility surface compared a numpy grid with an empty list, so its calibration check always raised, and its printed summary had been copied from the FX surface and referred to attributes it never sets. Its fixed-beta SABR fits started from zero parameters, which divided by zero for beta one and left beta one half three volatility points off a smooth smile.',
  'https://github.com/domokane/FinancePy/pull/412': 'The premium leg of a credit default swap pays the running spread on each coupon date if the reference entity survives, plus the accrued portion on default. The first coupon was accrued over the length of the next period instead of the current one, a leftover from an older layout of the accrual factors that had a leading zero. The difference is a few days of accrual, about 0.06 percent of the risky PV01 on a five-year contract. In the final coupon period there is no next period, so the compiled kernel read past the end of the array and returned a negative clean PV01 and a par spread of minus 248 basis points. The fix is a one-index change; fifteen pinned regression values across the CDS, index, option and tranche tests moved by 0.05 to 0.5 percent and were updated with an instrumented run.',
  'https://github.com/domokane/FinancePy/pull/411': 'Adjusting single-name curves so that the portfolio reprices a traded index is standard in index and tranche pricing. The spread-based version started its iteration counter at the value its loop condition tests for convergence, so the loop never ran and the input curves were returned unchanged. Once the loop did run it called a method renamed a month earlier. With both fixed, ten random issuer curves with a 176 basis-point intrinsic spread reprice to 100 and 150 basis-point index coupons, and non-zero upfronts match to one part in a million of notional.',
  'https://github.com/domokane/FinancePy/pull/414': 'The party paying the fixed rate on a forward rate agreement receives the difference between the realised and contract rates, so the contract gains when the forward rises. The library flipped that sign, with comments in the code questioning it, so a pay-fixed FRA struck at 3 percent was worth minus 4,811 on a million notional with the forward at 4.08 percent while a pay-fixed swap on the same curve was positive. Curve bootstraps were unaffected because they solve for a zero value.',
  'https://github.com/domokane/FinancePy/pull/410': 'Pricing a floating-rate note from its discount margin read the previous and next coupon dates from attributes that were only set as a side effect of the accrued-interest method, so calling the pricer first raised an error and calling it later for another settlement date silently reused the old coupon period. The lookup now lives in one helper both methods call.',
  'https://github.com/polakowo/vectorbt/pull/872': 'The deflated Sharpe ratio of Bailey and López de Prado uses the raw kurtosis, which is 3 for Gaussian returns and recovers the classic Lo standard error. The implementation passed excess kurtosis, so the variance term was off by three quarters of the squared Sharpe ratio and could turn negative. It also zero-filled missing returns before computing skewness. Both fixed, with tests against the paper’s formula.',
  'https://github.com/polakowo/vectorbt/pull/873': 'Found with a harness that runs every function through both the Numba and Rust engines on clean, gappy, constant and short inputs. The one discrepancy: expanding windows shorter than the minimum period raised an error in Numba and returned NaN in Rust and pandas.',
  'https://github.com/skfolio/skfolio/pull/341': 'Weights are the benchmark plus a linear tilt in cross-sectionally demeaned characteristics, and the few coefficients maximise the realised CRRA utility of the return path, with no expected-return or covariance estimate. The smooth case is concave and solved with a trust-region method using the analytic gradient and Hessian; long-only and transaction-cost variants use a quasi-Newton method. Reviewed in discussion, including a look-ahead bias the reviewer caught and I fixed.',
  'https://github.com/skfolio/skfolio/pull/342': 'Adds streaming updates to the Schur complementary allocation and to the covariance-based distance estimator, so both can be fed new observations without refitting on history. Chunked updates reproduce the batch fit exactly.',
  'https://github.com/skfolio/skfolio/pull/445': 'The regime-adjusted exponentially weighted covariance scales its forecast by a short-term volatility multiplier built from the norm of a standardised return vector. For the diagonal target the norm was divided by the square root of the number of assets, but the expected norm of a standard Gaussian vector is the mean of a chi distribution, which is smaller: dividing by the square root of n biases the multiplier below one even when the risk scale is right, by 35 percent of variance for one asset and 9 percent for five. The fix divides by the expected chi statistic, as the Mahalanobis target already did. The maintainer agreed with the derivation, noted it also holds for Gaussian scale mixtures such as multivariate Student-t returns, and found that the change improved the QLIKE loss of next-day variance forecasts on the library’s stock dataset over 2011 to 2022.',
  'https://github.com/domokane/FinancePy/pull/415': 'Under the US Treasury convention (31 CFR 356, Appendix B) a bond price is the sum of discounted coupons and principal, with the fractional first period discounted at simple interest. The library did this while full coupon periods remained but compounded over the fraction once the bond was in its final period, so the convention changed on the penultimate coupon date. Setting the number of remaining full periods to zero in the regulation’s general formula gives simple interest, which is also what the street convention does in that period. On a 4 percent semi-annual bond three months from maturity at a 5 percent yield the price moved by 0.8 cents per 100; mid-period prices and the existing Treasury pins are unchanged.',
  'https://github.com/skfolio/skfolio/pull/450': 'Akaike and Schwarz information criteria penalise the number of estimated parameters. The univariate marginals counted every parameter of the underlying scipy distribution, including a location or scale the user had fixed, so a zero-mean Gaussian paid for two parameters when it fitted one, and a Student-t with fixed location and scale paid for three when it fitted one. The library ranks candidate marginals by these criteria before building a vine copula, so fixed-parameter candidates, a natural choice for daily returns, were unfairly ranked. The count now subtracts the fixed attributes. Tested over the four distributions with none, one and two parameters fixed.',
  'https://github.com/skfolio/skfolio/pull/452': 'Calendar-based walk-forward splitting generates rebalancing anchors on a frequency and shifts them by an offset, for example three days before each Monday. The anchor range had been widened on the start side to allow for the shift but not on the end side, so with a negative offset the final anchor, which falls just after the data but maps to a date inside it, was never generated. On a four-week daily sample the last test window was silently merged into the previous one, or dropped. The fix widens the end of the range by the same offset; anchors beyond the data are still filtered out, so positive offsets are unchanged.',
  'https://github.com/skfolio/skfolio/pull/449': 'The bivariate Student-t copula has no closed-form distribution function, and the library estimated it by Monte Carlo, so the same input gave different values on each call and the deep tails were inaccurate. I proposed a deterministic one-dimensional quadrature of the conditional t distribution with tests against a double integral of the bivariate density. The maintainer found the conditional form could miss mass under strong correlation in a batched evaluation and a separate precision loss in the shared tail-concentration code, and addressed both in his own pull request with a finite-interval integration and a joint survival probability method, released in skfolio 1.10.',
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
  { label: 'Open source', note: 'twenty-two merged pull requests', href: '/open-source' },
] as const;

/**
 * Open-source contributions to quantitative-finance libraries (CV, "Open source" section).
 * Only merged pull requests are listed as merged; skfolio #340 and #341 are under review and say so.
 * Every link is to the pull request itself, so the claim can be checked.
 */
export const openSource = [
  {
    project: 'FinancePy',
    projectUrl: 'https://github.com/domokane/FinancePy',
    what: 'a derivatives-pricing library',
    when: 'September and October 2026',
    status: 'sixteen pull requests merged',
    items: [
      { text: 'Fixed the Bjerksund and Stensland American option pricer, which divided by zero at a zero dividend yield and fell below the European price near it; the fix returns the European value when early exercise is never optimal and floors the approximation at the European bound.', href: 'https://github.com/domokane/FinancePy/pull/277' },
      { text: 'Made date-schedule generation repeatable: a second call stepped back from the adjusted maturity date and shifted every coupon date whenever the maturity fell on a weekend or holiday, which reached bonds, cross-currency swaps and cliquet options.', href: 'https://github.com/domokane/FinancePy/pull/278' },
      { text: 'Rewrote the forward-start option, which could not be constructed, and verified it against the Rubinstein closed form and the library’s cliquet option.', href: 'https://github.com/domokane/FinancePy/pull/279' },
      { text: 'Corrected two FX option error paths that raised a Python type error instead of the library’s own error.', href: 'https://github.com/domokane/FinancePy/pull/280' },
      { text: 'Fixed four of the six Monte Carlo pricing methods, which returned NaN for every input because they passed the option type where the model expects the interest rate.', href: 'https://github.com/domokane/FinancePy/pull/281' },
      { text: 'Fixed the variance-swap fair strike, which was too high by twice the dividend yield and crashed on large strike grids, and verified it against the Demeterfi, Derman, Kamal and Zhou replication.', href: 'https://github.com/domokane/FinancePy/pull/282' },
      { text: 'Made the FX variance swap price at all, fixed the same dividend defects as the equity version, and corrected realised variance in both classes to divide by the number of returns rather than the number of observations.', href: 'https://github.com/domokane/FinancePy/pull/283' },
      { text: 'Fixed the FX double digital option, which discounted a domestic payout at the foreign rate and valued a foreign payout with the wrong probability term, and tested it against the difference of two single digital options.', href: 'https://github.com/domokane/FinancePy/pull/284' },
      { text: 'Made the FX rainbow option price at all, corrected its correlation, which ignored the second rate, and repaired FX option rho, which raised an error for every product that inherits it.', href: 'https://github.com/domokane/FinancePy/pull/285' },
      { text: 'Fixed the SABR volatility formula, which overwrote one minus beta with another term, so smiles were exact at the money but wrong in the wings by up to two volatility points; tested against the exact Bachelier limit.', href: 'https://github.com/domokane/FinancePy/pull/286' },
      { text: 'Repaired the swaption volatility surface, whose calibration report and printed summary always raised an error and whose fixed-beta SABR fits started from a degenerate point.', href: 'https://github.com/domokane/FinancePy/pull/287' },
      { text: 'Fixed the credit default swap premium leg, which accrued the first coupon over the following period rather than the current one and, in the final coupon period, read past the end of its accrual factors and returned a negative risky PV01.', href: 'https://github.com/domokane/FinancePy/pull/412' },
      { text: 'Made the CDS index spread adjustment do something: its calibration loop never ran, so the issuer curves came back unchanged, and once entered it called a method that no longer existed.', href: 'https://github.com/domokane/FinancePy/pull/411' },
      { text: 'Corrected the sign of a pay-fixed forward rate agreement, which lost value when the forward rate rose, the opposite of a pay-fixed swap on the same curve.', href: 'https://github.com/domokane/FinancePy/pull/414' },
      { text: 'Fixed floating-rate note pricing from a discount margin, which crashed unless accrued interest had been computed first and otherwise reused a stale coupon period.', href: 'https://github.com/domokane/FinancePy/pull/410' },
      { text: 'Aligned the US Treasury yield convention in a bond’s final coupon period with the Treasury formula, which uses simple interest over the fractional period; the library compounded there, so the convention switched once a bond entered its last period.', href: 'https://github.com/domokane/FinancePy/pull/415' },
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
    when: 'September and October 2026',
    status: 'four pull requests merged, two under review',
    items: [
      { text: 'Under review: a parametric portfolio policy estimator after Brandt, Santa-Clara and Valkanov (2009): weights as a linear function of characteristics, fitted by maximising realised CRRA utility, with long-only and transaction-cost variants.', href: 'https://github.com/skfolio/skfolio/pull/341' },
      { text: 'Merged: online learning for the Schur complementary allocation, so it can be updated in a stream. The maintainer extended it with spectral seriation, released it in skfolio 1.8.4 and credits me in the source file.', href: 'https://github.com/skfolio/skfolio/pull/342' },
      { text: 'Merged: a bias fix in the regime-adjusted covariance estimator, whose short-term volatility multiplier was normalised by the square root of the asset count rather than by the expected chi statistic, understating variance by a third for a single asset; the maintainer confirmed the argument and measured better next-day variance forecasts on 2011 to 2022 stock data.', href: 'https://github.com/skfolio/skfolio/pull/445' },
      { text: 'Merged: information criteria for the univariate marginals now count only estimated parameters, so a distribution with a fixed location or scale is no longer penalised for parameters it did not fit when the library selects a marginal.', href: 'https://github.com/skfolio/skfolio/pull/450' },
      { text: 'Merged: walk-forward splits with a negative calendar offset dropped the last rebalancing date, because the anchor range was extended on the start side but not the end; the fix mirrors the start-side adjustment.', href: 'https://github.com/skfolio/skfolio/pull/452' },
      { text: 'Reported and prototyped a fix for the Student-t copula distribution function, which was computed by Monte Carlo and so varied between calls and lost accuracy in the tails; the maintainer thanked me for the finding and shipped a deterministic integration, together with a joint survival method, in his own pull request.', href: 'https://github.com/skfolio/skfolio/pull/449' },
      { text: 'Under review: a rolling-window multi-factor exposure estimator with gap-tolerant lags.', href: 'https://github.com/skfolio/skfolio/pull/340' },
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
