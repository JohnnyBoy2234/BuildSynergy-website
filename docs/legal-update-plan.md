# BuildSynergy — Legal Update Plan & Draft Clauses

> **Status:** DRAFT for review. Not yet live.
> **Important:** I am not a lawyer. These drafts are written to close the specific gaps
> we identified and to match the existing document style for easy drop-in. Before
> publishing, have a South African attorney review them — especially the Operator/DPA,
> Limitation of Liability, and CPA clauses, which interact with POPIA, the CPA and ECTA.

## Assumptions baked into these drafts

1. **Business model:** BuildSynergy builds AI solutions and websites for businesses,
   deploying on third-party platforms (Vercel) and using third-party AI providers
   (OpenAI, Anthropic). You are a **builder on top of suppliers**, not a platform.
2. **Hosting model:** *Managed only* — BuildSynergy hosts on its own provider accounts
   and is an ongoing operator. (The build-and-handover tier was dropped.) General
   end-of-project handover/migration of files still applies (Terms §27).
3. **AI billing:** pass-through on BuildSynergy's accounts **with hard usage caps**,
   migrating high-volume clients to their own AI accounts. Clauses reflect this.
4. Drafts use the name "BuildSynergy" to match the current documents. If you later
   switch the docs to "we/us" (recommended for readability), swap consistently.

---

# PART 1 — IMPLEMENTATION PLAN

Ordered by leverage, not by document order. The operational phase (1) protects you
more than the paper and should not wait for legal sign-off.

## Phase 1 — Operational protections (this week, no lawyer needed)

| # | Action | Why |
|---|--------|-----|
| 1.1 | Confirm BuildSynergy is a registered **Pty Ltd** and that all quotes/contracts/invoices are in the company name; never sign personally or give personal guarantees. | Limited-liability shield for personal assets. |
| 1.2 | Get **Professional Indemnity + Cyber liability** insurance. | Backstop when a cap is struck down or a non-signing third party sues. |
| 1.3 | Set **hard AI spend caps + budget alerts** per client (OpenAI/Anthropic budgets, Vercel spend management, rate limits). | Prevents runaway cost before the contract ever matters. |
| 1.4 | Enable **backups with a tested restore**; document the schedule and retention. | Defence against data-loss claims; backs §Security. |
| 1.5 | **Isolate clients** — separate Vercel projects/teams, per-client secrets, least-privilege access, 2FA everywhere. | Contains blast radius of one bad/compromised client. |
| 1.6 | Register the **Information Officer (Jonathan Theron)** with the Information Regulator. | POPIA operational requirement. |
| 1.7 | Adopt a written **sign-off step** for scope, content, and launch approval. | Makes §6 / §Approvals enforceable — you can produce the approval. |
| 1.8 | Maintain a **sub-processor register** (the list in §DPA below) and keep it current. | Required for the DPA; transparency for clients. |

## Phase 2 — Fix the Terms structure (before adding anything)

- 2.1 Decide numbering scheme: **either** restore real sub-clauses (2.1, 2.2, 2.3…)
  **or** strip all sub-numbers and use plain numbered sections. Do not keep the
  `9.1–9.12` range labels with single paragraphs underneath.
- 2.2 Fix the **missing 2.3** gap.
- 2.3 Replace most repetitions of "BuildSynergy" with the defined "we/us" (optional but
  recommended).

## Phase 3 — Add NEW Terms sections (drafts in Part 2A)

- 3.1 Data Processing / Operator clause + sub-processor list
- 3.2 Acceptable Use (flow-down)
- 3.3 Confidentiality (mutual)
- 3.4 Force Majeure (standalone)
- 3.5 Consumer Protection Act & ECTA acknowledgement
- 3.6 Boilerplate: Severability · Entire Agreement & Precedence · Assignment &
  Subcontracting · Waiver & Variation · Notices · Relationship of Parties

## Phase 4 — Revise EXISTING Terms sections (drafts in Part 2B)

- 4.1 §9 Hosting → reframe as deployment on third-party platforms + provider
  substitution + data export/retention/deletion on termination
- 4.2 §15 AI → expand to core-offering strength
- 4.3 §18 IP → clarify code/source vs deliverables (licence, not ownership of code)
- 4.4 §24 Limitation of Liability → fix the cap; reconcile with §9
- 4.5 Add a "Data Export and Termination" clause (managed hosting; export + 30-day retention)
- 4.6 Cross-reference the three cancellation locations (§9, §12, §21)

## Phase 5 — Update the Privacy Policy (drafts in Part 3)

- 5.1 Fix the orphaned §5 "public sources" bullet (left dangling after audit removal)
- 5.2 Cookies → real consent position + name tools
- 5.3 Add AI processing disclosure + sub-processors
- 5.4 Strengthen cross-border (POPIA s.72) + training-data position
- 5.5 Add retention specifics + data-subject-request timeline
- 5.6 Reference the Operator relationship (mirror the Terms DPA)

## Phase 6 — Review & publish

- 6.1 SA attorney review (priority: DPA, Limitation, CPA, AI IP).
- 6.2 Bump the Effective Date and add a short changelog line.
- 6.3 I slot the approved text into `src/routes/terms/+page.svelte` and
  `src/routes/privacy-policy/+page.svelte` with clean numbering, then build to verify.

---

# PART 2 — DRAFTED TERMS CLAUSES

## PART 2A — New sections

### Data Processing and Operator Obligations

This section applies where BuildSynergy processes personal information on the Client's
behalf in the course of building, hosting or managing a Website, application or AI
solution.

- For such personal information, the Client is the **responsible party** and BuildSynergy
  acts as an **operator** as defined in the Protection of Personal Information Act, 2013
  (POPIA).
- BuildSynergy will: (a) process personal information only for the purpose of providing
  the Services and on the Client's documented instructions; (b) apply reasonable
  technical and organisational security measures in line with section 19 of POPIA;
  (c) keep such personal information confidential; and (d) notify the Client without
  undue delay after becoming aware of a security compromise affecting the Client's
  personal information.
- The Client authorises BuildSynergy to engage **sub-operators (sub-processors)** to
  deliver the Services. BuildSynergy will impose data-protection obligations on
  sub-operators that are materially similar to those in this section. The current
  sub-operators are listed below. BuildSynergy may update this list and will make the
  current list available to the Client on request.
- The Client warrants that it has a lawful basis to provide the personal information to
  BuildSynergy and to authorise the processing described in these Terms, including any
  consents required from the Client's own customers or end-users.
- On termination, BuildSynergy will deal with the Client's personal information as set
  out in the "Hosting, Data Export and Termination" provisions below.

**Current sub-operators / sub-processors** *(confirm and keep current)*

| Provider | Purpose | Location |
|----------|---------|----------|
| Vercel | Application hosting & deployment | USA / global |
| Neon | Managed database | USA / EU |
| OpenAI | AI model processing | USA |
| Anthropic | AI model processing | USA |
| Hostinger | Website hosting (where applicable) | EU / global |
| Resend | Transactional & enquiry email | USA / global |
| Vercel Analytics | Website analytics | USA / global |
| Google Analytics | Website analytics | USA / global |

### Acceptable Use

- The Client must not use, and must not permit any third party or end-user to use, any
  Website, application or AI solution provided by BuildSynergy to: (a) breach any law or
  the rights of others; (b) host, send or distribute unlawful, infringing, defamatory,
  malicious or harmful content; (c) distribute malware, spam or conduct phishing;
  (d) attempt to gain unauthorised access to any system; or (e) place an unreasonable or
  disproportionate load on hosting or AI resources.
- The Client's use of any Service that relies on a third-party platform or AI provider
  must comply with that provider's acceptable-use, usage and content policies (including
  those of Vercel and the relevant AI providers). The Client is responsible for the acts
  and omissions of its end-users.
- If a third-party provider suspends, restricts or terminates BuildSynergy's access
  because of the Client's use, BuildSynergy is not liable for the resulting interruption,
  and BuildSynergy may suspend the affected Service until the issue is resolved.
- If any unlawful, fraudulent, malicious or infringing content or activity is found on a
  Website, application or AI solution hosted or managed by BuildSynergy, the Client is
  solely responsible and liable for that content or activity. BuildSynergy may immediately
  suspend, restrict or remove the affected Service or content without notice, may report
  it to the relevant authorities where required by law, and the Client indemnifies
  BuildSynergy against any resulting claims, losses, fines, penalties, damages or costs.

### Confidentiality

- Each party may receive confidential information of the other, including business plans,
  pricing, credentials, source materials and customer data ("Confidential Information").
- Each party will keep the other's Confidential Information confidential, use it only to
  perform or receive the Services, and protect it with reasonable care.
- This clause does not apply to information that is or becomes public through no breach,
  was lawfully known before disclosure, is independently developed, or must be disclosed
  by law (in which case the disclosing party will give reasonable notice where lawful).
- These obligations continue for three years after the engagement ends.

### Force Majeure

BuildSynergy is not liable for any delay or failure to perform caused by events beyond
its reasonable control, including third-party platform, hosting or AI provider outages
or changes, internet or telecommunications failures, cyberattacks, power failures, load
shedding, natural disasters, pandemic, government action or labour disruption. Affected
obligations are suspended for the duration of the event. If the event continues for more
than 30 calendar days, either party may terminate the affected Services in writing, and
the Client remains liable for work performed up to that date.

### Consumer Protection Act and Electronic Transactions

Nothing in these Terms limits or excludes any right the Client has that cannot lawfully
be limited or excluded, including rights under the Consumer Protection Act, 2008 (CPA)
and the Electronic Communications and Transactions Act, 2002 (ECTA) where they apply.
Where a provision of these Terms conflicts with a non-excludable statutory right of a
Client to whom the CPA or ECTA applies, that statutory right prevails to the extent of
the conflict, and the remaining provisions continue to apply.

### General

- **Severability.** If any provision is found unenforceable, it is severed and the
  remaining provisions continue in full force.
- **Entire agreement and precedence.** These Terms together with the accepted Quotation
  form the entire agreement between the parties. If there is a conflict, the Quotation
  prevails for the specific Services it describes, and these Terms govern in all other
  respects.
- **Assignment and subcontracting.** The Client may not assign or transfer its rights or
  obligations without BuildSynergy's written consent. BuildSynergy may subcontract or use
  third-party providers to deliver the Services and remains responsible for the Services
  delivered.
- **Waiver and variation.** No failure to enforce a right is a waiver of it. Any variation
  of these Terms must be in writing.
- **Notices.** Notices must be in writing and may be given by email to the addresses the
  parties use for the engagement. Notice is deemed received on the next business day after
  sending, unless a delivery failure is received.
- **Relationship of the parties.** The parties are independent contractors. Nothing in
  these Terms creates a partnership, joint venture, employment or agency relationship.

## PART 2B — Revised existing sections

### (Revises §9) Hosting and Third-Party Platforms

- Where BuildSynergy provides managed hosting, it deploys and manages the Client's
  Website, application or AI solution **on third-party platforms** which may include
  Vercel, Hostinger, database providers, DNS providers, email providers and related
  technology partners. BuildSynergy is not the underlying server, data centre, domain
  registrar, DNS, email infrastructure or internet service provider, and does not own or
  control those platforms.
- BuildSynergy will use reasonable efforts to deploy, manage, monitor, maintain and
  support the hosting environment. **Availability depends on the underlying providers.**
  Where a provider offers a service level, that provider's service level applies to its
  own infrastructure; BuildSynergy's responsibility is limited to reasonable management
  and does not include a guarantee of uptime, email delivery, DNS propagation,
  third-party platform availability or server performance.
- BuildSynergy may **change or substitute** hosting, infrastructure or technology
  providers with materially equivalent alternatives where reasonable, for example due to
  provider changes, pricing, performance or availability.
- BuildSynergy will not be liable for downtime, data loss, DNS or email disruption,
  cyberattacks, service outages, pricing or policy changes, plugin or API failures, or
  provider failures that are outside its reasonable control, subject always to the
  "Limitation of Liability" section.
- Services are active only while the applicable monthly fees are paid and up to date.
  Non-payment may result in suspension, a reactivation fee, or termination of hosting
  after 30 calendar days of non-payment.

### (New, pairs with §9) Hosting, Data Export and Termination

- **Managed hosting.** Where the Quotation includes managed hosting, BuildSynergy hosts
  the Website on its own provider accounts and manages the environment on the Client's
  behalf on a recurring basis.
- **Export on termination (Managed hosting).** On termination of managed hosting for any
  reason, and provided all outstanding amounts have been paid, the Client may request an
  export of its Website files and data. BuildSynergy will provide a reasonable export or
  migration assistance; extensive migration work may be quoted separately.
