import "./internal.js";
import { B as attr, V as escape_html, a as derived, l as stringify, n as attr_class, o as ensure_array_like, r as attr_style, u as html } from "./dev.js";
import { t as page } from "./state.js";
import "gsap";
import "gsap/ScrollTrigger";
//#region src/lib/components/Navigation.svelte
function Navigation($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const navItems = [
			{
				name: "Home",
				id: "home",
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 12L12 3l9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
			},
			{
				name: "Services",
				id: "services",
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
      </svg>`
			},
			{
				name: "Process",
				id: "process",
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="5" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <circle cx="19" cy="12" r="2.2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M7.2 12h2.6M14.2 12h2.6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".4"/>
      </svg>`
			},
			{
				name: "Work",
				id: "work",
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
      </svg>`
			},
			{
				name: "Packages",
				id: "packages",
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".45"/>
      </svg>`
			},
			{
				name: "Contact",
				id: "contact",
				icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
      </svg>`
			}
		];
		let activeTab = navItems[0].name;
		let lampLeft = 0;
		let lampWidth = 0;
		let isMobile = false;
		let scrolled = false;
		let hideLabels = derived(() => scrolled);
		let isHome = derived(() => page.url.pathname === "/");
		let contactHref = derived(() => isHome() ? "#contact" : "/#contact");
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <header${attr_class("nav-wrap svelte-ocbj1u", void 0, { "mobile": isMobile })}><nav${attr_class("nav-pill svelte-ocbj1u", void 0, { "collapsed": hideLabels() })} aria-label="Main navigation">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<a class="nav-logo-pill svelte-ocbj1u" href="/" aria-label="BuildSynergy Home"><svg class="logo-mark svelte-ocbj1u" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="lgMarkDesktop" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"></stop><stop offset="50%" stop-color="#a855f7"></stop><stop offset="100%" stop-color="#22d3ee"></stop></linearGradient></defs><path d="M12 2 L20 9 L12 22 L4 9 Z" stroke="url(#lgMarkDesktop)" stroke-width="1.4" fill="none" stroke-linejoin="round"></path><path d="M12 6 L17 10 L12 18 L7 10 Z" fill="url(#lgMarkDesktop)" opacity="0.25"></path><circle cx="12" cy="2" r="1.4" fill="#6366f1"></circle><circle cx="20" cy="9" r="1.1" fill="#a855f7"></circle><circle cx="4" cy="9" r="1.1" fill="#22d3ee"></circle><circle cx="12" cy="22" r="1.2" fill="#22d3ee"></circle></svg> <span${attr_class("logo-text svelte-ocbj1u", void 0, { "logo-hidden": hideLabels() })}>Build<span class="logo-accent svelte-ocbj1u">Synergy</span></span></a> <div class="nav-sep svelte-ocbj1u" aria-hidden="true"></div>`);
		$$renderer.push(`<!--]--> <div class="lamp svelte-ocbj1u"${attr_style(`left: ${stringify(lampLeft)}px; width: ${stringify(lampWidth)}px`)} aria-hidden="true"><div class="lamp-bar svelte-ocbj1u"><div class="lamp-bloom lamp-bloom--wide svelte-ocbj1u"></div> <div class="lamp-bloom lamp-bloom--mid svelte-ocbj1u"></div> <div class="lamp-bloom lamp-bloom--tight svelte-ocbj1u"></div></div></div> <!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let item = each_array[i];
			$$renderer.push(`<button${attr_class("nav-item svelte-ocbj1u", void 0, { "active": activeTab === item.name })}${attr("aria-current", activeTab === item.name ? "page" : void 0)}${attr("aria-label", item.name)}><span class="nav-icon svelte-ocbj1u">${html(item.icon)}</span> <span class="nav-label svelte-ocbj1u">${escape_html(item.name)}</span></button>`);
		}
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<a${attr("href", contactHref())}${attr_class("nav-cta svelte-ocbj1u", void 0, { "cta-icon": hideLabels() })}>`);
		if (hideLabels()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`Start a Project`);
		}
		$$renderer.push(`<!--]--></a>`);
		$$renderer.push(`<!--]--></nav></header>`);
	});
}
//#endregion
//#region src/lib/components/Footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const year = (/* @__PURE__ */ new Date()).getFullYear();
		let isHome = derived(() => page.url.pathname === "/");
		function navHref(id) {
			return isHome() ? `#${id}` : `/#${id}`;
		}
		$$renderer.push(`<footer class="footer svelte-jz8lnl"><div class="footer-fade svelte-jz8lnl" aria-hidden="true"></div> <div class="footer-grid-bg svelte-jz8lnl" aria-hidden="true"></div> <div class="footer-inner svelte-jz8lnl"><div class="footer-top svelte-jz8lnl"><div class="footer-brand svelte-jz8lnl"><div class="logo svelte-jz8lnl">Build<span class="svelte-jz8lnl">Synergy</span></div> <p class="svelte-jz8lnl">Premium websites and digital solutions<br/>for modern South African businesses.</p> <a href="mailto:yoursupport@buildsynergy.co.za" class="footer-email svelte-jz8lnl">yoursupport@buildsynergy.co.za</a></div> <nav class="footer-nav svelte-jz8lnl" aria-label="Footer"><div class="nav-col svelte-jz8lnl"><span class="nav-label svelte-jz8lnl">Navigate</span> <ul class="svelte-jz8lnl"><li><a${attr("href", navHref("home"))} class="svelte-jz8lnl">Home</a></li> <li><a${attr("href", navHref("solution"))} class="svelte-jz8lnl">Services</a></li> <li><a${attr("href", navHref("process"))} class="svelte-jz8lnl">Process</a></li> <li><a${attr("href", navHref("work"))} class="svelte-jz8lnl">Our Work</a></li> <li><a${attr("href", navHref("packages"))} class="svelte-jz8lnl">Packages</a></li> <li><a${attr("href", navHref("contact"))} class="svelte-jz8lnl">Contact</a></li></ul></div> <div class="nav-col svelte-jz8lnl"><span class="nav-label svelte-jz8lnl">Connect</span> <ul class="svelte-jz8lnl"><li><a href="/" aria-label="LinkedIn" class="svelte-jz8lnl">LinkedIn</a></li> <li><a href="/" aria-label="Facebook" class="svelte-jz8lnl">Facebook</a></li> <li><a href="/" aria-label="Instagram" class="svelte-jz8lnl">Instagram</a></li></ul></div> <div class="nav-col svelte-jz8lnl"><span class="nav-label svelte-jz8lnl">Legal</span> <ul class="svelte-jz8lnl"><li><a href="/privacy-policy" class="svelte-jz8lnl">Privacy Policy</a></li> <li><a href="/terms" class="svelte-jz8lnl">Terms &amp; Conditions</a></li></ul></div></nav></div> <div class="footer-divider svelte-jz8lnl"></div> <div class="footer-bottom svelte-jz8lnl"><span>© ${escape_html(year)} BuildSynergy. All rights reserved.  ·  <a href="/privacy-policy" class="legal-link svelte-jz8lnl">Privacy Policy</a></span> <button class="back-top svelte-jz8lnl" aria-label="Back to top">↑ Top</button></div></div></footer>`);
	});
}
//#endregion
export { Navigation as n, Footer as t };
