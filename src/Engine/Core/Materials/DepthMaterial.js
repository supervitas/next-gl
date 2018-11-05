
import fragmentShader from './shaders/Depth.frag';
import vertexShader from './shaders/Depth.vert';
import twgl from 'twgl-base.js';
import {BasicMaterial} from "./BasicMaterial";

class DepthMaterial extends BasicMaterial {
	constructor() {
		super({useDepthTest: true, isDoubleSided: true, vertexShader, fragmentShader});
	}
}
export {DepthMaterial};
