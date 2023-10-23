/** @type {import('vite').UserConfig} */
import glsl from "vite-plugin-glsl";

export default {
	plugins: [
		glsl({
			compress: false,
		}),
	],
};