- **Retention and deletion.** After termination of managed hosting, BuildSynergy will
  retain the Client's data for **30 calendar days** to allow export, after which it may be
  permanently deleted from active systems. Backups are cycled and overwritten in the
  ordinary course. BuildSynergy is not obliged to retain data beyond this period unless
  agreed in writing or required by law.

### (Revises §15) Artificial Intelligence Solutions

- **Scope.** AI features, tools, agents and integrations are provided where listed in the
  Quotation. AI functionality relies on third-party AI providers, models, APIs and
  platforms (which may include OpenAI and Anthropic), each governed by its own terms,
  pricing, usage limits and availability.
- **Data and privacy.** Building and operating AI solutions involves sending data,
  including data the Client supplies and data from the Client's end-users, to third-party
  AI providers that may process it **outside South Africa**. The Client warrants it has a
  lawful basis to do so and must not submit special personal information or unlawful data
  to AI features without the required consent or authority. The AI providers used for API
  services do not, on their standard business terms, use submitted data to train their
  models; the Client acknowledges this position may change under provider terms.
- **Accuracy.** AI output is generated automatically, is provided **"as is"**, may be
  inaccurate, incomplete, biased or unexpected, and does not constitute professional
  (including legal, medical or financial) advice. The Client is responsible for
  reviewing, testing and approving all AI output before relying on or publishing it.
  Where BuildSynergy builds a Client-facing AI feature (such as a chatbot), the Client is
  responsible for what that feature communicates to the Client's end-users, and an
  appropriate "AI-generated, may be inaccurate" notice should be displayed.
- **Intellectual property in AI output.** The legal status of AI-generated material is
  uncertain and may not attract copyright protection. BuildSynergy assigns or licenses to
  the Client whatever rights it holds in AI output delivered to the Client, but
  **makes no warranty that AI output is original or does not infringe the rights of any
  third party.** System prompts, prompt libraries, fine-tuning datasets, configurations
  and tooling developed by BuildSynergy remain BuildSynergy's reusable property as set
  out in the "Intellectual Property" section.
- **Provider dependency and substitution.** Models and AI services may be deprecated,
  rate-limited, repriced, restricted or discontinued by their providers, often at short
  notice. BuildSynergy may substitute a materially equivalent model or provider and is
  not liable for changes, downgrades, downtime, price increases or discontinuation
  outside its reasonable control.
- **Usage and costs.** Ongoing AI usage, API and subscription costs are for the Client's
  account unless expressly included in the Quotation. Where BuildSynergy administers AI
  usage on the Client's behalf, it may set usage caps and limits; usage beyond an agreed
  cap may be suspended or billed to the Client. BuildSynergy is not liable for costs,
  decisions, actions or losses arising from the Client's or its end-users' use of, or
  reliance on, AI features or output.
- **Acceptable use.** The Client's use of AI features must comply with applicable law,
  POPIA, and the usage and content policies of the relevant AI providers.

### (Revises §18) Intellectual Property

- All work remains the property of BuildSynergy until full and final payment has been
  received.
- On full payment, the Client owns the brand-specific content, supplied materials, final
  copy and final visual assets created specifically for the Client's project.
- **The underlying website code, source code, application logic, frameworks, reusable
  components, templates, libraries, design methods, system prompts and AI tooling remain
  the property of BuildSynergy.** The Client does **not** acquire ownership of this
  code; instead, on full payment, the Client receives a **perpetual, non-exclusive,
  royalty-free licence to use the delivered Website, application or AI solution** as
  delivered, for the Client's own business purposes.
- The Client may not resell, redistribute, sublicense or commercialise BuildSynergy's
  reusable code, frameworks, methods, prompts or templates without written permission.
- BuildSynergy may display completed work in its portfolio or marketing unless the Client
  requests confidentiality in writing before the project begins.

### (Revises §24) Limitation of Liability

- To the fullest extent permitted by law, BuildSynergy is not liable for indirect,
  special, incidental, consequential or economic loss, including loss of profit, sales,
  business, data, goodwill or anticipated savings, reputational damage, lost enquiries,
  lost rankings, or downtime, however arising.
