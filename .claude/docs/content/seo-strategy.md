# XeaCode — SEO + Content Strategy

> Authored: 2026-05-12. Audience: the `Content Creator` agent that will fill `messages/{en,ro}.json` and refine `src/lib/seo/jsonld.ts`.
>
> This document locks **what** to target, **what** to write toward, and **what to avoid** — not the final copy itself. Content Creator owns the prose; this owns the framework.

---

## 1. Positioning summary

XeaCode is a senior-led, independent software studio for EU B2B clients who want a small team of staff-grade engineers — not an agency pipeline that hand-offs to juniors. The "one search" XeaCode wants to own is the prospect Googling some flavour of **"senior Next.js and .NET development studio in Europe"** — a CTO or founder with budget who has rejected both freelance marketplaces and 200-person consultancies and is looking for the third option: a small, direct, expert team. Tone target: Linear / Vercel / Stripe — quiet authority, not loud.

**The single keyword bet (highest-confidence):** `boutique software development studio` (with EU/Europe modifier). Specific enough to filter offshore arbitrage shops out of the SERP, broad enough to catch real demand from technical buyers.

---

## 2. Primary keyword cluster — English

The 3-5 head terms the site should rank for. All have plausible monthly demand in EU-targeted English; none of them require the brand to be famous to compete.

| # | Keyword phrase | Intent | Competition | Why it wins for XeaCode |
|---|---|---|---|---|
| P1 | `boutique software development studio` | Commercial investigation | Medium | The defining category term. Filters out offshore + enterprise consultancies in the SERP and matches the exact mental model of a CTO who has decided "not a freelancer, not Accenture". Brand-shaped to fit. |
| P2 | `senior software engineering studio Europe` | Commercial investigation | Medium-Low | Captures the "I want seniors, not a recruiter pyramid" search. "Senior" is an exact match for the positioning. Lower volume but high intent — every searcher here is in-market. |
| P3 | `Next.js and .NET development company EU` | Transactional / commercial | Low-Medium | Long-tail stack-specific query — exactly the shape technical decision-makers use when they already know their stack. Low volume, very high conversion rate. We win this with on-page mentions in Hero + Tech Stack + JSON-LD `serviceType`. |
| P4 | `product engineering studio for startups` | Commercial investigation | Medium | "Product engineering" is the modern industry-correct term for what XeaCode does (vs. the older "software development agency"). Pairs naturally with the founder/CTO audience. |
| P5 | `independent software studio` | Commercial / navigational hybrid | Low-Medium | "Independent" is a positioning keyword — it signals "not part of a network, not white-label, no offshore hand-off". Searchers using this word are pre-qualified. |

**Notes on what we are NOT targeting at the head:**
- `software development company` — too generic; SERP is dominated by 1000+ employee consultancies and offshore listings (Clutch, GoodFirms). Wrong room.
- `web development agency` — wrong category framing. XeaCode is a product/platform studio, not a marketing-site agency.
- `custom software development` — high volume but intent skews to "cheapest custom CRM build" not "premium engagement partner".

---

## 3. Secondary keyword cluster — English

Long-tail variants, location/stack modifiers, intent-specific queries. These feed body copy, service-card descriptions, and JSON-LD `serviceType` entries.

| # | Keyword phrase | Where it belongs |
|---|---|---|
| S1 | `Next.js development studio` | Tech Stack section, JSON-LD `serviceType` |
| S2 | `.NET 10 development company` | Tech Stack, JSON-LD |
| S3 | `React 19 product engineering` | Service card (product engineering) |
| S4 | `TypeScript engineering team` | Tech Stack |
| S5 | `senior contract engineering Europe` | Hero subtitle, Services |
| S6 | `technical co-founder alternative` | Services (consulting card) |
| S7 | `software architecture consulting` | Services (architecture card), JSON-LD |
| S8 | `MVP to production engineering partner` | Process section |
| S9 | `B2B SaaS engineering studio` | Hero or Services subtitle |
| S10 | `EU-based software studio English-speaking` | Footer tagline, Hero |
| S11 | `staff augmentation alternative boutique` | Services card |
| S12 | `direct engineer collaboration no juniors` | Hero subtitle (anchors the "no hand-offs" claim) |

