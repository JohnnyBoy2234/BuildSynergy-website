//#region src/lib/portfolio.ts
var SHOTS = ["/portfolio/placeholders/shot-1.svg", "/portfolio/placeholders/shot-2.svg"];
var projects = [
	{
		slug: "northwind-plumbing",
		title: "Northwind Plumbing",
		category: "Website & Local SEO",
		year: "2026",
		summary: "A trades website that turns local searches into booked call-outs.",
		heroImage: "/portfolio/northwind-plumbing/hero.svg",
		gallery: SHOTS,
		tags: [
			"SvelteKit",
			"Local SEO",
			"Lead Capture"
		],
		liveUrl: "https://example.com",
		featured: true,
		caseStudy: {
			challenge: "Northwind relied on word of mouth and a dated one-page site that never showed up for \"emergency plumber near me\". Enquiries were unpredictable and easy to miss.",
			approach: "We rebuilt the site around the jobs people actually search for, wired up a quote form that lands straight in their inbox, and set up Google Business and local SEO so nearby customers find them first.",
			outcome: "Within three months the site ranked on page one for their core local terms and the team was fielding a steady stream of qualified call-out requests."
		},
		metrics: [
			{
				prefix: "+",
				value: 140,
				suffix: "%",
				label: "more enquiries in 3 months"
			},
			{
				value: 1,
				suffix: "st",
				label: "page Google for core terms"
			},
			{
				value: 24,
				suffix: "/7",
				label: "quote form capture"
			}
		]
	},
	{
		slug: "cape-coffee-co",
		title: "Cape Coffee Co.",
		category: "Brand & Website",
		year: "2026",
		summary: "A brand and storefront site for a growing Cape Town roastery.",
		heroImage: "/portfolio/cape-coffee-co/hero.svg",
		gallery: SHOTS,
		tags: [
			"Branding",
			"Web Design",
			"Photography"
		],
		liveUrl: "https://example.com",
		featured: true,
		caseStudy: {
			challenge: "Great coffee, forgettable brand. Cape Coffee looked like every other roastery online and could not justify their premium price on the shelf or the screen.",
			approach: "We built a distinctive visual identity — logo, palette and type — then carried it into a site that tells their sourcing story and makes the beans easy to browse.",
			outcome: "A coherent brand that finally matches the product, with a site that lifted average order value and wholesale enquiries."
		},
		metrics: [
			{
				prefix: "+",
				value: 32,
				suffix: "%",
				label: "average order value"
			},
			{
				prefix: "+",
				value: 18,
				suffix: "",
				label: "wholesale enquiries / mo"
			},
			{
				value: 3,
				suffix: "x",
				label: "time on site vs old"
			}
		]
	},
	{
		slug: "summit-legal",
		title: "Summit Legal",
		category: "Website & Lead Capture",
		year: "2025",
		summary: "A credibility-first site that books consultations for a boutique firm.",
		heroImage: "/portfolio/summit-legal/hero.svg",
		gallery: SHOTS,
		tags: [
			"Web Design",
			"Lead Capture",
			"Copywriting"
		],
		featured: false,
		caseStudy: {
			challenge: "A respected firm with a website that undersold them. Prospective clients could not tell what the firm specialised in or how to start a conversation.",
			approach: "We restructured the site around their practice areas, sharpened the copy to speak to client problems, and added a consultation request flow with clear next steps.",
			outcome: "A site that reads as senior and trustworthy, with consultation requests arriving pre-qualified and ready to book."
		},
		metrics: [
			{
				prefix: "+",
				value: 90,
				suffix: "%",
				label: "consultation requests"
			},
			{
				value: 2,
				suffix: "x",
				label: "qualified leads"
			},
			{
				value: 40,
				suffix: "%",
				label: "less admin back-and-forth"
			}
		]
	},
	{
		slug: "tasklane-app",
		title: "TaskLane",
		category: "Mobile App",
		year: "2025",
		summary: "A field-service app that keeps technicians and the office in sync.",
		heroImage: "/portfolio/tasklane-app/hero.svg",
		gallery: SHOTS,
		tags: [
			"iOS",
			"Android",
			"Product Design"
		],
		liveUrl: "https://example.com",
		featured: true,
		caseStudy: {
			challenge: "Jobs were tracked on paper and WhatsApp. Technicians double-booked, the office chased updates, and nothing was searchable after the fact.",
			approach: "We designed and built a cross-platform app: technicians see their day, update job status on the move, and the office gets a live view without phoning around.",
			outcome: "A single source of truth for every job, fewer missed appointments, and an office that finally trusts the schedule."
		},
		metrics: [
			{
				value: 60,
				suffix: "%",
				label: "fewer missed jobs"
			},
			{
				value: 4,
				suffix: "hrs",
				label: "admin saved / week"
			},
			{
				prefix: "+",
				value: 25,
				suffix: "%",
				label: "jobs completed / day"
			}
		]
	}
];
var getProject = (slug) => projects.find((p) => p.slug === slug);
var formatMetric = (m) => `${m.prefix ?? ""}${m.value}${m.suffix ?? ""}`;
//#endregion
export { getProject as n, projects as r, formatMetric as t };
