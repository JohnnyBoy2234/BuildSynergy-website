export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["Abstract_cinematic_3D_background_for_202606041953.jpeg","Desk_with_laptop_and_smartphone_202606042015.mp4"]),
	mimeTypes: {".jpeg":"image/jpeg",".mp4":"video/mp4"},
	_: {
		client: {start:"_app/immutable/entry/start.CHd7TGM1.js",app:"_app/immutable/entry/app.DXmq8Bfp.js",imports:["_app/immutable/entry/start.CHd7TGM1.js","_app/immutable/chunks/DvJ7b5OA.js","_app/immutable/chunks/CtekTd8F.js","_app/immutable/entry/app.DXmq8Bfp.js","_app/immutable/chunks/CtekTd8F.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
