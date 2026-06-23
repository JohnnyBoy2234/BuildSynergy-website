import "../../../chunks/internal.js";
import { B as attr, V as escape_html, o as ensure_array_like, r as attr_style } from "../../../chunks/dev.js";
import { n as Navigation, t as Footer } from "../../../chunks/Footer.js";
import { r as projects } from "../../../chunks/portfolio.js";
import { n as AuroraBackground, t as Seo } from "../../../chunks/Seo.js";
import "gsap";
import "gsap/ScrollTrigger";
//#region src/lib/components/ProjectCard.svelte
function ProjectCard($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { project } = $$props;
		$$renderer.push(`<a class="proj-card svelte-oviq8z"${attr("href", `/portfolio/${project.slug}`)}${attr("aria-label", `${project.title} — ${project.category}`)}><div class="card-spotlight svelte-oviq8z" aria-hidden="true"></div> <div class="card-media svelte-oviq8z"><img${attr("src", project.heroImage)}${attr("alt", `${project.title} preview`)} loading="lazy"${attr_style(`view-transition-name: hero-${project.slug}`)} class="svelte-oviq8z"/></div> <div class="card-body svelte-oviq8z"><div class="card-meta svelte-oviq8z"><span class="card-cat">${escape_html(project.category)}</span> <span class="card-year">${escape_html(project.year)}</span></div> <h3 class="card-title svelte-oviq8z">${escape_html(project.title)}</h3> <p class="card-summary svelte-oviq8z">${escape_html(project.summary)}</p> <span class="card-cta svelte-oviq8z">View project →</span></div></a>`);
	});
}
//#endregion
//#region src/routes/portfolio/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		Seo($$renderer, {
			title: "Our Work | BuildSynergy Portfolio",
			description: "Selected websites, apps and brands BuildSynergy has built for South African businesses — with the problem, the build and the outcome for each.",
			path: "/portfolio"
		});
		$$renderer.push(`<!----> `);
		Navigation($$renderer, {});
		$$renderer.push(`<!----> `);
		AuroraBackground($$renderer, {});
		$$renderer.push(`<!----> <main class="port svelte-1uo84gz"><header class="port-head svelte-1uo84gz"><p class="port-eyebrow svelte-1uo84gz">Our work</p> <h1 class="port-title svelte-1uo84gz">Projects we've shipped.</h1> <p class="port-sub svelte-1uo84gz">A selection of websites, apps and brands we've built for South African businesses.
      Click any project to see the problem, what we built and the outcome.</p></header> <div class="port-grid svelte-1uo84gz"><!--[-->`);
		const each_array = ensure_array_like(projects);
		for (let i = 0, $$length = each_array.length; i < $$length; i++) {
			let project = each_array[i];
			$$renderer.push(`<div>`);
			ProjectCard($$renderer, { project });
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]--></div></main> `);
		Footer($$renderer, {});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };
