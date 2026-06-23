import { B as attr, V as escape_html, a as derived, s as head } from "./dev.js";
//#region src/lib/components/AuroraBackground.svelte
function AuroraBackground($$renderer) {
	$$renderer.push(`<div class="aurora svelte-156mybs" aria-hidden="true"><span class="blob blob--1 svelte-156mybs"></span> <span class="blob blob--2 svelte-156mybs"></span> <span class="blob blob--3 svelte-156mybs"></span></div>`);
}
//#endregion
//#region src/lib/components/Seo.svelte
function Seo($$renderer, $$props) {
	const SITE_URL = "https://www.buildsynergy.co.za";
	/** Path including leading slash, e.g. "/terms". Home is "". */
	let { title, description, path = "", noindex = false } = $$props;
	const url = derived(() => SITE_URL + path);
	const image = `${SITE_URL}/og-image.png`;
	head("gsrl61", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>${escape_html(title)}</title>`);
		});
		$$renderer.push(`<meta name="description"${attr("content", description)}/> <link rel="canonical"${attr("href", url())}/> `);
		if (noindex) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<meta name="robots" content="noindex, follow"/>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <meta property="og:type" content="website"/> <meta property="og:site_name" content="BuildSynergy"/> <meta property="og:url"${attr("content", url())}/> <meta property="og:title"${attr("content", title)}/> <meta property="og:description"${attr("content", description)}/> <meta property="og:image"${attr("content", image)}/> <meta property="og:image:width" content="1200"/> <meta property="og:image:height" content="630"/> <meta property="og:locale" content="en_ZA"/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:title"${attr("content", title)}/> <meta name="twitter:description"${attr("content", description)}/> <meta name="twitter:image"${attr("content", image)}/>`);
	});
}
//#endregion
export { AuroraBackground as n, Seo as t };
