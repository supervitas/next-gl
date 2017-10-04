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
		this._scale = new Vec3(1, 1, 1);

		this.modelMatrix = glmatrix.mat4.create();
		this.normalMatrix = glmatrix.mat4.create();

		this.vertexCount = 0;
		this.type = this.glContext.UNSIGNED_SHORT;
		this.offset = 0;
	}

	set position(positionVec) {
		Object.keys(positionVec).forEach((key) => {
			this._position[key] = positionVec[key];
		});

		glmatrix.mat4.translate(this.modelMatrix, this.modelMatrix, this._position.asArray());

		this.updateMatrices();
	}

	get position() {
		return this._position;
	}

	set scale(scale) {
		Object.keys(scale).forEach((key) => {
			this._scale[key] = scale[key];
		});

		glmatrix.mat4.scale(this.modelMatrix, this.modelMatrix, this._scale.asArray());

		this.updateMatrices();
	}

	get scale() {
		return this._scale;
	}

	rotate(vecRotateAxis, angle) {
		Object.keys(vecRotateAxis).forEach((key) => {
			this._rotationAxis[key] = vecRotateAxis[key];
		});

		glmatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, angle, this._rotationAxis.asArray());

		this.updateMatrices();
	}

	updateMatrices() {
		this._updateNormalMatrix();
	}

	_updateNormalMatrix() {
		glmatrix.mat4.invert(this.normalMatrix, this.modelMatrix);
		glmatrix.mat4.transpose(this.normalMatrix, this.normalMatrix);
	}

}
export {SceneObject};
