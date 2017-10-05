import {SceneObject} from '../SceneObject';
import {StandardMaterial} from '../Materials/StandardMaterial';

class Plane extends SceneObject {
	constructor({material = new StandardMaterial()}) {
		super({material});
		
		this.programInfo = null;
		
		const positions = this._getPosition();
		const vertexNormals = this._getVertexNormals();
		const uv = this._getUV();
		const indices = this._getIndices();
		
		this.attributes = {
			aVertexPosition: { numComponents: 3, data: positions },
			aTextureCoord: { numComponents: 2, data: uv},
			aVertexNormal:   { numComponents: 3, data: vertexNormals},
			indices:  { numComponents: 3, data: indices},
		};
		
		this.uniforms = {
			uNormalMatrix : null,
			uModelViewMatrix: null,
			uColor: null,
			map: null,
		};
		
		this.bufferInfo = null;
		this.vao = null;
	}

	_getIndices() {
		return [
			0,  1,  2,      0,  2,  3,
		];
	}
	_getUV() {
		return [									
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
		];
	}
	_getVertexNormals() {
		return [
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,			
		];
	}

	_getPosition() {
		return [
			-1.0, 0.0, -1.0,
			-1.0, 0.0, 1.0,
			1.0, 0.0,  1.0,
			1.0, 0.0, -1.0,
		];
	}
}
export {Plane};