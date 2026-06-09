

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.6mnZAdTG.js","_app/immutable/chunks/Dc4lVywf.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/BuN-E9BA.js"];
export const stylesheets = ["_app/immutable/assets/2.KpycjyC5.css"];
export const fonts = [];
