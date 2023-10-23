import "./style.css";

import { Curtains, Plane, RenderTarget, ShaderPass } from "curtainsjs";
import { TextTexture } from "https://gistcdn.githack.com/martinlaxenaire/549b3b01ff4bd9d29ce957edd8b56f16/raw/2f111abf99c8dc63499e894af080c198755d1b7a/TextTexture.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import scrollFragmentShader from "./shaders/scrollFragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";

window.addEventListener("load", () => {
	// create curtains instance
	const curtains = new Curtains({
		container: "canvas",
		pixelRatio: Math.min(1.5, window.devicePixelRatio),
	});

	// track scroll values
	const scroll = {
		value: 0,
		lastValue: 0,
		effect: 0,
	};

	// on success
	curtains.onSuccess(() => {
		const fonts = {
			list: ["normal 400 1.4em Space Grotesk, sans-serif", "normal 700 1.2em Space Grotesk, sans-serif"],
			loaded: 0,
		};

		// load the fonts first
		fonts.list.forEach((font) => {
			document.fonts.load(font).then(() => {
				fonts.loaded++;

				if (fonts.loaded === fonts.list.length) {
					// create our shader pass
					const scrollPass = new ShaderPass(curtains, {
						fragmentShader: scrollFragmentShader,
						depth: false,
						uniforms: {
							scrollEffect: {
								name: "uScrollEffect",
								type: "1f",
								value: scroll.effect,
							},
							scrollStrength: {
								name: "uScrollStrength",
								type: "1f",
								value: 2.5,
							},
						},
					});

					// calculate the lerped scroll effect
					scrollPass.onRender(() => {
						scroll.lastValue = scroll.value;
						scroll.value = curtains.getScrollValues().y;

						// clamp delta
						scroll.delta = Math.max(-30, Math.min(30, scroll.lastValue - scroll.value));

						scroll.effect = curtains.lerp(scroll.effect, scroll.delta, 0.05);
						scrollPass.uniforms.scrollEffect.value = scroll.effect;
					});

					// create our text planes
					const textEls = document.querySelectorAll(".text-plane");
					textEls.forEach((textEl) => {
						const textPlane = new Plane(curtains, textEl, {
							vertexShader: vertexShader,
							fragmentShader: fragmentShader,
						});

						// create the text texture and... that's it!
						const textTexture = new TextTexture({
							plane: textPlane,
							textElement: textPlane.htmlElement,
							sampler: "uTexture",
							resolution: 1.2,
							skipFontLoading: true, // we've already loaded the fonts
						});
					});
				}
			});
		});
	});
});
