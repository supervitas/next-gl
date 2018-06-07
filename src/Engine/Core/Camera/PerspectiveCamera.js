import * as glmatrix from 'gl-matrix';
import {Vec3, GLMath} from '../../Math/GLMath';

class PerspectiveCamera {
	constructor({near = 1, far = 1000, aspect = 0, fov = 45} = {}) {

		this._zNear = near;
		this._zFar = far;
		this._aspect = aspect;

		const that = this;

		this._fov = GLMath.degToRad(fov);


		this.projectionMatrix = glmatrix.mat4.create();
		this.cameraMatrix = glmatrix.mat4.create();
		this.viewMatrix = glmatrix.mat4.create();
		this.viewProjectionMatrix = glmatrix.mat4.create();

		this._updateProjectionMatrix();

		this.target = new Proxy(new Vec3(), {
			set(obj, prop, value) {
				obj[prop] = value;

				glmatrix.mat4.targetTo(that.cameraMatrix, that.position.asArray(), that.target.asArray(), [0, 1, 0]);
				that._updateCameraMatrix();

				return true;
			}
		});

		this.position = new Proxy(new Vec3(), {
			set(obj, prop, value) {
				obj[prop] = value;

				glmatrix.mat4.fromTranslation(that.cameraMatrix, that.position.asArray());
				that._updateCameraMatrix();

				return true;
			}
		});

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
export {PerspectiveCamera};
