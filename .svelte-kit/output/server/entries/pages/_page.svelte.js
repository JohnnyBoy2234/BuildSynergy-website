import "../../chunks/index-server.js";
import { B as attr, V as escape_html, l as stringify, n as attr_class, o as ensure_array_like, r as attr_style, s as head, u as html } from "../../chunks/dev.js";
import { n as Navigation, t as Footer } from "../../chunks/Footer.js";
import { t as FinalCTA } from "../../chunks/FinalCTA.js";
import "gsap";
import "gsap/ScrollTrigger";
//#region src/lib/components/Hero.svelte
function Hero($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let ready = false;
		$$renderer.push(`<section id="home" class="hero svelte-1q37ri0"><div class="hero-bg svelte-1q37ri0" aria-hidden="true"><div class="bg-orb bg-orb--1 svelte-1q37ri0"></div> <div class="bg-orb bg-orb--2 svelte-1q37ri0"></div> <div class="bg-orb bg-orb--3 svelte-1q37ri0"></div> <div class="bg-noise svelte-1q37ri0"></div></div> <div${attr_class("hero-container svelte-1q37ri0", void 0, { "ready": ready })}><div class="hero-left svelte-1q37ri0"><h1 class="hero-heading svelte-1q37ri0">You're Better Than the Way Customers <span class="heading-accent svelte-1q37ri0">See You Online.</span></h1> <p class="hero-sub svelte-1q37ri0">BuildSynergy helps South African businesses create a sharper, more trustworthy digital presence with modern design, lead capture, hosting and ongoing support.</p> <p class="hero-support svelte-1q37ri0">Look professional. Get found. Turn interest into enquiries.</p> <div class="hero-ctas svelte-1q37ri0"><button class="cta-primary svelte-1q37ri0"><span class="svelte-1q37ri0">Get My Free Digital Presence Audit</span> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="svelte-1q37ri0"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="svelte-1q37ri0"></path></svg></button> <button class="cta-secondary svelte-1q37ri0">See What We Do</button></div> <p class="hero-trust svelte-1q37ri0"><span class="trust-line svelte-1q37ri0" aria-hidden="true"></span> For service businesses, trades, suppliers and local companies ready to be taken seriously online.</p></div> <div class="hero-right svelte-1q37ri0" aria-hidden="true"><div class="presence-orb svelte-1q37ri0"><div class="orb-core svelte-1q37ri0"><div class="orb-ring orb-ring--1 svelte-1q37ri0"></div> <div class="orb-ring orb-ring--2 svelte-1q37ri0"></div> <div class="orb-ring orb-ring--3 svelte-1q37ri0"></div> <div class="orb-pulse svelte-1q37ri0"></div> <div class="orb-icon svelte-1q37ri0"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" class="svelte-1q37ri0"><circle cx="18" cy="18" r="5" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" class="svelte-1q37ri0"></circle><circle cx="6" cy="9" r="3" stroke="rgba(99,102,241,0.8)" stroke-width="1.2" class="svelte-1q37ri0"></circle><circle cx="30" cy="9" r="3" stroke="rgba(34,211,238,0.8)" stroke-width="1.2" class="svelte-1q37ri0"></circle><circle cx="6" cy="27" r="3" stroke="rgba(168,85,247,0.8)" stroke-width="1.2" class="svelte-1q37ri0"></circle><circle cx="30" cy="27" r="3" stroke="rgba(34,211,238,0.8)" stroke-width="1.2" class="svelte-1q37ri0"></circle><line x1="9" y1="10" x2="14" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="svelte-1q37ri0"></line><line x1="27" y1="10" x2="22" y2="15" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="svelte-1q37ri0"></line><line x1="9" y1="26" x2="14" y2="21" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="svelte-1q37ri0"></line><line x1="27" y1="26" x2="22" y2="21" stroke="rgba(255,255,255,0.2)" stroke-width="1" class="svelte-1q37ri0"></line></svg></div></div> <svg class="orb-lines svelte-1q37ri0" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="120" stroke="rgba(99,102,241,0.08)" stroke-width="1" stroke-dasharray="4 8" class="svelte-1q37ri0"></circle><circle cx="200" cy="200" r="160" stroke="rgba(99,102,241,0.05)" stroke-width="1" stroke-dasharray="2 12" class="svelte-1q37ri0"></circle></svg></div> <div class="float-card float-card--enquiry svelte-1q37ri0"><div class="fc-indicator fc-indicator--blue svelte-1q37ri0"></div> <div class="fc-body svelte-1q37ri0"><div class="fc-label svelte-1q37ri0">New Enquiry</div> <div class="fc-value svelte-1q37ri0">Plumbing Services, JHB</div></div> <div class="fc-badge fc-badge--new svelte-1q37ri0">New</div></div> <div class="float-card float-card--seo svelte-1q37ri0"><div class="fc-indicator fc-indicator--green svelte-1q37ri0"></div> <div class="fc-body svelte-1q37ri0"><div class="fc-label svelte-1q37ri0">SEO Status</div> <div class="fc-value svelte-1q37ri0">Indexed &amp; Ready</div></div> <svg class="fc-check svelte-1q37ri0" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" stroke-width="1" class="svelte-1q37ri0"></circle><path d="M5.5 9l2.5 2.5 4.5-5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="svelte-1q37ri0"></path></svg></div> <div class="float-card float-card--hosting svelte-1q37ri0"><div class="fc-pulse-dot svelte-1q37ri0" aria-hidden="true"><span class="pulse-ring svelte-1q37ri0"></span></div> <div class="fc-body svelte-1q37ri0"><div class="fc-label svelte-1q37ri0">Hosting</div> <div class="fc-value svelte-1q37ri0">Active · 99.9% uptime</div></div></div> <div class="float-card float-card--quote svelte-1q37ri0"><div class="fc-icon-wrap svelte-1q37ri0"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="svelte-1q37ri0"><path d="M2 3h10M2 6h7M2 9h5" stroke="#a78bfa" stroke-width="1.4" stroke-linecap="round" class="svelte-1q37ri0"></path></svg></div> <div class="fc-body svelte-1q37ri0"><div class="fc-label svelte-1q37ri0">Quote Request</div> <div class="fc-value svelte-1q37ri0">Received · 2 min ago</div></div></div> <div class="score-card svelte-1q37ri0"><div class="score-label svelte-1q37ri0">Digital Presence Score</div> <div class="score-bar-wrap svelte-1q37ri0"><div class="score-bar svelte-1q37ri0"><div class="score-fill svelte-1q37ri0"></div></div> <span class="score-num svelte-1q37ri0">94</span></div> <div class="score-sublabel svelte-1q37ri0">↑ from 31 before BuildSynergy</div></div></div></div> <div${attr_class("scroll-hint svelte-1q37ri0", void 0, { "ready": ready })} aria-hidden="true"><span class="scroll-line svelte-1q37ri0"></span> Scroll</div></section>`);
	});
}
//#endregion
//#region src/lib/components/TrustStrip.svelte
function TrustStrip($$renderer) {
	const capabilities = [
		{
			label: "Professional Design",
			icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="2" width="13" height="9.5" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M5.5 14h5M8 11.5v2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M1.5 6h13" stroke="currentColor" stroke-width="1" opacity=".4"/>
      </svg>`
		},
		{
			label: "Managed Hosting",
			icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="2.5" width="13" height="4.5" rx="1" stroke="currentColor" stroke-width="1.3"/>
        <rect x="1.5" y="9" width="13" height="4.5" rx="1" stroke="currentColor" stroke-width="1.3"/>
        <circle cx="12.5" cy="4.75"  r="0.9" fill="currentColor"/>
        <circle cx="12.5" cy="11.25" r="0.9" fill="currentColor"/>
      </svg>`
		},
		{
			label: "Quote Requests",
			icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2.5 4h11M2.5 7.5h7.5M2.5 11h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <circle cx="12.5" cy="11" r="2.5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M14.3 13l1.2 1.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`
		},
		{
			label: "SEO Basics",
			icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M10 10l4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M4.5 6.5h4M6.5 4.5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".55"/>
      </svg>`
		},
		{
			label: "Monthly Support",
			icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/>
        <path d="M8 4.5v4l2.5 2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
		},
		{
			label: "Lead Capture",
			icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M1.5 3h13v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V3z" stroke="currentColor" stroke-width="1.3"/>
        <path d="M1.5 3l6.5 5.5L14.5 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
		}
	];
	$$renderer.push(`<div class="trust-strip svelte-gr7tks" role="region" aria-label="Capabilities"><ul class="sr-only svelte-gr7tks"><!--[-->`);
	const each_array = ensure_array_like(capabilities);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let cap = each_array[$$index];
		$$renderer.push(`<li>${escape_html(cap.label)}</li>`);
	}
	$$renderer.push(`<!--]--></ul> <div class="strip-fade strip-fade--l svelte-gr7tks" aria-hidden="true"></div> <div class="strip-fade strip-fade--r svelte-gr7tks" aria-hidden="true"></div> <div class="strip-track svelte-gr7tks" aria-hidden="true"><!--[-->`);
	const each_array_1 = ensure_array_like([0, 1]);
	for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
		each_array_1[$$index_2];
		$$renderer.push(`<!--[-->`);
		const each_array_2 = ensure_array_like(capabilities);
		for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
			let cap = each_array_2[$$index_1];
			$$renderer.push(`<div class="strip-item svelte-gr7tks"><span class="strip-icon svelte-gr7tks">${html(cap.icon)}</span> <span class="strip-label svelte-gr7tks">${escape_html(cap.label)}</span></div> <span class="strip-div svelte-gr7tks" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L9.8 6.2L14 8L9.8 9.8L8 14L6.2 9.8L2 8L6.2 6.2L8 2Z" fill="rgba(99,102,241,0.35)" stroke="none"></path></svg></span>`);
		}
		$$renderer.push(`<!--]-->`);
	}
	$$renderer.push(`<!--]--></div></div>`);
}
//#endregion
//#region src/lib/components/ProblemSection.svelte
function ProblemSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section id="problem" class="problem-section svelte-1yh2lju"><div class="prob-bg-noise svelte-1yh2lju" aria-hidden="true"></div> <div class="prob-glow svelte-1yh2lju" aria-hidden="true"></div> <div class="prob-container svelte-1yh2lju"><div class="prob-header svelte-1yh2lju"><h2 class="prob-heading svelte-1yh2lju">The Problem Isn't That Your Business Is Small.</h2></div> <div class="prob-split svelte-1yh2lju"><div class="prob-copy svelte-1yh2lju"><p class="prob-lead svelte-1yh2lju">Customers decide how much they trust you <em class="svelte-1yh2lju">before they ever speak to you.</em></p> <div class="prob-steps svelte-1yh2lju"><p class="svelte-1yh2lju"><span class="step-marker svelte-1yh2lju" aria-hidden="true">→</span> They search your name.</p> <p class="svelte-1yh2lju"><span class="step-marker svelte-1yh2lju" aria-hidden="true">→</span> They compare you to competitors.</p> <p class="svelte-1yh2lju"><span class="step-marker svelte-1yh2lju" aria-hidden="true">→</span> They check if you look professional, easy to contact and still active.</p></div> <p class="prob-consequence svelte-1yh2lju">If your online presence feels outdated, incomplete or hard to trust, good customers move on even if your actual work is better.</p> <p class="prob-cost svelte-1yh2lju">That gap costs businesses enquiries every day.</p></div> <div class="prob-visual svelte-1yh2lju" aria-hidden="true"><div class="profile-card profile-card--before svelte-1yh2lju"><div class="card-state-label card-state-label--before svelte-1yh2lju">Before</div> <div class="profile-header svelte-1yh2lju"><div class="profile-avatar profile-avatar--grey svelte-1yh2lju"></div> <div class="profile-meta svelte-1yh2lju"><div class="skeleton skeleton--name skeleton--grey svelte-1yh2lju"></div> <div class="skeleton skeleton--role skeleton--grey svelte-1yh2lju"></div></div></div> <div class="trust-signals svelte-1yh2lju"><div class="signal signal--bad svelte-1yh2lju"><span class="signal-dot signal-dot--red svelte-1yh2lju"></span> No website found</div> <div class="signal signal--bad svelte-1yh2lju"><span class="signal-dot signal-dot--amber svelte-1yh2lju"></span> Last updated 3 years ago</div> <div class="signal signal--bad svelte-1yh2lju"><span class="signal-dot signal-dot--red svelte-1yh2lju"></span> No contact info</div> <div class="signal signal--bad svelte-1yh2lju"><span class="signal-dot signal-dot--amber svelte-1yh2lju"></span> Not mobile friendly</div></div> <div class="trust-score trust-score--low svelte-1yh2lju"><span class="score-label svelte-1yh2lju">Trust Score</span> <div class="score-track svelte-1yh2lju"><div class="score-fill score-fill--low svelte-1yh2lju"></div></div> <span class="score-val score-val--low svelte-1yh2lju">24</span></div></div> <div class="gap-connector svelte-1yh2lju"><div class="gap-line svelte-1yh2lju"></div> <div class="gap-label svelte-1yh2lju">The Gap</div></div> <div class="profile-card profile-card--after svelte-1yh2lju"><div class="card-state-label card-state-label--after svelte-1yh2lju">After BuildSynergy</div> <div class="profile-header svelte-1yh2lju"><div class="profile-avatar profile-avatar--brand svelte-1yh2lju"></div> <div class="profile-meta svelte-1yh2lju"><div class="skeleton skeleton--name skeleton--white svelte-1yh2lju"></div> <div class="skeleton skeleton--role skeleton--muted svelte-1yh2lju"></div></div></div> <div class="trust-signals svelte-1yh2lju"><div class="signal signal--good svelte-1yh2lju"><span class="signal-dot signal-dot--green svelte-1yh2lju"></span> Professional website live</div> <div class="signal signal--good svelte-1yh2lju"><span class="signal-dot signal-dot--green svelte-1yh2lju"></span> SEO indexed &amp; found</div> <div class="signal signal--good svelte-1yh2lju"><span class="signal-dot signal-dot--green svelte-1yh2lju"></span> Lead forms active</div> <div class="signal signal--good svelte-1yh2lju"><span class="signal-dot signal-dot--green svelte-1yh2lju"></span> Mobile &amp; fast</div></div> <div class="trust-score trust-score--high svelte-1yh2lju"><span class="score-label svelte-1yh2lju">Trust Score</span> <div class="score-track svelte-1yh2lju"><div class="score-fill score-fill--high svelte-1yh2lju"></div></div> <span class="score-val score-val--high svelte-1yh2lju">91</span></div></div></div></div> <div class="prob-closer svelte-1yh2lju"><div class="closer-rule svelte-1yh2lju" aria-hidden="true"></div> <p class="closer-text svelte-1yh2lju">We close that gap.</p></div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/SolutionSection.svelte
function SolutionSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const pillars = [
			{
				label: "Website Design & Development",
				desc: "A complete, professional website built around your business with managed hosting and monthly care included as standard.",
				accent: "#6366f1",
				glow: "rgba(99,102,241,0.18)",
				icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="3.5" width="24" height="16" rx="2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M2 9h24" stroke="currentColor" stroke-width="1.2" opacity=".4"/>
        <circle cx="5.5" cy="6.25" r="1" fill="currentColor" opacity=".45"/>
        <circle cx="8.5" cy="6.25" r="1" fill="currentColor" opacity=".45"/>
        <path d="M7 13h8M7 16h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        <path d="M10 24h8M14 19.5V24" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>`
			},
			{
				label: "Mobile App Development",
				desc: "Custom iOS and Android apps that give your business its own presence directly on your customers' devices.",
				accent: "#a855f7",
				glow: "rgba(168,85,247,0.16)",
				icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="8" y="2" width="12" height="24" rx="2.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M8 7h12M8 21h12" stroke="currentColor" stroke-width="1.1" opacity=".4"/>
        <circle cx="14" cy="23.5" r="0.9" fill="currentColor" opacity=".5"/>
        <path d="M11 13h6M13 10.5l2.5 2.5-2.5 2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>
      </svg>`
			},
			{
				label: "Lead Capture & Quote Systems",
				desc: "Smart enquiry forms and quote request flows that turn website visitors into real customers.",
				accent: "#22d3ee",
				glow: "rgba(34,211,238,0.15)",
				icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M3 5h22v14a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 3 19V5z" stroke="currentColor" stroke-width="1.4"/>
        <path d="M3 5l11 8.5L25 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="20.5" cy="21.5" r="4.5" fill="var(--bg2,#07071a)" stroke="currentColor" stroke-width="1.3"/>
        <path d="M19 21.5h3M20.5 20v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`
			},
			{
				label: "Google Visibility & SEO",
				desc: "Local SEO setup and Google presence so nearby customers can find your business and understand what you offer.",
				accent: "#f59e0b",
				glow: "rgba(245,158,11,0.14)",
				icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="12.5" cy="12.5" r="8.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M19 19l5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12.5 6.5c0 0-4 2.5-4 6s4 6 4 6" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>
        <path d="M8.5 10h8M8.5 14.5h6" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".4"/>
      </svg>`
			},
			{
				label: "Branding & Visual Identity",
				desc: "Logo, colour palette and visual identity that makes your business instantly recognisable and trustworthy.",
				accent: "#ec4899",
				glow: "rgba(236,72,153,0.14)",
				icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="14" cy="14" r="4"  stroke="currentColor" stroke-width="1.2" opacity=".5"/>
        <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>
        <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
      </svg>`
			},
			{
				label: "E-commerce & Online Payments",
				desc: "Online stores and payment integrations so customers can browse your services and pay directly through your site.",
				accent: "#4ade80",
				glow: "rgba(74,222,128,0.13)",
				icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 4h2.5l3.5 12h12l2.5-8H9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="13" cy="22.5" r="1.8" stroke="currentColor" stroke-width="1.2"/>
        <circle cx="20" cy="22.5" r="1.8" stroke="currentColor" stroke-width="1.2"/>
        <path d="M13 10.5h5M15.5 8v5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".45"/>
      </svg>`
			}
		];
		$$renderer.push(`<section id="solution" class="sol-section svelte-1l338li"><div class="sol-glow-l svelte-1l338li" aria-hidden="true"></div> <div class="sol-glow-r svelte-1l338li" aria-hidden="true"></div> <div class="sol-container svelte-1l338li"><div class="sol-header svelte-1l338li"><h2 class="sol-heading svelte-1l338li">We Build the Digital Front Door Your Business Deserves.</h2> <p class="sol-sub svelte-1l338li">BuildSynergy creates modern digital systems that help customers find you, trust you and contact you faster without you having to manage the technical side.</p></div> <div class="sol-grid svelte-1l338li"><!--[-->`);
		const each_array = ensure_array_like(pillars);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let p = each_array[i];
			$$renderer.push(`<div class="sol-card svelte-1l338li"${attr_style(`--accent:${stringify(p.accent)}; --glow:${stringify(p.glow)}`)}><div class="card-spotlight svelte-1l338li" aria-hidden="true"></div> <div class="card-beam svelte-1l338li" aria-hidden="true"></div> <span class="card-num svelte-1l338li" aria-hidden="true">0${escape_html(i + 1)}</span> <div class="card-icon-wrap svelte-1l338li"><div class="card-icon-glow svelte-1l338li" aria-hidden="true"></div> <span class="card-icon svelte-1l338li">${html(p.icon)}</span></div> <div class="card-body svelte-1l338li"><h3 class="card-label svelte-1l338li">${escape_html(p.label)}</h3> <p class="card-desc svelte-1l338li">${escape_html(p.desc)}</p></div></div>`);
		}
		$$renderer.push(`<!--]--></div> <p class="sol-closer svelte-1l338li">You focus on running the business. <span class="svelte-1l338li">We make sure your first impression works.</span></p></div></section>`);
	});
}
//#endregion
//#region src/lib/components/ProcessSection.svelte
function ProcessSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const steps = [
			{
				num: "01",
				label: "Discover",
				desc: "We review your business, goals and what customers need to see before they trust you.",
				icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M15.5 15.5l4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M8 10.5h5M10.5 8v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".45"/>
      </svg>`
			},
			{
				num: "02",
				label: "Design",
				desc: "We create your site structure, messaging and visual direction refined together.",
				icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2H9L6 9l6 13 6-13-3-7h-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M8.5 9h7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
        <path d="M12 22V13" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity=".35"/>
      </svg>`
			},
			{
				num: "03",
				label: "Build",
				desc: "We develop your website, connect lead tools, optimise for mobile and prepare for launch.",
				icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 6L2 12l5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17 6l5 6-5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 4l-4 16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".4"/>
      </svg>`
			},
			{
				num: "04",
				label: "Launch & Grow",
				desc: "We go live and keep your presence sharp through hosting, updates and monthly care.",
				icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2C12 2 6.5 8 6.5 13.5h11C17.5 8 12 2 12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M12 13.5V19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M9 19h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M6.5 13.5L4 15.5v2l3.5-1M17.5 13.5L20 15.5v2l-3.5-1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
      </svg>`
			}
		];
		$$renderer.push(`<section id="process" class="process-section svelte-w9ii6w"><div class="proc-glow-c svelte-w9ii6w" aria-hidden="true"></div> <div class="proc-container svelte-w9ii6w"><div class="proc-header svelte-w9ii6w"><h2 class="proc-heading svelte-w9ii6w">Simple steps. Most of the work is ours.</h2> <p class="proc-sub svelte-w9ii6w">We handle strategy, design, development and ongoing care.
        Your only job is to review and approve before we go live.</p></div> <div class="proc-track-wrap svelte-w9ii6w"><div class="proc-line svelte-w9ii6w" aria-hidden="true"></div> <div class="proc-track svelte-w9ii6w" role="list" aria-label="How it works"><!--[-->`);
		const each_array = ensure_array_like(steps);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let step = each_array[i];
			$$renderer.push(`<div class="proc-step svelte-w9ii6w" role="listitem"><div class="step-node-wrap svelte-w9ii6w"><span class="step-num svelte-w9ii6w" aria-hidden="true">${escape_html(step.num)}</span> <div class="step-node svelte-w9ii6w"><div class="node-glow svelte-w9ii6w" aria-hidden="true"></div> <span class="node-icon svelte-w9ii6w">${html(step.icon)}</span></div></div> <div class="step-text svelte-w9ii6w"><h3 class="step-label svelte-w9ii6w">${escape_html(step.label)}</h3> <p class="step-desc svelte-w9ii6w">${escape_html(step.desc)}</p></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <p class="proc-note svelte-w9ii6w">Most clients are live within 2–4 weeks of getting started.</p></div></section>`);
	});
}
//#endregion
//#region src/lib/components/ProjectsSection.svelte
function ProjectsSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const projects = [{
			id: "mzanzihomes",
			name: "MzanziHomes",
			status: "In Testing",
			url: "https://mzanzihomes.com",
			image: "/mzanzihomes-preview.png",
			category: "Real Estate · Two-Sided Marketplace",
			tagline: "Find Your Perfect Home in South Africa",
			description: "A full-build rental marketplace connecting tenants directly with landlords — verified listings, zero agent fees, and a simpler, safer way to rent. Currently in final testing ahead of public launch.",
			tags: [
				"Full Website Build",
				"Zero Agent Fees",
				"Verified Listings",
				"Landlord Tools"
			]
		}];
		$$renderer.push(`<section id="work" class="proj-section svelte-1adnqlh"><div class="proj-glow-l svelte-1adnqlh" aria-hidden="true"></div> <div class="proj-glow-r svelte-1adnqlh" aria-hidden="true"></div> <div class="proj-container svelte-1adnqlh"><div class="proj-header svelte-1adnqlh"><span class="eyebrow">Our Work</span> <h2 class="proj-heading svelte-1adnqlh">Real Builds for Real Businesses.</h2> <p class="proj-intro svelte-1adnqlh">A look at what we've built. More case studies are on the way as our projects go live.</p></div> <div class="proj-grid svelte-1adnqlh"><!--[-->`);
		const each_array = ensure_array_like(projects);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let proj = each_array[i];
			$$renderer.push(`<a class="proj-card svelte-1adnqlh"${attr("href", proj.url)} target="_blank" rel="noopener noreferrer"${attr("aria-label", `View ${stringify(proj.name)}`)}><div class="proj-media svelte-1adnqlh"><img${attr("src", proj.image)}${attr("alt", `${stringify(proj.name)} website preview`)} loading="lazy" class="svelte-1adnqlh"/> <span class="proj-status svelte-1adnqlh">${escape_html(proj.status)}</span></div> <div class="proj-body svelte-1adnqlh"><span class="proj-category svelte-1adnqlh">${escape_html(proj.category)}</span> <h3 class="proj-name svelte-1adnqlh">${escape_html(proj.name)}</h3> <p class="proj-tagline svelte-1adnqlh">${escape_html(proj.tagline)}</p> <p class="proj-desc svelte-1adnqlh">${escape_html(proj.description)}</p> <ul class="proj-tags svelte-1adnqlh" aria-label="Project highlights"><!--[-->`);
			const each_array_1 = ensure_array_like(proj.tags);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let tag = each_array_1[$$index];
				$$renderer.push(`<li class="svelte-1adnqlh">${escape_html(tag)}</li>`);
			}
			$$renderer.push(`<!--]--></ul> <span class="proj-link svelte-1adnqlh">Preview the build <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" class="svelte-1adnqlh"><path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div></a>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/PackageSection.svelte
function PackageSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const packages = [
			{
				id: "starter",
				name: "Starter Presence",
				tagline: "For businesses that need to look professional and get online quickly.",
				recommended: false,
				features: [
					"Mobile-ready website",
					"Basic SEO setup",
					"Contact form",
					"Hosting setup",
					"Basic launch support"
				],
				cta: "Start with Starter"
			},
			{
				id: "business",
				name: "Business Presence",
				tagline: "For businesses that want stronger lead capture and ongoing support.",
				recommended: true,
				features: [
					"Everything in Starter",
					"Quote request system",
					"Google visibility setup",
					"Monthly care plan",
					"Technical support",
					"Updates and backups"
				],
				cta: "Start with Business"
			},
			{
				id: "growth",
				name: "Growth System",
				tagline: "For businesses ready for a more complete digital setup.",
				recommended: false,
				features: [
					"Everything in Business",
					"Advanced lead capture",
					"Analytics setup",
					"Ongoing improvements",
					"Priority support"
				],
				cta: "Start with Growth"
			}
		];
		$$renderer.push(`<section id="packages" class="pkg-section svelte-1lcvqlx"><div class="pkg-glow-l svelte-1lcvqlx" aria-hidden="true"></div> <div class="pkg-glow-r svelte-1lcvqlx" aria-hidden="true"></div> <div class="pkg-container svelte-1lcvqlx"><div class="pkg-header svelte-1lcvqlx"><h2 class="pkg-heading svelte-1lcvqlx">Choose the Level of Support Your Business Needs.</h2> <p class="pkg-intro svelte-1lcvqlx">Whether you need a simple professional presence or a stronger digital system with ongoing support, we'll help you choose the right setup.</p></div> <div class="pkg-grid svelte-1lcvqlx"><!--[-->`);
		const each_array = ensure_array_like(packages);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let pkg = each_array[i];
			$$renderer.push(`<div${attr_class("pkg-card svelte-1lcvqlx", void 0, { "pkg-card--rec": pkg.recommended })}${attr("aria-label", `${stringify(pkg.name)} package`)}>`);
			if (pkg.recommended) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rec-border svelte-1lcvqlx" aria-hidden="true"></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div class="pkg-card-inner svelte-1lcvqlx"><div class="pkg-top svelte-1lcvqlx">`);
			if (pkg.recommended) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="rec-badge svelte-1lcvqlx" role="img" aria-label="Recommended"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.6)" stroke-width="0.8"></circle><circle cx="5" cy="5" r="2" fill="#818cf8"></circle></svg> Recommended</span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="pkg-spacer svelte-1lcvqlx" aria-hidden="true"></span>`);
			}
			$$renderer.push(`<!--]--> <h3 class="pkg-name svelte-1lcvqlx">${escape_html(pkg.name)}</h3> <p class="pkg-tagline svelte-1lcvqlx">${escape_html(pkg.tagline)}</p></div> <div class="pkg-rule svelte-1lcvqlx" aria-hidden="true"></div> <ul class="pkg-features svelte-1lcvqlx" aria-label="What's included"><!--[-->`);
			const each_array_1 = ensure_array_like(pkg.features);
			for (let $$index = 0, $$length = each_array_1.length; $$index < $$length; $$index++) {
				let feature = each_array_1[$$index];
				$$renderer.push(`<li class="pkg-feature svelte-1lcvqlx"><svg class="feat-check svelte-1lcvqlx" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="6.5"${attr("stroke", pkg.recommended ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.1)")} stroke-width="1"></circle><path d="M4.5 7.5l2 2L10.5 5.5"${attr("stroke", pkg.recommended ? "#a5b4fc" : "rgba(255,255,255,0.4)")} stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg> <span class="svelte-1lcvqlx">${escape_html(feature)}</span></li>`);
			}
			$$renderer.push(`<!--]--></ul> <div class="pkg-cta-wrap svelte-1lcvqlx"><button${attr_class("pkg-cta svelte-1lcvqlx", void 0, {
				"pkg-cta--primary": pkg.recommended,
				"pkg-cta--ghost": !pkg.recommended
			})}>${escape_html(pkg.cta)} <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" class="svelte-1lcvqlx"><path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div> <p class="pkg-note svelte-1lcvqlx">Not sure which is right for you? <button class="pkg-note-link svelte-1lcvqlx">Get in touch and we'll advise you →</button></p></div></section>`);
	});
}
//#endregion
//#region src/lib/components/ManifestoSection.svelte
function ManifestoSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const team = [{
			name: "Jonathan Theron",
			badge: "Co-Founder",
			subtitle: "Design & Development",
			quote: "I believe every South African business deserves a digital presence that actually works not just looks the part. I handle the design, development and technical side of every project personally.",
			initials: "JT",
			accent: "#6366f1",
			glow: "rgba(99,102,241,0.18)"
		}, {
			name: "Caleb Theron",
			badge: "Co-Founder",
			subtitle: "Strategy & Client Relations",
			quote: "I focus on understanding what each client actually needs and making sure we deliver something that moves their business forward. The relationship does not end at launch.",
			initials: "CT",
			accent: "#22d3ee",
			glow: "rgba(34,211,238,0.15)"
		}];
		$$renderer.push(`<section class="team-section svelte-64n1s7"><div class="t-glow-l svelte-64n1s7" aria-hidden="true"></div> <div class="t-glow-r svelte-64n1s7" aria-hidden="true"></div> <div class="t-container svelte-64n1s7"><div class="t-header svelte-64n1s7"><h2 class="t-heading svelte-64n1s7">The team behind BuildSynergy.</h2> <p class="t-sub svelte-64n1s7">Two brothers. One focused on building, one on business.
        Together we handle every project end to end from the first conversation to ongoing support.</p></div> <div class="t-grid svelte-64n1s7"><!--[-->`);
		const each_array = ensure_array_like(team);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let member = each_array[i];
			$$renderer.push(`<div class="t-card svelte-64n1s7"${attr_style(`--accent:${stringify(member.accent)}; --glow:${stringify(member.glow)}`)}><div class="t-beam svelte-64n1s7" aria-hidden="true"></div> <div class="t-photo svelte-64n1s7" aria-hidden="true"><div class="t-photo-glow svelte-64n1s7"></div> <svg class="t-silhouette svelte-64n1s7" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="60" cy="42" r="26" fill="currentColor" opacity="0.13"></circle><path d="M10 140 C10 100 30 82 60 82 C90 82 110 100 110 140" fill="currentColor" opacity="0.1"></path></svg> <span class="t-initials svelte-64n1s7">${escape_html(member.initials)}</span></div> <div class="t-info svelte-64n1s7"><div class="t-name-row svelte-64n1s7"><h3 class="t-name svelte-64n1s7">${escape_html(member.name)}</h3> <span class="t-role-badge svelte-64n1s7">${escape_html(member.badge)}</span></div> <p class="t-role svelte-64n1s7">${escape_html(member.subtitle)}</p></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer) {
	head("1uha8ag", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>BuildSynergy Professional Websites &amp; Digital Solutions for South African Businesses</title>`);
		});
		$$renderer.push(`<meta name="description" content="BuildSynergy helps South African businesses look more credible online, get found faster, capture enquiries and stay supported after launch."/>`);
	});
	Navigation($$renderer, {});
	$$renderer.push(`<!----> <main>`);
	Hero($$renderer, {});
	$$renderer.push(`<!----> `);
	TrustStrip($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	ProblemSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	SolutionSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	ProcessSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	ProjectsSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	PackageSection($$renderer, {});
	$$renderer.push(`<!----> `);
	ManifestoSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	FinalCTA($$renderer, {});
	$$renderer.push(`<!----></main> `);
	Footer($$renderer, {});
	$$renderer.push(`<!---->`);
}
//#endregion
export { _page as default };
