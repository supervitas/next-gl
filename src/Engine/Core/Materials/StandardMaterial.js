import {Color} from '../Color';
import fragmentShader from './shaders/Standard.frag';
import vertexShader from './shaders/Standard.vert';
import twgl from 'twgl-base.js';

class StandardMaterial {
	constructor({color = new Color(), map = null, isDoubleSided = false, useDepthTest = true}) {
		this.defines = new Map();

		if (map) {
			this.defines.set('USE_MAP', true);
			this.map = map;
		}
		this.depthTest = useDepthTest;
		this.isDoubleSided = isDoubleSided;
		this.color = color.toRGB();
		this.programInfo = null;
		this.uniforms = {};
	}

	createMaterial(gl) {
		if (this.programInfo)  return;

		if (this.map) {
			this.map = gl.loadTexture(this.map);
			this.uniforms.map = this.map;
		}
		this.uniforms.uColor = [
			this.color.r,
			this.color.g,
			this.color.b
		];

		const program = gl.initProgram(vertexShader, fragmentShader, this.defines);

		this.programInfo = twgl.createProgramInfoFromProgram(gl.glContext, program);
	}
}
export {StandardMaterial};
