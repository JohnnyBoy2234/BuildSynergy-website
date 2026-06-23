
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/analytics" | "/api/chat" | "/api/greeting" | "/api/lead" | "/portfolio" | "/portfolio/[slug]" | "/privacy-policy" | "/terms";
		RouteParams(): {
			"/portfolio/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string | undefined };
			"/api": Record<string, never>;
			"/api/analytics": Record<string, never>;
			"/api/chat": Record<string, never>;
			"/api/greeting": Record<string, never>;
			"/api/lead": Record<string, never>;
			"/portfolio": { slug?: string | undefined };
			"/portfolio/[slug]": { slug: string };
			"/privacy-policy": Record<string, never>;
			"/terms": Record<string, never>
		};
		Pathname(): "/" | "/api/analytics" | "/api/chat" | "/api/chat/" | "/api/greeting" | "/api/lead" | "/portfolio" | `/portfolio/${string}` & {} | "/privacy-policy" | "/terms";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/Abstract_cinematic_3D_background_for_202606041953.jpeg" | "/apple-touch-icon.png" | "/Desk_with_laptop_and_smartphone_202606042015.mp4" | "/favicon.ico" | "/favicon.svg" | "/logo.png" | "/mzanzihomes-preview.png" | "/og-image.png" | "/portfolio/cape-coffee-co/hero.svg" | "/portfolio/northwind-plumbing/hero.svg" | "/portfolio/placeholders/shot-1.svg" | "/portfolio/placeholders/shot-2.svg" | "/portfolio/summit-legal/hero.svg" | "/portfolio/tasklane-app/hero.svg" | "/rag-vectors.json" | "/robots.txt" | "/site.webmanifest" | "/sitemap.xml" | "/web-app-manifest-192x192.png" | "/web-app-manifest-512x512.png" | string & {};
	}
}