<script lang="ts">
  import { onMount } from 'svelte';
  import SynergyCanvas from './lib/SynergyCanvas.svelte';
  import ContactSection from './lib/ContactSection.svelte';

  // ── State ──────────────────────────────────────────────────────────────────
  let scrollProgress: number = 0;
  let navScrolled: boolean = false;
  let scrollyWrapper: HTMLElement;
  let openFaq: number = -1;
  let isMobile: boolean = false;

  // ── Scroll handler ─────────────────────────────────────────────────────────
  function onScroll() {
    const sy = window.scrollY;
    navScrolled = sy > 30;
    if (!scrollyWrapper) return;
    const rect = scrollyWrapper.getBoundingClientRect();
    const total = scrollyWrapper.offsetHeight - window.innerHeight;
    if (total > 0) {
      scrollProgress = Math.max(0, Math.min(1, -rect.top / total));
    }
  }

  onMount(() => {
    isMobile = window.innerWidth < 768;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { isMobile = window.innerWidth < 768; });
    return () => window.removeEventListener('scroll', onScroll);
  });

  // ── Data ───────────────────────────────────────────────────────────────────
  const problems = [
    { icon: '◻', title: 'Outdated Online Presence', desc: 'Your website no longer reflects the quality of your work or the scale of your business.' },
    { icon: '◻', title: 'Missed Leads', desc: 'Visitors land on your site but have no clear way to enquire, quote, or book.' },
    { icon: '◻', title: 'Scattered Messages', desc: 'Enquiries arrive across email, WhatsApp, and social and some fall through the gaps.' },
    { icon: '◻', title: 'No CRM System', desc: 'Customer details and job history live in spreadsheets, inboxes, or memory.' },
    { icon: '◻', title: 'Manual Follow-Ups', desc: 'Reminders, proposals, and follow-up messages are all done by hand, every time.' },
    { icon: '◻', title: 'No Analytics', desc: 'You have no visibility into what is working which campaigns, pages, or leads convert.' },
    { icon: '◻', title: 'Weak Mobile Experience', desc: 'Your website is difficult to use on phone, where most of your customers will find you.' },
    { icon: '◻', title: 'Poor Digital Trust', desc: 'Without professional design and clear credentials, serious clients move on.' },
  ];

  const services = [
    { title: 'Premium Website Design', cat: 'web' },
    { title: 'SEO and Google Visibility', cat: 'web' },
    { title: 'Lead Capture Systems', cat: 'leads' },
    { title: 'Quote Request Flows', cat: 'leads' },
    { title: 'CRM Setup and Configuration', cat: 'crm' },
    { title: 'Communication Integration', cat: 'crm' },
    { title: 'AI Chatbots', cat: 'ai' },
    { title: 'Automation Workflows', cat: 'ai' },
    { title: 'Analytics Dashboards', cat: 'data' },
    { title: 'Company Profile PDFs', cat: 'content' },
    { title: 'Photography and Video', cat: 'content' },
    { title: 'Ongoing Maintenance', cat: 'support' },
  ];

  const industries = [
    'Industrial Companies',
    'Construction Businesses',
    'Property Companies',
    'Medical Practices',
    'Legal Firms',
    'Automotive Businesses',
    'Beauty and Wellness',
    'Home Services',
    'Professional Services',
    'Local Service Businesses',
  ];

  const packageItems = [
    'Premium multi-page website',
    'Mobile-first responsive design',
    'Communication integration',
    'Quote request system',
    'AI chatbot setup',
    'Google Maps optimisation',
    'SEO technical foundation',
    'Company profile PDF',
    'Photography and video support',
    'Analytics dashboard',
    'Speed and performance optimisation',
    'Recruitment page',
    'Ongoing maintenance support',
  ];

  const steps = [
    { num: '01', title: 'Discover', desc: 'We map your business, audience, goals, and current gaps.' },
    { num: '02', title: 'Design', desc: 'Premium creative direction shaped around your brand and customers.' },
    { num: '03', title: 'Build', desc: 'Development, integrations, automations, and content created and tested.' },
    { num: '04', title: 'Launch', desc: 'Handover, training, analytics setup, and ongoing improvement.' },
  ];

  const team = [
    { initials: 'JT', name: 'Jonathan', role: 'Founder · Strategy Lead' },
    { initials: 'CD', name: 'Creative', role: 'Designer · Brand Direction' },
    { initials: 'WD', name: 'Web', role: 'Developer · Frontend + Backend' },
    { initials: 'AI', name: 'Automation', role: 'AI and Automation Specialist' },
    { initials: 'CM', name: 'Content', role: 'Content and Media Specialist' },
    { initials: 'SG', name: 'Support', role: 'Support and Growth Lead' },
  ];

  const beforeItems = [
    'Static outdated website',
    'Enquiries sent to a basic email',
    'Manual messages across platforms',
    'Customer data in spreadsheets',
    'No automated follow-up',
    'No traffic or lead tracking',
    'Poor mobile experience',
    'Inconsistent brand appearance',
  ];

  const afterItems = [
    'Premium conversion-focused website',
    'Smart lead capture and quote flows',
    'Centralised communication system',
    'Organised CRM and pipeline',
    'Automated reminders and responses',
    'Live analytics and reporting',
    'Optimised mobile experience',
    'Consistent professional brand presence',
  ];

  const cases = [
    {
      icon: '⚙',
      type: 'Industrial Supplier',
      title: 'From outdated catalogue site to professional digital platform',
      desc: 'Replaced an aging website with a modern product and services showcase connected to a quote request system and CRM.',
      tags: ['Website', 'Lead Capture', 'CRM'],
    },
    {
      icon: '🏗',
      type: 'Property Business',
      title: 'Enquiry and management system for a growing property portfolio',
      desc: 'Built a polished property showcase with integrated lead flow, automated follow-ups, and a lightweight CRM for the sales team.',
      tags: ['Website', 'Automation', 'Analytics'],
    },
    {
      icon: '🔧',
      type: 'Service Company',
      title: 'Digital foundation for a trade and services business',
      desc: 'Created a professional site with booking flow, Google optimisation, and a communication system that reduced manual admin by hours per week.',
      tags: ['Website', 'Booking Flow', 'SEO'],
    },
  ];

  const trustItems = [
    { icon: '📱', title: 'Mobile-first design', desc: 'Built for how your customers actually browse on their phones.' },
    { icon: '⚡', title: 'Fast loading pages', desc: 'Performance optimised from day one. No bloated page builders.' },
    { icon: '🔒', title: 'Secure setup', desc: 'SSL, clean hosting, and secure data handling as standard.' },
    { icon: '🔍', title: 'SEO foundation', desc: 'Technical and on-page SEO built into every project we deliver.' },
    { icon: '💬', title: 'Clear communication', desc: 'You always know where we are. No chasing. No surprises.' },
    { icon: '🛠', title: 'Ongoing support', desc: 'We stay involved after launch to improve, maintain, and grow.' },
    { icon: '📊', title: 'Analytics visibility', desc: 'Dashboards that show you what is working and what to do next.' },
    { icon: '🇿🇦', title: 'South African businesses', desc: 'Built specifically for the South African market and context.' },
  ];

  const faqs = [
    {
      q: 'What exactly does BuildSynergy build?',
      a: 'We build complete digital systems for businesses starting with your website but extending into lead capture, CRM, automation, communication, and analytics. We do not just build websites; we connect the tools your business needs to operate more effectively online.',
    },
    {
      q: 'How long does a project typically take?',
      a: 'A full digital foundation project takes between 6 and 12 weeks depending on scope, content readiness, and integration complexity. We provide a clear timeline before starting.',
    },
    {
      q: 'Do I need to supply all the content?',
      a: 'We help with content including copywriting direction, photography guidance, and video support. You will need to provide business details, product or service information, and any existing brand assets.',
    },
    {
      q: 'What platforms and tools do you use?',
      a: 'We use established, proven tools that fit your business size and budget. This includes modern web platforms, widely adopted CRMs, automation tools, and analytics platforms. We avoid locking you into obscure proprietary systems.',
    },
    {
      q: 'Do you work with businesses outside South Africa?',
      a: 'We work primarily with South African businesses but can accommodate clients in other markets where the scope and communication requirements are aligned.',
    },
    {
      q: 'What happens after launch?',
      a: 'We offer ongoing maintenance, updates, performance monitoring, and growth support. We stay involved after launch to keep your systems running and improving.',
    },
    {
      q: 'Can I start with just a website?',
      a: 'Yes. Many clients start with a premium website and add systems over time. We design your website with the full ecosystem in mind so integrations are clean when you are ready.',
    },
  ];

  function toggleFaq(i: number) {
    openFaq = openFaq === i ? -1 : i;
  }
