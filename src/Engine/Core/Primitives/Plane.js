import {SceneObject} from '../SceneObject';
import {StandardMaterial} from '../Materials/StandardMaterial';

class Plane extends SceneObject {
	constructor({material = new StandardMaterial()}) {
		super({material});

		const positions = Plane._getPosition();
		const vertexNormals = Plane._getVertexNormals();
		const uv = Plane._getUV();
		const indices = Plane._getIndices();

		this.attributes = {
			aVertexPosition: { numComponents: 3, data: positions },
			aTextureCoord: { numComponents: 2, data: uv},
			aVertexNormal:   { numComponents: 3, data: vertexNormals},
			indices:  { numComponents: 3, data: indices},
		};

		this.bufferInfo = null;
		this.vao = null;
	}

	static _getIndices() {
		return [
			0,  1,  2,      0,  2,  3,
		];
	}
	static _getUV() {
		return [
			0.0,  0.0,
			1.0,  0.0,
			1.0,  1.0,
			0.0,  1.0,
		];
	}
	static _getVertexNormals() {
		return [
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
			0.0, 1.0,  0.0,
		];
	}

	static _getPosition() {
		return [
			-1.0, 0.0, -1.0,
			-1.0, 0.0, 1.0,
			1.0, 0.0,  1.0,
			1.0, 0.0, -1.0,
		];
	}
}
export {Plane};
