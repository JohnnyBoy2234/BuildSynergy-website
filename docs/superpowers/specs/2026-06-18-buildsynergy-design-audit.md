# BuildSynergy — Section-by-Section Design Audit

**Date:** 2026-06-18
**North star:** *Distinct but grounded* — an ownable, memorable look that still reads as
trustworthy to a non-technical South African SMB buyer (trades, suppliers, local service
businesses).
**Hard constraint:** No real testimonials, portfolio, client logos, or track record yet.
Strategy must build credibility *without* social proof — and must not fabricate it.

**Severity scale:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Polish

---

## Headline finding

The code is good — design tokens, GSAP reveals, cursor spotlights, reduced-motion handling,
a11y labels. **Execution is not the problem. The site has no point of view.**

It wears the universal 2026 AI/SaaS uniform: near-black navy, indigo→violet→cyan gradients,
glassmorphism, glow orbs, floating status cards, gradient text, word-split headings. Each
trick is fine alone; together they read as "generic premium template." Nothing is *ownable*.

## Two cross-cutting problems (fix these or nothing else matters)

### 1. 🔴 The aesthetic fights the audience
Copy targets SA trades and local service businesses ("Plumbing Services, JHB"). Those buyers
grant trust through *realness* — faces, names, numbers, a phone number, a location. The site
offers sci-fi chrome instead. "Distinct but grounded" requires the distinctiveness to come
from a confident, credible identity — not more glow.

### 2. 🔴 There is no real proof, and some of it is fabricated
With no track record yet, the existing invented "proof" is an active liability:
- Hero "Digital Presence Score 94 ↑ from 31" — invented.
- Hero floating "New Enquiry / Quote Request" cards — invented telemetry.
- Problem section "Trust Score 24 → 91" — invented.
- "Trust Strip" — a marquee of *our own service names* styled to look like a credibility bar.

A skeptical first-time visitor reads these as fake. **Remove all fabricated proof.** When you
have no track record, honesty is the only moat — and it is a real one.

---

## Credibility without proof (the strategy, given no testimonials yet)

Do not add testimonials you don't have, and do not fake them. Build trust from what genuinely
exists today:

1. **Be unmistakably real** — two named brothers, real photos, real founder story,
   "we do every project ourselves." Small-and-personal beats fake-and-scaled for this audience.
2. **This site is the portfolio** — "you're looking at an example of our work" is honest proof.
3. **Risk reversal instead of social proof** — free audit, transparent pricing, a founder's
   guarantee ("you don't pay until you're happy"). Builds trust with zero clients.
4. **Real contact** — phone, location, business hours. Table stakes for local SA trust.
5. **Design empty proof slots now** — testimonial and portfolio components that drop in cleanly
   the moment the first clients land.

---

## Section-by-section

| Section | Severity | Verdict |
|---|---|---|
| Navigation | 🟢 Polish | Floating pill + sliding "lamp" indicator + scroll-collapse + mobile bottom bar. Distinctive and well-built. Keep. |
| Hero | 🟠 High | Strong copy. Right side is fabricated floating cards + fake score gauge; centerpiece orb is the most generic AI visual. |
| Trust Strip | 🔴 Critical | Not a trust strip — a scrolling list of our own services implying proof that doesn't exist. Make real or cut. |
| Problem | 🟡 Medium | Best-structured section; before/after card is smart. Only the invented trust scores hurt it. |
| Solution | 🟠 High | Six identical glass cards with a full 6-colour rainbow of accents — actively undermines an ownable identity. |
| Process | 🟢 Polish | Clean 4-step timeline, audience-appropriate. Least change needed. |
| Packages | 🔴 Critical | Correct 3-tier structure but **no prices anywhere** — the #1 bounce reason for budget-conscious SMBs. |
| Manifesto / "Why Us" | 🟠 High | Actually a team section with **silhouette placeholder avatars** — your strongest grounding asset (real local people) rendered faceless. |
| Final CTA / Contact | 🟡 Medium | Re-renders ContactSection (~80 lines dead CSS). No phone/location/hours. Social links point to `/`. |

### Detail notes

**Hero** — Replace fake telemetry with one *real* thing: a screenshot of this very site, the
founders, or an honest "founder-led, based in [city]" line. The hero must debut the ownable art
direction; right now it debuts the template.

**Solution** — A brand owns 1–2 colours, not 6. The rainbow accents are the single clearest
violation of "distinct but grounded." Collapse to the brand palette and find a non-glass card
treatment.

**Packages** — Add prices or clear ranges ("from R X,XXX"). Even approximate pricing massively
lowers friction. This is a conversion hole, not a styling issue.

**Manifesto/Team** — Real founder photos here would outperform every glow effect on the site
for trust. Add the actual "why us / what we believe" content that the section name promises.

---

## Gaps (missing entirely)

- 🔴 Portfolio / real work — for an agency, the #1 thing a buyer wants. (Bootstrap with: this
  site itself, plus any practice/spec builds, clearly labelled as such.)
- 🔴 Testimonials — blocked until first clients. Build the slot now.
- 🟠 FAQ — kills objections (timeline, cost, "do I own it?", support) with zero proof needed.
- 🟠 Risk-reversal / guarantee — the main trust lever available to a no-track-record agency.
- 🟡 Real contact details — phone, location, hours.

---

## Recommended sequence (adjusted for the no-proof reality)

The pure "add testimonials" track is blocked, so the realistic order is:

1. **Credibility without proof (🔴 first):** remove all fabricated stats; add real founder
   photos + story; add prices; add a guarantee/risk-reversal; add real contact; add an FAQ;
   reframe the site as its own portfolio example. Mostly content + a few new sections.
2. **Ownable art direction (🟠, the "distinct" half):** define ONE signature — a real
   typographic voice, a disciplined 1–2 colour identity (drop the rainbow), and a recurring
   motif that isn't a glow orb. Reskin section by section.
3. **Section polish (🟡/🟢):** dedupe the repeated "heading + grid + closer" rhythm; trim motion
   density so emphasis means something; remove dead CSS; fix dead social links.
4. **Proof scaffolding:** ship testimonial + portfolio components as empty, ready-to-fill slots.

Each track becomes its own spec → plan → build cycle.
