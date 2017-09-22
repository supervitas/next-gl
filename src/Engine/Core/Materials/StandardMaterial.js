import {Color} from '../Color';
import fragmentShader from './shaders/Standard.frag';
import vertexShader from './shaders/Standard.vert';

class StandardMaterial {
	constructor({color = new Color(255, 255, 255, 1), map = null, gl}) {
		this.gl = gl;
		this.glContext = gl.glContext;
		this.defines = new Map();

		if (map !== null) {
			this.defines.set('USE_MAP', true);
			this.map = map;
		}

		this.program = this.gl.initProgram(vertexShader, fragmentShader, this.defines);


		this.depthTest = true;
		this.color = color.toVec4();
	}
}
export {StandardMaterial};
