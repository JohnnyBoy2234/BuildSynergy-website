import { n as getProject } from "../../../../chunks/portfolio.js";
import { error } from "@sveltejs/kit";
//#region src/routes/portfolio/[slug]/+page.ts
var load = ({ params }) => {
	const project = getProject(params.slug);
	if (!project) throw error(404, "Project not found");
	return { project };
};
//#endregion
export { load };
