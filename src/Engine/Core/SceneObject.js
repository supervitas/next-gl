import * as glmatrix from 'gl-matrix';
import {Vec3} from '../Math/Vec3';

class SceneObject {
	constructor({gl, material = null}) {
		this.vao = null;

		this.gl = gl;
		this.glContext = gl.glContext;

		this.material = material;
		this.program = material.program;

		this.visible = true;
		this.frustrumCulled = true;

		this._position = new Vec3();
		this._rotationAxis = new Vec3();

		this.modelViewMatrix = glmatrix.mat4.create();

		this.vertexCount = 0;
		this.type = this.glContext.UNSIGNED_SHORT;
		this.offset = 0;

	}

	set position(positionVec) {
		Object.keys(positionVec).forEach((key) => {
			this._position[key] = positionVec[key];
		});

		glmatrix.mat4.translate(this.modelViewMatrix,
			this.modelViewMatrix, this._position.asArray());
	}

	get position() {
		return this._position;
	}

	rotate(vecRotateAxis, angle) {
		Object.keys(vecRotateAxis).forEach((key) => {
			this._rotationAxis[key] = vecRotateAxis[key];
		});

		glmatrix.mat4.rotate(this.modelViewMatrix,
			this.modelViewMatrix, angle, this._rotationAxis.asArray());

	}

}
export {SceneObject};
