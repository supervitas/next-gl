import * as glmatrix from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';

class Camera {
	constructor({near = 1, far = 1000, aspect = 0, fov = 45} = {}) {

		this._zNear = near;
		this._zFar = far;
		this._aspect = aspect;

		this._cameraTarget = GLMath.createVec3();
		this._cameraPosition = GLMath.createVec3();
		this._rotationAxis = GLMath.createVec3();

		this._fov = GLMath.degToRad(fov);

		this.projectionMatrix = glmatrix.mat4.create();

		this._updateProjectionMatrix();

		this.cameraMatrix = glmatrix.mat4.create();

		this.viewMatrix = glmatrix.mat4.create();

		this.viewProjectionMatrix = glmatrix.mat4.create();
	}

	set zNear(near) {
		this._zNear = near;
		this._updateProjectionAndCamera();
	}

	set zFar(far) {
		this._zFar = far;
		this._updateProjectionAndCamera();
	}

	set fov(fov) {
		this._fov = fov;
		this._updateProjectionAndCamera();
	}

	set aspect(aspect) {
		this._aspect = aspect;
		this._updateProjectionAndCamera();
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

		glmatrix.mat4.translate(this.cameraMatrix, this.cameraMatrix, this._cameraPosition.asArray());
		this._updateCameraMatrix();
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

		this._updateCameraMatrix();
	}

	_updateProjectionAndCamera() {
		this._updateProjectionMatrix();
		this._updateCameraMatrix();
	}

	_updateProjectionMatrix() {
		glmatrix.mat4.perspective(this.projectionMatrix, this._fov, this._aspect, this._zNear, this._zFar);
	}

	_updateCameraMatrix() {
		glmatrix.mat4.invert(this.viewMatrix, this.cameraMatrix);
		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}
}
export {Camera};