**Romanian-roots signal (do not over-index, but include):**
- `Romanian software engineering studio` — for prospects who want EU-based + cost-aware but premium. One mention in the footer or contact section is enough.

---

## 4. Primary keyword cluster — Romanian

**Important calibration:** Romanian B2B technical decision-makers code-switch when searching. They search in English for tech terms (`Next.js development`, `software architecture`) but in Romanian for the agency/relationship terms (`agentie`, `studio`, `dezvoltare`, `consultanta`). Romanian SEO for premium tech buyers means **bilingual phrasings that mirror how the buyer types**, not literal translations of the English cluster.

| # | Keyword phrase | Intent | Competition | Why |
|---|---|---|---|---|
| RP1 | `studio dezvoltare software premium` | Commercial investigation | Low | Direct Romanian-language match for the positioning. Lower volume than the offshore-friendly `agentie dezvoltare software` but the SERP is much cleaner — fewer outsourcing listings. |
| RP2 | `agentie dezvoltare software Romania` | Commercial investigation | High | The dominant generic Romanian term. We include it for surface coverage but won't win it at the head — the SERP is owned by 50+ established Romanian agencies. Target the modifier `senior` or `premium` instead. |
| RP3 | `consultanta arhitectura software` | Commercial / informational | Low | High-intent technical buyer language. Pairs with the "Architecture" service card. Low volume, high conversion. |
| RP4 | `dezvoltare aplicatii Next.js si .NET` | Transactional | Low | Stack-specific, mirrors English P3. Romanian CTOs searching this are pre-qualified. |
| RP5 | `studio software pentru startup` | Commercial investigation | Low-Medium | Founder-shaped query in Romanian. Matches the "product engineering studio for startups" English term. |

**Notes:**
- I deliberately **do not** chase `creare site web` / `dezvoltare site` — those are website-builder queries, wrong customer.
- I deliberately **do not** chase `outsourcing IT Romania` — that's the offshore-arbitrage category and signals the wrong positioning even when ranked.

---

## 5. Secondary keyword cluster — Romanian

| # | Keyword phrase | Where it belongs |
|---|---|---|
| RS1 | `dezvoltare produs digital` | Services (product engineering card) |
| RS2 | `inginerie software senior` | Hero subtitle, Services |
| RS3 | `arhitectura sistem software` | Services (architecture card) |
| RS4 | `consultanta tehnica B2B` | Services (consulting card) |
| RS5 | `dezvoltare platforma SaaS` | Services (platform card) |
| RS6 | `echipa senior dezvoltare aplicatii` | Hero subtitle |
| RS7 | `studio independent dezvoltare software` | Footer tagline |
| RS8 | `colaborare directa cu ingineri seniori` | Hero subtitle, Process |
| RS9 | `dezvoltare aplicatii web Romania` | Tech Stack |
| RS10 | `partener tehnic pentru startupuri` | Services |
| RS11 | `auditul arhitecturii software` | Services |
| RS12 | `dezvoltare full-stack Next.js` | Tech Stack |

**Voice note for the Content Creator:** Romanian premium B2B copy does NOT use marketing exclamation, does NOT use anglicisms like "leveraging" / "ecosystem" / "synergy", and does NOT translate "we" warmly as "noi va oferim solutii personalizate" (that reads as bottom-tier outsourcing). The Romanian voice should be **direct, formal-but-modern, and use precise technical Romanian** — same register as a senior architect writing a proposal.

---

## 6. Meta tag drafts

Character counts include spaces. Targets: title ≤ 60, description 140–160.

```
EN metadata.title:        "Boutique Software Development Studio | XeaCode"
EN metadata.title (count): 47 chars

EN metadata.description:  "Senior independent software studio in Europe. Next.js, React, and .NET engineering for B2B teams who want direct collaboration, not hand-offs. Talk to us."
EN metadata.description (count): 159 chars

RO metadata.title:        "Studio Premium de Dezvoltare Software | XeaCode"
RO metadata.title (count): 48 chars

RO metadata.description:  "Studio independent de inginerie software, cu echipa senior, pentru companii B2B din UE. Dezvoltare Next.js si .NET, colaborare directa, fara intermediari."
RO metadata.description (count): 158 chars
```