- **BuildSynergy's total aggregate liability** arising out of or in connection with the
  Services, whether in contract, delict or otherwise, is limited to: (a) for project
  work, the total fees paid by the Client for the specific project giving rise to the
  claim; and (b) for recurring services (such as hosting, care or AI administration), the
  total fees paid by the Client for that recurring Service in the **12 months** before the
  event giving rise to the claim.
- This limitation applies in place of, and overrides, any other liability statement in
  these Terms, including the hosting and AI sections.
- Nothing in this section excludes or limits liability that cannot lawfully be excluded or
  limited, including liability for death or personal injury caused by negligence, for
  fraud, or under the Consumer Protection Act where it applies.

---

# PART 3 — DRAFTED PRIVACY POLICY CLAUSES

### (Fix) §5 How We Collect Information — replace the "public sources" bullet

Remove the dangling bullet *"From publicly available sources such as websites, Google
search results, Google Business Profiles, social media pages and business directories"*
(it lost its purpose when audits were removed). If you still review a prospect's existing
website for a quotation, replace it with a narrower, purpose-bound bullet:

> - From information you provide to us about your existing website or online presence so
>   that we can prepare a quotation or deliver the Services you request.

Otherwise delete it entirely.

### (Revise) Cookies and Analytics

> Our website uses cookies and similar technologies. Strictly necessary cookies are
> required for the site to function. With your consent, we also use analytics cookies to
> understand how visitors use our site. We use *[name your tools, e.g. Vercel Analytics /
> Google Analytics]* for this purpose, which may collect IP address, general location,
> browser and device type, pages visited and referring website. You can manage your
> consent through our cookie controls and your browser settings. Withdrawing consent does
> not affect strictly necessary cookies.

### (New) AI Processing and International Providers

> Some of our services involve building and operating AI solutions. To do this, we and
> our clients use third-party AI providers (which may include OpenAI and Anthropic) and
> hosting platforms (which may include Vercel). Where you interact with an AI feature we
> have built, or where we process data to deliver an AI solution, that data may be sent to
> these providers and processed **outside South Africa**. On their standard business
> (API) terms, these providers do not use submitted data to train their models. We use
> reputable providers and rely on their security and data-protection commitments, but we
> are not responsible for their independent practices.

### (Revise) Cross-Border Processing — strengthen for POPIA s.72

> Some of our third-party providers store or process information outside South Africa,
> including in the United States and the European Union. Where we transfer personal
> information across borders, we do so on a basis permitted by section 72 of POPIA — for
> example, because the recipient is subject to laws or binding agreements that provide
> adequate protection, the transfer is necessary to perform our contract with you, or you
> have consented. By using our services you acknowledge that cross-border processing is
> necessary for hosting, cloud, AI, analytics, email and domain services.

### (New) Operator Relationship

> Where we host or manage a client's website, application or AI solution, we act as an
> **operator** processing personal information on that client's behalf and on their
> instructions. The client remains the responsible party for the personal information of
> their own customers and end-users, and for their own privacy notices and consents.

### (Revise) Retention of Information — add specifics

> We keep personal information only for as long as necessary for the purpose for which it
> was collected, or as required by law. As a guide: enquiry and prospect information is
> kept for up to *[12 months]* after last contact; client project and account records,
> including invoices, are kept for at least *[5 years]* to meet tax and legal obligations;
> hosted client data is dealt with as set out in our Terms. When information is no longer
> required, we delete, destroy or anonymise it where reasonably possible.

### (Revise) Your Rights — add a response timeline

> To exercise any of your rights, contact our Information Officer using the details below.
> We will respond within a reasonable period and, in any event, within *[30 days]* where
> practicable. We may need to verify your identity before acting on a request.

---

# PART 4 — OPERATIONAL CHECKLIST (non-document)

- [ ] Confirm Pty Ltd; all contracts/invoices in company name; no personal guarantees
- [ ] Professional Indemnity + Cyber liability insurance in force
- [ ] AI spend caps + budget alerts on every provider account
- [ ] Backups running with a *tested* restore; schedule documented
- [ ] Per-client isolation: separate Vercel projects, secrets, least-privilege, 2FA
- [ ] Information Officer registered with the Information Regulator
- [ ] Written sign-off step for scope / content / launch in the workflow
- [ ] Sub-processor register maintained and matches the DPA list
- [x] Email + analytics providers confirmed (Resend, Vercel Analytics, Google Analytics)
