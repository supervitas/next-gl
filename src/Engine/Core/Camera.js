import * as glmatrix from 'gl-matrix';
import {GLMath} from '../Math/GLMath';

class Camera {
	constructor({near = 0.1, far = 1000, aspect = 0, fov = 45}) {

		this._zNear = near;
		this._zFar = far;
		this._aspect = aspect;


		this._fov = GLMath.degToRad(fov);

		const radius = 200;

		this.projectionMatrix = glmatrix.mat4.create();

		this._updateMatrix();

		// this.cameraMatrix =
	}

	set zNear(near) {
		this._zNear = near;
		this._updateMatrix();
	}

	set zFar(far) {
		this._zFar = far;
		this._updateMatrix();
	}

	set fov(fov) {
		this._fov = fov;
		this._updateMatrix();
	}

	set aspect(aspect) {
		this._aspect = aspect;
		this._updateMatrix();
	}

	_updateMatrix() {
		glmatrix.mat4.perspective(this.projectionMatrix, this._fov, this._aspect, this._zNear, this._zFar);
	}


}
export {Camera};