**Why these draft choices:**
- EN title leads with P1 (`boutique software development studio`) verbatim — the bet keyword.
- EN description weaves P2 (`senior`, `independent`, `Europe`), S1 (`Next.js`), S2 (`.NET`), S12 (`direct collaboration, not hand-offs`), and ends with a soft CTA verb. No banned-cliché words.
- RO title leads with RP1 (`studio premium de dezvoltare software`) — the Romanian primary bet.
- RO description: front-loads `studio independent de inginerie software` (RP3-adjacent + RS2), names the audience (`companii B2B din UE`), names the stack, and ends with the differentiator (`colaborare directa, fara intermediari`). No exclamation marks, no marketing buzz.

**Content Creator notes:**
- These are drafts. Tune ±1 word if needed but stay under 60/160.
- Keep the brand name (`XeaCode`) at the END of `metadata.title`. Google truncates from the right at ~60 chars on mobile, but the keyword needs to be at the front anyway — brand at the end is the standard pattern for non-famous brands.

---

## 7. Hero copy direction

### `hero.eyebrow`

**Direction**: `Independent software studio` (3 words, exactly the category, exactly the positioning).

**Alternates considered**:
- `Senior engineering, on demand` — slightly more commercial-feeling; OK if Content Creator prefers it, but loses the "studio" framing the SEO needs.
- `Boutique. EU-based. Senior.` — fragments. Has voice but loses the readability of the chosen direction.

**Why "Independent software studio" wins**: it's both the category SEO term (P5) AND functions as a one-line positioning statement. The eyebrow is the highest-context location for a category keyword because it's rendered uppercase, small, and right above the H1 — Google reads it, humans skim it. Two jobs done by three words.

### `hero.headline` (H1)

**Constraints**: 4-9 words. Must contain a primary keyword. Must have voice. Must not be a noun-pile.

**Three candidate drafts** (Content Creator picks one — my recommendation is Draft B):

| Draft | Headline | Keyword weight | Voice notes |
|---|---|---|---|
| A | `Senior software engineering, built in Europe.` | Weighs P2 (`senior software engineering Europe`). | Clean, slightly resume-shaped. Safe. Misses "studio" framing. |
| **B (recommended)** | `A small studio. Built by senior engineers.` | Weighs P5 (`independent software studio`) + P2 (`senior engineers`). | Two short sentences, asymmetric rhythm, very Linear/Vercel. Says the entire positioning in 7 words. |
| C | `Software studios should be small. Ours is.` | Weighs P1 (`software studio`). | Confident, slightly provocative — has the most "voice" but the most risk if the rest of the page can't back the claim up. |

**Why B is the bet:** the two-sentence fragment is exactly the rhythm Linear, Vercel, and Stripe use on their homepages. It rewards a second read. It carries SEO weight on `studio` and `senior engineers`. It avoids every banned cliché.

### `hero.subtitle`

**Direction**: 1-2 sentences. ~25-40 words total. Must weave 1-2 secondary keywords without sounding stuffed. Must clarify the audience.

**Drafting framework for Content Creator** (not the final copy):

