import {Color} from '../Color';
import fragmentShader from './shaders/Standard.frag';
import vertexShader from './shaders/Standard.vert';
import twgl from 'twgl-base.js';

class StandardMaterial {
	constructor({color = new Color(), map = null, isDoubleSided = false, useDepthTest = true, opacity = 1} = {}) {
		this.defines = new Map();
		this.uniforms = {};

		this.depthTest = useDepthTest;
		this.isDoubleSided = isDoubleSided;
		this.color = color.toRGB();
		this.programInfo = null;

		this.opacity = opacity;
		this.uniforms.opacity = this.opacity;

		if (map) {
			this.defines.set('USE_MAP', true);
			this.map = map;
			this.uniforms.map = this.map;
		}

		this.uniforms.uColor = [
			this.color.r,
			this.color.g,
			this.color.b
		];
	}

	createMaterial(gl) {
		if (this.programInfo) return;

		const program = gl.initProgram(vertexShader, fragmentShader, this.defines);
		this.programInfo = twgl.createProgramInfoFromProgram(gl.context, program);
	}
}
export {StandardMaterial};
