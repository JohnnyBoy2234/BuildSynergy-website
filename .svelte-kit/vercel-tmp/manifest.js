export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Abstract_cinematic_3D_background_for_202606041953.jpeg","apple-touch-icon.png","Desk_with_laptop_and_smartphone_202606042015.mp4","favicon.ico","favicon.svg","logo.png","mzanzihomes-preview.png","og-image.png","portfolio/cape-coffee-co/hero.svg","portfolio/northwind-plumbing/hero.svg","portfolio/placeholders/shot-1.svg","portfolio/placeholders/shot-2.svg","portfolio/summit-legal/hero.svg","portfolio/tasklane-app/hero.svg","rag-vectors.json","robots.txt","site.webmanifest","sitemap.xml","web-app-manifest-192x192.png","web-app-manifest-512x512.png"]),
	mimeTypes: {".jpeg":"image/jpeg",".png":"image/png",".mp4":"video/mp4",".svg":"image/svg+xml",".json":"application/json",".txt":"text/plain",".webmanifest":"application/manifest+json",".xml":"text/xml"},
	_: {
		client: {start:"_app/immutable/entry/start.F75ZhIkk.js",app:"_app/immutable/entry/app.BB4s2c1t.js",imports:["_app/immutable/entry/start.F75ZhIkk.js","_app/immutable/chunks/DtaVgLi7.js","_app/immutable/chunks/BGORYzBX.js","_app/immutable/entry/app.BB4s2c1t.js","_app/immutable/chunks/BGORYzBX.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/portfolio","/privacy-policy","/terms","/portfolio/northwind-plumbing","/portfolio/cape-coffee-co","/portfolio/summit-legal","/portfolio/tasklane-app"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
