import {Color} from '../Color';
import fragmentShader from './shaders/Standard.frag';
import vertexShader from './shaders/Standard.vert';
import twgl from 'twgl-base.js';
import {BasicMaterial} from "./BasicMaterial";

class StandardMaterial extends BasicMaterial {
	constructor({color = new Color(), map = null, isDoubleSided = false, useDepthTest = true, opacity = 1} = {}) {
		super({isDoubleSided, useDepthTest, vertexShader, fragmentShader});
		this.color = color.toRGB();

		this.opacity = opacity;
		this.transparent = opacity < 1;
		this.uniforms.opacity = this.opacity;

		if (map) {
			this.defines.set('USE_MAP', true);
			this.map = map;
			this.uniforms.map = this.map;
		}

		this.depthMap = map;
		this.uniforms.depthMap = map;

		this.uniforms.uColor = [
			this.color.r,
			this.color.g,
			this.color.b
		];
	}
}

export {StandardMaterial};
