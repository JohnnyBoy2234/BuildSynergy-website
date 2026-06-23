import "../../../../chunks/internal.js";
import { B as attr, V as escape_html, a as derived, i as bind_props, n as attr_class, o as ensure_array_like, r as attr_style } from "../../../../chunks/dev.js";
import { n as Navigation, t as Footer } from "../../../../chunks/Footer.js";
import { t as FinalCTA } from "../../../../chunks/FinalCTA.js";
import "../../../../chunks/portfolio.js";
import { n as AuroraBackground, t as Seo } from "../../../../chunks/Seo.js";
import "gsap";
import "gsap/ScrollTrigger";
//#region src/lib/components/OutcomeMetrics.svelte
function OutcomeMetrics($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { metrics } = $$props;
		$$renderer.push(`<div class="metrics svelte-1a5ombf"><!--[-->`);
		const each_array = ensure_array_like(metrics);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let m = each_array[i];
			$$renderer.push(`<div class="metric svelte-1a5ombf"><span class="metric-value svelte-1a5ombf">${escape_html(m.prefix ?? "")}0${escape_html(m.suffix ?? "")}</span> <span class="metric-label svelte-1a5ombf">${escape_html(m.label)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/ProjectLightbox.svelte
function ProjectLightbox($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { images, alt, open = false, index = 0 } = $$props;
		if (open) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="lb svelte-cemcn0" role="dialog" aria-modal="true"${attr("aria-label", `${alt} gallery`)}><button class="lb-backdrop svelte-cemcn0" aria-label="Close gallery"></button> <button class="lb-btn lb-close svelte-cemcn0" aria-label="Close">×</button> `);
			if (images.length > 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="lb-btn lb-prev svelte-cemcn0" aria-label="Previous image">‹</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <img class="lb-img svelte-cemcn0"${attr("src", images[index])}${attr("alt", `${alt} — image ${index + 1} of ${images.length}`)}/> `);
			if (images.length > 1) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="lb-btn lb-next svelte-cemcn0" aria-label="Next image">›</button> <div class="lb-count svelte-cemcn0">${escape_html(index + 1)} / ${escape_html(images.length)}</div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			open,
			index
		});
	});
}
//#endregion
//#region src/routes/portfolio/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const project = derived(() => data.project);
		const story = derived(() => [project().heroImage, ...project().gallery].slice(0, 3));
		const blocks = derived(() => [
			{
				label: "The challenge",
				body: project().caseStudy.challenge
			},
			{
				label: "What we built",
				body: project().caseStudy.approach
			},
			{
				label: "The outcome",
				body: project().caseStudy.outcome
			}
		]);
		let activeImg = 0;
		let lbOpen = false;
		let lbIndex = 0;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Seo($$renderer, {
				title: `${project().title} — BuildSynergy Work`,
				description: project().summary,
				path: `/portfolio/${project().slug}`
			});
			$$renderer.push(`<!----> `);
			Navigation($$renderer, {});
			$$renderer.push(`<!----> `);
			AuroraBackground($$renderer, {});
			$$renderer.push(`<!----> <main class="detail svelte-15ehqgt"><div class="detail-inner svelte-15ehqgt"><a class="back svelte-15ehqgt" href="/portfolio">← All work</a> <header class="hero svelte-15ehqgt"><div class="hero-text svelte-15ehqgt"><div class="hero-meta svelte-15ehqgt"><span>${escape_html(project().category)}</span><span>·</span><span>${escape_html(project().year)}</span></div> <h1 class="hero-title svelte-15ehqgt">${escape_html(project().title)}</h1> <p class="hero-summary svelte-15ehqgt">${escape_html(project().summary)}</p> `);
			if (project().liveUrl) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<a class="visit svelte-15ehqgt"${attr("href", project().liveUrl)} target="_blank" rel="noopener noreferrer">Visit site →</a>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="hero-media svelte-15ehqgt"><img${attr("src", project().heroImage)}${attr("alt", `${project().title} preview`)}${attr_style(`view-transition-name: hero-${project().slug}`)} class="svelte-15ehqgt"/></div></header> <section class="cs svelte-15ehqgt"><div class="cs-text svelte-15ehqgt"><!--[-->`);
			const each_array = ensure_array_like(blocks());
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let block = each_array[i];
				$$renderer.push(`<div class="cs-block svelte-15ehqgt"><p class="cs-label svelte-15ehqgt">${escape_html(block.label)}</p> <p class="cs-body svelte-15ehqgt">${escape_html(block.body)}</p> <img class="cs-inline-img svelte-15ehqgt"${attr("src", story()[i] ?? story()[story().length - 1])}${attr("alt", `${project().title} — ${block.label}`)}/></div>`);
			}
			$$renderer.push(`<!--]--></div> <div class="cs-media-col svelte-15ehqgt"><div class="cs-media svelte-15ehqgt"><!--[-->`);
			const each_array_1 = ensure_array_like(story());
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let src = each_array_1[i];
				$$renderer.push(`<img${attr_class("cs-shot svelte-15ehqgt", void 0, { "active": activeImg === i })}${attr("src", src)}${attr("alt", `${project().title} view ${i + 1}`)}/>`);
			}
			$$renderer.push(`<!--]--></div></div></section> <section class="metrics-wrap"><h2 class="section-h svelte-15ehqgt">The numbers</h2> `);
			OutcomeMetrics($$renderer, { metrics: project().metrics });
			$$renderer.push(`<!----></section> <section class="gallery"><h2 class="section-h svelte-15ehqgt">Gallery</h2> <div class="gallery-grid svelte-15ehqgt"><!--[-->`);
			const each_array_2 = ensure_array_like(project().gallery);
			for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
				let src = each_array_2[i];
				$$renderer.push(`<button class="gallery-item svelte-15ehqgt"${attr("aria-label", `Open image ${i + 1}`)}><img${attr("src", src)}${attr("alt", `${project().title} screenshot ${i + 1}`)} loading="lazy" class="svelte-15ehqgt"/></button>`);
			}
			$$renderer.push(`<!--]--></div></section></div></main> `);
			ProjectLightbox($$renderer, {
				images: project().gallery,
				alt: project().title,
				get open() {
					return lbOpen;
				},
				set open($$value) {
					lbOpen = $$value;
					$$settled = false;
				},
				get index() {
					return lbIndex;
				},
				set index($$value) {
					lbIndex = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			FinalCTA($$renderer, {});
			$$renderer.push(`<!----> `);
			Footer($$renderer, {});
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };
