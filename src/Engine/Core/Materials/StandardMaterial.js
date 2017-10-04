import {Color} from '../Color';
import fragmentShader from './shaders/Standard.frag';
import vertexShader from './shaders/Standard.vert';

class StandardMaterial {
	constructor({color = new Color(255, 255, 255, 1), map = null}) {
		this.defines = new Map();

		if (map !== null) {
			this.defines.set('USE_MAP', true);
			this.map = map;
		}
		this.depthTest = true;
		this.color = color.toVec4();
		this.program = null;
	}
	createMaterial(gl) {
		this.program = gl.initProgram(vertexShader, fragmentShader, this.defines);
		return this.program;
	}
}
export {StandardMaterial};
