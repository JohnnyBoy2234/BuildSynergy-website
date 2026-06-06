import "../../chunks/index-server.js";
import { R as attr, a as ensure_array_like, c as stringify, n as attr_class, o as head, r as attr_style, z as escape_html } from "../../chunks/dev.js";
import "gsap";
import "gsap/ScrollTrigger";
import "three";
//#region src/lib/components/Navigation.svelte
function Navigation($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const navItems = [
			{
				name: "Home",
				id: "home"
			},
			{
				name: "Services",
				id: "services"
			},
			{
				name: "Team",
				id: "team"
			},
			{
				name: "Contact",
				id: "contact"
			}
		];
		let activeTab = navItems[0].name;
		let lampLeft = 0;
		let lampWidth = 0;
		$$renderer.push(`<header${attr_class("nav-wrap svelte-ocbj1u", void 0, { "mobile": false })}>`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<a class="nav-logo svelte-ocbj1u" href="/"><svg class="logo-mark svelte-ocbj1u" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="lgMark" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"></stop><stop offset="50%" stop-color="#a855f7"></stop><stop offset="100%" stop-color="#22d3ee"></stop></linearGradient></defs><path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="url(#lgMark)" stroke-width="1.4" fill="none" stroke-linejoin="round"></path><path d="M12 6 L17 10 L12 18 L7 10 Z" fill="url(#lgMark)" opacity="0.25"></path><circle cx="12" cy="2" r="1.4" fill="#6366f1"></circle><circle cx="20" cy="9" r="1.1" fill="#a855f7"></circle><circle cx="4" cy="9" r="1.1" fill="#22d3ee"></circle><circle cx="12" cy="22" r="1.2" fill="#22d3ee"></circle></svg> <span class="logo-text svelte-ocbj1u">Build<span class="logo-accent svelte-ocbj1u">Synergy</span></span></a>`);
		$$renderer.push(`<!--]--> <nav class="nav-pill svelte-ocbj1u" aria-label="Main navigation"><div class="lamp svelte-ocbj1u"${attr_style(`left: ${stringify(lampLeft)}px; width: ${stringify(lampWidth)}px`)} aria-hidden="true"><div class="lamp-bar svelte-ocbj1u"><div class="lamp-bloom lamp-bloom--wide svelte-ocbj1u"></div> <div class="lamp-bloom lamp-bloom--mid svelte-ocbj1u"></div> <div class="lamp-bloom lamp-bloom--tight svelte-ocbj1u"></div></div></div> <!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let item = each_array[i];
			$$renderer.push(`<button${attr_class("nav-item svelte-ocbj1u", void 0, { "active": activeTab === item.name })}${attr("aria-current", activeTab === item.name ? "page" : void 0)}>`);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html(item.name)}`);
			$$renderer.push(`<!--]--></button>`);
		}
		$$renderer.push(`<!--]--> <a href="#contact" class="nav-cta svelte-ocbj1u">${escape_html("Start a Project")}</a></nav></header> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/Hero.svelte
function Hero($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<section id="home" class="hero svelte-1q37ri0"><canvas class="beams-canvas svelte-1q37ri0" aria-hidden="true" style="filter: blur(15px)"></canvas> <div class="vignette svelte-1q37ri0" aria-hidden="true"></div> <div class="breathe svelte-1q37ri0" aria-hidden="true"></div> <div${attr_class("hero-content svelte-1q37ri0", void 0, { "ready": false })}><div class="hero-eyebrow-wrap svelte-1q37ri0"><span class="hero-eyebrow svelte-1q37ri0">Premium Digital Solutions</span></div> <h1 class="hero-heading svelte-1q37ri0">Make your business look<br class="svelte-1q37ri0"/> as good as the work you do.</h1> <p class="hero-sub svelte-1q37ri0">BuildSynergy creates professional websites and digital solutions that help businesses
      build trust, attract customers, and grow online.</p> <div class="hero-ctas svelte-1q37ri0"><button class="btn-primary svelte-1q37ri0">Start a Project</button> <button class="btn-secondary svelte-1q37ri0">View Our Services</button></div> <div class="scroll-hint svelte-1q37ri0" aria-hidden="true"><span class="scroll-line svelte-1q37ri0"></span> Scroll to explore</div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/ProblemSection.svelte
function ProblemSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const problems = [
			{
				num: "01",
				label: "Outdated website",
				desc: "A website that looks old signals that your business might be too."
			},
			{
				num: "02",
				label: "Poor mobile experience",
				desc: "Most customers browse on their phone. A broken mobile site loses them."
			},
			{
				num: "03",
				label: "Weak first impression",
				desc: "You have seconds to earn trust. A low-quality site spends them badly."
			},
			{
				num: "04",
				label: "Difficult contact process",
				desc: "If contacting you is unclear, customers give up and call a competitor."
			},
			{
				num: "05",
				label: "Missing information",
				desc: "Customers need to understand what you do, where you are, and why to choose you."
			},
			{
				num: "06",
				label: "Low online trust",
				desc: "No reviews, no visuals, no clear brand and serious customers walk away."
			}
		];
		$$renderer.push(`<section id="problem" class="problem-section svelte-1yh2lju"><div class="prob-grid-bg svelte-1yh2lju" aria-hidden="true"></div> <div class="prob-glow svelte-1yh2lju" aria-hidden="true"></div> <div class="prob-inner svelte-1yh2lju"><div class="prob-left svelte-1yh2lju"><span class="eyebrow">The Problem</span> <h2 class="svelte-1yh2lju">A strong business can still lose customers because of a weak online presence.</h2> <p class="svelte-1yh2lju">Outdated websites, poor mobile layouts, and difficult contact processes make customers choose a competitor even when your work is better.</p> <div class="accent-line svelte-1yh2lju"></div> <div class="deco-num svelte-1yh2lju" aria-hidden="true">×</div></div> <div class="prob-list svelte-1yh2lju"><!--[-->`);
		const each_array = ensure_array_like(problems);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let p = each_array[i];
			$$renderer.push(`<div class="prob-item svelte-1yh2lju"><span class="prob-num svelte-1yh2lju">${escape_html(p.num)}</span> <div class="prob-content svelte-1yh2lju"><h4 class="svelte-1yh2lju">${escape_html(p.label)}</h4> <p class="svelte-1yh2lju">${escape_html(p.desc)}</p></div> <div class="prob-arrow svelte-1yh2lju" aria-hidden="true">↗</div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/SectionCanvas.svelte
function SectionCanvas($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { particleCount = 60, opacity = .55 } = $$props;
		$$renderer.push(`<canvas class="sc svelte-68xypr" aria-hidden="true"></canvas>`);
	});
}
//#endregion
//#region src/lib/data/services.ts
var services = [
	{
		id: "websites",
		title: "Premium Business Websites",
		description: "Modern, professional websites designed to represent your business and win customer trust.",
		size: "featured"
	},
	{
		id: "redesign",
		title: "Website Redesigns",
		description: "Upgrade an outdated website into a cleaner, faster, and more credible online presence.",
		size: "large"
	},
	{
		id: "whatsapp",
		title: "WhatsApp Integration",
		description: "Give customers a direct, simple way to contact your business from your website.",
		size: "large"
	},
	{
		id: "forms",
		title: "Contact and Quote Forms",
		description: "Make it easy for customers to enquire, request pricing, or ask for more information.",
		size: "large"
	},
	{
		id: "mobile",
		title: "Mobile Optimisation",
		description: "Ensure your website works beautifully across phones, tablets, and computers.",
		size: "medium"
	},
	{
		id: "chatbot",
		title: "AI Chatbot Integration",
		description: "A helpful website assistant that answers common customer questions automatically.",
		size: "medium"
	},
	{
		id: "google",
		title: "Google Maps and Business Setup",
		description: "Help customers find and trust your business in Google Search and Maps.",
		size: "medium"
	},
	{
		id: "seo",
		title: "SEO Foundations",
		description: "Structure your website so search engines can better discover your business.",
		size: "medium"
	},
	{
		id: "profile",
		title: "Company Profile PDFs",
		description: "Professional company documents that support your sales process.",
		size: "small"
	},
	{
		id: "media",
		title: "Photography and Video",
		description: "Better visuals that show customers the quality of your work.",
		size: "small"
	},
	{
		id: "analytics",
		title: "Website Analytics",
		description: "Understand how visitors find and use your website.",
		size: "small"
	},
	{
		id: "maintenance",
		title: "Ongoing Maintenance",
		description: "Keep your website updated, supported, and working properly after launch.",
		size: "small"
	}
];
//#endregion
//#region src/lib/components/ServicesSection.svelte
function ServicesSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const featured = services.filter((s) => s.size === "featured");
		const large = services.filter((s) => s.size === "large");
		const medium = services.filter((s) => s.size === "medium");
		const small = services.filter((s) => s.size === "small");
		$$renderer.push(`<section id="services" class="services-section svelte-1aoc31z">`);
		SectionCanvas($$renderer, {
			particleCount: 55,
			opacity: .45
		});
		$$renderer.push(`<!----> <div class="svc-overlay svelte-1aoc31z" aria-hidden="true"></div> <div class="svc-inner svelte-1aoc31z"><div class="svc-header svelte-1aoc31z"><span class="eyebrow">Our Solution</span> <h2 class="svelte-1aoc31z">Everything your business needs to look stronger online.</h2> <p class="svelte-1aoc31z">We create the digital tools that help your business look professional, build trust, and make it easier for customers to reach you.</p></div> <div class="svc-grid svelte-1aoc31z"><!--[-->`);
		const each_array = ensure_array_like(featured);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let s = each_array[i];
			$$renderer.push(`<div class="svc-card svc-featured svelte-1aoc31z"><div class="feat-badge svelte-1aoc31z">Featured Service</div> <div class="feat-content svelte-1aoc31z"><div><h3 class="svelte-1aoc31z">${escape_html(s.title)}</h3> <p class="svelte-1aoc31z">${escape_html(s.description)}</p> <div class="feat-line svelte-1aoc31z"></div></div> <div class="feat-visual svelte-1aoc31z" aria-hidden="true"><div class="fv-bar svelte-1aoc31z"></div> <div class="fv-bar fv-bar--b svelte-1aoc31z"></div> <div class="fv-bar fv-bar--c svelte-1aoc31z"></div> <div class="fv-dot svelte-1aoc31z"></div> <div class="fv-btn svelte-1aoc31z"></div></div></div></div>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_1 = ensure_array_like(large);
		for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
			let s = each_array_1[i];
			$$renderer.push(`<div class="svc-card svc-large svelte-1aoc31z"><div class="svc-index svelte-1aoc31z">${escape_html(String(i + 2).padStart(2, "0"))}</div> <h4 class="svelte-1aoc31z">${escape_html(s.title)}</h4> <p class="svelte-1aoc31z">${escape_html(s.description)}</p></div>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_2 = ensure_array_like(medium);
		for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
			let s = each_array_2[i];
			$$renderer.push(`<div class="svc-card svc-medium svelte-1aoc31z"><div class="svc-dot svelte-1aoc31z"></div> <h4 class="svelte-1aoc31z">${escape_html(s.title)}</h4> <p class="svelte-1aoc31z">${escape_html(s.description)}</p></div>`);
		}
		$$renderer.push(`<!--]--> <!--[-->`);
		const each_array_3 = ensure_array_like(small);
		for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
			let s = each_array_3[i];
			$$renderer.push(`<div class="svc-card svc-small svelte-1aoc31z"><div class="svc-dot svc-dot--sm svelte-1aoc31z"></div> <h4 class="svelte-1aoc31z">${escape_html(s.title)}</h4> <p class="svelte-1aoc31z">${escape_html(s.description)}</p></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/lib/data/team.ts
var team = [
	{
		id: "strategy",
		initials: "JT",
		name: "Jonathan",
		role: "Founder and Strategy Lead",
		description: "Business direction, client strategy, and digital modernisation."
	},
	{
		id: "design",
		initials: "CD",
		name: "Creative",
		role: "Creative Designer",
		description: "Website design, visual direction, and premium brand presentation."
	},
	{
		id: "dev",
		initials: "WD",
		name: "Development",
		role: "Web Developer",
		description: "Fast, responsive, and professional website builds."
	},
	{
		id: "content",
		initials: "CM",
		name: "Content",
		role: "Content and Media Specialist",
		description: "Website copy, photography, video, and company profiles."
	},
	{
		id: "seo",
		initials: "SV",
		name: "Visibility",
		role: "SEO and Visibility Specialist",
		description: "Google visibility, SEO foundations, and online discoverability."
	},
	{
		id: "support",
		initials: "SG",
		name: "Support",
		role: "Support and Maintenance Lead",
		description: "Website updates, ongoing support, and post-launch improvements."
	}
];
//#endregion
//#region src/lib/components/TeamSection.svelte
function TeamSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const accents = [
			{
				from: "#6366f1",
				to: "#a855f7"
			},
			{
				from: "#a855f7",
				to: "#e879f9"
			},
			{
				from: "#22d3ee",
				to: "#6366f1"
			},
			{
				from: "#e879f9",
				to: "#22d3ee"
			},
			{
				from: "#6366f1",
				to: "#22d3ee"
			},
			{
				from: "#a855f7",
				to: "#6366f1"
			}
		];
		$$renderer.push(`<section id="team" class="team-section svelte-1uhbygo"><div class="team-bg svelte-1uhbygo" aria-hidden="true"></div> <div class="team-grid-bg svelte-1uhbygo" aria-hidden="true"></div> <div class="team-inner svelte-1uhbygo"><div class="team-header svelte-1uhbygo"><span class="eyebrow">Our Team</span> <h2 class="svelte-1uhbygo">The people behind the work.</h2> <p class="svelte-1uhbygo">Strategy, design, development, content, and support a focused team helping businesses show up better online.</p></div> <div class="team-grid svelte-1uhbygo"><!--[-->`);
		const each_array = ensure_array_like(team);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let member = each_array[i];
			$$renderer.push(`<div class="team-card svelte-1uhbygo"><div class="card-top-line svelte-1uhbygo"${attr_style(`background: linear-gradient(90deg, ${stringify(accents[i].from)}, ${stringify(accents[i].to)})`)} aria-hidden="true"></div> <div class="card-avatar svelte-1uhbygo"${attr_style(`background: linear-gradient(135deg, ${stringify(accents[i].from)}22, ${stringify(accents[i].to)}15)`)}><span class="av-initials svelte-1uhbygo"${attr_style(`background: linear-gradient(135deg, ${stringify(accents[i].from)}, ${stringify(accents[i].to)}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`)}>${escape_html(member.initials)}</span></div> <div class="card-body"><div class="card-role svelte-1uhbygo">${escape_html(member.role)}</div> <p class="card-desc svelte-1uhbygo">${escape_html(member.description)}</p></div> <div class="card-glow svelte-1uhbygo"${attr_style(`background: radial-gradient(ellipse 80% 60% at 50% 0%, ${stringify(accents[i].from)}12, transparent 70%)`)} aria-hidden="true"></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/ContactSection.svelte
function ContactSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const serviceOptions = [
			"New Website",
			"Website Redesign",
			"WhatsApp Integration",
			"Contact or Quote Forms",
			"AI Chatbot",
			"Google Visibility",
			"Company Profile",
			"Photography or Video",
			"Website Maintenance",
			"Not Sure Yet"
		];
		let name = "";
		let businessName = "";
		let email = "";
		let phone = "";
		let website = "";
		let selectedService = "";
		let message = "";
		let submitting = false;
		let errors = {};
		$$renderer.push(`<section id="contact" class="contact-section svelte-1mt7jo5">`);
		SectionCanvas($$renderer, {
			particleCount: 45,
			opacity: .35
		});
		$$renderer.push(`<!----> <div class="ct-glow ct-glow--l svelte-1mt7jo5" aria-hidden="true"></div> <div class="ct-glow ct-glow--r svelte-1mt7jo5" aria-hidden="true"></div> <div class="ct-inner svelte-1mt7jo5"><div class="ct-header svelte-1mt7jo5"><span class="eyebrow">Start a Project</span> <h2 class="svelte-1mt7jo5">Ready to give your business a stronger online presence?</h2> <p class="svelte-1mt7jo5">Tell us about your business and what you'd like to improve. We'll help you identify the right digital solution.</p></div> <div class="ct-panel svelte-1mt7jo5">`);
		{
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<form novalidate="" class="svelte-1mt7jo5"><div class="form-row svelte-1mt7jo5"><div${attr_class("form-field svelte-1mt7jo5", void 0, { "err": errors.name })}><label for="c-name" class="svelte-1mt7jo5">Name</label> <input id="c-name" type="text" placeholder="Your name"${attr("value", name)} autocomplete="name" class="svelte-1mt7jo5"/> `);
			if (errors.name) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="err-msg svelte-1mt7jo5">${escape_html(errors.name)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div${attr_class("form-field svelte-1mt7jo5", void 0, { "err": errors.businessName })}><label for="c-biz" class="svelte-1mt7jo5">Business Name</label> <input id="c-biz" type="text" placeholder="Your business"${attr("value", businessName)} class="svelte-1mt7jo5"/> `);
			if (errors.businessName) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="err-msg svelte-1mt7jo5">${escape_html(errors.businessName)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="form-row svelte-1mt7jo5"><div${attr_class("form-field svelte-1mt7jo5", void 0, { "err": errors.email })}><label for="c-email" class="svelte-1mt7jo5">Email</label> <input id="c-email" type="email" placeholder="hello@yourbusiness.co.za"${attr("value", email)} autocomplete="email" class="svelte-1mt7jo5"/> `);
			if (errors.email) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="err-msg svelte-1mt7jo5">${escape_html(errors.email)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="form-field svelte-1mt7jo5"><label for="c-phone" class="svelte-1mt7jo5">Phone</label> <input id="c-phone" type="tel" placeholder="+27 81 000 0000"${attr("value", phone)} autocomplete="tel" class="svelte-1mt7jo5"/></div></div> <div class="form-field svelte-1mt7jo5"><label for="c-site" class="svelte-1mt7jo5">Website <span class="opt svelte-1mt7jo5">(optional)</span></label> <input id="c-site" type="url" placeholder="https://yourbusiness.co.za"${attr("value", website)} class="svelte-1mt7jo5"/></div> <div class="form-field svelte-1mt7jo5"><label class="svelte-1mt7jo5">What do you need help with?</label> <div class="chips svelte-1mt7jo5" role="group"><!--[-->`);
			const each_array = ensure_array_like(serviceOptions);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let opt = each_array[$$index];
				$$renderer.push(`<button type="button"${attr_class("chip svelte-1mt7jo5", void 0, { "active": selectedService === opt })}${attr("aria-pressed", selectedService === opt)}>${escape_html(opt)}</button>`);
			}
			$$renderer.push(`<!--]--></div></div> <div${attr_class("form-field svelte-1mt7jo5", void 0, { "err": errors.message })}><label for="c-msg" class="svelte-1mt7jo5">Project Message</label> <textarea id="c-msg" rows="4" placeholder="Tell us about your project and goals..." class="svelte-1mt7jo5">`);
			const $$body = escape_html(message);
			if ($$body) $$renderer.push(`${$$body}`);
			$$renderer.push(`</textarea> `);
			if (errors.message) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="err-msg svelte-1mt7jo5">${escape_html(errors.message)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="form-actions svelte-1mt7jo5"><button type="submit" class="btn-submit svelte-1mt7jo5"${attr("disabled", submitting, true)}>${escape_html("Start My Project")}</button> <a href="mailto:hello@buildsynergy.co.za" class="alt-link svelte-1mt7jo5">Or book a consultation →</a></div> <p class="privacy svelte-1mt7jo5">Your information is kept private and only used to respond to your enquiry.</p></form>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/Footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const year = (/* @__PURE__ */ new Date()).getFullYear();
		$$renderer.push(`<footer class="footer svelte-jz8lnl"><div class="footer-fade svelte-jz8lnl" aria-hidden="true"></div> <div class="footer-grid-bg svelte-jz8lnl" aria-hidden="true"></div> <div class="footer-inner svelte-jz8lnl"><div class="footer-top svelte-jz8lnl"><div class="footer-brand svelte-jz8lnl"><div class="logo svelte-jz8lnl">Build<span class="svelte-jz8lnl">Synergy</span></div> <p class="svelte-jz8lnl">Premium websites and digital solutions<br/>for modern South African businesses.</p> <a href="mailto:hello@buildsynergy.co.za" class="footer-email svelte-jz8lnl">hello@buildsynergy.co.za</a></div> <nav class="footer-nav svelte-jz8lnl" aria-label="Footer"><div class="nav-col svelte-jz8lnl"><span class="nav-label svelte-jz8lnl">Navigate</span> <ul class="svelte-jz8lnl"><li><a href="#home" class="svelte-jz8lnl">Home</a></li> <li><a href="#services" class="svelte-jz8lnl">Services</a></li> <li><a href="#team" class="svelte-jz8lnl">Team</a></li> <li><a href="#contact" class="svelte-jz8lnl">Contact</a></li></ul></div> <div class="nav-col svelte-jz8lnl"><span class="nav-label svelte-jz8lnl">Connect</span> <ul class="svelte-jz8lnl"><li><a href="/" aria-label="LinkedIn" class="svelte-jz8lnl">LinkedIn</a></li> <li><a href="/" aria-label="Facebook" class="svelte-jz8lnl">Facebook</a></li> <li><a href="/" aria-label="Instagram" class="svelte-jz8lnl">Instagram</a></li></ul></div></nav></div> <div class="footer-divider svelte-jz8lnl"></div> <div class="footer-bottom svelte-jz8lnl"><span>© ${escape_html(year)} BuildSynergy. All rights reserved.</span> <button class="back-top svelte-jz8lnl" aria-label="Back to top">↑ Top</button></div></div></footer>`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer) {
	head("1uha8ag", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>BuildSynergy Premium Websites and Digital Solutions</title>`);
		});
	});
	Navigation($$renderer, {});
	$$renderer.push(`<!----> <main>`);
	Hero($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	ProblemSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	ServicesSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	TeamSection($$renderer, {});
	$$renderer.push(`<!----> <div class="divider"></div> `);
	ContactSection($$renderer, {});
	$$renderer.push(`<!----></main> `);
	Footer($$renderer, {});
	$$renderer.push(`<!---->`);
}
//#endregion
export { _page as default };