</script>

<!-- ═══════════════════════════════════════════════════════════════════════════
     NAVIGATION
═══════════════════════════════════════════════════════════════════════════ -->
<nav class="nav" class:scrolled={navScrolled} aria-label="Main navigation">
  <a class="nav-logo" href="/">Build<span>Synergy</span></a>
  <ul class="nav-links">
    <li><a href="#systems">Systems</a></li>
    <li><a href="#solutions">Solutions</a></li>
    <li><a href="#process">Process</a></li>
    <li><a href="#team">Team</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <a class="nav-cta" href="#contact">Start a Project</a>
</nav>

<!-- ═══════════════════════════════════════════════════════════════════════════
     SCROLLYTELLING 9 sections × 100vh = 900vh
═══════════════════════════════════════════════════════════════════════════ -->
<section id="systems" class="scrolly-wrapper" bind:this={scrollyWrapper}>

  <!-- Sticky Three.js canvas -->
  <div class="sticky-canvas">
    <SynergyCanvas {scrollProgress} {isMobile} />
  </div>

  <!-- Text panels (absolute, overlaid on canvas) -->
  <div class="text-panels">

    <!-- ── S1: HERO (0–100vh) ─────────────────────────────────────────────── -->
    <div class="text-panel hero-panel">
      <div class="panel-content left">
        <span class="eyebrow">Digital Business Systems</span>
        <h1 class="text-gradient">Build the digital engine your business deserves.</h1>
        <p>Premium websites, lead systems, CRM flows, AI tools, automations, and analytics connected into one business ecosystem.</p>
        <div class="cta-group">
          <a class="btn-primary" href="#contact">Start a Project</a>
          <a class="btn-secondary" href="#systems">Explore the System</a>
        </div>
        <div class="scroll-hint">
          <span class="scroll-hint-line"></span>
          Scroll to activate the engine
        </div>
      </div>
    </div>

    <!-- ── S2: REALITY (100–200vh) ────────────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content left">
        <span class="eyebrow">The Current Reality</span>
        <h2>A website alone is not a business system.</h2>
        <p>When leads, messages, follow-ups, customer data, and reporting are disconnected, growth becomes harder than it should be.</p>
      </div>
    </div>

    <!-- ── S3: WEBSITE (200–300vh) ────────────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content left">
        <span class="system-tag">System 01</span>
        <h2>Premium websites that create trust.</h2>
        <p>Fast, responsive, conversion-focused digital experiences designed to make serious businesses look the part.</p>
      </div>
    </div>

    <!-- ── S4: LEAD (300–400vh) ───────────────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content right">
        <span class="system-tag">System 02</span>
        <h2>Turn attention into real enquiries.</h2>
        <p>Smart forms, quote systems, booking flows, and conversion paths help capture demand before it disappears.</p>
      </div>
    </div>

    <!-- ── S5: CRM (400–500vh) ────────────────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content left">
        <span class="system-tag">System 03</span>
        <h2>Keep your business flow in one place.</h2>
        <p>Organise customers, enquiries, jobs, conversations, and follow-ups inside a cleaner digital operating system.</p>
      </div>
    </div>

    <!-- ── S6: AUTOMATION (500–600vh) ────────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content right">
        <span class="system-tag">System 04</span>
        <h2>Automate the work that slows you down.</h2>
        <p>AI tools, smart reminders, lead routing, workflow triggers, and support systems reduce repetitive manual work.</p>
      </div>
    </div>

    <!-- ── S7: COMMUNICATION (600–700vh) ─────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content left">
        <span class="system-tag">System 05</span>
        <h2>Meet customers where they already are.</h2>
        <p>Connect enquiries and responses into communication flows that help customers move forward faster.</p>
      </div>
    </div>

    <!-- ── S8: ANALYTICS (700–800vh) ─────────────────────────────────────── -->
    <div class="text-panel">
      <div class="panel-content right">
        <span class="system-tag">System 06</span>
        <h2>See what is working.</h2>
        <p>Track leads, traffic, customer behaviour, and growth signals with clear performance visibility.</p>
      </div>
    </div>

    <!-- ── S9: FULL ECOSYSTEM (800–900vh) ────────────────────────────────── -->
    <div class="text-panel" id="ecosystem">
      <div class="panel-content center">
        <span class="eyebrow">Complete Digital Ecosystem</span>
        <h2>Your business deserves systems that work together.</h2>
        <p>BuildSynergy connects your website, leads, customers, communication, automation, and analytics into one modern digital engine.</p>
        <div class="cta-group">
          <a class="btn-primary" href="#contact">Start a Project</a>
          <a class="btn-secondary" href="#solutions">View Our Solutions</a>
        </div>
      </div>
    </div>

  </div><!-- /text-panels -->
