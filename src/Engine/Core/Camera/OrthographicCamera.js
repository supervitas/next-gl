import * as glmatrix from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';

class OrthographicCamera {
	constructor({near = 1, far = 1000, aspect = 0} = {}) {
		this._zNear = near;
		this._zFar = far;
		this._aspect = aspect;


		this._cameraPosition = GLMath.createVec3();
		this._rotationAxis = GLMath.createVec3();

		this.viewProjectionMatrix = glmatrix.mat4.create();
		this._updateProjectionMatrix();
	}

	set zNear(near) {
		this._zNear = near;
		// this._updateProjectionAndCamera();
	}

	set zFar(far) {
		this._zFar = far;
		// this._updateProjectionAndCamera();
	}

	get position() {
		return this._cameraPosition;
	}

	set position(position) {
		if (Array.isArray(position)) {
			this._cameraPosition.x = position[0];
			this._cameraPosition.y = position[1];
			this._cameraPosition.z = position[2];
		} else {
			Object.keys(position).forEach((key) => {
				this._cameraPosition[key] = position[key];
			});
		}
		this._updateProjectionMatrix();
	}

	_updateProjectionMatrix() {
		const frustumSize = 1;

		glmatrix.mat4.ortho(this.viewProjectionMatrix, frustumSize * this._aspect / - 2, frustumSize * this._aspect / 2,
			frustumSize / 2, frustumSize / - 2, this._zNear, this._zFar);
	}
}
export {OrthographicCamera};
