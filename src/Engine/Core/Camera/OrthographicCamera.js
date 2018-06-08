import * as glmatrix from 'gl-matrix';
import {Vec3} from '../../Math/GLMath';

class OrthographicCamera {
	constructor({left = 0, right = 0, top = 0, bottom = 0, near = 1, far = 1000 } = {}) {
		this._near = near;
		this._far = far;
		this._left = left;
		this._right = right;
		this._bottom = bottom;
		this._top = top;

		this.viewMatrix = glmatrix.mat4.create();
		this.cameraMatrix = glmatrix.mat4.create();
		this.projectionMatrix = glmatrix.mat4.create();
		this.viewProjectionMatrix = glmatrix.mat4.create();

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


		this._updateProjectionAndCamera();
	}

	get near() {
		return this._near;
	}

	get far() {
		return this._far;
	}

	set near(near) {
		this._near = near;
		this._updateProjectionAndCamera();
	}

	set far(far) {
		this._far = far;
		this._updateProjectionAndCamera();
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
			this.near, this.far);
	}

	_updateProjectionMatrix() {
		glmatrix.mat4.invert(this.viewMatrix, this.cameraMatrix);
		glmatrix.mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}
}
export {OrthographicCamera};
