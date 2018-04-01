import {SceneObject} from '../SceneObject';
import {StandardMaterial} from '../Materials/StandardMaterial';

class Plane extends SceneObject {
	constructor({material = new StandardMaterial()}) {
		super({material});

		this.attributes = {
			aVertexPosition: { numComponents: 3, data: Plane.vertexPositions },
			aTextureCoord: { numComponents: 2, data: Plane.uv},
			aVertexNormal:   { numComponents: 3, data: Plane.vertexNormals},
			indices:  { numComponents: 3, data: Plane.indices},
		};

		this.bufferInfo = null;
		this.vao = null;
	}

	static get indices() {
		return [
			0,  1,  2,      0,  2,  3,
		];
	}
	static get uv() {
		return [
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
		];
	}
	static get vertexNormals() {
		return [
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
		];
	}

	static get vertexPositions() {
		return [
			-1.0, 0.0, -1.0,
			-1.0, 0.0, 1.0,
			1.0, 0.0,  1.0,
			1.0, 0.0, -1.0,
		];
	}
}
export {Plane};
