# Notes

## PKHosting audit — ⚠️ ACTION NEEDED BEFORE SUBMISSION

I built this page with an AI assistant (Claude) inside a sandboxed environment with no
internet access to arbitrary sites — its web tools could not reach or render
`https://www.pkhosting.com`'s pricing section (search turned up unrelated Pakistani
hosts, and direct fetches were refused because the URL never appeared in a search
result). Rather than invent six observations or guess at PKHosting's real eight payment
methods, this section is left as a **structured template** for you to fill in after
visiting the live page yourself. That's the only honest way to satisfy this part of the
brief and be ready to defend it on the call.

Suggested method: open the live pricing section in Chrome DevTools, resize to
360/768/1440, view source (not just rendered DOM), and check the Network tab for what
loads.

1. **Element:** _(e.g. the billing toggle — is it a `<button>`, checkbox, or custom
   `<div>` with `onclick`?)_
   **Consequence:** _(e.g. if it's a non-native control with no `role`/`aria-pressed`,
   screen reader users won't know it's a toggle or which state is active.)_

2. **Element:**
   **Consequence:**

3. **Element:**
   **Consequence:**

4. **Element:**
   **Consequence:**

5. **Element:**
   **Consequence:**

6. **Element:**
   **Consequence:**

Things worth checking specifically, based on what this brief cares about:
- Are the monthly PKR prices present in the initial HTML response, or injected by
  JavaScript after a fetch/hydration? (View source vs. inspect element.)
- Does the currency switcher call a live exchange-rate API, or use fixed rates?
- Is the pricing table (if any) a real `<table>`, or `<div>` grid — and does it get a
  horizontal scroll container on narrow widths, or does the whole page scroll sideways?
- Does the billing/currency choice survive a reload? Check Application → Local Storage
  / cookies.
- What are the actual eight payment methods listed, and how are the logos implemented —
  hotlinked images, inline SVG, or icon font? Any broken/missing images?
- Contrast of price text, badges ("Most popular" equivalent), and muted/secondary text
  against their backgrounds.

## Payment methods — why this page keeps 5 of "PKHosting's 8"

Since I couldn't confirm PKHosting's real eight, the five below are a defensible generic
set for a Pakistani VPS buyer, not a copy of the real list. **Replace this reasoning once
you know the real eight and can name genuine cuts.**

Kept:
- **Visa / Mastercard** — the baseline expectation for any card-paying customer,
  including the Pakistani diaspora paying from abroad.
- **Easypaisa** and **JazzCash** — the two dominant mobile wallets in Pakistan; cutting
  either excludes a large share of small-business buyers who don't hold a card at all.
- **Bank transfer (IBFT)** — common for larger/annual invoices where a business wants a
  bank paper trail rather than a card statement.
- **PayPal** — covers freelancers and overseas Pakistanis who already hold a PayPal
  balance; weaker in-country, but was kept for annual/dedicated-tier buyers likely to be
  paying from outside Pakistan.

Cut (with reasoning, to be replaced with the real dropped four once verified):
- A **second global wallet** (e.g. Payoneer) — overlaps with PayPal for the same
  overseas-freelancer segment; keeping both doubles footer length for marginal added
  reach.
- **Cryptocurrency** — adds compliance/refund complexity for a hosting business and is a
  small minority of the target buyer base.
- A **second card network** (e.g. UnionPay) — low relevance to a primarily
  Pakistan/UK/US-facing customer base.
- **Cash/over-the-counter deposit** — doesn't fit a page meant to be usable end-to-end
  online, and slows activation compared to the five above.

## Trade-offs

**State persistence.** Billing period and currency are stored in `localStorage`, not
cookies or a query string. That means: it survives a reload on the same browser/device
(what the brief asks for), but a shared link won't carry the state to someone else, and
it silently resets in private/incognito browsing or if storage is disabled — both wrapped
in `try/catch` so the page still renders correctly, just without persistence. A
query-string approach (`?billing=annual&currency=USD`) would be shareable but adds URL
plumbing the brief didn't ask for; I judged localStorage as the smaller, more targeted
change for a static one-page deliverable.

**No build step.** Plain HTML/CSS/JS in three files, no bundler, no framework. This
keeps the "zero external requests, offline-first" requirement trivially true and keeps
the diff reviewable, at the cost of some repetition (four near-identical plan cards
instead of one templated component) — acceptable at four cards, not something I'd keep
at forty.

**Typography.** No web fonts (a hard requirement anyway, given zero external requests),
so the whole page runs on the system font stack. To still give the page a distinct
identity, prices and every spec/number use the system monospace stack while headings and
body copy use the system sans stack — a deliberate two-family split grounded in the
product (a monospace "console" feel for anything measured), not a workaround.

**Payment methods as text, not logos.** The brief explicitly disallows hotlinked logos.
Rather than embed inline SVG logos (more page weight, more legal ambiguity around
reproducing card-network marks), the footer lists payment method names as plain text in
bordered pills. Less visually rich, but zero IP/weight risk.

**Lighthouse.** I could not run a real Lighthouse audit in the sandbox this was built
in — it has no network access to install the CLI or extension. **You need to run this
yourself** (Chrome DevTools → Lighthouse tab, or `npx lighthouse index.html
--view --output html --output-path lighthouse-report.html` from the project folder) and
commit the resulting report before submitting. I did verify the layout and interaction
requirements a different way: automated headless-browser checks (Playwright) confirming
no horizontal page overflow at 360/768/1440px, correct annual pricing math at all four
plans, correct currency conversion, working aria-live announcements, `localStorage`
persistence across reload, focus-visible outlines through the first 10 tab stops, and
correct fallback pricing with JavaScript disabled — see README for the full list.
