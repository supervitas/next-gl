import twgl from 'twgl-base.js';
import chunks from './chunks/chunks';


const includeRegExp = /#include ?<(.*)>/g;

class BasicMaterial {
	constructor({useDepthTest, isDoubleSided, vertexShader, fragmentShader}) {
		this.defines = new Map();
		this.uniforms = {};

		this.vertexShader = vertexShader;
		this.fragmentShader = fragmentShader;

		this.depthTest = useDepthTest;
		this.isDoubleSided = isDoubleSided;
		this.programInfo = null;
	}

	createMaterial(gl) {

		this._includeChunks();

		const program = gl.initProgram(this.vertexShader, this.fragmentShader, this.defines);
		this.programInfo = twgl.createProgramInfoFromProgram(gl.context, program);

	}

	_includeChunks() {
		const vertexIncludes = this.vertexShader.match(includeRegExp) || [];
		const fragmentIncludes = this.fragmentShader.match(includeRegExp) || [];

		for (const include of vertexIncludes.concat(fragmentIncludes)) {
			const chunkName = include.match(/<(.*)>/)[1];
			this.fragmentShader = this.fragmentShader.replace(include, chunks[chunkName]);
		}

	}
}

export {BasicMaterial};
