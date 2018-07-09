
import fragmentShader from './shaders/Depth.frag';
import vertexShader from './shaders/Depth.vert';
import twgl from 'twgl-base.js';

class DepthMaterial {
	constructor() {
		this.defines = new Map();
		this.uniforms = {};

		this.depthTest = true;
		this.isDoubleSided = false;
		this.programInfo = null;
	}

	createMaterial(gl) {
		if (this.programInfo) return;
		const program = gl.initProgram(vertexShader, fragmentShader, this.defines);
		this.programInfo = twgl.createProgramInfoFromProgram(gl.context, program);
	}
}
export {DepthMaterial};