</section>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PROBLEM SECTION
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background: var(--bg2);">
  <div class="section-header">
    <span class="eyebrow">The Real Problem</span>
    <h2>Most businesses do not have a website problem. They have a system problem.</h2>
    <p>A website on its own is not enough when leads are missed, messages are scattered, follow-ups are manual, and nobody knows what is working.</p>
  </div>
  <div class="problem-grid">
    {#each problems as p}
      <div class="problem-card">
        <div class="problem-card-icon">{p.icon}</div>
        <h4>{p.title}</h4>
        <p>{p.desc}</p>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     SOLUTIONS SECTION
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" id="solutions">
  <div class="section-header">
    <span class="eyebrow">The BuildSynergy Approach</span>
    <h2>We connect the pieces your business needs to grow.</h2>
    <p>BuildSynergy brings strategy, design, automation, communication, and reporting into one connected digital ecosystem.</p>
  </div>
  <div class="solutions-grid">
    {#each services as s}
      <div class="solution-card">
        <div class="solution-dot"></div>
        <h4>{s.title}</h4>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     WHO WE HELP
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background: var(--bg2);">
  <div class="section-header">
    <span class="eyebrow">Built For Real Businesses</span>
    <h2>Built for businesses that need to look sharper and operate smarter.</h2>
  </div>
  <div class="industries-grid">
    {#each industries as ind}
      <div class="industry-card">{ind}</div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PREMIUM PACKAGE
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section">
  <div class="section-header">
    <span class="eyebrow">Complete Digital Foundation</span>
    <h2>Everything your business needs to modernise online.</h2>
    <p>One connected engagement no piecemeal vendors, no mismatched tools.</p>
  </div>
  <div class="package-card">
    <div class="package-header">
      <span class="eyebrow" style="margin-bottom: 0.5rem">Full digital ecosystem setup</span>
      <h3 style="font-size: 1.6rem">The BuildSynergy Package</h3>
    </div>
    <div class="package-body">
      <div class="package-items">
        {#each packageItems as item}
          <div class="package-item">{item}</div>
        {/each}
      </div>
    </div>
    <div class="package-footer">
      <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 380px;">
        Tailored to your business. Scope and investment discussed in your initial strategy call.
      </p>
      <a class="btn-primary" href="#contact">Request a Proposal</a>
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     PROCESS
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background: var(--bg2);" id="process">
  <div class="section-header">
    <span class="eyebrow">How We Work</span>
    <h2>A clear process from idea to launch.</h2>
    <p>Four phases. No surprises. You always know what is happening and what comes next.</p>
  </div>
  <div class="process-track">
    {#each steps as s, i}
      <div class="process-step">
        <div class="step-number">{s.num}</div>
        <div>
          <div class="step-title">{s.title}</div>
          <div class="step-desc">{s.desc}</div>
        </div>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     TEAM
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" id="team">
  <div class="section-header">
    <span class="eyebrow">The People Behind the Systems</span>
    <h2>The people behind the systems.</h2>
    <p>A focused digital team combining strategy, design, development, automation, AI, content, and ongoing support.</p>
  </div>
  <div class="team-grid">
    {#each team as m}
      <div class="team-card">
        <div class="team-avatar">{m.initials}</div>
        <h4 style="font-size: 1rem; margin-bottom: 0.2rem">{m.name}</h4>
        <div class="team-role">{m.role}</div>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     BEFORE / AFTER
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background: var(--bg2);">
  <div class="section-header">
    <span class="eyebrow">The Transformation</span>
    <h2>From outdated presence to connected digital system.</h2>
  </div>
  <div class="before-after">
    <div class="before-col">
      <div class="col-label">Before BuildSynergy</div>
      {#each beforeItems as item}
        <div class="ba-item">{item}</div>
      {/each}
    </div>
    <div class="after-col">
      <div class="col-label">After BuildSynergy</div>
      {#each afterItems as item}
        <div class="ba-item">{item}</div>
      {/each}
    </div>
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     CASE STUDIES
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section">
  <div class="section-header">
    <span class="eyebrow">Selected Work</span>
    <h2>Digital systems built for real business outcomes.</h2>
  </div>
  <div class="case-grid">
    {#each cases as c}
      <div class="case-card">
        <div class="case-visual">
          <div class="case-visual-inner">{c.icon}</div>
        </div>
        <div class="case-body">
          <div class="case-type">{c.type}</div>
          <h4>{c.title}</h4>
          <p>{c.desc}</p>
          <div class="case-tags">
            {#each c.tags as tag}
              <span class="case-tag">{tag}</span>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     TRUST
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section" style="background: var(--bg2);">
  <div class="section-header">
    <span class="eyebrow">Built To A Higher Standard</span>
    <h2>Built with the standards serious businesses expect.</h2>
  </div>
  <div class="trust-grid">
    {#each trustItems as t}
      <div class="trust-item">
        <div class="trust-icon">{t.icon}</div>
        <div>
          <h4>{t.title}</h4>
          <p>{t.desc}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<!-- ═══════════════════════════════════════════════════════════════════════════
     FAQ
═══════════════════════════════════════════════════════════════════════════ -->
<section class="section">
  <div class="section-header">
    <span class="eyebrow">Common Questions</span>
    <h2>Questions before we build?</h2>
  </div>
  <div class="faq-list">
    {#each faqs as faq, i}
      <div class="faq-item" class:open={openFaq === i}>
        <button
          class="faq-q"
          onclick={() => toggleFaq(i)}
          aria-expanded={openFaq === i}
          aria-controls={`faq-answer-${i}`}
        >
          <span>{faq.q}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a" id={`faq-answer-${i}`} role="region">
          {faq.a}
        </div>
      </div>
    {/each}
  </div>
</section>

<div class="divider"></div>

<ContactSection />

<!-- ═══════════════════════════════════════════════════════════════════════════
     FOOTER
═══════════════════════════════════════════════════════════════════════════ -->
<footer class="footer">
  <div class="footer-top">
    <div>
      <div class="footer-brand">Build<span>Synergy</span></div>
      <div class="footer-tagline">Digital systems for modern businesses.</div>
    </div>
    <div class="footer-nav">
      <div class="footer-nav-group">
        <h5>Platform</h5>
        <ul>
          <li><a href="#systems">Systems</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#ecosystem">Ecosystem</a></li>
        </ul>
      </div>
      <div class="footer-nav-group">
        <h5>Company</h5>
        <ul>
          <li><a href="#process">Process</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 BuildSynergy. All rights reserved.</span>
    <div style="display:flex;align-items:center;gap:0.75rem;">
      <div class="footer-social">
        <a class="social-icon" href="/" aria-label="LinkedIn">in</a>
        <a class="social-icon" href="/" aria-label="Facebook">f</a>
        <a class="social-icon" href="/" aria-label="Instagram">ig</a>
      </div>
      <button class="back-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
    </div>
  </div>
</footer>

<style>
  /* Page-level layout reset */
  :global(body) { overflow-x: hidden; }

  /* Hero panel: push text to lower-middle */
  .hero-panel {
    align-items: flex-end;
    padding-bottom: 12vh;
  }

  /* Ensure sticky canvas background is dark */
  :global(.synergy-canvas) {
    background: transparent;
  }

  /* FAQ button reset */
  .faq-q {
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
</style>
