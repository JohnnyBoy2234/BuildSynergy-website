import "./internal.js";
import { B as attr, V as escape_html, n as attr_class, o as ensure_array_like } from "./dev.js";
import "gsap";
import "gsap/ScrollTrigger";
import "three";
//#region src/lib/components/SectionCanvas.svelte
function SectionCanvas($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { particleCount = 60, opacity = .55 } = $$props;
		$$renderer.push(`<canvas class="sc svelte-68xypr" aria-hidden="true"></canvas>`);
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
		let agreed = false;
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
			$$renderer.push(`<!--]--></div> <div${attr_class("form-field agree-field svelte-1mt7jo5", void 0, { "err": errors.agreed })}><label class="agree-label svelte-1mt7jo5"><input type="checkbox"${attr("checked", agreed, true)} class="agree-check svelte-1mt7jo5"/> <span>I agree to the <a href="/privacy-policy" target="_blank" rel="noopener" class="svelte-1mt7jo5">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener" class="svelte-1mt7jo5">Terms &amp; Conditions</a>.</span></label> `);
			if (errors.agreed) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="err-msg svelte-1mt7jo5">${escape_html(errors.agreed)}</span>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="form-actions svelte-1mt7jo5"><button type="submit" class="btn-submit svelte-1mt7jo5"${attr("disabled", submitting, true)}>${escape_html("Start My Project")}</button></div></form>`);
		}
		$$renderer.push(`<!--]--></div></div></section>`);
	});
}
//#endregion
//#region src/lib/components/FinalCTA.svelte
function FinalCTA($$renderer) {
	ContactSection($$renderer, {});
}
//#endregion
export { FinalCTA as t };