> Open with what XeaCode does in concrete terms, name the stack, name the audience, end with the differentiator.
>
> Required elements:
> - Concrete category description (e.g. "We build production software for…")
> - Audience (`B2B teams`, `founders`, `engineering leaders` — pick one register, don't list all three)
> - Stack mention (`Next.js`, `.NET`, or `TypeScript` — one or two, not all)
> - Differentiator (`direct collaboration with senior engineers` — the S12 hook)
>
> Banned: "transform", "elevate", "seamless", "deliver", "solutions", "ecosystem".

**Example shape (NOT the final copy — Content Creator rewrites):**

> "We build production software for B2B teams in Europe — Next.js front-ends, .NET back-ends, and the kind of architecture work that doesn't surface in a project plan. You talk to the engineers who write the code."

That's the *shape*. The Content Creator should produce 2-3 variants and pick the one that reads cleanest aloud.

---

## 8. Section H2 + body direction

### Services section

**`services.title`** (H2): `What we build` (3 words — voice-first, anchors the section, deliberately not "Our Services" which is dead-on-arrival corporate).

**Alternates**: `Where we work` / `Things we do well`. Stay short.

**`services.subtitle`**: 1 sentence. ~15-20 words. Frames the four cards as "four shapes of engagement" rather than "four products on a menu".

> *Direction*: "Four shapes of work, each led by a senior engineer end-to-end." (shape, not final copy)

**The four service categories** — proposed mapping with SEO rationale:

| # | Service category | Primary keyword reinforced | Audience problem it solves |
|---|---|---|---|
| 1 | **Product engineering** | P4 (`product engineering studio`), S3 (`React 19 product engineering`) | "We need to ship a real product, not a prototype." Build-from-scratch + iterate-to-launch work. |
| 2 | **Platform & systems engineering** | S5 (`B2B SaaS engineering studio`), S7 (related) | "We need scalable backends, integration work, API design." Multi-month platform builds. |
| 3 | **Architecture & technical consulting** | S7 (`software architecture consulting`), S6 (`technical co-founder alternative`) | "We need a senior brain in the room for 3-6 months, not a full team." Short-engagement strategic work. |
| 4 | **Embedded senior engineering** | S11 (`staff augmentation alternative boutique`), S12 (`direct engineer collaboration`) | "We have an in-house team; we need 1-2 senior engineers temporarily." The "white-label seniors" engagement. |

**Per-card body-copy direction:**
- **Length budget**: 18-30 words per card description.
- **Structure**: lead with the OUTCOME the client gets, not the technology stack. Stack mentions belong in the Tech Stack section, not Services.
- **Voice**: short sentences. No bullets inside the card body. No "We will…" / "We offer…" openings — start with the noun or the verb, skip the "we".
- **Card 1 (Product engineering)**: should make a founder feel "this is the team that ships my MVP without breaking it for the Series A".
- **Card 2 (Platform)**: should make a head-of-engineering feel "this is the team that doesn't need three weeks to ramp up".
- **Card 3 (Architecture)**: should make a CTO feel "I can hire one senior brain instead of three mediocre ones".
- **Card 4 (Embedded)**: should make a VP-eng feel "I can plug these people into my team and not regret it in month 2".

### Process section

**`process.title`** (H2): `How we work` (3 words — direct, anchors "process" with a verb, beats "Our Process" by miles).

**Alternates**: `The engagement` / `The shape of the work`. Stay short.

**`process.subtitle`**: 1 sentence. ~15-25 words. Frames the 4 steps as a *deliberate* sequence rather than a corporate methodology.

> *Direction*: "Four steps. Same senior engineers from the first call to the handover." (shape, not final copy)

**The four process steps** — proposed:

| # | Step name | What it covers | What the prospect needs to feel |
|---|---|---|---|
| 1 | **Discovery** | Initial conversations, scoping, problem framing. NOT a "discovery workshop" — too consultancy-shaped. Just a real conversation that produces clarity. | "These people actually understand what I need before they start typing." |
| 2 | **Architecture** | Technical design, stack choices, system boundaries. Where senior judgement creates the most leverage. | "This is the work I was scared no one would do properly." |
| 3 | **Build** | Iterative implementation with weekly visibility. The longest phase. | "I'm in the loop, but I'm not pulled into the weeds." |
| 4 | **Handover** | Documentation, deployment, knowledge transfer. The bit most agencies skip. | "When they leave, my team can keep going." |

**Per-step body-copy direction:**
- **Length budget**: 22-35 words per step description.
- **Structure**: name what literally happens in the step (concrete verbs: "We map…", "We choose…", "We ship…") followed by what the client gets at the end.
- **Voice**: each step should sound like an experienced engineer describing it to another engineer — no marketing softening.
- **SEO weight**: Step 2 (Architecture) carries S7 (`software architecture consulting`). Step 4 (Handover) carries the differentiator S12 indirectly — "we leave you with a team that can maintain this".

### Tech Stack section

**`tech.title`** (H2): `Stack we use` (3 words — direct, no "Our Tech Stack" which screams template).

**Alternates**: `The tools` / `What we use`.

**`tech.subtitle`**: 1 sentence. ~15-25 words. Should frame the stack as *deliberate choices*, not a checklist. This is where the buyer who searched a stack-specific query (`Next.js development studio`, `.NET 10 development company`) lands and validates.

> *Direction*: "Modern, boring tools we trust in production: Next.js 16, React 19, TypeScript, Tailwind, .NET 10." (shape, not final copy)

**The three tech categories** (matching `tech.categories.1/2/3`):

| # | Category | Keyword reinforced | Examples to list |
|---|---|---|---|
| 1 | **Front-end & product** | S1 (`Next.js development studio`), S3 (`React 19`), S4 (`TypeScript`) | Next.js 16, React 19, TypeScript, Tailwind v4, framer-motion |
| 2 | **Back-end & platform** | S2 (`.NET 10 development company`) | .NET 10, ASP.NET Core, EF Core, PostgreSQL, Redis |
| 3 | **Infrastructure & DX** | (no head keyword, supporting trust) | Vercel, GitHub Actions, OpenTelemetry, Playwright |

**Body-copy direction for the section subtitle:**
- Length budget: 15-25 words.
- Voice: "modern, boring tools" or equivalent — premium technical buyers respect "boring tech" as a signal of seniority. Avoid "cutting-edge", "latest", "modern stack" framings.
- One micro-claim about choice rationale ("we choose these because…") is allowed if it lands in <10 words.

### Contact section

**`contact.title`** (H2): `Tell us about it` (4 words — conversational, low-friction, beats "Get in Touch" / "Contact Us" by a mile).

**Alternates**: `Start a conversation` / `Let's talk`.

**`contact.subtitle`**: 1 sentence. ~20-30 words. Should lower the barrier to clicking submit. Specifies what happens after.

> *Direction*: "Tell us what you're building and we'll come back within a working day. No sales pipeline, no forms-to-book-a-call-to-book-a-call." (shape, not final copy — strong but trim length)

**Voice for the form fields** (`contact.form.*`):
- Field labels: `Name`, `Email`, `Company` (or `Company or team` — softer), `What are you building?` (instead of `Message`).
- Placeholders: half-sentence prompts, not full sentences. Example for the message: `"Short context — stage, stack, timeline if you have one."`
- Submit button: `Send` or `Send message` — NOT "Submit" (too form-DDM), NOT "Get in touch" (already used as the title).
- Submitting state: `Sending…` (one word + ellipsis, lowercase ellipsis if possible).

---

## 9. JSON-LD ProfessionalService fields

Current file: `src/lib/seo/jsonld.ts`. Content Creator should replace the placeholder strings with these:

### `description` (≤ 250 chars, plain-prose, single sentence preferable)

**Draft (EN)** — used regardless of locale, since the field is a single string in the current shape:

> `"Senior independent software studio in Europe building production software for B2B teams. Next.js, React, TypeScript, and .NET engineering with direct senior-engineer collaboration and no junior hand-offs."`

Char count: 218. Carries P1 (`software studio`), P2 (`senior`, `Europe`), P5 (`independent`), S1 (`Next.js`), S2 (`.NET`), S4 (`TypeScript`), S12 (`direct senior-engineer collaboration`).

**Alternative if Content Creator wants per-locale JSON-LD** (recommended refinement — the current type signature has one description for both locales but the function is already locale-aware, so per-locale is a one-line change):

```
EN description: same as above.
RO description: "Studio independent de inginerie software, cu echipa senior, pentru companii B2B din Europa. Dezvoltare Next.js, React, TypeScript si .NET, cu colaborare directa, fara intermediari."
```

(218 chars EN / 184 chars RO — both within budget.)

### `areaServed`

**Current**: `"European Union"` (single string).

**Recommendation**: **keep `"European Union"`** for the JSON-LD value. Reasons:
- Schema.org accepts this as a `Place`-shaped string.
- "European Union" is more SEO-friendly than "Europe" because it's a specific, recognized entity in knowledge graphs.
- If Content Creator wants to add a Romanian-locale variant: `"Uniunea Europeana"` (without diacritics is safer for downstream tooling — but `"Uniunea Europeană"` is also fine if the build doesn't strip diacritics).

Alternative shape if we ever expand: `areaServed` can be an array — `["European Union", "Romania", "United Kingdom"]` — but that should wait until there's a real reason. Single-string keeps the schema clean.

### `serviceType`

**Current**: `["Software Development", "Product Engineering", "Technical Consulting"]` (3 items).

**Recommended refined array (5 items, aligned with the 4 service cards + 1 stack signal):**

```ts
serviceType: [
  "Product Engineering",
  "Platform Engineering",
  "Software Architecture Consulting",
  "Embedded Senior Engineering",
  "Next.js and .NET Development",
]
```

**Why these five:**
- One per service card (4 items) — direct mapping for crawlers to associate.
- One stack-shaped entry (`Next.js and .NET Development`) — this is the only way `serviceType` can carry stack-specific SEO weight, since it lives in structured data rather than freeform prose.
- Dropped the original generic `"Software Development"` — too vague, doesn't help.
- All entries are real schema.org-acceptable strings (`serviceType` is a free string field, validators don't enforce a vocabulary).

---

## 10. Footer + Contact direction

### `footer.tagline`

**Direction**: ≤ 80 chars. The brand statement compressed into a single phrase. This is the line that appears under the XeaCode wordmark and across socials previews.

**Drafting framework** (Content Creator picks):

| Draft | Tagline | Char count | Notes |
|---|---|---|---|
| A | `Independent software studio. Senior engineers, end to end.` | 56 | Clean, declarative. Carries P5 + P2. |
| **B (recommended)** | `A small studio for serious software.` | 36 | Voice-forward, memorable. Loses some SEO weight, gains brand. |
| C | `Senior software engineering, built in Europe.` | 46 | Carries P2 + Europe. Slightly resume-shaped. |

**Recommendation**: B if the homepage already carries the SEO load (it does, via Hero + metadata + JSON-LD). A is the safer pick if the Content Creator wants every surface to repeat the keyword.

### `footer.easterEgg`

**Direction**: short sentence next to the paw SVG. NOT cutesy, NOT distracting. Reads as a quiet personal note from someone who built the site. Must NOT explicitly say "this is the founder's cat named Xea" — implication only, per brief.

**Drafting framework** (Content Creator picks):

| Draft | Easter egg copy | Notes |
|---|---|---|
| A | `Approved by the office cat.` | Light, implies oversight, doesn't name the cat. |
| **B (recommended)** | `Built with quiet supervision.` | Slightly more poetic. The paw next to it does the implication work. Doesn't name the cat at all. |
| C | `Yes, the paw is real.` | Self-aware, conversational. Slightly meta. |

**Recommendation**: B. It works in EN and translates cleanly to RO (`Construit sub supraveghere atenta` — Content Creator should refine the RO line).

### `contact.title` + `contact.subtitle`

Already covered in §8 Contact section. Repeating the recommendation here for the Content Creator's quick reference:
- `contact.title`: `Tell us about it`
- `contact.subtitle`: shape — "Tell us what you're building and we'll come back within a working day. No sales pipeline."

### `contact.form.successTitle` + `contact.form.successMessage`

**Constraints**: Premium-quiet, warm. Sets expectation. No marketing chirp. Should make the prospect feel like a real human read it.

**Drafting framework:**

| Field | Draft | Notes |
|---|---|---|
| successTitle | `Got it.` | Two words. Period. Trust-by-brevity. Linear-style. |
| successTitle (alt) | `Message received.` | Slightly more formal. |
| successMessage | `Thanks — we'll get back to you within one working day. If it's urgent, reply to the confirmation email.` | Concrete expectation + escape hatch. 105 chars. |
| successMessage (alt) | `We've got your note. Expect a reply within a working day, from a real person.` | Slightly warmer. Reinforces "no sales funnel". 79 chars. |

**Recommendation**: `successTitle = "Got it."` + the SECOND `successMessage` variant. Pairs short with warm.

### `contact.form.errorTitle` + `contact.form.errorMessage`

**Constraints**: Honest, no blame-the-user energy. Offers an out (direct email).

**Drafting framework:**

| Field | Draft |
|---|---|
| errorTitle | `Something went wrong.` |
| errorMessage | `The form couldn't send. Try again, or email us directly at hello@xeacode.com.` |

(Content Creator should swap in the real email once known.)

---

## 11. AI clichés to AVOID

The Content Creator must NOT use any of the following words or phrases — they are forbidden because they signal generic AI/marketing-template copy and actively hurt the "quiet authority" positioning. Several also have measurable SEO downside because they are over-indexed in low-quality content and Google's helpful-content classifier penalizes them at scale.

**From the brief (banned):**
- Elevate
- Seamless
- Unleash
- Next-Gen / Next Generation
- Empower
- Synergy
- Cutting-edge
- Game-changing
- Revolutionary
- Disrupt
- Innovate (when used vaguely as "we innovate")

**Added based on SEO-by-virtue-of-being-generic:**
- "Solutions" (as in "software solutions" — every offshore agency uses this; signals low-tier)
- "Tailored" / "Tailor-made" (template-shaped, has lost meaning)
- "Best-in-class"
- "World-class" (especially "world-class IT services" — the offshore tell)
- "Bespoke" (UK consultancy tell; safe in small doses but overused)
- "Robust" (filler word; if the system is robust, *show* it via concrete claims)
- "Scalable" (unless followed by a specific number or system characteristic)
- "Holistic"
- "End-to-end" (generic; allowed only when describing the literal engagement — Discovery → Handover)
- "Future-proof"
- "Mission-critical"
- "Drive [transformation/growth/value]"
- "Leverage" (as a verb)
- "Deliver" / "Delivering" (use "ship", "build", "send" instead)
- "Solutions provider" / "Service provider"
- "Trusted partner" (claim without evidence; if true, *show* it via testimonials — and per the brief, we don't fabricate testimonials, so don't claim trust)
- "Ecosystem" (as a buzzword)
- "Journey" (as in "your digital journey")
- "Transform" / "Transformation"
- "AI-native" / "AI-first" (SV-coded, doesn't fit EU premium boutique)
- "Ship faster" (accelerator-shaped, doesn't fit)
- "Move the needle"
- "Drive impact"
- "Stakeholders" (consultancy tell)

**Romanian banned-list (mirror of above):**
- "Solutii personalizate"
- "Solutii la cheie"
- "Servicii la nivel mondial" / "calitate mondiala"
- "Tehnologii de ultima generatie"
- "Transformare digitala" (use only if literally describing a digital-transformation engagement, not as a framing)
- "Parteneri de incredere" (claim without evidence)
- "Ecosistem digital"
- "Inovativ" / "Inovatii"
- "Solutii software complete"
- "La cheie"
- "De ultima generatie"

---

## 12. Banned competitor / category language

The voice target is **Linear, Vercel, Stripe**. The voice anti-targets are:

### Offshore dev shops (avoid)

Signals to NOT emit:
- "World-class IT services"
- "We provide top-quality software development"
- "Affordable" / "cost-effective" / "competitive rates"
- "100+ clients served" / "500+ projects delivered" (the inflated-number tell)
- "We are a team of passionate developers" (the bootcamp tell)
- "Experienced developers" (passive; "senior" is the precise word — use it)
- "On time and on budget" (the underpromise-overdeliver tell)
- Anything resembling Clutch/GoodFirms boilerplate

### Big-4 consultancies (avoid)

Signals to NOT emit:
- "Leverage" (verb)
- "Drive transformation"
- "Strategic enablement"
- "Across the enterprise"
- "C-suite alignment"
- "Best practices"
- "Industry-leading"
- "Center of excellence"
- "Practice area" (instead of "service")
- "Engagement model" (use "how we work" instead)

### Founder-friendly accelerators / SV startup voice (avoid)

Signals to NOT emit:
- "Ship faster"
- "AI-native" / "AI-first" / "AI-powered"
- "Built different"
- "Founders building the future"
- "Hyperscale" / "hypergrowth"
- "Hacker mindset"
- "Move fast and"
- "0 to 1"
- All-lowercase brand tone ("we build software" with no capitalization is too 2023-SV)

### The voice TARGET (apply this)

- **Linear marketing site**: short, declarative sentences. Confidence without proof points. Plenty of whitespace verbally — a 6-word sentence is OK to stand alone. Periods used liberally.
- **Vercel homepage**: technical-precise language used as marketing copy. Names the stack matter-of-factly. Doesn't apologize for being technical.
- **Stripe "we built this with care" tone**: long-form when it's a quality argument, short-form when it's a claim. Treats the reader as an intelligent professional. Doesn't soft-sell.

**One-line rule for the Content Creator**: *If a sentence could appear on the homepage of an offshore agency, a Big-4 consultancy, or a YC startup pitching at Demo Day — rewrite it. The good sentence is one that could only appear on a small, senior-led EU studio's site.*

---

## Appendix A — keyword-to-key map (cheat sheet for Content Creator)

Use this table to verify keyword coverage when you finish drafting each section. Every primary keyword should appear at least once across the site; secondaries should appear where natural.

| Keyword | Tier | Suggested location |
|---|---|---|
| P1 boutique software development studio | Primary EN | `metadata.title`, `hero.eyebrow` (implied), `footer.tagline` |
| P2 senior software engineering studio Europe | Primary EN | `hero.headline` (one word), `metadata.description`, `footer.tagline` (alt) |
| P3 Next.js and .NET development company EU | Primary EN | `metadata.description`, `tech.subtitle`, JSON-LD `serviceType` |
| P4 product engineering studio for startups | Primary EN | `services.1.title`, JSON-LD `serviceType` |
| P5 independent software studio | Primary EN | `hero.eyebrow`, JSON-LD `description` |
| S1 Next.js development studio | Secondary EN | `tech.categories.1`, JSON-LD `serviceType` |
| S2 .NET 10 development company | Secondary EN | `tech.categories.2`, JSON-LD `serviceType` |
| S5 senior contract engineering Europe | Secondary EN | `hero.subtitle` |
| S7 software architecture consulting | Secondary EN | `services.3.title`, JSON-LD `serviceType` |
| S11 staff augmentation alternative boutique | Secondary EN | `services.4.description` |
| S12 direct engineer collaboration | Secondary EN | `hero.subtitle`, `process.subtitle` |
| RP1 studio premium de dezvoltare software | Primary RO | `metadata.title` (RO), `hero.eyebrow` (RO) |
| RP3 consultanta arhitectura software | Primary RO | `services.3.title` (RO) |
| RP4 dezvoltare aplicatii Next.js si .NET | Primary RO | `metadata.description` (RO), `tech.subtitle` (RO) |
| RS2 inginerie software senior | Secondary RO | `hero.subtitle` (RO) |
| RS6 echipa senior dezvoltare aplicatii | Secondary RO | `metadata.description` (RO) |
| RS8 colaborare directa cu ingineri seniori | Secondary RO | `hero.subtitle` (RO) |

---

## Appendix B — cannibalization note (for future agents)

XeaCode is single-page-scroll. There is NO multi-page cannibalization risk at this scope — there is one indexable URL per locale (`/en` and `/ro`). The standard cross-page cannibalization audit does NOT apply because the cluster has only one document per locale.

**However**, the hreflang relationship between `/en` and `/ro` is the analog risk: if both locales target the same keyword in their respective metadata.title, the EN page may outrank the RO page even for Romanian queries (since EN tends to have stronger inbound signals). Mitigation:
- EN metadata.title leads with `Boutique Software Development Studio`.
- RO metadata.title leads with `Studio Premium de Dezvoltare Software`.
- These are different phrases, so they compete in different SERPs — clean separation.

**If a future iteration adds blog / case-study pages, the cannibalization audit becomes mandatory** (Phase 2.5 in the SEO workflow). At that point, ownership of each primary keyword must be locked to a single page — almost always the homepage for the head terms, with the blog targeting long-tail variants.

---

## Appendix C — recommended next-iteration tactical SEO work (out of scope for Content Creator)

For the project-lead's awareness, not for the Content Creator to action now:

- **Core Web Vitals**: Already covered by Phase 1.4 in the project plan (Lighthouse + axe).
- **Sitemap.xml**: Single URL per locale — trivial.
- **Robots.txt**: Default Next.js — verify it allows both locales.
- **OG image**: Already wired in `site-config`. Per Phase 1.4 verify the rendered image looks correct.
- **Schema additions to consider later**: `Organization` schema with `sameAs` for socials once those exist; `BreadcrumbList` if section anchors become URL-shaped; `FAQ` schema if a FAQ section is added in Sub-phase 2.
- **Backlink strategy**: Out of scope for site copy, in scope for the next quarter's growth plan. Initial targets — Awwwards, CSS Design Awards (the site's design is differentiated enough to be eligible), HN "Show HN" if appropriate, niche newsletter mentions (TLDR Web Dev, Bytes).
- **Search Console setup**: Sub-phase 1.4 should verify the property for both `/en` and `/ro` and submit the sitemap.

End of strategy document.
