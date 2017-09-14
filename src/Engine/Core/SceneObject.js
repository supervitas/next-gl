import * as glmatrix from 'gl-matrix';
import {Vec3} from '../Math/Vec3';

class SceneObject {
	constructor(gl) {
		this.programInfo = {};
		this.program = null;
		this.vao = null;
		this.gl = gl;
		this.glContext = gl.glContext;

		this.visible = true;
		this._position = new Vec3();
		this._rotation = new Vec3();

		this.modelViewMatrix = glmatrix.mat4.create();

		this.positionMatrix = glmatrix.mat4.translate(this.modelViewMatrix,
			this.modelViewMatrix, this._position.asArray());

		this.rotateionMatrix = glmatrix.mat4.rotate(this.modelViewMatrix,
			this.modelViewMatrix,
			0,     // amount to rotate in radians
			this._rotation.asArray());
	}

	set position(positionVec) {
		Object.keys(positionVec).forEach((key) => {
			this._position[key] = positionVec[key];
		});

		this.positionMatrix = glmatrix.mat4.translate(this.modelViewMatrix,
			this.modelViewMatrix, this._position.asArray());
	}

	get position() {
		return this._position;
	}

	set rotation(rotationVec) {
		Object.keys(rotationVec).forEach((key) => {
			this._position[key] = rotationVec[key];
		});

		this.rotateionMatrix = glmatrix.mat4.rotate(this.modelViewMatrix,
			this.modelViewMatrix,
			0,     // amount to rotate in radians
			this._rotation.asArray());
	}

	get rotation() {
		return this._rotation;
	}

}
export {SceneObject};
