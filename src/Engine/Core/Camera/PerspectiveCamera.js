import * as glmatrix from 'gl-matrix';
import {GLMath} from '../../Math/GLMath';
import {Vec3} from '../../Math/Vec3';

class PerspectiveCamera {
	constructor({near = 1, far = 1000, aspect = 0, fov = 45} = {}) {
		this._near = near;
		this._far = far;
		this._aspect = aspect;
		this._fov = GLMath.degToRad(fov);

		this.projectionMatrix = glmatrix.mat4.create();
		this.cameraMatrix = glmatrix.mat4.create();
		this.viewMatrix = glmatrix.mat4.create();
		this.viewProjectionMatrix = glmatrix.mat4.create();

		this._updateProjectionMatrix();

		const that = this;
		const positionAndTargetHandler = {
			set(obj, prop, value)  {
				obj[prop] = value;

				glmatrix.mat4.targetTo(that.cameraMatrix, that.position.asArray(), that.target.asArray(), [0, 1, 0]);
				that._updateCameraMatrix();

				return true;
			}
		};

		this.target = new Proxy(new Vec3(), positionAndTargetHandler);
		this.position = new Proxy(new Vec3(), positionAndTargetHandler);
	}

	get near() {
		return this._near;
	}

	set near(near) {
		this._near = near;
		this._updateProjectionAndCamera();
	}

	get far() {
		return this._far;
	}

	set far(far) {
		this._far = far;
		this._updateProjectionAndCamera();
	}

	get fov() {
		return this._fov;
	}

	set fov(fov) {
		this._fov = GLMath.degToRad(fov);
		this._updateProjectionAndCamera();
	}

	get aspect() {
		return this._aspect;
	}

	set aspect(aspect) {
		this._aspect = aspect;

		this._updateProjectionMatrix();
		this._updateCameraMatrix();
	}


	_updateProjectionAndCamera() {
		this._updateProjectionMatrix();
		this._updateCameraMatrix();
	}

	_updateProjectionMatrix() {
		glmatrix.mat4.perspective(this.projectionMatrix, this._fov, this._aspect, this._near, this._far);
	}

	_updateCameraMatrix() {
		glmatrix.mat4.invert(this.viewMatrix, this.cameraMatrix);
		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}
}
export {PerspectiveCamera};
