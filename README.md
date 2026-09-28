# PKHosting VPS Hosting — pricing page

A single static page for an invented PKHosting VPS product line. Built for the TechAbout
web developer assessment. Nothing here is live or shippable — plans, prices and specs
are made up for the exercise.

## Open it

No build step, no dependencies, no server required.

- Double-click `index.html`, or
- `open index.html` (macOS) / `xdg-open index.html` (Linux) / `start index.html`
  (Windows), or
- Serve it locally if you prefer: `python3 -m http.server` from this folder, then visit
  `http://localhost:8000`.

It works offline and makes zero network requests — everything (HTML, CSS, JS) is three
local files, no CDN, no fonts, no images, no API calls.

## Browsers tested

- Chrome (headless Chromium via Playwright, used for the automated checks below)
- Manual visual review at 360px / 768px / 1440px — see `screenshots/`

I was not able to test in an actual windowed Firefox in this sandbox (no GUI browser
available beyond headless Chromium). **Please verify in Firefox before submitting** —
the CSS here is deliberately plain (flexbox/grid, no vendor-prefixed or bleeding-edge
properties), so I don't expect surprises, but I haven't confirmed it myself.

## What's unfinished / needs your follow-up

1. **`NOTES.md`'s PKHosting audit is a template, not filled in.** My environment's web
   tools couldn't reach or render the real `pkhosting.com` pricing page, so I left six
   numbered slots and a payment-methods section with placeholder (defensible, but
   unverified) reasoning instead of guessing. You need to visit the live page and fill
   these in with real observations before this counts for the 7 audit points — see the
   top of `NOTES.md` for exactly what to check.
2. **No committed Lighthouse report.** Same root cause — no network access to install
   the Lighthouse CLI in this sandbox. Run it yourself and commit the output:
   ```
   npx lighthouse index.html --view --output html --output-path lighthouse-report.html
   ```
   (or Chrome DevTools → Lighthouse tab → generate report → save/export).
3. **Firefox** — visually spot-check; see above.
4. Everything else (pricing logic, responsive layout, accessibility, persistence,
   self-containment) has been built and automatically verified — see below.

## AI assistant disclosure

Built with Claude (Anthropic) as a pair-programming assistant, inside a sandboxed
container with a headless Chromium instance but no general internet access. I can walk
through and explain any part of the HTML/CSS/JS on a call — the pricing math, the
accessibility choices, and the design decisions in `NOTES.md` were all deliberate, not
copied from a tutorial.

## What was actually tested, and how

I don't have a windowed browser in this environment, so instead of manual clicking I
wrote small Playwright scripts against headless Chromium to verify the specific,
checkable claims in the brief:

- **No page-level horizontal scroll at 360/768/1440px** — `document.documentElement
  .scrollWidth` vs `clientWidth` at each width; equal at all three (confirmed OK).
- **Pricing math** — toggled to annual, read the rendered DOM: Growth shows exactly
  **Rs 4,000/mo**, Rs 48,000/yr total, "Save 17% (Rs 9,600/yr)" — matching the brief's
  worked example and the `(monthly × 10) / 12` rule for all four plans.
- **Currency conversion** — switched to USD, confirmed Growth's annual per-month price
  converts to `$14.36` (4000 ÷ 278.50, two decimals) and the annual total to `$172.35`.
- **Screen-reader announcements** — confirmed `#price-status` (a visually-hidden
  `role="status" aria-live="polite"` region) updates its text on every billing/currency
  change.
- **Persistence across reload** — set annual + USD, called `page.reload()`, confirmed
  both the radio state and currency `<select>` value, and the rendered price, survive.
- **JavaScript disabled** — loaded the page in a JS-disabled browser context and
  confirmed the Starter card still shows `Rs 2,400`, because that value is written
  directly in `index.html`, not injected by script.
- **Keyboard navigation / focus visibility** — tabbed through the first 10 focusable
  elements and confirmed each received a visible `outline` per computed styles.
- **Contrast** — computed WCAG relative-luminance contrast ratios in Python for every
  foreground/background pairing used on the page; all are ≥ 4.5:1 (the "Most
  popular"/savings badge color was adjusted from an initial `#b9791a` — which measured
  3.15:1 — to `#7a4e0d`, which measures 5.16:1+ on its two backgrounds).
- **File size** — `index.html` + `styles.css` + `script.js` total well under 300 KB
  (roughly 32 KB combined).

None of this replaces manual QA in real Chrome and Firefox at real widths — treat it as
a first pass, not a substitute for the checklist in the assessment brief.

## Design decisions (brief version — full reasoning in `NOTES.md`)

- **Palette:** deep pine ink (`#10221e`) on a cool paper background (`#f3f5f2`), with a
  single amber signal color (`#7a4e0d`) reserved for "Most popular" and savings badges —
  chosen to avoid the generic cream+terracotta or near-black+neon looks, and to keep one
  accent meaning one thing (a good deal), not decoration everywhere.
- **Type:** system sans for narrative copy, system monospace for anything measured
  (prices, spec numbers) — no web fonts, both because external font requests are
  disallowed and because the monospace/"console" feel suits a VPS product.
- **Cards:** flat, hairline-bordered, minimal radius — a "spec sheet" look rather than
  the soft-shadow rounded-card kit.
- **FAQ:** native `<details>/<summary>`, not custom JS — works with JS disabled, is
  keyboard-operable for free, and needed no ARIA wiring.
- **Billing toggle:** native radio inputs in a `<fieldset>/<legend>`, styled as a
  segmented control — not a custom `<div>` toggle, so it's keyboard- and
  screen-reader-correct without extra ARIA.

## Project structure

```
.
├── index.html          # structure + all copy + hardcoded monthly PKR prices + full spec table
├── styles.css           # palette, type scale, layout, responsive rules, focus states
├── script.js             # billing/currency logic, localStorage persistence, a11y announcements
├── screenshots/            # 360 / 768 / 1440px screenshots
├── NOTES.md                 # PKHosting audit (template — see "unfinished" above) + trade-offs
└── README.md
```
