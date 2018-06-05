import * as glmatrix from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';

class OrthographicCamera {
	constructor({left = 0, right = 0, top = 0, bottom = 0, near = 1, far = 1000 } = {}) {
		this._zNear = near;
		this._zFar = far;
		this._left = left;
		this._right = right;
		this._bottom = bottom;
		this._top = top;

		this._cameraPosition = GLMath.createVec3();
		this._cameraTarget = GLMath.createVec3();

		this.viewMatrix = glmatrix.mat4.create();
		this.cameraMatrix = glmatrix.mat4.create();
		this.projectionMatrix = glmatrix.mat4.create();
		this.viewProjectionMatrix = glmatrix.mat4.create();


		this._updateProjectionAndCamera();
	}

	get zNear() {
		return this._zNear;
	}

	get zFar() {
		return this._zFar;
	}

	set zNear(near) {
		this._zNear = near;
		this._updateProjectionAndCamera();
	}

	set zFar(far) {
		this._zFar = far;
		this._updateProjectionAndCamera();
	}

	get position() {
		return this._cameraPosition;
	}

	set position(position) {
		Object.keys(position).forEach((key) => {
			this._cameraPosition[key] = position[key];
		});

		glmatrix.mat4.fromTranslation(this.cameraMatrix, this._cameraPosition.asArray());
		this._updateProjectionMatrix();
	}

	get target() {
		return this._cameraTarget;
	}

	set target (target) {
		if (Array.isArray(target)) {
			this._cameraTarget.x = target[0];
			this._cameraTarget.y = target[1];
			this._cameraTarget.z = target[2];
		} else {
			Object.keys(target).forEach((key) => {
				this._cameraTarget[key] = target[key];
			});
		}

		glmatrix.mat4.targetTo(this.cameraMatrix, this._cameraPosition.asArray(), this._cameraTarget.asArray(), [0, 1, 0]);

		this._updateProjectionMatrix();
	}


	_updateProjectionAndCamera() {
		this._updateOrthographicMatrix();
		this._updateProjectionMatrix();
	}

	_updateOrthographicMatrix() {
		glmatrix.mat4.ortho(this.projectionMatrix,
			this._left,
			this._right,
			this._bottom,
			this._top,
			this._zNear, this._zFar);
	}

	_updateProjectionMatrix() {
		glmatrix.mat4.invert(this.viewMatrix, this.cameraMatrix);
		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}
}
export {OrthographicCamera};
